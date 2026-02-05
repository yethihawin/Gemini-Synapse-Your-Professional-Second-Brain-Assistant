import { GoogleGenAI, Type } from "@google/genai";
import { SynapseData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the Schema for Structured Output
const synapseSchema = {
  type: Type.OBJECT,
  properties: {
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['On Track', 'At Risk', 'Completed', 'Pending'] },
          description: { type: Type.STRING },
          deadline: { type: Type.STRING },
        },
        required: ['name', 'status', 'description'],
      },
    },
    people: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          keyContribution: { type: Type.STRING },
        },
        required: ['name', 'role'],
      },
    },
    decisions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          dateMade: { type: Type.STRING },
        },
        required: ['summary', 'impact'],
      },
    },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          assignee: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          dueDate: { type: Type.STRING },
        },
        required: ['description', 'assignee', 'priority'],
      },
    },
  },
  required: ['projects', 'people', 'decisions', 'tasks'],
};

export const organizeContent = async (text: string): Promise<SynapseData> => {
  if (!text.trim()) {
    throw new Error("Please provide some text notes to organize.");
  }

  try {
    const prompt = `Analyze the following unstructured notes and organize them into a structured second-brain format. 
    Extract relevant projects, people involved, key decisions made, and actionable tasks.
    
    NOTES:
    ${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: synapseSchema,
        thinkingConfig: { thinkingBudget: 0 } // Flash model optimization
      },
    });

    if (!response.text) {
      // Handle edge cases where the model refuses to generate text (e.g., safety blocks)
      const candidate = response.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== "STOP") {
        throw new Error(`The AI could not process the content due to: ${candidate.finishReason}`);
      }
      throw new Error("The AI returned an empty response. Please try again with different content.");
    }

    try {
      const data: SynapseData = JSON.parse(response.text);
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Response:", response.text);
      throw new Error("Failed to process the AI response structure. Please try again.");
    }

  } catch (error: any) {
    console.error("Gemini Service Error:", error);

    // If we've already thrown a specific error above, rethrow it
    if (error.message && (
        error.message.startsWith("The AI could") || 
        error.message.startsWith("The AI returned") ||
        error.message.startsWith("Failed to process") ||
        error.message.startsWith("Please provide")
    )) {
      throw error;
    }

    const errorMsg = error.message?.toLowerCase() || "";
    const errorString = error.toString().toLowerCase();

    // Map common Gemini/Network errors to user-friendly messages
    if (errorMsg.includes("api key") || errorMsg.includes("403") || errorMsg.includes("401") || errorMsg.includes("unauthenticated")) {
      throw new Error("Authentication failed. Please verify your API key.");
    }

    if (errorMsg.includes("quota") || errorMsg.includes("429") || errorString.includes("resource exhausted")) {
      throw new Error("API usage limit exceeded. Please wait a moment and try again.");
    }

    if (errorMsg.includes("503") || errorMsg.includes("overloaded") || errorMsg.includes("unavailable")) {
      throw new Error("The AI service is temporarily overloaded. Please try again in a few seconds.");
    }

    if (errorMsg.includes("fetch failed") || errorMsg.includes("network")) {
      throw new Error("Network error. Please check your internet connection.");
    }

    // Default generic error
    throw new Error(error.message || "An unexpected error occurred while processing your request.");
  }
};