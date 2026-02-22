from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import json

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- Auth / User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)
    given_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)

class UserResponse(BaseModel):
    id: str
    email: str
    given_name: Optional[str] = Field(None, alias="givenName")
    is_premium: bool = Field(False, alias="isPremium")
    subscription_tier: str = Field("Seeker", alias="subscriptionTier")
    subscription_expiry: Optional[datetime] = Field(None, alias="subscriptionExpiry")
    stardust: int = 0
    level: int = 1
    xp: int = 0
    owned_deck_ids: List[str] = Field(default_factory=lambda: ["default_tarot", "ancient_runes"], alias="ownedDeckIds")
    unlocked_achievements: List[str] = Field(default_factory=list, alias="unlockedAchievements")
    created_at: datetime

    @field_validator('owned_deck_ids', 'unlocked_achievements', mode='before')
    @classmethod
    def parse_json_lists(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                if v == '["default_tarot", "ancient_runes"]':
                    return ["default_tarot", "ancient_runes"]
                return []
        return v

    class Config:
        from_attributes = True
        populate_by_name = True

class ProfileUpdate(BaseModel):
    given_name: Optional[str] = Field(None, alias="givenName")
    is_premium: Optional[bool] = Field(None, alias="isPremium")
    subscription_tier: Optional[str] = Field(None, alias="subscriptionTier")
    stardust: Optional[int] = None
    level: Optional[int] = None
    xp: Optional[int] = None
    owned_deck_ids: Optional[List[str]] = Field(None, alias="ownedDeckIds")
    unlocked_achievements: Optional[List[str]] = Field(None, alias="unlockedAchievements")

    class Config:
        populate_by_name = True

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


# --- Birth Profile Schemas ---
class BirthProfileBase(BaseModel):
    full_name: str = Field(..., alias="fullName")
    birth_date: str = Field(..., alias="birthDate")
    birth_time: str = Field(..., alias="birthTime")
    birth_location: str = Field(..., alias="birthLocation")
    latitude: Optional[str] = None
    longitude: Optional[str] = None

class BirthProfileCreate(BirthProfileBase):
    pass

class BirthProfileResponse(BirthProfileBase):
    id: str
    user_id: str
    profile_data: Optional[dict] = Field(None, alias="profileData")
    llm_narrative: Optional[str] = Field(None, alias="llmNarrative")
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator('profile_data', mode='before')
    @classmethod
    def parse_json_dict(cls, v):
        if isinstance(v, str):
            try:
                import json
                return json.loads(v)
            except Exception:
                return {}
        return v

    class Config:
        from_attributes = True
        populate_by_name = True

class BirthProfileTeaser(BaseModel):
    sun_sign: str = Field(..., alias="sunSign")
    moon_sign: str = Field(..., alias="moonSign")
    ascendant_sign: str = Field(..., alias="ascendantSign")
    aura_preview: str = Field(..., alias="auraPreview")
    is_premium_locked: bool = Field(True, alias="isPremiumLocked")

    class Config:
        populate_by_name = True
