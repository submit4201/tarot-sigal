
import React, { useEffect, useState } from 'react';
import { DrawnDivinationCard } from '../../types';
import HolographicCard from '../HolographicCard';

interface RevealPhaseProps {
    cards: DrawnDivinationCard[];
    onComplete: () => void;
}

const RevealPhase: React.FC<RevealPhaseProps> = ({ cards, onComplete }) => {
    const [stage, setStage] = useState(0); // 0: Explosion, 1: Beams, 2-4: Cards, 5: Done

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 800), // Explosion done, beams start
            setTimeout(() => setStage(2), 1500), // Past
            setTimeout(() => setStage(3), 3000), // Present
            setTimeout(() => setStage(4), 4500), // Future
            setTimeout(() => { setStage(5); setTimeout(onComplete, 2500); }, 6500)
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 bg-[#030407] overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10"></div>

            {/* EXPLOSION EFFECT (Stage 0) */}
            {stage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-1 h-1 bg-white rounded-full animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_100px_white]"></div>
                    <div className="absolute w-[200vw] h-[200vw] bg-radial-gradient from-purple-500/50 to-transparent opacity-0 animate-[pulse_0.5s_ease-out_forwards]"></div>
                </div>
            )}

            {/* LIGHT BEAMS (Stage 1+) */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${stage >= 1 && stage < 5 ? 'opacity-100' : 'opacity-0'}`}>
                {/* 3 Beams corresponding to card positions */}
                <div className={`absolute top-1/2 left-[20%] w-1 h-[200vh] -translate-y-1/2 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent transform -rotate-12 transition-all duration-500 ${stage >= 2 ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute top-1/2 left-[50%] w-1 h-[200vh] -translate-y-1/2 bg-gradient-to-b from-transparent via-teal-500/50 to-transparent transition-all duration-500 ${stage >= 3 ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`absolute top-1/2 left-[80%] w-1 h-[200vh] -translate-y-1/2 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent transform rotate-12 transition-all duration-500 ${stage >= 4 ? 'opacity-0' : 'opacity-100'}`}></div>
            </div>

            <div className="flex gap-4 md:gap-12 items-center perspective-[2000px] z-10">
                {/* PAST */}
                <div className={`relative transition-all duration-700 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-40 rotate-[-20deg]'}`}>
                    {stage >= 2 && <div className="absolute -inset-4 bg-purple-500/20 blur-xl animate-pulse -z-10"></div>}
                    <HolographicCard
                        card={cards[0]}
                        isRevealed={stage >= 2}
                        className="w-[25vw] h-[38vw] max-w-[240px] max-h-[380px]"
                    />
                </div>

                {/* PRESENT */}
                <div className={`relative transition-all duration-700 ease-out delay-100 ${stage >= 3 ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-40 scale-90'}`}>
                    {stage >= 3 && <div className="absolute -inset-6 bg-teal-500/20 blur-2xl animate-pulse -z-10"></div>}
                    <HolographicCard
                        card={cards[1]}
                        isRevealed={stage >= 3}
                        className="w-[28vw] h-[42vw] max-w-[280px] max-h-[440px] z-20"
                    />
                </div>

                {/* FUTURE */}
                <div className={`relative transition-all duration-700 ease-out delay-200 ${stage >= 4 ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-40 rotate-[20deg]'}`}>
                    {stage >= 4 && <div className="absolute -inset-4 bg-purple-500/20 blur-xl animate-pulse -z-10"></div>}
                    <HolographicCard
                        card={cards[2]}
                        isRevealed={stage >= 4}
                        className="w-[25vw] h-[38vw] max-w-[240px] max-h-[380px]"
                    />
                </div>
            </div>

            <div className={`absolute bottom-20 text-center transition-opacity duration-1000 ${stage < 5 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="font-mono text-purple-400 text-xs uppercase tracking-[0.5em] animate-pulse">
                    {stage === 0 ? 'IGNITING_VORTEX...' : stage === 1 ? 'TRIANGULATING_SIGNAL...' : stage === 2 ? 'ANCHORING_PAST...' : stage === 3 ? 'LOCKING_PRESENT...' : 'PROJECTING_FUTURE...'}
                </p>
            </div>
        </div>
    );
};

export default RevealPhase;
