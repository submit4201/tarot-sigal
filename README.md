# Gridpunk Arcana

<div align="center">
  <img src="/public/favicon.svg" width="120" height="auto" alt="Gridpunk Icon" />
  <h1>Gridpunk Arcana</h1>
  <p>A Cyber-Shamanic Tarot & Numerology Experience</p>
  <p><i>"The ether is always listening."</i></p>
</div>

---

## 🔮 Overview

**Gridpunk Arcana** is a next-generation divination platform that merges ancient esoteric wisdom with cyberpunk aesthetics. It provides a highly immersive, interactive experience for Tarot readings, Numerology analysis, and Daily Insights.

Developed with **React**, **TypeScript**, and **Google Gemini AI**, it features real-time 3D card physics, haptic feedback, and procedural "cyber-mystical" interpretations.

---

## ✨ Key Features

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

- **`/src`**: Source code root.
    - **`/components`**: Reusable UI components (`TarotCard`, `CosmicBlueprintDisplay`, `CardBack`, etc.).
    - **`/pages`**: Main route views (`ReadingsPage`, `DailyPage`, `OnboardingPage`).
    -   **`/services`**: Business logic and API integrations (`tarotService`, `geminiService`).
    -   **`/hooks`**: Custom React hooks (`useHaptic`, `useTilt`).
    -   **`/context`**: Global state management (`AppContext`).
    -   **`/types`**: TypeScript interfaces and type definitions.
    -   **`/utils`**: Helper functions (`exportUtils`, `numerologyUtils`).
-   **`/public`**: Static assets.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

3. **Run Development Server**:
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
