export interface SchemeData {
  id: string;
  category: 'livelihood' | 'maternity' | 'household' | 'finance' | 'education';
  icon: string;
  name: {
    en: string;
    ta: string;
    hi: string;
    te: string;
    kn: string;
    ml: string;
    bn: string;
    mr: string;
    gu: string;
    pa: string;
    or: string;
    ur: string;
  };
  shortSummary: {
    en: string;
    ta: string;
    hi: string;
    [key: string]: string;
  };
  targetAudience: {
    en: string;
    ta: string;
    hi: string;
    [key: string]: string;
  };
  eligibility: {
    en: string[];
    ta: string[];
    hi: string[];
    [key: string]: string[];
  };
  documents: {
    en: string[];
    ta: string[];
    hi: string[];
    [key: string]: string[];
  };
  benefits: {
    en: string[];
    ta: string[];
    hi: string[];
    [key: string]: string[];
  };
  steps: {
    en: string[];
    ta: string[];
    hi: string[];
    [key: string]: string[];
  };
  followUpSuggestions: {
    en: string[];
    ta: string[];
    hi: string[];
    [key: string]: string[];
  };
  officialUrl: string;
  helpline: string;
  keywords: string[];
}

export const CURATED_SCHEMES: SchemeData[] = [
  {
    id: 'free-sewing-machine',
    category: 'livelihood',
    icon: 'scissors',
    name: {
      en: 'PM Free Sewing Machine Scheme (PM Vishwakarma Tailor)',
      ta: 'இலவச தையல் இயந்திரம் வழங்கும் திட்டம் (பி.எம் விஸ்வகர்மா)',
      hi: 'प्रधानमंत्री मुफ्त सिलाई मशीन योजना (पीएम विश्वकर्मा दर्जी)',
      te: 'ప్రధాన మంత్రి ఉచిత కుట్టుమిషన్ పథకం',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಉಚಿತ ಹೊಲಿಗೆ ಯಂತ್ರ ಯೋಜನೆ',
      ml: 'സൗജന്യ തയ്യൽ മെഷീൻ പദ്ധതി',
      bn: 'বিনামূল্যে সেলাই মেশিন যোজনা',
      mr: 'मोफत शिलाई मशीन योजना',
      gu: 'મફત સિલાઈ મશીન યોજના',
      pa: 'ਮੁਫ਼ਤ ਸਿਲਾਈ ਮਸ਼ੀਨ ਸਕੀਮ',
      or: 'ମାଗଣା ସିଲେଇ ମେସିନ ଯୋଜନା',
      ur: 'وزیر اعظم مفت سلائی مشین اسکیم'
    },
    shortSummary: {
      en: 'Government provides a free modern sewing machine or ₹15,000 tool kit voucher plus 5 days free training with ₹500 daily stipend to women for self-employment at home.',
      ta: 'பெண்கள் வீட்டில் இருந்தே சுயதொழில் செய்ய நவீன தையல் இயந்திரம் வாங்க ₹15,000 மானியம் அல்லது தையல் இயந்திரம் மற்றும் 5 நாள் இலவச பயிற்சியுடன் நாள் ஒன்றுக்கு ₹500 உதவித்தொகை வழங்கப்படுகிறது.',
      hi: 'घर बैठे आत्मनिर्भर बनने और कपड़े सिलने के काम के लिए सरकार महिलाओं को मुफ्त सिलाई मशीन या ₹15,000 का टूलकिट वाउचर और 5 दिन की मुफ्त ट्रेनिंग के साथ ₹500 दैनिक भत्ता देती है।'
    },
    targetAudience: {
      en: 'Women aged 20 to 40 years wanting to earn from tailoring at home or rural artisans.',
      ta: 'வீட்டில் இருந்தே தையல் தொழில் செய்து வருமானம் ஈட்ட விரும்பும் 20 முதல் 40 வயதுக்குட்பட்ட பெண்கள்.',
      hi: 'घर पर कपड़े सिलकर आजीविका कमाने की इच्छुक 20 से 40 वर्ष की ग्रामीण और शहरी महिलाएं।'
    },
    eligibility: {
      en: [
        'Applicant must be a woman between 20 and 40 years of age.',
        'Family annual income should not exceed ₹1,20,000.',
        'Widows, destitute women, and disabled women are given special priority.'
      ],
      ta: [
        'விண்ணப்பிக்கும் பெண் 20 முதல் 40 வயதுக்குள் இருக்க வேண்டும்.',
        'குடும்பத்தின் ஆண்டு வருமானம் ₹1,20,000க்கு மிகாமல் இருக்க வேண்டும்.',
        'விதவைகள், கணவரால் கைவிடப்பட்ட பெண்கள் மற்றும் மாற்றுத்திறனாளிகளுக்கு முன்னுரிமை வழங்கப்படும்.'
      ],
      hi: [
        'महिला की आयु 20 से 40 वर्ष के बीच होनी चाहिए।',
        'परिवार की वार्षिक आय ₹1,20,000 से कम होनी चाहिए।',
        'विधवा, बेसहारा एवं दिव्यांग महिलाओं को विशेष प्राथमिकता दी जाती है।'
      ]
    },
    documents: {
      en: [
        'Aadhaar Card (Mandatory)',
        'Income Certificate / Ration Card',
        'Bank Account Passbook (linked with Aadhaar)',
        'Passport Size Photograph',
        'Mobile Number for SMS OTP'
      ],
      ta: [
        'ஆதார் அட்டை (கட்டாயம்)',
        'வருமானச் சான்றிதழ் / குடும்ப அட்டை (ரேஷன் கார்டு)',
        'வங்கிக் கணக்கு புத்தகம் (ஆதாருடன் இணைக்கப்பட்டது)',
        'பாஸ்போர்ட் அளவு புகைப்படம்',
        'மொபைல் எண்'
      ],
      hi: [
        'आधार कार्ड (अनिवार्य)',
        'आय प्रमाण पत्र / राशन कार्ड',
        'बैंक खाता पासबुक (आधार से लिंक)',
        'पासपोर्ट साइज फोटो',
        'मोबाइल नंबर'
      ]
    },
    benefits: {
      en: [
        'Direct ₹15,000 digital e-voucher to purchase a high-quality electric sewing machine.',
        'Free 5-day skill training with ₹500 daily allowance (total ₹2,500 training stipend).',
        'Option to get ₹1,00,000 low-interest collateral-free loan at 5% to expand business.'
      ],
      ta: [
        'நவீன தையல் இயந்திரம் வாங்க ₹15,000 நேரடி மின்-வவுச்சர்.',
        '5 நாட்கள் இலவச தொழில் பயிற்சி மற்றும் روز ₹500 உதவித்தொகை (மொத்தம் ₹2,500).',
        'தொழிலை விரிவுபடுத்த ₹1,00,000 வரை 5% குறைந்த வட்டியில் பிணையில்லா கடன் உதவி.'
      ],
      hi: [
        'सिलाई मशीन खरीदने हेतु ₹15,000 का डिजिटल ई-वाउचर।',
        '5 दिन का मुफ्त कौशल प्रशिक्षण और ₹500 प्रतिदिन का भत्ता (कुल ₹2,500)।',
        'सिलाई केंद्र शुरू करने के लिए 5% सस्ती ब्याज दर पर ₹1 लाख तक का गारंटी-मुक्त लोन।'
      ]
    },
    steps: {
      en: [
        'Take your Aadhaar and bank passbook to your nearest Common Service Centre (CSC) or Village Panchayat office.',
        'Tell the operator: "I want to apply for PM Vishwakarma Tailor (Darzi) scheme".',
        'Complete biometric finger scan authentication (no fees to be paid).',
        'Attend 5-day local training at the designated block center.',
        'Receive the ₹15,000 voucher on your mobile to purchase your machine at an authorized store.'
      ],
      ta: [
        'உங்கள் ஆதார் அட்டை மற்றும் வங்கிக் கணக்கு புத்தகத்துடன் அருகிலுள்ள பொது சேவை மையம் (CSC) அல்லது கிராம பஞ்சாயத்து அலுவலகத்திற்குச் செல்லுங்கள்.',
        'அங்கிருக்கும் அதிகாரியிடம்: "பி.எம் விஸ்வகர்மா தையல் திட்டத்திற்கு விண்ணப்பிக்க வேண்டும்" என்று கூறுங்கள்.',
        'கைரேகை பதிவு செய்து இலவசமாக விண்ணப்பத்தை சமர்ப்பியுங்கள்.',
        'அருகிலுள்ள மையத்தில் 5 நாட்கள் இலவசப் பயிற்சியில் கலந்துகொள்ளுங்கள்.',
        'உங்கள் மொபைலில் வரும் ₹15,000 வவுச்சரைக் கொண்டு அங்கீகரிக்கப்பட்ட கடையில் தையல் இயந்திரத்தைப் பெற்றுக்கொள்ளுங்கள்.'
      ],
      hi: [
        'अपने आधार कार्ड और बैंक पासबुक के साथ नजदीकी कॉमन सर्विस सेंटर (CSC) या ग्राम पंचायत जाएं।',
        'वहां कहें: "मुझे पीएम विश्वकर्मा दर्जी योजना में आवेदन करना है"।',
        'अंगूठे का निशान (बायोमेट्रिक) लगाकर मुफ्त में फॉर्म भरवाएं।',
        'ब्लॉक केंद्र पर 5 दिन की मुफ्त ट्रेनिंग पूरी करें।',
        'मोबाइल पर ₹15,000 का वाउचर प्राप्त कर अधिकृत दुकान से नई सिलाई मशीन लें।'
      ]
    },
    followUpSuggestions: {
      en: [
        'Where is my nearest CSC centre?',
        'What if I do not know tailoring yet?',
        'Can unmarried daughters also apply?'
      ],
      ta: [
        'அருகிலுள்ள பொது சேவை மையம் (CSC) எங்குள்ளது?',
        'எனக்கு தையல் தெரியாவிட்டால் என்ன செய்வது?',
        'திருமணமாகாத பெண்களும் விண்ணப்பிக்கலாமா?'
      ],
      hi: [
        'मेरे पास का सीएससी केंद्र कहाँ है?',
        'अगर मुझे सिलाई नहीं आती तो क्या करूं?',
        'क्या अविवाहित बेटियां भी आवेदन कर सकती हैं?'
      ]
    },
    officialUrl: 'https://pmvishwakarma.gov.in',
    helpline: '1800-267-7777',
    keywords: [
      'sewing machine', 'silai machine', 'tailor', 'tailoring', 'machine',
      'தையல் இயந்திரம்', 'தையல் மெஷின்', 'தையல்', 'இலவச தையல்',
      'सिलाई मशीन', 'मुफ्त सिलाई मशीन', 'दर्जी', 'सिलाई',
      'కుట్టుమిషన్', 'కుట్టు', 'ಹೊಲಿಗೆ ಯಂತ್ರ', 'തയ്യൽ മെഷീൻ',
      'সেলাই মেশিন', 'शिलाई मशीन', 'સિલાઈ મશીન'
    ]
  },
  {
    id: 'pm-matru-vandana',
    category: 'maternity',
    icon: 'baby',
    name: {
      en: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      ta: 'பிரதம மந்திரி மாத்ரு வந்தனா யோஜனா (கர்ப்பிணி பெண்கள் உதவித்தொகை)',
      hi: 'प्रधानमंत्री मातृ वंदना योजना (गर्भवती महिला सहायता)',
      te: 'ప్రధాన మంత్రి మాతృ వందన యోజన',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ',
      ml: 'പ്രധാൻ മന്ത്രി മാതൃ വന്ദന യോജന',
      bn: 'প্রধানমন্ত্রী মাতৃ বন্দনা যোজনা',
      mr: 'प्रधानमंत्री मातृ वंदना योजना',
      gu: 'પ્રધાનમંત્રી માતૃ વંદના યોજના',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਮਾਤਰੂ ਵੰਦਨਾ ਯੋਜਨਾ',
      or: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ମାତୃ ବନ୍ଦନା ଯୋଜନା',
      ur: 'وزیر اعظم ماترو وندنا یوجنا'
    },
    shortSummary: {
      en: 'Direct cash assistance of ₹5,000 to ₹6,000 in your bank account for pregnant and lactating mothers for nutrition and medical checkups.',
      ta: 'கர்ப்பிணிப் பெண்கள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு சத்தான உணவு மற்றும் மருத்துவச் செலவிற்காக ₹5,000 முதல் ₹6,000 வரை வங்கிக் கணக்கில் நேரடியாக வழங்கப்படுகிறது.',
      hi: 'गर्भवती और स्तनपान कराने वाली माताओं के अच्छे पोषण और स्वास्थ्य जांच के लिए सरकार सीधे बैंक खाते में ₹5,000 से ₹6,000 की नकद सहायता देती है।'
    },
    targetAudience: {
      en: 'Pregnant women and lactating mothers giving birth to their first or second child (if girl child).',
      ta: 'முதல் பிரசவம் அல்லது இரண்டாவது பெண் குழந்தை பெற்றெடுக்கும் கர்ப்பிணிப் பெண்கள்.',
      hi: 'पहली बार मां बनने वाली अथवा दूसरी संतान में बेटी को जन्म देने वाली गर्भवती महिलाएं।'
    },
    eligibility: {
      en: [
        'Pregnant woman aged 19 years or older.',
        'Not a regular government or public sector employee.',
        'First living child receives ₹5,000; second child (if girl child) receives ₹6,000.'
      ],
      ta: [
        'கர்ப்பிணிப் பெண் 19 வயது அல்லது அதற்கு மேற்பட்டவராக இருக்க வேண்டும்.',
        'மத்திய / மாநில அரசு நிரந்தர ஊழியராக இருக்கக் கூடாது.',
        'முதல் குழந்தைக்கு ₹5,000; இரண்டாவது பெண் குழந்தைக்கு ₹6,000 வழங்கப்படும்.'
      ],
      hi: [
        'महिला की आयु 19 वर्ष या उससे अधिक होनी चाहिए।',
        'महिला किसी सरकारी नौकरी में नहीं होनी चाहिए।',
        'पहले बच्चे पर ₹5,000 तथा दूसरी संतान बालिका होने पर ₹6,000 मिलते हैं।'
      ]
    },
    documents: {
      en: [
        'Mother and Husband Aadhaar Cards',
        'MCP (Mother and Child Protection) Card / Thaikilavi Card from Anganwadi',
        'Bank Account Passbook in Mother’s own name',
        'Doctor / ANM pregnancy registration proof'
      ],
      ta: [
        'தாய் மற்றும் கணவரின் ஆதார் அட்டை',
        'அங்கன்வாடியில் வழங்கப்படும் தாய் சேய் பாதுகாப்பு அட்டை (MCP Card)',
        'தாயின் சொந்த பெயரிலான வங்கிக் கணக்கு புத்தகம்',
        'மருத்துவ பரிசோதனை பதிவுச் சான்று'
      ],
      hi: [
        'माता और पति का आधार कार्ड',
        'आंगनवाड़ी से मिला एमसीपी (MCP) कार्ड (टीकाकरण कार्ड)',
        'माता के अपने नाम का बैंक पासबुक',
        'गर्भावस्था पंजीकरण पर्ची'
      ]
    },
    benefits: {
      en: [
        'Instalment 1: ₹3,000 on registration of pregnancy and at least one antenatal check-up.',
        'Instalment 2: ₹2,000 after child birth registration and first cycle of vaccinations.',
        'Additional ₹1,000 bonus if institutional delivery at government hospital.'
      ],
      ta: [
        'முதல் தவணை: கர்ப்பம் பதிவு செய்து பரிசோதனை முடித்ததும் ₹3,000.',
        'இரண்டாம் தவணை: குழந்தை பிறந்து முதல் தடுப்பூசி போட்டதும் ₹2,000.',
        'அரசு மருத்துவமனையில் பிரசவம் நடந்தால் கூடுதலாக ₹1,000 ஊக்கத்தொகை.'
      ],
      hi: [
        'पहली किस्त: गर्भावस्था पंजीकरण और एक जांच पर ₹3,000।',
        'दूसरी किस्त: बच्चे के जन्म पंजीकरण और पहले टीके पर ₹2,000।',
        'सरकारी अस्पताल में प्रसव कराने पर ₹1,000 की अतिरिक्त जननी सुरक्षा सहायता।'
      ]
    },
    steps: {
      en: [
        'Visit your local Anganwadi worker, ASHA didi, or Government Primary Health Centre (PHC).',
        'Register your pregnancy within 150 days of your last menstrual period.',
        'Give photocopy of Aadhaar and your single bank account passbook.',
        'Anganwadi worker will fill the online form on PMMVY portal for free.',
        'Money is transferred directly to your bank account via DBT.'
      ],
      ta: [
        'உங்கள் உள்ளூர் அங்கன்வாடி அல்லது அரசு ஆரம்ப சுகாதார நிலையத்தை அணுகுங்கள்.',
        'கர்ப்பம் தரித்த 150 நாட்களுக்குள் உங்கள் பெயரைப் பதிவு செய்யுங்கள்.',
        'உங்கள் ஆதார் அட்டை மற்றும் வங்கிக் கணக்கு புத்தக நகலை ஆஷா / அங்கன்வாடி பணியாளரிடம் கொடுங்கள்.',
        'அவர்களே PMMVY இணையதளத்தில் இலவசமாக விண்ணப்பித்து தருவார்கள்.',
        'பணம் நேரடியாக உங்கள் வங்கிக் கணக்கில் வந்து சேரும்.'
      ],
      hi: [
        'अपनी स्थानीय आंगनवाड़ी कार्यकर्ता या आशा दीदी से मिलें।',
        'गर्भधारण के 150 दिनों के भीतर अपना पंजीकरण करवाएं।',
        'आधार कार्ड और अपने बैंक खाते की पासबुक की फोटोकॉपी जमा करें।',
        'आशा दीदी आपका ऑनलाइन फॉर्म मुफ्त में भर देंगी।',
        'राशि सीधे आपके बैंक खाते में जमा हो जाएगी।'
      ]
    },
    followUpSuggestions: {
      en: [
        'Can I get money if I deliver in private hospital?',
        'What if my bank account is not Aadhaar linked?',
        'How many months after birth can I apply?'
      ],
      ta: [
        'தனியார் மருத்துவமனையில் பிரசவம் நடந்தால் பணம் கிடைக்குமா?',
        'வங்கிக் கணக்கு ஆதாருடன் இணைக்கப்படாவிட்டால் என்ன செய்வது?',
        'குழந்தை பிறந்த எத்தனை மாதங்களுக்குள் விண்ணப்பிக்கலாம்?'
      ],
      hi: [
        'क्या प्राइवेट अस्पताल में डिलीवरी पर भी पैसा मिलता है?',
        'अगर बैंक खाता आधार से लिंक नहीं है तो क्या करें?',
        'बच्चे के जन्म के कितने दिन बाद तक आवेदन कर सकते हैं?'
      ]
    },
    officialUrl: 'https://pmmvy.wcd.gov.in',
    helpline: '1800-180-1104',
    keywords: [
      'pregnant', 'pregnancy', 'maternity', 'mother', 'baby', '5000', 'pmmvy', 'lactating',
      'கர்ப்பிணி', 'பிரசவம்', 'தாய்மை', '5000 உதவித்தொகை', 'குழந்தை', 'அங்கன்வாடி',
      'गर्भवती', 'मां', 'मातृत्व', 'डिलीवरी', 'बच्चा', '5000 रुपये', 'आशा'
    ]
  },
  {
    id: 'lakhpati-didi',
    category: 'livelihood',
    icon: 'store',
    name: {
      en: 'Lakhpati Didi Scheme (Women Self-Help Group Livelihood)',
      ta: 'இலட்சாதிபதி சகோதரி திட்டம் (மகளிர் சுயஉதவிக் குழு வாழ்வாதாரம்)',
      hi: 'लखपति दीदी योजना (महिला स्वयं सहायता समूह)',
      te: 'లక్షపతి దీదీ పథకం',
      kn: 'ಲಕ್ಷಪತಿ ದೀದಿ ಯೋಜನೆ',
      ml: 'ലഖ്പതി ദീദി പദ്ധതി',
      bn: 'লাখপতি দিদি যোজনা',
      mr: 'लखपती दीदी योजना',
      gu: 'લખપતિ દીદી યોજના',
      pa: 'ਲਖਪਤੀ ਦੀਦੀ ਸਕੀਮ',
      or: 'ଲକ୍ଷପତି ଦିଦି ଯୋଜନା',
      ur: 'لکھپتی دیدی اسکیم'
    },
    shortSummary: {
      en: 'Enables rural and urban women in Self Help Groups (SHG) to earn at least ₹1,00,000 annually through micro-enterprises, LED making, tailoring, dairy, or mushroom farming with zero-interest loans.',
      ta: 'மகளிர் சுயஉதவிக் குழு பெண்களை ஆண்டுக்கு குறைந்தபட்சம் ₹1,00,000 சம்பாதிக்க வைக்கும் திட்டம். தையல், பால் பண்ணை, சிறுதொழில் தொடங்க வட்டி இல்லா கடன் மற்றும் சிறப்புப் பயிற்சி.',
      hi: 'स्वयं सहायता समूह से जुड़ी महिलाओं को हर साल कम से कम ₹1 लाख कमाने योग्य बनाने की योजना। सिलाई, डेयरी, मशरूम उत्पादन जैसे छोटे व्यापार हेतु ब्याज-मुक्त ऋण व ट्रेनिंग।'
    },
    targetAudience: {
      en: 'Women members of Self Help Groups (SHG / Bachat Gat) or those willing to join one.',
      ta: 'மகளிர் சுயஉதவிக் குழுவில் உள்ள பெண்கள் அல்லது புதிதாக சேர விரும்பும் பெண்கள்.',
      hi: 'स्वयं सहायता समूह (SHG) की महिला सदस्य या समूह में शामिल होने की इच्छुक महिलाएं।'
    },
    eligibility: {
      en: [
        'Woman aged 18 to 55 years.',
        'Member of an active Self Help Group (SHG) or ready to join village group.',
        'Willing to undertake skill training and start or expand a micro-enterprise.'
      ],
      ta: [
        '18 முதல் 55 வயதுக்குட்பட்ட பெண்.',
        'கிராம/நகர மகளிர் சுயஉதவிக் குழுவில் உறுப்பினராக இருக்க வேண்டும் அல்லது சேர வேண்டும்.',
        'தொழில் பயிற்சி பெற்று வருமானம் தரும் தொழில் தொடங்க ஆர்வமுள்ளவராக இருக்க வேண்டும்.'
      ],
      hi: [
        'महिला की आयु 18 से 55 वर्ष होनी चाहिए।',
        'महिला स्वयं सहायता समूह (SHG) की सदस्य हो।',
        'छोटे व्यवसाय या कौशल प्रशिक्षण में भाग लेने को तैयार हो।'
      ]
    },
    documents: {
      en: [
        'Aadhaar Card',
        'SHG Membership Passbook / Group ID',
        'Individual Bank Account Details',
        'Residence Certificate / Ration Card',
        'Passport Size Photo'
      ],
      ta: [
        'ஆதார் அட்டை',
        'சுயஉதவிக் குழு உறுப்பினர் அட்டை / சேமிப்பு புத்தகம்',
        'தனிநபர் வங்கிக் கணக்கு புத்தகம்',
        'குடும்ப அட்டை (ரேஷன் கார்டு)',
        'புகைப்படம்'
      ],
      hi: [
        'आधार कार्ड',
        'स्वयं सहायता समूह सदस्यता पासबुक',
        'बैंक खाता पासबुक',
        'राशन कार्ड या निवास प्रमाण',
        'पासपोर्ट साइज फोटो'
      ]
    },
    benefits: {
      en: [
        'Subsidized / interest-free loan up to ₹5,00,000 through the SHG federation.',
        'Free professional training in plumbing, drone piloting, dairy, handicrafts, poultry, food processing.',
        'Government market linkages to sell homemade products on GeM and local markets.'
      ],
      ta: [
        'சுயஉதவிக் குழு கூட்டமைப்பு மூலம் ₹5,00,000 வரை வட்டி மானியத்துடன் கூடிய எளிய கடன்.',
        'பால் பண்ணை, ஆடு வளர்ப்பு, உணவு தயாரிப்பு, தையல் போன்ற தொழில்களில் இலவச பயிற்சி.',
        'தயாரித்த பொருட்களை சந்தைப்படுத்த நேரடி அரசு உதவி.'
      ],
      hi: [
        'समूह के माध्यम से ₹5 लाख तक का रियायती ब्याज-मुक्त लोन।',
        'डेयरी, सिलाई, हस्तशिल्प, अगरबत्ती, मशरूम की आधुनिक ट्रेनिंग।',
        'अपने उत्पादों को बेचने के लिए सरकारी मेलों और ई-कॉमर्स से जुड़ाव।'
      ]
    },
    steps: {
      en: [
        'Contact your local Panchayat Gram Pradhan, Block Development Officer (BDO), or SHG leader (CRD).',
        'If not in an SHG, join a local 10-15 woman group in your village.',
        'Submit loan request for your chosen trade (tailoring, dairy, food, shop).',
        'Complete the government-sponsored 7 to 14 day training workshop.',
        'Receive the working capital loan directly in your bank account.'
      ],
      ta: [
        'உங்கள் ஊர் மகளிர் சுயஉதவிக் குழு தலைவர் அல்லது ஊராட்சி ஒன்றிய அலுவலகத்தை (BDO) அணுகவும்.',
        'சுயஉதவிக் குழுவில் இல்லை என்றால் உடனடியாக உங்கள் பகுதியில் உள்ள குழுவில் இணையுங்கள்.',
        'நீங்கள் செய்ய விரும்பும் தொழில் திட்டத்தைத் தெரிவியுங்கள் (எ.கா: ஆடு வளர்ப்பு, தையல் கடை, மளிகை).',
        'இலவச தொழிற்பயிற்சியை முடித்தவுடன் கடன் உதவி ஒப்புதல் அளிக்கப்படும்.',
        'தொழில் தொடங்க நிதி உங்கள் வங்கிக் கணக்கில் வந்து சேரும்.'
      ],
      hi: [
        'अपनी ग्राम पंचायत के समूह सचिव या ब्लॉक विकास अधिकारी (BDO) से मिलें।',
        'यदि समूह में नहीं हैं, तो गांव के 10-15 महिलाओं के समूह से जुड़ें।',
        'अपने व्यापार का चयन करें (जैसे सिलाई, पशुपालन, दुकान)।',
        'ब्लॉक पर आयोजित होने वाली मुफ्त ट्रेनिंग में भाग लें।',
        'लोन पास होने पर व्यवसाय शुरू करें और आमदनी बढ़ाएं।'
      ]
    },
    followUpSuggestions: {
      en: [
        'How do I form a new SHG in my village?',
        'What trades have the highest profit?',
        'Can unmarried women join the group?'
      ],
      ta: [
        'எங்கள் கிராமத்தில் புதிய சுயஉதவிக் குழுவை எப்படி உருவாக்குவது?',
        'எந்தத் தொழில் செய்தால் அதிக லாபம் கிடைக்கும்?',
        'திருமணமாகாத பெண்களும் குழுவில் சேரலாமா?'
      ],
      hi: [
        'गांव में नया स्वयं सहायता समूह कैसे बनाएं?',
        'कौन सा काम शुरू करने में सबसे अधिक लाभ होता है?',
        'क्या कुंवारी लड़कियां भी समूह से जुड़ सकती हैं?'
      ]
    },
    officialUrl: 'https://nrlm.gov.in',
    helpline: '1800-180-2000',
    keywords: [
      'lakhpati didi', 'shg', 'self help group', 'loan', 'women business', 'earning', 'microfinance',
      'சுயஉதவிக் குழு', 'லட்சாதிபதி சகோதரி', 'கடன்', 'பெண்கள் தொழில்', 'சுயதொழில்',
      'लखपति दीदी', 'समूह', 'महिला लोन', 'व्यापार', 'स्वरोजगार', 'बचत गट'
    ]
  },
  {
    id: 'pm-ujjwala-yojana',
    category: 'household',
    icon: 'flame',
    name: {
      en: 'Pradhan Mantri Ujjwala Yojana (PMUY 2.0 Free Gas)',
      ta: 'பிரதம மந்திரி உஜ்வாலா திட்டம் (இலவச சமையல் எரிவாயு சிலிண்டர்)',
      hi: 'प्रधानमंत्री उज्ज्वला योजना (मुफ्त गैस कनेक्शन व चूल्हा)',
      te: 'ప్రధాన మంత్రి ఉజ్జ్వల యోజన (ఉచిత గ్యాస్)',
      kn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಉಜ್ವಲ ಯೋಜನೆ',
      ml: 'പ്രധാൻ മന്ത്രി ഉജ്ജ്വല യോജന',
      bn: 'প্রধানমন্ত্রী উজ্জ্বল যোজনা',
      mr: 'प्रधानमंत्री उज्ज्वला योजना',
      gu: 'પ્રધાનમંત્રી ઉજ્જવલા યોજના',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਉੱਜਵਲਾ ਯੋਜਨਾ',
      or: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଉଜ୍ଜ୍ୱଳା ଯୋଜନା',
      ur: 'وزیر اعظم اجولا یوجنا'
    },
    shortSummary: {
      en: 'Provides poor women with a 100% free LPG gas connection, free gas stove, first cylinder filled free, and ongoing ₹300 per cylinder subsidy.',
      ta: 'ஏழைப் பெண்களுக்கு 100% இலவச சமையல் எரிவாயு இணைப்பு, இலவச கேஸ் அடுப்பு, முதல் சிலிண்டர் இலவசம் மற்றும் சிலிண்டருக்கு ₹300 நேரடி மானியம்.',
      hi: 'गरीब परिवारों की महिलाओं को बिल्कुल मुफ्त एलपीजी गैस कनेक्शन, मुफ्त गैस चूल्हा, पहला भरा हुआ सिलेंडर और ₹300 प्रति सिलेंडर की सब्सिडी।'
    },
    targetAudience: {
      en: 'Adult women belonging to BPL (Below Poverty Line), SC/ST, PM Awas, or forest-dwelling households with no existing LPG connection.',
      ta: 'குடும்பத்தில் இதுவரை கேஸ் இணைப்பு இல்லாத பி.பி.எல் (வறுமைக் கோட்டிற்குட்பட்ட) குடும்பப் பெண்கள்.',
      hi: 'बीपीएल, राशन कार्ड धारक या गरीब परिवारों की वयस्क महिलाएं जिनके घर में कोई गैस कनेक्शन न हो।'
    },
    eligibility: {
      en: [
        'Applicant must be an adult woman aged 18 or above.',
        'No other LPG connection in the same household.',
        'Household should be BPL, Antyodaya (AAY), SC/ST, or declared economically weaker.'
      ],
      ta: [
        'விண்ணப்பிக்கும் பெண் 18 வயது அல்லது அதற்கு மேற்பட்டவராக இருக்க வேண்டும்.',
        'குடும்பத்தில் வேறு யாருடைய பெயரிலும் கேஸ் இணைப்பு இருக்கக் கூடாது.',
        'வறுமைக் கோட்டிற்குட்பட்ட அல்லது ரேஷன் அட்டை உள்ள குடும்பமாக இருக்க வேண்டும்.'
      ],
      hi: [
        'आवेदक महिला की उम्र कम से कम 18 वर्ष होनी चाहिए।',
        'घर में पहले से किसी के नाम पर कोई गैस कनेक्शन नहीं होना चाहिए।',
        'राशन कार्ड या बीपीएल सूची में नाम होना चाहिए।'
      ]
    },
    documents: {
      en: [
        'Aadhaar Card of Applicant and all adult family members',
        'Ration Card displaying family members',
        'Bank Passbook with IFSC code (linked to Aadhaar for subsidy)',
        '1 Passport Photo'
      ],
      ta: [
        'விண்ணப்பதாரர் மற்றும் குடும்ப உறுப்பினர்களின் ஆதார் அட்டை',
        'குடும்ப அட்டை (ஸ்மார்ட் ரேஷன் கார்டு)',
        'வங்கிக் கணக்கு புத்தகம் (மானியம் பெற ஆதாருடன் இணைக்கப்பட்டது)',
        'பாஸ்போர்ட் புகைப்படம்'
      ],
      hi: [
        'महिला एवं परिवार के सभी वयस्कों का आधार कार्ड',
        'राशन कार्ड (जिसमें परिवार के सदस्यों के नाम हों)',
        'आधार से लिंक बैंक पासबुक',
        'पासपोर्ट साइज फोटो'
      ]
    },
    benefits: {
      en: [
        'Free LPG connection (Security deposit for cylinder and regulator is fully paid by Government).',
        'Free double-burner LPG gas stove (hotplate) handed at time of connection.',
        'First 14.2 kg LPG cylinder filled and delivered completely free of cost.',
        '₹300 direct cash subsidy in bank account on every refill cylinder.'
      ],
      ta: [
        'முற்றிலும் இலவச சிலிண்டர் இணைப்பு மற்றும் ரெகுலேட்டர்.',
        'இலவச இரட்டை பர்னர் சமையல் கேஸ் அடுப்பு.',
        'முதல் சிலிண்டர் 100% இலவசமாக நிரப்பி தரப்படும்.',
        'மறு நிரப்பும் ஒவ்வொரு சிலிண்டருக்கும் ₹300 நேரடி வங்கி மானியம்.'
      ],
      hi: [
        'मुफ्त गैस कनेक्शन और रेगुलेटर।',
        'दो बर्नर वाला नया गैस चूल्हा बिल्कुल मुफ्त।',
        'पहला भरा हुआ सिलेंडर बिना किसी भुगतान के।',
        'हर गैस रिफिल पर ₹300 की सीधी बैंक सब्सिडी।'
      ]
    },
    steps: {
      en: [
        'Visit your nearest Indane, Bharat Gas, or HP Gas distributor office.',
        'Ask the counter staff for the "Ujjwala 2.0 Application Form".',
        'Submit form with Aadhaar and Ration card copies (no middleman required).',
        'Gas agency will verify within 7-10 days.',
        'Collect your free gas stove, cylinder, and blue passbook from the agency.'
      ],
      ta: [
        'அருகிலுள்ள இந்தேன் (Indane), பாரத் கேஸ் அல்லது ஹெச்பி (HP) கேஸ் ஏஜென்சிக்குச் செல்லுங்கள்.',
        'அங்கிருக்கும் அலுவலரிடம்: "உஜ்வாலா 2.0 இலவச கேஸ் படிவம் வேண்டும்" என்று கேளுங்கள்.',
        'படிவத்தில் விவரங்களை பூர்த்தி செய்து ஆதார், ரேஷன் அட்டை நகல்களை இணையுங்கள்.',
        '7-10 நாட்களில் சரிபார்க்கப்பட்டு உங்கள் கேஸ் இணைப்பு வழங்கப்படும்.',
        'இலவச கேஸ் அடுப்பு மற்றும் சிலிண்டரைப் பெற்றுக்கொள்ளுங்கள்.'
      ],
      hi: [
        'अपने नजदीकी इंडेन, भारत गैस या एचपी गैस एजेंसी जाएं।',
        'वहां कहें: "मुझे उज्ज्वला 2.0 के तहत मुफ्त गैस कनेक्शन चाहिए"।',
        'आधार और राशन कार्ड की कॉपी लगाकर फॉर्म जमा करें।',
        '7 से 10 दिनों में एजेंसी आपके कनेक्शन को मंजूर कर लेगी।',
        'एजेंसी से मुफ्त चूल्हा, सिलेंडर और पासबुक ले आएं।'
      ]
    },
    followUpSuggestions: {
      en: [
        'What if my ration card does not have my name?',
        'How do I get the ₹300 cylinder subsidy?',
        'Do I need to pay any money to the gas delivery person?'
      ],
      ta: [
        'ரேஷன் அட்டையில் பெயர் இல்லையென்றால் என்ன செய்வது?',
        '₹300 மானியத் தொகை எப்போது வங்கியில் வரும்?',
        'சிலிண்டர் கொண்டு வருபவருக்கு பணம் கொடுக்க வேண்டுமா?'
      ],
      hi: [
        'राशन कार्ड में नाम न होने पर क्या करें?',
        'हर सिलेंडर पर ₹300 सब्सिडी कैसे आती है?',
        'क्या गैस डिलीवर करने वाले को कोई अतिरिक्त पैसा देना है?'
      ]
    },
    officialUrl: 'https://pmuy.gov.in',
    helpline: '1800-266-6696',
    keywords: [
      'gas', 'lpg', 'cylinder', 'cooking gas', 'ujjwala', 'stove', 'chulha',
      'கேஸ்', 'எரிவாயு', 'சிலிண்டர்', 'உஜ்வாலா', 'சமையல் கேஸ்', 'இலவச சிலிண்டர்',
      'गैस', 'सिलेंडर', 'उज्ज्वला', 'चूल्हा', 'मुफ्त गैस', 'एलपीजी'
    ]
  },
  {
    id: 'sukanya-samriddhi-yojana',
    category: 'education',
    icon: 'graduation-cap',
    name: {
      en: 'Sukanya Samriddhi Yojana (Girl Child Future & Education)',
      ta: 'சுகன்யா சம்ரித்தி யோஜனா (செல்வமகள் சேமிப்புத் திட்டம்)',
      hi: 'सुकन्या समृद्धि योजना (बेटी बचाओ बेटी पढ़ाओ बचत खाता)',
      te: 'సుకన్య సమృద్ధి యోజన',
      kn: 'ಸುಕನ್ಯಾ ಸಮೃದ್ಧಿ ಯೋಜನೆ',
      ml: 'സുകന്യാ സമൃദ്ധി യോജന',
      bn: 'সুকন্যা সমৃদ্ধি যোজনা',
      mr: 'सुकन्या समृद्धी योजना',
      gu: 'સુકન્યા સમૃદ્ધિ યોજના',
      pa: 'ਸੁਕੰਨਿਆ ਸਮ੍ਰਿਧੀ ਸਕੀਮ',
      or: 'ସୁକନ୍ୟା ସମୃଦ୍ଧି ଯୋଜନା',
      ur: 'سوکنیا سمردھی یوجنا'
    },
    shortSummary: {
      en: 'High-interest (8.2%) government-backed savings scheme for girl children below 10 years to fund higher education and marriage, starting with just ₹250.',
      ta: '10 வயதுக்குட்பட்ட பெண் குழந்தைகளின் உயர் கல்வி மற்றும் எதிர்காலத்திற்காக வெறும் ₹250-ல் தொடங்கக்கூடிய அதிக வட்டி (8.2%) தரும் அரசு சேமிப்புத் திட்டம்.',
      hi: '10 वर्ष से कम उम्र की बेटियों की उच्च शिक्षा और शादी के लिए सरकार की सबसे अधिक ब्याज (8.2%) देने वाली बचत योजना, मात्र ₹250 से शुरू।'
    },
    targetAudience: {
      en: 'Parents or guardians of a girl child from birth up to 10 years of age.',
      ta: 'பிறந்தது முதல் 10 வயதுக்குட்பட்ட பெண் குழந்தையைக் கொண்ட பெற்றோர்.',
      hi: 'जन्म से लेकर 10 वर्ष तक की बेटी के माता-पिता या अभिभावक।'
    },
    eligibility: {
      en: [
        'Girl child must be an Indian resident below 10 years old.',
        'Account can be opened by biological parents or legal guardians.',
        'Maximum two accounts per family (one for each girl child; exception for triplets/twins).'
      ],
      ta: [
        'பெண் குழந்தை 10 வயதுக்குள் இருக்க வேண்டும்.',
        'பெற்றோர் அல்லது பாதுகாவலர் குழந்தையின் பெயரில் கணக்கு துவங்கலாம்.',
        'ஒரு குடும்பத்தில் அதிகபட்சமாக இரண்டு பெண் குழந்தைகளுக்கு மட்டுமே தொடங்க முடியும்.'
      ],
      hi: [
        'बेटी की आयु 10 वर्ष से कम होनी चाहिए।',
        'माता-पिता या कानूनी अभिभावक बेटी के नाम पर खाता खोल सकते हैं।',
        'एक परिवार में अधिकतम दो बेटियों के खाते खोले जा सकते हैं।'
      ]
    },
    documents: {
      en: [
        'Birth Certificate of the girl child',
        'Aadhaar card and PAN card of parent/guardian',
        'Address proof (Ration card / Electricity bill)',
        'Initial deposit of minimum ₹250 cash or cheque'
      ],
      ta: [
        'பெண் குழந்தையின் பிறப்புச் சான்றிதழ்',
        'பெற்றோரின் ஆதார் அட்டை மற்றும் பான் கார்டு',
        'முகவரிச் சான்று',
        'ஆரம்ப வைப்புத்தொகை குறைந்தபட்சம் ₹250'
      ],
      hi: [
        'बेटी का जन्म प्रमाण पत्र (Birth Certificate)',
        'माता-पिता का आधार कार्ड व पैन कार्ड',
        'निवास प्रमाण पत्र',
        'शुरुआती जमा राशि न्यूनतम ₹250'
      ]
    },
    benefits: {
      en: [
        'Guaranteed high interest rate of 8.2% per annum, compounded annually.',
        '100% tax exemption under Section 80C on deposit, interest, and maturity.',
        'Partial 50% withdrawal allowed after daughter turns 18 for college admission fees.'
      ],
      ta: [
        'ஆண்டுக்கு 8.2% என்ற அதிகபட்ச அரசு வட்டி.',
        'முதலீடு, வட்டி மற்றும் முதிர்வுத் தொகை என அனைத்திற்கும் 100% வரிவிலக்கு.',
        'பெண் குழந்தைக்கு 18 வயது நிரம்பியதும் கல்லூரி கட்டணத்திற்காக 50% பணத்தை எடுத்துக் கொள்ளலாம்.'
      ],
      hi: [
        'सालाना 8.2% की सुरक्षित सरकारी ब्याज दर।',
        'जमा, ब्याज और मैच्योरिटी राशि पर पूरी तरह टैक्स छूट।',
        'बेटी के 18 वर्ष की होने पर कॉलेज पढ़ाई के लिए 50% निकासी की सुविधा।'
      ]
    },
    steps: {
      en: [
        'Visit your nearest Post Office (Dawk Ghar) or authorized public bank (SBI, PNB, etc.).',
        'Ask the counter for "Sukanya Samriddhi Yojana (SSY) Account Form".',
        'Attach daughter’s birth certificate and your Aadhaar copy.',
        'Deposit minimum ₹250 to activate the passbook.',
        'Keep depositing as little as ₹250 or whatever you save every month.'
      ],
      ta: [
        'உங்கள் அருகிலுள்ள தபால் அலுவலகம் (Post Office) அல்லது பொதுத்துறை வங்கிக்குச் செல்லுங்கள்.',
        'அங்கிருக்கும் அதிகாரியிடம்: "செல்வமகள் சேமிப்புத் திட்டப் படிவம் வேண்டும்" என்று கேளுங்கள்.',
        'குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் உங்கள் ஆதார் நகலை இணையுங்கள்.',
        'குறைந்தபட்சம் ₹250 செலுத்தி சேமிப்புப் புத்தகத்தைப் பெறுங்கள்.',
        'ஒவ்வொரு மாதமும் உங்களால் முடிந்த தொகையை இதில் சேமித்து வாருங்கள்.'
      ],
      hi: [
        'नजदीकी डाकघर (Post Office) या सरकारी बैंक शाखा जाएं।',
        'काउंटर पर कहें: "सुकन्या समृद्धि योजना का खाता खोलना है"।',
        'बेटी का जन्म प्रमाण पत्र और अपना आधार कार्ड लगाकर फॉर्म भरें।',
        'कम से कम ₹250 जमा करके पासबुक प्राप्त करें।',
        'हर महीने अपनी बचत के अनुसार पैसे जमा करते रहें।'
      ]
    },
    followUpSuggestions: {
      en: [
        'What is the minimum and maximum amount I can deposit each year?',
        'Can I open the account if my daughter is already 9 years old?',
        'How many years do I need to deposit money?'
      ],
      ta: [
        'ஒரு ஆண்டில் குறைந்தபட்சம் மற்றும் அதிகபட்சமாக எவ்வளவு பணம் போடலாம்?',
        'என் மகளுக்கு 9 வயதாகிவிட்டால் இப்போது தொடங்கலாமா?',
        'எத்தனை வருடங்கள் இதில் பணம் கட்ட வேண்டும்?'
      ],
      hi: [
        'साल में कम से कम और ज्यादा से ज्यादा कितना पैसा जमा कर सकते हैं?',
        'क्या 9 साल की बेटी का खाता अभी खुल सकता है?',
        'कितने वर्षों तक पैसा जमा करना पड़ता है?'
      ]
    },
    officialUrl: 'https://www.indiapost.gov.in',
    helpline: '1800-266-6868',
    keywords: [
      'daughter', 'girl child', 'sukanya', 'ssy', 'child education', 'savings', 'post office',
      'செல்வமகள்', 'பெண் குழந்தை', 'சுகன்யா', 'சேமிப்பு', 'தபால் நிலையம்', 'மகள்',
      'सुकन्या', 'बेटी', 'बालिका', 'डाकघर', 'बचत', 'पढ़ाई'
    ]
  },
  {
    id: 'mahila-samman-savings',
    category: 'finance',
    icon: 'banknote',
    name: {
      en: 'Mahila Samman Savings Certificate (MSSC)',
      ta: 'மகிளா சம்மான் சேமிப்புப் பத்திரம் (பெண்களுக்கான 7.5% வட்டி திட்டம்)',
      hi: 'महिला सम्मान बचत पत्र (महिलाओं के लिए 7.5% सुरक्षित ब्याज)',
      te: 'మహిళా సమ్మాన్ పొదుపు పత్రం',
      kn: 'ಮಹಿಳಾ ಸಮ್ಮಾನ್ ಉಳಿತಾಯ ಪ್ರಮಾಣಪತ್ರ',
      ml: 'മഹിളാ സമ്മാൻ സേവിംഗ്സ് സർട്ടിഫിക്കറ്റ്',
      bn: 'মহিলা সম্মান সঞ্চয় শংসাপত্র',
      mr: 'महिला सन्मान बचत प्रमाणपत्र',
      gu: 'મહિલા સન્માન બચત પ્રમાણપત્ર',
      pa: 'ਮਹਿਲਾ ਸਨਮਾਨ ਬੱਚਤ ਸਰਟੀਫਿਕੇਟ',
      or: 'ମହିଳା ସମ୍ମାନ ସଞ୍ଚୟ ପ୍ରମାଣପତ୍ର',
      ur: 'خواتین سمان سیونگز سرٹیفکیٹ'
    },
    shortSummary: {
      en: 'A 2-year government fixed deposit designed exclusively for women offering an attractive guaranteed interest of 7.5% with flexible partial withdrawal.',
      ta: 'பெண்களுக்கான 2 ஆண்டு பிரத்யேக அரசு வைப்பு நிதித் திட்டம். 7.5% நிலையான உத்தரவாத வட்டி மற்றும் தேவைப்படும்போது 40% பணத்தை எடுக்கும் வசதி.',
      hi: 'महिलाओं और बालिकाओं के लिए 2 वर्ष की विशेष सरकारी एफडी स्कीम, जिसमें 7.5% का आकर्षक ब्याज और 1 साल बाद 40% आंशिक निकासी की सुविधा मिलती है।'
    },
    targetAudience: {
      en: 'Any Indian woman of any age, or a guardian on behalf of a minor girl.',
      ta: 'எந்தவொரு இந்தியப் பெண் அல்லது சிறுமிகள்.',
      hi: 'किसी भी उम्र की भारतीय महिला या नाबालिग बालिका।'
    },
    eligibility: {
      en: [
        'Open to any woman citizen of India without any income restriction.',
        'Deposit can be from ₹1,000 up to maximum ₹2,00,000.',
        'Tenure is fixed for 2 years.'
      ],
      ta: [
        'வருமான வரம்பு எதுவுமின்றி அனைத்து இந்தியப் பெண்களும் சேரலாம்.',
        'குறைந்தபட்சம் ₹1,000 முதல் அதிகபட்சம் ₹2,00,000 வரை சேமிக்கலாம்.',
        'திட்டத்தின் காலம் 2 ஆண்டுகள்.'
      ],
      hi: [
        'भारत की कोई भी महिला बिना किसी आय सीमा के खाता खोल सकती है।',
        'न्यूनतम ₹1,000 से अधिकतम ₹2,00,000 तक जमा किए जा सकते हैं।',
        'यह जमा 2 साल की अवधि के लिए होता है।'
      ]
    },
    documents: {
      en: [
        'Aadhaar Card',
        'PAN Card (or Form 60)',
        'KYC Form from Post Office / Bank',
        '2 Passport Size Photographs'
      ],
      ta: [
        'ஆதார் அட்டை',
        'பான் கார்டு (அல்லது படிவம் 60)',
        'தபால் நிலைய / வங்கி படிவம்',
        '2 பாஸ்போர்ட் புகைப்படங்கள்'
      ],
      hi: [
        'आधार कार्ड',
        'पैन कार्ड (या फॉर्म 60)',
        'डाकघर या बैंक का आवेदन फॉर्म',
        '2 पासपोर्ट साइज फोटो'
      ]
    },
    benefits: {
      en: [
        'High 7.5% annual interest rate calculated quarterly.',
        'Partial withdrawal up to 40% allowed after 1 year for emergencies.',
        '100% sovereign government safety guarantee on your hard-earned money.'
      ],
      ta: [
        'ஆண்டுக்கு 7.5% அதிக நிலையான வட்டி.',
        '1 ஆண்டு முடிந்ததும் அவசர தேவைக்கு 40% பணத்தை திரும்பப் பெற்றுக் கொள்ளலாம்.',
        'அரசாங்கத்தின் முழுமையான பாதுகாப்பு உத்திரவாதம்.'
      ],
      hi: [
        '7.5% का गारंटीड ब्याज, जो हर तिमाही जुड़ता है।',
        '1 साल बाद जरूरत पड़ने पर 40% तक पैसा निकालने की छूट।',
        'सरकारी गारंटी के साथ पूरी तरह सुरक्षित निवेश।'
      ]
    },
    steps: {
      en: [
        'Walk into any Post Office or public sector bank (like Canara, Bank of Baroda, SBI).',
        'Fill Form-1 for "Mahila Samman Savings Certificate".',
        'Submit copy of Aadhaar, PAN card, and deposit cash/cheque.',
        'Receive the official printed certificate and passbook on the spot.'
      ],
      ta: [
        'அருகிலுள்ள தபால் அலுவலகம் அல்லது அரசு வங்கிக்குச் செல்லுங்கள்.',
        'மகிளா சம்மான் சேமிப்புப் படிவத்தைப் பூர்த்தி செய்யுங்கள்.',
        'ஆதார் நகல் மற்றும் பணத்தை செலுத்துங்கள்.',
        'உடனடியாக அதிகாரப்பூர்வ சான்றிதழ் மற்றும் சேமிப்புப் புத்தகத்தைப் பெறுங்கள்.'
      ],
      hi: [
        'नजदीकी डाकघर या किसी भी सरकारी बैंक जाएं।',
        'महिला सम्मान बचत पत्र का फॉर्म भरें।',
        'आधार कार्ड की प्रति और चेक या नकद राशि जमा करें।',
        'तुरंत रसीद और पासबुक प्राप्त करें।'
      ]
    },
    followUpSuggestions: {
      en: [
        'Can I open multiple accounts in different banks?',
        'What is the return on depositing ₹50,000 for 2 years?',
        'Is interest taxed?'
      ],
      ta: [
        'பல்வேறு வங்கிகளில் பல கணக்குகள் திறக்கலாமா?',
        '₹50,000 செலுத்தினால் 2 வருட முடிவில் எவ்வளவு கிடைக்கும்?',
        'வட்டிக்கு வரி உண்டா?'
      ],
      hi: [
        'क्या अलग-अलग बैंकों में कई खाते खोले जा सकते हैं?',
        '₹50,000 जमा करने पर 2 साल बाद कितना पैसा मिलेगा?',
        'क्या इस ब्याज पर टैक्स कटता है?'
      ]
    },
    officialUrl: 'https://www.indiapost.gov.in',
    helpline: '1800-266-6868',
    keywords: [
      'mahila samman', 'mssc', 'fd', 'fixed deposit', 'interest', 'savings', 'safe money',
      'மகிளா சம்மான்', 'சேமிப்பு பத்திரம்', 'வட்டி', 'வைப்பு நிதி', 'தபால் நிலையம்',
      'महिला सम्मान', 'बचत पत्र', 'ब्याज', 'एफडी', 'सुरक्षित बचत'
    ]
  }
];

