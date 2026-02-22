import { apiFetch } from './apiService';

/**
 * Extracts the raw prompt text string from the Gemini SDK parameter structure.
 */
function extractPrompt(params: any): string {
  if (typeof params === 'string') return params;

  if (params.contents && Array.isArray(params.contents)) {
    for (const content of params.contents) {
      if (content.parts && Array.isArray(content.parts)) {
        for (const part of content.parts) {
          if (part.text) return part.text;
        }
      }
    }
  }

  // Fallbacks
  if (params.prompt) return params.prompt;
  return JSON.stringify(params);
}

/**
 * Wraps the backend API call with exponential backoff retry logic.
 * Emulates the GenerateContentResponse object so frontend components don't break.
 */
export async function generateContentWithRetry(
  params: any,
  retries = 3,
  initialDelay = 2000
): Promise<{ text: string }> {
  let currentDelay = initialDelay;

  const prompt = extractPrompt(params);
  // Default to our openrouter model, but allow passing it via the original params if needed
  const model = params.model || 'z-ai/glm-4.5-air:free';

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await apiFetch('/gemini/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, model })
      });

      if (response && response.success && response.text) {
        // Return an object that mimics the Gemini SDK response
        return {
          text: response.text
        };
      }

      throw new Error(response.error || "Failed to generate content from backend proxy.");

    } catch (error: any) {
      // Treat network errors or 429s as retryable
      const isRetryable =
        error.message?.includes('fetch') ||
        error.message?.includes('429') ||
        error.message?.includes('timeout') ||
        error.status === 429 ||
        error.status === 503;

      if (isRetryable && attempt < retries) {
        console.warn(`API Proxy error. Retrying in ${currentDelay}ms... (Attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= 2; // Exponential backoff
      } else {
        console.error("Non-retryable API error or retries exhausted:", error);
        throw error;
      }
    }
  }

  throw new Error("Maximum retries exceeded.");
}

export const genAI = null; // Deprecated placeholder for legacy code

