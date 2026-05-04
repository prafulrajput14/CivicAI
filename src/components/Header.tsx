import { Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsDialog } from "./SettingsDialog";
import { useAuth } from "@/contexts/AuthContext";

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "Hindi", label: "हिंदी", flag: "🇮🇳" },
  { id: "English", label: "English", flag: "🇬🇧" },
  { id: "Punjabi", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { id: "Marathi", label: "मराठी", flag: "🇮🇳" },
  { id: "Gujarati", label: "ગુજરાતી", flag: "🇮🇳" },
  { id: "Bengali", label: "বাংলা", flag: "🇮🇳" },
  { id: "Tamil", label: "தமிழ்", flag: "🇮🇳" },
  { id: "Telugu", label: "తెలుగు", flag: "🇮🇳" },
  { id: "Kannada", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  { id: "Malayalam", label: "മലയാളം", flag: "🇮🇳" },
];

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const activeLanguage = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const translations = {
    English: { subtitle: "Rural Assistant" },
    Hindi: { subtitle: "ग्रामीण सहायक" },
    Punjabi: { subtitle: "ਪੇਂਡੂ ਸਹਾਇਕ" },
    Marathi: { subtitle: "ग्रामीण सहाय्यक" },
    Gujarati: { subtitle: "ગ્રામીણ સહાયક" },
    Bengali: { subtitle: "গ্রামীণ সহায়ক" },
    Tamil: { subtitle: "கிராமப்புற உதவியாளர்" },
    Telugu: { subtitle: "గ్రామీణ సహాయకుడు" },
    Kannada: { subtitle: "ಗ್ರಾಮೀಣ ಸಹಾಯಕ" },
    Malayalam: { subtitle: "ഗ്രാമീണ സഹായി" }
  };

  const t = translations[language as keyof typeof translations] || translations.Hindi;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            C
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">CivicAI</h1>
            <p className="text-xs text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron-light dark:bg-primary/20 hover:bg-saffron-light/80 dark:hover:bg-primary/30 text-sm text-foreground h-auto">
                <span>{activeLanguage.flag}</span>
                <span>{activeLanguage.label}</span>
                <Globe className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={language === lang.id ? "bg-accent" : ""}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <SettingsDialog />
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive flex items-center gap-1.5 h-auto px-3 py-1.5 rounded-full"
              title={`Signed in as ${user.name}`}
            >
              <span className="hidden sm:inline text-xs">{user.name.split(' ')[0]}</span>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
