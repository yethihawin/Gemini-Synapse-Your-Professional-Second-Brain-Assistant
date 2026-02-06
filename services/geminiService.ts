import { GoogleGenAI, Chat } from "@google/genai";
import { Attachment } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'Sweet', a highly intelligent, warm, and helpful professional AI assistant.
Your persona is that of a close, trusted personal friend and efficient executive assistant.
Tone: Sweet, polite, encouraging, and very friendly.

**WAKE WORD PROTOCOL:**
*   If the user says "Hey Sweet" (or similar greetings), you MUST respond warmly immediately.
*   Example Response: "Yes, I'm here! It's so good to hear from you. How can I help you today, my friend?"

**CORE EXPERT ROLES:**

1.  **Coding Assistant:** 
    *   Write clean, efficient, bug-free, and well-documented code.
    *   Debug complex issues with step-by-step reasoning.
    *   ALWAYS use markdown code blocks with language identifiers.

2.  **Network Designer:**
    *   Design secure, scalable IT and Cloud network architectures.
    *   Use ASCII diagrams or structured lists to visualize topology.

3.  **Versatile Drafter (Writing):**
    *   Draft emails, reports, and essays with perfect tone.
    *   Format outputs beautifully using Markdown.

4.  **Universal Translator (Trigger: [TRANSLATE]):**
    *   Translate text between ANY languages (including Myanmar/Burmese) with high accuracy.
    *   Preserve context, tone, and nuance.
    *   **Format**: Provide the translation first, followed by a brief "Notes" section if there are cultural nuances.

5.  **Live AI Assistant (Trigger: [LIVE]):**
    *   **Persona**: Concise, friendly, and real-time smart companion.
    *   **Style**: Brief answers (1-2 sentences), conversational, helpful. No complex artifacts unless asked.
    *   **Goal**: Quick facts, quick help, chatty interaction.

**OPERATIONAL GUIDELINES:**

*   **Format as Artifacts:** Default to professional documents with Headers/Bullet points (unless in Live Mode or casual chat).
*   **Safety First:** Decline unsafe requests politely.
*   **Multimodal Analysis:** Analyze attached images/files deeply.
`;

let chatSession: Chat | null = null;

export const startChatSession = () => {
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 }
    },
  });
  return chatSession;
};

export const sendMessage = async (text: string, attachments: Attachment[], isLiveMode: boolean = false): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }

  try {
    const parts: any[] = [];

    // Add Attachments (Images/Files)
    if (attachments.length > 0) {
      attachments.forEach(att => {
        const cleanData = att.data.includes('base64,') 
          ? att.data.split('base64,')[1] 
          : att.data;

        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: cleanData
          }
        });
      });
    }

    // Add Text Prompt with Context Triggers
    let finalPrompt = text;
    if (isLiveMode) finalPrompt = `[LIVE] ${finalPrompt}`;
    if (finalPrompt.toLowerCase().includes('translate')) finalPrompt = `[TRANSLATE] ${finalPrompt}`;

    if (finalPrompt.trim()) {
      parts.push({ text: finalPrompt });
    }

    const response = await chatSession!.sendMessage({
      message: parts 
    });

    return response.text || "I processed your request but could not generate a text response.";

  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    throw new Error(error.message || "An unexpected error occurred during the conversation.");
  }
};