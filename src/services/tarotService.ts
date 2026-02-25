
import { TAROT_DECK, NUMEROLOGY_MEANINGS, RUNE_DECK } from '../constants';
import { DrawnCard, TarotCard, SpreadType, DivinationCard, DrawnDivinationCard, Rune, UserProfile } from '../types';
import { getLocalDateString } from '../utils/dateUtils';

// Improved Seeded Random using bitwise unsigned logic to prevent JS sign-bit issues
export class SeededRandom {
  private seed: number;
  private readonly a = 1664525;
  private readonly c = 1013904223;
  private readonly m = 2 ** 32;

  constructor(seed: number) {
    // Force the seed to an unsigned 32-bit integer
    this.seed = seed >>> 0;
  }

  nextFloat(): number {
    // Ensure unsigned multiplication and addition
    this.seed = (this.a * this.seed + this.c) >>> 0;
    return this.seed / this.m;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min)) + min;
  }
}

/**
 * Robust string hashing (DJB2 based) to ensure high dispersion 
 * for similar date strings.
 */
export const createNumericSeed = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
};

// Reduces a number to a single digit or a master number (11, 22, 33)
export const reduceNumber = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }
  if (num < 10) {
    return num;
  }
  let sum = 0;
  String(num).split('').forEach(digit => {
    sum += parseInt(digit, 10);
  });
  if (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    return reduceNumber(sum);
  }
  return sum;
};

export const getDailySeed = (profile: UserProfile, date: Date): number => {
  const dateISO = getLocalDateString(date);
  // Add an application-level salt to further jitter the hash
  const seedString = `ARCANA_v2.5|${profile.givenName}|${profile.birthDate}|${dateISO}`;
  return createNumericSeed(seedString);
};

export const drawDailyCard = (seed: number): DrawnCard => {
  const random = new SeededRandom(seed);

  // Warm-up: Skip the first 10 numbers to allow the LCG to stabilize
  for (let i = 0; i < 10; i++) {
    random.nextFloat();
  }

  const cardIndex = random.nextInt(0, TAROT_DECK.length);
  const isReversed = random.nextFloat() < 0.3;
  return {
    card: TAROT_DECK[cardIndex],
    isReversed,
  };
};

export const getShuffledPreparedDeck = (deck: DivinationCard[], seed: number): DrawnDivinationCard[] => {
  const random = new SeededRandom(seed);

  // Warm-up
  for (let i = 0; i < 5; i++) random.nextFloat();

  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = random.nextInt(0, i + 1);
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }

  return shuffledDeck.map(card => ({
    card,
    isReversed: 'arcana' in card ? random.nextFloat() < 0.3 : undefined
  }));
};

export const castRunes = (count: number): DrawnDivinationCard[] => {
  const shuffledRunes = [...RUNE_DECK].sort(() => Math.random() - 0.5);
  const castedSelection = shuffledRunes.slice(0, count);

  let runesWithPositions = castedSelection.map(card => {
    const rune = card as Rune;
    return {
      card: rune,
      isReversed: rune.reversible ? Math.random() < 0.5 : false,
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10,
      rotation: Math.floor(Math.random() * 90) - 45,
      clusterId: undefined as (number | undefined),
      proximity: undefined as ('inner' | 'middle' | 'outer' | undefined),
    };
  });

  runesWithPositions.forEach(rune => {
    const dist = Math.sqrt(Math.pow(rune.x! - 50, 2) + Math.pow(rune.y! - 50, 2));
    if (dist < 15) rune.proximity = 'inner';
    else if (dist < 30) rune.proximity = 'middle';
    else rune.proximity = 'outer';
  });

  const CLUSTER_THRESHOLD = 15;
  let currentClusterId = 1;
  const clusterCounts: { [key: number]: number } = {};

  for (let i = 0; i < runesWithPositions.length; i++) {
    if (runesWithPositions[i].clusterId) continue;
    runesWithPositions[i].clusterId = currentClusterId;
    const queue = [runesWithPositions[i]];
    let membersInCluster = 1;
    while (queue.length > 0) {
      const currentRune = queue.shift()!;
      for (let j = 0; j < runesWithPositions.length; j++) {
        if (i === j || runesWithPositions[j].clusterId) continue;
        const dist = Math.sqrt(Math.pow(currentRune.x! - runesWithPositions[j].x!, 2) + Math.pow(currentRune.y! - runesWithPositions[j].y!, 2));
        if (dist <= CLUSTER_THRESHOLD) {
          runesWithPositions[j].clusterId = currentClusterId;
          queue.push(runesWithPositions[j]);
          membersInCluster++;
        }
      }
    }
    clusterCounts[currentClusterId] = membersInCluster;
    currentClusterId++;
  }

  runesWithPositions.forEach(rune => {
    if (rune.clusterId && clusterCounts[rune.clusterId] === 1) rune.clusterId = undefined;
  });

  return runesWithPositions;
};

export const calculateDailyNumber = (date: Date): { number: number; theme: string; description: string } => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const reducedMonth = reduceNumber(month);
  const reducedDay = reduceNumber(day);
  const reducedYear = reduceNumber(year);
  const total = reduceNumber(reducedMonth + reducedDay + reducedYear);
  return {
    number: total,
    theme: NUMEROLOGY_MEANINGS[total]?.theme || "Calculation Error",
    description: NUMEROLOGY_MEANINGS[total]?.description || "Could not calculate daily number.",
  };
};

export const calculateMonthlyNumber = (date: Date): { number: number; theme: string; description: string } => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const reducedMonth = reduceNumber(month);
  const reducedYear = reduceNumber(year);
  const total = reduceNumber(reducedMonth + reducedYear);
  return {
    number: total,
    theme: NUMEROLOGY_MEANINGS[total]?.theme || "Calculation Error",
    description: NUMEROLOGY_MEANINGS[total]?.description || "Could not calculate monthly number.",
  };
};

export const calculateYearlyNumber = (date: Date): { number: number; theme: string; description: string } => {
  const year = date.getFullYear();
  const total = reduceNumber(year);
  return {
    number: total,
    theme: NUMEROLOGY_MEANINGS[total]?.theme || "Calculation Error",
    description: NUMEROLOGY_MEANINGS[total]?.description || "Could not calculate yearly number.",
  };
};

export const drawTarotCard = (): DrawnCard => {
  const cardIndex = Math.floor(Math.random() * TAROT_DECK.length);
  const isReversed = Math.random() < 0.3;
  return {
    card: TAROT_DECK[cardIndex],
    isReversed,
  };
};
