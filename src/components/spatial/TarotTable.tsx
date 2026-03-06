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

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTarotEngine } from '../../hooks/useTarotEngine';
import { useAudioFrequencySync } from '../../hooks/useAudioFrequencySync';
import { SpatialTarotCard } from './SpatialTarotCard';
import { ReadingSynthesis } from './ReadingSynthesis';
import { LiveOracleWebRTC } from './LiveOracleWebRTC';
import { useApp } from '../../context/AppContext';
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
/*  Config for Spread Zones calculation                                */
/* ------------------------------------------------------------------ */

const CARD_W = 280;
const CARD_H = 450;
const GAP = 40;

const getSpreadPositions = (type: SpatialSpreadType) => {
    switch (type) {
        case 'single': return [{ x: 0, y: 0 }];
        case '3-card': return [
            { x: -(CARD_W + GAP), y: 0 },
            { x: 0, y: 0 },
            { x: CARD_W + GAP, y: 0 },
        ];
        // Simplistic multi-card spreads for initial implementation
        case 'cybernetic-cross': return [
            { x: 0, y: 0 },
            { x: -(CARD_W + GAP), y: 0 },
            { x: CARD_W + GAP, y: 0 },
            { x: 0, y: -(CARD_H + GAP) },
            { x: 0, y: CARD_H + GAP },
        ];
        case 'celtic-cross': return Array.from({ length: 10 }).map((_, i) => ({
            x: (i % 5 - 2) * (CARD_W + 10) * 0.5,
            y: (Math.floor(i / 5) - 1) * (CARD_H + 10) * 0.5
        }));
        default: return [];
    }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const TarotTable: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { activeProfile } = useApp();
    const engine = useTarotEngine();
    const { deckStack, spreadCards, isLoading, activeSpread, draw, flipCard, setSpread, reset, astral, moveToSpread } = engine;

    const [hoveredHotspot, setHoveredHotspot] = useState<ManifestHotspot | null>(null);
    const [showSynthesis, setShowSynthesis] = useState(false);

    // Live Oracle Voice-UI Sync
    const [isOracleActive, setIsOracleActive] = useState(false);
    const audioIntensity = useAudioFrequencySync(isOracleActive);

    /* ---- Spread Geometry ---- */

    const spreadPositions = getSpreadPositions(activeSpread);

    /* ---- Draw/Reset ---- */
    const handleDraw = useCallback(() => {
        draw();
    }, [draw]);

    const handleSpreadChange = useCallback(
        (type: SpatialSpreadType) => {
            setSpread(type);
        },
        [setSpread]
    );

    /* ---- Drag and Drop Ref Logic ---- */
    // Use refs to check intersections between moving card and drop zones
    const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleCardDragEnd = async (cardId: string, info: any, startingPos: { x: number, y: number }) => {
        // Very basic AABB intersection check or distance check
        // We'll use distance to centre of zone for simplicity
        const dragFinalX = startingPos.x + info.offset.x;
        const dragFinalY = startingPos.y + info.offset.y;

        let closestZoneIndex = -1;
        let minDistanceSq = Infinity;

        // Tolerance for drop (radius squared)
        const DROP_TOLERANCE_SQ = (CARD_W / 2) * (CARD_W / 2) + (CARD_H / 2) * (CARD_H / 2);

        spreadPositions.forEach((pos, idx) => {
            // Check if slot is empty
            if (spreadCards[idx]) return;

            // Simplified: distance to center of zone.
            // (Assumes startingPos + offset is roughly comparable to zone pos)
            // In a real implementation we'd probably use `getBoundingClientRect` to map screen coords.
            const dx = dragFinalX - pos.x;
            const dy = dragFinalY - pos.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < minDistanceSq && distSq < DROP_TOLERANCE_SQ) {
                minDistanceSq = distSq;
                closestZoneIndex = idx;
            }
        });

        if (closestZoneIndex !== -1) {
            await moveToSpread(cardId, closestZoneIndex);
        }
    };

    /* ---- Synthesis Trigger ---- */
    const isSpreadComplete = spreadCards.length === spreadPositions.length && spreadCards.every(c => c && c.isFlipped);

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
            </div>

            {/* ---- Top toolbar ---- */}
            <div className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
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
                        {isLoading ? 'Shuffling...' : 'Shuffle Deck'}
                    </motion.button>

                    <AnimatePresence>
                        {isSpreadComplete && !showSynthesis && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setShowSynthesis(true)}
                                className="px-5 py-2 rounded-xl text-xs font-mono uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-500/50 hover:bg-teal-500/30 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                Synthesize
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {(deckStack.length > 0 || spreadCards.some(c => c)) && (
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
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-6 py-2 px-6 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
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
                className="absolute inset-0 z-10 flex items-center justify-center"
                style={{
                    perspective: 2000,
                    perspectiveOrigin: '50% 30%',
                }}
            >
                <div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Center Origin Component Container */}
                    <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>

                        {/* --- Drop Zones (Bento Grid) --- */}
                        {spreadPositions.map((pos, idx) => (
                            <div
                                key={`zone-${idx}`}
                                ref={(el) => { if (el) zoneRefs.current[idx] = el; }}
                                className={`absolute rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-500
                                    ${spreadCards[idx] ? 'border-transparent' : 'border-white/10 hover:border-purple-500/30 bg-black/20'}`}
                                style={{
                                    width: CARD_W,
                                    height: CARD_H,
                                    transform: `translate(-50%, -50%) translate3d(${pos.x}px, ${pos.y}px, -10px)`,
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {!spreadCards[idx] && (
                                    <span className="text-white/10 font-mono text-4xl">{idx + 1}</span>
                                )}
                            </div>
                        ))}

                        {/* --- Spread Cards (Flipped & Positioned) --- */}
                        <AnimatePresence>
                            {spreadCards.map((sc, i) => {
                                if (!sc) return null;
                                const pos = spreadPositions[i];
                                return (
                                    <motion.div
                                        key={`spread-${sc.card.id}`}
                                        className="absolute -translate-x-1/2 -translate-y-1/2"
                                        initial={false} // don't animate initial mount if it's jumping from deck
                                        animate={{
                                            x: pos.x,
                                            y: pos.y,
                                            z: 0,
                                            rotateX: 0,
                                            rotateY: 0,
                                            scale: 1
                                        }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <SpatialTarotCard
                                            spatialCard={sc}
                                            onFlip={flipCard}
                                            onHotspotHover={setHoveredHotspot}
                                            showOverlays
                                            audioIntensity={audioIntensity}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* --- Deck Stack (Bottom Right) --- */}
                    <div className="absolute right-0 bottom-0 p-12 pr-[15vw] pb-[10vh] origin-bottom-right" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateZ(-10deg)' }}>
                        <AnimatePresence>
                            {deckStack.map((sc, i) => {
                                // Calculate fanned position
                                const total = deckStack.length;
                                const offset = i - total / 2;

                                return (
                                    <motion.div
                                        key={`deck-${sc.card.id}`}
                                        className="absolute bottom-0 right-0 origin-bottom"
                                        initial={{ opacity: 0, y: 100, rotateZ: 0 }}
                                        animate={{
                                            opacity: 1,
                                            y: -i * 0.5, // Slight vertical stack
                                            x: offset * 3, // Fan out horizontally
                                            rotateZ: offset * 0.5, // Fan rotation
                                            z: i * 2 // Z stacking
                                        }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.01 }}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <SpatialTarotCard
                                            spatialCard={sc}
                                            showOverlays={false}
                                            onDragEnd={(info) => handleCardDragEnd(sc.card.id, info, {
                                                // Approximating start position relative to center for drop check.
                                                // This might need heavy tuning depending on perspective/screen size.
                                                x: (window.innerWidth / 2 - window.innerWidth * 0.15) + offset * 3,
                                                y: (window.innerHeight / 2)
                                            })}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ---- Empty state ---- */}
            {deckStack.length === 0 && spreadCards.every(c => !c) && !isLoading && (
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
                            Select a spread and shuffle the deck to begin.
                        </p>
                    </motion.div>
                </div>
            )}

            {/* ---- AI Bubs (Hotspot Insights) ---- */}
            <AnimatePresence>
                {hoveredHotspot && (
                    <motion.div
                        className="pointer-events-none fixed z-50 p-4 rounded-xl backdrop-blur-md bg-black/60 border border-white/10 shadow-lg max-w-xs"
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        // Simple positioning: we could use mouse tracking, but for now we'll center it at bottom
                        style={{
                            bottom: '10%',
                            left: '50%',
                            x: '-50%',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">{hoveredHotspot.label}</h4>
                            <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                                {hoveredHotspot.glow_type}
                            </span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-light">
                            {hoveredHotspot.base_insight}
                        </p>
                        {astral && (
                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
                                <span className="text-[10px] text-purple-300/80 font-mono">
                                    ✦ Resonance: {astral.dominantElement || 'Aether'}
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---- Synthesis Overlay ---- */}
            {showSynthesis && (
                <ReadingSynthesis
                    spreadCards={spreadCards}
                    spreadType={SPREAD_OPTIONS.find(o => o.value === activeSpread)?.label || activeSpread}
                    spreadId={activeSpread}
                    astral={astral}
                    onClose={() => setShowSynthesis(false)}
                />
            )}

            {/* Top Tier (Oracle) Live Audio Button */}
            {(activeProfile?.subscriptionTier === 'oracle') && (
                <AnimatePresence>
                    {isSpreadComplete && !showSynthesis && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setIsOracleActive(true)}
                            className="absolute bottom-10 right-10 px-8 py-3 rounded-none bg-black/60 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors relative overflow-hidden group"
                        >
                            <span className="font-mono text-sm uppercase tracking-[0.2em] relative z-10">
                                LIVE ORACLE
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            )}

            {/* ---- Live Oracle Tier Integration ---- */}
            <LiveOracleWebRTC
                spreadComplete={isSpreadComplete && !showSynthesis}
                isActive={isOracleActive}
                onToggle={(active) => setIsOracleActive(active)}
                audioIntensity={audioIntensity}
                userTier={activeProfile?.subscriptionTier as any || 'free'}
            />
        </div>
    );
};

export default TarotTable;
