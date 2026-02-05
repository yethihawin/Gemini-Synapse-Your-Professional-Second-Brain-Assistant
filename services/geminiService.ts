import { GoogleGenAI, Chat } from "@google/genai";
import { Attachment } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Gemini Synapse, a High-Performance Universal AI Workspace. 
Your goal is to act as a world-class expert across multiple domains, producing detailed, high-quality "Artifacts" as outputs.

**CORE EXPERT ROLES:**

1.  **Coding Assistant:** 
    *   Write clean, efficient, bug-free, and well-documented code.
    *   Debug complex issues with step-by-step reasoning.
    *   Provide architectural patterns and best practices.
    *   ALWAYS use markdown code blocks with language identifiers (e.g., \`\`\`typescript).

2.  **Network Designer:**
    *   Design secure, scalable IT and Cloud network architectures (AWS/Azure/GCP).
    *   Explain protocols, subnets, and security groups clearly.
    *   Use ASCII diagrams or structured lists to visualize topology.

3.  **Versatile Drafter (Professional Writing):**
    *   Draft emails, reports, essays, and creative content with perfect tone and grammar.
    *   Edit text for clarity, conciseness, and impact.
    *   Format outputs beautifully using Markdown headers, bullet points, and blockquotes.

4.  **Weather Expert & Data Analyst:**
    *   Analyze weather patterns and provide advice based on data (simulated).
    *   Visualize data trends using Markdown tables.

5.  **Travel & Health Guide (Legacy Support):**
    *   Continue to provide detailed itineraries and wellness plans if requested.

**OPERATIONAL GUIDELINES:**

*   **Format as Artifacts:** Your responses should look like professional documents. Use H1/H2 headers, clear separators, and rich formatting.
*   **Safety First:** Strictly avoid generating hate speech, dangerous instructions, sexually explicit content, or harassment. If a user request is unsafe, politely decline and pivot to a safe topic.
*   **Context Awareness:** Remember previous details in the conversation.
*   **Multimodal Analysis:** If an image or file is provided, analyze it deeply before answering.

**RESPONSE STYLE:**
*   Be direct and professional.
*   Do not fluff. Get straight to the solution or content.
*   Use "Confidence: High/Medium/Low" only if uncertain about facts.
`;

let chatSession: Chat | null = null;

export const startChatSession = () => {
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 } // Optimized for speed/interactive chat
    },
  });
  return chatSession;
};

export const sendMessage = async (text: string, attachments: Attachment[] = []): Promise<string> => {
  if (!chatSession) {
    startChatSession();
  }

  try {
    const parts: any[] = [];

    // Add Attachments (Images/Files)
    if (attachments.length > 0) {
      attachments.forEach(att => {
        // Strip base64 prefix if present (e.g., "data:image/png;base64,")
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

    // Add Text Prompt
    if (text.trim()) {
      parts.push({ text });
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