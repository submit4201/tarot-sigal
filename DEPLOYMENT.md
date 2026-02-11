# Gridpunk Arcana - Deployment Guide

## Overview
This guide covers the deployment of Gridpunk Arcana with Appwrite Cloud backend, Stripe payments, and landing page.

## Prerequisites
- Appwrite Cloud account (Student Tier confirmed)
- Stripe account (test mode initially, production when ready)
- Domain configured: sigil.cultofthefork.tech (landing), sigil.app.cultofthefork.tech (app)
- Appwrite CLI installed: `npm install -g appwrite-cli`

## 1. Appwrite Setup

### Database Collections
Create these collections in Appwrite Console → Databases → gridpunk-arcana:

#### Collection: `profiles`
| Attribute | Type | Required | Default |
|-----------|------|----------|---------|
| userId | String | Yes | - |
| givenName | String | Yes | - |
| currentName | String | No | - |
| mothersMaidenName | String | No | - |
| birthDate | String | No | - |
| birthTime | String | No | - |
| birthPlace | String | No | - |
| astrologicalSign | String | No | 'None' |
| birthConstellation | String | No | - |
| readingStyle | String | No | 'mystical' |
| readingFocus | String | No | 'general' |
| level | Integer | Yes | 1 |
| xp | Integer | Yes | 0 |
| stardust | Integer | Yes | 100 |
| ownedDeckIds | String[] | Yes | [] |
| unlockedAchievements | String[] | Yes | [] |
| isPremium | Boolean | Yes | false |
| subscriptionTier | String | Yes | 'free' |
| subscriptionExpiry | String | Yes | - |

**Indexes:**
- `userId` (key, unique)

**Permissions:**
- Read: Any authenticated user (for their own documents)
- Create: Any authenticated user
- Update: Document owner
- Delete: Document owner

#### Collection: `readings`
| Attribute | Type | Required |
|-----------|------|----------|
| userId | String | Yes |
| profileId | String | Yes |
| spreadType | String | Yes |
| question | String | No |
| cards | String[] | Yes |
| aiSummary | String | No |
| notes | String | No |
| date | String | Yes |
| createdAt | String | Yes |

**Indexes:**
- `userId` (key)
- `createdAt` (key, descending)

**Permissions:**
- Read: Document owner
- Create: Any authenticated user
- Update: Document owner
- Delete: Document owner

#### Collection: `journal_entries`
| Attribute | Type | Required |
|-----------|------|----------|
| userId | String | Yes |
| profileId | String | Yes |
| text | String | Yes |
| linkedCard | String | No |
| date | String | Yes |
| createdAt | String | Yes |

**Indexes:**
- `userId` (key)
- `createdAt` (key, descending)

**Permissions:**
- Read: Document owner
- Create: Any authenticated user
- Update: Document owner
- Delete: Document owner

#### Collection: `daily_draws`
| Attribute | Type | Required |
|-----------|------|----------|
| userId | String | Yes |
| profileId | String | Yes |
| date | String | Yes |
| drawnCard | String | Yes |

**Indexes:**
- `userId` (key)
- `date` (key, descending)

**Permissions:**
- Read: Document owner
- Create: Any authenticated user
- Update: Document owner
- Delete: Document owner

#### Collection: `purchases`
| Attribute | Type | Required |
|-----------|------|----------|
| userId | String | Yes |
| type | String | Yes |
| tier | String | Yes |
| stripeSessionId | String | Yes |
| amount | Float | Yes |
| status | String | Yes |
| createdAt | String | Yes |

**Indexes:**
- `userId` (key)
- `stripeSessionId` (key, unique)
- `createdAt` (key, descending)

**Permissions:**
- Read: Document owner
- Create: Server (Functions only)
- Update: Server (Functions only)
- Delete: Server (Functions only)

### Authentication Setup
1. Go to Appwrite Console → Auth
2. Enable Email/Password authentication
3. Enable OAuth providers:
   - Google OAuth
   - GitHub OAuth
