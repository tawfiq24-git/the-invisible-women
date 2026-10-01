import { Globe, RotateCcw, PhoneCall, Sparkles, MessageSquare, Radio, Mic } from 'lucide-react';
import { getLanguageByCode } from '../data/languages';
import { getTranslation } from '../data/translations';

interface HeaderProps {
  selectedLanguage: string;
  onOpenLanguageModal: () => void;
  onReset: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  onOpenHelpline: () => void;
  onOpenLiveVoice?: () => void;
  onOpenGeminiChat?: () => void;
  onOpenTranscribe?: () => void;
}

export function Header({
  selectedLanguage,
  onOpenLanguageModal,
  onReset,
  fontSize,
  onChangeFontSize,
  onOpenHelpline,
  onOpenLiveVoice,
  onOpenGeminiChat,
  onOpenTranscribe,
}: HeaderProps) {
  const currentLang = getLanguageByCode(selectedLanguage);
  const t = getTranslation(selectedLanguage);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand identity */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink min-w-0"
          role="button"
          tabIndex={0}
        >
          {/* Sisterly Avatar Logo */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="text-lg sm:text-2xl" role="img" aria-label="Awaaz Sister">
              🧕
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-stone-900 group-hover:text-rose-600 transition-colors">
                AWAAZ
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                <Sparkles className="w-3 h-3 text-rose-600" />
                Digital Sister
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium truncate max-w-[110px] xs:max-w-[150px] sm:max-w-xs">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Live Voice Call Button (gemini-3.8-live) */}
          {onOpenLiveVoice && (
            <button
              onClick={onOpenLiveVoice}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
              title="Real-Time Voice Call with gemini-3.8-live"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span className="hidden xs:inline">Live Call</span>
            </button>
          )}

          {/* Gemini Chatbot Button (Multi-turn chat) */}
          {onOpenGeminiChat && (
            <button
              onClick={onOpenGeminiChat}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 active:scale-95 transition-all shadow-xs"
              title="Chat with Gemini (Multi-turn Chatbot)"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Gemini Chat</span>
            </button>
          )}

          {/* Audio Transcribe Button (gemini-3.5-transcribe) */}
          {onOpenTranscribe && (
            <button
              onClick={onOpenTranscribe}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 min-h-[36px] rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all shadow-xs"
              title="Transcribe Audio with gemini-3.5-transcribe"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-700" />
              <span>Transcribe</span>
            </button>
          )}

          {/* Font Size Adjuster (desktop) */}
          <div className="hidden lg:flex items-center bg-stone-200/70 rounded-full p-0.5 text-xs font-semibold text-stone-700">
            <button
              onClick={() => onChangeFontSize('normal')}
              className={`px-2 py-1 rounded-full transition-all ${
                fontSize === 'normal' ? 'bg-white shadow-xs text-stone-900' : 'hover:text-stone-950'
              }`}
              title="Standard font size"
            >
              A
            </button>
            <button
              onClick={() => onChangeFontSize('large')}
              className={`px-2.5 py-1 rounded-full text-sm transition-all ${
                fontSize === 'large' ? 'bg-white shadow-xs text-stone-900' : 'hover:text-stone-950'
              }`}
              title="Large font size"
            >
              A+
            </button>
            <button
              onClick={() => onChangeFontSize('xlarge')}
              className={`px-2.5 py-1 rounded-full text-base transition-all ${
                fontSize === 'xlarge' ? 'bg-white shadow-xs text-stone-900' : 'hover:text-stone-950'
              }`}
              title="Extra large font size"
            >
              A++
            </button>
          </div>

          {/* Emergency 181 button */}
          <button
            onClick={onOpenHelpline}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 active:scale-95 transition-all shadow-xs"
            title="National Women Helpline (24x7 Free)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-700 animate-pulse shrink-0" />
            <span className="font-extrabold text-[11px] sm:text-xs">181</span>
          </button>

          {/* Language Selector Button */}
          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full bg-white border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold hover:border-rose-400 hover:bg-rose-50/50 active:scale-95 transition-all shadow-xs"
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{currentLang.nativeName}</span>
          </button>

          {/* Reset / New Question */}
          <button
            onClick={onReset}
            className="p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 active:scale-95 transition-all"
            title={t.resetChat}
            aria-label={t.resetChat}
          >
            <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
