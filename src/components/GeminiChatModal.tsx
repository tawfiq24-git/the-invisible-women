import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Scale,
  Brain,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { getLanguageByCode } from '../data/languages';
import { TTSService } from '../services/ttsService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  modelUsed?: string;
  sources?: { title: string; uri: string }[];
  timestamp: Date;
}

export type ChatRole = 'sister' | 'advisor' | 'form_helper';
export type ModelSpeed = 'fast' | 'balanced' | 'complex';

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
}

export function GeminiChatModal({
  isOpen,
  onClose,
  selectedLanguage,
}: GeminiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<ChatRole>('sister');
  const [modelSpeed, setModelSpeed] = useState<ModelSpeed>('balanced');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const langInfo = getLanguageByCode(selectedLanguage);

  // Initialize with welcome greeting in selected language
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting =
        selectedLanguage === 'ta'
          ? 'வணக்கம் சகோதரி! நான் உங்கள் AWAAZ டிஜிட்டல் சகோதரி. அரசு திட்டங்கள், தகுதி, அல்லது உதவித்தொகை பற்றி நீங்கள் எதையும் என்னிடம் கேட்கலாம்.'
          : selectedLanguage === 'hi'
          ? 'नमस्ते बहन! मैं आपकी AWAAZ डिजिटल बहन हूँ। आप मुझसे सरकारी योजनाओं, पात्रता या आवेदन के बारे में कुछ भी पूछ सकती हैं।'
          : 'Hello sister! I am your AWAAZ Digital Sister. You can ask me anything about Indian government welfare schemes, eligibility, or application processes.';

      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          content: initialGreeting,
          modelUsed: 'gemini-3.5-flash',
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedLanguage, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          role: activeRole,
          modelSpeed: modelSpeed,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.reply || 'You can visit your nearest CSC Kendra for application assistance.',
        modelUsed: data.model || (modelSpeed === 'fast' ? 'gemini-3.1-flash-lite' : modelSpeed === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash'),
        sources: data.searchSources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);

      // Speak reply automatically
      handleSpeak(modelMsg.id, modelMsg.content);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content:
          selectedLanguage === 'ta'
            ? 'மன்னிக்கவும், தகவல் பெறுவதில் சிறிய தாமதம். உங்கள் ஆதார் அட்டையுடன் அருகிலுள்ள சேவை மையத்தை (CSC) அணுகலாம்.'
            : 'I could not reach the server. Please visit your nearest CSC centre or Anganwadi with your Aadhaar card for immediate assistance.',
        modelUsed: 'offline-fallback',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingId === msgId) {
      TTSService.stop();
      setSpeakingId(null);
    } else {
      TTSService.stop();
      setSpeakingId(msgId);
      TTSService.speak(text, langInfo.bcp47);
    }
  };

  const handleClearHistory = () => {
    TTSService.stop();
    setSpeakingId(null);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        content:
          selectedLanguage === 'ta'
            ? 'புதிய உரையாடல் தொடங்கியது. உங்களுக்கு என்ன உதவி வேண்டும் சகோதரி?'
            : 'New conversation started. How can I help you today sister?',
        modelUsed: 'gemini-3.5-flash',
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl h-[92dvh] sm:h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl shadow-xs">
              🧕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  AWAAZ Gemini Chatbot
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Multi-Turn
                </span>
              </div>
              <p className="text-xs text-rose-100">
                In {langInfo.name} ({langInfo.nativeName}) • Search Grounded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-all text-white/80 hover:text-white"
              title="Reset conversation history"
              aria-label="Reset conversation history"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                TTSService.stop();
                onClose();
              }}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role & Model Controls Bar */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Specific Roles selector */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-stone-500 mr-1 hidden xs:inline">Role:</span>
            <button
              onClick={() => setActiveRole('sister')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                activeRole === 'sister'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-rose-50'
              }`}
            >
              🧕 Sister
            </button>
            <button
              onClick={() => setActiveRole('advisor')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                activeRole === 'advisor'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-rose-50'
              }`}
            >
              ⚖️ Welfare Advisor
            </button>
            <button
              onClick={() => setActiveRole('form_helper')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                activeRole === 'form_helper'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-rose-50'
              }`}
            >
              🏢 CSC Helper
            </button>
          </div>

          {/* Model Speed / Complexity */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModelSpeed('fast')}
              title="gemini-3.1-flash-lite: Fast response tasks"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                modelSpeed === 'fast'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-amber-50'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Fast</span>
            </button>
            <button
              onClick={() => setModelSpeed('balanced')}
              title="gemini-3.5-flash: General tasks with Google Search Grounding"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                modelSpeed === 'balanced'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-rose-50'
              }`}
            >
              <Scale className="w-3 h-3" />
              <span>Balanced</span>
            </button>
            <button
              onClick={() => setModelSpeed('complex')}
              title="gemini-3.1-pro-preview: Deep reasoning for complex eligibility"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold transition-all ${
                modelSpeed === 'complex'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-purple-50'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span>Complex</span>
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#FAF7F2]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-rose-600 text-white rounded-br-xs'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                }`}
              >
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>

                {/* Google Search Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Google Search Grounded Sources
                    </span>
                    <div className="space-y-1">
                      {msg.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-rose-700 hover:underline font-semibold truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{src.title || src.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Meta & Audio Listen Button */}
                {msg.role === 'model' && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="text-[10px] font-bold text-stone-400">
                      {msg.modelUsed}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="flex items-center gap-1 font-bold text-rose-700 hover:underline px-1 py-0.5"
                    >
                      {speakingId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-2xl text-stone-600 text-xs font-semibold max-w-[80%] border border-stone-200 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span>
                {modelSpeed === 'complex'
                  ? 'Gemini 3.1 Pro is reasoning through verified legal criteria...'
                  : modelSpeed === 'fast'
                  ? 'Gemini 3.1 Flash-Lite is replying fast...'
                  : 'Gemini 3.5 Flash is searching official portals...'}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${activeRole === 'advisor' ? 'legal questions' : 'anything in ' + langInfo.name}...`}
            className="flex-1 py-3 px-4 text-base rounded-2xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-medium"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="min-h-[46px] min-w-[46px] flex items-center justify-center p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white disabled:opacity-40 shadow-md transition-all"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