4. Configure OAuth redirect URLs:
   - Success: `https://sigil.app.cultofthefork.tech`
   - Failure: `https://sigil.app.cultofthefork.tech`

## 2. Appwrite Functions Deployment

### Deploy Functions
```bash
# Login to Appwrite
appwrite login

# Set project context
appwrite init project

# Deploy each function
cd functions/gemini-proxy
appwrite deploy function

cd ../stripe-checkout
appwrite deploy function

cd ../stripe-webhook
appwrite deploy function
```

### Configure Function Environment Variables

#### gemini-proxy
```
GEMINI_API_KEY=your_gemini_api_key_here
```

#### stripe-checkout
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PRICE_SEEKER=price_xxxxxxxxxxxxx
STRIPE_PRICE_ORACLE=price_xxxxxxxxxxxxx
STRIPE_PRICE_SPARK=price_xxxxxxxxxxxxx
STRIPE_PRICE_EMBER=price_xxxxxxxxxxxxx
STRIPE_PRICE_SUPERNOVA=price_xxxxxxxxxxxxx
STRIPE_PRICE_COSMIC_RIFT=price_xxxxxxxxxxxxx
DATABASE_ID=gridpunk-arcana
SUCCESS_URL=https://sigil.app.cultofthefork.tech?payment=success
CANCEL_URL=https://sigil.app.cultofthefork.tech?payment=cancelled
```

#### stripe-webhook
```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
DATABASE_ID=gridpunk-arcana
```

## 3. Stripe Configuration

### Create Products and Prices

#### Subscriptions
1. Go to Stripe Dashboard → Products
2. Create products:
   - **Seeker Subscription**
     - Name: Gridpunk Arcana - Seeker
     - Price: $8.99/month recurring
     - Copy the Price ID → Use for `STRIPE_PRICE_SEEKER`
   
   - **Oracle Subscription**
     - Name: Gridpunk Arcana - Oracle
     - Price: $14.99/month recurring
     - Copy the Price ID → Use for `STRIPE_PRICE_ORACLE`

#### One-Time Purchases
Create one-time payment products:
- **Spark Pack**: $0.99 → `STRIPE_PRICE_SPARK`
- **Ember Pack**: $2.99 → `STRIPE_PRICE_EMBER`
- **Supernova Pack**: $4.99 → `STRIPE_PRICE_SUPERNOVA`
- **Cosmic Rift Pack**: $9.99 → `STRIPE_PRICE_COSMIC_RIFT`

### Configure Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://cloud.appwrite.io/v1/functions/[STRIPE_WEBHOOK_FUNCTION_ID]/executions`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret → Use for `STRIPE_WEBHOOK_SECRET`

## 4. Frontend Deployment

### Build Application
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### Deploy to Appwrite Hosting
```bash
# Deploy main app
appwrite deploy collection --collection-id=[APP_COLLECTION_ID]

# Deploy landing page
appwrite deploy collection --collection-id=[LANDING_COLLECTION_ID]
```

Alternatively, use Appwrite Console → Storage → Create bucket → Upload files from:
- `dist/` folder for the main app
- `landing/` folder for the landing page

## 5. DNS Configuration

### Configure Domains
Point your domains to Appwrite:

1. Go to domain registrar (e.g., Cloudflare, Namecheap)
2. Add CNAME records:
   ```
   sigil.app.cultofthefork.tech → [your-appwrite-domain]
   sigil.cultofthefork.tech → [your-appwrite-domain]
   ```

3. In Appwrite Console → Settings → Domains:
   - Add custom domain: `sigil.app.cultofthefork.tech`
   - Add custom domain: `sigil.cultofthefork.tech`
   - Configure SSL certificates (auto-generated by Appwrite)

## 6. Testing Checklist

### Authentication
- [ ] Sign up with email/password
- [ ] Login with existing account
- [ ] OAuth login (Google, GitHub)
- [ ] Logout
- [ ] Session persistence

