import React from 'react';
import { SpreadType, DrawnDivinationCard } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import { HoloCard } from './HoloCard';

interface StaticSpreadBoardProps {
    spreadType: SpreadType;
    cards: (DrawnDivinationCard | null)[];
    revealedIndices: Set<number>;
    onCardClick?: (index: number) => void;
    deckId?: string;
}

export const StaticSpreadBoard: React.FC<StaticSpreadBoardProps> = ({
    spreadType,
    cards,
    revealedIndices,
    onCardClick,
    deckId
}) => {
    const layout = SPREAD_DETAILS[spreadType]?.layout;

    if (!layout) {
        return <div className="text-white font-mono text-center w-full h-full flex items-center justify-center">Spread Layout Data Missing</div>;
    }

    return (
        <div className="w-full h-full min-h-[500px] relative max-w-5xl mx-auto flex items-center justify-center py-20">
            <div className="relative w-full h-[60vh] max-h-[800px]">
                {cards.map((card, i) => {
                    const pos = layout[i];
                    if (!pos) return null;

                    return (
                        <div
                            key={i}
                            className="absolute pointer-events-auto transition-transform duration-500 hover:scale-105"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                                width: 'min(14vw, 160px)',
                                aspectRatio: '2/3',
                                zIndex: 10 + i
                            }}
                        >
                            {card ? (
                                <HoloCard
                                    card={card}
                                    isRevealed={revealedIndices.has(i)}
                                    onClick={() => onCardClick && onCardClick(i)}
                                    className="w-full h-full"
                                    deckId={deckId}
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl border border-white/10 bg-black/40 shadow-inner"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
