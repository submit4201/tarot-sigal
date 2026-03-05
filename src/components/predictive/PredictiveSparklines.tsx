/**
 * PredictiveSparklines — 48-hour multi-channel forecast chart.
 *
 * Renders four Recharts lines for the predictive channels:
 *   - Drive (Mars/Red)
 *   - Flow (Mercury/Blue)
 *   - Harmony (Venus/Green)
 *   - Frequency (Numerology/Violet)
 *
 * Features:
 *   - Custom tooltip with AI Bub insight integration
 *   - "Power Minute" markers for optimization windows
 *   - Scrubber position indicator (vertical reference line)
 *   - Responsive container with gradient fills
 *
 * @note This component is intentionally simple in its Recharts usage
 *       to maintain sub-100ms rendering on scrub interactions.
 */

import React, { useCallback } from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    CartesianGrid,
} from 'recharts';
import type { SparklinePoint, OptimizationWindow } from '../../types/predictive';
import { getInsightForPoint } from '../../hooks/usePredictiveEngine';

interface PredictiveSparklineProps {
    /** 48-hour sparkline data */
    data: SparklinePoint[];
    /** Optimization windows for overlay markers */
    optimizationWindows: OptimizationWindow[];
    /** Current scrub offset (hour) */
    scrubOffset: number;
    /** Callback when user hovers over a data point */
    onHoverPoint?: (point: SparklinePoint | null) => void;
}

/** Channel color palette */
const CHANNEL_COLORS = {
    drive: '#ef4444',
    flow: '#3b82f6',
    harmony: '#22c55e',
    frequency: '#a855f7',
};

/**
 * Custom tooltip that shows channel values and an AI Bub insight.
 */
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const point: SparklinePoint = payload[0]?.payload;
    if (!point) return null;

    const insight = getInsightForPoint(point);

    return (
        <div className="glass-panel p-3 rounded-lg border border-white/10 max-w-xs"
            style={{ backdropFilter: 'blur(16px)', background: 'rgba(15,15,25,0.9)' }}
        >
            <div className="text-xs text-gray-400 mb-2 font-mono">
                {point.label} • Hr {point.personalHourNum}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                {[
                    { key: 'drive', label: 'Drive', color: CHANNEL_COLORS.drive },
                    { key: 'flow', label: 'Flow', color: CHANNEL_COLORS.flow },
                    { key: 'harmony', label: 'Harmony', color: CHANNEL_COLORS.harmony },
                    { key: 'frequency', label: 'Freq', color: CHANNEL_COLORS.frequency },
                ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-gray-400 uppercase">{label}</span>
                        <span className="text-xs font-mono ml-auto" style={{ color }}>
                            {(point as any)[key]}
                        </span>
                    </div>
                ))}
            </div>

            {point.isActionWindow && (
                <div className="text-[10px] text-red-400 font-bold mb-1 tracking-wider">
                    ⚡ ACTION WINDOW
                </div>
            )}

            <div className="text-[11px] text-gray-300 italic border-t border-white/5 pt-2 mt-1">
                {insight}
            </div>
        </div>
    );
};

const PredictiveSparklines: React.FC<PredictiveSparklineProps> = ({
    data,
    optimizationWindows,
    scrubOffset,
    onHoverPoint,
}) => {
    const handleMouseMove = useCallback((e: any) => {
        if (e?.activePayload?.[0]?.payload && onHoverPoint) {
            onHoverPoint(e.activePayload[0].payload);
        }
    }, [onHoverPoint]);

    const handleMouseLeave = useCallback(() => {
        onHoverPoint?.(null);
    }, [onHoverPoint]);

    return (
        <div className="w-full h-48 md:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    margin={{ top: 8, right: 8, left: -20, bottom: 4 }}
                >
                    <defs>
                        {Object.entries(CHANNEL_COLORS).map(([key, color]) => (
                            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                        interval={5}
                    />

                    <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)' }}
                        tickLine={false}
                        axisLine={false}
                        tickCount={5}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeDasharray: '4 4' }}
                    />

                    {/* "Now" reference line */}
                    <ReferenceLine
                        x={data.find(d => d.hour === 0)?.label}
                        stroke="rgba(255,255,255,0.2)"
                        strokeDasharray="4 4"
                        label={{
                            value: 'NOW',
                            position: 'top',
                            fill: 'rgba(255,255,255,0.4)',
                            fontSize: 9,
                        }}
                    />

                    {/* Scrub position indicator */}
                    {scrubOffset !== 0 && (
                        <ReferenceLine
                            x={data.find(d => d.hour === scrubOffset)?.label}
                            stroke="#a855f7"
                            strokeWidth={2}
                            strokeDasharray="2 2"
                        />
                    )}

                    {/* Channel areas - ordered back to front */}
                    <Area
                        type="monotone"
                        dataKey="harmony"
                        stroke={CHANNEL_COLORS.harmony}
                        strokeWidth={1.5}
                        fill={`url(#gradient-harmony)`}
                        dot={false}
                        activeDot={{ r: 3, fill: CHANNEL_COLORS.harmony }}
                    />
                    <Area
                        type="monotone"
                        dataKey="frequency"
                        stroke={CHANNEL_COLORS.frequency}
                        strokeWidth={1.5}
                        fill={`url(#gradient-frequency)`}
                        dot={false}
                        activeDot={{ r: 3, fill: CHANNEL_COLORS.frequency }}
                    />
                    <Area
                        type="monotone"
                        dataKey="flow"
                        stroke={CHANNEL_COLORS.flow}
                        strokeWidth={1.5}
                        fill={`url(#gradient-flow)`}
                        dot={false}
                        activeDot={{ r: 3, fill: CHANNEL_COLORS.flow }}
                    />
                    <Area
                        type="monotone"
                        dataKey="drive"
                        stroke={CHANNEL_COLORS.drive}
                        strokeWidth={2}
                        fill={`url(#gradient-drive)`}
                        dot={false}
                        activeDot={{ r: 4, fill: CHANNEL_COLORS.drive }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PredictiveSparklines;
