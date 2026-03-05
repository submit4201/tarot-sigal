/**
 * AstralBubInsight — Context-aware insight card component.
 *
 * Displays 1-2 sentence AI Bub insights when hovering over sparkline
 * data points or optimization windows. Styled as floating cards
 * with channel-colored borders.
 *
 * Features:
 *   - Animated enter/exit with Framer Motion
 *   - Channel-colored border accent
 *   - Personal hour number display
 *   - Action window highlighting
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SparklinePoint, ChannelMetrics, AstralInsight } from '../../types/predictive';
import { getInsightForPoint } from '../../hooks/usePredictiveEngine';

interface AstralBubInsightProps {
    /** The hovered sparkline point, or null if nothing is hovered */
    activePoint: SparklinePoint | null;
    /** List of auto-spawned floating insights */
    activeInsights?: AstralInsight[];
    /** Optional className override */
    className?: string;
}

/** Channel color map - synchronized with theme */
const CHANNEL_COLORS: Record<string, string> = {
    drive: '#ef4444',
    flow: '#3b82f6',
    harmony: '#22c55e',
    frequency: '#a855f7',
};

/**
 * Determines which channel is dominant in a sparkline point.
 */
const getDominantChannel = (point: SparklinePoint): keyof ChannelMetrics => {
    const channels: [keyof ChannelMetrics, number][] = [
        ['drive', point.drive],
        ['flow', point.flow],
        ['harmony', point.harmony],
        ['frequency', point.frequency],
    ];
    return channels.reduce((a, b) => a[1] > b[1] ? a : b)[0];
};

const AstralBubInsight: React.FC<AstralBubInsightProps> = ({
    activePoint,
    activeInsights = [],
    className = '',
}) => {
    return (
        <div className="relative w-full">
            {/* ─── Hover Insight Card ─── */}
            <AnimatePresence mode="wait">
                {activePoint && (
                    <motion.div
                        key={`hover-insight-${activePoint.hour}`}
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`p-3 rounded-lg border bg-black/80 backdrop-blur-md ${className} z-50`}
                        style={{
                            borderColor: `${CHANNEL_COLORS[getDominantChannel(activePoint)]}44`,
                            boxShadow: `0 0 20px ${CHANNEL_COLORS[getDominantChannel(activePoint)]}11`,
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: CHANNEL_COLORS[getDominantChannel(activePoint)] }}
                                />
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                                    {activePoint.label}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {activePoint.isActionWindow && (
                                    <span className="text-[9px] text-red-400 font-bold tracking-wider">
                                        ⚡ ACTION
                                    </span>
                                )}
                                <span className="text-xs font-mono text-violet-400">
                                    Hr {activePoint.personalHourNum}
                                </span>
                            </div>
                        </div>

                        {/* Insight text */}
                        <p className="text-sm text-gray-200 leading-relaxed">
                            {getInsightForPoint(activePoint)}
                        </p>

                        {/* Mini channel values */}
                        <div className="flex gap-3 mt-2 pt-2 border-t border-white/5">
                            {(['drive', 'flow', 'harmony', 'frequency'] as const).map(ch => (
                                <div key={ch} className="flex items-center gap-1">
                                    <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: CHANNEL_COLORS[ch] }}
                                    />
                                    <span
                                        className="text-[10px] font-mono"
                                        style={{ color: CHANNEL_COLORS[ch] }}
                                    >
                                        {activePoint[ch]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Auto-Spawned Floating Bubs ─── */}
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                <AnimatePresence>
                    {activeInsights.map((insight, idx) => (
                        <motion.div
                            key={`bub-${insight.hour}-${insight.channel}-${idx}`}
                            initial={{ opacity: 0, x: 100, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, x: -100, scale: 0.5, rotate: 10 }}
                            transition={{
                                type: 'spring',
                                stiffness: 100,
                                damping: 15,
                                delay: idx * 0.1
                            }}
                            className="absolute right-8 md:right-12 p-4 rounded-2xl border bg-black/90 backdrop-blur-xl pointer-events-auto max-w-xs shadow-2xl"
                            style={{
                                bottom: `${20 + (idx * 110)}px`,
                                borderColor: `${insight.color}66`,
                                boxShadow: `0 0 30px ${insight.color}22`,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className="w-3 h-3 rounded-full animate-pulse"
                                    style={{ backgroundColor: insight.color }}
                                />
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                    Dynamic_Sync_Triggered
                                </span>
                            </div>
                            <p className="text-xs md:text-sm text-white leading-relaxed">
                                {insight.summary}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AstralBubInsight;
