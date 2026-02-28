# Gridpunk Arcana - Project Structure

## Core Application
- `src/` - React frontend application
- `server/` - FastAPI backend (readings, profiles, journal)
- `functions/` - Serverless functions (Stripe, Gemini proxy)
- `public/` - Static assets (cards, images)

## Tarot Generation System
- `tarot_gen/` - Complete tarot card generation module
  - `cli.py` - Command-line interface
  - `generator.py` - Card generation orchestrator
  - `registry.py` - Provider registry with failover
  - `providers/` - Pluggable image providers
  - `data/` - Input decks, output cards, generation memory

## Configuration
- `.env` - All secrets and configuration (single source)
- `package.json` - Node.js dependencies
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

## Scripts & Tools
- `generate_tarot.py` - Launch tarot generation
- `scripts/` - Utility scripts for DB, assets, etc.

## Deployment
- `app-spec.yaml` / `do-app.yaml` - DigitalOcean config
- `appwrite.json` - Appwrite backend config
- `deploy_app.bat` - Deployment script

## Documentation
- `README.md` - Main project README
- `BEST_PRACTICES.md` - Development guidelines
- `DEPLOYMENT.md` - Deployment instructions
- `TAROT_DECK_CATALOG.md` - Deck documentation
- `tarot_gen/README.md` - Tarot generation docs
