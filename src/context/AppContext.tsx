import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/apiService';
import decksData from '../data/decks.json';

const decks = decksData as Deck[];
import { JournalEntry, SavedReading, DrawnCard, DailyDrawRecord, UserProfile, Page, AchievementID, Deck, DailyInsights, DrawnDivinationCard } from '../types';

interface AppContextType {
  // Profile management
  activeProfile: UserProfile | null;
  isLoadingData: boolean;
  createProfile: (data: any) => Promise<void>;
  updateActiveProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  refetchProfile: () => Promise<void>;

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
  updateDailyDrawReflection: (date: string, reflection: string) => Promise<void>;

  // Computed / Ephemeral
  runeCastsToday: number;
  incrementRuneCast: () => void;

  activePage: Page;
  setPage: (page: Page) => void;

  isPremium: boolean;
  setIsPremium: (val: boolean) => void; // Kept for interface compat, but acts as local override or stub

  // Deck management
  activeDeckId: string;
  setActiveDeck: (deckId: string) => void;
  getCardImagePath: (cardId: string, deckId?: string) => string;
  getDeckBackPath: (deckId?: string) => string;
  decks: Deck[];
  unlockDeck: (deckId: string, price: number) => Promise<void>;

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
  const [activeDeckId, setActiveDeckId] = useState<string>(() => localStorage.getItem('activeDeckId') || 'giggling-glade');
  const [xpNotification, setXpNotification] = useState<{ amount: number; reason?: string } | null>(null);
  const [levelUpData, setLevelUpData] = useState<number | null>(null);
  const [runeCastsToday, setRuneCastsToday] = useState(0);

