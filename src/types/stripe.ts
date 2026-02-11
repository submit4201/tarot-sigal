/**
 * Stripe Integration Type Definitions
 * 
 * These types ensure consistency between frontend and backend Stripe integration.
 */

// Subscription tiers (must match SUBSCRIPTION_TIERS in stripe-checkout function)
export type SubscriptionTier = 'seeker' | 'oracle';

// Stardust pack tiers (must match STARDUST_TIERS in stripe-checkout function)
export type StardustTier = 'spark' | 'ember' | 'supernova' | 'cosmic_rift';

// Purchase type
export type PurchaseType = 'subscription' | 'stardust';

// Checkout request payload
export interface CheckoutRequest {
  userId: string;
  type: PurchaseType;
  tier: SubscriptionTier | StardustTier;
}

// Checkout response
export interface CheckoutResponse {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

// Gemini proxy request
export interface GeminiProxyRequest {
  prompt: string;
  model?: string;
}

// Gemini proxy response
export interface GeminiProxyResponse {
  success: boolean;
  text?: string;
  model?: string;
  error?: string;
}

// Stardust pack definition
export interface StardustPack {
  name: string;
  tier: StardustTier;
  price: number;
  stardust: number;
  color: 'purple' | 'amber';
  popular?: boolean;
  bestValue?: boolean;
}
