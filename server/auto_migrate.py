from sqlalchemy import text, inspect
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


def _drop_unique_constraint_on_user_id():
    """
    Drop the UNIQUE constraint on birth_profiles.user_id.
    
    @note SQLite does not support ALTER TABLE ... DROP CONSTRAINT, so we must
          recreate the table. This migration is idempotent: it checks if the
          unique constraint still exists before proceeding.
    """
    try:
        with engine.begin() as conn:
            # Check if the unique index on user_id exists
            result = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='index' "
                "AND tbl_name='birth_profiles' AND sql LIKE '%user_id%UNIQUE%'"
            )).fetchall()
            
            # Also check via PRAGMA for auto-created unique indexes
            indexes = conn.execute(text("PRAGMA index_list('birth_profiles')")).fetchall()
            unique_user_id_index = None
            for idx in indexes:
                idx_name = idx[1]  # index name
                is_unique = idx[2]  # 1 = unique
                if is_unique:
                    cols = conn.execute(text(f"PRAGMA index_info('{idx_name}')")).fetchall()
                    col_names = [c[2] for c in cols]
                    if col_names == ['user_id']:
                        unique_user_id_index = idx_name
                        break
            
            if not unique_user_id_index and not result:
                app_logger.info("birth_profiles.user_id UNIQUE constraint already removed.")
                return
            
            app_logger.info(f"Dropping UNIQUE constraint on birth_profiles.user_id (index: {unique_user_id_index})...")
            
            # Rebuild table without unique constraint on user_id
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS birth_profiles_new (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
                    label VARCHAR(100) DEFAULT 'Me',
                    is_primary BOOLEAN DEFAULT TRUE,
                    full_name VARCHAR(255) NOT NULL,
                    birth_date VARCHAR(20) NOT NULL,
                    birth_time VARCHAR(10) NOT NULL,
                    birth_location VARCHAR(255) NOT NULL,
                    latitude TEXT,
                    longitude TEXT,
                    profile_data JSON,
                    llm_narrative TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP
                )
            """))
            
            # Copy existing data
            conn.execute(text("""
                INSERT OR IGNORE INTO birth_profiles_new
                SELECT id, user_id, label, is_primary, full_name, birth_date, 
                       birth_time, birth_location, latitude, longitude,
                       profile_data, llm_narrative, created_at, updated_at
                FROM birth_profiles
            """))
            
            # Swap tables
            conn.execute(text("DROP TABLE birth_profiles"))
            conn.execute(text("ALTER TABLE birth_profiles_new RENAME TO birth_profiles"))
            
            # Recreate the non-unique index on user_id for query performance
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_birth_profiles_user_id ON birth_profiles(user_id)"))
            
            app_logger.info("Successfully removed UNIQUE constraint on birth_profiles.user_id")
    except Exception as e:
        app_logger.error(f"Error dropping UNIQUE constraint on birth_profiles.user_id: {e}")


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
            ("unlocked_achievements", "TEXT DEFAULT '[]'"),
            # Profile detail fields (Part 1 fix)
            ("current_name", "VARCHAR(100)"),
            ("mothers_maiden_name", "VARCHAR(100)"),
            ("birth_date", "VARCHAR(20)"),
            ("birth_time", "VARCHAR(10)"),
            ("birth_place", "VARCHAR(255)"),
            ("reading_style", "VARCHAR(50) DEFAULT 'mystical'"),
            ("reading_focus", "VARCHAR(50) DEFAULT 'general'"),
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
            
        # --- Birth Profiles table (multi-profile support) ---
        _add_columns("birth_profiles", [
            ("label", "VARCHAR(100) DEFAULT 'Me'"),
            ("is_primary", "BOOLEAN DEFAULT TRUE"),
        ])
        
        # --- Drop UNIQUE constraint on birth_profiles.user_id ---
        # Required to allow multiple profiles per user
        _drop_unique_constraint_on_user_id()
            
        app_logger.info("Auto migrations completed.")
    except Exception as e:
        app_logger.error(f"Error running auto migrations: {e}")


