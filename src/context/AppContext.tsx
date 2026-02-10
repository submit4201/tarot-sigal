import React, { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { JournalEntry, SavedReading, DrawnCard, DailyDrawRecord, UserProfile, Page, AchievementID, Deck, DailyInsights, DrawnDivinationCard } from '../types';

// New interfaces for multi-profile data structure
interface ProfileData {
  journalEntries: JournalEntry[];
  savedReadings: SavedReading[];
  dailyDrawHistory: DailyDrawRecord[];
  runeCasts: { date: string; count: number };
}

interface AppData {
  profiles: UserProfile[];
  activeProfileId: string | null;
  dataByProfile: Record<string, ProfileData>;
  isPremium: boolean;
  activePage: Page;
}

interface AppContextType {
  // Profile management
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  addProfile: (profileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'>) => void;
  updateActiveProfile: (profileData: UserProfile) => void;
  switchProfile: (profileId: string) => void;
  deleteProfile: (profileId: string) => void;
  purchaseDeck: (deck: Deck) => void;
  awardDeck: (deckId: string) => void;
  addStardust: (amount: number) => void;

  // Data for the active profile
  journalEntries: JournalEntry[];
  addJournalEntry: (text: string, linkedCard?: DrawnCard) => void;
  savedReadings: SavedReading[];
  addSavedReading: (reading: Omit<SavedReading, 'id' | 'date' | 'cards'> & { cards: DrawnDivinationCard[] }) => void; // Updated type for cards
  updateSavedReadingNotes: (readingId: string, notes: string) => void;
  dailyDrawHistory: DailyDrawRecord[];
  addDailyDrawToHistory: (draw: DrawnCard) => void;
  updateDailyDrawInsights: (date: string, insights: DailyInsights) => void;
  runeCastsToday: number;
  incrementRuneCast: () => void;
  addXp: (amount: number, reason?: string) => void;
  unlockAchievement: (id: AchievementID) => void;

  // Global app state
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
  activePage: Page;
  setPage: (page: Page) => void;

  // Ephemeral UI state
  xpNotification: { amount: number; reason?: string } | null;
  setXpNotification: (notification: { amount: number; reason?: string } | null) => void;
  levelUpData: number | null;
  setLevelUpData: (level: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const createNewProfileData = (): ProfileData => ({
  journalEntries: [],
  savedReadings: [],
  dailyDrawHistory: [],
  runeCasts: { date: '', count: 0 },
});

const initialAppData: AppData = {
  profiles: [],
  activeProfileId: null,
  dataByProfile: {},
  isPremium: false,
  activePage: 'Daily',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useLocalStorage<AppData>('gridpunkArcanaData_v2', initialAppData);

  // One-time migration from old single-profile structure
  useEffect(() => {
    const oldProfileRaw = window.localStorage.getItem('userProfile');
    const hasBeenMigrated = window.localStorage.getItem('hasMigratedToV2');

    if (oldProfileRaw && !hasBeenMigrated) {
      console.log("Old data found, migrating to multi-profile structure...");
      const oldProfile = JSON.parse(oldProfileRaw);
      const newId = `profile-${Date.now()}`;

      const migratedProfile: UserProfile = {
        ...oldProfile,
        id: newId,
        stardust: 100, // Grant starting currency
        ownedDeckIds: ['default_tarot'], // Grant default deck
      };

      const oldJournal = JSON.parse(window.localStorage.getItem('journalEntries') || '[]');
      const oldReadings = JSON.parse(window.localStorage.getItem('savedReadings') || '[]');
      const oldHistory = JSON.parse(window.localStorage.getItem('dailyDrawHistory') || '[]');
      const oldRunes = JSON.parse(window.localStorage.getItem('runeCasts') || '{ "date": "", "count": 0 }');

      const migratedData: AppData = {
        profiles: [migratedProfile],
        activeProfileId: newId,
        dataByProfile: {
          [newId]: {
            journalEntries: oldJournal,
            savedReadings: oldReadings,
            dailyDrawHistory: oldHistory,
            runeCasts: oldRunes,
          }
        },
        isPremium: JSON.parse(window.localStorage.getItem('isPremium') || 'false'),
        activePage: JSON.parse(window.localStorage.getItem('activePage') || '"Daily"'),
      };

      setAppData(migratedData);

      ['userProfile', 'journalEntries', 'savedReadings', 'dailyDrawHistory', 'runeCasts', 'isOnboarded', 'isPremium', 'activePage'].forEach(key => window.localStorage.removeItem(key));
      window.localStorage.setItem('hasMigratedToV2', 'true');
      console.log("Migration complete.");
    }
  }, [setAppData]);

  const activeProfile = useMemo(() => {
    return appData.profiles.find(p => p.id === appData.activeProfileId) || null;
  }, [appData.profiles, appData.activeProfileId]);

  const activeProfileData = useMemo(() => {
    if (!appData.activeProfileId || !appData.dataByProfile[appData.activeProfileId]) {
      return createNewProfileData();
    }
    return appData.dataByProfile[appData.activeProfileId];
  }, [appData.activeProfileId, appData.dataByProfile]);

  const setPage = (page: Page) => setAppData(prev => ({ ...prev, activePage: page }));
  const setIsPremium = (isPremium: boolean) => setAppData(prev => ({ ...prev, isPremium }));

  const switchProfile = (profileId: string) => {
    if (appData.profiles.some(p => p.id === profileId)) {
      setAppData(prev => ({ ...prev, activeProfileId: profileId, activePage: 'Daily' }));
    }
  };

  const addProfile = (profileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'>) => {
    const newId = `profile-${Date.now()}`;
    const newProfile: UserProfile = {
      ...profileData,
      id: newId,
      level: 1,
      xp: 0,
      stardust: 100,
      ownedDeckIds: ['default_tarot', 'ancient_runes'], // Grant default tarot and runes
      unlockedAchievements: [],
    };
    setAppData(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
      dataByProfile: {
        ...prev.dataByProfile,
        [newId]: createNewProfileData(),
      },
      activeProfileId: newId,
    }));
  };

  const updateActiveProfile = (profileData: UserProfile) => {
    if (!activeProfile) return;
    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? profileData : p),
    }));
  };

  const deleteProfile = (profileId: string) => {
    if (appData.profiles.length <= 1) {
      alert("Cannot delete the last profile.");
      return;
    }
    setAppData(prev => {
      const newProfiles = prev.profiles.filter(p => p.id !== profileId);
      const newDataByProfile = { ...prev.dataByProfile };
      delete newDataByProfile[profileId];
      const newActiveId = (prev.activeProfileId === profileId) ? (newProfiles[0]?.id || null) : prev.activeProfileId;
      return {
        ...prev,
        profiles: newProfiles,
        dataByProfile: newDataByProfile,
        activeProfileId: newActiveId,
      };
    });
  };

  const updateActiveProfileData = (updater: (currentData: ProfileData) => ProfileData) => {
    if (!appData.activeProfileId) return;
    const activeId = appData.activeProfileId;
    setAppData(prev => {
      const currentData = prev.dataByProfile[activeId] || createNewProfileData();
      return {
        ...prev,
        dataByProfile: {
          ...prev.dataByProfile,
          [activeId]: updater(currentData)
        }
      };
    });
  };

  const addSavedReading = (reading: Omit<SavedReading, 'id' | 'date'> & { cards: DrawnDivinationCard[] }) => {
    const newReading: SavedReading = {
      ...reading,
      id: `reading-${Date.now()}`,
      date: new Date().toISOString(),
    };
    updateActiveProfileData(currentData => ({
      ...currentData,
      savedReadings: [newReading, ...currentData.savedReadings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }));
  };

  const addJournalEntry = (text: string, linkedCard?: DrawnCard) => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      text,
      linkedCard,
    };
    updateActiveProfileData(currentData => ({
      ...currentData,
      journalEntries: [newEntry, ...currentData.journalEntries]
    }));
  };

  const updateSavedReadingNotes = (readingId: string, notes: string) => {
    updateActiveProfileData(currentData => ({
      ...currentData,
      savedReadings: currentData.savedReadings.map(r => r.id === readingId ? { ...r, userNotes: notes } : r),
    }));
  };

  const addDailyDrawToHistory = (draw: DrawnCard) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: DailyDrawRecord = { date: todayStr, drawnCard: draw };
    updateActiveProfileData(currentData => ({
      ...currentData,
      dailyDrawHistory: [newRecord, ...currentData.dailyDrawHistory.filter(r => r.date !== todayStr)],
    }));
  };

  const updateDailyDrawInsights = (date: string, insights: DailyInsights) => {
    updateActiveProfileData(currentData => ({
      ...currentData,
      dailyDrawHistory: currentData.dailyDrawHistory.map(r => r.date === date ? { ...r, insights } : r)
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const runeCastsToday = activeProfileData.runeCasts.date === todayStr ? activeProfileData.runeCasts.count : 0;

  const incrementRuneCast = () => {
    const currentCount = activeProfileData.runeCasts.date === todayStr ? activeProfileData.runeCasts.count : 0;
    updateActiveProfileData(currentData => ({ ...currentData, runeCasts: { date: todayStr, count: currentCount + 1 } }));
  };

  // Ephemeral UI state
  const [xpNotification, setXpNotification] = React.useState<{ amount: number; reason?: string } | null>(null);
  const [levelUpData, setLevelUpData] = React.useState<number | null>(null);

  const unlockAchievement = (id: AchievementID) => {
    if (!activeProfile || activeProfile.unlockedAchievements.includes(id)) return;
    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? { ...p, unlockedAchievements: [...p.unlockedAchievements, id] } : p)
    }));
  };

  const purchaseDeck = (deck: Deck) => {
    if (!activeProfile) return;
    if (activeProfile.stardust < deck.price) {
      alert("Not enough Stardust!");
      return;
    }
    if (activeProfile.ownedDeckIds.includes(deck.id)) {
      alert("You already own this deck.");
      return;
    }
    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? { ...p, stardust: p.stardust - deck.price, ownedDeckIds: [...p.ownedDeckIds, deck.id] } : p)
    }));
  };

  const awardDeck = (deckId: string) => {
    if (!activeProfile || activeProfile.ownedDeckIds.includes(deckId)) return;
    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? { ...p, ownedDeckIds: [...p.ownedDeckIds, deckId] } : p)
    }));
  };

  const addStardust = (amount: number) => {
    if (!activeProfile) return;
    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? { ...p, stardust: p.stardust + amount } : p)
    }));
  };

  const addXp = (amount: number, reason?: string) => {
    if (!activeProfile) return;

    // Trigger notification
    setXpNotification({ amount, reason });

    let newXp = activeProfile.xp + amount;
    let newLevel = activeProfile.level;
    let xpForNextLevel = Math.round(500 * Math.pow(1.5, newLevel - 1));
    let newStardust = activeProfile.stardust;

    let leveledUp = false;
    while (newXp >= xpForNextLevel) {
      newXp -= xpForNextLevel;
      newLevel++;
      newStardust += newLevel * 10;
      xpForNextLevel = Math.round(500 * Math.pow(1.5, newLevel - 1));
      leveledUp = true;
    }

    if (leveledUp) {
      setLevelUpData(newLevel);
    }

    newStardust += Math.ceil(amount / 5);

    setAppData(prev => ({
      ...prev,
      profiles: prev.profiles.map(p => p.id === activeProfile.id ? { ...p, xp: newXp, level: newLevel, stardust: newStardust } : p)
    }));
  };

  const value: AppContextType = {
    profiles: appData.profiles,
    activeProfile,
    addProfile,
    updateActiveProfile,
    switchProfile,
    deleteProfile,
    purchaseDeck,
    awardDeck,
    addStardust,
    journalEntries: activeProfileData.journalEntries,
    addJournalEntry,
    savedReadings: activeProfileData.savedReadings,
    addSavedReading,
    updateSavedReadingNotes,
    dailyDrawHistory: activeProfileData.dailyDrawHistory,
    addDailyDrawToHistory,
    updateDailyDrawInsights,
    runeCastsToday,
    incrementRuneCast,
    addXp,
    unlockAchievement,
    isPremium: appData.isPremium,
    setIsPremium,
    activePage: appData.activePage,
    setPage,
    // Ephemeral state
    xpNotification,
    setXpNotification,
    levelUpData,
    setLevelUpData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};