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

        // Ensure required metadata is present before processing
        if (
          !session.metadata ||
          !session.metadata.userId ||
          !session.metadata.type ||
          !session.metadata.tier
        ) {
          error(
            `checkout.session.completed missing required metadata: ` +
            JSON.stringify(session.metadata || null)
          );
          return res.json(
            { error: 'Missing required metadata on checkout session' },
            400,
            headers
          );
        }
        
        const { userId, type, tier } = session.metadata;

        log(`Processing completed checkout for user ${userId}`);

        // Update purchase record and check for idempotency
        const purchases = await databases.listDocuments(
          databaseId,
          'purchases',
          [Query.equal('stripeSessionId', session.id)]
        );

        if (purchases.documents.length > 0) {
          const purchase = purchases.documents[0];
          
          // Check if already processed (idempotency)
          if (purchase.status === 'completed') {
            log(`Checkout session ${session.id} already processed, skipping`);
            return res.json({ received: true, skipped: 'already_processed' }, 200, headers);
          }
          
          // Mark as completed
          await databases.updateDocument(
            databaseId,
            'purchases',
            purchase.$id,
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
          // Get subscription details from Stripe to use actual billing period
          let subscriptionExpiry;
          
          if (session.subscription) {
            try {
              const subscription = await stripe.subscriptions.retrieve(session.subscription);
              subscriptionExpiry = new Date(subscription.current_period_end * 1000).toISOString();
            } catch (err) {
              error(`Failed to fetch subscription details: ${err.message}`);
              // Fallback to 30 days
              const fallbackDate = new Date();
              fallbackDate.setDate(fallbackDate.getDate() + 30);
              subscriptionExpiry = fallbackDate.toISOString();
            }
          } else {
            // Fallback to 30 days if no subscription ID
            const fallbackDate = new Date();
            fallbackDate.setDate(fallbackDate.getDate() + 30);
            subscriptionExpiry = fallbackDate.toISOString();
          }

          await databases.updateDocument(
            databaseId,
            'profiles',
            profile.$id,
            {
              isPremium: true,
              subscriptionTier: tier,
              subscriptionExpiry,
            }
          );

          log(`Updated subscription for user ${userId} to ${tier}, expires ${subscriptionExpiry}`);

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

        if (!userId) {
          log(`Subscription event missing userId metadata, skipping`);
          break;
        }

        // Get user profile
        const profiles = await databases.listDocuments(
          databaseId,
          'profiles',
          [Query.equal('userId', userId)]
        );

        if (profiles.documents.length === 0) {
          log(`User profile not found for userId: ${userId}`);
          break;
        }

        const profile = profiles.documents[0];
        const isActive = subscription.status === 'active';
        
        // Use Stripe's current_period_end for subscription expiry
        const subscriptionExpiry = subscription.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date().toISOString();

        await databases.updateDocument(
          databaseId,
          'profiles',
          profile.$id,
          {
            isPremium: isActive,
            subscriptionTier: isActive ? (subscription.metadata?.tier || 'seeker') : 'free',
            subscriptionExpiry,
          }
        );

        log(`Updated subscription status for user ${userId}: ${isActive ? 'active' : 'inactive'}, expires: ${subscriptionExpiry}`);
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
