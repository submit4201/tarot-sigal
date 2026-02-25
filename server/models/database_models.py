from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    given_name = Column(String(50), nullable=True)
    current_name = Column(String(100), nullable=True)
    mothers_maiden_name = Column(String(100), nullable=True)
    birth_date = Column(String(20), nullable=True)      # YYYY-MM-DD
    birth_time = Column(String(10), nullable=True)       # HH:MM
    birth_place = Column(String(255), nullable=True)
    reading_style = Column(String(50), default="mystical")
    reading_focus = Column(String(50), default="general")
    is_premium = Column(Boolean, default=False)
    subscription_tier = Column(String(50), default="free")
    subscription_expiry = Column(DateTime(timezone=True), nullable=True)
    stripe_customer_id = Column(String(100), nullable=True)
    stardust = Column(Integer, default=0)
    
    # Gamification
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    owned_deck_ids = Column(JSON, default=lambda: ["default_tarot", "ancient_runes"])
    unlocked_achievements = Column(JSON, default=lambda: [])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    readings = relationship("Reading", back_populates="user", cascade="all, delete-orphan")
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    daily_draws = relationship("DailyDraw", back_populates="user", cascade="all, delete-orphan")
    purchases = relationship("Purchase", back_populates="user")
    birth_profiles = relationship("BirthProfile", back_populates="user", cascade="all, delete-orphan")


class Reading(Base):
    """
    Stores a user's divination readings.

    @note positions and practical_actions are stored as JSON strings.
    @note deck_type and deck_id identify which divination system/deck was used.
    @note Premium fields (card_relationships, elemental_dignity, numerology_threads,
          shadow_message) are only populated for premium-tier users.
    """
    __tablename__ = "readings"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    spread = Column(String(100), nullable=True)
    question = Column(Text, nullable=True)
    cards = Column(Text, nullable=True)        # JSON string of drawn cards
    positions = Column(Text, nullable=True)     # JSON string of position labels
    deck_type = Column(String(50), nullable=True)   # e.g., 'tarot', 'runes', 'oracle'
    deck_id = Column(String(100), nullable=True)    # e.g., 'default_tarot', 'ancient_runes'
    ai_summary = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    # Premium analysis fields
    card_relationships = Column(Text, nullable=True)
    elemental_dignity = Column(Text, nullable=True)
    numerology_threads = Column(Text, nullable=True)
    practical_actions = Column(Text, nullable=True)  # JSON string of action items
    shadow_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="readings")


class BirthProfile(Base):
    __tablename__ = "birth_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    label = Column(String(100), default="Me")       # e.g., "Me", "Sarah", "Alex"
    is_primary = Column(Boolean, default=True)       # Only one primary per user
    
    full_name = Column(String(255), nullable=False)
    birth_date = Column(String(20), nullable=False) # ISO 8601
    birth_time = Column(String(10), nullable=False) # HH:MM
    birth_location = Column(String(255), nullable=False)
    latitude = Column(Text, nullable=True)
    longitude = Column(Text, nullable=True)
    
    # The calculated data blob and the AI-generated narrative
    profile_data = Column(JSON, nullable=True)
    llm_narrative = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="birth_profiles")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    text = Column(Text, nullable=False)
    linked_card = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="journal_entries")


class DailyDraw(Base):
    __tablename__ = "daily_draws"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    card = Column(String(50), nullable=True)
    is_rev = Column(Boolean, default=False)
    date = Column(String(20), index=True, nullable=False) # e.g., 'YYYY-MM-DD'
    insights = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="daily_draws")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    type = Column(String(50), nullable=True)
    amount = Column(Integer, default=0) # Stored in cents
    stripe_id = Column(String(100), unique=True, index=True, nullable=True)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="purchases")
