import { UserProfile, CosmicBlueprint, CosmicNumber, Pinnacle, Challenge } from '../types';

const CHAR_TO_NUM: { [key: string]: number } = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

// Reduces a number to a single digit or a master number (11, 22, 33)
const reduceNumber = (num: number): number => {
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }
  if (num < 10) {
    return num;
  }
  let sum = 0;
  String(num).split('').forEach(digit => {
    const d = parseInt(digit, 10);
    if (!isNaN(d)) sum += d;
  });
  // Recursively reduce until it's a single digit or master number
  if (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    return reduceNumber(sum);
  }
  return sum;
};

const getUnreducedSum = (value: string | number): number => {
  return String(value).split('').reduce((acc, digit) => {
    const d = parseInt(digit, 10);
    return acc + (isNaN(d) ? 0 : d);
  }, 0);
}

// Calculates the numerological value of a name string
const calculateNameNumber = (name: string, type: 'all' | 'vowels' | 'consonants'): { reduced: number, unreduced: number } => {
  if (!name) return { reduced: 0, unreduced: 0 };
  let sum = 0;
  const lowerName = name.toLowerCase().replace(/[^a-z]/g, '');

  for (const char of lowerName) {
    if (type === 'vowels' && VOWELS.has(char)) {
      sum += CHAR_TO_NUM[char];
    } else if (type === 'consonants' && !VOWELS.has(char)) {
      sum += CHAR_TO_NUM[char];
    } else if (type === 'all') {
      sum += CHAR_TO_NUM[char];
    }
  }
  return { reduced: reduceNumber(sum), unreduced: sum };
};

// Calculates the Life Path number from a birth date
const calculateLifePathNumber = (birthDate: string): { reduced: number, unreduced: number } => {
  if (!birthDate) return { reduced: 0, unreduced: 0 };
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return { reduced: 0, unreduced: 0 };
  const [year, month, day] = parts;

  const totalSum = getUnreducedSum(month) + getUnreducedSum(day) + getUnreducedSum(year);
  return { reduced: reduceNumber(totalSum), unreduced: totalSum };
};

const calculateBirthdayNumber = (birthDate: string): number => {
  if (!birthDate) return 0;
  const parts = birthDate.split('-');
  if (parts.length < 3) return 0;
  const day = parseInt(parts[2], 10);
  return reduceNumber(day);
}

const calculateMaturityNumber = (lifePath: number, destiny: number): number => {
  return reduceNumber(lifePath + destiny);
}

const calculatePinnaclesAndChallenges = (birthDate: string, lifePath: number): { pinnacles: Pinnacle[], challenges: Challenge[] } => {
  if (!birthDate || !lifePath) return { pinnacles: [], challenges: [] };

  const parts = birthDate.split('-').map(str => reduceNumber(parseInt(str, 10)));
  if (parts.length < 3) return { pinnacles: [], challenges: [] };
  const [year, month, day] = parts;

  // Pinnacles
  const p1 = reduceNumber(month + day);
  const p2 = reduceNumber(day + year);
  const p3 = reduceNumber(p1 + p2);
  const p4 = reduceNumber(month + year);
  const pinnacleNumbers = [p1, p2, p3, p4];

  // Challenges
  const c1 = reduceNumber(Math.abs(month - day));
  const c2 = reduceNumber(Math.abs(day - year));
  const c3 = reduceNumber(Math.abs(c1 - c2));
  const c4 = reduceNumber(Math.abs(month - year));
  const challengeNumbers = [c1, c2, c3, c4];

  // Age Ranges
  const firstPinnacleEnd = 36 - (lifePath > 9 ? reduceNumber(lifePath) : lifePath);
  const ageRanges = [
    `Birth to ${firstPinnacleEnd}`,
    `${firstPinnacleEnd + 1} to ${firstPinnacleEnd + 9}`,
    `${firstPinnacleEnd + 10} to ${firstPinnacleEnd + 18}`,
    `${firstPinnacleEnd + 19} onwards`
  ];

  return {
    pinnacles: pinnacleNumbers.map((p, i) => ({
      number: p,
      ...((PINNACLE_THEMES as any)[p] || PINNACLE_THEMES[0]),
      ageRange: ageRanges[i]
    })),
    challenges: challengeNumbers.map((c, i) => ({
      number: c,
      ...((CHALLENGE_THEMES as any)[c] || CHALLENGE_THEMES[0]),
      ageRange: ageRanges[i]
    }))
  };
};


