import React, { useState } from "react";
import { MessageSquarePlus, Star, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScLEEpCp8XTURvHNMoIEb1L_L35IHQGxIlg31hCDghRiCL0Yg/formResponse";

const EntryIDs = {
    experience: "entry.812310635",
    rating: "entry.842969661",
    sections: "entry.1948589088",
    clarity: "entry.468485095",
    improve: "entry.240565825",
    features: "entry.670013429",
    reuse: "entry.1776736762",
    recommend: "entry.1964080398",
    name: "entry.1194661650",
    village: "entry.1162517856",
};

const SECTION_OPTIONS = [
    "Government Schemes",
    "Health",
    "Agriculture",
    "Education",
    "Voice Query",
    "Photo Query"
];

const FEATURE_OPTIONS = [
    "Nearby hospitals information",
    "Panchayat updates",
    "Help with filling government forms",
    "More local language support",
    "Offline mode",
    "Other"
];

const CLARITY_OPTIONS = [
    "Yes, very clear",
    "Somewhat clear",
    "Difficult to understand"
];

const REUSE_OPTIONS = [
    "Yes",
    "Maybe",
    "No"
];

export function FeedbackForm() {
    const { language } = useLanguage();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        experience: 0,
        rating: 0,
        sections: [] as string[],
        clarity: "",
        improve: "",
        features: [] as string[],
        reuse: "",
        recommend: 0,
        name: "",
        village: "",
    });

    const translations = {
        English: {
            button: "Feedback",
            title: "Help Us Improve CivicAI",
            description: "Please fill out this quick survey so we can serve you better.",
            q1: "1. How was your overall experience with CivicAI?",
            q2: "2. How would you rate CivicAI?",
            q3: "3. Which section of CivicAI did you use? (Select all that apply)",
            q4: "4. Was the information clear and easy to understand?",
            q5: "5. What can we improve in CivicAI?",
            q6: "6. Which features would you like us to add? (Select all that apply)",
            q7: "7. Would you use CivicAI again?",
            q8: "8. How likely are you to recommend CivicAI to others?",
            q9: "9. Your Name (Optional)",
            q10: "10. Your Village / City (Optional)",
            submit: "Submit Feedback",
            submitting: "Submitting...",
            successTitle: "Thank You!",
            successMessage: "Your feedback has been recorded successfully.",
            error: "Failed to submit feedback. Please try again.",
            opts: {
                sect: { "Government Schemes": "Government Schemes", "Health": "Health", "Agriculture": "Agriculture", "Education": "Education", "Voice Query": "Voice Query", "Photo Query": "Photo Query" },
                clarity: { "Yes, very clear": "Yes, very clear", "Somewhat clear": "Somewhat clear", "Difficult to understand": "Difficult to understand" },
                feat: { "Nearby hospitals information": "Nearby hospitals information", "Panchayat updates": "Panchayat updates", "Help with filling government forms": "Help with filling government forms", "More local language support": "More local language support", "Offline mode": "Offline mode", "Other": "Other" },
                reuse: { "Yes": "Yes", "Maybe": "Maybe", "No": "No" }
            }
        },
        Hindi: {
            button: "सुझाव",
            title: "CivicAI को बेहतर बनाने में मदद करें",
            description: "कृपया यह छोटा सा सर्वे भरें ताकि हम आपकी बेहतर सेवा कर सकें।",
            q1: "1. CivicAI के साथ आपका समग्र अनुभव कैसा रहा?",
            q2: "2. आप CivicAI को कितनी रेटिंग देंगे?",
            q3: "3. आपने CivicAI के किस अनुभाग का उपयोग किया? (लागू होने वाले सभी चुनें)",
            q4: "4. क्या जानकारी स्पष्ट और समझने में आसान थी?",
            q5: "5. हम CivicAI में क्या सुधार कर सकते हैं?",
            q6: "6. आप हमसे कौन सी सुविधाएँ जुड़वाना चाहेंगे? (लागू होने वाले सभी चुनें)",
            q7: "7. क्या आप दुबारा CivicAI का उपयोग करेंगे?",
            q8: "8. आप दूसरों को CivicAI की सिफारिश करने की कितनी संभावना रखते हैं?",
            q9: "9. आपका नाम (वैकल्पिक)",
            q10: "10. आपका गाँव / शहर (वैकल्पिक)",
            submit: "सुझाव जमा करें",
            submitting: "जमा किया जा रहा है...",
            successTitle: "धन्यवाद!",
            successMessage: "आपका सुझाव सफलतापूर्वक दर्ज कर लिया गया है।",
            error: "सुझाव जमा करने में विफल। कृपया पुन: प्रयास करें।",
            opts: {
                sect: { "Government Schemes": "सरकारी योजनाएं", "Health": "स्वास्थ्य", "Agriculture": "कृषि", "Education": "शिक्षा", "Voice Query": "वॉयस क्वेरी", "Photo Query": "फोटो क्वेरी" },
                clarity: { "Yes, very clear": "हाँ, बहुत स्पष्ट", "Somewhat clear": "थोड़ा स्पष्ट", "Difficult to understand": "समझने में मुश्किल" },
                feat: { "Nearby hospitals information": "नज़दीकी अस्पताल की जानकारी", "Panchayat updates": "पंचायत की ताज़ा जानकारी", "Help with filling government forms": "सरकारी फॉर्म भरने में मदद", "More local language support": "अधिक स्थानीय भाषा का समर्थन", "Offline mode": "ऑफ़लाइन मोड", "Other": "अन्य" },
                reuse: { "Yes": "हाँ", "Maybe": "शायद", "No": "नहीं" }
            }
        },
        Punjabi: {
            button: "ਸੁਝਾਅ",
            title: "CivicAI ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੋ",
            description: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਛੋਟਾ ਸਰਵੇਖਣ ਭਰੋ ਤਾਂ ਜੋ ਅਸੀਂ ਤੁਹਾਡੀ ਬਿਹਤਰ ਸੇਵਾ ਕਰ ਸਕੀਏ।",
            q1: "1. CivicAI ਨਾਲ ਤੁਹਾਡਾ ਸਮੁੱਚਾ ਅਨੁਭਵ ਕਿਵੇਂ ਰਿਹਾ?",
            q2: "2. ਤੁਸੀਂ CivicAI ਨੂੰ ਕਿੰਨੀ ਰੇਟਿੰਗ ਦੇਵੋਗੇ?",
            q3: "3. ਤੁਸੀਂ CivicAI ਦੇ ਕਿਸ ਭਾਗ ਦੀ ਵਰਤੋਂ ਕੀਤੀ? (ਲਾਗੂ ਹੋਣ ਵਾਲੇ ਸਾਰੇ ਚੁਣੋ)",
            q4: "4. ਕੀ ਜਾਣਕਾਰੀ ਸਪਸ਼ਟ ਅਤੇ ਸਮਝਣ ਵਿੱਚ ਆਸਾਨ ਸੀ?",
            q5: "5. ਅਸੀਂ CivicAI ਵਿੱਚ ਕੀ ਸੁਧਾਰ ਕਰ ਸਕਦੇ ਹਾਂ?",
            q6: "6. ਤੁਸੀਂ ਸਾਡੇ ਤੋਂ ਕਿਹੜੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਸ਼ਾਮਲ ਕਰਵਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
            q7: "7. ਕੀ ਤੁਸੀਂ ਦੁਬਾਰਾ CivicAI ਦੀ ਵਰਤੋਂ ਕਰੋਗੇ?",
            q8: "8. ਤੁਸੀਂ ਦੂਜਿਆਂ ਨੂੰ CivicAI ਦੀ ਸਿਫ਼ਾਰਸ਼ ਕਰਨ ਦੀ ਕਿੰਨੀ ਸੰਭਾਵਨਾ ਰੱਖਦੇ ਹੋ?",
            q9: "9. ਤੁਹਾਡਾ ਨਾਮ (ਵਿਕਲਪਿਕ)",
            q10: "10. ਤੁਹਾਡਾ ਪਿੰਡ / ਸ਼ਹਿਰ (ਵਿਕਲਪਿਕ)",
            submit: "ਸੁਝਾਅ ਜਮ੍ਹਾਂ ਕਰੋ",
            submitting: "ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
            successTitle: "ਧੰਨਵਾਦ!",
            successMessage: "ਤੁਹਾਡਾ ਸੁਝਾਅ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਕਰ ਲਿਆ ਗਿਆ ਹੈ।",
            error: "ਸੁਝਾਅ ਜਮ੍ਹਾਂ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
            opts: {
                sect: { "Government Schemes": "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ", "Health": "ਸਿਹਤ", "Agriculture": "ਖੇਤੀਬਾੜੀ", "Education": "ਸਿੱਖਿਆ", "Voice Query": "ਵੌਇਸ ਪੁੱਛਗਿੱਛ", "Photo Query": "ਫੋਟੋ ਪੁੱਛਗਿੱਛ" },
                clarity: { "Yes, very clear": "ਹਾਂ, ਬਹੁਤ ਸਪਸ਼ਟ", "Somewhat clear": "ਥੋੜਾ ਸਪਸ਼ਟ", "Difficult to understand": "ਸਮਝਣ ਵਿੱਚ ਮੁਸ਼ਕਲ" },
                feat: { "Nearby hospitals information": "ਨੇੜਲੇ ਹਸਪਤਾਲ ਦੀ ਜਾਣਕਾਰੀ", "Panchayat updates": "ਪੰਚਾਇਤ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ", "Help with filling government forms": "ਸਰਕਾਰੀ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ", "More local language support": "ਹੋਰ ਸਥਾਨਕ ਭਾਸ਼ਾ ਸਹਾਇਤਾ", "Offline mode": "ਔਫਲਾਈਨ ਮੋਡ", "Other": "ਹੋਰ" },
                reuse: { "Yes": "ਹਾਂ", "Maybe": "ਸ਼ਾਇਦ", "No": "ਨਹੀਂ" }
            }
        },
        Marathi: {
            button: "अभिप्राय",
            title: "CivicAI सुधारण्यात मदत करा",
            description: "आम्ही तुमची अधिक चांगली सेवा करू शकू यासाठी कृपया हे छोटे सर्वेक्षण भरा.",
            q1: "1. CivicAI सोबत तुमचा एकूण अनुभव कसा होता?",
            q2: "2. तुम्ही CivicAI ला कसे रेट कराल?",
            q3: "3. तुम्ही CivicAI चा कोणता विभाग वापरला? (लागू होणारे सर्व निवडा)",
            q4: "4. माहिती स्पष्ट आणि समजायला सोपी होती का?",
            q5: "5. आम्ही CivicAI मध्ये काय सुधारू शकतो?",
            q6: "6. आम्ही कोणती वैशिष्ट्ये जोडावी असे तुम्हाला वाटते?",
            q7: "7. तुम्ही CivicAI पुन्हा वापराल का?",
            q8: "8. तुम्ही इतरांना CivicAI ची शिफारस करण्याची किती शक्यता आहे?",
            q9: "9. तुमचे नाव (ऐच्छिक)",
            q10: "10. तुमचे गाव / शहर (ऐच्छिक)",
            submit: "अभिप्राय सबमिट करा",
            submitting: "सबमिट करत आहे...",
            successTitle: "धन्यवाद!",
            successMessage: "तुमचा अभिप्राय यशस्वीरीत्या नोंदवला गेला आहे.",
            error: "अभिप्राय सबमिट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
            opts: {
                sect: { "Government Schemes": "सरकारी योजना", "Health": "आरोग्य", "Agriculture": "शेती", "Education": "शिक्षण", "Voice Query": "व्हॉइस क्वेरी", "Photo Query": "फोटो क्वेरी" },
                clarity: { "Yes, very clear": "होय, अगदी स्पष्ट", "Somewhat clear": "थोडं स्पष्ट", "Difficult to understand": "समजायला कठीण" },
                feat: { "Nearby hospitals information": "जवळच्या रुग्णालयांची माहिती", "Panchayat updates": "पंचायत अपडेट्स", "Help with filling government forms": "सरकारी फॉर्म भरण्यात मदत", "More local language support": "अधिक स्थानिक भाषा समर्थन", "Offline mode": "ऑफलाइन मोड", "Other": "इतर" },
                reuse: { "Yes": "होय", "Maybe": "कदाचित", "No": "नाही" }
            }
        },
        Gujarati: {
            button: "પ્રતિસાદ",
            title: "CivicAI સુધારવામાં મદદ કરો",
            description: "કૃપા કરીને આ નાનું સર્વેક્ષણ ભરો જેથી અમે તમારી સારી સેવા કરી શકીએ.",
            q1: "1. CivicAI સાથે તમારો એકંદર અનુભવ કેવો રહ્યો?",
            q2: "2. તમે CivicAI ને કેવી રીતે રેટ કરશો?",
            q3: "3. તમે CivicAI ના કયા વિભાગનો ઉપયોગ કર્યો? (લાગુ પડતા તમામ પસંદ કરો)",
            q4: "4. શું માહિતી સ્પષ્ટ અને સમજવામાં સરળ હતી?",
            q5: "5. અમે CivicAI માં શું સુધારી શકીએ છીએ?",
            q6: "6. તમે અમને કઈ સુવિધાઓ ઉમેરવા માંગો છો?",
            q7: "7. શું તમે ફરીથી CivicAI નો ઉપયોગ કરશો?",
            q8: "8. તમે અન્ય લોકોને CivicAI ની ભલામણ કરવાની કેટલી શક્યતા ધરાવો છો?",
            q9: "9. તમારું નામ (વૈકલ્પિક)",
            q10: "10. તમારું ગામ / શહેર (વૈકલ્પિક)",
            submit: "પ્રતિસાદ સબમિટ કરો",
            submitting: "સબમિટ થઈ રહ્યું છે...",
            successTitle: "આભાર!",
            successMessage: "તમારો પ્રતિસાદ સફળતાપૂર્વક નોંધવામાં આવ્યો છે.",
            error: "પ્રતિસાદ સબમિટ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.",
            opts: {
                sect: { "Government Schemes": "સરકારી યોજનાઓ", "Health": "આરોગ્ય", "Agriculture": "કૃષિ", "Education": "શિક્ષણ", "Voice Query": "વૉઇસ ક્વેરી", "Photo Query": "ફોટો ક્વેરી" },
                clarity: { "Yes, very clear": "હા, ખૂબ જ સ્પષ્ટ", "Somewhat clear": "થોડું સ્પષ્ટ", "Difficult to understand": "સમજવામાં મુશ્કેલ" },
                feat: { "Nearby hospitals information": "નજીકની હોસ્પિટલની માહિતી", "Panchayat updates": "પંચાયતના અપડેટ્સ", "Help with filling government forms": "સરકારી ફોર્મ ભરવામાં મદદ", "More local language support": "વધુ સ્થાનિક ભાષા સપોર્ટ", "Offline mode": "ઓફલાઇન મોડ", "Other": "અન્ય" },
                reuse: { "Yes": "હા", "Maybe": "કદાચ", "No": "ના" }
            }
        },
        Bengali: {
            button: "মতামত",
            title: "CivicAI উন্নত করতে সাহায্য করুন",
            description: "দয়া করে এই ছোট সমীক্ষাটি পূরণ করুন যাতে আমরা আপনাকে আরও ভালোভাবে পরিষেবা দিতে পারি।",
            q1: "১. CivicAI এর সাথে আপনার সামগ্রিক অভিজ্ঞতা কেমন ছিল?",
            q2: "২. আপনি CivicAI কে কীভাবে রেট করবেন?",
            q3: "৩. আপনি CivicAI এর কোন বিভাগটি ব্যবহার করেছেন? (প্রযোজ্য সব কটি বেছে নিন)",
            q4: "৪. তথ্যটি কি স্পষ্ট এবং সহজে বোঝার মতো ছিল?",
            q5: "৫. আমরা CivicAI তে কী উন্নতি করতে পারি?",
            q6: "৬. আপনি আমাদের কোন বৈশিষ্ট্যগুলি যুক্ত করতে চান?",
            q7: "৭. আপনি কি আবার CivicAI ব্যবহার করবেন?",
            q8: "৮. আপনি অন্যদের কাছে CivicAI এর সুপারিশ করার সম্ভাবনা কতটা?",
            q9: "৯. আপনার নাম (ঐচ্ছিক)",
            q10: "১০. আপনার গ্রাম / শহর (ঐচ্ছিক)",
            submit: "মতামত জমা দিন",
            submitting: "জমা দেওয়া হচ্ছে...",
            successTitle: "ধন্যবাদ!",
            successMessage: "আপনার মতামত সফলভাবে রেকর্ড করা হয়েছে।",
            error: "মতামত জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
            opts: {
                sect: { "Government Schemes": "সরকারি প্রকল্প", "Health": "স্বাস্থ্য", "Agriculture": "কৃষি", "Education": "শিক্ষা", "Voice Query": "ভয়েস কোয়েরি", "Photo Query": "ফটো কোয়েরি" },
                clarity: { "Yes, very clear": "হ্যাঁ, খুব স্পষ্ট", "Somewhat clear": "কিছুটা স্পষ্ট", "Difficult to understand": "বুঝতে অসুবিধা" },
                feat: { "Nearby hospitals information": "আশপাশের হাসপাতালের তথ্য", "Panchayat updates": "পঞ্চায়েতের আপডেট", "Help with filling government forms": "সরকারি ফর্ম পূরণে সাহায্য", "More local language support": "আরও স্থানীয় ভাষার সমর্থন", "Offline mode": "অফলাইন মোড", "Other": "অন্যান্য" },
                reuse: { "Yes": "হ্যাঁ", "Maybe": "হয়তো", "No": "না" }
            }
        },
        Tamil: {
            button: "கருத்து",
            title: "CivicAI ஐ மேம்படுத்த உதவுங்கள்",
            description: "உங்களுக்குச் சிறந்த முறையில் சேவை செய்ய இந்தச் சிறு கணக்கெடுப்பை நிரப்பவும்.",
            q1: "1. CivicAI உடன் உங்கள் ஒட்டுமொத்த அனுபவம் எப்படி இருந்தது?",
            q2: "2. CivicAI ஐ எவ்வாறு மதிப்பிடுவீர்கள்?",
            q3: "3. நீங்கள் CivicAI இன் எந்தப் பகுதியைப் பயன்படுத்தினீர்கள்?",
            q4: "4. தகவல்கள் தெளிவாகவும் புரிந்துகொள்ள எளிதாகவும் இருந்தனவா?",
            q5: "5. CivicAI இல் நாங்கள் என்ன மேம்படுத்தலாம்?",
            q6: "6. நாங்கள் எந்தெந்த அம்சங்களைச் சேர்க்க வேண்டும் என்று விரும்புகிறீர்கள்?",
            q7: "7. நீங்கள் மீண்டும் CivicAI ஐப் பயன்படுத்துவீர்களா?",
            q8: "8. மற்றவர்களுக்கு CivicAI ஐப் பரிந்துரைக்க நீங்கள் எவ்வளவு வாய்ப்புள்ளது?",
            q9: "9. உங்கள் பெயர் (விருப்பத்திற்குரியது)",
            q10: "10. உங்கள் கிராமம் / நகரம் (விருப்பத்திற்குரியது)",
            submit: "கருத்தைச் சமர்ப்பிக்கவும்",
            submitting: "சமர்ப்பிக்கப்படுகிறது...",
            successTitle: "நன்றி!",
            successMessage: "உங்கள் கருத்து வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.",
            error: "கருத்தைச் சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
            opts: {
                sect: { "Government Schemes": "அரசுத் திட்டங்கள்", "Health": "சுகாதாரம்", "Agriculture": "விவசாயம்", "Education": "கல்வி", "Voice Query": "குரல் வினவல்", "Photo Query": "புகைப்பட வினவல்" },
                clarity: { "Yes, very clear": "ஆம், மிகவும் தெளிவு", "Somewhat clear": "ஓரளவு தெளிவு", "Difficult to understand": "புரிந்துகொள்ளக் கடினம்" },
                feat: { "Nearby hospitals information": "அருகிலுள்ள மருத்துவமனைத் தகவல்கள்", "Panchayat updates": "பஞ்சாயத்து அறிவிப்புகள்", "Help with filling government forms": "அரசுப் படிவங்களை நிரப்ப உதவி", "More local language support": "மேலும் பல உள்ளூர் மொழி ஆதரவு", "Offline mode": "ஆஃப்லைன் பயன்முறை", "Other": "மற்றவை" },
                reuse: { "Yes": "ஆம்", "Maybe": "இருக்கலாம்", "No": "இல்லை" }
            }
        },
        Telugu: {
            button: "అభిప్రాయం",
            title: "CivicAI ని మెరుగుపరచడంలో సహాయపడండి",
            description: "మేము మీకు మెరుగైన సేవ అందించడానికి దయచేసి ఈ చిన్న సర్వే నింపండి.",
            q1: "1. CivicAI తో మీ మొత్తం అనుభవం ఎలా ఉంది?",
            q2: "2. మీరు CivicAI కి ఎలా రేటింగ్ ఇస్తారు?",
            q3: "3. మీరు CivicAI లోని ఏ విభాగాన్ని ఉపయోగించారు?",
            q4: "4. సమాచారం స్పష్టంగా మరియు సులభంగా అర్థం చేసుకునేలా ఉందా?",
            q5: "5. CivicAI లో మేము ఏమి మెరుగుపరచవచ్చు?",
            q6: "6. మేము ఏ కొత్త ఫీచర్లను జోడించాలని మీరు కోరుకుంటున్నారు?",
            q7: "7. మీరు మళ్లీ CivicAI ని ఉపయోగిస్తారా?",
            q8: "8. మీరు ఇతరులకు CivicAI ని సిఫార్సు చేసే అవకాశం ఎంత ఉంది?",
            q9: "9. మీ పేరు (ఐచ్ఛికం)",
            q10: "10. మీ గ్రామం / నగరం (ఐచ్ఛికం)",
            submit: "అభిప్రాయాన్ని సమర్పించండి",
            submitting: "సమర్పించబడుతోంది...",
            successTitle: "ధన్యవాదాలు!",
            successMessage: "మీ అభిప్రాయం విజయవంతంగా రికార్డ్ చేయబడింది.",
            error: "అభిప్రాయాన్ని సమర్పించడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
            opts: {
                sect: { "Government Schemes": "ప్రభుత్వ పథకాలు", "Health": "ఆరోగ్యం", "Agriculture": "వ్యవసాయం", "Education": "విద్య", "Voice Query": "వాయిస్ ప్రశ్న", "Photo Query": "ఫోటో ప్రశ్న" },
                clarity: { "Yes, very clear": "అవును, చాలా స్పష్టంగా ఉంది", "Somewhat clear": "కొంత స్పష్టంగా ఉంది", "Difficult to understand": "అర్థం చేసుకోవడం కష్టం" },
                feat: { "Nearby hospitals information": "సమీప ఆసుపత్రుల సమాచారం", "Panchayat updates": "పంచాయతీ అప్‌డేట్‌లు", "Help with filling government forms": "ప్రభుత్వ ఫారమ్‌లు నింపడంలో సహాయం", "More local language support": "మరింత స్థానిక భాషా మద్దతు", "Offline mode": "ఆఫ్‌లైన్ మోడ్", "Other": "ఇతర" },
                reuse: { "Yes": "అవును", "Maybe": "బహుశా", "No": "లేదు" }
            }
        },
        Kannada: {
            button: "ಪ್ರತಿಕ್ರಿಯೆ",
            title: "CivicAI ಸುಧಾರಿಸಲು ನಮಗೆ ಸಹಾಯ ಮಾಡಿ",
            description: "ನಿಮಗೆ ಉತ್ತಮ ಸೇವೆ ನೀಡಲು ದಯವಿಟ್ಟು ಈ ಸಣ್ಣ ಸಮೀಕ್ಷೆಯನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
            q1: "1. CivicAI ನೊಂದಿಗಿನ ನಿಮ್ಮ ಒಟ್ಟಾರೆ ಅನುಭವ ಹೇಗಿತ್ತು?",
            q2: "2. ನೀವು CivicAI ಗೆ ಹೇಗೆ ರೇಟಿಂಗ್ ನೀಡುತ್ತೀರಿ?",
            q3: "3. ನೀವು CivicAI ನ ಯಾವ ವಿಭಾಗವನ್ನು ಬಳಸಿದ್ದೀರಿ?",
            q4: "4. ಮಾಹಿತಿಯು ಸ್ಪಷ್ಟವಾಗಿತ್ತೇ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸುಲಭವಾಗಿತ್ತೇ?",
            q5: "5. ನಾವು CivicAI ನಲ್ಲಿ ಏನನ್ನು ಸುಧಾರಿಸಬಹುದು?",
            q6: "6. ನಾವು ಯಾವ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಸೇರಿಸಬೇಕೆಂದು ನೀವು ಬಯಸುತ್ತೀರಿ?",
            q7: "7. ನೀವು ಮತ್ತೆ CivicAI ಅನ್ನು ಬಳಸುತ್ತೀರಾ?",
            q8: "8. ನೀವು ಇತರರಿಗೆ CivicAI ಅನ್ನು ಶಿಫಾರಸು ಮಾಡುವ ಸಾಧ್ಯತೆ ಎಷ್ಟು?",
            q9: "9. ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)",
            q10: "10. ನಿಮ್ಮ ಹಳ್ಳಿ / ನಗರ (ಐಚ್ಛಿಕ)",
            submit: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ",
            submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
            successTitle: "ಧನ್ಯವಾದಗಳು!",
            successMessage: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.",
            error: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
            opts: {
                sect: { "Government Schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "Health": "ಆರೋಗ್ಯ", "Agriculture": "ಕೃಷಿ", "Education": "ಶಿಕ್ಷಣ", "Voice Query": "ಧ್ವನಿ ಪ್ರಶ್ನೆ", "Photo Query": "ಫೋಟೋ ಪ್ರಶ್ನೆ" },
                clarity: { "Yes, very clear": "ಹೌದು, ತುಂಬಾ ಸ್ಪಷ್ಟ", "Somewhat clear": "ಸ್ವಲ್ಪ ಸ್ಪಷ್ಟ", "Difficult to understand": "ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಕಷ್ಟ" },
                feat: { "Nearby hospitals information": "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳ ಮಾಹಿತಿ", "Panchayat updates": "ಪಂಚಾಯತ್ ನವೀಕರಣಗಳು", "Help with filling government forms": "ಸರ್ಕಾರಿ ಅರ್ಜಿಗಳನ್ನು ತುಂಬಲು ಸಹಾಯ", "More local language support": "ಹೆಚ್ಚಿನ ಸ್ಥಳೀಯ ಭಾಷಾ ಬೆಂಬಲ", "Offline mode": "ಆಫ್‌ಲೈನ್ ಮೋಡ್", "Other": "ಇತರೆ" },
                reuse: { "Yes": "ಹೌದು", "Maybe": "ಬಹುಶಃ", "No": "ಇಲ್ಲ" }
            }
        },
        Malayalam: {
            button: "അഭിപ്രായം",
            title: "CivicAI മെച്ചപ്പെടുത്താൻ സഹായിക്കുക",
            description: "നിങ്ങൾക്ക് മികച്ച സേവനം നൽകാൻ ഈ ചെറിയ സർവേ പൂരിപ്പിക്കുക.",
            q1: "1. CivicAI-യുമായുള്ള നിങ്ങളുടെ മൊത്തത്തിലുള്ള അനുഭവം എങ്ങനെയുണ്ടായിരുന്നു?",
            q2: "2. നിങ്ങൾ CivicAI-ക്ക് എങ്ങനെ റേറ്റിംഗ് നൽകും?",
            q3: "3. നിങ്ങൾ CivicAI-യുടെ ഏത് ഭാഗമാണ് ഉപയോഗിച്ചത്?",
            q4: "4. വിവരങ്ങൾ വ്യക്തവും മനസ്സിലാക്കാൻ എളുപ്പവുമുള്ളതായിരുന്നോ?",
            q5: "5. CivicAI-ൽ ഞങ്ങൾക്ക് എന്ത് മെച്ചപ്പെടുത്താനാകും?",
            q6: "6. ഞങ്ങൾ ഏതൊക്കെ പുതിയ ഫീച്ചറുകൾ ചേർക്കണമെന്നാണ് നിങ്ങൾ ആഗ്രഹിക്കുന്നത്?",
            q7: "7. നിങ്ങൾ വീണ്ടും CivicAI ഉപയോഗിക്കുമോ?",
            q8: "8. മറ്റുള്ളവർക്ക് CivicAI നിർദ്ദേശിക്കാൻ നിങ്ങൾ എത്രത്തോളം സാധ്യതയുണ്ട്?",
            q9: "9. നിങ്ങളുടെ പേര് (ഓപ്ഷണൽ)",
            q10: "10. നിങ്ങളുടെ ഗ്രാമം / നഗരം (ഓപ്ഷണൽ)",
            submit: "അഭിപ്രായം സമർപ്പിക്കുക",
            submitting: "സമർപ്പിക്കുന്നു...",
            successTitle: "നന്ദി!",
            successMessage: "നിങ്ങളുടെ അഭിപ്രായം വിജയകരമായി രേഖപ്പെടുത്തിയിട്ടുണ്ട്.",
            error: "അഭിപ്രായം സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.",
            opts: {
                sect: { "Government Schemes": "സർക്കാർ പദ്ധതികൾ", "Health": "ആരോഗ്യം", "Agriculture": "കൃഷി", "Education": "വിദ್ಯಾഭ്യാസം", "Voice Query": "വോയ്‌സ് ചോദ്യം", "Photo Query": "ഫോട്ടോ ചോദ്യം" },
                clarity: { "Yes, very clear": "അതെ, വളരെ വ്യക്തം", "Somewhat clear": "ചെറിയ വ്യക്‌തത", "Difficult to understand": "മനസ്സിലാക്കാൻ ബുദ്ധിമുട്ട്" },
                feat: { "Nearby hospitals information": "സമീപത്തെ ആശുപത്രികളുടെ വിവരങ്ങൾ", "Panchayat updates": "പഞ്ചായത്ത് അപ്ഡേറ്റുകൾ", "Help with filling government forms": "സർക്കാർ ഫോമുകൾ പൂരിപ്പിക്കാൻ സഹായം", "More local language support": "കൂടുതൽ പ്രാദേശിക ഭാഷാ പിന്തുണ", "Offline mode": "ഓഫ്‌ലൈൻ മോഡ്", "Other": "മറ്റുള്ളവ" },
                reuse: { "Yes": "അതെ", "Maybe": "ഒരുപക്ഷേ", "No": "ഇല്ല" }
            }
        }
    };

    const t = translations[language as keyof typeof translations] || translations.English;

    // Add robust fallback for translation maps just in case
    const getLabel = (cat: 'sect' | 'clarity' | 'feat' | 'reuse', englishKey: string) => {
        return t.opts?.[cat]?.[englishKey as keyof typeof t.opts[typeof cat]] || englishKey;
    };

    const handleCheckboxChange = (field: "sections" | "features", value: string, checked: boolean) => {
        setFormData(prev => {
            const currentList = prev[field];
            if (checked) {
                return { ...prev, [field]: [...currentList, value] };
            } else {
                return { ...prev, [field]: currentList.filter(item => item !== value) };
            }
        });
    };

    const handleStarRating = (field: "experience" | "rating" | "recommend", value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const StarInput = ({ field, value }: { field: "experience" | "rating" | "recommend", value: number }) => (
        <div className="flex gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleStarRating(field, star)}
                    className="focus:outline-none transition-transform hover:scale-125 duration-200"
                >
                    <Star
                        className={cn(
                            "h-8 w-8 transition-colors",
                            star <= value
                                ? "fill-orange-india text-orange-india drop-shadow-[0_0_8px_rgba(255,153,51,0.5)]"
                                : "text-muted-foreground/30 hover:text-orange-india/50"
                        )}
                    />
                </button>
            ))}
        </div>
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataObj = new FormData();

        // Rating fields
        if (formData.experience) formDataObj.append(EntryIDs.experience, formData.experience.toString());
        if (formData.rating) formDataObj.append(EntryIDs.rating, formData.rating.toString());
        if (formData.recommend) formDataObj.append(EntryIDs.recommend, formData.recommend.toString());

        // Multiple choice / Radio fields
        if (formData.clarity) formDataObj.append(EntryIDs.clarity, formData.clarity);
        if (formData.reuse) formDataObj.append(EntryIDs.reuse, formData.reuse);

        // Text fields
        if (formData.improve) formDataObj.append(EntryIDs.improve, formData.improve);
        if (formData.name) formDataObj.append(EntryIDs.name, formData.name);
        if (formData.village) formDataObj.append(EntryIDs.village, formData.village);

        // Array / Checkbox fields
        formData.sections.forEach(val => formDataObj.append(EntryIDs.sections, val));
        formData.features.forEach(val => formDataObj.append(EntryIDs.features, val));

        try {
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: "POST",
                mode: "no-cors",
                body: formDataObj,
            });
            setIsSuccess(true);
            setTimeout(() => handleOpenChange(false), 3000);
        } catch (error) {
            console.error(error);
            toast.error(t.error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setTimeout(() => {
                setFormData({
                    experience: 0, rating: 0, sections: [], clarity: "", improve: "",
                    features: [], reuse: "", recommend: 0, name: "", village: ""
                });
                setIsSuccess(false);
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 z-50 bg-primary hover:bg-primary/90 text-primary-foreground group"
                >
                    <MessageSquarePlus className="h-6 w-6 group-hover:animate-pulse" />
                    <span className="sr-only">{t.button}</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl overflow-hidden glassmorphism max-h-[90vh] flex flex-col p-0">
                {!isSuccess ? (
                    <>
                        <DialogHeader className="p-6 pb-2 shrink-0 border-b border-white/10 dark:border-white/5">
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-india bg-clip-text text-transparent">
                                {t.title}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">{t.description}</DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="flex-1 overflow-y-auto w-full p-6 py-4">
                            <form id="feedback-form" onSubmit={handleSubmit} className="space-y-8 pr-4">

                                {/* Q1 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q1}</Label>
                                    <StarInput field="experience" value={formData.experience} />
                                </div>

                                {/* Q2 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q2}</Label>
                                    <StarInput field="rating" value={formData.rating} />
                                </div>

                                {/* Q3 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q3}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                        {SECTION_OPTIONS.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`sect-${opt}`}
                                                    checked={formData.sections.includes(opt)}
                                                    onCheckedChange={(checked) => handleCheckboxChange("sections", opt, checked as boolean)}
                                                />
                                                <label htmlFor={`sect-${opt}`} className="text-sm cursor-pointer">{getLabel('sect', opt)}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Q4 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q4}</Label>
                                    <RadioGroup value={formData.clarity} onValueChange={(val) => setFormData(prev => ({ ...prev, clarity: val }))}>
                                        {CLARITY_OPTIONS.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2 py-1">
                                                <RadioGroupItem value={opt} id={`clarity-${opt}`} />
                                                <label htmlFor={`clarity-${opt}`} className="text-sm cursor-pointer">{getLabel('clarity', opt)}</label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                {/* Q5 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q5}</Label>
                                    <Textarea
                                        value={formData.improve}
                                        onChange={(e) => setFormData(prev => ({ ...prev, improve: e.target.value }))}
                                        className="min-h-[80px] bg-background/50 border-primary/20"
                                    />
                                </div>

                                {/* Q6 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q6}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                        {FEATURE_OPTIONS.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`feat-${opt}`}
                                                    checked={formData.features.includes(opt)}
                                                    onCheckedChange={(checked) => handleCheckboxChange("features", opt, checked as boolean)}
                                                />
                                                <label htmlFor={`feat-${opt}`} className="text-sm cursor-pointer">{getLabel('feat', opt)}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Q7 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q7}</Label>
                                    <RadioGroup value={formData.reuse} onValueChange={(val) => setFormData(prev => ({ ...prev, reuse: val }))} className="flex gap-6 mt-2">
                                        {REUSE_OPTIONS.map((opt) => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <RadioGroupItem value={opt} id={`reuse-${opt}`} />
                                                <label htmlFor={`reuse-${opt}`} className="text-sm cursor-pointer">{getLabel('reuse', opt)}</label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>

                                {/* Q8 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q8}</Label>
                                    <StarInput field="recommend" value={formData.recommend} />
                                </div>

                                {/* Q9 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q9}</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-background/50 border-primary/20"
                                    />
                                </div>

                                {/* Q10 */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold">{t.q10}</Label>
                                    <Input
                                        value={formData.village}
                                        onChange={e => setFormData(prev => ({ ...prev, village: e.target.value }))}
                                        className="bg-background/50 border-primary/20"
                                    />
                                </div>

                            </form>
                        </ScrollArea>

                        <DialogFooter className="p-6 pt-4 shrink-0 border-t border-white/10 dark:border-white/5 bg-card/50">
                            <Button
                                type="submit"
                                form="feedback-form"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-6 transition-all shadow-md"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t.submitting}</>
                                ) : (
                                    t.submit
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in p-6">
                        <CheckCircle2 className="h-24 w-24 text-green-india animate-bounce" />
                        <h2 className="text-3xl font-bold text-foreground">{t.successTitle}</h2>
                        <p className="text-center text-muted-foreground text-lg">{t.successMessage}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
