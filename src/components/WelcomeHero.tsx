import { Volume2, VolumeX, Sparkles, Scissors, Baby, Flame, GraduationCap, Store } from 'lucide-react';
import { getTranslation } from '../data/translations';
import { getLanguageByCode } from '../data/languages';
import { CURATED_SCHEMES } from '../data/schemes';

interface WelcomeHeroProps {
  selectedLanguage: string;
  onSelectPrompt: (promptText: string) => void;
  onPlayGreeting: () => void;
  isSpeaking: boolean;
}

export function WelcomeHero({
  selectedLanguage,
  onSelectPrompt,
  onPlayGreeting,
  isSpeaking,
}: WelcomeHeroProps) {
  const t = getTranslation(selectedLanguage);
  const lang = getLanguageByCode(selectedLanguage);

  const getSchemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'scissors':
        return <Scissors className="w-5 h-5 text-rose-600" />;
      case 'baby':
        return <Baby className="w-5 h-5 text-amber-600" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'graduation-cap':
        return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'store':
      default:
        return <Store className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="text-center py-4 sm:py-8 px-3.5 sm:px-4 max-w-3xl mx-auto">
      {/* Friendly Sisterly Greeting Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-rose-200 shadow-xs max-w-full truncate">
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
        <span className="truncate">{lang.nativeName} ({lang.name}) • உங்கள் தோழி சஹேலி</span>
      </div>

      {/* Main Friendly Question */}
      <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-snug sm:leading-tight mb-2 sm:mb-3 px-1">
        {t.welcomeHeading}
      </h1>

      {/* Reassurance text */}
      <p className="text-sm sm:text-base md:text-lg text-stone-600 font-medium max-w-xl mx-auto mb-4 sm:mb-5 leading-relaxed px-2">
        {t.welcomeSubheading}
      </p>

      {/* Voice Greeting Play Button */}
      <div className="flex justify-center mb-5 sm:mb-8">
        <button
          onClick={onPlayGreeting}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 min-h-[44px] rounded-full font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 ${
            isSpeaking
              ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
              : 'bg-white border-2 border-rose-300 text-rose-800 hover:bg-rose-50 hover:border-rose-400'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.stopVoice}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>{t.listenToGreeting}</span>
            </>
          )}
        </button>
      </div>

      {/* Curated Popular Government Schemes Cards */}
      <div className="text-left mt-2 sm:mt-4">
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500 mb-2.5 sm:mb-3 px-1 flex items-center justify-between">
          <span>{t.quickQuestionsTitle}</span>
          <span className="text-[10px] sm:text-[11px] font-normal lowercase text-stone-400">1-tap quick start</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {CURATED_SCHEMES.map((scheme) => {
            const schemeNameInLang =
              scheme.name[selectedLanguage as keyof typeof scheme.name] ||
              scheme.name.en;
            const promptText =
              selectedLanguage === 'ta'
                ? `${schemeNameInLang} பற்றி எனக்கு முழு விவரம் வேண்டும்`
                : selectedLanguage === 'hi'
                ? `मुझे ${schemeNameInLang} की पूरी जानकारी चाहिए`
                : `Tell me about ${scheme.name.en} and how to apply`;

            return (
              <button
                key={scheme.id}
                onClick={() => onSelectPrompt(promptText)}
                className="group p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-rose-400 hover:shadow-md active:scale-[0.99] text-left transition-all flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {getSchemeIcon(scheme.icon)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {schemeNameInLang}
                  </div>
                  <div className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                    {scheme.shortSummary[selectedLanguage] || scheme.shortSummary.en}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
