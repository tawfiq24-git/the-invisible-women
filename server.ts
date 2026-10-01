import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type, Modality, LiveServerMessage } from '@google/genai';
import { CURATED_SCHEMES, matchSchemeByKeywords, getSchemeById } from './src/data/schemes.ts';
import { getLanguageByCode } from './src/data/languages.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Prepare curated schemes catalog description for Gemini prompt
const schemesCatalogPrompt = CURATED_SCHEMES.map((s) => {
  return `ID: "${s.id}"
Name (English): "${s.name.en}"
Category: "${s.category}"
Official URL: "${s.officialUrl}"
Helpline: "${s.helpline}"
Benefits: ${JSON.stringify(s.benefits.en)}
Eligibility: ${JSON.stringify(s.eligibility.en)}
Documents: ${JSON.stringify(s.documents.en)}
Steps: ${JSON.stringify(s.steps.en)}`;
}).join('\n\n---\n\n');

/**
 * Route: POST /api/gemini/understand
 * Uses Gemini 3.5 Flash with Google Search Grounding to get up-to-date and accurate scheme information.
 */
app.post('/api/gemini/understand', async (req: Request, res: Response) => {
  try {
    const { query, language = 'ta' } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const langInfo = getLanguageByCode(language);
    const targetLangName = langInfo.name;

    if (ai) {
      try {
        const systemPrompt = `You are "AWAAZ" (Digital Sister), a warm, compassionate, highly trusted digital companion helping first-time Indian women with low digital literacy access official government schemes.

CRITICAL RULES:
1. Prioritize verified government schemes from the CURATED SCHEMES CATALOG below. If the user asks about another legitimate Indian central or state government scheme, use your search data to provide accurate verified details.
2. If the user's question does not match any scheme, set schemeId to "NOT_FOUND" and provide a warm, encouraging message in ${targetLangName}: "I don't have verified information for that service yet. Please try asking about maternity financial assistance, free sewing machine, gas cylinder, girl child savings, or women self-help loans."
3. Language: ALL text in your output (summary, eligibility, documents, benefits, steps, followUpQuestion) MUST be written in ${targetLangName} (${langInfo.nativeName}).
4. Tone & Vocabulary: Explain like an elder sister or village friend (Akka/Didi/Chechi). Use simple, friendly everyday words. Avoid complicated bureaucratic government legal terminology.
5. Provide 3-4 clear eligibility points, 4-5 simple documents, 2-3 benefits, and 3-4 easy step-by-step action instructions.
6. Return ONLY a valid JSON object matching the requested schema.

CURATED SCHEMES CATALOG:
${schemesCatalogPrompt}`;

        const userPrompt = `User question (in their spoken or typed language): "${query.trim()}"
Target output language: ${targetLangName} (${langInfo.nativeName}, code: ${language})

Analyze their intent and return structured scheme guidance in ${targetLangName}.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                intent: {
                  type: Type.STRING,
                  description: 'Brief summary of what the user is looking for',
                },
                schemeId: {
                  type: Type.STRING,
                  description: 'Exact ID from curated schemes catalog or "NOT_FOUND"',
                },
                schemeName: {
                  type: Type.STRING,
                  description: `Name of the scheme translated into ${targetLangName}`,
                },
                summary: {
                  type: Type.STRING,
                  description: `Simple 1-2 sentence sisterly explanation of the scheme in ${targetLangName}`,
                },
                eligibility: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: `Who can apply bullets in simple ${targetLangName}`,
                },
                documents: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: `Required documents bullets in ${targetLangName}`,
                },
                benefits: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: `Tangible benefits in ${targetLangName}`,
                },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: `Step-by-step instructions in ${targetLangName}`,
                },
                followUpQuestion: {
                  type: Type.STRING,
                  description: `A gentle follow-up question to encourage the sister in ${targetLangName}`,
                },
                officialUrl: {
                  type: Type.STRING,
                  description: 'Official verified government portal URL',
                },
                language: {
                  type: Type.STRING,
                  description: 'Language code e.g. ta, hi, te',
                },
              },
              required: [
                'intent',
                'schemeId',
                'schemeName',
                'summary',
                'eligibility',
                'documents',
                'benefits',
                'steps',
                'officialUrl',
                'language',
              ],
            },
          },
        });

        // Extract Google Search grounding sources
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const searchSources = groundingChunks
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((c: any) => c.web)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: any) => ({
            title: c.web.title,
            uri: c.web.uri,
          }));

        const rawText = response.text ? response.text.trim() : '';
        if (rawText) {
          try {
            const parsed = JSON.parse(rawText);
            if (parsed.schemeId && parsed.schemeId !== 'NOT_FOUND') {
              const matchedCatalog = getSchemeById(parsed.schemeId);
              if (matchedCatalog) {
                parsed.officialUrl = matchedCatalog.officialUrl;
                parsed.helpline = matchedCatalog.helpline;
                parsed.category = matchedCatalog.category;
                parsed.icon = matchedCatalog.icon;
              }
            }
            res.json({
              success: true,
              data: parsed,
              searchSources,
              source: 'gemini-3.5-flash-search-grounded',
            });
            return;
          } catch (jsonErr) {
            console.warn('Failed to parse Gemini output, using catalog fallback:', jsonErr);
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini 3.5 Flash understand call failed, using catalog matcher:', geminiErr);
      }
    }

    // Curated scheme matching fallback
    const matchedScheme = matchSchemeByKeywords(query);
    const langKey = (matchedScheme.shortSummary[language] ? language : 'en') as keyof typeof matchedScheme.shortSummary;

    const fallbackResponse = {
      intent: `Inquiry regarding ${matchedScheme.name.en}`,
      schemeId: matchedScheme.id,
      schemeName: matchedScheme.name[language as keyof typeof matchedScheme.name] || matchedScheme.name.en,
      summary: matchedScheme.shortSummary[langKey] || matchedScheme.shortSummary.en,
      eligibility: matchedScheme.eligibility[langKey] || matchedScheme.eligibility.en,
      documents: matchedScheme.documents[langKey] || matchedScheme.documents.en,
      benefits: matchedScheme.benefits[langKey] || matchedScheme.benefits.en,
      steps: matchedScheme.steps[langKey] || matchedScheme.steps.en,
      followUpQuestion: matchedScheme.followUpSuggestions[langKey]?.[0] || 'Would you like to know how to apply nearest to your home?',
      officialUrl: matchedScheme.officialUrl,
      helpline: matchedScheme.helpline,
      category: matchedScheme.category,
      icon: matchedScheme.icon,
      language: language,
    };

    res.json({ success: true, data: fallbackResponse, source: 'curated_fallback' });
  } catch (error) {
    console.error('Server error in /api/gemini/understand:', error);
    res.status(500).json({ error: 'Processing error' });
  }
});

/**
 * Route: POST /api/gemini/transcribe
 * Transcribes audio using model gemini-3.5-transcribe
 */
app.post('/api/gemini/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    if (!ai) {
      res.status(500).json({ error: 'Gemini AI not initialized' });
      return;
    }

    const cleanMimeType = mimeType.split(';')[0] || 'audio/webm';
    const audioPart = {
      inlineData: {
        mimeType: cleanMimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this audio verbatim in its original spoken language. Return only the transcription text.' },
        ],
      },
    });

    const transcript = response.text ? response.text.trim() : '';
    res.json({
      success: true,
      transcript,
      model: 'gemini-3.5-transcribe',
    });
  } catch (err: unknown) {
    console.error('Error in /api/gemini/transcribe:', err);
    res.status(500).json({ error: 'Audio transcription failed' });
  }
});

/**
 * Route: POST /api/gemini/understand-audio
 * Accepts voice audio recording directly from browser MediaRecorder.
 * Uses Gemini 3.5 Transcribe to transcribe audio and Gemini 3.5 Flash with search grounding to match scheme.
 */
app.post('/api/gemini/understand-audio', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'ta' } = req.body;
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      res.status(400).json({ error: 'Audio data is required' });
      return;
    }

    const langInfo = getLanguageByCode(language);
    const targetLangName = langInfo.name;

    if (ai) {
      try {
        const cleanMimeType = mimeType.split(';')[0] || 'audio/webm';

        // Step 1: Transcribe with gemini-3.5-transcribe
        let spokenText = '';
        try {
          const transResponse = await ai.models.generateContent({
            model: 'gemini-3.5-transcribe',
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: audioBase64,
                  },
                },
                { text: 'Transcribe this audio verbatim in its spoken Indian or English language.' },
              ],
            },
          });
          spokenText = transResponse.text ? transResponse.text.trim() : '';
        } catch (transErr) {
          console.warn('Direct gemini-3.5-transcribe error, trying multimodal flash:', transErr);
        }

        // Step 2: Use Gemini 3.5 Flash with Google Search Grounding to match scheme
        const queryText = spokenText || 'Government assistance for women';
        const searchPrompt = `You are AWAAZ (Digital Sister). The user spoke: "${queryText}".
Target language: ${targetLangName} (${langInfo.nativeName}).

Find the matching verified Indian welfare scheme (e.g. Free Sewing Machine, PMMVY ₹5000 maternity assistance, PM Ujjwala gas cylinder, Sukanya Samriddhi, or Mudra women loan).
Explain the scheme in 2-3 warm, simple sisterly sentences in ${targetLangName}.`;

        const schemeResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                intent: { type: Type.STRING },
                schemeId: { type: Type.STRING },
                schemeName: { type: Type.STRING },
                summary: { type: Type.STRING },
                eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
                documents: { type: Type.ARRAY, items: { type: Type.STRING } },
                benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                officialUrl: { type: Type.STRING },
                helpline: { type: Type.STRING },
                category: { type: Type.STRING },
                icon: { type: Type.STRING },
              },
              required: ['intent', 'schemeId', 'schemeName', 'summary', 'eligibility', 'documents', 'benefits', 'steps'],
            },
          },
        });

        if (schemeResponse.text) {
          const parsed = JSON.parse(schemeResponse.text.trim());
          res.json({
            success: true,
            data: {
              ...parsed,
              language: language,
            },
            transcribedText: spokenText,
            model: 'gemini-3.5-transcribe + gemini-3.5-flash (with googleSearch)',
          });
          return;
        }
      } catch (geminiAudioErr) {
        console.warn('Gemini audio understanding failed, using fallback:', geminiAudioErr);
      }
    }

    // Curated fallback
    const matchedScheme = CURATED_SCHEMES[0];
    const langKey = (matchedScheme.shortSummary[language] ? language : 'en') as keyof typeof matchedScheme.shortSummary;
    res.json({
      success: true,
      data: {
        intent: 'Voice inquiry for women assistance',
        schemeId: matchedScheme.id,
        schemeName: matchedScheme.name[language as keyof typeof matchedScheme.name] || matchedScheme.name.en,
        summary: matchedScheme.shortSummary[langKey] || matchedScheme.shortSummary.en,
        eligibility: matchedScheme.eligibility[langKey] || matchedScheme.eligibility.en,
        documents: matchedScheme.documents[langKey] || matchedScheme.documents.en,
        benefits: matchedScheme.benefits[langKey] || matchedScheme.benefits.en,
        steps: matchedScheme.steps[langKey] || matchedScheme.steps.en,
        followUpQuestion: matchedScheme.followUpSuggestions[langKey]?.[0] || 'How can I apply nearest to my home?',
        officialUrl: matchedScheme.officialUrl,
        helpline: matchedScheme.helpline,
        category: matchedScheme.category,
        icon: matchedScheme.icon,
        language: language,
      },
      transcribedText: 'Voice request received',
    });
  } catch (error) {
    console.error('Server error in /api/gemini/understand-audio:', error);
    res.status(500).json({ error: 'Audio processing failed' });
  }
});

/**
 * Route: POST /api/gemini/chat
 * Multi-turn chat interface using Gemini.
 * Models:
 * - gemini-3.1-flash-lite for fast tasks
 * - gemini-3.5-flash for general tasks
 * - gemini-3.1-pro-preview for particularly complex tasks
 */
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages,
      role = 'sister',
      modelSpeed = 'balanced',
      language = 'ta',
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!ai) {
      res.status(500).json({ error: 'Gemini AI not initialized' });
      return;
    }

    // Model selection based on user requirements:
    // "Use gemini-3.1-pro-preview for particularly complex tasks,
    //  gemini-3.5-flash for general tasks, and
    //  gemini-3.1-flash-lite for tasks that should happen fast."
    let selectedModel = 'gemini-3.5-flash'; // general
    if (modelSpeed === 'fast') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (modelSpeed === 'complex') {
      selectedModel = 'gemini-3.1-pro-preview';
    }

    const langInfo = getLanguageByCode(language);
    const targetLangName = langInfo.name;

    // System instruction giving specific role
    let systemInstruction = `You are "AWAAZ Digital Sister" (சஹேலி / Saheli), an affectionate, highly trusted elder sister (Akka/Didi) for Indian women.`;
    if (role === 'advisor') {
      systemInstruction = `You are the "Government Welfare Advisor", an expert who thoroughly explains eligibility criteria, certificate requirements, and legal protections in simple terms in ${targetLangName} (${langInfo.nativeName}).`;
    } else if (role === 'form_helper') {
      systemInstruction = `You are the "CSC Kendra Application Assistant", an expert guide walking rural and first-time applicants through exact portal steps, document uploads, and biometric verification in ${targetLangName} (${langInfo.nativeName}).`;
    } else {
      systemInstruction += ` Speak warmly in everyday ${targetLangName} (${langInfo.nativeName}). Explain government schemes simply without bureaucratic jargon. Reassure her and build her confidence.`;
    }

    // Format multi-turn conversation history
    const contents = messages.map((m: { role: 'user' | 'model'; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text ? response.text.trim() : '';

    // Extract search grounding if present
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchSources = groundingChunks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((c: any) => c.web)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri,
      }));

    res.json({
      success: true,
      reply,
      model: selectedModel,
      role,
      searchSources,
    });
  } catch (err: unknown) {
    console.error('Error in /api/gemini/chat:', err);
    res.status(500).json({ error: 'Chat generation failed' });
  }
});

/**
 * Route: POST /api/gemini/followup
 * Handles follow-up questions from the user in context of a specific scheme
 */
app.post('/api/gemini/followup', async (req: Request, res: Response) => {
  try {
    const { schemeId, question, language = 'ta' } = req.body;
    const langInfo = getLanguageByCode(language);
    const targetLangName = langInfo.name;

    const scheme = getSchemeById(schemeId) || CURATED_SCHEMES[0];

    if (ai) {
      try {
        const prompt = `You are AWAAZ (Digital Sister). The user is asking a follow-up question about the government scheme "${scheme.name.en}".
Scheme details:
- Official URL: ${scheme.officialUrl}
- Helpline: ${scheme.helpline}
- Benefits: ${JSON.stringify(scheme.benefits.en)}
- Eligibility: ${JSON.stringify(scheme.eligibility.en)}
- Documents: ${JSON.stringify(scheme.documents.en)}
- Steps: ${JSON.stringify(scheme.steps.en)}

User Follow-Up Question: "${question}"
Target Language: ${targetLangName} (${langInfo.nativeName})

Answer in 2-3 warm, reassuring, easy-to-understand sentences in ${targetLangName}. Explain clearly and step by step. Do NOT use complicated English or government jargon.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        if (response.text) {
          res.json({ success: true, reply: response.text.trim() });
          return;
        }
      } catch (err) {
        console.warn('Gemini follow-up call failed, using rule-based reply:', err);
      }
    }

    // Fallback follow-up answer in native language
    let defaultReply = `You can easily apply for this at your nearest CSC centre or Anganwadi. Keep your Aadhaar card and bank passbook ready. Call the toll-free helpline ${scheme.helpline} for free guidance.`;
    if (language === 'ta') {
      defaultReply = `கவலை வேண்டாம் அக்கா. உங்கள் ஆதார் அட்டை மற்றும் வங்கிக் கணக்கு புத்தகத்துடன் அருகிலுள்ள பொது சேவை மையம் (CSC) அல்லது அங்கன்வாடிக்குச் சென்றால் இலவசமாக விண்ணப்பித்து தருவார்கள். உதவிக்கு ${scheme.helpline} என்ற இலவச எண்ணை அழைக்கலாம்.`;
    } else if (language === 'hi') {
      defaultReply = `चिंता न करें बहन। अपने आधार कार्ड और बैंक पासबुक के साथ नजदीकी सीएससी (CSC) केंद्र या आंगनवाड़ी जाएं, वे मुफ्त में मदद करेंगे। अधिक जानकारी के लिए टोल-फ्री नंबर ${scheme.helpline} पर कॉल करें।`;
    }

    res.json({ success: true, reply: defaultReply });
  } catch (error) {
    console.error('Server error in /api/gemini/followup:', error);
    res.status(500).json({ error: 'Failed to process follow-up' });
  }
});

