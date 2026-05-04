import { useState } from "react";
import { Mic } from "lucide-react";
import { VoiceChatPanel } from "./VoiceChatPanel";

export function FloatingVoiceButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full h-14 w-14 shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group ${isOpen ? 'hidden' : 'block'}`}
                aria-label="Open Voice Assistant"
            >
                <Mic className="h-8 w-8 relative z-10" />
            </button>

            <VoiceChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
