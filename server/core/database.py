from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import urlparse
import os
from pathlib import Path
from dotenv import load_dotenv
from core.logger import app_logger

# Load environment variables from a path resolved relative to this file
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env.local"
load_dotenv(dotenv_path=env_path)

# Database URL from env or default local sqlite for dev
# In production, DO App Platform will provide DATABASE_URL automatically
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./gridpunk.db")

# Fix for SQLAlchemy 1.4+ with postgres:// vs postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    # check_same_thread is only for SQLite
    connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
    
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    
    app_logger.info(f"Database engine initialized for {urlparse(DATABASE_URL).scheme}")
except Exception as e:
    app_logger.error(f"Failed to initialize database engine: {e}")
    raise

# Dependency to yield database sessions for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
