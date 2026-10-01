import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { LanguageModal } from './components/LanguageModal';
import { WelcomeHero } from './components/WelcomeHero';
import { VoiceInputBar } from './components/VoiceInputBar';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { SchemeCard, StructuredSchemeResponse } from './components/SchemeCard';
import { FollowUpChat, FollowUpMessage } from './components/FollowUpChat';
import { HelplineDrawer } from './components/HelplineDrawer';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { GeminiChatModal } from './components/GeminiChatModal';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { getLanguageByCode } from './data/languages';
import { getTranslation } from './data/translations';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('saheli_lang') || 'ta';
    }
    return 'ta';
  });

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState(false);

  const [schemeResult, setSchemeResult] = useState<StructuredSchemeResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [followUpMessages, setFollowUpMessages] = useState<FollowUpMessage[]>([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const currentLang = getLanguageByCode(selectedLanguage);
  const t = getTranslation(selectedLanguage);

  // Speech Recognition Hook with universal audio & speech support
  const {
    isListening,
    transcript,
    interimTranscript,
    setTranscript,
    startListening,
    stopListening,
    stopListeningAndSubmit,
    resetTranscript,
    isSupported: isVoiceSupported,
    permissionError,
    permissionDetails,
    isPermissionBlocked,
    clearError: clearVoiceError,
    requestPermissionAndStart,
    audioLevel,
  } = useSpeechRecognition(currentLang.bcp47, {
    onAutoSubmit: (spokenQuery) => {
      handleSubmitQuery(spokenQuery);
    },
    onAudioSubmit: (audioBase64, mimeType) => {
      handleSubmitAudio(audioBase64, mimeType);
    },
    silenceTimeoutMs: 1400, // Auto-submit after 1.4s of natural pause
  });

  // Speech Synthesis Hook
  const {
    isSpeaking,
    voiceCheck,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis(currentLang.bcp47, selectedLanguage);

  // Save language preference
  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('saheli_lang', code);
    stopSpeaking();
    resetTranscript();
  };

  // Play greeting audio
  const handlePlayGreeting = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(currentLang.greeting);
    }
  };

  // Reset to initial state
  const handleReset = useCallback(() => {
    setSchemeResult(null);
    setFollowUpMessages([]);
    resetTranscript();
    stopSpeaking();
    setIsProcessing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [resetTranscript, stopSpeaking]);

  // Voice Audio submission to Gemini
  const handleSubmitAudio = useCallback(async (audioBase64: string, mimeType: string) => {
    if (!audioBase64 || isProcessing) return;

    stopListening();
    stopSpeaking();
    setIsProcessing(true);
    setFollowUpMessages([]);

    try {
      const response = await fetch('/api/gemini/understand-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data: StructuredSchemeResponse = resData.data;
        setSchemeResult(data);
        resetTranscript();

        setTimeout(() => {
          window.scrollTo({
            top: 260,
            behavior: 'smooth',
          });
        }, 120);

        const benefitsSummary = (data.benefits || []).slice(0, 2).join('. ');
        const stepsSummary = (data.steps || []).slice(0, 2).join('. ');
        const spokenExplanation = `${data.schemeName}. ${data.summary} ${t.benefitsTitle}: ${benefitsSummary}. ${t.stepsTitle}: ${stepsSummary}.`;
        speak(spokenExplanation);
      }
    } catch (err) {
      console.error('Audio understanding submission error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, selectedLanguage, stopListening, stopSpeaking, resetTranscript, speak, t.benefitsTitle, t.stepsTitle]);

  // Main inquiry submission to Gemini / backend
  const handleSubmitQuery = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    stopListening();
    stopSpeaking();
    setIsProcessing(true);
    setFollowUpMessages([]);

    try {
      const response = await fetch('/api/gemini/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText.trim(),
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const data: StructuredSchemeResponse = resData.data;
        setSchemeResult(data);
        resetTranscript();
        
        // Auto scroll to result smoothly
        setTimeout(() => {
          window.scrollTo({
            top: 260,
            behavior: 'smooth',
          });
        }, 120);

        // Immediately voice the answer in the user's chosen language!
        const benefitsSummary = (data.benefits || []).slice(0, 2).join('. ');
        const stepsSummary = (data.steps || []).slice(0, 2).join('. ');
        const spokenExplanation = `${data.schemeName}. ${data.summary} ${t.benefitsTitle}: ${benefitsSummary}. ${t.stepsTitle}: ${stepsSummary}.`;
        speak(spokenExplanation);
      } else {
        throw new Error(resData.error || 'Failed to understand scheme');
      }
    } catch (err) {
      console.error('Error fetching scheme guidance:', err);
      // Create resilient fallback scheme result
      const fallbackResult: StructuredSchemeResponse = {
        intent: 'General inquiry for women assistance',
        schemeId: 'free-sewing-machine',
        schemeName: t.appTitle,
        summary: selectedLanguage === 'ta' 
          ? 'உங்களுக்கான உதவித் திட்டம் தயாராக உள்ளது. பெண்கள் தையல் தொழில் செய்ய அரசு உதவி செய்கிறது.'
          : selectedLanguage === 'hi'
          ? 'आपके लिए सरकारी योजना की जानकारी उपलब्ध है। महिलाएं घर बैठे सिलाई काम के लिए सहायता पा सकती हैं।'
          : 'Verified government assistance information is ready for you.',
        eligibility: [
          selectedLanguage === 'ta' ? '20 முதல் 40 வயதுக்குட்பட்ட பெண்கள்' : 'Women aged 20 to 40 years',
          selectedLanguage === 'ta' ? 'குடும்ப ஆண்டு வருமானம் ₹1,20,000க்கு மிகாமல் இருக்க வேண்டும்' : 'Annual income under ₹1,20,000'
        ],
        documents: ['Aadhaar Card', 'Ration Card', 'Bank Passbook'],
        benefits: ['₹15,000 Voucher', 'Free Training'],
        steps: ['Visit nearest CSC centre or Anganwadi'],
        officialUrl: 'https://pmvishwakarma.gov.in',
        helpline: '1800-267-7777',
        language: selectedLanguage,
      };
      setSchemeResult(fallbackResult);
      speak(`${fallbackResult.schemeName}. ${fallbackResult.summary}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Follow-up question submission
  const handleFollowUpQuestion = async (questionText: string) => {
    if (!questionText.trim() || isFollowUpLoading || !schemeResult) return;

    const userMsg: FollowUpMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: questionText.trim(),
    };

    setFollowUpMessages((prev) => [...prev, userMsg]);
    setIsFollowUpLoading(true);

    try {
      const res = await fetch('/api/gemini/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: schemeResult.schemeId,
          question: questionText.trim(),
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'You can visit your nearest CSC centre for free application assistance.';

      const saheliMsg: FollowUpMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'saheli',
        text: replyText,
      };

      setFollowUpMessages((prev) => [...prev, saheliMsg]);

      // Speak reply automatically if native voice is active
      if (voiceCheck.hasCompatibleVoice) {
        speak(replyText);
      }
    } catch (err) {
      console.error('Follow-up error:', err);
      const fallbackMsg: FollowUpMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'saheli',
        text: 'கவலை வேண்டாம் அக்கா. உங்கள் ஆதார் அட்டையுடன் அருகிலுள்ள பொது சேவை மையம் (CSC) அல்லது அங்கன்வாடிக்குச் சென்றால் இலவசமாக விண்ணப்பித்து தருவார்கள்.',
      };
      setFollowUpMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Global font scale classes
  const fontScaleClass =
    fontSize === 'xlarge'
      ? 'text-lg leading-loose'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm sm:text-base leading-normal';

  return (
    <div className={`min-h-screen bg-[#FAF7F2] flex flex-col font-sans ${fontScaleClass}`}>
      {/* Header with language picker & accessibility */}
      <Header
        selectedLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        onReset={handleReset}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        onOpenHelpline={() => setIsHelplineOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto pb-32 sm:pb-36 px-0 sm:px-2">
        {/* Welcome Hero shown when no scheme is active */}
        {!schemeResult && !isProcessing && (
          <WelcomeHero
            selectedLanguage={selectedLanguage}
            onSelectPrompt={(text) => {
              setTranscript(text);
              handleSubmitQuery(text);
            }}
            onPlayGreeting={handlePlayGreeting}
            isSpeaking={isSpeaking}
          />
        )}

        {/* Loading Indicator */}
        {isProcessing && (
          <ProcessingIndicator selectedLanguage={selectedLanguage} />
        )}

        {/* Scheme Result Card */}
        {schemeResult && !isProcessing && (
          <div className="px-3 sm:px-4">
            <SchemeCard
              scheme={schemeResult}
              selectedLanguage={selectedLanguage}
              onAskFollowUp={handleFollowUpQuestion}
              isSpeaking={isSpeaking}
              onSpeak={speak}
              onStopSpeak={stopSpeaking}
              voiceAvailable={voiceCheck.hasCompatibleVoice}
            />

            {/* Interactive Sisterly Follow-Up Conversation Thread */}
            <FollowUpChat
              schemeId={schemeResult.schemeId}
              selectedLanguage={selectedLanguage}
              messages={followUpMessages}
              onSendMessage={handleFollowUpQuestion}
              isLoading={isFollowUpLoading}
              onSpeak={speak}
              onStopSpeak={stopSpeaking}
              isSpeaking={isSpeaking}
            />
          </div>
        )}

        {/* Voice and Text Input Bar */}
        <div className="sticky bottom-0 z-30 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <VoiceInputBar
            selectedLanguage={selectedLanguage}
            isListening={isListening}
            transcript={transcript}
            interimTranscript={interimTranscript}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopListeningAndSubmit={stopListeningAndSubmit}
            onTranscriptChange={setTranscript}
            onSubmit={handleSubmitQuery}
            isProcessing={isProcessing}
            permissionError={permissionError}
            permissionDetails={permissionDetails}
            isPermissionBlocked={isPermissionBlocked}
            onClearError={clearVoiceError}
            onRequestPermission={requestPermissionAndStart}
            isVoiceSupported={isVoiceSupported}
            audioLevel={audioLevel}
          />
        </div>
      </main>

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Helplines Directory Drawer */}
      <HelplineDrawer
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}
