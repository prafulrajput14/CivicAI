import { useState, useEffect } from "react";
import { Mic, MessageSquare, Camera, Building2, Stethoscope, Wheat, GraduationCap, Shield, Wifi, Languages, Users, MessageCircle, CheckCircle, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "./CategoryCard";
import { ChatInterface } from "./ChatInterface";
import { ImageUpload } from "./ImageUpload";
import { FAQSection } from "./FAQSection";
import { GovtJobsBoard } from "./GovtJobsBoard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

type Category = "government" | "health" | "farming" | "education" | "govt-jobs" | null;

export function HomePage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showGovtJobs, setShowGovtJobs] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [initialQuestion, setInitialQuestion] = useState("");

  const firstName = user?.name ? user.name.split(' ')[0] : '';
  const [translatedName, setTranslatedName] = useState("");

  useEffect(() => {
    if (!firstName || language === "English") {
      setTranslatedName(firstName || "");
      return;
    }

    const langCodes: Record<string, string> = {
      Hindi: "hi",
      Punjabi: "pa",
      Marathi: "mr",
      Gujarati: "gu",
      Bengali: "bn",
      Tamil: "ta",
      Telugu: "te",
      Kannada: "kn",
      Malayalam: "ml"
    };

    const code = langCodes[language];
    if (!code) {
      setTranslatedName(firstName);
      return;
    }

    const fetchTranslation = async () => {
      try {
        const res = await fetch(`https://inputtools.google.com/request?text=${firstName}&itc=${code}-t-i0-und&num=1`);
        const data = await res.json();
        if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
          setTranslatedName(data[1][0][1][0]);
        } else {
          setTranslatedName(firstName);
        }
      } catch (err) {
        console.error("Failed to transliterate name:", err);
        setTranslatedName(firstName);
      }
    };

    fetchTranslation();
  }, [firstName, language]);
  
  const getGreeting = (baseGreeting: string) => {
    const nameToUse = translatedName || firstName;
    if (!nameToUse) return baseGreeting;
    if (baseGreeting.endsWith("!")) {
      return `${baseGreeting.slice(0, -1)} ${nameToUse}!`;
    }
    return `${baseGreeting} ${nameToUse}`;
  };

  const translations = {
    English: {
      heroTag: "🇮🇳 AI Assistant for Rural Citizens",
      heroTitle1: "Hello!",
      heroTitle2: "I am CivicAI",
      heroSub: "Ready to help you with government schemes, health, farming, and education.",
      btnVoice: "Ask by Voice",
      btnText: "Type Question",
      btnPhoto: "Read from Photo",
      chooseTopic: "Choose a Topic",
      catGov: "Gov Schemes",
      catGovDesc: "Pension, Aadhaar, PM-Kisan",
      catHealth: "Health",
      catHealthDesc: "First aid, hygiene, symptoms",
      catFarm: "Farming",
      catFarmDesc: "Crops, irrigation, fertilizer",
      catEdu: "Education",
      catEduDesc: "Class 6-12 study help",
      featSecure: "100% Secure",
      featOnline: "Online Help",
      featSimple: "Simple Language",
      statUsers: "Rural Users",
      statQA: "Questions Answered",
      statSafe: "Safe Answers",
      statLang: "Languages",
      catJobs: "Govt Jobs",
      catJobsDesc: "Latest job updates"
    },
    Hindi: {
      heroTag: "🇮🇳 ग्रामीण नागरिकों के लिए AI सहायक",
      heroTitle1: "नमस्ते!",
      heroTitle2: "मैं CivicAI हूँ",
      heroSub: "सरकारी योजनाओं, स्वास्थ्य, खेती और शिक्षा में आपकी मदद के लिए तैयार।",
      btnVoice: "बोलकर पूछें",
      btnText: "लिखकर पूछें",
      btnPhoto: "फोटो से पढ़ें",
      chooseTopic: "विषय चुनें",
      catGov: "सरकारी योजनाएं",
      catGovDesc: "पेंशन, आधार, PM-Kisan",
      catHealth: "स्वास्थ्य",
      catHealthDesc: "प्राथमिक उपचार, स्वच्छता, लक्षण",
      catFarm: "खेती-किसानी",
      catFarmDesc: "फसल, सिंचाई, खाद, कीट नियंत्रण",
      catEdu: "शिक्षा",
      catEduDesc: "कक्षा 6-12 पढ़ाई में मदद",
      featSecure: "100% सुरक्षित",
      featOnline: "ऑनलाइन सहायता",
      featSimple: "सरल हिंदी",
      statUsers: "ग्रामीण उपयोगकर्ता",
      statQA: "प्रश्न उत्तर",
      statSafe: "सुरक्षित जवाब",
      statLang: "भाषाएं",
      catJobs: "सरकारी नौकरी",
      catJobsDesc: "नई नौकरियों के अपडेट"
    },
    Punjabi: {
      heroTag: "🇮🇳 ਪੇਂਡੂ ਨਾਗਰਿਕਾਂ ਲਈ AI ਸਹਾਇਕ",
      heroTitle1: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ!",
      heroTitle2: "ਮੈਂ CivicAI ਹਾਂ",
      heroSub: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸਿਹਤ, ਖੇਤੀਬਾੜੀ ਅਤੇ ਸਿੱਖਿਆ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਤਿਆਰ।",
      btnVoice: "ਬੋਲ ਕੇ ਪੁੱਛੋ",
      btnText: "ਲਿਖ ਕੇ ਪੁੱਛੋ",
      btnPhoto: "ਫੋਟੋ ਤੋਂ ਪੜ੍ਹੋ",
      chooseTopic: "ਵਿਸ਼ਾ ਚੁਣੋ",
      catGov: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      catGovDesc: "ਪੈਨਸ਼ਨ, ਆਧਾਰ, PM-Kisan",
      catHealth: "ਸਿਹਤ",
      catHealthDesc: "ਮੁੱਢਲੀ ਸਹਾਇਤਾ, ਸਫਾਈ, ਲੱਛਣ",
      catFarm: "ਖੇਤੀਬਾੜੀ",
      catFarmDesc: "ਫਸਲ, ਸਿੰਚਾਈ, ਖਾਦ",
      catEdu: "ਸਿੱਖਿਆ",
      catEduDesc: "ਕਲਾਸ 6-12 ਪੜ੍ਹਾਈ ਮਦਦ",
      featSecure: "100% ਸੁਰੱਖਿਅਤ",
      featOnline: "ਆਨਲೈನ್ ਸਹਾਇਤਾ",
      featSimple: "ਸਰਲ ਭਾਸ਼ਾ",
      statUsers: "ਪੇਂਡੂ ਉਪਭੋਗਤਾ",
      statQA: "ਸਵਾਲ ਜਵਾਬ",
      statSafe: "ਸੁਰੱਖਿਅਤ ਜਵਾਬ",
      statLang: "ਭਾਸ਼ਾਵਾਂ",
      catJobs: "ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ",
      catJobsDesc: "ਨਵੀਨਤਮ ਨੌਕਰੀ ਅੱਪਡੇਟ"
    },
    Marathi: {
      heroTag: "🇮🇳 ग्रामीण नागरिकांसाठी AI सहाय्यक",
      heroTitle1: "नमस्कार!",
      heroTitle2: "मी CivicAI आहे",
      heroSub: "सरकारी योजना, आरोग्य, शेती आणि शिक्षणामध्ये तुम्हाला मदत करण्यासाठी तयार.",
      btnVoice: "बोलून विचारा",
      btnText: "लिहून विचारा",
      btnPhoto: "फोटोवरून वाचा",
      chooseTopic: "विषय निवडा",
      catGov: "सरकारी योजना",
      catGovDesc: "पेन्शन, आधार, PM-Kisan",
      catHealth: "आरोग्य",
      catHealthDesc: "प्रथमोपचार, स्वच्छता, लक्षणे",
      catFarm: "शेती",
      catFarmDesc: "पीक, सिंचन, खत",
      catEdu: "शिक्षण",
      catEduDesc: "इयत्ता 6-12 अभ्यासात मदत",
      featSecure: "100% सुरक्षित",
      featOnline: "ऑनलाइन मदत",
      featSimple: "सोपी भाषा",
      statUsers: "ग्रामीण वापरकर्ते",
      statQA: "प्रश्नांची उत्तरे",
      statSafe: "सुरक्षित उत्तरे",
      statLang: "भाषा",
      catJobs: "सरकारी नोकऱ्या",
      catJobsDesc: "नवीनतम नोकरी अपडेट्स"
    },
    Gujarati: {
      heroTag: "🇮🇳 ગ્રામીણ નાગરિકો માટે AI સહાયક",
      heroTitle1: "નમસ્તે!",
      heroTitle2: "હું CivicAI છું",
      heroSub: "સરકારી યોજનાઓ, આરોગ્ય, ખેતી અને શિક્ષણમાં તમને મદદ કરવા તૈયાર.",
      btnVoice: "બોલીને પૂછો",
      btnText: "લખીને પૂછો",
      btnPhoto: "ફોટો પરથી વાંચો",
      chooseTopic: "વિષય પસંદ કરો",
      catGov: "સરકારી યોજનાઓ",
      catGovDesc: "પેન્શન, આધાર, PM-Kisan",
      catHealth: "આરોગ્ય",
      catHealthDesc: "પ્રાથમિક સારવાર, સ્વચ્છતા, લક્ષણો",
      catFarm: "ખેતી",
      catFarmDesc: "પાક, સિંચાઈ, ખાતર",
      catEdu: "શિક્ષણ",
      catEduDesc: "ધોરણ 6-12 અભ્યાસમાં મદદ",
      featSecure: "100% સુરક્ષિત",
      featOnline: "ઓનલાઈન મદદ",
      featSimple: "સરળ ભાષા",
      statUsers: "ગ્રામીણ વપરાશકર્તાઓ",
      statQA: "પ્રશ્નોના જવાબો",
      statSafe: "સુરક્ષિત જવાબો",
      statLang: "ભાષાઓ",
      catJobs: "સરકારી નોકરીઓ",
      catJobsDesc: "નવીનતમ નોકરી અપડેટ્સ"
    },
    Bengali: {
      heroTag: "🇮🇳 গ্রামীণ নাগরিকদের জন্য AI সহকারী",
      heroTitle1: "নমস্কার!",
      heroTitle2: "আমি CivicAI",
      heroSub: "সরকারি প্রকল্প, স্বাস্থ্য, কৃষি এবং শিক্ষায় আপনাকে সাহায্য করতে প্রস্তুত।",
      btnVoice: "বলে জিজ্ঞাসা করুন",
      btnText: "লিখে জিজ্ঞাসা করুন",
      btnPhoto: "ছবি থেকে পড়ুন",
      chooseTopic: "বিষয় নির্বাচন করুন",
      catGov: "সরকারি প্রকল্প",
      catGovDesc: "পেনশন, আধার, PM-Kisan",
      catHealth: "স্বাস্থ্য",
      catHealthDesc: "প্রাথমিক চিকিৎসা, পরিচ্ছন্নতা, লক্ষণ",
      catFarm: "কৃষি",
      catFarmDesc: "ফসল, সেচ, সার",
      catEdu: "শিক্ষা",
      catEduDesc: "ষষ্ঠ-দ্বাদশ শ্রেণী পড়ার সাহায্য",
      featSecure: "100% সুরক্ষিত",
      featOnline: "অনলাইন সাহায্য",
      featSimple: "সহজ ভাষা",
      statUsers: "গ্রামীণ ব্যবহারকারী",
      statQA: "প্রশ্নের উত্তর",
      statSafe: "নিরাপদ উত্তর",
      statLang: "ভাষা",
      catJobs: "সরকারি চাকরি",
      catJobsDesc: "সর্বশেষ চাকরির আপডেট"
    },
    Tamil: {
      heroTag: "🇮🇳 கிராமப்புற மக்களுக்கான AI உதவியாளர்",
      heroTitle1: "வணக்கம்!",
      heroTitle2: "நான் CivicAI",
      heroSub: "அரசு திட்டங்கள், சுகாதாரம், விவசாயம் மற்றும் கல்வியில் உங்களுக்கு உதவ தயார்.",
      btnVoice: "பேசி கேட்கவும்",
      btnText: "எழுதி கேட்கவும்",
      btnPhoto: "புகைப்படத்திலிருந்து படிக்கவும்",
      chooseTopic: "தலைப்பைத் தேர்ந்தெடுக்கவும்",
      catGov: "அரசு திட்டங்கள்",
      catGovDesc: "ஓய்வூதியம், ஆதார், PM-Kisan",
      catHealth: "சுகாதாரம்",
      catHealthDesc: "முதலுதவி, சுகாதாரம், அறிகுறிகள்",
      catFarm: "விவசாயம்",
      catFarmDesc: "பயிர், நீர்ப்பாசனம், உரம்",
      catEdu: "கல்வி",
      catEduDesc: "வகுப்பு 6-12 படிப்பு உதவி",
      featSecure: "100% பாதுகாப்பானது",
      featOnline: "ஆன்லைன் உதவி",
      featSimple: "எளிய மொழி",
      statUsers: "கிராமப்புற பயனர்கள்",
      statQA: "கேள்விகளுக்கான பதில்கள்",
      statSafe: "பாதுகாப்பான பதில்கள்",
      statLang: "மொழிகள்",
      catJobs: "அரசு வேலைகள்",
      catJobsDesc: "சமீபத்திய வேலை அறிவிப்புகள்"
    },
    Telugu: {
      heroTag: "🇮🇳 గ్రామీణ పౌరుల కోసం AI సహాయకుడు",
      heroTitle1: "నమస్కారం!",
      heroTitle2: "నేను CivicAI",
      heroSub: "ప్రభుత్వ పథకాలు, ఆరోగ్యం, వ్యవసాయం మరియు విద్యలో మీకు సహాయం చేయడానికి సిద్ధం.",
      btnVoice: "మాట్లాడి అడగండి",
      btnText: "టైప్ చేసి అడగండి",
      btnPhoto: "ఫోటో నుండి చదవండి",
      chooseTopic: "అంశాన్ని ఎంచుకోండి",
      catGov: "ప్రభుత్వ పథకాలు",
      catGovDesc: "పింఛను, ఆధార్, PM-Kisan",
      catHealth: "ఆరోగ్యం",
      catHealthDesc: "ప్రథమ చికిత్స, పరిశుభ్రత, లక్షణాలు",
      catFarm: "వ్యవసాయం",
      catFarmDesc: "పంట, నీటిపారుదల, ఎరువు",
      catEdu: "విద్య",
      catEduDesc: "తరగతి 6-12 చదువు సహాయం",
      featSecure: "100% సురక్షితం",
      featOnline: "ఆన్‌లైన్ సహాయం",
      featSimple: "సరళ భాష",
      statUsers: "గ్రామీణ వినియోగదారులు",
      statQA: "ప్రశ్నలకు సమాధానాలు",
      statSafe: "సురక్షితమైన సమాధానాలు",
      statLang: "భాషలు",
      catJobs: "ప్రభుత్వ ఉద్యోగాలు",
      catJobsDesc: "తాజా ఉద్యోగ అప్‌డేట్‌లు"
    },
    Kannada: {
      heroTag: "🇮🇳 ಗ್ರಾಮೀಣ ನಾಗರಿಕರಿಗಾಗಿ AI ಸಹಾಯಕ",
      heroTitle1: "ನಮಸ್ಕಾರ!",
      heroTitle2: "ನಾನು CivicAI",
      heroSub: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಆರೋಗ್ಯ, ಕೃಷಿ ಮತ್ತು ಶಿಕ್ಷಣದಲ್ಲಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ.",
      btnVoice: "ಮಾತನಾಡಿ ಕೇಳಿ",
      btnText: "ಬರೆದು ಕೇಳಿ",
      btnPhoto: "ಫೋಟೋದಿಂದ ಓದಿ",
      chooseTopic: "ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      catGov: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      catGovDesc: "ಪಿಂಚಣಿ, ಆಧಾರ್, PM-Kisan",
      catHealth: "ಆರೋಗ್ಯ",
      catHealthDesc: "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ, ನೈರ್ಮಲ್ಯ, ಲಕ್ಷಣಗಳು",
      catFarm: "ಕೃಷಿ",
      catFarmDesc: "ಬೆಳೆ, ನೀರಾವರಿ, ರಸಗೊಬ್ಬರ",
      catEdu: "ಶಿಕ್ಷಣ",
      catEduDesc: "ತರಗತಿ 6-12 ಅಧ್ಯಯನ ಸಹಾಯ",
      featSecure: "100% ಸುರಕ್ಷಿತ",
      featOnline: "ಆನ್‌ಲೈನ್ ಸಹಾಯ",
      featSimple: "ಸರಳ ಭಾಷೆ",
      statUsers: "ಗ್ರಾಮೀಣ ಬಳಕೆದಾರರು",
      statQA: "ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಗಳು",
      statSafe: "ಸುರಕ್ಷಿತ ಉತ್ತರಗಳು",
      statLang: "ಭಾಷೆಗಳು",
      catJobs: "ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳು",
      catJobsDesc: "ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ನವೀಕರಣಗಳು"
    },
    Malayalam: {
      heroTag: "🇮🇳 ഗ്രാമീണർക്കുള്ള AI സഹായി",
      heroTitle1: "നമസ്കാരം!",
      heroTitle2: "ഞാൻ CivicAI",
      heroSub: "സർക്കാർ പദ്ധതികൾ, ആരോഗ്യം, കൃഷി, വിദ്യാഭ്യാസം എന്നിവയിൽ നിങ്ങളെ സഹായിക്കാൻ തയ്യാർ.",
      btnVoice: "സംസാരിച്ച് ചോദിക്കുക",
      btnText: "ടൈപ്പ് ചെയ്ത് ചോദിക്കുക",
      btnPhoto: "ഫോട്ടോയിൽ നിന്ന് വായിക്കുക",
      chooseTopic: "വിഷയം തിരഞ്ഞെടുക്കുക",
      catGov: "സർക്കാർ പദ്ധതികൾ",
      catGovDesc: "പെൻഷൻ, ആധാർ, PM-Kisan",
      catHealth: "ആരോഗ്യം",
      catHealthDesc: "പ്രഥമ ശുശ്രൂഷ, ശുചിത്വം, ലക്ഷണങ്ങൾ",
      catFarm: "കൃഷി",
      catFarmDesc: "വിള, ജലസേചനം, വളം",
      catEdu: "വിദ್ಯಾഭ്യാസം",
      catEduDesc: "ക്ലാസ്സ് 6-12 പഠന സഹായം",
      featSecure: "100% സുരക്ഷിതം",
      featOnline: "ഓൺലൈൻ സഹായം",
      featSimple: "ലളിതമായ ഭാഷ",
      statUsers: "ഗ്രാമീണ ഉപയോക്താക്കൾ",
      statQA: "ചോദ്യങ്ങൾക്കുള്ള മറുപടി",
      statSafe: "സുരക്ഷിതമായ മറുപടികൾ",
      statLang: "ഭാഷകൾ",
      catJobs: "സർക്കാർ ജോലികൾ",
      catJobsDesc: "ഏറ്റവും പുതിയ തൊഴിൽ വിവരങ്ങൾ"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.Hindi;

  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category);
    if (category === "govt-jobs") {
      setShowGovtJobs(true);
      setShowChat(false);
    } else {
      setShowChat(true);
      setShowGovtJobs(false);
    }
  };

  const handleVoiceClick = () => {
    setShowChat(true);
    setShowGovtJobs(false);
    setActiveCategory(null);
  };

  const handleTextClick = () => {
    setShowChat(true);
    setActiveCategory(null);
  };

  const handleImageTextExtracted = (text: string) => {
    setExtractedText(text);
    setShowImageUpload(false);
    setShowChat(true);
    setActiveCategory(null);
  };

  const handleFAQClick = (question: string, category: string) => {
    setActiveCategory(category as Category);
    setInitialQuestion(question);
    setShowChat(true);
    setShowGovtJobs(false);
  };

  const getCategoryInfo = (category: Category) => {
    const info = {
      government: { title: t.catGov, icon: <Building2 className="h-6 w-6 text-primary" /> },
      health: { title: t.catHealth, icon: <Stethoscope className="h-6 w-6 text-rose-soft" /> },
      farming: { title: t.catFarm, icon: <Wheat className="h-6 w-6 text-green-india" /> },
      education: { title: t.catEdu, icon: <GraduationCap className="h-6 w-6 text-blue-soft" /> },
    };
    return info[category!] || { title: "CivicAI", icon: null };
  };

  if (showChat) {
    const info = getCategoryInfo(activeCategory);
    return (
      <ChatInterface
        category={activeCategory && activeCategory !== "govt-jobs" ? activeCategory : undefined}
        categoryTitle={info.title}
        categoryIcon={info.icon}
        onBack={() => {
          setShowChat(false);
          setActiveCategory(null);
          setExtractedText("");
          setInitialQuestion("");
        }}
        initialMessage={extractedText || initialQuestion}
      />
    );
  }

  if (showGovtJobs) {
    return (
      <GovtJobsBoard 
        onBack={() => {
          setShowGovtJobs(false);
          setActiveCategory(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-light dark:bg-primary/20 text-foreground text-sm mb-6 animate-fade-in">
            {t.heroTag}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <span className="text-primary">{getGreeting(t.heroTitle1)}</span> {t.heroTitle2}
          </h1>

          <p className="text-muted-foreground mb-8 text-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
            {t.heroSub}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button
              onClick={handleVoiceClick}
              className="rounded-xl gap-2 px-6 shadow-soft"
              size="lg"
            >
              <Mic className="h-5 w-5" />
              {t.btnVoice}
            </Button>
            <Button
              onClick={handleTextClick}
              variant="outline"
              className="rounded-xl gap-2 px-6"
              size="lg"
            >
              <MessageSquare className="h-5 w-5" />
              {t.btnText}
            </Button>
            <Button
              onClick={() => setShowImageUpload(true)}
              variant="outline"
              className="rounded-xl gap-2 px-6"
              size="lg"
            >
              <Camera className="h-5 w-5" />
              {t.btnPhoto}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container px-4 mb-12">
        <h2 className="text-center text-lg font-medium text-muted-foreground mb-6">
          {t.chooseTopic}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          <CategoryCard
            icon={Building2}
            title={t.catGov}
            description={t.catGovDesc}
            colorClass="text-primary"
            bgClass="bg-saffron-light dark:bg-primary/20"
            onClick={() => handleCategorySelect("government")}
            delay={100}
          />
          <CategoryCard
            icon={Stethoscope}
            title={t.catHealth}
            description={t.catHealthDesc}
            colorClass="text-rose-soft"
            bgClass="bg-rose-soft/10 dark:bg-rose-soft/20"
            onClick={() => handleCategorySelect("health")}
            delay={200}
          />
          <CategoryCard
            icon={Wheat}
            title={t.catFarm}
            description={t.catFarmDesc}
            colorClass="text-green-india"
            bgClass="bg-green-india/10 dark:bg-green-india/20"
            onClick={() => handleCategorySelect("farming")}
            delay={300}
          />
          <CategoryCard
            icon={GraduationCap}
            title={t.catEdu}
            description={t.catEduDesc}
            colorClass="text-blue-soft"
            bgClass="bg-blue-soft/10 dark:bg-blue-soft/20"
            onClick={() => handleCategorySelect("education")}
            delay={400}
          />
          <CategoryCard
            icon={Briefcase}
            title={t.catJobs}
            description={t.catJobsDesc}
            colorClass="text-orange-600"
            bgClass="bg-orange-600/10 dark:bg-orange-600/20"
            onClick={() => handleCategorySelect("govt-jobs")}
            delay={500}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-india/10 dark:bg-green-india/20">
            <Shield className="h-4 w-4 text-green-india" />
            <span className="text-foreground">{t.featSecure}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-soft/10 dark:bg-blue-soft/20">
            <Wifi className="h-4 w-4 text-blue-soft" />
            <span className="text-foreground">{t.featOnline}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-light dark:bg-primary/20">
            <Languages className="h-4 w-4 text-primary" />
            <span className="text-foreground">{t.featSimple}</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
          <div className="text-center p-4 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="flex justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">10,000+</p>
            <p className="text-sm text-muted-foreground">{t.statUsers}</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: "600ms" }}>
            <div className="flex justify-center mb-2">
              <MessageCircle className="h-6 w-6 text-green-india" />
            </div>
            <p className="text-2xl font-bold text-foreground">50,000+</p>
            <p className="text-sm text-muted-foreground">{t.statQA}</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: "700ms" }}>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-blue-soft" />
            </div>
            <p className="text-2xl font-bold text-foreground">99.9%</p>
            <p className="text-sm text-muted-foreground">{t.statSafe}</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-card shadow-card animate-fade-in" style={{ animationDelay: "800ms" }}>
            <div className="flex justify-center mb-2">
              <Globe className="h-6 w-6 text-rose-soft" />
            </div>
            <p className="text-2xl font-bold text-foreground">10+</p>
            <p className="text-sm text-muted-foreground">{t.statLang}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection onQuestionClick={handleFAQClick} />

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onTextExtracted={handleImageTextExtracted}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
}
