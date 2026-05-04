import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQSectionProps {
  onQuestionClick: (question: string, category: string) => void;
}

export function FAQSection({ onQuestionClick }: FAQSectionProps) {
  const { language } = useLanguage();

  const faqsByLang = {
    English: [
      {
        category: "government",
        title: "Government Schemes",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["Eligibility for PM-KISAN?", "How to get an Aadhaar card?", "How to apply for Old Age Pension?", "How to get an Ayushman Bharat card?"],
      },
      {
        category: "health",
        title: "Health",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["What to do in case of fever?", "Symptoms of Diabetes?", "Diet during pregnancy?", "What is the vaccination schedule?"],
      },
      {
        category: "farming",
        title: "Farming",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["Cure for Yellow Rust in wheat?", "Right time to sow paddy?", "How to make organic manure?", "How to get crop insurance?"],
      },
      {
        category: "education",
        title: "Education",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["What to do after 10th?", "How to apply for scholarships?", "How to learn math easily?", "How to study online?"],
      },
    ],
    Hindi: [
      {
        category: "government",
        title: "सरकारी योजनाएं",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN योजना की पात्रता क्या है?", "आधार कार्ड कैसे बनवाएं?", "वृद्धा पेंशन के लिए आवेदन कैसे करें?", "आयुष्मान भारत कार्ड कैसे प्राप्त करें?"],
      },
      {
        category: "health",
        title: "स्वास्थ्य",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["बुखार आने पर क्या करें?", "डायबिटीज के लक्षण क्या हैं?", "गर्भावस्था में क्या खाना चाहिए?", "टीकाकरण का समय क्या है?"],
      },
      {
        category: "farming",
        title: "खेती-किसानी",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["गेहूं में पीला रतुआ रोग का इलाज?", "धान की बुवाई का सही समय?", "जैविक खाद कैसे बनाएं?", "फसल बीमा कैसे करवाएं?"],
      },
      {
        category: "education",
        title: "शिक्षा",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10वीं के बाद क्या करें?", "छात्रवृत्ति के लिए आवेदन कैसे करें?", "गणित कैसे सीखें आसानी से?", "ऑनलाइन पढ़ाई कैसे करें?"],
      },
    ],
    Punjabi: [
      {
        category: "government",
        title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN ਯੋਜਨਾ ਦੀ ਪਾਤਰਤਾ?", "ਆਧਾਰ ਕਾਰਡ ਕਿਵੇਂ ਬਣਾਈਏ?", "ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਲਈ ਅਪਲਾਈ ਕਿਵੇਂ ਕਰੀਏ?", "ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ਕਾਰਡ ਕਿਵੇਂ ਪ੍ਰਾਪਤ ਕਰੀਏ?"],
      },
      {
        category: "health",
        title: "ਸਿਹਤ",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["ਬੁਖਾਰ ਹੋਣ 'ਤੇ ਕੀ ਕਰੀਏ?", "ਸ਼ੂਗਰ ਦੇ ਲੱਛਣ ਕੀ ਹਨ?", "ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਖੁਰਾਕ?", "ਟੀਕਾਕਰਨ ਦਾ ਸਮਾਂ?"],
      },
      {
        category: "farming",
        title: "ਖੇਤੀਬਾੜੀ",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["ਕਣਕ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਇਲਾਜ?", "ਝੋਨੇ ਦੀ ਬਿਜਾਈ ਦਾ ਸਹੀ ਸਮਾਂ?", "ਜੈਵਿਕ ਖਾਦ ਕਿਵੇਂ ਬਣਾਈਏ?", "ਫਸਲ ਬੀਮਾ ਕਿਵੇਂ ਕਰਵਾਈਏ?"],
      },
      {
        category: "education",
        title: "ਸਿੱਖਿਆ",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10ਵੀਂ ਤੋਂ ਬਾਅਦ ਕੀ ਕਰੀਏ?", "ਵਜ਼ੀਫ਼ੇ ਲਈ ਅਪਲਾਈ ਕਿਵੇਂ ਕਰੀਏ?", "ਗਣਿਤ ਆਸਾਨੀ ਨਾਲ ਕਿਵੇਂ ਸਿੱਖੀਏ?", "ਆਨਲਾਈਨ ਪੜ੍ਹਾਈ ਕਿਵੇਂ ਕਰੀਏ?"],
      },
    ],
    Marathi: [
      {
        category: "government",
        title: "सरकारी योजना",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN योजनेची पात्रता काय आहे?", "आधार कार्ड कसे काढावे?", "वृद्धापकाळ पेन्शनसाठी अर्ज कसा करावा?", "आयुष्मान भारत कार्ड कसे मिळवावे?"],
      },
      {
        category: "health",
        title: "आरोग्य",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["ताप आल्यावर काय करावे?", "मधुमेहाची लक्षणे काय आहेत?", "गरोदरपणात काय खावे?", "लसीकरणाची वेळ कोणती?"],
      },
      {
        category: "farming",
        title: "शेती",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["गव्हातील पिवळ्या तांबेरा रोगावर उपाय?", "भात पेरणीची योग्य वेळ?", "सेंद्रिय खत कसे बनवावे?", "पीक विमा कसा काढावा?"],
      },
      {
        category: "education",
        title: "शिक्षण",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10वी नंतर काय करावे?", "शिष्यवृत्तीसाठी अर्ज कसा करावा?", "गणित सोप्या पद्धतीने कसे शिकावे?", "ऑनलाइन अभ्यास कसा करावा?"],
      },
    ],
    Gujarati: [
      {
        category: "government",
        title: "સરકારી યોજનાઓ",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN યોજના માટે પાત્રતા?", "આધાર કાર્ડ કેવી રીતે મેળવવું?", "વૃદ્ધ પેન્શન માટે અરજી કેવી રીતે કરવી?", "આયુષ્માન ભારત કાર્ડ કેવી રીતે મેળવવું?"],
      },
      {
        category: "health",
        title: "આરોગ્ય",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["તાવ આવે તો શું કરવું?", "ડાયાબિટીસનાં લક્ષણો શું છે?", "ગર્ભાવસ્થા દરમિયાન આહાર?", "રસીકરણનો સમય?"],
      },
      {
        category: "farming",
        title: "ખેતી",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["ઘઉંમાં પીળા રતવા રોગનો ઈલાજ?", "ડાંગર વાવવાનો સાચો સમય?", "જૈવિક ખાતર કેવી રીતે બનાવવું?", "પાક વીમો કેવી રીતે લેવો?"],
      },
      {
        category: "education",
        title: "શિક્ષણ",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10મા પછી શું કરવું?", "શિષ્યવૃત્તિ માટે અરજી કેવી રીતે કરવી?", "ગણિત સરળતાથી કેવી રીતે શીખવું?", "ઓનલાઈન અભ્યાસ કેવી રીતે કરવો?"],
      },
    ],
    Bengali: [
      {
        category: "government",
        title: "সরকারি প্রকল্প",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN প্রকল্পের যোগ্যতা কী?", "কীভাবে আধার কার্ড তৈরি করবেন?", "বার্ধক্য ভাতার জন্য কীভাবে আবেদন করবেন?", "আয়ুষ্মান ভারত কার্ড কীভাবে পাবেন?"],
      },
      {
        category: "health",
        title: "স্বাস্থ্য",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["জ্বর হলে কী করবেন?", "ডায়াবেটিসের লক্ষণ কী?", "গর্ভাবস্থায় কী খাবেন?", "টিকাদানের সময়সূচি?"],
      },
      {
        category: "farming",
        title: "কৃষি",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["গমের হলুদ রাস্ট রোগের প্রতিকার?", "ধান চাষের সঠিক সময়?", "কীভাবে জৈব সার তৈরি করবেন?", "কীভাবে শস্য বীমা করবেন?"],
      },
      {
        category: "education",
        title: "শিক্ষা",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["দশম শ্রেণীর পর কী করবেন?", "স্কলারশিপের জন্য কীভাবে আবেদন করবেন?", "কীভাবে সহজে গণিত শিখবেন?", "কীভাবে অনলাইনে পড়াশোনা করবেন?"],
      },
    ],
    Tamil: [
      {
        category: "government",
        title: "அரசு திட்டங்கள்",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN தகுதி என்ன?", "ஆதார் அட்டை பெறுவது எப்படி?", "முதியோர் ஓய்வூதியத்திற்கு விண்ணப்பிப்பது எப்படி?", "ஆயுஷ்மான் பாரத் அட்டை பெறுவது எப்படி?"],
      },
      {
        category: "health",
        title: "சுகாதாரம்",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["காய்ச்சல் வந்தால் என்ன செய்வது?", "நீரிழிவு நோயின் அறிகுறிகள்?", "கர்ப்ப காலத்தில் உணவுமுறை?", "தடுப்பூசி அட்டவணை?"],
      },
      {
        category: "farming",
        title: "விவசாயம்",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["கோதுமையில் மஞ்சள் துரு நோய்க்கான தீர்வு?", "நெல் விதைக்க சரியான நேரம்?", "இயற்கை உரம் தயாரிப்பது எப்படி?", "பயிர் காப்பீடு பெறுவது எப்படி?"],
      },
      {
        category: "education",
        title: "கல்வி",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10-ம் வகுப்புக்குப் பிறகு என்ன செய்வது?", "உதவித்தொகைக்கு விண்ணப்பிப்பது எப்படி?", "கணிதத்தை எளிதாகக் கற்றுக்கொள்வது எப்படி?", "ஆன்லைனில் படிப்பது எப்படி?"],
      },
    ],
    Telugu: [
      {
        category: "government",
        title: "ప్రభుత్వ పథకాలు",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN అర్హత ఏమిటి?", "ఆధార్ కార్డు ఎలా పొందాలి?", "వృద్ధాప్య పింఛను కోసం ఎలా దరఖాస్తు చేయాలి?", "ఆయుష్మాన్ భారత్ కార్డు ఎలా పొందాలి?"],
      },
      {
        category: "health",
        title: "ఆరోగ్యం",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["జ్వరం వస్తే ఏం చేయాలి?", "మధుమేహం లక్షణాలు?", "గర్భధారణ సమయంలో ఆహారం?", "టీకాల షెడ్యూల్?"],
      },
      {
        category: "farming",
        title: "వ్యవసాయం",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["గోధుమలో పసుపు రస్ట్ వ్యాధికి నివారణ?", "వరి నాటడానికి సరైన సమయం?", "సేంద్రియ ఎరువు ఎలా తయారు చేయాలి?", "పంట బీమా ఎలా చేయించుకోవాలి?"],
      },
      {
        category: "education",
        title: "విద్య",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10వ తరగతి తర్వాత ఏం చేయాలి?", "స్కాలర్‌షిప్‌ల కోసం ఎలా దరఖాస్తు చేయాలి?", "గణితాన్ని సులభంగా ఎలా నేర్చుకోవాలి?", "ఆన్‌లైన్‌లో ఎలా చదువుకోవాలి?"],
      },
    ],
    Kannada: [
      {
        category: "government",
        title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN ಅರ್ಹತೆ ಏನು?", "ಆಧಾರ್ ಕಾರ್ಡ್ ಪಡೆಯುವುದು ಹೇಗೆ?", "ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಕಾರ್ಡ್ ಪಡೆಯುವುದು ಹೇಗೆ?"],
      },
      {
        category: "health",
        title: "ಆರೋಗ್ಯ",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["ಜ್ವರ ಬಂದಾಗ ಏನು ಮಾಡಬೇಕು?", "ಮಧುಮೇಹದ ಲಕ್ಷಣಗಳು?", "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಆಹಾರ?", "ಲಸಿಕೆ ವೇಳಾಪಟ್ಟಿ?"],
      },
      {
        category: "farming",
        title: "ಕೃಷಿ",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["ಗೋಧಿಯಲ್ಲಿ ಹಳದಿ ತುಕ್ಕು ರೋಗಕ್ಕೆ ಪರಿಹಾರ?", "ಭತ್ತ ಬಿತ್ತಲು ಸರಿಯಾದ ಸಮಯ?", "ಸಾವಯವ ಗೊಬ್ಬರ ಮಾಡುವುದು ಹೇಗೆ?", "ಬೆಳೆ ವಿಮೆ ಮಾಡಿಸುವುದು ಹೇಗೆ?"],
      },
      {
        category: "education",
        title: "ಶಿಕ್ಷಣ",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["10ನೇ ತರಗತಿಯ ನಂತರ ಏನು ಮಾಡಬೇಕು?", "ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", "ಗಣಿತವನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯುವುದು ಹೇಗೆ?", "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಓದುವುದು ಹೇಗೆ?"],
      },
    ],
    Malayalam: [
      {
        category: "government",
        title: "സർക്കാർ പദ്ധതികൾ",
        colorClass: "bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 border-primary/20",
        questions: ["PM-KISAN യോഗ്യതകൾ എന്തൊക്കെയാണ്?", "ആധാർ കാർഡ് എങ്ങനെ എടുക്കാം?", "വാർദ്ധക്യകാല പെൻഷന് എങ്ങനെ അപേക്ഷിക്കാം?", "ആയുഷ്മാൻ ഭാരത് കാർഡ് എങ്ങനെ ലഭിക്കും?"],
      },
      {
        category: "health",
        title: "ആരോഗ്യം",
        colorClass: "bg-rose-soft/10 hover:bg-rose-soft/20 border-rose-soft/20",
        questions: ["പനി വന്നാൽ എന്ത് ചെയ്യണം?", "പ്രമേഹത്തിന്റെ ലക്ഷണങ്ങൾ?", "ഗർഭകാലത്തെ ഭക്ഷണം?", "വാക്സിനേഷൻ ഷെഡ്യൂൾ?"],
      },
      {
        category: "farming",
        title: "കൃഷി",
        colorClass: "bg-green-india/10 hover:bg-green-india/20 border-green-india/20",
        questions: ["ഗോതമ്പിലെ മഞ്ഞ തുരുമ്പ് രോഗത്തിനുള്ള പ്രതിവിധി?", "നെല്ല് വിതയ്ക്കേണ്ട ശരിയായ സമയം?", "ജൈവ വളം എങ്ങനെ നിർമ്മിക്കാം?", "വിള ഇൻഷുറൻസ് എങ്ങനെ എടുക്കാം?"],
      },
      {
        category: "education",
        title: "വിദ്യാഭ്യാസം",
        colorClass: "bg-blue-soft/10 hover:bg-blue-soft/20 border-blue-soft/20",
        questions: ["പത്താം ക്ലാസ്സിന് ശേഷം എന്ത് ചെയ്യണം?", "സ്കോളർഷിപ്പിന് എങ്ങനെ അപേക്ഷിക്കാം?", "കണക്ക് എളുപ്പത്തിൽ എങ്ങനെ പഠിക്കാം?", "ഓൺലൈനായി എങ്ങനെ പഠിക്കാം?"],
      },
    ]
  };

  const currentFaqs = faqsByLang[language as keyof typeof faqsByLang] || faqsByLang.Hindi;

  const titleTranslation = {
    English: "Frequently Asked Questions",
    Hindi: "अक्सर पूछे जाने वाले प्रश्न",
    Punjabi: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ",
    Marathi: "सतत विचारले जाणारे प्रश्न",
    Gujarati: "વારંવાર પૂછાતા પ્રશ્નો",
    Bengali: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী",
    Tamil: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    Telugu: "తరచుగా అడిగే ప్రశ్నలు",
    Kannada: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    Malayalam: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ"
  };

  return (
    <section className="container px-4 py-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          {titleTranslation[language as keyof typeof titleTranslation] || titleTranslation.Hindi}
        </h2>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {currentFaqs.map((faq, idx) => (
          <div
            key={faq.category}
            className="animate-fade-in"
            style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3">{faq.title}</h3>
            <div className="flex flex-wrap gap-2">
              {faq.questions.map((question) => (
                <button
                  key={question}
                  onClick={() => onQuestionClick(question, faq.category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all duration-200",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "text-foreground",
                    faq.colorClass
                  )}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
