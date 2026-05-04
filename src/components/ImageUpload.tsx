import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  onClose: () => void;
}

export function ImageUpload({ onTextExtracted, onClose }: ImageUploadProps) {
  const { language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);

  const translations = {
    English: {
      selectImage: "Please select an image file",
      errorProcessing: "Error processing image",
      extractedMsg: "Text extracted from image",
      noTextFound: "No text found in image",
      title: "Read from Photo",
      uploadTitle: "Upload Photo",
      uploadDesc: "Photo of document, form, or any text",
      openCamera: "Open Camera",
      processing: "Processing...",
      extractText: "Extract Text",
    },
    Hindi: {
      selectImage: "कृपया एक इमेज फाइल चुनें",
      errorProcessing: "इमेज प्रोसेस करने में त्रुटि हुई",
      extractedMsg: "इमेज से टेक्स्ट निकाला गया",
      noTextFound: "इमेज में कोई टेक्स्ट नहीं मिला",
      title: "फोटो से पढ़ें",
      uploadTitle: "फोटो अपलोड करें",
      uploadDesc: "दस्तावेज़, फॉर्म, या किसी भी टेक्स्ट की फोटो",
      openCamera: "कैमरा खोलें",
      processing: "प्रोसेस हो रहा है...",
      extractText: "टेक्स्ट निकालें",
    },
    Punjabi: {
      selectImage: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਚਿੱਤਰ ਫਾਈਲ ਚੁਣੋ",
      errorProcessing: "ਚਿੱਤਰ ਪ੍ਰਕਿਰਿਆ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ",
      extractedMsg: "ਚਿੱਤਰ ਤੋਂ ਟੈਕਸਟ ਕੱਢਿਆ ਗਿਆ",
      noTextFound: "ਚਿੱਤਰ ਵਿੱਚ ਕੋਈ ਟੈਕਸਟ ਨਹੀਂ ਮਿਲਿਆ",
      title: "ਫੋਟੋ ਤੋਂ ਪੜ੍ਹੋ",
      uploadTitle: "ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ",
      uploadDesc: "ਦਸਤਾਵੇਜ਼, ਫਾਰਮ, ਜਾਂ ਕਿਸੇ ਵੀ ਟੈਕਸਟ ਦੀ ਫੋਟੋ",
      openCamera: "ਕੈਮਰਾ ਖੋਲ੍ਹੋ",
      processing: "ਪ੍ਰਕਿਰਿਆ ਹੋ ਰਹੀ ਹੈ...",
      extractText: "ਟੈਕਸਟ ਕੱਢੋ",
    },
    Marathi: {
      selectImage: "कृपया एक प्रतिमा फाईल निवडा",
      errorProcessing: "प्रतिमा प्रक्रिया करण्यात त्रुटी",
      extractedMsg: "प्रतिमेतून मजकूर काढला",
      noTextFound: "प्रतिमेत कोणताही मजकूर आढळला नाही",
      title: "फोटोवरून वाचा",
      uploadTitle: "फोटो अपलोड करा",
      uploadDesc: "दस्तऐवज, फॉर्म किंवा कोणत्याही मजकुराचा फोटो",
      openCamera: "कॅमेरा उघडा",
      processing: "प्रक्रिया करत आहे...",
      extractText: "मजकूर काढा",
    },
    Gujarati: {
      selectImage: "કૃપા કરીને એક છબી ફાઇલ પસંદ કરો",
      errorProcessing: "છબી પર પ્રક્રિયા કરવામાં ભૂલ",
      extractedMsg: "છબીમાંથી ટેક્સ્ટ કાઢવામાં આવ્યું",
      noTextFound: "છબીમાં કોઈ ટેક્સ્ટ મળ્યું નથી",
      title: "ફોટો પરથી વાંચો",
      uploadTitle: "ફોટો અપલોડ કરો",
      uploadDesc: "દસ્તાવેજ, ફોર્મ અથવા કોઈપણ ટેક્સ્ટનો ફોટો",
      openCamera: "કેમેરા ખોલો",
      processing: "પ્રક્રિયા થઈ રહી છે...",
      extractText: "ટેક્સ્ટ કાઢો",
    },
    Bengali: {
      selectImage: "অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন",
      errorProcessing: "ছবি প্রক্রিয়া করতে ত্রুটি",
      extractedMsg: "ছবি থেকে টেক্সট বের করা হয়েছে",
      noTextFound: "ছবিতে কোনো টেক্সট পাওয়া যায়নি",
      title: "ছবি থেকে পড়ুন",
      uploadTitle: "ছবি আপলোড করুন",
      uploadDesc: "নথি, ফর্ম বা যেকোনো টেক্সটের ছবি",
      openCamera: "ক্যামেরা খুলুন",
      processing: "প্রক্রিয়া চলছে...",
      extractText: "টেক্সট বের করুন",
    },
    Tamil: {
      selectImage: "தயவுசெய்து ஒரு பட கோப்பை தேர்ந்தெடுக்கவும்",
      errorProcessing: "படத்தை செயலாக்குவதில் பிழை",
      extractedMsg: "படத்திலிருந்து உரை எடுக்கப்பட்டது",
      noTextFound: "படத்தில் உரை எதுவும் கிடைக்கவில்லை",
      title: "புகைப்படத்திலிருந்து படிக்கவும்",
      uploadTitle: "புகைப்படத்தை பதிவேற்றவும்",
      uploadDesc: "ஆவணம், படிவம் அல்லது ஏதேனும் உரை புகைப்படம்",
      openCamera: "கேமராவைத் திறக்கவும்",
      processing: "செயலாக்கப்படுகிறது...",
      extractText: "உரையை எடுக்கவும்",
    },
    Telugu: {
      selectImage: "దయచేసి ఇమేజ్ ఫైల్‌ను ఎంచుకోండి",
      errorProcessing: "ఇమేజ్ ప్రాసెస్ చేయడంలో లోపం",
      extractedMsg: "ఇమేజ్ నుండి టెక్స్ట్ సంగ్రహించబడింది",
      noTextFound: "ఇమేజ్‌లో ఏ టెక్స్ట్ కనుగొనబడలేదు",
      title: "ఫోటో నుండి చదవండి",
      uploadTitle: "ఫోటోను అప్‌లోడ్ చేయండి",
      uploadDesc: "పత్రం, ఫారం లేదా ఏదైనా టెక్స్ట్ ఫోటో",
      openCamera: "కెమెరాను తెరవండి",
      processing: "ప్రాసెస్ చేయబడుతోంది...",
      extractText: "టెక్స్ట్ సంగ్రహించండి",
    },
    Kannada: {
      selectImage: "ದಯವಿಟ್ಟು ಚಿತ್ರ ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
      errorProcessing: "ಚಿತ್ರ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಲ್ಲಿ ದೋಷ",
      extractedMsg: "ಚಿತ್ರದಿಂದ ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆಯಲಾಗಿದೆ",
      noTextFound: "ಚಿತ್ರದಲ್ಲಿ ಯಾವುದೇ ಪಠ್ಯ ಕಂಡುಬಂದಿಲ್ಲ",
      title: "ಫೋಟೋದಿಂದ ಓದಿ",
      uploadTitle: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      uploadDesc: "ದಾಖಲೆ, ಫಾರ್ಮ್ ಅಥವಾ ಯಾವುದೇ ಪಠ್ಯದ ಫೋಟೋ",
      openCamera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
      processing: "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
      extractText: "ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆಯಿರಿ",
    },
    Malayalam: {
      selectImage: "ദയവായി ഒരു ഇമേജ് ഫയൽ തിരഞ്ഞെടുക്കുക",
      errorProcessing: "ഇമേജ് പ്രോസസ്സ് ചെയ്യുന്നതിൽ പിശക്",
      extractedMsg: "ഇമേജിൽ നിന്ന് ടെക്സ്റ്റ് വേർതിരിച്ചെടുത്തു",
      noTextFound: "ഇമേജിൽ ടെക്സ്റ്റ് ഒന്നും കണ്ടെത്തിയില്ല",
      title: "ഫോട്ടോയിൽ നിന്ന് വായിക്കുക",
      uploadTitle: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
      uploadDesc: "പ്രമാണം, ഫോം അല്ലെങ്കിൽ ഏതെങ്കിലും ടെക്സ്റ്റിന്റെ ഫോട്ടോ",
      openCamera: "ക്യാമറ തുറക്കുക",
      processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
      extractText: "ടെക്സ്റ്റ് വേർതിരിച്ചെടുക്കുക",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.Hindi;
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t.selectImage);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);

    try {
      // Use the AI to extract text from image
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            language,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Please read and extract the text from this image. Explain it in ${language}. If it's a form or document, extract its information.`,
                  },
                  {
                    type: "image_url",
                    image_url: { url: image },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(t.errorProcessing);
      }

      // Read streamed response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) result += content;
              } catch {
                // Ignore parse errors from streamed chunks
              }
            }
          }
        }
      }

      if (result) {
        onTextExtracted(result);
        toast.success(t.extractedMsg);
      } else {
        toast.error(t.noTextFound);
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast.error(t.errorProcessing);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-lg max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {!image ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-4 p-8 rounded-2xl",
                "border-2 border-dashed border-border cursor-pointer",
                "hover:border-primary hover:bg-primary/5 transition-colors"
              )}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">{t.uploadTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {t.uploadDesc}
                </p>
              </div>
            </div>
            {/* Input for general file upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Input specifically for Camera */}
            <input
              id="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2"
              onClick={() => {
                document.getElementById('cameraInput')?.click();
              }}
            >
              <Camera className="h-5 w-5" />
              {t.openCamera}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img src={image} alt="Uploaded" className="w-full h-48 object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 rounded-xl"
                onClick={() => setImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="w-full rounded-xl gap-2"
              onClick={processImage}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t.processing}
                </>
              ) : (
                t.extractText
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
