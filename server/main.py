import os
from dotenv import load_dotenv

# Automatically load environment variables from the parent directory's .env.local file
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path, override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.logger import app_logger
from core.database import engine
from models.database_models import Base
from auto_migrate import run_auto_migrations

# API Routers
from api import auth, readings, journal, daily_draws, purchases, stripe_routes, gemini_routes, birth_profile

# API Routers

app = FastAPI(
    title="Gridpunk Arcana API",
    description="Backend API for Gridpunk Arcana",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# CORS middleware to allow React frontend connection
# @note allow_origins=["*"] with allow_credentials=True is INVALID per the
#       CORS spec — browsers silently reject it. We must use explicit origins.
cors_origins_env = os.environ.get("CORS_ORIGINS", "")
cors_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()] if cors_origins_env else []

# Default origins for local development
default_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

# Auto-include the production frontend URL if set
vite_app_url = os.environ.get("VITE_APP_URL", "")
if vite_app_url:
    cors_origins.append(vite_app_url.rstrip("/"))

# Merge defaults with any env-provided origins (deduplicated)
all_origins = list(dict.fromkeys(default_origins + cors_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

import asyncio

@app.on_event("startup")
async def startup_event():
    """
    Handle application startup events.
    Backgrounds database migrations to avoid blocking port binding and health checks.
    """
    if os.environ.get("RUN_AUTO_MIGRATIONS", "true").lower() == "true":
        # Run database initialization in a background thread to prevent blocking
        # the FastAPI event loop during startup (avoids 504/timeout on cloud providers).
        asyncio.create_task(asyncio.to_thread(run_auto_migrations_safe))
    
    app_logger.info("Gridpunk Arcana Backend startup initiated.")


def run_auto_migrations_safe():
    """
    Synchronous helper to run all database initialization scripts.
    """
    try:
        app_logger.info("Background database initialization started...")
        Base.metadata.create_all(bind=engine)
        run_auto_migrations()
        app_logger.info("Background database initialization completed successfully.")
    except Exception as e:
        app_logger.error(f"Critical failure during background initialization: {e}")

@app.get("/api")
@app.get("/api/")
@app.get("/")
async def root():
    app_logger.info("Root endpoint accessed.")
    return {"message": "Gridpunk Arcana API is online."}

@app.get("/api/health")
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Register Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(readings.router, prefix="/api/readings", tags=["Readings"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal Entries"])
app.include_router(daily_draws.router, prefix="/api/daily-draws", tags=["Daily Draws"])
app.include_router(purchases.router, prefix="/api/purchases", tags=["Purchases"])
app.include_router(stripe_routes.router, prefix="/api/stripe", tags=["Stripe"])
app.include_router(gemini_routes.router, prefix="/api/gemini", tags=["Gemini AI"])
app.include_router(birth_profile.router, prefix="/api/birth-profile", tags=["Birth Profile"])
