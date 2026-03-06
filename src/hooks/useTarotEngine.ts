/**
 * useTarotEngine — Core state engine for the Spatial Tarot Table.
 *
 * Manages deck drawing, card flipping, spread layout, and synergy detection.
 * Syncs with AppContext (profile, deck, card images) and derives astral
 * metrics from the cosmic blueprint when available.
 *
 * @note AstralMetrics page is still WIP — all astral fields are optional.
 *       Synergy defaults to `false` when data is unavailable.
 */

import { useState, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generateCosmicBlueprint } from '../services/cosmicService';
import { calculateDailyNumber, SeededRandom, createNumericSeed } from '../services/tarotService';
import { TAROT_DECK } from '../constants';
import type { TarotCard } from '../types';
import type {
    TarotManifest,
    SpatialCard,
    AstralSnapshot,
    SpatialSpreadType,
    TarotEngineState,
} from '../types/tarot-spatial';

/* ------------------------------------------------------------------ */
/*  Element-to-planet affinity map for synergy detection               */
/* ------------------------------------------------------------------ */

const ELEMENT_PLANET_MAP: Record<string, string[]> = {
    Fire: ['mars', 'sun'],
    Water: ['moon', 'neptune'],
    Air: ['mercury', 'uranus'],
    Earth: ['venus', 'saturn'],
};

/**
 * Infer the user's dominant element from their birth chart planet signs.
 * Uses a simple scoring heuristic: each planet in a fire/water/air/earth
 * sign adds one point to that element's tally.
 */
function inferDominantElement(astrology: any): string {
    if (!astrology) return 'Air'; // safe fallback

    const scores: Record<string, number> = { Fire: 0, Water: 0, Air: 0, Earth: 0 };

    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    const airSigns = ['Gemini', 'Libra', 'Aquarius'];
    const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];

    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    for (const p of planets) {
        const sign = typeof astrology[p] === 'string' ? astrology[p] : astrology[p]?.sign;
        if (!sign) continue;
        if (fireSigns.includes(sign)) scores.Fire++;
        else if (waterSigns.includes(sign)) scores.Water++;
        else if (airSigns.includes(sign)) scores.Air++;
        else if (earthSigns.includes(sign)) scores.Earth++;
    }

    return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
}

/**
 * Compute Mars "intensity" as a 0–10 value from the user's birth chart.
 * Placeholder implementation — uses Mars sign to assign a base intensity,
 * then modulates by aspect count involving Mars.
 */