const NUMEROLOGY_THEMES: { [key: number]: { theme: string; description: string } } = {
  0: { theme: "Incomplete Data", description: "Provide more details to calculate this number." },
  1: { theme: "The Leader", description: "Embodies independence, innovation, and leadership." },
  2: { theme: "The Diplomat", description: "Represents cooperation, harmony, and partnership." },
  3: { theme: "The Communicator", description: "Signifies creativity, self-expression, and joy." },
  4: { theme: "The Builder", description: "Stands for stability, hard work, and practicality." },
  5: { theme: "The Adventurer", description: "Symbolizes freedom, change, and curiosity." },
  6: { theme: "The Nurturer", description: "Represents responsibility, love, and community." },
  7: { theme: "The Seeker", description: "Embodies introspection, wisdom, and spirituality." },
  8: { theme: "The Powerhouse", description: "Signifies ambition, abundance, and authority." },
  9: { theme: "The Humanitarian", description: "Stands for compassion, completion, and universal love." },
  11: { theme: "The Visionary", description: "A Master Number of intuition, idealism, and spiritual insight." },
  22: { theme: "The Master Builder", description: "A Master Number of large-scale manifestation and practical dreams." },
  33: { theme: "The Master Teacher", description: "A Master Number of healing, compassion, and spiritual guidance." },
};

const PINNACLE_THEMES: { [key: number]: { theme: string; description: string } } = {
  0: { theme: "Rest & Recalibration", description: "A period of quiet contemplation and preparation for what is to come." },
  1: { theme: "The Innovator", description: "A time for developing independence, leadership, and pioneering new paths. Individuality is key." },
  2: { theme: "The Diplomat", description: "Focus on partnerships, cooperation, and developing intuition. Relationships are paramount." },
  3: { theme: "The Creative", description: "An expansive period for self-expression, creativity, and social engagement. Joy and communication are highlighted." },
  4: { theme: "The Builder", description: "A cycle for hard work, establishing security, and building lasting foundations. Discipline is required." },
  5: { theme: "The Liberator", description: "Expect change, freedom, and adventure. This is a time to adapt and embrace the unexpected." },
  6: { theme: "The Caretaker", description: "A period focused on home, family, responsibility, and community service. Matters of the heart are central." },
  7: { theme: "The Analyst", description: "A time for introspection, spiritual growth, and seeking deeper knowledge. Solitude and analysis are beneficial." },
  8: { theme: "The Executive", description: "Focus on personal power, financial success, and taking control. Ambition and authority are key themes." },
  9: { theme: "The Philanthropist", description: "A cycle of completion, compassion, and humanitarianism. Letting go and serving others are highlighted." },
  11: { theme: "The Spiritual Beacon", description: "A master cycle of heightened intuition, spiritual awakenings, and inspirational leadership." },
  22: { theme: "The Master Architect", description: "A powerful period for turning ambitious dreams into tangible reality on a large scale." },
  33: { theme: "The Cosmic Healer", description: "A time of profound compassion and service to humanity through healing and spiritual education." },
};

