import React from 'react';
import { CardBack } from '../CardBack';

interface ChargingViewProps {
    hasShuffledEnough: boolean;
    shuffleEnergy: number;
    isShuffling: boolean;
    onShuffle: () => void;
    onMove: () => void;
    selectedDeckId?: string;
}

export const ChargingView: React.FC<ChargingViewProps> = ({
    hasShuffledEnough,
    shuffleEnergy,
    isShuffling,
    onShuffle,
    onMove,
    selectedDeckId
}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative overflow-hidden" onClick={onMove}>
            <h2 className="text-4xl font-bold text-white mb-2 neon-glow tracking-tighter uppercase">Algorithm Initialization</h2>
            <p className="text-text-muted font-mono text-sm uppercase tracking-widest mb-12">
                {hasShuffledEnough ? "Nodes Randomized" : "Injecting Entropy into the Deck"}
            </p>

            <div className="relative w-64 h-96 flex items-center justify-center mb-10">
                {/* Visual Representation of Shuffling */}
                <div
                    className={`cursor-pointer transition-all duration-300 w-full h-full rounded-2xl overflow-hidden shadow-2xl relative ${hasShuffledEnough ? 'border-purple-400 bg-purple-900/20 shadow-[0_0_40px_rgba(168,85,247,0.6)] scale-105' : 'border-teal-500/50 bg-black shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]'} border-2`}
                    onClick={onShuffle}
                    style={{
                        transform: isShuffling && !hasShuffledEnough ? `translateX(${Math.random() * 10 - 5}px) translateY(${Math.random() * 10 - 5}px) rotate(${Math.random() * 4 - 2}deg)` : ''
                    }}
                >
                    <CardBack deckId={selectedDeckId} />

                    {hasShuffledEnough && (
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent pointer-events-none animate-pulse"></div>
                    )}
                    {isShuffling && !hasShuffledEnough && (
                        <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay"></div>
                    )}
                </div>

                {/* Energy Ring */}
                {!hasShuffledEnough && (
                    <div className="absolute inset-[-40px] border-[2px] border-dashed border-teal-500/30 rounded-full animate-spin-slow pointer-events-none" style={{ opacity: shuffleEnergy / 100 }}></div>
                )}
            </div>

            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                {hasShuffledEnough ? 'Click Deck to Draw' : 'Click Deck repeatedly to Shuffle'}
            </p>

            {!hasShuffledEnough && (
                <div className="w-64 h-2 bg-black/50 border border-white/10 rounded-full mt-8 overflow-hidden relative">
                    <div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-teal-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${shuffleEnergy}%` }}
                    />
                </div>
            )}
        </div>
    );
};
