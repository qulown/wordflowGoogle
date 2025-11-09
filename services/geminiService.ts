
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from '../types';

export const getWritingAnalysis = async (text: string): Promise<GeminiAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Analyze the following text purely for statistical and encouraging insights. Do not judge quality, grammar, or spelling. Provide a short, positive, one-sentence summary. Identify the overall sentiment (e.g., Positive, Neutral, Negative, Mixed). Provide interesting stats like word count, unique word count, and average word length. Identify up to 5 interesting or powerful adjectives or verbs used. Your entire response MUST be in the specified JSON format.

Text to analyze:
---
${text}
---
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A short, positive, one-sentence summary of the text's essence." },
          sentiment: { type: Type.STRING, description: "The overall sentiment of the text." },
          stats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.STRING },
              },
              required: ["name", "value"]
            },
            description: "An array of statistical data about the text."
          },
          interestingWords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of up to 5 interesting words from the text."
          },
        },
        required: ["summary", "sentiment", "stats", "interestingWords"],
      },
    },
  });

  try {
    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as GeminiAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid JSON response from AI.");
  }
};
