import { DailyDrawRecord, SavedReading, JournalEntry, TarotCard, AchievementID } from '../types';
import { TAROT_DECK, RUNE_DECK } from '../constants';

interface AppStateForAchievements {
    dailyDrawHistory: DailyDrawRecord[];
    savedReadings: SavedReading[];
    journalEntries: JournalEntry[];
    unlockedAchievements: AchievementID[];
}

export const ACHIEVEMENTS_LIST: { id: AchievementID; name: string; icon: string; description: string }[] = [
    { id: 'first_draw', name: 'First Draw', icon: '🔮', description: 'Complete your first daily draw' },
    { id: 'first_reading', name: 'First Reading', icon: '📜', description: 'Save your first reading' },
    { id: 'scribe_1', name: 'Scribe', icon: '✍️', description: 'Write your first journal entry' },
    { id: 'scribe_10', name: 'Chronicler', icon: '📚', description: 'Write 10 journal entries' },
    { id: 'historian_5', name: 'Historian', icon: '🏛️', description: 'Save 5 readings' },
    { id: 'streak_3', name: 'Momentum', icon: '🔥', description: '3-day daily draw streak' },
    { id: 'streak_7', name: 'Dedication', icon: '⚡', description: '7-day daily draw streak' },
    { id: 'major_arcana_initiate', name: 'Major Initiate', icon: '👑', description: 'Draw 5 unique Major Arcana cards' },
    { id: 'major_arcana_master', name: 'Major Master', icon: '🌟', description: 'Collect all 22 Major Arcana cards' },
    { id: 'wands_adept', name: 'Wands Adept', icon: '🔥', description: 'Draw 10 unique Wands cards' },
    { id: 'cups_adept', name: 'Cups Adept', icon: '🏆', description: 'Draw 10 unique Cups cards' },
    { id: 'swords_adept', name: 'Swords Adept', icon: '⚔️', description: 'Draw 10 unique Swords cards' },
    { id: 'pentacles_adept', name: 'Pentacles Adept', icon: '🪙', description: 'Draw 10 unique Pentacles cards' },
    { id: 'rune_caster_1', name: 'Rune Caster', icon: 'ᚠ', description: 'Perform your first rune casting' },
    { id: 'rune_caster_5', name: 'Rune Master', icon: 'ᛟ', description: 'Perform 5 rune castings' },
];

export function checkAndUnlockAchievements(
    state: AppStateForAchievements,
    unlockFn: (id: AchievementID) => void
) {
    const { dailyDrawHistory, savedReadings, journalEntries, unlockedAchievements } = state;

    const check = (id: AchievementID, condition: boolean) => {
        if (condition && !unlockedAchievements.includes(id)) {
            unlockFn(id);
        }
    };

    // Simple checks
    check('first_draw', dailyDrawHistory.length > 0);
    check('first_reading', savedReadings.length > 0);
    const totalNotes = journalEntries.length + savedReadings.filter(r => r.userNotes).length;
    check('scribe_1', totalNotes > 0);
    check('scribe_10', totalNotes >= 10);
    check('historian_5', savedReadings.length >= 5);

    // Rune checks
    const runeReadings = savedReadings.filter(r => r.deckType === 'runes').length;
    check('rune_caster_1', runeReadings > 0);
    check('rune_caster_5', runeReadings >= 5);

    // Streak checks
    if (dailyDrawHistory.length > 1) {
        let streak = 1;
        const sortedHistory = [...dailyDrawHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for (let i = 0; i < sortedHistory.length - 1; i++) {
            const current = new Date(sortedHistory[i].date);
            const previous = new Date(sortedHistory[i + 1].date);
            const diffTime = current.getTime() - previous.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streak++;
            } else if (diffDays > 1) {
                break; // Streak broken
            }
        }
        check('streak_3', streak >= 3);
        check('streak_7', streak >= 7);
    }

    // Card collection checks
    const majorArcanaDrawn = new Set<string>();
    const suitCounts = { Wands: 0, Cups: 0, Swords: 0, Pentacles: 0 };

    // Process Daily Draws (stored as strings)
    dailyDrawHistory.forEach(record => {
        const cardObj = TAROT_DECK.find(c => c.name === record.card);
        if (cardObj && cardObj.arcana === 'Major') {
            majorArcanaDrawn.add(cardObj.name);
        } else if (cardObj && cardObj.arcana in suitCounts) {
            suitCounts[cardObj.arcana as keyof typeof suitCounts]++;
        }
    });

    // Process Saved Readings (stored as objects)
    savedReadings.forEach(reading => {
        reading.cards.forEach(drawn => {
            // Check if it's a Tarot card (has arcana)
            if (drawn.card && 'arcana' in drawn.card) {
                const card = drawn.card as TarotCard;
                if (card.arcana === 'Major') {
                    majorArcanaDrawn.add(card.name);
                } else if (card.arcana in suitCounts) {
                    suitCounts[card.arcana as keyof typeof suitCounts]++;
                }
            }
        });
    });

    check('major_arcana_initiate', majorArcanaDrawn.size >= 5);
    check('major_arcana_master', majorArcanaDrawn.size >= 22);
    check('wands_adept', suitCounts.Wands >= 10);
    check('cups_adept', suitCounts.Cups >= 10);
    check('swords_adept', suitCounts.Swords >= 10);
    check('pentacles_adept', suitCounts.Pentacles >= 10);
}