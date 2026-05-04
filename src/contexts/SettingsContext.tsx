import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type FontSize = "normal" | "large" | "xlarge";

interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("system");
    const [fontSize, setFontSize] = useState<FontSize>("normal");

    // Load from local storage
    useEffect(() => {
        const storedTheme = localStorage.getItem("civicai-theme") as Theme;
        const storedFontSize = localStorage.getItem("civicai-fontsize") as FontSize;
        if (storedTheme) setTheme(storedTheme);
        if (storedFontSize) setFontSize(storedFontSize);
    }, []);

    // Apply theme class to document element
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
        localStorage.setItem("civicai-theme", theme);
    }, [theme]);

    // Apply font size scale
    useEffect(() => {
        const root = window.document.documentElement;

        // Clear previous font-size classes if we use tailwind text classes on root
        root.classList.remove("text-[16px]", "text-[18px]", "text-[20px]");

        if (fontSize === "normal") {
            root.style.fontSize = "16px";
        } else if (fontSize === "large") {
            root.style.fontSize = "18px";
        } else if (fontSize === "xlarge") {
            root.style.fontSize = "20px";
        }
        localStorage.setItem("civicai-fontsize", fontSize);
    }, [fontSize]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
