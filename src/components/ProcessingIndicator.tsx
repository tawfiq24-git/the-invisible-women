import { Sparkles } from 'lucide-react';
import { getTranslation } from '../data/translations';

interface ProcessingIndicatorProps {
  selectedLanguage: string;
}

export function ProcessingIndicator({ selectedLanguage }: ProcessingIndicatorProps) {
  const t = getTranslation(selectedLanguage);

  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto">
      {/* Pulsing Sisterly Mascot / Halo */}
      <div className="relative mb-5">
        <div className="absolute -inset-4 rounded-full bg-rose-400/20 blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/30">
          <span className="text-3xl animate-bounce" role="img" aria-label="Thinking">
            🧕
          </span>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
        {t.thinkingMessage}
      </h3>

      <div className="flex items-center gap-1.5 justify-center text-rose-600 font-semibold text-sm mb-4">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>Gemini AI is analyzing verified government criteria...</span>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
        <span>🔒 100% Free Official Government Information</span>
      </div>
    </div>
  );
}
