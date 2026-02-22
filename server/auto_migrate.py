from sqlalchemy import text
from core.database import engine
from core.logger import app_logger

def run_auto_migrations():
    app_logger.info("Running auto migrations...")
    try:
        with engine.begin() as conn:
            columns_to_add = [
                ("is_premium", "BOOLEAN DEFAULT FALSE"),
                ("subscription_tier", "VARCHAR(50) DEFAULT 'Seeker'"),
                ("subscription_expiry", "TIMESTAMP"),
                ("stripe_customer_id", "VARCHAR(100)"),
                ("stardust", "INTEGER DEFAULT 0"),
                ("level", "INTEGER DEFAULT 1"),
                ("xp", "INTEGER DEFAULT 0"),
                ("owned_deck_ids", "TEXT DEFAULT '[\"default_tarot\", \"ancient_runes\"]'"),
                ("unlocked_achievements", "TEXT DEFAULT '[]'")
            ]
            
            for col_name, col_type in columns_to_add:
                try:
                    # Standard SQL, relying on Exception handling for 'column already exists'
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    app_logger.info(f"Added column {col_name} to users table.")
                except Exception:
                    # We expect this to fail if column already exists
                    pass
            
        app_logger.info("Auto migrations completed.")
    except Exception as e:
        app_logger.error(f"Error running auto migrations: {e}")
