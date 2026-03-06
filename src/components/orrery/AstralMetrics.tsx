import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { calculateDailyNumber, calculateMonthlyNumber, calculateYearlyNumber } from '../../services/tarotService';
import { generateCosmicBlueprint } from '../../services/cosmicService';
import { SparklesIcon, ActivityIcon } from '../icons';
import { usePredictiveEngine } from '../../hooks/usePredictiveEngine';
import {
    MomentumGauge,
    TimelineScrubber,
} from '../predictive';
import PredictiveSparklines from '../predictive/PredictiveSparklines';
import AstralBubInsight from '../predictive/AstralBubInsight';
import BentoMetricsGrid from '../predictive/BentoMetricsGrid';
import type { SparklinePoint } from '../../types/predictive';

/**
 * AstralMetrics — Predictive Dashboard.
 *
 * Rebuilt layout: Momentum Gauge hero → Predictive Sparklines →
 * Timeline Scrubber → Optimization Windows → Classic Blueprint.
 *
 * Preserves:
 *   - Tier-gating (premium lock overlay)
 *   - Glass-panel styling vocabulary
 *   - Numerological number displays
 *   - CosmicBlueprintDisplay integration
 *
 * @note The old 30-day deterministic chart has been replaced by the
 *       48-hour predictive sparklines driven by the transit engine.
 */
const AstralMetrics: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { activeProfile, isPremium } = useApp();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Classic numerology numbers (preserved)
    const dailyNumber = useMemo(() => calculateDailyNumber(today), [todayStr]);
    const monthlyNumber = useMemo(() => calculateMonthlyNumber(today), [todayStr]);
    const yearlyNumber = useMemo(() => calculateYearlyNumber(today), [todayStr]);

    const cosmicBlueprint = useMemo(
        () => activeProfile ? generateCosmicBlueprint(activeProfile) : null,
        [activeProfile]
    );

    // Predictive engine
    const engine = usePredictiveEngine();

    // Hover state for AI Bub insights
    const [hoveredPoint, setHoveredPoint] = useState<SparklinePoint | null>(null);

    if (!activeProfile || !cosmicBlueprint) return null;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 overflow-y-auto w-full h-full flex flex-col items-center">

            {/* Background radial glow + Action Mode pulse */}
            <div
                className="fixed inset-0 pointer-events-none transition-all duration-700"
                style={{
                    background: engine.isActionMode
                        ? 'radial-gradient(circle at 50% 0%, rgba(239,68,68,0.08), transparent 70%)'
                        : 'radial-gradient(circle at 50% 0%, rgba(234,179,8,0.05), transparent 70%)',
                }}
            />

            <div className="w-full max-w-6xl p-8 pt-24 pb-32 relative z-10 min-h-full flex flex-col">

                {/* ─── Header ─── */}
                <header className="flex justify-between items-center mb-12 w-full shrink-0">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-[0.3em] uppercase mb-2 text-amber-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                            Astral Metrics
                        </h1>
                        <p className="font-sans text-amber-500/50 tracking-widest uppercase text-xs">
                            Predictive dashboard — 48h optimization engine.
                        </p>
                    </div>

                    {/* Action Mode badge */}
                    {engine.isActionMode && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mr-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                            <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest font-bold">
                                Action Mode
                            </span>
                        </motion.div>
                    )}

                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/10 hover:border-amber-400 transition-all rounded-full drop-shadow-lg"
                    >
                        [ Return to Orrery ]
                    </button>
                </header>

                {/* ─── Hero: Momentum Gauge ─── */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="glass-panel p-10 rounded-[2rem] border-white/5 bg-black/40 backdrop-blur-xl w-full max-w-lg">
                        <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.4em] mb-6 font-bold text-center flex items-center justify-center gap-2">
                            <ActivityIcon className="w-4 h-4" /> Momentum_Gauge
                        </h3>
                        <MomentumGauge
                            syncScore={engine.syncScore}
                            channels={engine.channels}
                            isActionMode={engine.isActionMode}
                            personalDay={engine.personalDay}
                            universalFrequency={engine.universalFrequency}
                        />
                    </div>
                </motion.section>

                {/* ─── Main Grid ─── */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start flex-grow">

                    {/* Left Column: Sparklines + Timeline + Insight */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        {/* Predictive Sparklines */}
                        <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/5 bg-black/40 relative overflow-hidden group hover:border-violet-500/20 transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                    <SparklesIcon className="w-3 h-3" /> 48h_Prediction
                                </h3>
                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                    Drive · Flow · Harmony · Freq
                                </div>
                            </div>
                            <PredictiveSparklines
                                data={engine.sparklineData}
                                optimizationWindows={engine.optimizationWindows}
                                scrubOffset={engine.scrubOffset}
                                onHoverPoint={setHoveredPoint}
                            />
                        </div>

                        {/* Timeline Scrubber */}
                        <div className="glass-panel p-5 rounded-[2rem] border-white/5 bg-black/30">
                            <TimelineScrubber
                                scrubOffset={engine.scrubOffset}
                                onScrubChange={engine.setScrubOffset}
                                optimizationWindows={engine.optimizationWindows}
                                sparklineData={engine.sparklineData}
                            />
                        </div>

                        {/* AI Bub Insight (appears on hover + auto-spawned Bubs) */}
                        <AstralBubInsight
                            activePoint={hoveredPoint}
                            activeInsights={engine.activeInsights}
                        />

                        {/* Bento Grid Layout (Optimization + Numerology + Decryption) */}
                        <BentoMetricsGrid
                            isPremium={isPremium}
                            optimizationWindows={engine.optimizationWindows}
                            yearlyNumber={yearlyNumber}
                            monthlyNumber={monthlyNumber}
                            dailyNumber={dailyNumber}
                            personalDay={engine.personalDay}
                            lifePath={cosmicBlueprint.lifePath}
                        />
                    </motion.div>

                    {/* Right Column: Core Blueprint + Premium Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="lg:col-span-5 flex flex-col gap-8"
                    >

                        {/* Transit Aspects */}
                        {engine.transitAspects.length > 0 && (
                            <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-black/30">
                                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-4">
                                    Active_Transits
                                </h3>
                                <div className="space-y-2">
                                    {engine.transitAspects.slice(0, 8).map((asp, i) => (
                                        <div key={`${asp.planet}-${asp.natalPlanet}-${i}`}
                                            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-cyan-300 capitalize">{asp.planet}</span>
                                                <span className="text-[10px] text-gray-500">{asp.aspect}</span>
                                                <span className="text-xs font-mono text-gray-400 capitalize">{asp.natalPlanet}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-cyan-400"
                                                        style={{ width: `${asp.intensity}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-mono text-gray-500">
                                                    {asp.orb.toFixed(1)}°
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AstralMetrics;
