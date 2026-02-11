import { Client, Databases, Query } from 'node-appwrite';

/**
 * Stripe Webhook Function
 * 
 * Handles Stripe webhook events for payment confirmations.
 * Updates user subscription status and awards Stardust.
 * 
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Your Stripe webhook signing secret
 * - APPWRITE_FUNCTION_PROJECT_ID: Auto-provided by Appwrite
 * - APPWRITE_FUNCTION_API_KEY: Auto-provided by Appwrite
 * - DATABASE_ID: Appwrite database ID
 */

// Stardust amounts for each pack
const STARDUST_AMOUNTS = {
  spark: 250,
  ember: 1000,
  supernova: 2500,
  cosmic_rift: 7500,
};

export default async ({ req, res, log, error }) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, headers);
  }

  try {
    // Get Stripe signature
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.json({ error: 'Missing Stripe signature' }, 400, headers);
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!webhookSecret || !stripeKey) {
      error('Stripe secrets not configured');
      return res.json({ error: 'Server configuration error' }, 500, headers);
    }

    // Import Stripe
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      error(`Webhook signature verification failed: ${err.message}`);
      return res.json({ error: 'Invalid signature' }, 400, headers);
    }

    log(`Received webhook event: ${event.type}`);

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new Databases(client);
    const databaseId = process.env.DATABASE_ID || 'gridpunk-arcana';

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, type, tier } = session.metadata;

        log(`Processing completed checkout for user ${userId}`);

        // Update purchase record
        const purchases = await databases.listDocuments(
          databaseId,
          'purchases',
          [Query.equal('stripeSessionId', session.id)]
        );

        if (purchases.documents.length > 0) {
          await databases.updateDocument(
            databaseId,
            'purchases',
            purchases.documents[0].$id,
            { status: 'completed' }
          );
        }

        // Get user profile
        const profiles = await databases.listDocuments(
          databaseId,
          'profiles',
          [Query.equal('userId', userId)]
        );

        if (profiles.documents.length === 0) {
          error(`User profile not found: ${userId}`);
          break;
        }

        const profile = profiles.documents[0];

        if (type === 'subscription') {
          // Update subscription
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          await databases.updateDocument(
            databaseId,
            'profiles',
            profile.$id,
            {
              isPremium: true,
              subscriptionTier: tier,
              subscriptionExpiry: expiryDate.toISOString(),
            }
          );

          log(`Updated subscription for user ${userId} to ${tier}`);

        } else if (type === 'stardust') {
          // Award Stardust
          const baseAmount = STARDUST_AMOUNTS[tier] || 0;
          const multiplier = profile.isPremium ? 2 : 1;
          const totalStardust = baseAmount * multiplier;

          await databases.updateDocument(
            databaseId,
            'profiles',
            profile.$id,
            {
              stardust: (profile.stardust || 0) + totalStardust,
            }
          );

          log(`Awarded ${totalStardust} Stardust to user ${userId}`);
        }

        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        // Get user profile
        const profiles = await databases.listDocuments(
          databaseId,
          'profiles',
          [Query.equal('userId', userId)]
        );

        if (profiles.documents.length === 0) break;

        const profile = profiles.documents[0];
        const isActive = subscription.status === 'active';

        await databases.updateDocument(
          databaseId,
          'profiles',
          profile.$id,
          {
            isPremium: isActive,
            subscriptionTier: isActive ? subscription.metadata?.tier || 'free' : 'free',
          }
        );

        log(`Updated subscription status for user ${userId}: ${isActive ? 'active' : 'inactive'}`);
        break;
      }

      default:
        log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true }, 200, headers);

  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json(
      { error: 'Internal server error', message: err.message },
      500,
      headers
    );
  }
};
