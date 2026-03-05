/**
 * AIBub — Floating tooltip that surfaces AI insights when a hotspot is hovered.
 *
 * Renders as a compact glass-panel card with the hotspot label and its
 * base_insight text. Animated in/out with Framer Motion scale + fade.
 *
 * @note Future iteration will pipe the insight through the LM Studio oracle
 *       for contextual generation; for now it displays the manifest's
 *       `base_insight` verbatim.
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { ManifestHotspot } from '../../types/tarot-spatial';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AIBubProps {
    /** The hotspot being hovered */
    hotspot: ManifestHotspot;
    /** Pixel position relative to the card container */
    position: { x: number; y: number };
    /** Primary color derived from the card's element */
    elementColor: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const bubVariants = {
    initial: { opacity: 0, scale: 0.85, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 4 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AIBub: React.FC<AIBubProps> = ({ hotspot, position, elementColor }) => {
    return (
        <motion.div
            className="absolute z-[100] pointer-events-none"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)',
            }}
            variants={bubVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
            <div
                className="relative rounded-xl px-4 py-3 max-w-[220px] backdrop-blur-xl border shadow-2xl"
                style={{
                    background: 'rgba(5, 6, 10, 0.85)',
                    borderColor: `${elementColor}44`,
                    boxShadow: `0 0 20px ${elementColor}22, 0 8px 32px rgba(0,0,0,0.6)`,
                }}
            >
                {/* Hotspot label */}
                <div className="flex items-center gap-2 mb-1.5">
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: elementColor,
                            boxShadow: `0 0 6px ${elementColor}`,
                        }}
                    />
                    <span
                        className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
                        style={{ color: elementColor }}
                    >
                        {hotspot.label}
                    </span>
                </div>

                {/* Insight text */}
                <p className="text-xs text-white/70 leading-relaxed font-light">
                    {hotspot.base_insight}
                </p>

                {/* Glow type indicator */}
                <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-white/30">
                        zone
                    </span>
                    <span
                        className="text-[8px] font-mono uppercase tracking-widest"
                        style={{ color: `${elementColor}99` }}
                    >
                        {hotspot.glow_type}
                    </span>
                </div>

                {/* Decorative bottom bar */}
                <div
                    className="absolute bottom-0 left-3 right-3 h-[1px]"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${elementColor}66, transparent)`,
                    }}
                />
            </div>

            {/* Arrow pointing down */}
            <div
                className="w-0 h-0 mx-auto"
                style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid rgba(5, 6, 10, 0.85)`,
                }}
            />
        </motion.div>
    );
};

export default AIBub;
