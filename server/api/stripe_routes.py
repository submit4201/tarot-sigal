import stripe
import os
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from core.database import get_db
from models.database_models import User, Purchase
from models.schemas import CheckoutSessionRequest
from api.deps import get_current_user
from core.logger import app_logger

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Allow easy config via env
SUCCESS_URL = os.getenv("SUCCESS_URL", "http://localhost:5173?payment=success")
CANCEL_URL = os.getenv("CANCEL_URL", "http://localhost:5173?payment=cancelled")

# Stripe Price IDs
PRICE_IDS = {
    "seeker": os.getenv("STRIPE_PRICE_SEEKER", ""),
    "oracle": os.getenv("STRIPE_PRICE_ORACLE", ""),
    "spark": os.getenv("STRIPE_PRICE_SPARK", ""),
    "ember": os.getenv("STRIPE_PRICE_EMBER", ""),
    "supernova": os.getenv("STRIPE_PRICE_SUPERNOVA", ""),
    "cosmic_rift": os.getenv("STRIPE_PRICE_COSMIC_RIFT", ""),
}

SUBSCRIPTION_TIERS = ["seeker", "oracle"]
STARDUST_TIERS = ["spark", "ember", "supernova", "cosmic_rift"]
STARDUST_AMOUNTS = {"spark": 250, "ember": 1000, "supernova": 2500, "cosmic_rift": 7500}

router = APIRouter()

