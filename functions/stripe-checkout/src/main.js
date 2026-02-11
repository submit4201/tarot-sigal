import { Client, Databases, ID } from 'node-appwrite';

/**
 * Stripe Checkout Function
 * 
 * Creates a Stripe Checkout session for subscriptions or one-time Stardust purchases.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - APPWRITE_FUNCTION_PROJECT_ID: Auto-provided by Appwrite
 * - APPWRITE_FUNCTION_API_KEY: Auto-provided by Appwrite
 * - DATABASE_ID: Appwrite database ID
 * - SUCCESS_URL: URL to redirect after successful payment
 * - CANCEL_URL: URL to redirect if payment is cancelled
 */

// Stripe price IDs (these should be created in Stripe Dashboard and configured via environment variables)
const PRICE_IDS = {
  seeker: process.env.STRIPE_PRICE_SEEKER || '',
  oracle: process.env.STRIPE_PRICE_ORACLE || '',
  spark: process.env.STRIPE_PRICE_SPARK || '',
  ember: process.env.STRIPE_PRICE_EMBER || '',
  supernova: process.env.STRIPE_PRICE_SUPERNOVA || '',
  cosmic_rift: process.env.STRIPE_PRICE_COSMIC_RIFT || '',
};

// Valid tiers by type
const SUBSCRIPTION_TIERS = ['seeker', 'oracle'];
const STARDUST_TIERS = ['spark', 'ember', 'supernova', 'cosmic_rift'];

export default async ({ req, res, log, error }) => {
  // Get allowed origins from environment or use function domain
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://sigil.app.cultofthefork.tech'];
  
  const origin = req.headers.origin || req.headers.referer;
  const isAllowedOrigin = allowedOrigins.some(allowed => origin && origin.includes(allowed));
  
  const headers = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Appwrite-Project',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return res.json({}, 200, headers);
  }

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, headers);
  }

  // Verify origin
  if (!isAllowedOrigin) {
    error(`Unauthorized origin: ${origin}`);
    return res.json({ error: 'Unauthorized origin' }, 403, headers);
  }

  try {
    // Parse request
    const body = JSON.parse(req.body || '{}');
    const { userId, type, tier } = body;

    if (!userId || !type || !tier) {
      return res.json(
        { error: 'Missing required fields: userId, type, tier' },
        400,
        headers
      );
    }

    // Validate type
    if (!['subscription', 'stardust'].includes(type)) {
      return res.json(
        { error: 'Invalid type. Must be "subscription" or "stardust"' },
        400,
        headers
      );
    }

    // Validate tier against type
    const validTiers = type === 'subscription' ? SUBSCRIPTION_TIERS : STARDUST_TIERS;
    if (!validTiers.includes(tier)) {
      return res.json(
        { error: `Invalid tier "${tier}" for type "${type}". Valid tiers: ${validTiers.join(', ')}` },
        400,
        headers
      );
    }

    // Get Stripe key
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      error('STRIPE_SECRET_KEY not configured');
      return res.json({ error: 'Server configuration error' }, 500, headers);
    }

    // Import Stripe dynamically
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Get price ID
    const priceId = PRICE_IDS[tier];
    if (!priceId) {
      error(`Invalid or unconfigured tier: ${tier}`);
      return res.json({ error: `Invalid tier: ${tier}. Please ensure STRIPE_PRICE_${tier.toUpperCase()} environment variable is set.` }, 400, headers);
    }

    log(`Creating Stripe checkout for user ${userId}, type: ${type}, tier: ${tier}`);

    // Create checkout session
    const mode = type === 'subscription' ? 'subscription' : 'payment';
    
    const sessionConfig = {
      mode,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: process.env.SUCCESS_URL || 'https://sigil.app.cultofthefork.tech?payment=success',
      cancel_url: process.env.CANCEL_URL || 'https://sigil.app.cultofthefork.tech?payment=cancelled',
      client_reference_id: userId,
      metadata: {
        userId,
        type,
        tier,
      },
    };

    // For subscriptions, also set metadata on the subscription object
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          tier,
        },
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Record pending purchase in database
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);
    const databaseId = process.env.DATABASE_ID || 'gridpunk-arcana';

    await databases.createDocument(
      databaseId,
      'purchases',
      ID.unique(),
      {
        userId,
        type,
        tier,
        stripeSessionId: session.id,
        amount: session.amount_total != null ? session.amount_total / 100 : null, // Convert from cents when available
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
    );

    log(`Checkout session created: ${session.id}`);

    return res.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      200,
      headers
    );

  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json(
      { error: 'Internal server error', message: err.message },
      500,
      headers
    );
  }
};
