/**
 * Spatial Tarot Table — Type Definitions
 *
 * Models the manifest JSON structure, engine state, and synergy detection
 * for the 3D-layered tarot workspace.
 *
 * @note ManifestHotspot mirrors the JSON files in
 *       /public/assets/cards/tarot/manifests/{DeckName}/{cardId}.json
 */

import type { AnyCard } from '../types';

/* ------------------------------------------------------------------ */
/*  Manifest types — match the Gemini-generated JSON manifest schema  */
/* ------------------------------------------------------------------ */

/** Individual interactive zone on a card face */
export interface ManifestHotspot {
    /** Unique identifier within the manifest, e.g. "zone_0" */
    id: string;
    /** Human-readable label, e.g. "The Flowing Water" */
    label: string;
    /** Visual glow style applied to the hotspot path */
    glow_type: 'shimmer_static' | 'slow_burn' | 'pulse_auric';
    /** AI-generated insight text describing this zone */
    base_insight: string;
    /** SVG path `d` attribute defining the zone contour */
    contour: string;
}

/** Root manifest object for a single card */
export interface TarotManifest {
    card_id: string;
    name: string;
    theme_color: string;
    hotspots: ManifestHotspot[];
}

/* ------------------------------------------------------------------ */
/*  Engine / runtime state                                             */
/* ------------------------------------------------------------------ */

/** A card placed on the spatial table with positional + synergy metadata */
export interface SpatialCard {
    card: AnyCard;
    manifest: TarotManifest | null;
    isFlipped: boolean;
    isReversed: boolean;
    /**
     * True when the card's archetype aligns with the user's current
     * astral metrics (element match, Mars intensity, etc.).
     * Drives the CSS `synergy-glow` animation.
     */
    isSynergistic: boolean;
    /** Position in the 3D workspace */
    position: { x: number; y: number; z: number };
    /** Rotation angle in degrees */
    rotation: number;
}

/**
 * Snapshot of user's astral state used for synergy detection.
 * Derived from AppContext.activeProfile + cosmicService.
 * All fields are optional because the AstralMetrics page is still WIP —
 * synergy defaults to false when data is unavailable.
 */
export interface AstralSnapshot {
    /** Mars planetary intensity (0–10 scale), from birth profile astrology */
    marsIntensity?: number;
    /** Today's numerological number */
    dailyNumber?: number;
    /** User's Life Path number */
    lifePath?: number;
    /** User's dominant element inferred from birth chart */
    dominantElement?: string;
}

/** Spread layout preset */
export type SpatialSpreadType = 'single' | '3-card' | 'celtic-cross' | 'cybernetic-cross';

/** Return type of the useTarotEngine hook */
export interface TarotEngineState {
    deckStack: SpatialCard[];
    spreadCards: SpatialCard[];
    isLoading: boolean;
    activeSpread: SpatialSpreadType;
    astral: AstralSnapshot;
    draw: () => Promise<void>;
    flipCard: (cardId: string) => void;
    setSpread: (type: SpatialSpreadType) => void;
    reset: () => void;
    moveToSpread: (cardId: string, targetIndex: number) => Promise<void>;
    returnToDeck: (cardId: string) => void;
}
