/**
 * Predictive Dashboard Type Definitions
 * 
 * Types for the real-time predictive engine that synchronizes
 * celestial transits, numerological vibrations, and behavioral patterns.
 * 
 * @note These types power the upgraded AstralMetrics dashboard.
 */

// ---------------------------------------------------------------------------
// Planetary Transit Types
// ---------------------------------------------------------------------------

/** Supported planets for transit tracking */
export type TransitPlanet = 'mars' | 'mercury' | 'venus' | 'jupiter' | 'saturn';

/**
 * A planet's current position and velocity in the ecliptic plane.
 * Longitude is measured in degrees (0–360) along the zodiac.
 */
export interface PlanetaryPosition {
    planet: TransitPlanet;
    longitude: number;         // degrees 0-360
    velocity: number;          // degrees/day (negative = retrograde)
    isRetrograde: boolean;
    sign: string;              // zodiac sign name, e.g. "Aries"
    signDegree: number;        // degree within the sign (0-30)
    houseTransit: number;      // natal house being transited (1-12)
}

/**
 * An aspect formed between a transiting planet and a natal placement.
 */
export interface TransitAspect {
    planet: string;            // transiting planet
    natalPlanet: string;       // natal planet being aspected
    aspect: 'conjunction' | 'trine' | 'square' | 'opposition' | 'sextile';
    orb: number;               // degrees from exact (0 = perfect)
    isApplying: boolean;       // approaching exact vs separating
    intensity: number;         // 0-100 based on orb tightness
}

/**
 * Full snapshot of current planetary transits at a given moment.
 */
export interface TransitSnapshot {
    timestamp: Date;
    positions: PlanetaryPosition[];
    aspects: TransitAspect[];
}

// ---------------------------------------------------------------------------
// Channel Metrics (the four sparklines)
// ---------------------------------------------------------------------------

/**
 * The four primary channels tracked by the predictive engine.
 * Each is scored 0-100.
 */
export interface ChannelMetrics {
    drive: number;             // Mars — physical ambition, energy peaks
    flow: number;              // Mercury — communication clarity, cognitive speed
    harmony: number;           // Venus — social resonance, creative ease
    frequency: number;         // Numerology — personal hour vibration intensity
}

// ---------------------------------------------------------------------------
// Sparkline Data
// ---------------------------------------------------------------------------

/**
 * A single data point on the 48-hour sparkline chart.
 */
export interface SparklinePoint {
    /** Hour offset from "now" (-24 to +24, or 0 to 47 absolute) */
    hour: number;
    /** Display label, e.g. "2 PM" */
    label: string;
    /** ISO timestamp for this point */
    timestamp: string;
    /** Channel values 0-100 */
    drive: number;
    flow: number;
    harmony: number;
    frequency: number;
    /** The personal hour number (1-9 or 11/22/33) at this point */
    personalHourNum: number;
    /** True if this hour qualifies as an optimization window */
    isActionWindow: boolean;
    /** True if this hour is a local peak in any channel */
    isPeak?: boolean;
    /** True if this hour is a local valley in any channel */
    isValley?: boolean;
}

// ---------------------------------------------------------------------------
// Optimization Windows
// ---------------------------------------------------------------------------

/** The type of optimization window detected */
export type WindowType = 'power' | 'flow' | 'harmony' | 'rest';

/**
 * A contiguous block of hours where a specific channel peaks,
 * representing an actionable optimization window.
 */
export interface OptimizationWindow {
    startHour: number;         // hour offset from now
    endHour: number;
    type: WindowType;
    intensity: number;         // peak intensity 0-100
    insight: string;           // AI-generated context sentence
    channel: keyof ChannelMetrics;
}

// ---------------------------------------------------------------------------
// Engine State (exposed by usePredictiveEngine hook)
// ---------------------------------------------------------------------------

/**
 * The complete state exposed by the `usePredictiveEngine` hook.
 * Consumed by AstralMetrics and its sub-components.
 */
export interface PredictiveEngineState {
    /** Hero gauge score (0-100), weighted average of all channels */
    syncScore: number;
    /** Current channel intensities */
    channels: ChannelMetrics;
    /** 48-hour sparkline dataset */
    sparklineData: SparklinePoint[];
    /** Detected optimization windows */
    optimizationWindows: OptimizationWindow[];
    /** True when Mars > 80% or Personal Day = 1 or 8 */
    isActionMode: boolean;
    /** Personal day number for current date */
    personalDay: { number: number; theme: string };
    /** Personal hour number for current hour */
    personalHour: { number: number; theme: string };
    /** Universal frequency for current date */
    universalFrequency: { number: number; theme: string };
    /** Active transit aspects to natal chart */
    transitAspects: TransitAspect[];
    /** Current scrub position on timeline (hour offset from now) */
    scrubOffset: number;
    /** Whether the engine has finished initial computation */
    isReady: boolean;
    /** List of auto-spawned insights (Bubs) currently visible */
    activeInsights: AstralInsight[];
}

// ---------------------------------------------------------------------------
// Insight Generation
// ---------------------------------------------------------------------------

/**
 * An AI Bub insight card displayed on hover/scrub.
 */
export interface AstralInsight {
    /** The hour this insight applies to */
    hour: number;
    /** Primary channel driving this insight */
    channel: keyof ChannelMetrics;
    /** 1-2 sentence contextual summary */
    summary: string;
    /** Color hex for the insight card border */
    color: string;
}