export const getSchemeById = (id: string): SchemeData | undefined => {
  return CURATED_SCHEMES.find(s => s.id === id);
};

export const matchSchemeByKeywords = (query: string): SchemeData => {
  const normalized = query.toLowerCase();
  for (const scheme of CURATED_SCHEMES) {
    if (scheme.keywords.some(kw => normalized.includes(kw.toLowerCase()))) {
      return scheme;
    }
  }
  // If query mentions sewing, tailoring, machine
  if (/தையல்|மெஷின்|सिलाई|दर्जी|कुట్టు|sew|tailor|machine/i.test(normalized)) {
    return CURATED_SCHEMES[0];
  }
  // If mentions pregnant, baby, delivery
  if (/கர்ப்பிணி|பிரசவம்|குழந்தை|गर्भवती|डिलीवरी|बच्चा|pregnant|baby|matern/i.test(normalized)) {
    return CURATED_SCHEMES[1];
  }
  // If mentions gas, stove, cylinder
  if (/கேஸ்|சிலிண்டர்|गैस|चूल्हा|cylinder|gas|stove|ujjwala/i.test(normalized)) {
    return CURATED_SCHEMES[3];
  }
  // If mentions daughter, girl, child education
  if (/மகள்|செல்வமகள்|பெண் குழந்தை|बेटी|कन्या|daughter|girl|sukanya/i.test(normalized)) {
    return CURATED_SCHEMES[4];
  }
  // If mentions business, loan, group, SHG
  if (/சுயதொழில்|கடன்|சுயஉதவி|लोन|व्यापार|समूह|shg|business|livelihood|lakhpati/i.test(normalized)) {
    return CURATED_SCHEMES[2];
  }
  // Default to Sewing Machine / Women Empowerment
  return CURATED_SCHEMES[0];
};
