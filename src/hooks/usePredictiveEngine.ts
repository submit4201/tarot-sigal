/**
 * usePredictiveEngine — Unified state engine for the Predictive Dashboard.
 *
 * Merges three data streams into a single, high-frequency reactive state:
 *   1. Planetary transits  (transitService)
 *   2. Numerological cycles (cosmicService)
 *   3. Behavioral resonance (reading history from AppContext)
 *
 * Exposes a `PredictiveEngineState` consumed by MomentumGauge,
 * PredictiveSparklines, TimelineScrubber, and AstralBubInsight.
 *
 * @note Updates every 60 seconds via setInterval; the timeline scrubber
 *       triggers synchronous re-computation via `setScrubOffset`.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
    calculatePersonalDayNumber,
    calculatePersonalHourNumber,
    calculateUniversalFrequency,
    calculateNumerologyFrequency,
} from '../services/cosmicService';
import {
    getMarsIntensity,
    getMercuryFlow,
    getVenusHarmony,
    getTransitSnapshot,
} from '../services/transitService';
import type {
    PredictiveEngineState,
    ChannelMetrics,
    SparklinePoint,
    OptimizationWindow,
    TransitAspect,
    WindowType,
} from '../types/predictive';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Refresh interval for live data (ms) — recalculates every 60s */
const REFRESH_INTERVAL_MS = 60_000;

/** Channel weights for the Sync Score */
const WEIGHTS = {
    drive: 0.30,     // Mars intensity
    flow: 0.25,      // Mercury flow
    harmony: 0.20,   // Venus harmony
    frequency: 0.25, // Numerology vibration
};

/** Threshold values */
const ACTION_MODE_MARS_THRESHOLD = 80;
const ACTION_MODE_PERSONAL_DAYS = [1, 8];
const OPTIMIZATION_THRESHOLD = 70;

/**
 * Hour labels for sparkline axis.
 * @param hour - Hour of the day (0-23)
 */