const CHALLENGE_THEMES: { [key: number]: { theme: string; description: string } } = {
  0: { theme: "The Open Path", description: "This challenge indicates a path of least resistance, or that the other challenges are the primary focus. It's a call to choose your own lesson." },
  1: { theme: "The Challenge of Assertion", description: "Learning to stand up for oneself without becoming aggressive or indecisive. The lesson is in finding your unique voice and confidence." },
  2: { theme: "The Challenge of Sensitivity", description: "Overcoming hypersensitivity and fear of collaboration. The lesson is in developing diplomacy and trusting partnerships." },
  3: { theme: "The Challenge of Expression", description: "Moving past self-doubt and scattered energies to express oneself creatively and joyfully. The lesson is in focused communication." },
  4: { theme: "The Challenge of Discipline", description: "Resisting the urge to be lazy or rigid. The lesson is in dedicated, consistent effort and building a stable life." },
  5: { theme: "The Challenge of Freedom", description: "Avoiding impulsive behavior and fear of change. The lesson is in using freedom constructively and embracing adaptability." },
  6: { theme: "The Challenge of Responsibility", description: "Balancing the needs of others with one's own, and avoiding perfectionism or neglect. The lesson is in healthy nurturing." },
  7: { theme: "The Challenge of Faith", description: "Overcoming skepticism, isolation, and superficiality. The lesson is in trusting one's inner wisdom and seeking deeper truths." },
  8: { theme: "The Challenge of Power", description: "Using authority and finances wisely, without becoming domineering or a victim. The lesson is in mastering the material world with integrity." },
};

// ---------------------------------------------------------------------------
// Personal Cycle Numbers (Dynamic — vary by date/hour)
// ---------------------------------------------------------------------------

/**
 * Calculates the Personal Year number.
 * Formula: reduce(birth month + birth day + current year)
 * 
 * @param birthDate - YYYY-MM-DD format
 * @param date - The target date
 * @returns The Personal Year number (1-9, 11, 22, 33)
 */
export const calculatePersonalYearNumber = (birthDate: string, date: Date): number => {
  if (!birthDate) return 1;
  const parts = birthDate.split('-').map(Number);
  if (parts.length < 3) return 1;
  const [, month, day] = parts;
  return reduceNumber(
    reduceNumber(month) + reduceNumber(day) + reduceNumber(date.getFullYear())
  );
};

/**
 * Calculates the Personal Day number.
 * Formula: reduce(Personal Year + current month + current day)
 * 
 * @param birthDate - YYYY-MM-DD format
 * @param date - The target date
 * @returns The Personal Day number (1-9, 11, 22, 33)
 */
export const calculatePersonalDayNumber = (birthDate: string, date: Date): number => {
  const personalYear = calculatePersonalYearNumber(birthDate, date);
  return reduceNumber(
    personalYear + reduceNumber(date.getMonth() + 1) + reduceNumber(date.getDate())
  );
};

/**
 * Calculates the Personal Hour number.
 * Formula: reduce(Personal Day + hour)
 * 
 * @param birthDate - YYYY-MM-DD format
 * @param date - The target date
 * @param hour - Hour of the day (0-23)
 * @returns The Personal Hour number (1-9, 11, 22, 33)
 */
export const calculatePersonalHourNumber = (birthDate: string, date: Date, hour: number): number => {
  const personalDay = calculatePersonalDayNumber(birthDate, date);
  return reduceNumber(personalDay + reduceNumber(hour));
};

/**
 * Calculates the Universal Frequency — the collective vibration of the current day.
 * Formula: reduce(month + day + year of the date)
 * 
 * @param date - The target date
 * @returns Object with the number and its theme
 */
export const calculateUniversalFrequency = (date: Date): { number: number; theme: string } => {
  const sum = reduceNumber(date.getMonth() + 1)
    + reduceNumber(date.getDate())
    + reduceNumber(date.getFullYear());
  const num = reduceNumber(sum);
  return {
    number: num,
    theme: NUMEROLOGY_THEMES[num]?.theme || 'Unknown',
  };
};

/**
 * Calculates the Numerology Frequency score (0-100) for a given hour.
 * Combines Personal Hour Number significance with Personal Day energy.
 * Master numbers (11, 22, 33) and action numbers (1, 8) score highest.
 * 
 * @param birthDate - YYYY-MM-DD format
 * @param date - The target date
 * @param hour - Hour of the day (0-23)
 * @returns Frequency score 0-100
 */
