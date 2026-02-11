import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/appwriteService';
import { JournalEntry, SavedReading, DrawnCard, DailyDrawRecord, UserProfile, Page, AchievementID, Deck, DailyInsights, DrawnDivinationCard } from '../types';

interface AppContextType {
  // Profile management
  activeProfile: UserProfile | null;
  isLoadingData: boolean;
  createProfile: (data: any) => Promise<void>;
  updateActiveProfile: (profileData: Partial<UserProfile>) => Promise<void>;

  purchaseDeck: (deck: Deck) => Promise<void>;
  awardDeck: (deckId: string) => Promise<void>;
  addStardust: (amount: number) => Promise<void>;
  addXp: (amount: number, reason?: string) => Promise<void>;
  unlockAchievement: (id: AchievementID) => Promise<void>;

  // Data
  journalEntries: JournalEntry[];
  addJournalEntry: (text: string, linkedCard?: DrawnCard) => Promise<void>;

  savedReadings: SavedReading[];
  addSavedReading: (reading: Omit<SavedReading, 'id' | 'date' | 'cards'> & { cards: DrawnDivinationCard[] }) => Promise<void>;
  updateSavedReadingNotes: (readingId: string, notes: string) => Promise<void>;

  dailyDrawHistory: DailyDrawRecord[];
  addDailyDrawToHistory: (draw: DrawnCard) => Promise<void>;
  updateDailyDrawInsights: (date: string, insights: DailyInsights) => Promise<void>;

  // Computed / Ephemeral
  runeCastsToday: number;
  incrementRuneCast: () => void;

  activePage: Page;
  setPage: (page: Page) => void;

  isPremium: boolean;
  setIsPremium: (val: boolean) => void; // Kept for interface compat, but acts as local override or stub

  // UI Notifs
  xpNotification: { amount: number; reason?: string } | null;
  setXpNotification: (notification: { amount: number; reason?: string } | null) => void;
  levelUpData: number | null;
  setLevelUpData: (level: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [dailyDrawHistory, setDailyDrawHistory] = useState<DailyDrawRecord[]>([]);
  const [activePage, setActivePage] = useState<Page>('Daily');
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Local UI state
  const [xpNotification, setXpNotification] = useState<{ amount: number; reason?: string } | null>(null);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);
  const [runeCastsToday, setRuneCastsToday] = useState(0);

  // Derived state
  const isPremium = activeProfile?.isPremium || false;

