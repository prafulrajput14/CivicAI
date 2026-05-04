import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Moon, Monitor, Type, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsDialog() {
    const { theme, setTheme, fontSize, setFontSize } = useSettings();
    const { language } = useLanguage();

    const translations = {
        English: {
            title: "Settings",
            appearance: "Appearance",
            light: "Light",
            dark: "Dark",
            system: "System",
            textSize: "Text Size",
            normal: "Normal",
            large: "Large",
            xlarge: "Extra Large"
        },
        Hindi: {
            title: "सेटिंग्स",
            appearance: "दिखावट",
            light: "हल्का",
            dark: "गहरा",
            system: "सिस्टम",
            textSize: "टेक्स्ट का आकार",
            normal: "सामान्य",
            large: "बड़ा",
            xlarge: "बहुत बड़ा"
        },
        Punjabi: {
            title: "ਸੈਟਿੰਗਜ਼",
            appearance: "ਦਿੱਖ",
            light: "ਰੌਸ਼ਨੀ",
            dark: "ਹਨੇਰਾ",
            system: "ਸਿਸਟਮ",
            textSize: "ਟੈਕਸਟ ਦਾ ਆਕਾਰ",
            normal: "ਆਮ",
            large: "ਵੱਡਾ",
            xlarge: "ਬਹੁਤ ਵੱਡਾ"
        },
        Marathi: {
            title: "सेटिंग्ज",
            appearance: "देखावा",
            light: "प्रकाश",
            dark: "गडद",
            system: "सिस्टम",
            textSize: "मजकुराचा आकार",
            normal: "सामान्य",
            large: "मोठा",
            xlarge: "खूप मोठा"
        },
        Gujarati: {
            title: "સેટિંગ્સ",
            appearance: "દેખાવ",
            light: "પ્રકાશ",
            dark: "શ્યામ",
            system: "સિસ્ટમ",
            textSize: "ટેક્સ્ટ કદ",
            normal: "સામાન્ય",
            large: "મોટું",
            xlarge: "વધારાનું મોટું"
        },
        Bengali: {
            title: "সেটিংস",
            appearance: "চেহারা",
            light: "হালকা",
            dark: "গাঢ়",
            system: "সিস্টেম",
            textSize: "পাঠ্য আকার",
            normal: "স্বাভাবিক",
            large: "বড়",
            xlarge: "অতিরিক্ত বড়"
        },
        Tamil: {
            title: "அமைப்புகள்",
            appearance: "தோற்றம்",
            light: "ஒளி",
            dark: "இருண்ட",
            system: "அமைப்பு",
            textSize: "உரை அளவு",
            normal: "சாதாரண",
            large: "பெரிய",
            xlarge: "மிகப் பெரிய"
        },
        Telugu: {
            title: "సెట్టింగులు",
            appearance: "కనిపించే తీరు",
            light: "కాంతి",
            dark: "చీకటి",
            system: "సిస్టమ్",
            textSize: "వచన పరిమాణం",
            normal: "సాధారణ",
            large: "పెద్ద",
            xlarge: "అదనపు పెద్ద"
        },
        Kannada: {
            title: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
            appearance: "ಗೋಚರತೆ",
            light: "ಬೆಳಕು",
            dark: "ಕತ್ತಲೆ",
            system: "ಸಿಸ್ಟಮ್",
            textSize: "ಪಠ್ಯ ಗಾತ್ರ",
            normal: "ಸಾಮಾನ್ಯ",
            large: "ದೊಡ್ಡ",
            xlarge: "ಹೆಚ್ಚುವರಿ ದೊಡ್ಡ"
        },
        Malayalam: {
            title: "ക്രമീകരണങ്ങൾ",
            appearance: "രൂപം",
            light: "വെളിച്ചം",
            dark: "ഇരുണ്ട",
            system: "സിസ്റ്റം",
            textSize: "ടെക്സ്റ്റ് വലുപ്പം",
            normal: "സാധാരണ",
            large: "വലുത്",
            xlarge: "വളരെ വലുത്"
        }
    };

    const t = translations[language as keyof typeof translations] || translations.Hindi;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{t.title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">{t.appearance}</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setTheme("light")}
                            >
                                <Sun className="h-5 w-5" />
                                <span className="text-xs">{t.light}</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="h-5 w-5" />
                                <span className="text-xs">{t.dark}</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setTheme("system")}
                            >
                                <Monitor className="h-5 w-5" />
                                <span className="text-xs">{t.system}</span>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">{t.textSize}</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    fontSize === "normal" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setFontSize("normal")}
                            >
                                <Type className="h-4 w-4" />
                                <span className="text-xs">{t.normal}</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    fontSize === "large" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setFontSize("large")}
                            >
                                <Type className="h-5 w-5" />
                                <span className="text-xs">{t.large}</span>
                            </Button>
                            <Button
                                variant="outline"
                                className={cn(
                                    "flex flex-col items-center justify-center h-20 gap-2 border-2",
                                    fontSize === "xlarge" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                                )}
                                onClick={() => setFontSize("xlarge")}
                            >
                                <Type className="h-6 w-6" />
                                <span className="text-xs">{t.xlarge}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
