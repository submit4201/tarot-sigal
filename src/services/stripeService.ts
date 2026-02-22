import { apiFetch } from './apiService';
import type { PurchaseType, SubscriptionTier, StardustTier } from '../types/stripe';

/**
 * Create a Stripe Checkout session and redirect user
 */
export async function createCheckoutSession(
  type: PurchaseType,
  tier: SubscriptionTier | StardustTier
): Promise<void> {
  try {
    const result = await apiFetch('/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ type, tier })
    });

    if (result.success && result.url) {
      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } else {
      throw new Error(result.error || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Call Gemini API through FastAPI proxy
 */
export async function callGeminiProxy(prompt: string, model: string = 'arcee-ai/trinity-large-preview:free') {
  try {
    const result = await apiFetch('/gemini/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, model })
    });

    if (result.success && result.text) {
      return result.text;
    } else {
      throw new Error(result.error || 'Failed to generate content');
    }
  } catch (error) {
    console.error('Gemini proxy error:', error);
    throw error;
  }
}


export async function verifySubscription() {
  try {
    const result = await apiFetch('/stripe/verify-subscription', {
      method: 'GET'
    });
    return result;
  } catch (error) {
    console.error('Verify subscription error:', error);
    throw error;
  }
}
