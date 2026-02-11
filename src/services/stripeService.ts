import { account } from './appwriteService';

const FUNCTION_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

/**
 * Call an Appwrite Function with authentication
 */
async function callFunction(functionId: string, data: any) {
  try {
    // Get current session to include auth token
    const session = await account.get();
    
    const response = await fetch(`${FUNCTION_ENDPOINT}/functions/${functionId}/executions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID,
      },
      body: JSON.stringify({
        async: false,
        body: JSON.stringify(data),
      }),
    });

    if (!response.ok) {
      throw new Error(`Function call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Parse the response body
    if (result.responseBody) {
      return JSON.parse(result.responseBody);
    }
    
    return result;
  } catch (error) {
    console.error('Function call error:', error);
    throw error;
  }
}

/**
 * Create a Stripe Checkout session and redirect user
 */
export async function createCheckoutSession(type: 'subscription' | 'stardust', tier: string) {
  try {
    const user = await account.get();
    
    // Call the stripe-checkout function
    // Note: Replace 'stripe-checkout-function-id' with actual function ID from Appwrite Console
    const functionId = import.meta.env.VITE_STRIPE_CHECKOUT_FUNCTION_ID || 'stripe-checkout';
    
    const result = await callFunction(functionId, {
      userId: user.$id,
      type,
      tier,
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
 * Call Gemini API through proxy function
 */
export async function callGeminiProxy(prompt: string, model: string = 'gemini-pro') {
  try {
    // Note: Replace 'gemini-proxy-function-id' with actual function ID from Appwrite Console
    const functionId = import.meta.env.VITE_GEMINI_PROXY_FUNCTION_ID || 'gemini-proxy';
    
    const result = await callFunction(functionId, {
      prompt,
      model,
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
