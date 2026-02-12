
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Wraps the Gemini generateContent call with exponential backoff retry logic.
 * Handles 429 (Resource Exhausted) and 503 (Service Unavailable) errors.
 */
export async function generateContentWithRetry(
  params: GenerateContentParameters,
  retries = 3,
  initialDelay = 2000
): Promise<GenerateContentResponse> {
  let currentDelay = initialDelay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Direct call to the model
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      const isRetryable =
        error.status === 429 ||
        error.code === 429 ||
        error.status === 503 ||
        error.message?.includes('429') ||
        error.message?.includes('quota');

      if (isRetryable && attempt < retries) {
        console.warn(`API Rate Limit hit. Retrying in ${currentDelay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= 2; // Exponential backoff: 2s -> 4s -> 8s
      } else {
        // If not retryable or retries exhausted, throw the error
        console.error("Non-retryable API error or retries exhausted:", error);
        throw error;
      }
    }
  }
  throw new Error("Maximum retries exceeded.");
}

export const genAI = ai;
