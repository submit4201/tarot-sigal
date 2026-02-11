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
}

export const HoloCard: React.FC<HoloCardProps> = ({ card, isRevealed, onClick, className }) => {

    // Flip animation
    const { transform, opacity } = useSpring({
        opacity: isRevealed ? 1 : 0,
        transform: `perspective(600px) rotateY(${isRevealed ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 }
    });


    // Back face style (starts visible, rotates away)
    const backStyle = {
        transform: transform.to(t => `${t} rotateY(180deg)`),
        opacity: opacity.to(o => 1 - o),
        position: 'absolute' as 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden' as 'hidden'
    };

    // Front face style (starts hidden, rotates into view)
    const frontStyle = {
        transform,
        opacity,
        position: 'absolute' as 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden' as 'hidden'
    };


    return (
        <div className={`relative ${className}`} onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
            if (onClick) onClick();
        }}>
            {/* Card Back Container */}
            <animated.div style={backStyle} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black">
                <CardBack />
                {/* Glass Shatter Overlay would go here as another absolute layer triggered on click before reveal */}
            </animated.div>

            {/* Card Front Container */}
            <animated.div style={frontStyle} className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-purple-500/50 bg-black">
                {/* Reuse existing display or custom image logic */}
                <img src={(card.card as any).imageUrl || "placeholder.png"} alt={card.card.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-sm drop-shadow-md">
                    {card.card.name} {card.isReversed ? '(Rev)' : ''}
                </div>
            </animated.div>
        </div>
    );
};
