import React from 'react';
import { SpreadType, DrawnDivinationCard } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import { StaticSpreadBoard } from '../3d/StaticSpreadBoard';
import { SparklesIcon } from '../icons';

interface RevealingViewProps {
    selectedSpread: SpreadType;
    drawnCards: (DrawnDivinationCard | null)[];
    revealedIndices: Set<number>;
    onReveal: (index: number) => void;
    onRevealAll: () => void;
    onGenerateSummary: () => void;
    isGeneratingSummary: boolean;
    selectedDeckId?: string;
    error?: string;
}

export const RevealingView: React.FC<RevealingViewProps> = ({
    selectedSpread,
    drawnCards,
    revealedIndices,
    onReveal,
    onRevealAll,
    onGenerateSummary,
    isGeneratingSummary,
    selectedDeckId,
    error
}) => {
    return (
        <div className="w-full h-full relative bg-[#030407] animate-fade-in">
            <div className="absolute inset-x-0 top-0 h-16 z-20 bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <StaticSpreadBoard
                spreadType={selectedSpread}
                cards={drawnCards}
                revealedIndices={revealedIndices}
                onCardClick={onReveal}
                deckId={selectedDeckId}
            />

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {revealedIndices.size < SPREAD_DETAILS[selectedSpread].cardCount ? (
                    <button onClick={onRevealAll} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all font-mono uppercase tracking-widest border border-white/10">Reveal All</button>
                ) : (
                    <button onClick={onGenerateSummary} disabled={isGeneratingSummary} className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all text-white font-bold rounded-xl shadow-glow active:scale-95 flex items-center gap-2">
                        <SparklesIcon className={`w-5 h-5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                        <span className="font-mono uppercase tracking-widest">{isGeneratingSummary ? 'Synthesizing...' : 'Complete Reading'}</span>
                    </button>
                )}
            </div>
            {error && <div className="absolute top-20 left-1/2 -translate-x-1/2 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50 backdrop-blur-md">{error}</div>}
        </div>
    );
};
