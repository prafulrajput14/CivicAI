import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, Square, X, Settings2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactMarkdown from "react-markdown";
import { useVoice } from "@/hooks/useVoice";
import { streamChat, Message } from "@/lib/chatApi";
import { toast } from "sonner";

interface VoiceChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VoiceChatPanel({ isOpen, onClose }: VoiceChatPanelProps) {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ruralMode, setRuralMode] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text.trim() };
        setMessages((prev) => [...prev, userMessage]);
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

        let modifiedLanguageContext = language;
        if (ruralMode) {
            modifiedLanguageContext = language + " (Rural Mode: Please use very simple, local dialect words and keep responses extremely short, 1-2 sentences max)";
        }

        try {
            await streamChat({
                messages: [...messages, userMessage],
                language: modifiedLanguageContext,
                onDelta: updateAssistant,
                onDone: () => {
                    setIsLoading(false);
                    speak(assistantContent);
                },
                onError: (error) => {
                    toast.error(error);
                    setIsLoading(false);
                },
            });
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useVoice({
        language,
        ruralMode,
        onTranscriptComplete: handleSend
    });

    // Click outside to close (optional, but good UX)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                // Uncomment if you want click outside to close
                // onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className={cn(
                "fixed top-0 right-0 h-full w-full sm:w-[400px] shadow-2xl z-50 transition-transform duration-300 ease-in-out transform flex flex-col",
                highContrast ? "bg-black text-white" : "bg-card text-foreground",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Header */}
            <div className={cn("flex items-center justify-between p-4 border-b", highContrast ? "border-gray-800" : "border-border")}>
                <div>
                    <h2 className={cn("font-bold", largeText ? "text-2xl" : "text-lg")}>
                        CivicAI Voice
                    </h2>
                    <p className={cn(highContrast ? "text-gray-400" : "text-muted-foreground", largeText ? "text-sm" : "text-xs")}>
                        {ruralMode ? "सरल भाषा मोड (Simple Mode)" : "AI Assistant"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Settings Dropdown/Menu could go here, for now just buttons */}
                    <Button variant="ghost" size="icon" onClick={() => setRuralMode(!ruralMode)} title="Rural Mode">
                        <Settings2 className={cn("h-5 w-5", ruralMode && "text-green-india")} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Accessibility Toggles (Debug/Demo) */}
            <div className={cn("flex gap-2 p-2 text-xs border-b", highContrast ? "border-gray-800" : "border-border")}>
                <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
                    High Contrast
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
                    Large Text
                </label>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                        <Mic className="h-16 w-16" />
                        <p className={cn(largeText ? "text-xl" : "text-sm")}>
                            {language === "English" ? "Tap the mic to start speaking" : "बोलने के लिए माइक दबाएं"}
                        </p>
                    </div>
                )}
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
                                largeText ? "text-lg" : "text-sm",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground rounded-br-sm"
                                    : highContrast ? "bg-gray-900 border border-gray-800 text-white" : "bg-muted rounded-bl-sm"
                            )}
                        >
                            {msg.role === "assistant" ? (
                                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ) : (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                        <div className={cn("rounded-2xl rounded-bl-sm px-4 py-3 shadow-soft", highContrast ? "bg-gray-900 border border-gray-800" : "bg-muted")}>
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls Area */}
            <div className={cn("p-6 border-t flex flex-col items-center gap-4 relative", highContrast ? "border-gray-800 bg-black" : "border-border bg-card")}>
                {/* Glow/Waveform effect behind mic */}
                {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping" />
                        <div className="w-32 h-32 absolute bg-primary/10 rounded-full animate-pulse" />
                    </div>
                )}

                {isSpeaking && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse" />
                )}

                <div className="flex items-center justify-center w-full gap-6 z-10">
                    {/* Stop Speaking Button (only visible when speaking) */}
                    <Button
                        size="icon"
                        variant={highContrast ? "outline" : "secondary"}
                        onClick={stopSpeaking}
                        className={cn("rounded-full h-12 w-12 transition-all", isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none")}
                        disabled={!isSpeaking}
                        title="Stop Speaking"
                    >
                        <Square className="h-5 w-5 text-destructive fill-current" />
                    </Button>

                    {/* Main Mic Button */}
                    <Button
                        size="icon"
                        onClick={() => isListening ? stopListening() : startListening()}
                        className={cn(
                            "rounded-full h-20 w-20 shadow-xl transition-all duration-300",
                            isListening ? "bg-red-500 hover:bg-red-600 text-white scale-110" : "bg-primary hover:bg-primary/90 text-primary-foreground",
                            highContrast && !isListening && "border-2 border-white"
                        )}
                    >
                        {isListening ? <Mic className="h-8 w-8 animate-pulse" /> : <Mic className="h-8 w-8" />}
                    </Button>

                    {/* Repeat/Replay Button (only if there are AI messages) */}
                    <Button
                        size="icon"
                        variant={highContrast ? "outline" : "secondary"}
                        onClick={() => {
                            const lastAiMessage = [...messages].reverse().find(m => m.role === 'assistant');
                            if (lastAiMessage) {
                                speak(lastAiMessage.content);
                            }
                        }}
                        className={cn("rounded-full h-12 w-12 transition-all", messages.length > 0 && !isSpeaking ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none")}
                        title="Replay last message"
                    >
                        <Volume2 className="h-5 w-5" />
                    </Button>
                </div>

                <p className={cn("text-center font-medium animate-pulse h-6", isListening ? "text-primary" : "text-transparent", largeText ? "text-lg" : "text-sm")}>
                    {isListening ? (language === "English" ? "Listening..." : "सुन रहा हूँ...") : " "}
                </p>

            </div>
        </div>
    );
}
