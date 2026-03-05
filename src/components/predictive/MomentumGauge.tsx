/**
 * MomentumGauge — Central SVG radial gauge for the Sync Score (0-100).
 *
 * Renders an animated arc with:
 *   - Gradient stroke that shifts from violet → red as score increases
 *   - Glow burst in Action Mode
 *   - Numeric readout with channel breakdown
 *   - Responsive viewBox scaling
 *
 * @note Uses CSS transitions for smooth arc animation; Framer Motion for glow.
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChannelMetrics } from '../../types/predictive';

interface MomentumGaugeProps {
    /** Sync Score 0-100 */
    syncScore: number;
    /** Current channel values */
    channels: ChannelMetrics;
    /** Whether Action Mode is active */
    isActionMode: boolean;
    /** Personal Day display */
    personalDay: { number: number; theme: string };
    /** Universal Frequency display */
    universalFrequency: { number: number; theme: string };
}

/** SVG dimensions and arc geometry */
const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 110;
const STROKE_WIDTH = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_START = 0.75;  // Start at 270° (top)
const ARC_SPAN = 0.75;   // 270° sweep

/**
 * Converts a 0-100 score to a stroke-dashoffset for the arc.
 */
const scoreToOffset = (score: number): number => {
    const usable = CIRCUMFERENCE * ARC_SPAN;
    const filled = (score / 100) * usable;
    return usable - filled;
};

/**
 * Returns a color along the gradient based on intensity.
 */
const getScoreColor = (score: number): string => {
    if (score >= 85) return '#ef4444'; // Red — peak energy
    if (score >= 70) return '#f59e0b'; // Amber — high energy
    if (score >= 50) return '#a855f7'; // Violet — moderate
    if (score >= 30) return '#3b82f6'; // Blue — low-moderate
    return '#6b7280';                   // Gray — low
};

const MomentumGauge: React.FC<MomentumGaugeProps> = ({
    syncScore,
    channels,
    isActionMode,
    personalDay,
    universalFrequency,
}) => {
    const dashOffset = useMemo(() => scoreToOffset(syncScore), [syncScore]);
    const scoreColor = useMemo(() => getScoreColor(syncScore), [syncScore]);

    const channelBars = useMemo(() => [
        { key: 'drive', label: 'Drive', value: channels.drive, color: '#ef4444' },
        { key: 'flow', label: 'Flow', value: channels.flow, color: '#3b82f6' },
        { key: 'harmony', label: 'Harmony', value: channels.harmony, color: '#22c55e' },
        { key: 'frequency', label: 'Freq', value: channels.frequency, color: '#a855f7' },
    ], [channels]);

    return (
        <div className="relative flex flex-col items-center">
            {/* Action Mode Glow */}
            <AnimatePresence>
                {isActionMode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 70%)`,
                            filter: 'blur(20px)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* SVG Gauge */}
            <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72"
            >
                <defs>
                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <filter id="gauge-glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background track */}
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE * ARC_SPAN} ${CIRCUMFERENCE * (1 - ARC_SPAN)}`}
                    strokeDashoffset={-CIRCUMFERENCE * ARC_START}
                    strokeLinecap="round"
                    transform={`rotate(0 ${CENTER} ${CENTER})`}
                />

                {/* Active arc */}
                <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    stroke="url(#gauge-gradient)"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE * ARC_SPAN} ${CIRCUMFERENCE * (1 - ARC_SPAN)}`}
                    strokeDashoffset={-CIRCUMFERENCE * ARC_START + dashOffset}
                    strokeLinecap="round"
                    filter={isActionMode ? 'url(#gauge-glow)' : undefined}
                    style={{
                        transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
                    }}
                />

                {/* Score text */}
                <text
                    x={CENTER}
                    y={CENTER - 12}
                    textAnchor="middle"
                    className="fill-white font-bold"
                    style={{ fontSize: '42px', fontFamily: 'var(--font-heading, monospace)' }}
                >
                    {syncScore}
                </text>
                <text
                    x={CENTER}
                    y={CENTER + 14}
                    textAnchor="middle"
                    className="fill-gray-400"
                    style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}
                >
                    SYNC SCORE
                </text>

                {/* Action Mode indicator */}
                {isActionMode && (
                    <text
                        x={CENTER}
                        y={CENTER + 34}
                        textAnchor="middle"
                        className="fill-red-400"
                        style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px' }}
                    >
                        ⚡ ACTION MODE
                    </text>
                )}
            </svg>

            {/* Channel mini-bars */}
            <div className="grid grid-cols-4 gap-3 mt-4 w-full max-w-xs">
                {channelBars.map(({ key, label, value, color }) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${value}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {label}
                        </span>
                        <span
                            className="text-xs font-mono"
                            style={{ color }}
                        >
                            {Math.round(value)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Numerology pills */}
            <div className="flex gap-3 mt-4">
                <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                    <span className="text-[10px] text-violet-300 uppercase tracking-wider mr-1">Day</span>
                    <span className="text-sm font-mono text-violet-400">{personalDay.number}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-amber-300 uppercase tracking-wider mr-1">Freq</span>
                    <span className="text-sm font-mono text-amber-400">{universalFrequency.number}</span>
                </div>
            </div>
        </div>
    );
};

export default MomentumGauge;
