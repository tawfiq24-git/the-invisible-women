export interface Language {
  code: string;
  name: string;
  nativeName: string;
  bcp47: string;
  greeting: string;
  fontClass: string;
  flagEmoji: string;
}

export const LANGUAGES: Language[] = [
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    bcp47: 'ta-IN',
    greeting: 'வணக்கம் அக்கா! நான் ஆவாஸ், உங்கள் டிஜிட்டல் தோழி. உங்களுக்கு என்ன அரசு உதவி வேண்டும் என்று சொல்லுங்கள்.',
    fontClass: 'font-tamil',
    flagEmoji: '🌾'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    bcp47: 'hi-IN',
    greeting: 'नमस्ते बहन! मैं आवाज़ हूँ, आपकी डिजिटल बहन। बताइए आपको कौन सी सरकारी योजना या मदद चाहिए?',
    fontClass: 'font-devanagari',
    flagEmoji: '🌸'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    bcp47: 'te-IN',
    greeting: 'నమస్కారం సోదరీ! నేను ఆవాజ్, మీ డిజిటల్ సోదరి. మీకు ఎలాంటి ప్రభుత్వ సహాయం కావాలో చెప్పండి.',
    fontClass: 'font-telugu',
    flagEmoji: '🌿'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    bcp47: 'kn-IN',
    greeting: 'ನಮಸ್ಕಾರ ಸಹೋದರಿ! ನಾನು ಆವಾಜ್, ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸಹೋದರಿ. ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆ ಬೇಕು ಎಂದು ಹೇಳಿ.',
    fontClass: 'font-kannada',
    flagEmoji: '🌼'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    bcp47: 'ml-IN',
    greeting: 'നമസ്കാരം സഹോദരീ! ഞാൻ ആവാസ്, നിങ്ങളുടെ ഡിജിറ്റൽ സഹോദരി. നിങ്ങൾക്ക് എന്ത് സർക്കാർ സഹായമാണ് വേണ്ടത്?',
    fontClass: 'font-malayalam',
    flagEmoji: '🌴'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    bcp47: 'bn-IN',
    greeting: 'নমস্কার দিদি! আমি আওয়াজ, আপনার ডিজিটাল দিদি। আপনার কি সরকারি সাহায্য প্রয়োজন আমাকে বলুন।',
    fontClass: 'font-bengali',
    flagEmoji: '🪷'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    bcp47: 'mr-IN',
    greeting: 'नमस्कार ताई! मी आवाज़ आहे, तुमची डिजिटल बहीण. तुम्हाला कोणती सरकारी योजना हवी आहे ते सांगा.',
    fontClass: 'font-devanagari',
    flagEmoji: '🌺'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    bcp47: 'gu-IN',
    greeting: 'નમસ્તે બહેન! હું આવાઝ છું, તમારી ડિજિટલ બહેન. તમને કઈ સરકારી યોજનાની મદદ જોઈએ છે તે કહો.',
    fontClass: 'font-gujarati',
    flagEmoji: '🌻'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    bcp47: 'pa-IN',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਭੈਣ ਜੀ! ਮੈਂ ਆਵਾਜ਼ ਹਾਂ, ਤੁਹਾਡੀ ਡਿਜੀਟਲ ਭੈਣ। ਦੱਸੋ ਤੁਹਾਨੂੰ ਕਿਸ ਸਰਕਾਰੀ ਸਕੀਮ ਦੀ ਲੋੜ ਹੈ?',
    fontClass: 'font-gurmukhi',
    flagEmoji: '🌾'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    bcp47: 'or-IN',
    greeting: 'ନମସ୍କାର ଭଉଣୀ! ମୁଁ ଆୱାଜ, ଆପଣଙ୍କ ଡିଜିଟାଲ ଭଉଣୀ। ଆପଣଙ୍କୁ କେଉଁ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ଅଛି?',
    fontClass: 'font-oriya',
    flagEmoji: '🪷'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    bcp47: 'ur-IN',
    greeting: 'سلام بہن! میں آواز ہوں، آپ کی ڈیجیٹل بہن۔ بتائیں آپ کو کس سرکاری اسکیم کی معلومات چاہیے؟',
    fontClass: 'font-sans',
    flagEmoji: '🌙'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    bcp47: 'en-IN',
    greeting: 'Hello sister! I am AWAAZ, your digital sister. Tell me what government scheme or help you need.',
    fontClass: 'font-sans',
    flagEmoji: '🇮🇳'
  }
];

export const getLanguageByCode = (code: string): Language => {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
};
