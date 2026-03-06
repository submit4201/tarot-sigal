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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ManifestHotspot } from '../../types/tarot-spatial';
import { generateContentWithRetry } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';
import { generateCosmicBlueprint } from '../../services/cosmicService';

// Simple in-memory cache for the session to prevent spamming the LLM on hover
const AIBubCache = new Map<string, string>();

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
    /** Card ID for caching */
    cardId: string;
    /** Card name for prompt context */
    cardName?: string;
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

export const AIBub: React.FC<AIBubProps> = ({ hotspot, position, elementColor, cardId, cardName }) => {
    const { activeProfile, isPremium } = useApp();
    const [insight, setInsight] = useState<string>(hotspot.base_insight || '');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Reset state when hotspot changes before generation completes
        setInsight(hotspot.base_insight || '');
        setIsGenerating(false);

        const cacheKey = `${cardId}-${hotspot.id}`;
        if (AIBubCache.has(cacheKey)) {
            setInsight(AIBubCache.get(cacheKey)!);
            return;
        }

        if (!isPremium) {
            return; // Free users only get base insight
        }

        let isMounted = true;

        const fetchInsight = async () => {
            setIsGenerating(true);
            try {
                const cosmic = activeProfile ? generateCosmicBlueprint(activeProfile) : null;
                const lifePathInfo = cosmic ? `Life Path ${cosmic.lifePath.number} (${cosmic.lifePath.theme})` : 'Unknown';

                const prompt = `You are a cryptic cyberpunk tarot oracle.
Card: ${cardName || cardId}
Visual Element: ${hotspot.label}
Base Meaning: ${hotspot.base_insight}
User Life Path: ${lifePathInfo}

Generate a single 1-2 sentence real-time "snackable" insight connecting this visual element to the user's energy. Keep it punchy, mysterious, and cyberpunk-mystic. No intros, just the insight.`;

                const res = await generateContentWithRetry({
                    contents: prompt,
                    usePuter: true,
                    model: 'puter-chat'
                });

                if (res.text && isMounted) {
                    const cleanText = res.text.replace(/^["']|["']$/g, '').trim();
                    setInsight(cleanText);
                    AIBubCache.set(cacheKey, cleanText);
                }
            } catch (err) {
                console.warn('[AIBub] Failed to generate insight', err);
            } finally {
                if (isMounted) setIsGenerating(false);
            }
        };

        // Debounce slightly to prevent API spam on quick swipes
        const timer = setTimeout(() => {
            fetchInsight();
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [cardId, hotspot, isPremium, cardName, activeProfile]);
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
                <p className={`text-xs text-white/70 leading-relaxed font-light transition-opacity duration-300 ${isGenerating ? 'opacity-50 animate-pulse' : 'opacity-100'}`}>
                    {insight}
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
