import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  PhoneCall, 
  CheckCircle2, 
  FileText, 
  Gift, 
  Footprints, 
  ShieldCheck, 
  Info, 
  HelpCircle,
  Scissors,
  Baby,
  Flame,
  GraduationCap,
  Store,
  Sparkles
} from 'lucide-react';
import { getTranslation } from '../data/translations';

export interface StructuredSchemeResponse {
  intent: string;
  schemeId: string;
  schemeName: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  benefits: string[];
  steps: string[];
  followUpQuestion?: string;
  officialUrl: string;
  helpline?: string;
  category?: string;
  icon?: string;
  language: string;
  searchSources?: { title: string; uri: string }[];
}

interface SchemeCardProps {
  scheme: StructuredSchemeResponse;
  selectedLanguage: string;
  onAskFollowUp: (question: string) => void;
  isSpeaking: boolean;
  onSpeak: (text: string) => void;
  onStopSpeak: () => void;
  voiceAvailable: boolean;
}

export function SchemeCard({
  scheme,
  selectedLanguage,
  onAskFollowUp,
  isSpeaking,
  onSpeak,
  onStopSpeak,
  voiceAvailable,
}: SchemeCardProps) {
  const t = getTranslation(selectedLanguage);

  // Trigger celebration confetti on mount
  useEffect(() => {
    if (scheme.schemeId !== 'NOT_FOUND') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // ignore
      }
    }
  }, [scheme.schemeId]);

  const handleAudioPlayback = () => {
    if (isSpeaking) {
      onStopSpeak();
    } else {
      // Concise, warm sisterly explanation in the exact selected language
      const benefitsSummary = scheme.benefits.slice(0, 2).join('. ');
      const stepsSummary = scheme.steps.slice(0, 2).join('. ');
      const spokenText = `${scheme.schemeName}. ${scheme.summary} ${t.benefitsTitle}: ${benefitsSummary}. ${t.stepsTitle}: ${stepsSummary}.`;
      onSpeak(spokenText);
    }
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'scissors':
        return <Scissors className="w-6 h-6 text-rose-600" />;
      case 'baby':
        return <Baby className="w-6 h-6 text-amber-600" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-orange-600" />;
      case 'graduation-cap':
        return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      case 'store':
      default:
        return <Store className="w-6 h-6 text-purple-600" />;
    }
  };

  // If unverified/not found
  if (scheme.schemeId === 'NOT_FOUND') {
    return (
      <div className="w-full max-w-2xl mx-auto my-6 p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-xl text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {scheme.schemeName || 'தகவல் சரிபார்க்கப்படவில்லை'}
        </h2>
        <p className="text-stone-600 text-base leading-relaxed mb-6">
          {scheme.summary}
        </p>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm mb-6 text-left">
          <p className="font-bold mb-1">💡 சஹேலியின் ஆலோசனை:</p>
          <p>அரசு இலவச தையல் இயந்திரம், கர்ப்பிணி பெண்கள் உதவித்தொகை (₹5000), உஜ்வாலா இலவச கேஸ் சிலிண்டர், அல்லது செல்வமகள் சேமிப்பு திட்டம் பற்றி கேட்டுப் பார்க்கலாம்.</p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onAskFollowUp('பெண்களுக்கு இலவச தையல் இயந்திரம் திட்டம்')}
            className="px-4 py-2 rounded-full bg-rose-600 text-white font-semibold text-sm hover:bg-rose-700"
          >
            தையல் இயந்திர திட்டம்
          </button>
          <button
            onClick={() => onAskFollowUp('கர்ப்பிணி பெண்கள் உதவித்தொகை')}
            className="px-4 py-2 rounded-full bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700"
          >
            கர்ப்பிணி உதவி ₹5000
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="w-full max-w-2xl mx-auto my-4 sm:my-6 bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden animate-fade-in">
      {/* Top Banner with Scheme Title & Voice Output */}
      <div className="p-4 sm:p-7 bg-gradient-to-br from-rose-50 via-white to-amber-50/50 border-b border-stone-200">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-100 flex items-center justify-center shadow-xs shrink-0">
              {getCategoryIcon(scheme.icon)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-rose-600" />
                  Verified
                </span>
                <span className="text-[11px] text-stone-500 font-medium truncate">
                  100% Free Application
                </span>
              </div>
            </div>
          </div>

          {/* Voice Listen Button */}
          <button
            type="button"
            onClick={handleAudioPlayback}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[40px] rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${
              isSpeaking
                ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                : 'bg-white border-2 border-rose-300 text-rose-700 hover:bg-rose-50 hover:border-rose-400'
            }`}
            title={isSpeaking ? t.stopVoice : t.listenScheme}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t.stopVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-rose-600" />
                <span>{t.listenScheme}</span>
              </>
            )}
          </button>
        </div>

        {/* Scheme Name */}
        <h2 className="text-lg sm:text-2xl font-extrabold text-stone-900 leading-snug tracking-tight mb-2">
          {scheme.schemeName}
        </h2>

        {/* Plain language summary */}
        <p className="text-sm sm:text-lg text-stone-700 font-medium leading-relaxed bg-white/80 p-3 sm:p-3.5 rounded-2xl border border-stone-200/60 shadow-xs">
          {scheme.summary}
        </p>

        {!voiceAvailable && (
          <p className="text-[11px] text-stone-500 mt-2 italic flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            {t.noVoiceAvailable}
          </p>
        )}
      </div>

      {/* Structured Content Sections */}
      <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
        {/* Section 1: Benefits (What you get) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-base sm:text-lg mb-3">
            <Gift className="w-5 h-5 text-emerald-600" />
            <h3>{t.benefitsTitle}</h3>
          </div>
          <ul className="space-y-2">
            {scheme.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-stone-800 text-sm sm:text-base font-medium">
                <span className="w-5 h-5 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: Eligibility (Who can apply) */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base sm:text-lg mb-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600" />
            <h3>{t.eligibilityTitle}</h3>
          </div>
          <ul className="space-y-2">
            {scheme.eligibility.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-stone-800 text-sm sm:text-base font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Required Documents */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-base sm:text-lg mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3>{t.documentsTitle}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scheme.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs text-xs sm:text-sm font-semibold text-stone-800"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Step-by-Step Instructions */}
        <div>
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base sm:text-lg mb-3.5">
            <Footprints className="w-5 h-5 text-rose-600" />
            <h3>{t.stepsTitle}</h3>
          </div>
          <div className="space-y-3">
            {scheme.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200"
              >
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </span>
                <p className="text-stone-800 text-sm sm:text-base font-medium leading-relaxed pt-0.5">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Official Site & Helpline */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/25 transition-all text-center"
          >
            <span>{t.officialApplyBtn}</span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>

          {scheme.helpline && (
            <a
              href={`tel:${scheme.helpline.replace(/[^0-9]/g, '')}`}
              className="min-h-[48px] flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>{scheme.helpline}</span>
            </a>
          )}
        </div>

        {/* Google Search Grounded Web Sources */}
        {scheme.searchSources && scheme.searchSources.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Search Grounded Official Sources (gemini-3.5-flash)</span>
            </div>
            <div className="space-y-1.5">
              {scheme.searchSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-amber-100 text-xs font-semibold text-rose-700 hover:underline shadow-xs truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span className="truncate">{source.title || source.uri}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Safety Note */}
        <div className="p-3 rounded-xl bg-stone-100 border border-stone-200/80 text-xs text-stone-600 text-center font-medium">
          🛡️ {t.safetyNote}
        </div>

        {/* Follow-Up Quick Question Prompts */}
        <div className="pt-2 border-t border-stone-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider mb-2.5">
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>{t.followUpTitle}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              selectedLanguage === 'ta' ? 'அருகிலுள்ள சேவை மையம் எங்கே?' : 'Where is the nearest CSC centre?',
              selectedLanguage === 'ta' ? 'வங்கிக் கணக்கு இல்லையென்றால்?' : 'What if I do not have a bank account?',
              selectedLanguage === 'ta' ? 'விண்ணப்பிக்க பணம் செலுத்த வேண்டுமா?' : 'Is there any application fee?'
            ].map((suggested, idx) => (
              <button
                key={idx}
                onClick={() => onAskFollowUp(suggested)}
                className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-stone-200 text-stone-700 transition-all text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{suggested}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