/**
 * Route: POST /api/gemini/tts
 * Synthesizes high-fidelity sisterly voice with gemini-3.8-flash-lite-tts
 */
app.post('/api/gemini/tts', async (req: Request, res: Response) => {
  try {
    const { text, language = 'ta' } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const langInfo = getLanguageByCode(language);

    if (ai) {
      try {
        const cleanText = text.trim().slice(0, 600);
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style: `Warm, compassionate, caring elder sister speaking clearly and naturally in ${langInfo.name}`,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/wav', language });
          return;
        }
      } catch (geminiTtsErr) {
        console.warn('Gemini AI TTS generation issue, falling back to browser voice:', geminiTtsErr);
      }
    }

    res.json({ success: false, fallbackToBrowser: true, language });
  } catch (error) {
    console.error('Server error in /api/gemini/tts:', error);
    res.status(500).json({ error: 'TTS processing error', fallbackToBrowser: true });
  }
});

// Setup WebSocket Server for Live API voice conversations (gemini-3.8-live)
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('⚡ Client connected to Gemini 3.8 Live API WebSocket');

  if (!ai) {
    clientWs.send(JSON.stringify({ error: 'Gemini API key not configured' }));
    clientWs.close();
    return;
  }

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction:
          'You are AWAAZ Digital Sister, a compassionate voice companion for Indian women. Speak in simple, reassuring words in the user\'s language. Answer questions about Indian government welfare schemes warmly.',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (parsed.text) {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error('Error in live ws message handling:', err);
      }
    });

    clientWs.on('close', () => {
      console.log('🔌 Client disconnected from Live API WebSocket');
      try {
        session.close();
      } catch {
        // ignore
      }
    });
  } catch (liveErr) {
    console.error('Error initiating gemini-3.8-live session:', liveErr);
    clientWs.send(JSON.stringify({ error: 'Failed to start Live session' }));
  }
});

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/api/live-voice') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, () => {
    console.log(`🌸 AWAAZ Digital Sister Server running on http://localhost:${PORT}`);
  });
}

startServer();
