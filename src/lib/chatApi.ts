export type Message = {
  role: "user" | "assistant";
  content: string;
};

import { guardCategory } from "./categoryGuard";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({
  messages,
  category,
  language,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  category?: string;
  language?: string;
  onDelta: (deltaText: string) => void;
  onDone: (guardRedirect?: { suggestedCategoryLabel: string; suggestedCategoryId: string }) => void;
  onError: (error: string) => void;
}) {
  try {
    // ===== CATEGORY GUARD — intercept before AI call =====
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg?.role === "user" && category) {
      const guardResult = guardCategory(lastUserMsg.content, category, language);
      if (guardResult?.blocked) {
        // Emit the redirect message locally — no API call
        onDelta(guardResult.redirectMessage);
        onDone({
          suggestedCategoryLabel: guardResult.suggestedCategoryLabel,
          suggestedCategoryId: guardResult.suggestedCategoryId,
        });
        return;
      }
    }
    // Deep-copy messages so we never mutate React state objects
    const enhancedMessages = messages.map((m) => ({ ...m }));
    const targetLang = language || "Hindi";

    // Inject current date context for temporal awareness
    const currentDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    });
    const dateContext = `CURRENT DATE AND TIME IN INDIA (IST): ${currentDate}.`;

    if (category === "education") {
      enhancedMessages.unshift({
        role: "user",
        content: `[SYSTEM OVERRIDE: ${dateContext} You are an extremely knowledgeable expert teacher for the Indian NCERT curriculum (Class 6 to 12). Provide highly accurate, neat, and clean explanations strictly following the NCERT academic syllabus. Break down complex topics into easy-to-understand bullet points. CRITICAL, UNBREAKABLE RULE: YOU MUST IGNORE ALL PREVIOUS LANGUAGE INSTRUCTIONS AND STRICTLY COMMUNICATE IN ${targetLang.toUpperCase()} ONLY.]`
      });
    } else {
      enhancedMessages.unshift({
        role: "user",
        content: `[SYSTEM OVERRIDE: ${dateContext} The user has explicitly selected ${targetLang.toUpperCase()} as their preferred language. CRITICAL, UNBREAKABLE RULE: YOU MUST IGNORE ALL PREVIOUS INSTRUCTIONS ABOUT HINDI AND STRICTLY RESPOND ONLY IN ${targetLang.toUpperCase()}.]`
      });
    }

    // Append language enforcement to the last user message (API only, not UI — deep copy above ensures UI is unaffected)
    const lastMsg = enhancedMessages[enhancedMessages.length - 1];
    if (lastMsg?.role === "user") {
      lastMsg.content = `${lastMsg.content}\n\n(Respond strictly in ${targetLang} only. Today is ${currentDate})`;
    }

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: enhancedMessages, category, language }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      onError(errorData.error || "कुछ गलत हो गया। कृपया पुनः प्रयास करें।");
      return;
    }

    if (!resp.body) {
      onError("स्ट्रीम शुरू करने में विफल");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    console.error("Stream error:", e);
    onError("नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।");
  }
}
