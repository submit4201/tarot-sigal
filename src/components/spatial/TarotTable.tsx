/**
 * TarotTable — The spatial workspace that orchestrates the reading.
 *
 * Renders a 3D-perspective stage populated with `SpatialTarotCard` children
 * positioned according to the active spread layout. Provides draw / reset
 * controls and spread selection.
 *
 * Layout uses CSS `perspective` on the outer container to achieve depth.
 * Cards are absolutely positioned children within the centred stage.
 *
 * @note This component is self-contained and can be mounted as a route
 *       or nested inside an existing page like DailyPage.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTarotEngine } from '../../hooks/useTarotEngine';
import { SpatialTarotCard } from './SpatialTarotCard';
import type { SpatialSpreadType, ManifestHotspot } from '../../types/tarot-spatial';

/* ------------------------------------------------------------------ */
/*  Spread options for the toolbar                                     */
/* ------------------------------------------------------------------ */

const SPREAD_OPTIONS: { value: SpatialSpreadType; label: string; count: number }[] = [
    { value: 'single', label: 'Single', count: 1 },
    { value: '3-card', label: 'Past · Present · Future', count: 3 },
    { value: 'cybernetic-cross', label: 'Cybernetic Cross', count: 5 },
    { value: 'celtic-cross', label: 'Celtic Cross', count: 10 },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const TarotTable: React.FC<{ className?: string }> = ({ className = '' }) => {
    const engine = useTarotEngine();
    const { cards, isLoading, activeSpread, draw, flipCard, setSpread, reset, astral } = engine;

    const [, setHoveredHotspot] = useState<ManifestHotspot | null>(null);

    /* ---- Determine draw count from active spread ---- */
    const spreadOption = SPREAD_OPTIONS.find((s) => s.value === activeSpread) || SPREAD_OPTIONS[1];

    const handleDraw = useCallback(() => {
        draw(spreadOption.count);
    }, [draw, spreadOption]);

    const handleSpreadChange = useCallback(
        (type: SpatialSpreadType) => {
            setSpread(type);
            // If cards are already drawn, re-draw for the new count
            if (cards.length > 0) {
                const opt = SPREAD_OPTIONS.find((s) => s.value === type);
                if (opt) draw(opt.count);
            }
        },
        [setSpread, cards.length, draw]
    );

    return (
        <div className={`relative w-full h-full min-h-screen bg-[#020305] overflow-hidden ${className}`}>
            {/* ---- Void background ---- */}
            <div className="absolute inset-0 z-0">
                {/* Radial void gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,123,255,0.06)_0%,transparent_70%)]" />
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(110,123,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(110,123,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Fog particles */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.04)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(45,212,191,0.03)_0%,transparent_50%)]" />
            </div>

            {/* ---- Top toolbar ---- */}
            <div className="relative z-50 flex items-center justify-between px-6 py-4">
                {/* Spread selector */}
                <div className="flex gap-2">
                    {SPREAD_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleSpreadChange(opt.value)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all duration-300 border ${activeSpread === opt.value
                                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleDraw}
                        disabled={isLoading}
                        className="px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-40 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {isLoading ? 'Channeling...' : 'Draw'}
                    </motion.button>

                    {cards.length > 0 && (
                        <motion.button
                            onClick={reset}
                            className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Clear
                        </motion.button>
                    )}
                </div>
            </div>

            {/* ---- Astral status ---- */}
            {astral.dailyNumber !== undefined && (
                <div className="relative z-40 flex items-center justify-center gap-6 py-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
                        Daily ∿ <span className="text-purple-400">{astral.dailyNumber}</span>
                    </span>
                    {astral.lifePath !== undefined && (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
                            Life Path ∿ <span className="text-teal-400">{astral.lifePath}</span>
                        </span>
                    )}
                    {astral.dominantElement && (
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
                            Element ∿ <span className="text-amber-400">{astral.dominantElement}</span>
                        </span>
                    )}
                </div>
            )}

            {/* ---- 3D Stage ---- */}
            <div
                className="relative z-10 flex items-center justify-center"
                style={{
                    perspective: 1800,
                    perspectiveOrigin: '50% 40%',
                    minHeight: 'calc(100vh - 140px)',
                }}
            >
                <div
                    className="relative"
                    style={{
                        transformStyle: 'preserve-3d',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {/* Centre origin for card positioning */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <AnimatePresence>
                            {cards.map((sc, i) => (
                                <motion.div
                                    key={sc.card.id}
                                    initial={{ opacity: 0, scale: 0.6, y: 80 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -40 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 22,
                                        delay: i * 0.12,
                                    }}
                                >
                                    <SpatialTarotCard
                                        spatialCard={sc}
                                        onFlip={flipCard}
                                        onHotspotHover={setHoveredHotspot}
                                        showOverlays
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ---- Empty state ---- */}
            {cards.length === 0 && !isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-purple-500/20 flex items-center justify-center bg-purple-500/5">
                            <span className="text-2xl">✦</span>
                        </div>
                        <p className="text-sm font-mono text-white/30 uppercase tracking-[0.3em] mb-2">
                            The void awaits
                        </p>
                        <p className="text-xs text-white/20 font-light max-w-xs">
                            Select a spread and draw cards to begin the reading
                        </p>
                    </motion.div>
                </div>
            )}

            {/* ---- Loading overlay ---- */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                            <span className="text-xs font-mono text-purple-300/70 uppercase tracking-widest">
                                Channeling the void...
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TarotTable;
