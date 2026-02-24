import React from 'react';
import { SpreadType, DrawnDivinationCard } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import { CardBack } from '../CardBack';

interface PickingViewProps {
    selectedSpread: SpreadType | null;
    currentPickingIndex: number;
    fullDeckInPlay: DrawnDivinationCard[];
    drawnCards: (DrawnDivinationCard | null)[];
    onPickCard: (card: DrawnDivinationCard) => void;
    onHover: () => void;
    selectedDeckId?: string;
}

export const PickingView: React.FC<PickingViewProps> = ({
    selectedSpread,
    currentPickingIndex,
    fullDeckInPlay,
    drawnCards,
    onPickCard,
    onHover,
    selectedDeckId
}) => {
    const totalToPick = selectedSpread ? SPREAD_DETAILS[selectedSpread].cardCount : 1;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative overflow-hidden">
            <h2 className="text-4xl font-bold text-white mb-2 neon-glow tracking-tighter uppercase">Draw Your Cards</h2>
            <p className="text-text-muted font-mono text-sm uppercase tracking-widest mb-12">
                Select {totalToPick - currentPickingIndex} more {totalToPick - currentPickingIndex === 1 ? 'node' : 'nodes'}
            </p>

            {/* Fanned Deck Area */}
            <div className="relative w-full max-w-7xl h-[40vh] flex items-center justify-center mt-10">
                {/* Display all cards in play fanned out */}
                {fullDeckInPlay.map((card, i) => {
                    const total = fullDeckInPlay.length;
                    const offset = i - (total / 2);

                    // Robust Fan geometry
                    const rotate = offset * (140 / total);
                    const xTranslate = offset * (total > 40 ? 4 : 10);
                    const yTranslate = Math.abs(offset) * 1.5 + (Math.pow(offset, 2) * 0.05);

                    return (
                        <div
                            key={card.card.id + i}
                            onClick={() => onPickCard(card)}
                            onMouseEnter={() => onHover()}
                            className="absolute top-1/2 left-1/2 w-20 h-32 md:w-28 md:h-44 origin-bottom -mt-16 -ml-10 md:-mt-22 md:-ml-14 cursor-pointer transition-all duration-300 hover:-translate-y-24 hover:scale-110 hover:z-[1000] shadow-2xl group"
                            style={{
                                zIndex: i,
                                transform: `translate(calc(-50% + ${xTranslate}px), calc(-50% + ${yTranslate}px)) rotate(${rotate}deg)`
                            }}
                        >
                            <div className="w-full h-full rounded-xl border border-white/20 bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-teal-500/50 group-hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center overflow-hidden">
                                <CardBack deckId={selectedDeckId} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress Indicators */}
            <div className="mt-16 flex gap-3">
                {drawnCards.map((c, i) => (
                    <div key={i} className={`w-10 h-14 rounded-md border transition-all duration-500 ${c ? 'bg-purple-500/50 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-black/40 border-white/10'}`}></div>
                ))}
            </div>
        </div>
    );
};
