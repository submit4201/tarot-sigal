from core.database import SessionLocal
from models.database_models import BirthProfile
from core.logger import app_logger

def flush_profiles():
    """ deletes all records in the birth_profiles table. """
    db = SessionLocal()
    try:
        num_deleted = db.query(BirthProfile).delete()
        db.commit()
        app_logger.info(f"Successfully flushed {num_deleted} birth profiles from the database.")
        print(f"SUCCESS: Flushed {num_deleted} profiles.")
    except Exception as e:
        db.rollback()
        app_logger.error(f"Failed to flush birth profiles: {e}")
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    flush_profiles()
