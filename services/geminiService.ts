import { GoogleGenAI, Type } from "@google/genai";
import { GameEntity } from "../types";
import { FALLBACK_ENTITIES } from "../constants";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fisher-Yates Shuffle Algorithm for unbiased randomization
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const fetchNewGameEntities = async (): Promise<GameEntity[]> => {
  // Gracefully handle missing API Key
  if (!process.env.API_KEY) {
    console.warn("API_KEY not found, using fallback data.");
    return shuffleArray(FALLBACK_ENTITIES).map((item, index) => ({
      ...item,
      id: `fallback-${Date.now()}-${index}`
    }));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a list of 20 random items for the Indian childhood game "Chidiya Udd" (Bird Flies). 
      
      CRITICAL INSTRUCTION:
      - The list must be COMPLETELY RANDOM in order. 
      - Do NOT group flying items together or non-flying items together.
      - Mix: ~50% things that fly, ~50% things that strictly do NOT fly.
      
      Requirements for "translation":
      - Provide the translation in **Simple, Everyday Spoken Hindi (colloquial)**. 
      - **DO NOT** use complex or formal "Shuddh Hindi" words.
      - Use common English loanwords written in Hindi if they are more commonly spoken in daily life (e.g., use "टेबल" for Table, "प्लेन" for Airplane, "फोन" for Phone).
      - Keep it short, colloquial, and easy to read quickly.
      
      Make them fun and varied. Avoid duplicates if possible.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the entity in English" },
              translation: { type: Type.STRING, description: "The simple/colloquial Hindi name in Devanagari" },
              canFly: { type: Type.BOOLEAN, description: "True if it flies, false otherwise" },
              emoji: { type: Type.STRING, description: "A single representative emoji" }
            },
            required: ["name", "canFly", "emoji", "translation"]
          }
        }
      }
    });

    if (response.text) {
      // QA FIX: Clean markdown formatting (```json ... ```) if present
      const cleanText = response.text.replace(/```json|```/g, '').trim();
      
      let data = JSON.parse(cleanText);
      // Client-side shuffle to ensure perfect randomness regardless of AI output order
      data = shuffleArray(data);
      
      return data.map((item: any, index: number) => ({
        ...item,
        id: `gen-${Date.now()}-${index}`
      }));
    }
    
    throw new Error("Empty response text");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return shuffled fallback data if API fails
    return shuffleArray(FALLBACK_ENTITIES).map((item, index) => ({
      ...item,
      id: `fallback-${Date.now()}-${index}`
    }));
  }
};