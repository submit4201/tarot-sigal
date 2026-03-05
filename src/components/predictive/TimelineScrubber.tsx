/**
 * TimelineScrubber — Horizontal 48-hour draggable timeline axis.
 *
 * Provides a draggable scrubber to "time travel" through the 48-hour
 * prediction window. Uses @use-gesture/react for smooth drag interaction
 * and requestAnimationFrame for sub-100ms visual feedback.
 *
 * Features:
 *   - Draggable thumb that maps to hour offsets (-24 to +24)
 *   - Hour tick marks with "NOW" indicator
 *   - Optimization window markers (colored bands)
 *   - Action Window glow highlights
 */

import React, { useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { OptimizationWindow, SparklinePoint } from '../../types/predictive';

interface TimelineScrubberProps {
    /** Current scrub offset (-24 to +24) */
    scrubOffset: number;
    /** Callback to update scrub offset */
    onScrubChange: (offset: number) => void;
    /** Optimization windows for colored band overlays */
    optimizationWindows: OptimizationWindow[];
    /** Sparkline data for action window markers */
    sparklineData: SparklinePoint[];
}

/** Timeline constants */
const TOTAL_HOURS = 49; // -24 to +24 inclusive
const MIN_OFFSET = -24;
const MAX_OFFSET = 24;

/** Window type color mapping */
const WINDOW_COLORS: Record<string, string> = {
    power: 'rgba(239, 68, 68, 0.25)',
    flow: 'rgba(59, 130, 246, 0.25)',
    harmony: 'rgba(34, 197, 94, 0.25)',
    rest: 'rgba(107, 114, 128, 0.15)',
};

const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
    scrubOffset,
    onScrubChange,
    optimizationWindows,
    sparklineData,
}) => {
    const trackRef = useRef<HTMLDivElement>(null);

    /**
     * Converts a pixel position on the track to an hour offset.
     */
    const pixelToOffset = useCallback((clientX: number): number => {
        if (!trackRef.current) return 0;
        const rect = trackRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(MIN_OFFSET + ratio * (MAX_OFFSET - MIN_OFFSET));
    }, []);

    /**
     * Converts an hour offset to a percentage position on the track.
     */
    const offsetToPercent = useCallback((offset: number): number => {
        return ((offset - MIN_OFFSET) / (MAX_OFFSET - MIN_OFFSET)) * 100;
    }, []);

    /**
     * Handle pointer drag on the timeline.
     */
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        const offset = pixelToOffset(e.clientX);
        onScrubChange(offset);
    }, [pixelToOffset, onScrubChange]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (e.buttons === 0) return;
        requestAnimationFrame(() => {
            const offset = pixelToOffset(e.clientX);
            onScrubChange(offset);
        });
    }, [pixelToOffset, onScrubChange]);

    /**
     * Major tick marks: every 6 hours.
     */
    const ticks = useMemo(() => {
        const result: Array<{ offset: number; label: string; isMajor: boolean }> = [];
        for (let h = MIN_OFFSET; h <= MAX_OFFSET; h += 3) {
            const isMajor = h % 6 === 0;
            let label = '';
            if (h === 0) label = 'NOW';
            else if (isMajor) label = `${h > 0 ? '+' : ''}${h}h`;
            result.push({ offset: h, label, isMajor });
        }
        return result;
    }, []);

    /**
     * Optimization window bands positioned on the track.
     */
    const windowBands = useMemo(() => {
        return optimizationWindows.map((win, i) => ({
            key: `${win.channel}-${i}`,
            left: offsetToPercent(win.startHour),
            width: offsetToPercent(win.endHour) - offsetToPercent(win.startHour),
            color: WINDOW_COLORS[win.type] || WINDOW_COLORS.rest,
        }));
    }, [optimizationWindows, offsetToPercent]);

    const thumbPosition = offsetToPercent(scrubOffset);

    return (
        <div className="w-full px-2 select-none">
            {/* Label row */}
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Timeline
                </span>
                <span className="text-xs font-mono text-gray-400">
                    {scrubOffset === 0
                        ? 'NOW'
                        : `${scrubOffset > 0 ? '+' : ''}${scrubOffset}h`}
                </span>
            </div>

            {/* Track */}
            <div
                ref={trackRef}
                className="relative h-10 cursor-pointer rounded-lg"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                style={{ touchAction: 'none' }}
            >
                {/* Background bar */}
                <div className="absolute inset-x-0 top-4 h-2 bg-white/5 rounded-full" />

                {/* Optimization window bands */}
                {windowBands.map(band => (
                    <div
                        key={band.key}
                        className="absolute top-3 h-4 rounded-sm"
                        style={{
                            left: `${band.left}%`,
                            width: `${Math.max(band.width, 1)}%`,
                            backgroundColor: band.color,
                        }}
                    />
                ))}

                {/* "NOW" marker */}
                <div
                    className="absolute top-2 h-6 w-px bg-white/30"
                    style={{ left: `${offsetToPercent(0)}%` }}
                />

                {/* Tick marks */}
                {ticks.map(tick => (
                    <div
                        key={tick.offset}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${offsetToPercent(tick.offset)}%`, transform: 'translateX(-50%)' }}
                    >
                        <div
                            className={`w-px ${tick.isMajor ? 'h-2 bg-white/20' : 'h-1 bg-white/8'}`}
                            style={{ marginTop: tick.isMajor ? '10px' : '12px' }}
                        />
                        {tick.label && (
                            <span className={`text-[8px] mt-0.5 ${tick.label === 'NOW'
                                    ? 'text-white/50 font-bold'
                                    : 'text-gray-600'
                                }`}>
                                {tick.label}
                            </span>
                        )}
                    </div>
                ))}

                {/* Scrub thumb */}
                <motion.div
                    className="absolute top-2 w-4 h-6 -ml-2 rounded-md bg-gradient-to-b from-violet-400 to-violet-600 shadow-lg shadow-violet-500/30 border border-violet-300/30"
                    style={{ left: `${thumbPosition}%` }}
                    animate={{ left: `${thumbPosition}%` }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
            </div>
        </div>
    );
};

export default TimelineScrubber;