const formatHourLabel = (hour: number): string => {
    const h = ((hour % 24) + 24) % 24;
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

/**
 * Extracts natal planet longitudes from user profile.
 * Falls back to reasonable defaults if no birth profile data exists.
 *
 * @param profile - The user profile from AppContext
 * @returns Record of planet name → ecliptic longitude
 */
const extractNatalPlacements = (profile: any): Record<string, number> => {
    const defaults: Record<string, number> = {
        sun: 0, moon: 90, mercury: 15, venus: 45,
        mars: 120, jupiter: 200, saturn: 270,
    };

    if (!profile?.birthProfileData?.profileData?.astrology) {
        return defaults;
    }

    const astro = profile.birthProfileData.profileData.astrology;
    const placements: Record<string, number> = {};

    for (const planet of Object.keys(defaults)) {
        const data = astro[planet];
        if (data && typeof data.longitude === 'number') {
            placements[planet] = data.longitude;
        } else if (data && typeof data.degree === 'number') {
            placements[planet] = data.degree;
        } else {
            placements[planet] = defaults[planet];
        }
    }

    return placements;
};

/**
 * Extracts the Ascendant longitude from the user profile.
 */
const extractAscendantLong = (profile: any): number => {
    const asc = profile?.birthProfileData?.profileData?.astrology?.ascendant;
    if (asc && typeof asc.longitude === 'number') return asc.longitude;
    if (asc && typeof asc.degree === 'number') return asc.degree;
    return 0;
};

// ---------------------------------------------------------------------------
// Insight Generation Helpers
// ---------------------------------------------------------------------------

/** Channel display names and colors */
const CHANNEL_META: Record<keyof ChannelMetrics, { label: string; color: string }> = {
    drive: { label: 'Drive', color: '#ef4444' },
    flow: { label: 'Flow', color: '#3b82f6' },
    harmony: { label: 'Harmony', color: '#22c55e' },
    frequency: { label: 'Frequency', color: '#a855f7' },
};

/**
 * Generates a context-aware insight sentence for a given set of channel values.
 */
const generateInsight = (channels: ChannelMetrics, personalHour: number): string => {
    const dominant = (Object.keys(channels) as (keyof ChannelMetrics)[])
        .reduce((a, b) => channels[a] > channels[b] ? a : b);

    const intensity = channels[dominant];
    const label = CHANNEL_META[dominant].label;

    if (intensity > 85) {
        return `Peak ${label} energy — exceptional window for ${dominant === 'drive' ? 'bold action and decisive moves' :
                dominant === 'flow' ? 'complex communication and learning' :
                    dominant === 'harmony' ? 'creative expression and social connection' :
                        'spiritual alignment and manifestation'
            }.`;
    }

    if (intensity > 65) {
        return `Strong ${label} current active. Hour ${personalHour} amplifies ${dominant === 'drive' ? 'physical initiative' :
                dominant === 'flow' ? 'mental clarity' :
                    dominant === 'harmony' ? 'aesthetic sensitivity' :
                        'inner vibration'
            }.`;
    }

    if (intensity < 30) {
        return `Low ${label} period — ideal for rest, reflection, and ${dominant === 'drive' ? 'strategic planning over action' :
                dominant === 'flow' ? 'intuitive processing over analysis' :
                    dominant === 'harmony' ? 'solo creative work' :
                        'grounding and stillness'
            }.`;
    }

    return `Moderate ${label} energy — steady conditions for balanced progress.`;
};

// ---------------------------------------------------------------------------
// Optimization Window Detection
// ---------------------------------------------------------------------------

/**
 * Scans sparkline data for contiguous windows where a channel exceeds threshold.
 */
const detectOptimizationWindows = (
    sparklineData: SparklinePoint[]
): OptimizationWindow[] => {
    const windows: OptimizationWindow[] = [];
    const channelKeys: (keyof ChannelMetrics)[] = ['drive', 'flow', 'harmony', 'frequency'];

    for (const channel of channelKeys) {
        let windowStart: number | null = null;
        let peakIntensity = 0;

        for (let i = 0; i < sparklineData.length; i++) {
            const point = sparklineData[i];
            const value = point[channel];

            if (value >= OPTIMIZATION_THRESHOLD) {
                if (windowStart === null) windowStart = point.hour;
                peakIntensity = Math.max(peakIntensity, value);
            }

            if ((value < OPTIMIZATION_THRESHOLD || i === sparklineData.length - 1) && windowStart !== null) {
                const endHour = value < OPTIMIZATION_THRESHOLD ? sparklineData[i - 1].hour : point.hour;

                // Determine window type based on the dominant channel
                const typeMap: Record<keyof ChannelMetrics, WindowType> = {
                    drive: 'power',
                    flow: 'flow',
                    harmony: 'harmony',
                    frequency: 'power', // Frequency peaks are action moments
                };

                windows.push({
                    startHour: windowStart,
                    endHour,
                    type: typeMap[channel],
                    intensity: peakIntensity,
                    insight: `${CHANNEL_META[channel].label} peaks at ${Math.round(peakIntensity)}% — prime ${typeMap[channel]} window.`,
                    channel,
                });

                windowStart = null;
                peakIntensity = 0;
            }
        }
    }

    // Sort by intensity descending
    return windows.sort((a, b) => b.intensity - a.intensity).slice(0, 12);
};

// ---------------------------------------------------------------------------
// The Hook
// ---------------------------------------------------------------------------

/**
 * usePredictiveEngine — the unified predictive dashboard state.
 *
 * Calculates and exposes:
 * - syncScore: weighted average of all channels (0-100)
 * - channels: current Drive/Flow/Harmony/Frequency values
 * - sparklineData: 48-hour forecast array
 * - optimizationWindows: detected peak windows
 * - isActionMode: Mars > 80% or Personal Day = 1|8
 * - personalDay/personalHour/universalFrequency: numerology context
 * - transitAspects: active aspects between transits and natal chart
 * - scrubOffset: current timeline position (controlled externally)
 *
 * @returns PredictiveEngineState
 */
export const usePredictiveEngine = (): PredictiveEngineState & {
    setScrubOffset: (offset: number) => void;
} => {
    const { userProfile } = useApp();

    // Scrub offset state: 0 = now, negative = past, positive = future
    const [scrubOffset, setScrubOffset] = useState(0);
    const [tick, setTick] = useState(0); // Forces recalc on interval
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Refresh every 60s
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTick(t => t + 1);
        }, REFRESH_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // -- Derived Values ---------------------------------------------------------

    const birthDate = userProfile?.birthDate || '2000-01-01';

    const natalPlacements = useMemo(
        () => extractNatalPlacements(userProfile),
        [userProfile]
    );

    const ascendantLong = useMemo(
        () => extractAscendantLong(userProfile),
        [userProfile]
    );

    /**
     * Computes a single hour's channel metrics.
     */
    const computeChannelsAtHour = useCallback(
        (date: Date): ChannelMetrics => {
            const drive = getMarsIntensity(date, ascendantLong, natalPlacements);
            const flow = getMercuryFlow(date, ascendantLong, natalPlacements);
            const harmony = getVenusHarmony(date, ascendantLong, natalPlacements);
            const frequency = calculateNumerologyFrequency(birthDate, date, date.getHours());

            return { drive, flow, harmony, frequency };
        },
        [ascendantLong, natalPlacements, birthDate]
    );

    /**
     * Master computation: rebuilt when tick/scrubOffset/profile changes.
     */
    const engineState = useMemo((): PredictiveEngineState => {
        const now = new Date();
        const scrubDate = new Date(now.getTime() + scrubOffset * 3600_000);

        // ---- Current Channels ----
        const channels = computeChannelsAtHour(scrubDate);

        // ---- Sync Score ----
        const syncScore = Math.round(
            channels.drive * WEIGHTS.drive +
            channels.flow * WEIGHTS.flow +
            channels.harmony * WEIGHTS.harmony +
            channels.frequency * WEIGHTS.frequency
        );

        // ---- Numerology Context ----
        const personalDayNum = calculatePersonalDayNumber(birthDate, scrubDate);
        const personalHourNum = calculatePersonalHourNumber(birthDate, scrubDate, scrubDate.getHours());
        const universalFreq = calculateUniversalFrequency(scrubDate);

        // Theme lookup (simplified — full themes are in NUMEROLOGY_THEMES)
        const PERSONAL_DAY_THEMES: Record<number, string> = {
            1: 'New Beginnings', 2: 'Cooperation', 3: 'Expression',
            4: 'Foundation', 5: 'Change', 6: 'Nurturing',
            7: 'Introspection', 8: 'Abundance', 9: 'Completion',
            11: 'Illumination', 22: 'Master Builder', 33: 'Master Teacher',
        };

        const personalDay = {
            number: personalDayNum,
            theme: PERSONAL_DAY_THEMES[personalDayNum] || 'Unknown',
        };
        const personalHour = {
            number: personalHourNum,
            theme: PERSONAL_DAY_THEMES[personalHourNum] || 'Unknown',
        };

        // ---- Action Mode ----
        const isActionMode =
            channels.drive > ACTION_MODE_MARS_THRESHOLD ||
            ACTION_MODE_PERSONAL_DAYS.includes(personalDayNum);

        // ---- Transit Aspects ----
        const snapshot = getTransitSnapshot(scrubDate, ascendantLong, natalPlacements);
        const transitAspects: TransitAspect[] = snapshot.aspects;

        // ---- 48-Hour Sparkline ----
        const sparklineData: SparklinePoint[] = [];

        for (let hourOffset = -24; hourOffset <= 24; hourOffset++) {
            const pointDate = new Date(now.getTime() + hourOffset * 3600_000);
            const pointChannels = computeChannelsAtHour(pointDate);
            const phNum = calculatePersonalHourNumber(birthDate, pointDate, pointDate.getHours());

            const isActionWindow =
                pointChannels.drive > ACTION_MODE_MARS_THRESHOLD ||
                ACTION_MODE_PERSONAL_DAYS.includes(
                    calculatePersonalDayNumber(birthDate, pointDate)
                );

            sparklineData.push({
                hour: hourOffset,
                label: formatHourLabel(pointDate.getHours()),
                timestamp: pointDate.toISOString(),
                drive: Math.round(pointChannels.drive),
                flow: Math.round(pointChannels.flow),
                harmony: Math.round(pointChannels.harmony),
                frequency: Math.round(pointChannels.frequency),
                personalHourNum: phNum,
                isActionWindow,
            });
        }

        // ---- Optimization Windows ----
        const optimizationWindows = detectOptimizationWindows(sparklineData);

        return {
            syncScore,
            channels,
            sparklineData,
            optimizationWindows,
            isActionMode,
            personalDay,
            personalHour,
            universalFrequency: {
                number: universalFreq.number,
                theme: universalFreq.theme,
            },
            transitAspects,
            scrubOffset,
            isReady: true,
        };
    }, [tick, scrubOffset, birthDate, ascendantLong, natalPlacements, computeChannelsAtHour]);

    return {
        ...engineState,
        setScrubOffset,
    };
};

/**
 * Generates contextual insight text for a given sparkline point.
 * Used by `AstralBubInsight` for hover cards.
 *
 * @param point - The sparkline data point to generate an insight for
 * @returns A 1-2 sentence insight string
 */
export const getInsightForPoint = (point: SparklinePoint): string => {
    const channels: ChannelMetrics = {
        drive: point.drive,
        flow: point.flow,
        harmony: point.harmony,
        frequency: point.frequency,
    };
    return generateInsight(channels, point.personalHourNum);
};
