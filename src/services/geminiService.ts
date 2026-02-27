import { apiFetch } from './apiService';
import { generateWithPuter } from './puterService';

/**
 * Ordered list of free models to try if the primary model fails.
 * Since `openrouter/free` (auto-router) is now the primary model
 * everywhere, these specific models serve as fallbacks if the
 * auto-router itself has issues.
 */
const FREE_MODEL_FALLBACKS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'qwen/qwen3-32b:free',
];

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
 * Wraps the backend API call with model-fallback + exponential backoff retry.
 *
 * Strategy:
 *  1. Try the requested model with up to `retries` attempts (backoff).
 *  2. If ALL retries for that model fail, try each model in
 *     FREE_MODEL_FALLBACKS in order (one attempt each).
 *  3. If everything fails, throw.
 */
export async function generateContentWithRetry(
  params: any,
  retries = 2,
  initialDelay = 2000
): Promise<{ text: string }> {
  const prompt = extractPrompt(params);
  const primaryModel = params.model || 'openrouter/free';

  // --- Puter.js Integration for Tarot/Birthcharts ---
  // If the model is 'puter-chat', we route to Puter.js directly
  if (primaryModel === 'puter-chat' || params.usePuter) {
    try {
      // Puter expects message format
      const messages = [{ role: 'user', content: prompt }];
      
      const responseText = await generateWithPuter(messages, params.onStream);
      return { text: responseText };
    } catch (e: any) {
      console.warn("Puter generation failed, falling back to standard retry flow:", e);
      // Fall through to standard logic if Puter fails
    }
  }

  /**
   * Inner helper — attempt a single model with exponential backoff.
   * Returns the result or throws after `maxAttempts` failures.
   */
  async function tryModel(model: string, maxAttempts: number, delay: number): Promise<{ text: string }> {
    let currentDelay = delay;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await apiFetch('/gemini/generate', {
          method: 'POST',
          body: JSON.stringify({ prompt, model })
        });

        if (response && response.success && response.text) {
          return { text: response.text };
        }

        throw new Error(response.error || 'Empty response from backend proxy.');
      } catch (error: any) {
        const isRetryable =
          error.message?.includes('fetch') ||
          error.message?.includes('429') ||
          error.message?.includes('timeout') ||
          error.message?.includes('500') ||
          error.message?.includes('503') ||
          error.status === 429 ||
          error.status === 500 ||
          error.status === 503;

        if (isRetryable && attempt < maxAttempts - 1) {
          console.warn(
            `[${model}] Attempt ${attempt + 1}/${maxAttempts} failed. ` +
            `Retrying in ${currentDelay}ms…`
          );
          await new Promise(r => setTimeout(r, currentDelay));
          currentDelay *= 2;
        } else {
          throw error;
        }
      }
    }
    throw new Error(`All ${maxAttempts} attempts exhausted for ${model}`);
  }

  // --- 1. Try the primary model ---
  try {
    return await tryModel(primaryModel, retries + 1, initialDelay);
  } catch (primaryError: any) {
    console.warn(`Primary model [${primaryModel}] failed:`, primaryError.message);
  }

  // --- 2. Try each fallback model (single attempt each) ---
  for (const fallback of FREE_MODEL_FALLBACKS) {
    if (fallback === primaryModel) continue; // skip if already tried
    try {
      console.warn(`Falling back to model: ${fallback}`);
      return await tryModel(fallback, 1, 0);
    } catch (fbError: any) {
      console.warn(`Fallback [${fallback}] also failed:`, fbError.message);
    }
  }

  throw new Error(
    'All models exhausted. The AI service is temporarily unavailable — please try again later.'
  );
}

export const genAI = null; // Deprecated placeholder for legacy code