### Profile & Data
- [ ] Create profile on first login
- [ ] Profile data syncs to Appwrite
- [ ] Journal entries save and load
- [ ] Readings save and load
- [ ] Daily draws save and load

### Subscription Flow (Test Mode)
- [ ] View pricing page
- [ ] Click "Subscribe" for Seeker tier
- [ ] Complete Stripe checkout (test card: 4242 4242 4242 4242)
- [ ] Verify subscription status updates in profile
- [ ] Verify isPremium flag is set

### Stardust Purchase Flow (Test Mode)
- [ ] Navigate to Shop page
- [ ] Click "Purchase" on Stardust pack
- [ ] Complete Stripe checkout
- [ ] Verify Stardust is awarded
- [ ] Verify premium users get 2x multiplier

### Landing Page
- [ ] All links work correctly
- [ ] Responsive on mobile/tablet
- [ ] "Enter App" button navigates to app
- [ ] Pricing section displays correctly

## 7. Environment Variables Summary

### Application (.env)
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=69477c330029f16459cd
VITE_APPWRITE_DATABASE_ID=gridpunk-arcana

# Appwrite Function IDs (replace with actual IDs from Appwrite Console after deployment)
VITE_STRIPE_CHECKOUT_FUNCTION_ID=your-stripe-checkout-function-id
VITE_GEMINI_PROXY_FUNCTION_ID=your-gemini-proxy-function-id
```

### Function: gemini-proxy
```
GEMINI_API_KEY=your_key
ALLOWED_ORIGINS=https://sigil.app.cultofthefork.tech
```

### Function: stripe-checkout
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_SEEKER=price_xxx
STRIPE_PRICE_ORACLE=price_xxx
STRIPE_PRICE_SPARK=price_xxx
STRIPE_PRICE_EMBER=price_xxx
STRIPE_PRICE_SUPERNOVA=price_xxx
STRIPE_PRICE_COSMIC_RIFT=price_xxx
DATABASE_ID=gridpunk-arcana
SUCCESS_URL=https://sigil.app.cultofthefork.tech?payment=success
CANCEL_URL=https://sigil.app.cultofthefork.tech?payment=cancelled
ALLOWED_ORIGINS=https://sigil.app.cultofthefork.tech
```

### Function: stripe-webhook
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
DATABASE_ID=gridpunk-arcana
```

## 8. Security Considerations

- ✅ API keys protected server-side via Appwrite Functions
- ✅ Webhook signatures verified
- ✅ User data isolated with proper permissions
- ✅ CORS configured for production domains
- ✅ No secrets in client-side code
- ✅ SSL/TLS for all connections

## 9. Monitoring

### Appwrite Console
- Monitor function executions
- Check database activity
- Review authentication logs
- Monitor storage usage

### Stripe Dashboard
- Track payments
- Monitor subscription status
- Review webhook deliveries
- Check for failed payments

## 10. Troubleshooting

### Common Issues

**Functions not executing:**
- Check environment variables are set
- Review function logs in Appwrite Console
- Verify function is deployed and enabled

**Stripe webhook not receiving events:**
- Verify webhook URL is correct
- Check webhook signing secret
- Review Stripe webhook dashboard for delivery attempts

**Authentication issues:**
- Verify OAuth redirect URLs are correct
- Check email/password auth is enabled
- Review session expiration settings

**Database permission errors:**
- Verify collection permissions
- Check user authentication status
- Review indexes are created

## 11. Going to Production

When ready for production:

1. **Stripe**: Switch from test mode to live mode
2. **Update environment variables** with production keys
3. **Test payment flow** with real card (refund after testing)
4. **Update CORS** settings for production domains
5. **Enable SSL** on all custom domains
6. **Set up monitoring** and alerting
7. **Create backup strategy** for database
8. **Document runbooks** for common issues

## Support

For issues:
- Appwrite: https://appwrite.io/docs
- Stripe: https://stripe.com/docs
- Repository Issues: https://github.com/submit4201/tarot-sigal/issues
