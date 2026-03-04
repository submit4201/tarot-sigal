/**
 * lmstudioService.ts — LM Studio Local Oracle Client
 * ====================================================
 * Calls the backend `/oracle/generate` proxy, which forwards to
 * LM Studio's local OpenAI-compatible API (localhost:1234).
 *
 * @note Throws if LM Studio is offline or unavailable. Caller is
 *       responsible for falling back to Puter / OpenRouter.
 */

import { apiFetch } from './apiService';

/**
 * Check whether LM Studio is reachable from the backend.
 * Useful for quick "is it online?" checks without generating content.
 */
export async function checkLMStudioStatus(): Promise<{ available: boolean; model?: string }> {
    try {
        const data = await apiFetch('/oracle/status', { method: 'GET' });
        return { available: !!data?.available, model: data?.model };
    } catch {
        return { available: false };
    }
}

/**
 * Generate text via LM Studio (routed through the backend proxy).
 *
 * @param prompt    The user prompt / question.
 * @param system    Optional system instruction to prepend.
 * @returns         The generated text string.
 * @throws          If LM Studio is offline or the request fails.
 */
export async function generateWithLMStudio(
    prompt: string,
    system?: string,
): Promise<string> {
    const payload: Record<string, unknown> = { prompt };
    if (system) payload.system = system;

    const data = await apiFetch('/oracle/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    // `available: false` means LM Studio was reachable but unavailable
    if (data?.available === false || !data?.success) {
        throw new Error('[Oracle] LM Studio unavailable or returned no content.');
    }

    if (!data?.text) {
        throw new Error('[Oracle] LM Studio returned an empty response.');
    }

    console.info(`[Oracle] LM Studio responded (model: ${data.model ?? 'local'})`);
    return data.text as string;
}
