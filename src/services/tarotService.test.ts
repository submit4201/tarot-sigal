
import { describe, it, expect } from 'vitest';
import { SeededRandom, createNumericSeed, getShuffledPreparedDeck, drawDailyCard } from './tarotService';
import { TAROT_DECK } from '../constants';

describe('Tarot Service', () => {

    describe('SeededRandom', () => {
        it('should produce deterministic results for the same seed', () => {
            const seed = 12345;
            const rng1 = new SeededRandom(seed);
            const rng2 = new SeededRandom(seed);
            expect(rng1.nextFloat()).toBe(rng2.nextFloat());
            expect(rng1.nextInt(0, 100)).toBe(rng2.nextInt(0, 100));
        });

        it('should produce different results for different seeds', () => {
            const rng1 = new SeededRandom(1);
            const rng2 = new SeededRandom(2);
            expect(rng1.nextFloat()).not.toBe(rng2.nextFloat());
        });
    });

    describe('createNumericSeed', () => {
        it('should create consistent hash from string', () => {
            const str = "test-string";
            expect(createNumericSeed(str)).toBe(createNumericSeed(str));
        });
    });

    describe('getShuffledPreparedDeck', () => {
        it('should return a deck of the same size', () => {
            const deck = [...TAROT_DECK]; // Clone to be safe
            const shuffled = getShuffledPreparedDeck(deck, 123);
            expect(shuffled.length).toBe(deck.length);
        });

        it('should be deterministic with the same seed', () => {
            const deck = [...TAROT_DECK];
            const shuffled1 = getShuffledPreparedDeck(deck, 555);
            const shuffled2 = getShuffledPreparedDeck(deck, 555);
            expect(shuffled1[0].card.id).toBe(shuffled2[0].card.id);
        });
    });

    // Rule 3-C requirement: Test logging is handled by the test runner (Vitest) automatically
});
