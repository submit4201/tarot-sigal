/**
 * SpatialTarotCard — 3D-flipping tarot card with Framer Motion physics
 * and SVG hotspot overlays.
 *
 * Architecture:
 *  ┌──────────────────────┐
 *  │ div (drag container)  │ ← drag via @use-gesture
 *  │  ┌──────────────────┐│
 *  │  │ motion.div (pos)  ││ ← x/y/rotate motion values
 *  │  │  ┌──────────────┐││
 *  │  │  │motion.div flip│││ ← rotateY spring
 *  │  │  │ ┌── BACK ───┐│││
 *  │  │  │ ├── FRONT ──┤│││
 *  │  │  │ │ <image>    ││││
 *  │  │  │ │ <svg> zones││││ ← hotspot overlay
 *  │  │  │ └────────────┘│││
 *  │  │  └──────────────┘││
 *  │  └──────────────────┘│
 *  └──────────────────────┘
 *
 * @note Spring config: stiffness 300, damping 30 per spec.
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { useApp } from '../../context/AppContext';
import { ELEMENT_HEX_COLORS } from '../../constants';
import { AIBub } from './AIBub';
import type { SpatialCard, ManifestHotspot } from '../../types/tarot-spatial';
import type { TarotCard } from '../../types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CARD_W = 280;
const CARD_H = 450;
const FLIP_SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };
const SVG_VIEWBOX = '0 0 280 450';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface SpatialTarotCardProps {
    spatialCard: SpatialCard;
    /** Callback when the card is clicked/tapped */
    onFlip?: (cardId: string) => void;
    /** Callback when a hotspot is hovered */
    onHotspotHover?: (hotspot: ManifestHotspot | null) => void;
    /** Whether to show hotspot overlays (only when flipped face-up) */
    showOverlays?: boolean;
    /** Extra className for the outer container */
    className?: string;
    /** Callback when drag gesture starts */
    onDragStart?: (cardId: string) => void;
    /** Callback when drag gesture is active */
    onDrag?: (cardId: string, position: { x: number; y: number }) => void;
    /** Callback when drag gesture ends */
    onDragEnd?: (cardId: string, position: { x: number; y: number }) => void;
    audioIntensity?: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const SpatialTarotCard: React.FC<SpatialTarotCardProps> = ({
    spatialCard,
    onFlip,
    onHotspotHover,
    showOverlays = true,
    className = '',
    onDragStart,
    onDrag,
    onDragEnd,
    audioIntensity,
}) => {
    const { getCardImagePath, getDeckBackPath, activeDeckId } = useApp();

    const {
        card,
        manifest,
        isFlipped,
        isReversed,
        isSynergistic,
        position,
        rotation,
    } = spatialCard;

    const tarotCard = card as TarotCard;
    const elementColor = (ELEMENT_HEX_COLORS as any)[tarotCard.element || 'Air'] || '#6E7BFF';

    /* ---- Drag gesture ---- */
    const x = useMotionValue(position.x);
    const y = useMotionValue(position.y);

    const containerRef = useRef<HTMLDivElement>(null);

    const bind = useDrag(
        ({ first, last, offset: [ox, oy], memo }) => {
            if (first && onDragStart) onDragStart(card.id);
            x.set(ox);
            y.set(oy);
            if (onDrag) onDrag(card.id, { x: ox, y: oy });
            if (last && onDragEnd) onDragEnd(card.id, { x: ox, y: oy });
            return memo;
        },
        {
            from: () => [x.get(), y.get()],
            filterTaps: true,
        }
    );

    /* ---- Hotspot interaction state ---- */
    const [activeHotspot, setActiveHotspot] = useState<ManifestHotspot | null>(null);
    const [hotspotPos, setHotspotPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleHotspotEnter = useCallback(
        (hs: ManifestHotspot, e: React.MouseEvent) => {
            setActiveHotspot(hs);
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setHotspotPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top - 60,
                });
            }
            onHotspotHover?.(hs);
        },
        [onHotspotHover]
    );

    const handleHotspotLeave = useCallback(() => {
        setActiveHotspot(null);
        onHotspotHover?.(null);
    }, [onHotspotHover]);

    /* ---- Derived tilt from mouse ---- */
    const rotateXMv = useMotionValue(0);
    const rotateYMv = useMotionValue(0);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const pctX = (e.clientX - cx) / (rect.width / 2);
            const pctY = (e.clientY - cy) / (rect.height / 2);
            rotateYMv.set(pctX * 8);
            rotateXMv.set(-pctY * 8);
        },
        [rotateXMv, rotateYMv]
    );

    const handleMouseLeave = useCallback(() => {
        rotateXMv.set(0);
        rotateYMv.set(0);
    }, [rotateXMv, rotateYMv]);

    /* ---- Image paths ---- */
    const frontImg = getCardImagePath(card.id);
    const backImg = getDeckBackPath(activeDeckId);

    /* ---- Synergy glow ---- */
    const synergyStyle: React.CSSProperties = isSynergistic
        ? { '--synergy-color': elementColor } as React.CSSProperties
        : {};

    /* ---- Hotspot glow color map (matches ManifestHotspot.glow_type enum) ---- */
    const glowColorMap: Record<string, string> = {
        shimmer_static: `${elementColor}66`,
        slow_burn: `${elementColor}cc`,
        pulse_auric: `${elementColor}99`,
    };

    /* ---- Derived rotateY transform: combines tilt + flip ---- */
    const composedRotateY = useTransform(rotateYMv, (v) => (isFlipped ? 180 + v : v));

    return (
        /* Outer div handles drag via @use-gesture (avoids type conflict with motion.div) */
        <div
            ref={containerRef}
            className={`absolute cursor-grab active:cursor-grabbing ${className}`}
            style={{ zIndex: position.z + 10 }}
            {...bind()}
        >
            {/* Motion wrapper for x/y translation and rotation */}
            <motion.div
                style={{ x, y, rotate: rotation }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Perspective container */}
                <div
                    className="relative select-none"
                    style={{
                        width: CARD_W,
                        height: CARD_H,
                        perspective: 1500,
                    }}
                >
                    {/* Flip container — Framer Motion rotateY */}
                    <motion.div
                        className="relative w-full h-full"
                        style={{
                            transformStyle: 'preserve-3d',
                            rotateX: rotateXMv,
                            rotateY: composedRotateY,
                        }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={FLIP_SPRING}
                        onClick={() => onFlip?.(card.id)}
                    >
                        {/* =========== BACK FACE =========== */}
                        <div
                            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <img
                                src={backImg}
                                alt="Card back"
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                            {/* Scanline overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px] pointer-events-none opacity-20" />
                            {/* Shimmer */}
                            <div className="absolute inset-0 shimmer-reveal pointer-events-none opacity-30" />
                        </div>

                        {/* =========== FRONT FACE =========== */}
                        <div
                            className={`absolute inset-0 rounded-2xl overflow-hidden border shadow-2xl ${isSynergistic
                                ? 'border-current synergy-card'
                                : 'border-white/10'
                                }`}
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                boxShadow: audioIntensity && audioIntensity > 0
                                    ? `0 0 ${10 + audioIntensity * 30}px ${elementColor}88`
                                    : undefined,
                                ...synergyStyle,
                            }}
                        >
                            {/* Card art */}
                            <img
                                src={frontImg}
                                alt={tarotCard.name}
                                className={`w-full h-full object-cover ${isReversed ? 'rotate-180' : ''}`}
                                draggable={false}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.opacity = '0';
                                }}
                            />

                            {/* Depth overlays */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

                            {/* ---- SVG Hotspot Overlay ---- */}
                            {showOverlays && manifest?.hotspots && isFlipped && (
                                <svg
                                    viewBox={SVG_VIEWBOX}
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    style={{ zIndex: 50 }}
                                >
                                    <defs>
                                        <filter id={`hs-glow-${card.id}`}>
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feMerge>
                                                <feMergeNode in="blur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {manifest.hotspots.map((hs) => (
                                        <path
                                            key={hs.id}
                                            d={hs.contour}
                                            fill="transparent"
                                            stroke={glowColorMap[hs.glow_type] || elementColor}
                                            strokeWidth={1.5 + (audioIntensity || 0) * 2}
                                            strokeDasharray="6 4"
                                            opacity={activeHotspot?.id === hs.id ? 1 : 0.45 + (audioIntensity || 0) * 0.4}
                                            filter={
                                                activeHotspot?.id === hs.id
                                                    ? `url(#hs-glow-${card.id})`
                                                    : undefined
                                            }
                                            className="pointer-events-auto cursor-pointer transition-opacity duration-300"
                                            style={{
                                                animation: hs.glow_type === 'pulse_auric'
                                                    ? 'synergy-pulse 2s ease-in-out infinite'
                                                    : undefined,
                                            }}
                                            onMouseEnter={(e) =>
                                                handleHotspotEnter(hs, e as unknown as React.MouseEvent)
                                            }
                                            onMouseLeave={handleHotspotLeave}
                                        />
                                    ))}
                                </svg>
                            )}

                            {/* Card name footer */}
                            <div className="absolute bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                                <p className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-purple-400 mb-0.5">
                                    {tarotCard.arcana || 'Signal'} Phase
                                </p>
                                <h3
                                    className="text-lg font-bold font-dm-sans tracking-tight leading-tight neon-glow"
                                    style={{ color: elementColor }}
                                >
                                    {tarotCard.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/40">
                                        {isReversed ? 'INVERTED' : 'UPRIGHT'}
                                    </span>
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${isReversed ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.6)]'
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ---- AI Bub tooltip ---- */}
                    <AnimatePresence>
                        {activeHotspot && (
                            <AIBub
                                hotspot={activeHotspot}
                                position={hotspotPos}
                                elementColor={elementColor}
                                cardId={card.id}
                                cardName={tarotCard.name}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default SpatialTarotCard;
