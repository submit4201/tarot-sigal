# Appwrite Functions

This directory contains serverless functions for Gridpunk Arcana.

## Functions

### 1. gemini-proxy
**Purpose:** Server-side proxy for Gemini API calls to protect the API key from client-side exposure.

**Environment Variables:**
- `GEMINI_API_KEY` - Your Google Gemini API key

**Endpoint:** POST `/v1/functions/[FUNCTION_ID]/executions`

**Request Body:**
```json
{
  "prompt": "Your prompt text here",
  "model": "gemini-pro" // optional, defaults to gemini-pro
}
```

**Response:**
```json
{
  "success": true,
  "text": "Generated text response",
  "model": "gemini-pro"
}
```

### 2. stripe-checkout
**Purpose:** Creates Stripe Checkout sessions for subscriptions and one-time Stardust purchases.

**Environment Variables:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PRICE_SEEKER` - Stripe Price ID for Seeker subscription ($8.99/mo)
- `STRIPE_PRICE_ORACLE` - Stripe Price ID for Oracle subscription ($14.99/mo)
- `STRIPE_PRICE_SPARK` - Stripe Price ID for Spark pack ($0.99)
- `STRIPE_PRICE_EMBER` - Stripe Price ID for Ember pack ($2.99)
- `STRIPE_PRICE_SUPERNOVA` - Stripe Price ID for Supernova pack ($4.99)
- `STRIPE_PRICE_COSMIC_RIFT` - Stripe Price ID for Cosmic Rift pack ($9.99)
- `DATABASE_ID` - Appwrite database ID (default: gridpunk-arcana)
- `SUCCESS_URL` - Redirect URL after successful payment
- `CANCEL_URL` - Redirect URL if payment is cancelled

**Endpoint:** POST `/v1/functions/[FUNCTION_ID]/executions`

**Request Body:**
```json
{
  "userId": "user_id_here",
  "type": "subscription", // or "stardust"
  "tier": "seeker" // or "oracle", "spark", "ember", "supernova", "cosmic_rift"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Note:** You must configure Stripe Price IDs in the function code (PRICE_IDS constant).

### 3. stripe-webhook
**Purpose:** Handles Stripe webhook events to update user subscriptions and award Stardust.

**Environment Variables:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret
- `DATABASE_ID` - Appwrite database ID (default: gridpunk-arcana)

**Endpoint:** POST `/v1/functions/[FUNCTION_ID]/executions`

**Webhook Events Handled:**
- `checkout.session.completed` - Processes completed payments
- `customer.subscription.updated` - Updates subscription status
- `customer.subscription.deleted` - Handles subscription cancellations

**Note:** Configure this URL in your Stripe Dashboard as a webhook endpoint.

## Deployment

### Using Appwrite CLI

1. Login to Appwrite:
```bash
appwrite login
```

2. Deploy functions:
```bash
appwrite deploy function
```

### Manual Setup

1. Navigate to Appwrite Console → Functions
2. Create a new function for each directory
3. Upload the code or connect to Git
4. Configure environment variables
5. Set the entrypoint to `src/main.js`
6. Enable the function

## Testing

### Local Testing
You can test functions locally using the Appwrite CLI:

```bash
appwrite functions createExecution --functionId=[FUNCTION_ID] --data='{"prompt":"test"}'
```

### Production Testing
After deployment, test using curl:

```bash
# Gemini Proxy
curl -X POST https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello, world!"}'

# Stripe Checkout
curl -X POST https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","type":"subscription","tier":"seeker"}'
```

## Security Notes

1. **Never commit API keys** to version control
2. Always use environment variables for secrets
3. Configure CORS appropriately for production
4. Verify webhook signatures (stripe-webhook does this automatically)
5. Validate all user inputs

## Pricing Configuration

Before using the Stripe functions, create products and prices in your Stripe Dashboard:

### Subscriptions
- **Seeker** - $8.99/month recurring
- **Oracle** - $14.99/month recurring

### Stardust Packs
- **Spark** - $0.99 one-time (250 Stardust)
- **Ember** - $2.99 one-time (1,000 Stardust)
- **Supernova** - $4.99 one-time (2,500 Stardust)
- **Cosmic Rift** - $9.99 one-time (7,500 Stardust)

After creating the prices in Stripe, configure the corresponding Price IDs as environment variables in Appwrite:
- `STRIPE_PRICE_SEEKER`
- `STRIPE_PRICE_ORACLE`
- `STRIPE_PRICE_SPARK`
- `STRIPE_PRICE_EMBER`
- `STRIPE_PRICE_SUPERNOVA`
- `STRIPE_PRICE_COSMIC_RIFT`
