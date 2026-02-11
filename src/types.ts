export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Arcana = 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles';
export type DeckType = 'tarot' | 'runes' | 'oracle' | 'angel';
export type Page = 'Daily' | 'Readings' | 'Journal' | 'Progress' | 'Profile' | 'Onboarding' | 'Guide' | 'Shop' | 'Numerology' | 'Sigil';
export type AstrologicalSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces' | 'None';

export interface DivinationCard {
  id: string;
  name: string;
  keywords: string[];
  meaning: string;
}

export interface TarotCard extends DivinationCard {
  arcana: Arcana;
  reversedMeaning: string;
  microQuest: string;
  element: Element;
}

export interface Rune extends DivinationCard {
  symbol: string;
  reversible: boolean;
}

export interface AngelCard extends DivinationCard { }

export interface OracleCard extends DivinationCard { }

export type AnyCard = TarotCard | Rune | AngelCard | OracleCard;

export interface Deck {
  id: string;
  name: string;
  type: DeckType;
  description: string;
  price: number;
  cards: AnyCard[];
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
}

export interface DrawnDivinationCard {
  card: AnyCard;
  isReversed?: boolean;
  // for runes
  x?: number;
  y?: number;
  rotation?: number;
  clusterId?: number;
  proximity?: 'inner' | 'middle' | 'outer';
  interpretation?: string; // AI interpretation for individual card in a specific position
  keywordAnalysis?: string; // AI-generated keyword-level analysis for deep dive
  symbolicInterpretation?: string; // AI-generated symbolic analysis for deep dive
  esotericInterpretation?: string; // Deep dive esoteric analysis
}

export type SpreadType =
  | '3-card'
  | 'mind-body-spirit'
  | 'career-path'
  | 'the-great-work'
  | 'relationship'
  | 'decision-making'
  | 'celtic-cross'
  | 'single-rune'
  | 'three-rune-norn'
  | 'five-rune-cross'
  | 'nine-rune-grid'
  | 'full-cast'
  | 'animal-spirit-guide'
  | 'sacred-geometry'
  | 'pentagram'
  | 'year-ahead'
  | 'binary-star'
  | 'chakra-alignment'
  | 'lunar-cycle'
  | 'partnership'
  | 'shadow-work';

export interface UserProfile {
  id: string;
  givenName: string;
  currentName: string;
  mothersMaidenName: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthPlace: string;
  astrologicalSign: AstrologicalSign;
  birthConstellation: string;
  readingStyle: 'mystical' | 'practical' | 'psychological';
  readingFocus: 'general' | 'love' | 'career' | 'growth';
  level: number;
  xp: number;
  stardust: number;
  ownedDeckIds: string[];
  unlockedAchievements: AchievementID[];
  subscriptionTier: 'free' | 'premium' | 'vip';
  subscriptionExpiry?: string;
  isPremium: boolean;
}

export interface CardReadingOutput {
  coreMessage: string;
  mysticalInsight: string;
  todaysAction: string;
  reflectionQuestion: string;
}

export interface DailyInsights {
  horoscope: string;
  cardReading: CardReadingOutput;
  combinedGuidance: string;
  patternRecognition: string;
  numerologyInsight: string;
  visionSigil?: string; // Base64 or URL for generated image
}

export interface DailyDrawRecord {
  date: string; // YYYY-MM-DD
  card: string; // Was cardName
  isRev: boolean; // Was isReversed
  insights?: DailyInsights;
}

export interface SavedReading {
  id: string;
  date: string;
  spread: SpreadType; // Was spreadType
  deckType: DeckType;
  deckId: string;
  positions: string[];
  cards: DrawnDivinationCard[];
  title: string;
  aiSummary: string;
  userNotes: string;
  // * Free tier enhancements
  practicalActions?: string[];
  shadowMessage?: string;
  // * Premium tier enhancements
  cardRelationships?: string;
  elementalDignity?: string;
  numerologyThreads?: string;
  spokenNarrative?: string;
  // * Pre-reading intent (Premium)
  readingIntent?: string;
  refinedQuestion?: string;
  reflectionQuestion?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  linkedCard?: string; // Storing card ID/Name string in DB? User said linkedCard.
}

export interface CosmicNumber {
  number: number;
  theme: string;
  description: string;
}
export interface Pinnacle extends CosmicNumber {
  ageRange: string;
}
export interface Challenge extends CosmicNumber {
  ageRange: string;
}
export interface CosmicBlueprint {
  lifePath: CosmicNumber;
  destiny: CosmicNumber;
  soulUrge: CosmicNumber;
  personality: CosmicNumber;
  heritage: CosmicNumber;
  currentVibe: CosmicNumber;
  birthday: CosmicNumber;
  maturity: CosmicNumber;
  pinnacles: Pinnacle[];
  challenges: Challenge[];
  karmicDebts: number[];
}

export type AchievementID =
  | 'first_draw'
  | 'first_reading'
  | 'scribe_1'
  | 'scribe_10'
  | 'historian_5'
  | 'streak_3'
  | 'streak_7'
  | 'major_arcana_initiate'
  | 'major_arcana_master'
  | 'wands_adept'
  | 'cups_adept'
  | 'swords_adept'
  | 'pentacles_adept'
  | 'rune_caster_1'
  | 'rune_caster_5';