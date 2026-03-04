import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Deck } from '../../types';
import { AnimatedCardFront } from '../AnimatedCardFront';
import { SparklesIcon } from '../icons';

interface DeckShowcaseProps {
    decks: Deck[];
    ownedDeckIds: string[];
    activeDeckId: string;
    stardust: number;
    hasRequiredTier: (tier?: 'free' | 'seeker' | 'mystic' | 'oracle') => boolean;
    onPurchase: (deck: Deck) => void;
    onSetActive: (deckId: string) => void;
    onPreviewDraw: (deckId: string) => void;
}

export const DeckShowcase: React.FC<DeckShowcaseProps> = ({
    decks,
    ownedDeckIds,
    activeDeckId,
    stardust,
    hasRequiredTier,
    onPurchase,
    onSetActive,
    onPreviewDraw
}) => {
    const [focusedIndex, setFocusedIndex] = useState(0);

    // Dynamic background colors based on focused deck
    const getThemeColors = (deckId: string) => {
        switch (deckId) {
            case 'cyberpunk': return { from: 'from-fuchsia-900/20', to: 'to-cyan-900/10', text: 'text-fuchsia-400' };
            case 'neon_city': return { from: 'from-blue-900/30', to: 'to-purple-900/10', text: 'text-blue-400' };
            case 'glitch': return { from: 'from-green-900/20', to: 'to-emerald-900/10', text: 'text-green-400' };
            case 'synthwave': return { from: 'from-pink-900/20', to: 'to-orange-900/10', text: 'text-pink-400' };
            default: return { from: 'from-purple-900/20', to: 'to-teal-900/10', text: 'text-purple-400' };
        }
    };

    const focusedDeck = decks[focusedIndex];
    const theme = getThemeColors(focusedDeck?.id);

    const handleNext = () => setFocusedIndex((prev) => (prev + 1) % decks.length);
    const handlePrev = () => setFocusedIndex((prev) => (prev - 1 + decks.length) % decks.length);

    return (
        <div className="relative w-full flex flex-col items-center justify-center py-4 min-h-[700px] mt-4">
            {/* Dynamic Background Glow */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${theme.from} ${theme.to} blur-3xl opacity-50 z-0 transition-all duration-1000`}
                key={focusedDeck?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
            />

            {/* Carousel Navigation */}
            <div className="absolute top-[200px] left-4 md:left-12 z-50">
                <button onClick={handlePrev} className="p-4 rounded-full glass-panel border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white/50 group-hover:text-white transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
            </div>

            <div className="absolute top-[200px] right-4 md:right-12 z-50">
                <button onClick={handleNext} className="p-4 rounded-full glass-panel border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white/50 group-hover:text-white transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            {/* Carousel Content */}
            <div className="relative w-full max-w-5xl h-[600px] flex justify-center perspective-1000 z-10 pt-8">
                <AnimatePresence mode="popLayout" initial={false}>
                    {decks.map((deck, idx) => {
                        const isFocused = idx === focusedIndex;
                        const offset = idx - focusedIndex;

                        // Treat array as circular for display logic
                        let visualOffset = offset;
                        if (offset > decks.length / 2) visualOffset -= decks.length;
                        if (offset < -decks.length / 2) visualOffset += decks.length;

                        const isVisible = Math.abs(visualOffset) <= 2;

                        if (!isVisible) return null;

                        const isOwned = ownedDeckIds.includes(deck.id) || deck.price === 0;
                        const isActive = activeDeckId === deck.id;
                        const tierMet = hasRequiredTier(deck.tierRequirement);
                        const canAfford = stardust >= (deck.price || 0) && tierMet;

                        return (
                            <motion.div
                                key={deck.id}
                                className="absolute top-0 flex flex-col items-center"
                                // Base carousel z-index is lower (0-10) to let scatter cards easily sit above
                                initial={{ opacity: 0, x: visualOffset * 300, scale: 0.8, zIndex: 5 - Math.abs(visualOffset) }}
                                animate={{
                                    opacity: isFocused ? 1 : 0.4,
                                    x: visualOffset * 220,
                                    scale: isFocused ? 1 : 0.75,
                                    zIndex: isFocused ? 15 : 5 - Math.abs(visualOffset),
                                    rotateY: visualOffset * -15
                                }}
                                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                                onClick={() => !isFocused && setFocusedIndex(idx)}
                            >
                                <div className={`relative w-[260px] ${isFocused ? 'cursor-default' : 'cursor-pointer'}`}>
                                    {/* Fanned out background cards for focused deck. 
                                        Using a wrapper with z-10 so they sit tightly behind the main card (z-20) 
                                        but above the carousel items which max out at z-10 (but typically lower due to offset).
                                    */}
                                    {isFocused && (
                                        <div className="absolute inset-x-0 bottom-[140px] z-10">
                                            <motion.div className="absolute -inset-6 bg-white/5 rounded-2xl blur-xl" layoutId="highlight-ring" />
                                            {[...Array(7)].map((_, i) => {
                                                const offset = i - 3; // -3 to 3
                                                // Predefined pseudo-random tilts for a "thrown" scattered look
                                                const tilts = [-18, 12, -7, 0, 15, -10, 20];
                                                const animateRotate = tilts[i];
                                                // Fan them out wider and higher so they stand out from the carousel
                                                const animateX = offset * 120;
                                                const animateY = Math.abs(offset) * 15 - 350;

                                                return (
                                                    <motion.div
                                                        key={`fan-${deck.id}-${i}`}
                                                        style={{ transformOrigin: "center center" }}
                                                        // Start completely centered and small, hiding behind the main card location
                                                        initial={{ opacity: 0, rotate: 0, x: 0, y: -100, scale: 0.1, zIndex: 1 }}
                                                        // Emerge into the fanned out state
                                                        animate={{ opacity: 1, rotate: animateRotate, x: animateX, y: animateY, scale: 0.55, zIndex: 5 }}
                                                        // Hover pops them up even more
                                                        whileHover={{ scale: 0.65, y: animateY - 30, zIndex: 20 }}
                                                        transition={{ duration: 0.8, delay: Math.abs(offset) * 0.08 + Math.random() * 0.15, type: "spring", bounce: 0.4 }}
                                                        className="absolute inset-x-0 bottom-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] cursor-pointer group"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPreviewDraw(deck.id);
                                                        }}
                                                    >
                                                        <div className="pointer-events-auto w-full h-full relative group-hover:ring-2 group-hover:ring-teal-400/50 rounded-2xl transition-all">
                                                            <AnimatedCardFront deckId={deck.id} randomSeed={i * 7 + (deck.name.length)} />
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    {/* Main Card */}
                                    <div className="relative z-20 w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)] flex flex-col items-center">
                                        {/* Pedestal Glow */}
                                        {isFocused && (
                                            <div className={`absolute -bottom-8 w-3/4 h-12 bg-gradient-to-t ${theme.from} to-transparent blur-xl rounded-full opacity-60 z-[-1] animate-pulse`} />
                                        )}
                                        <AnimatedCardFront deckId={deck.id} className={isFocused ? `ring-2 ring-white/30 shadow-[0_0_50px_rgba(255,255,255,0.15)] scale-105 transition-transform duration-700` : ''} />

                                        {/* Status Tags */}
                                        {isFocused && isActive && (
                                            <div className="absolute top-4 right-4 bg-teal-400 text-black px-3 py-1 rounded-full font-mono text-[8px] uppercase font-bold tracking-widest shadow-glow">Active</div>
                                        )}
                                        {isFocused && !isOwned && deck.tierRequirement && deck.tierRequirement !== 'free' && (
                                            <div className={`absolute top-4 left-4 border px-3 py-1 rounded-full font-mono text-[8px] uppercase font-bold tracking-widest shadow-glow ${tierMet ? 'bg-white/10 text-white/80 border-white/20' : 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                                                {deck.tierRequirement} Required
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions (Only visible when focused) */}
                                    <AnimatePresence>
                                        {isFocused && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="mt-6 flex flex-col items-center gap-3 w-full"
                                            >
                                                <h3 className={`text-2xl font-bold font-dm-sans ${theme.text} mb-1 drop-shadow-md`}>{deck.name}</h3>
                                                <p className="text-xs text-white/60 mb-2 max-w-[280px] text-center">{deck.description}</p>

                                                <div className="flex w-full gap-2">
                                                    {isOwned ? (
                                                        <button
                                                            onClick={() => onSetActive(deck.id)}
                                                            disabled={isActive}
                                                            className={`flex-1 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-[0.2em] transition-all border ${isActive
                                                                ? 'bg-white/5 text-white/20 border-white/5 cursor-default'
                                                                : 'bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-black shadow-glow'}`}
                                                        >
                                                            {isActive ? 'SIGNAL_LOCKED' : 'ESTABLISH_LINK'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => onPurchase(deck)}
                                                            disabled={!canAfford}
                                                            className={`flex-1 py-3 rounded-xl font-bold font-mono text-[10px] uppercase tracking-[0.2em] transition-all border flex items-center justify-center gap-2 ${canAfford
                                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black shadow-glow'
                                                                : !tierMet
                                                                    ? 'bg-red-500/5 border-red-500/20 text-red-400/40 cursor-not-allowed'
                                                                    : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'}`}
                                                        >
                                                            <SparklesIcon className="w-4 h-4" />
                                                            {canAfford
                                                                ? `ACQUIRE (${deck.price})`
                                                                : !tierMet
                                                                    ? `${deck.tierRequirement?.toUpperCase()}_LOCKED`
                                                                    : `LOW_ENERGY (${deck.price})`}
                                                        </button>
                                                    )}

                                                    {!isOwned && (
                                                        <button
                                                            onClick={() => onPreviewDraw(deck.id)}
                                                            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-mono text-[10px] uppercase font-bold transition-all"
                                                        >
                                                            Preview
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
