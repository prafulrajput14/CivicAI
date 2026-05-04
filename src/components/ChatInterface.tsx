import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { streamChat, Message } from "@/lib/chatApi";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { MapPin } from "lucide-react";
import { getLocalWeatherAndCrops } from "@/lib/weatherCropApi";

interface ChatInterfaceProps {
  category?: string;
  categoryTitle?: string;
  categoryIcon?: React.ReactNode;
  onBack: () => void;
  initialMessage?: string;
}

export function ChatInterface({
  category,
  categoryTitle,
  categoryIcon,
  onBack,
  initialMessage,
}: ChatInterfaceProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const translations = {
    English: {
      title: categoryTitle || "CivicAI Chat",
      subtitle: "AI Assistant",
      voiceNotSupported: "Your browser does not support voice input",
      micPermission: "Please allow microphone access",
      listening: "🎤 Listening... Keep speaking",
      locationBtn: "📍 Get Local Weather & Crop Rates",
      locationError: "Failed to get location. Please allow access.",
    },
    Hindi: {
      title: categoryTitle || "CivicAI चैट",
      subtitle: "AI सहायक",
      voiceNotSupported: "आपका ब्राउज़र वॉइस इनपुट को सपोर्ट नहीं करता",
      micPermission: "माइक्रोफोन की अनुमति दें",
      listening: "🎤 सुन रहा हूँ... बोलना जारी रखें",
      locationBtn: "📍 स्थानीय मौसम और मंडी भाव जानें",
      locationError: "लोकेशन नहीं मिल पाई। कृपया अनुमति दें।",
    },
    Punjabi: {
      title: categoryTitle || "CivicAI ਚੈਟ",
      subtitle: "AI ਸਹਾਇਕ",
      voiceNotSupported: "ਤੁਹਾਡਾ ਬ੍ਰਾਊਜ਼ਰ ਵੌਇਸ ਇਨਪੁੱਟ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ",
      micPermission: "ਕਿਰਪਾ ਕਰਕੇ ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
      listening: "🎤 ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲਦੇ ਰਹੋ",
      locationBtn: "📍 ਸਥਾਨਕ ਮੌਸਮ ਅਤੇ ਫਸਲਾਂ ਦੇ ਰੇਟ ਪ੍ਰਾਪਤ ਕਰੋ",
      locationError: "ਟਿਕਾਣਾ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫಲ। ਕਿਰਪਾ ਕਰਕੇ ਇਜਾਜ਼ਤ ਦਿਓ।",
    },
    Marathi: {
      title: categoryTitle || "CivicAI चॅट",
      subtitle: "AI सहाय्यक",
      voiceNotSupported: "तुमचा ब्राउझर व्हॉइस इनपुटला सपोर्ट करत नाही",
      micPermission: "कृपया मायक्रोफोनची परवानगी द्या",
      listening: "🎤 ऐकत आहे... बोलणे सुरू ठेवा",
      locationBtn: "📍 स्थानिक हवामान आणि पीक दर मिळवा",
      locationError: "स्थान मिळविण्यात अयशस्वी. कृपया परवानगी द्या.",
    },
    Gujarati: {
      title: categoryTitle || "CivicAI ચેટ",
      subtitle: "AI સહાયક",
      voiceNotSupported: "તમારું બ્રાઉઝર વૉઇસ ઇનપુટનું સમર્થન કરતું નથી",
      micPermission: "કૃપા કરીને માઇક્રોફોનની મંજૂરી આપો",
      listening: "🎤 સાંભળી રહ્યું છે... બોલવાનું ચાલુ રાખો",
      locationBtn: "📍 સ્થાનિક હવામાન અને પાકના ભાવ મેળવો",
      locationError: "સ્થાન મેળવવામાં નિષ્ફળ. કૃપા કરીને મંજૂરી આપો.",
    },
    Bengali: {
      title: categoryTitle || "CivicAI চ্যাট",
      subtitle: "AI সহকারী",
      voiceNotSupported: "আপনার ব্রাউজার ভয়েস ইনপুট সমর্থন করে না",
      micPermission: "दয়া করে মাইক্রোফোনের অনুমতি দিন",
      listening: "🎤 শুনছি... বলতে থাকুন",
      locationBtn: "📍 স্থানীয় আবহাওয়া ও ফসলের দর পান",
      locationError: "অবস্থান পেতে ব্যর্থ। অনুগ্রহ করে অনুমতি দিন।",
    },
    Tamil: {
      title: categoryTitle || "CivicAI அரட்டை",
      subtitle: "AI உதவியாளர்",
      voiceNotSupported: "உங்கள் உலாவி குரல் உள்ளீட்டை ஆதரிக்கவில்லை",
      micPermission: "மைக்ரோஃபோன் அனுமதியை வழங்கவும்",
      listening: "🎤 கேட்கிறது... தொடர்ந்து பேசுங்கள்",
      locationBtn: "📍 உள்ளூர் வானிலை மற்றும் பயிர் விலைகளைப் பெறுங்கள்",
      locationError: "இடத்தைப் பெற முடியவில்லை. அனுமதியை வழங்கவும்.",
    },
    Telugu: {
      title: categoryTitle || "CivicAI చాట్",
      subtitle: "AI సహాయకుడు",
      voiceNotSupported: "మీ బ్రౌజర్ వాయిస్ ఇన్‌పుట్‌కు మద్దతు ఇవ్వదు",
      micPermission: "దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి",
      listening: "🎤 వింటున్నాను... మాట్లాడుతూ ఉండండి",
      locationBtn: "📍 స్థానిక వాతావరణం మరియు పంట ధరలను పొందండి",
      locationError: "స్థానాన్ని పొందడంలో విఫలమైంది. దయచేసి అనుమతి ఇవ్వండి.",
    },
    Kannada: {
      title: categoryTitle || "CivicAI ಚಾಟ್",
      subtitle: "AI ಸಹಾಯಕ",
      voiceNotSupported: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಅನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ",
      micPermission: "ದಯವಿಟ್ಟು ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಯನ್ನು ನೀಡಿ",
      listening: "🎤 ಕೇಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡುತ್ತಿರಿ",
      locationBtn: "📍 ಸ್ಥಳೀಯ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ದರಗಳನ್ನು ಪಡೆಯಿರಿ",
      locationError: "ಸ್ಥಳವನ್ನು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಅನುಮತಿ ನೀಡಿ.",
    },
    Malayalam: {
      title: categoryTitle || "CivicAI ചാറ്റ്",
      subtitle: "AI സഹായി",
      voiceNotSupported: "നിങ്ങളുടെ ബ്രൗസർ വോയ്‌സ് ഇൻപുട്ടിനെ പിന്തുണയ്ക്കുന്നില്ല",
      micPermission: "ദയവായി മൈക്രോഫോൺ അനുമതി നൽകുക",
      listening: "🎤 കേൾക്കുന്നു... സംസാരിക്കുന്നത് തുടരുക",
      locationBtn: "📍 പ്രാദേശിക കാലാവസ്ഥയും വിള നിരക്കുകളും നേടുക",
      locationError: "സ്ഥലം ലഭിക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി അനുമതി നൽകുക.",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.Hindi;
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [redirectSuggestion, setRedirectSuggestion] = useState<{
    label: string;
    categoryId: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Re-run greeting when category or language changes, or initial load
  useEffect(() => {
    if ((messages.length === 0 && !hasSentInitial) || messages.length === 1) {
      if (initialMessage) {
        // Auto-send the FAQ question
        setHasSentInitial(true);
        sendMessage(initialMessage);
      } else if (category) {
        // Show greeting for category
        let greetingText = "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ?";

        switch (language) {
          case "English":
            greetingText = "Hello! How can I help you today?";
            break;
          case "Punjabi":
            greetingText = "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?";
            break;
          case "Marathi":
            greetingText = "नमस्कार! मी तुमची कशी मदत करू शकतो?";
            break;
          case "Gujarati":
            greetingText = "નમસ્તે! હું તમારી કેવી રીતે મદદ કરી શકું?";
            break;
          case "Bengali":
            greetingText = "নমস্কার! আমি আপনাকে কীভাবে সাহায্য করতে পারি?";
            break;
          case "Tamil":
            greetingText = "வணக்கம்! நான் உங்களுக்கு எப்படி உதவ முடியும்?";
            break;
          case "Telugu":
            greetingText = "నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?";
            break;
          case "Kannada":
            greetingText = "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?";
            break;
          case "Malayalam":
            greetingText = "നമസ്കാരം! ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?";
            break;
          case "Hindi":
          default: {
            const categoryGreetings: Record<string, string> = {
              government: "नमस्ते! मैं सरकारी योजनाओं में आपकी मदद कर सकता हूँ। आप PM-KISAN, पेंशन, आधार, या किसी अन्य योजना के बारे में पूछ सकते हैं।",
              health: "नमस्ते! मैं स्वास्थ्य संबंधी जानकारी में आपकी मदद कर सकता हूँ। प्राथमिक उपचार, स्वच्छता, या किसी भी स्वास्थ्य समस्या के बारे में पूछें।",
              farming: "नमस्ते! मैं खेती-किसानी में आपकी मदद कर सकता हूँ। फसल, सिंचाई, खाद, या कीट नियंत्रण के बारे में पूछें।",
              education: "नमस्ते! मैं पढ़ाई में आपकी मदद कर सकता हूँ। कक्षा 6-12 की किसी भी विषय में प्रश्न पूछ सकते हैं।",
            };
            greetingText = categoryGreetings[category] || greetingText;
            break;
          }
        }
        // If there's already a message, replace it if it's the first one, otherwise just set it.
        setMessages((prev) => {
          if (prev.length <= 1) {
            return [{ role: "assistant", content: greetingText }];
          }
          return prev;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, initialMessage, hasSentInitial, language]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    // Clear any previous redirect suggestion
    setRedirectSuggestion(null);

    await streamChat({
      messages: [...messages, userMessage],
      category,
      language,
      onDelta: updateAssistant,
      onDone: (guardRedirect) => {
        setIsLoading(false);
        if (guardRedirect) {
          setRedirectSuggestion({
            label: guardRedirect.suggestedCategoryLabel,
            categoryId: guardRedirect.suggestedCategoryId,
          });
        }
      },
      onError: (error) => {
        toast.error(error);
        setIsLoading(false);
      },
    });
  };

  const handleSend = () => {
    sendMessage(input);
  };

  const startListening = () => {
    const win = window as unknown as Window;
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error(t.voiceNotSupported);
      return;
    }

    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionClass();

    // Set speech recognition language based on user selection
    const langMap: Record<string, string> = {
      English: "en-IN",
      Hindi: "hi-IN",
      Punjabi: "pa-IN",
      Marathi: "mr-IN",
      Gujarati: "gu-IN",
      Bengali: "bn-IN",
      Tamil: "ta-IN",
      Telugu: "te-IN",
      Kannada: "kn-IN",
      Malayalam: "ml-IN",
    };
    recognitionRef.current.lang = langMap[language] || "hi-IN";

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error(t.micPermission);
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleLocationFetch = () => {
    if (!navigator.geolocation) {
      toast.error(t.locationError || "Geolocation is not supported by your browser");
      return;
    }

    setIsFetchingLocation(true);

    // Add a user message indicating the request
    const reqMsg = t.locationBtn || "📍 Get Local Weather & Crop Rates";
    setMessages((prev) => [...prev, { role: "user", content: reqMsg }]);
    // Add empty loading assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const result = await getLocalWeatherAndCrops(lat, lon, language);

          // Replace loading message with the result
          setMessages((prev) => {
            const newMessages = [...prev];
            // The last message is our empty assistant message
            newMessages[newMessages.length - 1] = { role: "assistant", content: result };
            return newMessages;
          });
        } catch (error) {
          toast.error("Failed to fetch location data.");
          setMessages((prev) => prev.slice(0, -2)); // remove the loading messages
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(t.locationError || "Failed to get location");
        setMessages((prev) => prev.slice(0, -2)); // Remove loading messages
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {categoryIcon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            {categoryIcon}
          </div>
        )}
        <div>
          <h2 className="font-semibold text-foreground">{t.title}</h2>
          <p className="text-xs text-muted-foreground">{t.subtitle}</p>
        </div>
      </div>

      {/* Farming Quick Actions */}
      {category === "farming" && (
        <div className="bg-card px-4 py-2 border-b border-border flex gap-2 overflow-x-auto scroolbar-hide">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs shrink-0 bg-green-india/10 dark:bg-green-india/20 text-green-india dark:text-green-light border-green-india/20 dark:border-green-india/30 hover:bg-green-india/20 dark:hover:bg-green-india/30"
            onClick={handleLocationFetch}
            disabled={isFetchingLocation || isLoading}
          >
            {isFetchingLocation ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <MapPin className="h-3 w-3 mr-1" />
            )}
            {t.locationBtn || "📍 Get Local Data"}
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex animate-fade-in",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-soft",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card text-foreground rounded-bl-sm"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-black/5 dark:prose-pre:bg-white/5 prose-pre:text-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Category redirect suggestion button */}
        {redirectSuggestion && (
          <div className="flex justify-start animate-fade-in">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 gap-2 mt-1"
            >
              <ArrowRight className="h-4 w-4" />
              {language === "Hindi" || language === "Punjabi" || language === "Marathi" || language === "Gujarati" || language === "Bengali" || language === "Tamil" || language === "Telugu" || language === "Kannada" || language === "Malayalam"
                ? `${redirectSuggestion.label} सेक्शन में जाएं`
                : `Go to ${redirectSuggestion.label} Section`
              }
            </Button>
          </div>
        )}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-soft">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        )}
        {isFetchingLocation && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-soft flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-green-india" />
              <span className="text-sm text-muted-foreground">Fetching local data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            className="rounded-xl shrink-0"
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={language === "English" ? "Type your question..." : "अपना सवाल लिखें..."}
            className="rounded-xl bg-background"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-xl shrink-0"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-center text-primary mt-2 animate-pulse">
            {t.listening}
          </p>
        )}
      </div>
    </div>
  );
}