function computeMarsIntensity(astrology: any): number {
    if (!astrology?.mars) return 5; // neutral default
    const marsSign = typeof astrology.mars === 'string' ? astrology.mars : astrology.mars?.sign;

    // Mars is domicile in Aries/Scorpio → high base
    const signIntensity: Record<string, number> = {
        Aries: 9, Scorpio: 8, Capricorn: 7, Leo: 7,
        Sagittarius: 6, Aquarius: 5, Gemini: 5, Libra: 4,
        Taurus: 3, Cancer: 3, Virgo: 4, Pisces: 3,
    };

    let intensity = signIntensity[marsSign] ?? 5;

    // Bump intensity if Mars appears in aspects
    if (Array.isArray(astrology.aspects)) {
        const marsAspects = astrology.aspects.filter(
            (a: any) => a.p1 === 'Mars' || a.p2 === 'Mars'
        );
        intensity = Math.min(10, intensity + marsAspects.length * 0.5);
    }

    return Math.round(intensity * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Spread layout presets                                              */
/* ------------------------------------------------------------------ */

const SPREAD_LAYOUTS: Record<SpatialSpreadType, { x: number; y: number; z: number; rot: number }[]> = {
    single: [{ x: 0, y: 0, z: 0, rot: 0 }],
    '3-card': [
        { x: -320, y: 0, z: 0, rot: -3 },
        { x: 0, y: 0, z: 10, rot: 0 },
        { x: 320, y: 0, z: 0, rot: 3 },
    ],
    'celtic-cross': [
        { x: 0, y: 0, z: 20, rot: 0 },        // 1: present
        { x: 0, y: 0, z: 30, rot: 90 },       // 2: challenge (crossing)
        { x: 0, y: -200, z: 0, rot: 0 },      // 3: foundation
        { x: -300, y: 0, z: 0, rot: 0 },      // 4: past
        { x: 0, y: 200, z: 0, rot: 0 },       // 5: crown
        { x: 300, y: 0, z: 0, rot: 0 },       // 6: future
        { x: 500, y: 200, z: 0, rot: 0 },     // 7: self
        { x: 500, y: 66, z: 0, rot: 0 },      // 8: environment
        { x: 500, y: -66, z: 0, rot: 0 },     // 9: hopes/fears
        { x: 500, y: -200, z: 0, rot: 0 },    // 10: outcome
    ],
    'cybernetic-cross': [
        { x: 0, y: 0, z: 25, rot: 0 },
        { x: -250, y: -150, z: 0, rot: -5 },
        { x: 250, y: -150, z: 0, rot: 5 },
        { x: -250, y: 150, z: 0, rot: -5 },
        { x: 250, y: 150, z: 0, rot: 5 },
    ],
};

/* ------------------------------------------------------------------ */
/*  Manifest cache                                                     */
/* ------------------------------------------------------------------ */

const manifestCache = new Map<string, TarotManifest | null>();

/**
 * Fetch a card's manifest JSON. Checks both the original output path
 * and the standard manifest path. Caches results per card/deck pair.
 */
async function fetchManifest(cardId: string, deckPath?: string): Promise<TarotManifest | null> {
    const cacheKey = `${deckPath || 'default'}/${cardId}`;
    if (manifestCache.has(cacheKey)) return manifestCache.get(cacheKey)!;

    // Paths to try — the manifest pipeline outputs to multiple locations
    const pathsToTry = deckPath
        ? [
            `/assets/cards/tarot/manifests/${deckPath}/${cardId}.json`,
            `/assets/cards/tarot/output_labeled/manifests/${deckPath}/${cardId}.json`,
        ]
        : [`/assets/cards/tarot/manifests/${cardId}.json`];

    for (const path of pathsToTry) {
        try {
            const res = await fetch(path);
            if (res.ok) {
                const data = await res.json();
                manifestCache.set(cacheKey, data);
                return data;
            }
        } catch {
            // silently continue to next path
        }
    }

    manifestCache.set(cacheKey, null);
    return null;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

/**
 * useTarotEngine — manages spatial card state for the TarotTable workspace.
 *
 * @param deckId - Override the active deck. Defaults to `activeDeckId` from AppContext.
 * @returns TarotEngineState
 */
export function useTarotEngine(deckId?: string): TarotEngineState {
    const { activeProfile, activeDeckId, decks } = useApp();

    const effectiveDeckId = deckId || activeDeckId;
    const deckDef = decks.find(d => d.id === effectiveDeckId) || decks[0];

    // The stack of cards remaining in the deck fan
    const [deckStack, setDeckStack] = useState<SpatialCard[]>([]);
    // The cards that have been placed into the spread
    const [spreadCards, setSpreadCards] = useState<SpatialCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSpread, setActiveSpread] = useState<SpatialSpreadType>('3-card');

    /* ---- Derive astral snapshot from user profile ---- */
    const astral: AstralSnapshot = useMemo(() => {
        if (!activeProfile) return {};

        const today = new Date();
        const dailyNum = calculateDailyNumber(today);

        // Try to pull birth profile astrology data
        // @note The birth profile may not exist yet — all fields optional
        let marsIntensity: number | undefined;
        let dominantElement: string | undefined;
        let lifePath: number | undefined;

        try {
            const blueprint = generateCosmicBlueprint(activeProfile);
            lifePath = blueprint?.lifePath?.number;
        } catch {
            // cosmic blueprint not available
        }

        // Birth profile astrology is on a separate BirthProfileData object,
        // not directly on UserProfile. For now, derive what we can from
        // the cosmic blueprint and daily number.
        return {
            marsIntensity,
            dailyNumber: dailyNum.number,
            lifePath,
            dominantElement,
        };
    }, [activeProfile]);

    /* ---- Synergy detection ---- */
    const checkSynergy = useCallback(
        (card: any): boolean => {
            if (!astral.dominantElement) return false;

            // Check if the card's element matches the user's dominant element
            const cardElement = (card as TarotCard).element;
            if (!cardElement) return false;

            if (cardElement === astral.dominantElement) return true;

            // Mars intensity boost: if Mars > 7 and the card is Fire-aligned
            if (
                astral.marsIntensity !== undefined &&
                astral.marsIntensity > 7 &&
                cardElement === 'Fire'
            ) {
                return true;
            }

            return false;
        },
        [astral]
    );

    /* ---- Shuffle & Initialize Deck Stack ---- */
    const draw = useCallback(
        async () => {
            setIsLoading(true);

            try {
                // Use the deck's cards if available, otherwise fall back to TAROT_DECK
                const pool = (deckDef.cards && deckDef.cards.length > 0) ? deckDef.cards : TAROT_DECK;
                const seed = createNumericSeed(`${Date.now()}-${effectiveDeckId}`);
                const rng = new SeededRandom(seed);

                // Warm up RNG
                for (let i = 0; i < 5; i++) rng.nextFloat();

                // Shuffle the entire pool
                const shuffled = [...pool].sort(() => rng.nextFloat() - 0.5);

                // Build spatial cards for the stack. We'll do manifest lookups lazily
                // when cards are drawn, but for now just assign positions in a fan.
                const stackCards: SpatialCard[] = shuffled.map((card, i) => {
                    const rot = (rng.nextFloat() - 0.5) * 10;
                    return {
                        card,
                        manifest: null, // load when flipped
                        isFlipped: false,
                        isReversed: false,
                        isSynergistic: false,
                        // Fan them out slightly
                        position: { x: i * 0.5, y: -i * 0.5, z: i },
                        rotation: rot,
                    };
                });

                setDeckStack(stackCards);
                setSpreadCards([]); // Clear the spread
            } finally {
                setIsLoading(false);
            }
        },
        [effectiveDeckId, deckDef]
    );

    /* ---- Move from Deck to Spread ---- */
    const moveToSpread = useCallback(async (cardId: string, targetIndex: number) => {
        setDeckStack(prev => {
            const cardInStack = prev.find(c => c.card.id === cardId);
            if (!cardInStack) return prev;

            // Remove from stack
            const newStack = prev.filter(c => c.card.id !== cardId);
            return newStack;
        });

        // We need the card object
        let theCard: SpatialCard | undefined;
        setDeckStack(prev => {
            theCard = prev.find(c => c.card.id === cardId);
            return prev;
        });

        if (!theCard) return;

        // Ensure we have manifest
        let manifest = theCard.manifest;
        if (!manifest) {
            manifest = await fetchManifest(theCard.card.id, deckDef.path);
        }

        const layout = SPREAD_LAYOUTS[activeSpread] || SPREAD_LAYOUTS['3-card'];
        const pos = layout[targetIndex % layout.length];

        setSpreadCards(prev => {
            // Check if there's already a card at this index
            // If so, we might want to swap it back, but for simplicity let's just replace it
            // or maybe avoid dropping. Let's assume the UI handles preventing drops on full zones.

            const newSpatialCard: SpatialCard = {
                ...theCard!,
                manifest,
                position: { x: pos.x, y: pos.y, z: pos.z },
                rotation: pos.rot,
                isSynergistic: checkSynergy(theCard!.card),
                // Don't auto-flip, let the user trigger it or UI handles it
            };

            const existingIndex = prev.findIndex(c => c.card.id === newSpatialCard.card.id);
            if (existingIndex !== -1) {
                // Return to deck? For now just return
                return prev;
            }

            return [...prev, newSpatialCard];
        });
    }, [activeSpread, checkSynergy, deckDef.path]);

    /* ---- Return from Spread to Deck ---- */
    const returnToDeck = useCallback((cardId: string) => {
        setSpreadCards(prev => {
            const card = prev.find(c => c.card.id === cardId);
            if (!card) return prev;

            setDeckStack(stack => {
                // Put it back at the top of the stack
                return [...stack, {
                    ...card,
                    isFlipped: false,
                    position: { x: stack.length * 0.5, y: -stack.length * 0.5, z: stack.length },
                    rotation: 0
                }];
            });

            return prev.filter(c => c.card.id !== cardId);
        });
    }, []);

    /* ---- Flip a card ---- */
    const flipCard = useCallback((cardId: string) => {
        setSpreadCards(prev =>
            prev.map(c =>
                c.card.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
            )
        );
    }, []);

    /* ---- Change spread type ---- */
    const setSpread = useCallback((type: SpatialSpreadType) => {
        setActiveSpread(type);
        // Reposition existing spread cards to match the new layout
        setSpreadCards(prev => {
            const layout = SPREAD_LAYOUTS[type] || SPREAD_LAYOUTS['3-card'];
            // If they change to a smaller spread, excess cards should probably go back to the deck...
            // For now, we'll just map them to the new layout indices.
            return prev.map((c, i) => {
                const pos = layout[i % layout.length];
                return { ...c, position: { x: pos.x, y: pos.y, z: pos.z }, rotation: pos.rot };
            });
        });
    }, []);

    /* ---- Reset table ---- */
    const reset = useCallback(() => {
        setDeckStack([]);
        setSpreadCards([]);
    }, []);

    return {
        deckStack,
        spreadCards,
        isLoading,
        activeSpread,
        astral,
        draw,
        flipCard,
        setSpread,
        reset,
        moveToSpread,
        returnToDeck,
    };
}
