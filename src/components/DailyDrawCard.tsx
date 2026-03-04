import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { DrawnDivinationCard } from '../types';
import { useApp } from '../context/AppContext';

interface DailyDrawCardProps {
    drawnCard: DrawnDivinationCard | null;
    isRevealed: boolean;
    onReveal: () => void;
    className?: string;
}

const getElementGlowClass = (element?: string) => {
    switch (element?.toLowerCase()) {
        case 'fire': return 'drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]'; // red-500
        case 'water': return 'drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]'; // blue-500
        case 'earth': return 'drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]'; // green-500
        case 'air': return 'drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]'; // yellow-400
        default: return 'drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]'; // purple-500
    }
};

const DailyDrawCard: React.FC<DailyDrawCardProps> = ({ drawnCard, isRevealed, onReveal, className = '' }) => {
    const controls = useAnimation();
    const { getCardImagePath, activeDeckId } = useApp();
    const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);

    // Gestures for swipe up to reveal
    const bind = useDrag(({ movement: [, my], velocity: [, vy], direction: [, dy], cancel, tap }) => {
        if (isRevealed) return;

        if (tap) return; // handled by pointer events

        // Swipe up threshold
        if (my < -50 || (vy > 0.5 && dy === -1)) {
            cancel();
            onReveal();
        } else {
            // Spring back if not swiped far enough
            controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
    }, { filterTaps: true });

    // Handle long press
    const handlePointerDown = () => {
        if (isRevealed) return;
        const timer = setTimeout(() => {
            onReveal();
        }, 600); // 600ms long press
        setHoldTimer(timer);

        // Add a little squeeze animation while holding
        controls.start({ scale: 0.95 });
    };

    const handlePointerUp = () => {
        if (holdTimer) clearTimeout(holdTimer);
        setHoldTimer(null);
        if (!isRevealed) {
            controls.start({ scale: 1 });
        }
    };

    const handlePointerLeave = () => {
        if (holdTimer) clearTimeout(holdTimer);
        setHoldTimer(null);
        if (!isRevealed) {
            controls.start({ scale: 1 });
        }
    };

    useEffect(() => {
        if (isRevealed) {
            controls.start({ rotateY: 180, scale: 1, y: 0 });
        } else {
            controls.start({ rotateY: 0, scale: 1, y: 0 });
        }
    }, [isRevealed, controls]);

    // Construct the image URL based on card id and deck
    const imageUrl = drawnCard?.card ? getCardImagePath(drawnCard.card.id, activeDeckId) : '';
    const glowClass = isRevealed ? getElementGlowClass((drawnCard?.card as any)?.element) : '';

    return (
        <div className={`relative w-[280px] h-[480px] perspective-1000 ${className}`} {...(bind() as any)} style={{ touchAction: 'none' }}>
            <motion.div
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                animate={controls}
                className={`w-full h-full relative preserve-3d cursor-pointer ${glowClass} transition-shadow duration-[2000ms]`}
                initial={{ rotateY: 0, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
            >
                {/* Back of Card (Hidden State) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] border-2 border-purple-500/20 bg-black/80 overflow-hidden flex flex-col items-center justify-center p-8 text-center"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 100%)',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
                    }}
                >
                    <div className="absolute inset-0 opacity-20 transition-opacity animate-pulse pointer-events-none" style={{ background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)', backgroundSize: '200% 200%', animation: 'shimmer 3s infinite linear' }}></div>
                    <div className="w-16 h-16 rounded-full border border-purple-500/30 flex items-center justify-center mb-6 animate-spin-slow">
                        <div className="w-12 h-12 rounded-full border border-teal-500/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-glow animate-ping"></div>
                        </div>
                    </div>
                    <h3 className="text-purple-400 font-mono text-xs uppercase tracking-[0.4em] font-bold mb-2">Sigal Waits</h3>
                    <p className="text-text-muted text-[10px] font-sans">Swipe Up or Hold to Connect</p>
                </div>

                {/* Front of Card (Revealed State) */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-[2rem] border border-white/10 overflow-hidden bg-black"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {drawnCard && (
                        <div className={`w-full h-full relative ${drawnCard.isReversed ? 'rotate-180' : ''}`}>
                            <div className="w-full h-full animate-fade-in absolute inset-0 z-0 bg-cover bg-center opacity-40 blur-md scale-110" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
                            <img
                                src={imageUrl}
                                alt={drawnCard.card.name}
                                className="w-full h-full object-cover p-3 relative z-10"
                                onError={(e) => {
                                    // Fallback if image fails
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />

                            {/* Fallback View (only visible if image fails & is hidden) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-[-1] bg-black/60 backdrop-blur-md">
                                <h3 className="text-white font-serif text-2xl mb-2 leading-tight">{drawnCard.card.name}</h3>
                                <p className="text-purple-400 font-mono text-[10px] uppercase tracking-widest">{(drawnCard.card as any).arcana ? `${(drawnCard.card as any).arcana} Arcana` : ''}</p>
                            </div>

                        </div>
                    )}
                </div>
            </motion.div >
        </div >
    );
};

export default DailyDrawCard;