  const unlockDeck = async (deckId: string, price: number) => {
    if (!activeProfile) return;
    if (activeProfile.stardust < price) return;

    const updatedProfile = {
      ...activeProfile,
      stardust: activeProfile.stardust - price,
      ownedDeckIds: [...(activeProfile.ownedDeckIds || []), deckId]
    };

    await updateActiveProfile(updatedProfile);
    setXpNotification({ amount: 0, reason: `UNLOCKED: ${deckId.toUpperCase()}` });
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem('activeDeckId', activeDeckId);
  }, [activeDeckId]);

  // Deck metadata
  // No changes needed here, just removed the local require

  const getCardImagePath = useCallback((cardId: string, deckId?: string) => {
    const targetId = deckId || activeDeckId;
    const deckDef = decks.find((d: any) => d.id === targetId) || decks[0];
    const mapping = deckDef.mapping;
    if (!mapping) return `${(import.meta as any).env.VITE_ASSETS_BASE_URL || '/assets/cards/tarot'}/${cardId}.png`;

    const [suitPrefix, numStr] = cardId.split('_');
    const pattern = (mapping as any)[suitPrefix];
    if (!pattern) return `${(import.meta as any).env.VITE_ASSETS_BASE_URL || '/assets/cards/tarot'}/${cardId}.png`;

    // Handle {0} or {00} padding
    const paddedNum = pattern.includes('{00}')
      ? numStr.padStart(2, '0')
      : numStr;

    const ASSET_BASE = (import.meta as any).env.VITE_ASSETS_BASE_URL || '/assets/cards/tarot';
    const filename = pattern.replace(/{0+}/, paddedNum);
    return `${ASSET_BASE}/${deckDef.path}/${filename}.png`;
  }, [activeDeckId]);

  const getDeckBackPath = useCallback((deckId?: string) => {
    const targetId = deckId || activeDeckId;
    const deckDef = (decks as any[]).find((d: any) => d.id === targetId) || decks[0];
    const ASSET_BASE = '/assets/cards/tarot';

    // If it's a themed deck (not the standard default_tarot), show a card front instead of a generic back
    // This creates a "data leak" aesthetic as requested by the user.
    if (deckDef && deckDef.id !== 'default_tarot') {
      // Use the "The Fool" (maj_0) as the representative face for the deck back
      return getCardImagePath('maj_0', deckDef.id);
    }

    // Standard fallback for the default deck
    return `${ASSET_BASE}/back.png`;
  }, [activeDeckId, decks, getCardImagePath]);

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
        const profile = await db.getProfile();
        if (profile) {
          // Add default fields since API doesn't fully represent Appwrite's old structure yet
          const fullProfile = {
            ...profile,
            level: profile.level || 1,
            xp: profile.xp || 0,
            ownedDeckIds: profile.ownedDeckIds || ['default_tarot', 'ancient_runes'],
            unlockedAchievements: profile.unlockedAchievements || []
          };
          setActiveProfile(fullProfile as UserProfile);

          // Parallel fetch of sub-collections
          const [readings, journal, draws] = await Promise.all([
            db.getReadings(),
            db.getJournalEntries(),
            db.getDailyHistory()
          ]);

          const extractArray = (data: any): any[] => {
            if (Array.isArray(data)) return data;
            if (data && typeof data === 'object') {
              if (Array.isArray(data.documents)) return data.documents;
              if (Array.isArray(data.data)) return data.data;
              if (Array.isArray(data.items)) return data.items;
              if (Array.isArray(data.records)) return data.records;
            }
            return [];
          };

          const safeParse = (str: any) => {
            if (typeof str !== 'string') return str;
            try { return JSON.parse(str); } catch { return str; }
          };

          const parsedReadings = extractArray(readings).map(r => ({
            ...r,
            cards: safeParse(r.cards),
            userNotes: r.notes || r.userNotes || ''
          }));

          const parsedJournal = extractArray(journal).map(j => ({
            ...j,
            linked_card: safeParse(j.linked_card),
            linkedCard: safeParse(j.linked_card || j.linkedCard)
          }));

          setSavedReadings(parsedReadings as unknown as SavedReading[]);
          setJournalEntries(parsedJournal as unknown as JournalEntry[]);

          const parsedDraws = extractArray(draws).map(d => ({
            ...d,
            insights: safeParse(d.insights)
          }));
          setDailyDrawHistory(parsedDraws as unknown as DailyDrawRecord[]);
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

  const refetchProfile = async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const profile = await db.getProfile();
      if (profile) {
        const fullProfile = {
          ...profile,
          level: profile.level || 1,
          xp: profile.xp || 0,
          ownedDeckIds: profile.ownedDeckIds || ['default_tarot', 'ancient_runes'],
          unlockedAchievements: profile.unlockedAchievements || []
        };
        setActiveProfile(fullProfile as UserProfile);
      }
    } catch (error) {
      console.error("Failed to refetch user profile", error);
    } finally {
      setIsLoadingData(false);
    }
  };


  // --- Actions ---

  const createProfile = async (data: any) => {
    if (!user) return;
    const newProfile = {
      ...data,
    };
    await db.updateProfile(newProfile);
    const profile = await db.getProfile();
    setActiveProfile({
      ...profile,
      level: profile.level || 1,
      xp: profile.xp || 0,
      ownedDeckIds: profile.ownedDeckIds || ['default_tarot', 'ancient_runes'],
      unlockedAchievements: profile.unlockedAchievements || []
    } as UserProfile);
  };

  const updateActiveProfile = async (updates: Partial<UserProfile>) => {
    if (!activeProfile || !user) return;
    // Optimistic update
    setActiveProfile(prev => prev ? { ...prev, ...updates } : null);
    await db.updateProfile(updates);
  };

  const addJournalEntry = async (text: string, linkedCard?: DrawnCard) => {
    if (!user || !activeProfile) return;
    const entry = {
      text,
      linked_card: linkedCard ? JSON.stringify(linkedCard) : null,
    };

    // DB Call
    const res = await db.addJournalEntry(entry);

    // State Update
    const newEntryObj = { ...res, linkedCard } as any;
    setJournalEntries(prev => [newEntryObj, ...prev]);
  };

  const addSavedReading = async (reading: Omit<SavedReading, 'id' | 'date' | 'cards'> & { cards: DrawnDivinationCard[] }) => {
    if (!user || !activeProfile) return;

    // Serialize cards for DB
    const dbReading = {
      spread: reading.spreadType,
      question: reading.title,
      cards: JSON.stringify(reading.cards), // Array of strings converted back inside
      ai_summary: reading.aiSummary,
      notes: reading.userNotes,
    };

    const res = await db.saveReading(dbReading);

    const newLocalReading = {
      ...reading,
      id: res.id,
      date: res.created_at
    } as SavedReading;

    setSavedReadings(prev => [newLocalReading, ...prev]);
  };

  const updateSavedReadingNotes = async (readingId: string, notes: string) => {
    // Optimistic update
    setSavedReadings(prev => prev.map(r => r.id === readingId ? { ...r, userNotes: notes } : r));
    await db.updateReading(readingId, notes);
  };


  const addDailyDrawToHistory = async (draw: DrawnCard) => {
    if (!user || !activeProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const dbRecord = {
      date: todayStr,
      card: draw.card.name,
      is_rev: draw.isReversed
    };

    const res = await db.addDailyDraw(dbRecord);

    const newRecord: DailyDrawRecord = { id: res.id, date: todayStr, card: draw.card.name, isRev: draw.isReversed };
    setDailyDrawHistory(prev => [newRecord, ...prev]);
  };

  const updateDailyDrawInsights = async (date: string, insights: DailyInsights) => {
    // Determine the ID from history
    const record = dailyDrawHistory.find(r => r.date === date);
    if (!record || !record.id) {
      // Fallback to update by date if we implement it, but for now we expect ID
      setDailyDrawHistory(prev => prev.map(r => r.date === date ? { ...r, insights } : r));
      return;
    }

    setDailyDrawHistory(prev => prev.map(r => r.date === date ? { ...r, insights } : r));
    await db.updateDailyDraw(record.id, JSON.stringify(insights));
  };

  const updateDailyDrawReflection = async (date: string, reflection: string) => {
    const record = dailyDrawHistory.find(r => r.date === date);
    if (!record || !record.id) {
      setDailyDrawHistory(prev => prev.map(r => r.date === date ? { ...r, userReflection: reflection } : r));
      return;
    }

    setDailyDrawHistory(prev => prev.map(r => r.date === date ? { ...r, userReflection: reflection } : r));
    // Since we don't have a separate field in DB for now, we could put it in insights or just ignore for now. 
    // Actually our backend DailyDraw model HAS 'insights' as Text. 
    // Let's store userReflection inside the insights JSON for simplicity or update the DB schema.
    // User said "Persistence of notes/saved items". 
    // I will merge it into the insights JSON blob in the database.
    const currentInsights = record.insights || {} as DailyInsights;
    const updatedInsights = { ...currentInsights, userReflection: reflection };
    await db.updateDailyDraw(record.id, JSON.stringify(updatedInsights));
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
      ownedDeckIds: [...activeProfile.ownedDeckIds, deck.id]
    });
  };

  const awardDeck = async (deckId: string) => {
    if (!activeProfile || activeProfile.ownedDeckIds.includes(deckId)) return;
    await updateActiveProfile({
      ownedDeckIds: [...activeProfile.ownedDeckIds, deckId]
    });
  };

  const unlockAchievement = async (id: AchievementID) => {
    if (!activeProfile || activeProfile.unlockedAchievements.includes(id)) return;
    await updateActiveProfile({
      unlockedAchievements: [...activeProfile.unlockedAchievements, id]
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
    refetchProfile,

    journalEntries,
    addJournalEntry,

    savedReadings,
    addSavedReading,
    updateSavedReadingNotes,

    dailyDrawHistory,
    addDailyDrawToHistory,
    updateDailyDrawInsights,
    updateDailyDrawReflection,

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

    activeDeckId,
    setActiveDeck: setActiveDeckId,
    getCardImagePath,
    getDeckBackPath,
    decks,
    unlockDeck,

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