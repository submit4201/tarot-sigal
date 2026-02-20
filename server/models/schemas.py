from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- Auth / User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    given_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    given_name: Optional[str] = None
    is_premium: bool = False
    subscription_tier: str
    subscription_expiry: Optional[datetime] = None
    stardust: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

# --- Stripe Schemas ---
class CheckoutSessionRequest(BaseModel):
    type: str  # "subscription" or "stardust"
    tier: str  # e.g., "seeker", "oracle", "spark", "ember"

# --- Reading Schemas ---
class ReadingCreate(BaseModel):
    spread: Optional[str] = None
    question: Optional[str] = None
    cards: Optional[str] = None
    ai_summary: Optional[str] = None
    notes: Optional[str] = None

class ReadingResponse(ReadingCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Journal Schemas ---
class JournalEntryCreate(BaseModel):
    text: str
    linked_card: Optional[str] = None

class JournalEntryResponse(JournalEntryCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Daily Draw Schemas ---
class DailyDrawCreate(BaseModel):
    card: Optional[str] = None
    is_rev: bool = False
    date: str
    insights: Optional[str] = None

class DailyDrawResponse(DailyDrawCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Purchase Schemas ---
class PurchaseCreate(BaseModel):
    type: str
    amount: int
    stripe_id: Optional[str] = None
    status: str = "pending"

class PurchaseResponse(PurchaseCreate):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
