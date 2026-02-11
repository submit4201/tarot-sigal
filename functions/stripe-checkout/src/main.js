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

// Stripe price IDs (these should be created in Stripe Dashboard)
const PRICE_IDS = {
  seeker: 'price_seeker_monthly',  // Replace with actual Stripe Price ID
  oracle: 'price_oracle_monthly',  // Replace with actual Stripe Price ID
  spark: 'price_stardust_spark',
  ember: 'price_stardust_ember',
  supernova: 'price_stardust_supernova',
  cosmic_rift: 'price_stardust_cosmic_rift',
};

export default async ({ req, res, log, error }) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return res.json({}, 200, headers);
  }

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, headers);
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
      return res.json({ error: `Invalid tier: ${tier}` }, 400, headers);
    }

    log(`Creating Stripe checkout for user ${userId}, type: ${type}, tier: ${tier}`);

    // Create checkout session
    const mode = type === 'subscription' ? 'subscription' : 'payment';
    
    const session = await stripe.checkout.sessions.create({
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
    });

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
        amount: session.amount_total / 100, // Convert from cents
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