export const calculateNumerologyFrequency = (
  birthDate: string,
  date: Date,
  hour: number
): number => {
  const personalHour = calculatePersonalHourNumber(birthDate, date, hour);
  const personalDay = calculatePersonalDayNumber(birthDate, date);

  // Base score from hour number significance
  let score = 40;

  // Master numbers are peak energy
  if (personalHour === 11 || personalHour === 22 || personalHour === 33) {
    score += 40;
  }
  // Action numbers (1 and 8) are high energy
  else if (personalHour === 1 || personalHour === 8) {
    score += 30;
  }
  // Creative/flow numbers (3, 5, 9) are moderate-high
  else if (personalHour === 3 || personalHour === 5 || personalHour === 9) {
    score += 20;
  }
  // Stable numbers (4, 6, 7) are moderate
  else if (personalHour === 4 || personalHour === 6 || personalHour === 7) {
    score += 10;
  }
  // Rest number (2) is low energy
  else {
    score += 5;
  }

  // Day-level boost: action days amplify everything
  if (personalDay === 1 || personalDay === 8) score += 15;
  if (personalDay === 11 || personalDay === 22 || personalDay === 33) score += 20;

  return Math.min(100, Math.max(0, score));
};

export const generateCosmicBlueprint = (profile: UserProfile): CosmicBlueprint => {
  const { reduced: lifePathNum, unreduced: lifePathUnreduced } = calculateLifePathNumber(profile.birthDate);
  const { reduced: destinyNum, unreduced: destinyUnreduced } = calculateNameNumber(profile.givenName, 'all');
  const { reduced: soulUrgeNum } = calculateNameNumber(profile.givenName, 'vowels');
  const { reduced: personalityNum } = calculateNameNumber(profile.givenName, 'consonants');
  const { reduced: heritageNum } = calculateNameNumber(profile.mothersMaidenName, 'all');
  const { reduced: currentVibeNum } = calculateNameNumber(profile.currentName, 'all');
  const birthdayNum = calculateBirthdayNumber(profile.birthDate);
  const maturityNum = calculateMaturityNumber(lifePathNum, destinyNum);
  const { pinnacles, challenges } = calculatePinnaclesAndChallenges(profile.birthDate, lifePathNum);

  const karmicDebts: number[] = [];
  const karmicNumbers = [13, 14, 16, 19];
  if (karmicNumbers.includes(lifePathUnreduced)) karmicDebts.push(lifePathUnreduced);
  if (karmicNumbers.includes(destinyUnreduced)) karmicDebts.push(destinyUnreduced);

  return {
    lifePath: { number: lifePathNum, ...((NUMEROLOGY_THEMES as any)[lifePathNum] || NUMEROLOGY_THEMES[0]) },
    destiny: { number: destinyNum, ...((NUMEROLOGY_THEMES as any)[destinyNum] || NUMEROLOGY_THEMES[0]) },
    soulUrge: { number: soulUrgeNum, ...((NUMEROLOGY_THEMES as any)[soulUrgeNum] || NUMEROLOGY_THEMES[0]) },
    personality: { number: personalityNum, ...((NUMEROLOGY_THEMES as any)[personalityNum] || NUMEROLOGY_THEMES[0]) },
    heritage: { number: heritageNum, ...((NUMEROLOGY_THEMES as any)[heritageNum] || NUMEROLOGY_THEMES[0]) },
    currentVibe: { number: currentVibeNum, ...((NUMEROLOGY_THEMES as any)[currentVibeNum] || NUMEROLOGY_THEMES[0]) },
    birthday: { number: birthdayNum, ...((NUMEROLOGY_THEMES as any)[birthdayNum] || NUMEROLOGY_THEMES[0]) },
    maturity: { number: maturityNum, ...((NUMEROLOGY_THEMES as any)[maturityNum] || NUMEROLOGY_THEMES[0]) },
    pinnacles,
    challenges,
    karmicDebts: [...new Set(karmicDebts)], // Ensure unique values
  };
};