import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import { Page } from './types';
import DailyPage from './pages/DailyPage';
import ReadingsPage from './pages/ReadingsPage';
import JournalPage from './pages/JournalPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import LandingPage from './pages/LandingPage';
import GuidePage from './pages/GuidePage';
import ShopPage from './pages/ShopPage';
import PricingPage from './pages/PricingPage';
import GrimoireHubPage from './pages/GrimoireHubPage';
import ErrorBoundary from './components/ErrorBoundary';


import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { checkAndUnlockAchievements } from './services/achievementService';

import NumerologyPage from './pages/NumerologyPage';
import SigilPage from './pages/SigilPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import BirthProfilePage from './pages/BirthProfilePage';
import AdminPage from './pages/AdminPage';
import LevelUpModal from './components/LevelUpModal';
import XpNotification from './components/XpNotification';
import ConstellationNav from './components/navigation/ConstellationNav';
import { motion, AnimatePresence } from 'framer-motion';


// Routing structure is now handled by react-router-dom
// VALID_PAGES array kept for reference if needed elsewhere, but hash logic removed.
const VALID_PAGES: Page[] = ['Daily', 'Readings', 'Journal', 'Guide', 'Shop', 'Pricing', 'Progress', 'Profile', 'Onboarding', 'Numerology', 'Sigil', 'Success', 'Cancel', 'BirthProfile', 'Admin', 'Grimoire'];


const AppContent: React.FC = () => {

  const {
    activeProfile,
    activePage,
    setPage,
    dailyDrawHistory,
    savedReadings,
    journalEntries,
    unlockAchievement,
    isLoadingData,
    levelUpData,
    setLevelUpData,
    xpNotification,
    setXpNotification
  } = useApp();
  const { user, isLoading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [showConstellation, setShowConstellation] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // ! Keep activePage state in sync with location for backward compatibility
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'daily';
    // Find matching Page type case-insensitively
    const matchedPage = VALID_PAGES.find(p => p.toLowerCase() === path.toLowerCase());
    if (matchedPage && matchedPage !== activePage) {
      setPage(matchedPage);
    }
  }, [location.pathname, activePage, setPage]);


  // ! Debounced achievement checking — 2 second delay to avoid running on every state change
  const achievementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeProfile) return;

    // * Clear any pending check
    if (achievementTimeoutRef.current) {
      clearTimeout(achievementTimeoutRef.current);
    }

    // * Schedule achievement check with 2s debounce
    achievementTimeoutRef.current = setTimeout(() => {
      const stateForAchievements = {
        unlockedAchievements: activeProfile.unlockedAchievements,
        dailyDrawHistory,
        savedReadings,
        journalEntries,
      };
      checkAndUnlockAchievements(stateForAchievements, unlockAchievement);
    }, 2000);

    return () => {
      if (achievementTimeoutRef.current) {
        clearTimeout(achievementTimeoutRef.current);
      }
    };
  }, [activeProfile, dailyDrawHistory, savedReadings, journalEntries, unlockAchievement]);

  if (isLoadingData || authLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#030407] text-purple-500">
        <div className="animate-pulse font-mono text-sm tracking-[0.3em]">INITIALIZING_UPLINK...</div>
      </div>
    );
  }

  // Not logged in at all, and hasn't clicked "Login" or "Signup"
  if (!user && !showAuth) {
    return <LandingPage onInitiate={setShowAuth} />;
  }

  // Either they clicked "Login"/"Signup" or they logged in but don't have a profile yet
  if (!activeProfile) {
    return (
      <OnboardingPage
        initialAuthMode={showAuth || 'signup'}
        onBackToLanding={!user ? () => setShowAuth(null) : undefined}
      />
    );
  }

  return (
    <div className="w-screen h-screen relative bg-void text-white overflow-hidden font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

      {/* Main Command Deck Viewport - Now Full Screen on all devices */}
      <main className="absolute inset-0 overflow-y-auto pb-32 md:pb-40 bg-void transition-all duration-500 ease-in-out">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <ErrorBoundary fallbackLabel={activePage}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/daily" replace />} />
                <Route path="/daily" element={<DailyPage />} />
                <Route path="/readings" element={<ReadingsPage setPage={setPage} />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/progress" element={<ProgressPage setPage={setPage} />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/guide" element={<GuidePage setPage={setPage} />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/numerology" element={<NumerologyPage />} />
                <Route path="/sigil" element={<SigilPage />} />
                <Route path="/success" element={<SuccessPage setPage={setPage} />} />
                <Route path="/cancel" element={<CancelPage setPage={setPage} />} />

                <Route path="/birthprofile" element={<BirthProfilePage />} />

                <Route path="/grimoire" element={<GrimoireHubPage />} />
                <Route path="/admin" element={<AdminPage setPage={setPage} />} />
                <Route path="*" element={<Navigate to="/daily" replace />} />
              </Routes>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>


      {/* Gamification Overlays */}
      {levelUpData && (
        <LevelUpModal
          newLevel={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {xpNotification && (
        <XpNotification
          amount={xpNotification.amount}
          reason={xpNotification.reason}
          onComplete={() => setXpNotification(null)}
        />
      )}

      {/* Floating test toggle for ConstellationNav */}
      <button
        onClick={() => setShowConstellation(!showConstellation)}
        className="fixed bottom-4 right-4 z-[9999] bg-purple-600/80 hover:bg-purple-500 text-white font-mono text-xs px-4 py-2 rounded-full border border-purple-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(138,43,226,0.5)] transition-all"
      >
        {showConstellation ? '[ CLOSE_NAV ]' : '[ TEST_CONSTELLATION ]'}
      </button>

      {/* The Constellation Nav Overlay */}
      {showConstellation && (
        <div className="fixed inset-0 z-[9000]">
          <ConstellationNav
            activePage={activePage}
            setPage={(p) => {
              setPage(p);
              navigate(`/${p.toLowerCase()}`);
              setShowConstellation(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;