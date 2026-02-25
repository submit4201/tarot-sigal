import re
from sqlalchemy import text, inspect
from core.database import engine, DATABASE_URL
from core.logger import app_logger


def _is_sqlite() -> bool:
    """Check if the current database engine is SQLite."""
    return DATABASE_URL.startswith("sqlite")


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
          recreate the table for SQLite. PostgreSQL uses standard DDL.
          This migration is idempotent: it checks if the unique constraint
          still exists before proceeding.
    """
    try:
        inspector = inspect(engine)
        
        # Check if birth_profiles table exists at all
        if not inspector.has_table("birth_profiles"):
            app_logger.info("birth_profiles table does not exist yet, skipping constraint migration.")
            return
        
        # Check if a unique constraint on user_id still exists
        unique_constraints = inspector.get_unique_constraints("birth_profiles")
        indexes = inspector.get_indexes("birth_profiles")
        
        has_unique = False
        constraint_name = None
        
        for uc in unique_constraints:
            if uc.get("column_names") == ["user_id"]:
                has_unique = True
                constraint_name = uc.get("name")
                break
        
        # Also check unique indexes (SQLite creates these automatically)
        if not has_unique:
            for idx in indexes:
                if idx.get("unique") and idx.get("column_names") == ["user_id"]:
                    has_unique = True
                    constraint_name = idx.get("name")
                    break
        
        if not has_unique:
            app_logger.info("birth_profiles.user_id UNIQUE constraint already removed.")
            return
        
        app_logger.info(f"Dropping UNIQUE constraint on birth_profiles.user_id (name: {constraint_name})...")
        
        if _is_sqlite():
            _drop_unique_constraint_sqlite()
        else:
            _drop_unique_constraint_postgres(constraint_name)
            
    except Exception as e:
        app_logger.error(
            f"CRITICAL: Failed to drop UNIQUE constraint on birth_profiles.user_id: {e}. "
            "Multiple profiles per user may not work correctly until this is resolved."
        )
        raise


def _drop_unique_constraint_sqlite():
    """
    SQLite-specific: rebuild the table without the UNIQUE constraint.
    
    @note SQLite does not support ALTER TABLE DROP CONSTRAINT.
    """
    assert _is_sqlite(), "This function must only be called for SQLite databases"
    with engine.begin() as conn:
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
        
        conn.execute(text("""
            INSERT OR IGNORE INTO birth_profiles_new
            SELECT id, user_id, label, is_primary, full_name, birth_date, 
                   birth_time, birth_location, latitude, longitude,
                   profile_data, llm_narrative, created_at, updated_at
            FROM birth_profiles
        """))
        
        conn.execute(text("DROP TABLE birth_profiles"))
        conn.execute(text("ALTER TABLE birth_profiles_new RENAME TO birth_profiles"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_birth_profiles_user_id ON birth_profiles(user_id)"))
        
    app_logger.info("Successfully removed UNIQUE constraint (SQLite table rebuild)")


def _drop_unique_constraint_postgres(constraint_name: str | None):
    """
    PostgreSQL-specific: use standard ALTER TABLE to drop the constraint.
    
    @note This is safe and does not drop/recreate the table.
    """
    with engine.begin() as conn:
        if constraint_name:
            # Validate constraint_name contains only safe identifier characters
            # to prevent SQL injection via f-string interpolation.
            if not re.match(r'^[A-Za-z_][A-Za-z0-9_$]*$', constraint_name):
                raise ValueError(f"Unsafe constraint name detected: {constraint_name!r}")
            conn.execute(text(f'ALTER TABLE birth_profiles DROP CONSTRAINT IF EXISTS "{constraint_name}"'))
        # Check whether the non-unique index already exists before recreating it
        # to avoid unnecessary DROP/CREATE cycles on repeated migration runs.
        # Use pg_index.indisunique for a reliable uniqueness check instead of
        # parsing indexdef text, which can vary in formatting.
        result = conn.execute(
            text(
                "SELECT i.indisunique "
                "FROM pg_indexes idx "
                "JOIN pg_class c ON c.relname = idx.indexname "
                "JOIN pg_index i ON i.indexrelid = c.oid "
                "WHERE idx.schemaname = current_schema() "
                "  AND idx.tablename = 'birth_profiles' "
                "  AND idx.indexname = 'ix_birth_profiles_user_id'"
            )
        ).fetchone()

        needs_non_unique_index = True
        if result:
            # result[0] is indisunique — if False, the index is already non-unique
            if not result[0]:
                needs_non_unique_index = False

        if needs_non_unique_index:
            conn.execute(text("DROP INDEX IF EXISTS ix_birth_profiles_user_id"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS ix_birth_profiles_user_id ON birth_profiles(user_id)"))
        
    app_logger.info("Successfully removed UNIQUE constraint (PostgreSQL ALTER TABLE)")


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


