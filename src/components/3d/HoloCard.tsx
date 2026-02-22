import React from 'react';
import { useSpring, animated } from 'react-spring';
import { DrawnDivinationCard } from '../../types';
import { CardBack } from '../CardBack';
// Assuming DivinationCardDisplay is strictly for the card face content or we refactor it.
// For HoloCard, we want a custom implementation that handles the 3D flip and shatter.
// We can reuse DivinationCardDisplay for the FACE.

interface HoloCardProps {
    card: DrawnDivinationCard;
    isRevealed: boolean;
    onClick?: () => void;
    className?: string;
    deckId?: string;
}

export const HoloCard: React.FC<HoloCardProps> = ({ card, isRevealed, onClick, className, deckId = 'tarot' }) => {

    // Flip animation
    const { rotateY } = useSpring({
        rotateY: isRevealed ? 180 : 0,
        config: { mass: 5, tension: 500, friction: 80 }
    });

    // Back face: front facing initially, rotates away to 180deg
    const backStyle = {
        transform: rotateY.to(val => `perspective(600px) rotateY(${val}deg)`),
        position: 'absolute' as 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden' as 'hidden',
        WebkitBackfaceVisibility: 'hidden' as 'hidden',
    };

    // Front face: flipped 180deg initially, rotates to 360deg (0deg)
    const frontStyle = {
        transform: rotateY.to(val => `perspective(600px) rotateY(${val + 180}deg)`),
        position: 'absolute' as 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden' as 'hidden',
        WebkitBackfaceVisibility: 'hidden' as 'hidden',
    };


    return (
        <div className={`relative ${className}`} onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
            if (onClick) onClick();
        }}>
            {/* Card Back Container */}
            <animated.div style={backStyle} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black">
                <CardBack deckId={deckId} />
                {/* Glass Shatter Overlay would go here as another absolute layer triggered on click before reveal */}
            </animated.div>

            {/* Card Front Container */}
            <animated.div style={frontStyle} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-purple-500/50 bg-black">
                <img
                    src={`/assets/cards/${deckId}/${card.card.id}.png`}
                    alt={card.card.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${card.isReversed ? 'rotate-180' : ''}`}
                    onError={(e) => {
                        // Fallback to the generated generic tarot front if specific image is missing
                        (e.target as HTMLImageElement).src = '/assets/cards/tarot/generic_front.png';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                {/* Text overlay for visibility just in case */}
                <div className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-2">
                    {card.card.name} {card.isReversed ? '(Rev)' : ''}
                </div>
            </animated.div>
        </div>
    );
};
