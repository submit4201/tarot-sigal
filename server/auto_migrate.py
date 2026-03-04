import time
import re
from sqlalchemy import text, inspect
from core.database import engine, DATABASE_URL
from core.logger import app_logger


def _is_sqlite() -> bool:
    """Check if the current database engine is SQLite."""
    return DATABASE_URL.startswith("sqlite")


def _sync_table_columns(inspector, table: str, columns: list[tuple[str, str]]):
    """
    Idempotently add missing columns to a table using schema inspection.
    """
    try:
        if not inspector.has_table(table):
            # Table doesn't exist yet, create_all will handle it
            return

        existing_cols = {c['name'].lower() for c in inspector.get_columns(table)}
        missing = [c for c in columns if c[0].lower() not in existing_cols]

        if not missing:
            return

        app_logger.info(f"Adding {len(missing)} missing columns to {table} table...")
        for col_name, col_type in missing:
            try:
                # Use a new connection per column to ensure partial success if one fails
                with engine.begin() as conn:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}"))
                    app_logger.info(f"  + Added column {col_name} ({col_type})")
            except Exception as e:
                app_logger.warning(f"  ! Failed to add {col_name} to {table}: {e}")
    except Exception as e:
        app_logger.error(f"Error inspecting/syncing table {table}: {e}")


def _drop_unique_constraint_on_user_id():
    """
    Drop the UNIQUE constraint on birth_profiles.user_id.
    """
    try:
        inspector = inspect(engine)
        
        if not inspector.has_table("birth_profiles"):
            return
        
        unique_constraints = inspector.get_unique_constraints("birth_profiles")
        indexes = inspector.get_indexes("birth_profiles")
        
        has_unique = False
        constraint_name = None
        
        for uc in unique_constraints:
            if uc.get("column_names") == ["user_id"]:
                has_unique = True
                constraint_name = uc.get("name")
                break
        
        if not has_unique:
            for idx in indexes:
                if idx.get("unique") and idx.get("column_names") == ["user_id"]:
                    has_unique = True
                    constraint_name = idx.get("name")
                    break
        
        if not has_unique:
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
    """SQLite-specific: rebuild the table without the UNIQUE constraint."""
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
    """PostgreSQL-specific: use standard ALTER TABLE to drop the constraint."""
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
    Run all pending auto-migrations on startup with optimization.
    """
    app_logger.info("Starting optimized auto-migrations...")
    start_time = time.time()
    
    try:
        inspector = inspect(engine)

        # --- Users table ---
        _sync_table_columns(inspector, "users", [
            ("is_premium", "BOOLEAN DEFAULT FALSE"),
            ("is_admin", "BOOLEAN DEFAULT FALSE"),
            ("subscription_tier", "VARCHAR(50) DEFAULT 'Seeker'"),
            ("subscription_expiry", "TIMESTAMP"),
            ("stripe_customer_id", "VARCHAR(100)"),
            ("stardust", "INTEGER DEFAULT 0"),
            ("level", "INTEGER DEFAULT 1"),
            ("xp", "INTEGER DEFAULT 0"),
            ("owned_deck_ids", "TEXT DEFAULT '[\"default_tarot\", \"ancient_runes\"]'"),
            ("unlocked_achievements", "TEXT DEFAULT '[]'"),
            ("current_name", "VARCHAR(100)"),
            ("mothers_maiden_name", "VARCHAR(100)"),
            ("birth_date", "VARCHAR(20)"),
            ("birth_time", "VARCHAR(10)"),
            ("birth_place", "VARCHAR(255)"),
            ("reading_style", "VARCHAR(50) DEFAULT 'mystical'"),
            ("reading_focus", "VARCHAR(50) DEFAULT 'general'"),
        ])

        # --- Readings table ---
        _sync_table_columns(inspector, "readings", [
            ("positions", "TEXT"),
            ("deck_type", "VARCHAR(50)"),
            ("deck_id", "VARCHAR(100)"),
            ("card_relationships", "TEXT"),
            ("elemental_dignity", "TEXT"),
            ("numerology_threads", "TEXT"),
            ("practical_actions", "TEXT"),
            ("shadow_message", "TEXT"),
        ])
            
        # --- Birth Profiles table ---
        _sync_table_columns(inspector, "birth_profiles", [
            ("label", "VARCHAR(100) DEFAULT 'Me'"),
            ("is_primary", "BOOLEAN DEFAULT TRUE"),
        ])
        
        # --- Drop UNIQUE constraint on birth_profiles.user_id ---
        _drop_unique_constraint_on_user_id()
            
        duration = time.time() - start_time
        app_logger.info(f"Auto migrations completed in {duration:.2f}s.")
    except Exception as e:
        app_logger.error(f"Critical failure in auto migrations: {e}")


if __name__ == "__main__":
    # Allow running migrations standalone for verification
    run_auto_migrations()


