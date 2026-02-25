from sqlalchemy import text
from core.database import engine
from core.logger import app_logger

def _add_columns(table: str, columns: list[tuple[str, str]]):
    """
    Idempotently add columns to a table.
    
    @note Each column addition runs in its own transaction so a failure
          (e.g., column already exists) doesn't roll back the others.
    """
    for col_name, col_type in columns:
        try:
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}"))
                app_logger.info(f"Added column {col_name} to {table} table.")
        except Exception:
            # Column already exists — expected on subsequent startups
            pass

def run_auto_migrations():
    """
    Run all pending auto-migrations on startup.
    
    @note This is NOT a replacement for a proper migration tool like Alembic.
          It handles simple column additions for schema evolution.
    """
    app_logger.info("Running auto migrations...")
    try:
        # --- Users table ---
        _add_columns("users", [
            ("is_premium", "BOOLEAN DEFAULT FALSE"),
            ("subscription_tier", "VARCHAR(50) DEFAULT 'Seeker'"),
            ("subscription_expiry", "TIMESTAMP"),
            ("stripe_customer_id", "VARCHAR(100)"),
            ("stardust", "INTEGER DEFAULT 0"),
            ("level", "INTEGER DEFAULT 1"),
            ("xp", "INTEGER DEFAULT 0"),
            ("owned_deck_ids", "TEXT DEFAULT '[\"default_tarot\", \"ancient_runes\"]'"),
            ("unlocked_achievements", "TEXT DEFAULT '[]'")
        ])

        # --- Readings table ---
        _add_columns("readings", [
            ("positions", "TEXT"),
            ("deck_type", "VARCHAR(50)"),
            ("deck_id", "VARCHAR(100)"),
            ("card_relationships", "TEXT"),
            ("elemental_dignity", "TEXT"),
            ("numerology_threads", "TEXT"),
            ("practical_actions", "TEXT"),
            ("shadow_message", "TEXT"),
        ])
            
        app_logger.info("Auto migrations completed.")
    except Exception as e:
        app_logger.error(f"Error running auto migrations: {e}")

