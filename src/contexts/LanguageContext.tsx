import React, { createContext, useContext, useState, useEffect } from "react";

export type Language =
    | "English"
    | "Hindi"
    | "Punjabi"
    | "Marathi"
    | "Gujarati"
    | "Bengali"
    | "Tamil"
    | "Telugu"
    | "Kannada"
    | "Malayalam";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("preferredLanguage");
        return (saved as Language) || "Hindi";
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("preferredLanguage", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
