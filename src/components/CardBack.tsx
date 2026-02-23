import React, { useState, useEffect, useMemo } from 'react';
import { SunIcon } from './icons';
import { useApp } from '../context/AppContext';

export const CardBack: React.FC<{ className?: string, deckId?: string, animated?: boolean }> = ({ className, deckId, animated = false }) => {
    const { getDeckBackPath, getCardImagePath } = useApp();
    const [currentCardId, setCurrentCardId] = useState('maj_0');
    const [fade, setFade] = useState(true);

    // List of card IDs to cycle through for the animated preview
    const cycleIds = useMemo(() => [
        'maj_0', 'maj_1', 'maj_2', 'maj_6', 'maj_10', 'maj_13', 'maj_15', 'maj_21',
        'w_1', 'c_1', 's_1', 'p_1', 's_10', 'w_k', 'c_q'
    ], []);

    useEffect(() => {
        if (!animated) return;

        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                const nextId = cycleIds[Math.floor(Math.random() * cycleIds.length)];
                setCurrentCardId(nextId);
                setFade(true);
            }, 300); // Small delay for fade out
        }, 2000); // 2 second loop as requested

        return () => clearInterval(interval);
    }, [animated, cycleIds]);

    const backSrc = animated
        ? getCardImagePath(currentCardId, deckId)
        : getDeckBackPath(deckId);

    return (
        <div className={`absolute inset-0 [backface-visibility:hidden] glass-panel rounded-2xl border-white/10 flex flex-col items-center justify-center overflow-hidden bg-[#0a0b12] ${className}`}>
            <img
                src={backSrc}
                alt="Card Back"
                className={`w-full h-full object-cover transition-all duration-500 pointer-events-none ${fade ? 'opacity-80 scale-100' : 'opacity-0 scale-105'}`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (animated) {
                        // If animated face fails, pick another one immediately
                        const nextId = cycleIds[Math.floor(Math.random() * cycleIds.length)];
                        setCurrentCardId(nextId);
                    } else {
                        target.style.display = 'none';
                        if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                    }
                }}
            />

            {/* Fallback CSS backing if image fails */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white/5">
                        <SunIcon className="w-full h-full text-white/5" />
                    </div>
                </div>
                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-[10px] font-mono font-bold tracking-[0.8em] uppercase text-white/20">GRIDPUNK</h3>
                    <h3 className="text-[10px] font-mono font-bold tracking-[0.8em] uppercase text-white/20">ARCANA</h3>
                </div>
            </div>
        </div>
    );
};