@router.post("/create-checkout-session")
def create_checkout_session(
    request: CheckoutSessionRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if request.type not in ["subscription", "stardust"]:
        raise HTTPException(status_code=400, detail="Invalid type. Must be 'subscription' or 'stardust'")
        
    valid_tiers = SUBSCRIPTION_TIERS if request.type == "subscription" else STARDUST_TIERS
    if request.tier not in valid_tiers:
        raise HTTPException(status_code=400, detail=f"Invalid tier: {request.tier}")

    price_id = PRICE_IDS.get(request.tier)
    if not price_id:
        app_logger.error(f"Missing Stripe Price ID for tier: {request.tier}")
        raise HTTPException(status_code=500, detail="Server misconfiguration: missing price ID")

    mode = "subscription" if request.type == "subscription" else "payment"
    
    session_config = {
        "mode": mode,
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": SUCCESS_URL,
        "cancel_url": CANCEL_URL,
        "client_reference_id": current_user.id,
        "customer_email": current_user.email if hasattr(current_user, 'email') and current_user.email else None,
        "metadata": {
            "userId": current_user.id,
            "type": request.type,
            "tier": request.tier,
        }
    }

    if mode == "subscription":
        session_config["subscription_data"] = {
            "metadata": {
                "userId": current_user.id,
                "tier": request.tier,
            }
        }

    try:
        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(**session_config)
        
        # Record pending purchase
        purchase = Purchase(
            user_id=current_user.id,
            type=request.type,
            amount=checkout_session.amount_total if checkout_session.amount_total else 0,
            stripe_id=checkout_session.id,
            status="pending"
        )
        db.add(purchase)
        db.commit()
        app_logger.info(f"Checkout session created: {checkout_session.id}")
        
        return {"success": True, "sessionId": checkout_session.id, "url": checkout_session.url}
    except Exception as e:
        app_logger.error(f"Stripe setup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    app_logger.info(f"Received stripe webhook event: {event['type']}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        user_id = metadata.get("userId")
        purchase_type = metadata.get("type")
        tier = metadata.get("tier")

        if not user_id:
            app_logger.error("checkout.session.completed missing userId metadata.")
            return Response(status_code=200)

        # Update purchase idempotency
        purchase = db.query(Purchase).filter(Purchase.stripe_id == session["id"]).first()
        if purchase:
            if purchase.status == "completed":
                return Response(status_code=200)
            purchase.status = "completed"
            db.commit()

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            app_logger.error(f"User not found for ID: {user_id}")
            return Response(status_code=200)

        if purchase_type == "subscription":
            # Attempt to grab actual subscription data from stripe
            subscription_expiry = datetime.utcnow() + timedelta(days=30)
            if session.get("subscription"):
                try:
                    sub_obj = stripe.Subscription.retrieve(session["subscription"])
                    subscription_expiry = datetime.utcfromtimestamp(sub_obj.current_period_end)
                except Exception as e:
                    app_logger.error(f"Failed to fetch sub: {e}")
            
            user.is_premium = True
            user.subscription_tier = tier
            user.subscription_expiry = subscription_expiry
            db.commit()
            app_logger.info(f"Updated subscription for {user_id} to {tier}")

        elif purchase_type == "stardust":
            base_amt = STARDUST_AMOUNTS.get(tier, 0)
            multiplier = 2 if user.is_premium else 1
            user.stardust += (base_amt * multiplier)
            db.commit()
            app_logger.info(f"Awarded {base_amt * multiplier} stardust to {user_id}")


    elif event["type"] in ["customer.subscription.updated", "customer.subscription.deleted"]:
        subscription = event["data"]["object"]
        metadata = subscription.get("metadata", {})
        user_id = metadata.get("userId")

        if not user_id:
            return Response(status_code=200)

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return Response(status_code=200)
            
        is_active = subscription["status"] == "active"
        sub_expiry = datetime.utcfromtimestamp(subscription["current_period_end"]) if subscription.get("current_period_end") else datetime.utcnow()

        user.is_premium = is_active
        user.subscription_tier = metadata.get("tier", "seeker") if is_active else "free"
        user.subscription_expiry = sub_expiry
        db.commit()
        app_logger.info(f"Updated subscription status for {user_id}: {is_active}")

    return Response(status_code=200)

@router.get("/verify-subscription")
def verify_subscription(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Manually check Stripe for an active subscription tied to the user's email.
    Useful for local dev when webhooks aren't flowing, or if a webhook was missed.
    Aggressively handles duplicate guest Customer records in Stripe.
    """
    try:
        candidate_customer_ids = []
        if current_user.stripe_customer_id:
            candidate_customer_ids.append(current_user.stripe_customer_id)
            
        app_logger.info(f"Searching Stripe for customer with email: {current_user.email}")
        try:
            customers_search = stripe.Customer.search(
                query=f"email:'{current_user.email}'",
                limit=3
            )
            for c in customers_search.data:
                if c.id not in candidate_customer_ids:
                    candidate_customer_ids.append(c.id)
        except Exception:
            # Fallback to standard list if search API isn't enabled/available
            customers_list = stripe.Customer.list(email=current_user.email, limit=5)
            for c in customers_list.data:
                if c.id not in candidate_customer_ids:
                    candidate_customer_ids.append(c.id)
                    
        if not candidate_customer_ids:
            app_logger.info(f"No Stripe customer found for email {current_user.email}")
            return {"is_premium": current_user.is_premium, "message": "No Stripe customer found for this email."}
            
        # Check all candidate customers for an active sub
        active_sub = None
        for cid in candidate_customer_ids:
            app_logger.info(f"Checking subscriptions for Stripe Customer: {cid}")
            subscriptions = stripe.Subscription.list(customer=cid, status="active", limit=1)
            if subscriptions.data:
                active_sub = subscriptions.data[0]
                # If this customer has the active sub, update our local pointer to match
                if current_user.stripe_customer_id != cid:
                    current_user.stripe_customer_id = cid
                    db.commit()
                break
                
        if active_sub:
            # Fallback for plan ID if 'plan' object structure varies
            plan_obj = active_sub.get("plan", {})
            price_id = plan_obj.get("id") if isinstance(plan_obj, dict) else getattr(plan_obj, "id", None)
            
            # Map price ID back to our tier name
            tier_name = "seeker"
            for t_name, t_price in PRICE_IDS.items():
                if t_price == price_id:
                    tier_name = t_name
                    break
                    
            # Overwrite metadata fallback if the sub has it
            metadata = active_sub.get("metadata", {})
            if metadata and "tier" in metadata:
                tier_name = metadata["tier"]
                
            current_user.is_premium = True
            current_user.subscription_tier = tier_name
            
            # Safely get current_period_end
            period_end = active_sub.get("current_period_end")
            if not period_end:
                 period_end = datetime.utcnow().timestamp() + (30 * 24 * 60 * 60)
            
            current_user.subscription_expiry = datetime.utcfromtimestamp(period_end)
            db.commit()
            return {"is_premium": True, "tier": tier_name, "message": "Subscription mapped and activated!"}
            
        else:
            # If they had premium but no active sub found across all customer profiles, downgrade
            if current_user.is_premium:
                current_user.is_premium = False
                current_user.subscription_tier = "free"
                db.commit()
            return {"is_premium": False, "message": "No active subscriptions found across your Stripe profiles."}

    except Exception as e:
        app_logger.error(f"Error verifying subscription manually: {e}")
        raise HTTPException(status_code=500, detail=str(e))