  // --- Data Loading ---
  useEffect(() => {
    if (!user) {
      setActiveProfile(null);
      setJournalEntries([]);
      setSavedReadings([]);
      setDailyDrawHistory([]);
      return;
    }

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const profile = await db.getProfile(user.$id);
        if (profile) {
          setActiveProfile(profile as unknown as UserProfile);

          // Parallel fetch of sub-collections
          const [readings, journal, draws] = await Promise.all([
            db.getReadings(user.$id),
            db.getJournalEntries(user.$id),
            db.getDailyHistory(user.$id)
          ]);

          setSavedReadings(readings.documents as unknown as SavedReading[]);
          setJournalEntries(journal.documents as unknown as JournalEntry[]);
          setDailyDrawHistory(draws.documents as unknown as DailyDrawRecord[]);
        } else {
          // No profile yet - OnboardingPage will handle creation
          setActiveProfile(null);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [user]);


  // --- Actions ---

  const createProfile = async (data: any) => {
    if (!user) return;
    const newProfile = {
      ...data,
      userId: user.$id,
      level: 1,
      xp: 0,
      stardust: 100, // Starter dust
      decks: ['default_tarot', 'ancient_runes'],
      achievements: [],
      isPremium: false,
      subTier: 'free',
      subExpiry: new Date().toISOString(),
    };
    const response = await db.createProfile(newProfile);
    setActiveProfile(response as unknown as UserProfile);
  };

  const updateActiveProfile = async (updates: Partial<UserProfile>) => {
    if (!activeProfile || !user) return;
    // Optimistic update
    setActiveProfile(prev => prev ? { ...prev, ...updates } : null);
    await db.updateProfile(activeProfile.id, updates);
  };

  const addJournalEntry = async (text: string, linkedCard?: DrawnCard) => {
    if (!user || !activeProfile) return;
    const entry = {
      userId: user.$id,
      profileId: activeProfile.id,
      text,
      linkedCard: linkedCard ? JSON.stringify(linkedCard) : null,
      date: new Date().toISOString()
    };

    // DB Call
    const res = await db.addJournalEntry(entry);

    // State Update
    const newEntryObj = { ...entry, id: res.$id, linkedCard } as any;
    setJournalEntries(prev => [newEntryObj, ...prev]);
  };

  const addSavedReading = async (reading: Omit<SavedReading, 'id' | 'date' | 'cards'> & { cards: DrawnDivinationCard[] }) => {
    if (!user || !activeProfile) return;

    // Serialize cards for DB
    const dbReading = {
      userId: user.$id,
      profileId: activeProfile.id,
      ...reading,
      cards: reading.cards.map(c => JSON.stringify(c)), // Array of strings
      date: new Date().toISOString()
    };

    const res = await db.saveReading(dbReading);

    const newLocalReading = {
      ...reading,
      id: res.$id,
      date: dbReading.date
    } as SavedReading;

    setSavedReadings(prev => [newLocalReading, ...prev]);
  };

  const updateSavedReadingNotes = async (readingId: string, notes: string) => {
    // TODO: Implement update on DB
    setSavedReadings(prev => prev.map(r => r.id === readingId ? { ...r, userNotes: notes } : r));
  };


  const addDailyDrawToHistory = async (draw: DrawnCard) => {
    if (!user || !activeProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const dbRecord = {
      userId: user.$id,
      profileId: activeProfile.id,
      date: todayStr,
      drawnCard: JSON.stringify(draw)
    };

    await db.addDailyDraw(dbRecord);

    const newRecord: DailyDrawRecord = { date: todayStr, card: draw.card.name, isRev: draw.isReversed };
    setDailyDrawHistory(prev => [newRecord, ...prev]);
  };

  const updateDailyDrawInsights = async (date: string, insights: DailyInsights) => {
    // TODO: Update specific daily draw record in DB
    setDailyDrawHistory(prev => prev.map(r => r.date === date ? { ...r, insights } : r));
  };

  // --- Gamification Logic (XP/Stardust) ---

  const addXp = async (amount: number, reason?: string) => {
    if (!activeProfile) return;
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

    if (leveledUp) setLevelUpData(newLevel);
    newStardust += Math.ceil(amount / 5);

    await updateActiveProfile({ xp: newXp, level: newLevel, stardust: newStardust });
  };

  const addStardust = async (amount: number) => {
    if (!activeProfile) return;
    await updateActiveProfile({ stardust: activeProfile.stardust + amount });
  };

  const purchaseDeck = async (deck: Deck) => {
    if (!activeProfile) return;
    if (activeProfile.stardust < deck.price) {
      alert('Not enough Stardust');
      return;
    }
    await updateActiveProfile({
      stardust: activeProfile.stardust - deck.price,
      decks: [...activeProfile.decks, deck.id]
    });
  };

  const awardDeck = async (deckId: string) => {
    if (!activeProfile || activeProfile.decks.includes(deckId)) return;
    await updateActiveProfile({
      decks: [...activeProfile.decks, deckId]
    });
  };

  const unlockAchievement = async (id: AchievementID) => {
    if (!activeProfile || activeProfile.achievements.includes(id)) return;
    await updateActiveProfile({
      achievements: [...activeProfile.achievements, id]
    });
  };

  const incrementRuneCast = () => setRuneCastsToday(c => c + 1);

  // Stub for now - logic moved to Appwrite subscriptions
  const setIsPremium = (val: boolean) => {
    if (activeProfile) updateActiveProfile({ isPremium: val });
  };


  const value: AppContextType = {
    activeProfile,
    isLoadingData,
    createProfile,
    updateActiveProfile,

    journalEntries,
    addJournalEntry,

    savedReadings,
    addSavedReading,
    updateSavedReadingNotes,

    dailyDrawHistory,
    addDailyDrawToHistory,
    updateDailyDrawInsights,

    runeCastsToday,
    incrementRuneCast,

    activePage,
    setPage: setActivePage,

    purchaseDeck,
    awardDeck,
    addStardust,
    addXp,
    unlockAchievement,

    isPremium,
    setIsPremium,

    xpNotification,
    setXpNotification,
    levelUpData,
    setLevelUpData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};