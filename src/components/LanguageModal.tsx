import { Check, X, Volume2 } from 'lucide-react';
import { LANGUAGES, Language } from '../data/languages';
import { TTSService } from '../services/ttsService';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export function LanguageModal({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage,
}: LanguageModalProps) {
  if (!isOpen) return null;

  const handlePreviewVoice = (lang: Language, e: React.MouseEvent) => {
    e.stopPropagation();
    TTSService.speak(lang.greeting, lang.bcp47);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl max-h-[92dvh] sm:max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 id="lang-modal-title" className="text-lg sm:text-xl font-bold tracking-tight">
              Select Your Language / உங்கள் மொழி
            </h2>
            <p className="text-[11px] sm:text-xs text-rose-100 mt-0.5 sm:mt-1">
              Choose the language you feel most comfortable speaking and reading
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform shrink-0"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Language Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 bg-stone-50">
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === selectedLanguage;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`relative flex items-center justify-between p-3 sm:p-4 min-h-[56px] rounded-2xl border-2 text-left transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'border-rose-600 bg-rose-50/80 shadow-md ring-2 ring-rose-300'
                    : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50/30 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {lang.flagEmoji}
                  </span>
                  <div>
                    <div className="text-lg font-bold text-stone-900 leading-tight">
                      {lang.nativeName}
                    </div>
                    <div className="text-xs font-medium text-stone-500">
                      {lang.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handlePreviewVoice(lang, e)}
                    className="p-2 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                    title={`Hear greeting in ${lang.name}`}
                    aria-label={`Listen to sample in ${lang.name}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-semibold rounded-xl shadow-md transition-all text-base"
          >
            Confirm & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
