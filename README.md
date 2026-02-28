# Gridpunk Arcana

<div align="center">
  <img src="/public/favicon.svg" width="120" height="auto" alt="Gridpunk Icon" />
  <h1>Gridpunk Arcana (Sigil)</h1>
  <p>A Cyber-Shamanic Tarot & Astrology Experience</p>
  <p><i>"The ether is always listening."</i></p>
</div>

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install
pip install -r server/requirements.txt

# Run development
npm run dev              # Frontend (Vite + React)
cd server && python main.py    # Backend (FastAPI)

# Generate tarot card images
python generate_tarot.py --batch --sequential
```

## 📁 Project Structure

```
gridpunk-arcana/
├── src/              # React frontend application
├── server/           # FastAPI backend (readings, profiles, journal)
├── functions/        # Serverless functions (Stripe, Gemini)
├── public/           # Static assets (cards, images)
├── tarot_gen/        # Tarot card generation module
├── scripts/          # Utility scripts
├── docs/             # 📚 All documentation
├── config/           # ⚙️ Configuration files
├── deploy/           # 🚀 Deployment scripts
└── .env              # Environment variables
```

## 🔮 Key Features

### Immersive Tarot Readings
- **Fan-Out Selection**: Choose cards from a full 78-card arc using a physics-based fan interface.
- **Charging Ritual**: Use motion (mouse/touch) to "charge" the deck before drawing, with visual feedback.
- **3D Parallax & Tilt**: Cards react to cursor movement for a tactile feel (via `useTilt`).
- **Haptic Feedback**: Vibration integration for mobile devices (via `useHaptic`).

### Deep AI Analysis
- **"Cyber-Shamanic" Insights**: AI-generated readings that blend mystical tradition with sci-fi terminology.
- **True Randomness**: Daily draws use cryptographic-strength randomness for authentic synchronicity.
- **Cosmic Blueprint**: Comprehensive numerology calculation (Life Path, Pinnacles, Challenges).
- **Shadow Signals**: Identifies repressed or hidden aspects in every reading.

### Progression System
- **XP & Leveling**: Earn experience for daily draws and readings.
- **Unlockable Decks**: Use "Stardust" to unlock new card back designs and decks.

### Tech Integration
- **Neural-Link Export**: Copy formatted readings to clipboard for sharing.
- **TTS Narration**: Optional spoken audio for reading syntheses.

---

## 📂 Project Structure

- **`/src`**: React Frontend Source Code.

## 📚 Documentation

- **[Best Practices](docs/BEST_PRACTICES.md)** - Development guidelines & architecture
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Tarot Deck Catalog](docs/TAROT_DECK_CATALOG.md)** - Available deck themes
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Detailed file organization
- **[Tarot Generation](tarot_gen/README.md)** - Card generation system
- **[Rules & Standards](docs/RULES.md)** - Code standards and expectations

---

## 🛠 Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Python, FastAPI, SQLite  
**AI:** Google Gemini, OpenRouter  
**Infrastructure:** Appwrite, DigitalOcean Spaces  
**Payments:** Stripe

---

## 🔑 Environment Setup

Create `.env` file with:
```env
# Frontend
VITE_GEMINI_API_KEY=your_key
VITE_APPWRITE_ENDPOINT=your_endpoint
VITE_APPWRITE_PROJECT_ID=your_project

# Backend
DATABASE_URL=sqlite:///./gridpunk.db
JWT_SECRET_KEY=your_secret

# Payments
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_secret

# Image Generation
IMAGE_PROVIDER=pollinations,aihorde
POLLINATIONS_API_KEY=your_key
AI_HORDE_API_KEY=your_key
```

---

## 📄 License

Proprietary | **Gridpunk Studios** | All Rights Reserved


   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, Vanilla CSS (glassmorphism effects)
-   **AI**: Google Gemini Pro & Flash
-   **State**: React Context API
-   **Icons**: Lucide React

---

*Verified by the Technomancers Guild.*
