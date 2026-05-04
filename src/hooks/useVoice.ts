import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseVoiceProps {
    language: string;
    ruralMode: boolean;
    onTranscriptComplete: (text: string) => void;
}

export function useVoice({ language, ruralMode, onTranscriptComplete }: UseVoiceProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

    const currentLangCode = langMap[language] || "hi-IN";

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthesisRef.current = window.speechSynthesis;
            const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
            }
        }
    }, []);

    // --- Recognition (Listening) using Web Speech API ---
    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        try {
            stopSpeaking();
            setIsListening(true);
            recognitionRef.current.lang = currentLangCode;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.trim()) {
                    onTranscriptComplete(transcript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error !== "no-speech") {
                    toast.error("Could not understand. Please try again.");
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.start();
        } catch (error) {
            console.error("Mic access error", error);
            setIsListening(false);
        }
    }, [currentLangCode, onTranscriptComplete]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
        }
        setIsSpeaking(false);
    }, []);

    // --- Synthesis (Speaking) using Web Speech API ---
    const speak = useCallback((rawText: string) => {
        if (!rawText || !synthesisRef.current) return;

        // Clean text for better speech synthesis
        let text = rawText
            .replace(/[*#_`~]/g, '') // Remove markdown symbols like asterisks
            .replace(/(\d+)\.\s/g, '$1, '); // Fix list digits like "1. " to pause instead of saying "one point"

        stopSpeaking();
        setIsSpeaking(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLangCode;
        utterance.rate = ruralMode ? 0.9 : 1.0;
        utteranceRef.current = utterance;

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        synthesisRef.current.speak(utterance);
    }, [currentLangCode, ruralMode, stopSpeaking]);

    return {
        isListening,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        stopSpeaking
    };
}

