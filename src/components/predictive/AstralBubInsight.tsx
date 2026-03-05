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
import type { SparklinePoint, ChannelMetrics } from '../../types/predictive';
import { getInsightForPoint } from '../../hooks/usePredictiveEngine';

interface AstralBubInsightProps {
    /** The hovered sparkline point, or null if nothing is hovered */
    activePoint: SparklinePoint | null;
    /** Optional className override */
    className?: string;
}

/** Channel color map */
const CHANNEL_COLORS: Record<keyof ChannelMetrics, string> = {
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
    className = '',
}) => {
    return (
        <AnimatePresence mode="wait">
            {activePoint && (
                <motion.div
                    key={`insight-${activePoint.hour}`}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`p-3 rounded-lg border bg-black/60 backdrop-blur-md ${className}`}
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
    );
};

export default AstralBubInsight;
