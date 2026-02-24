import React, { useState, useEffect, useMemo } from 'react';
import { useTransition, animated, config, useSpring } from 'react-spring';
import { useApp } from '../context/AppContext';
import { TarotCard } from '../types';
import { ELEMENT_COLORS, ELEMENT_HEX_COLORS, TAROT_DECK } from '../constants';
import { createNumericSeed, SeededRandom } from '../services/tarotService';
import { CardBack } from './CardBack';

interface AnimatedCardFrontProps {
    deckId: string;
    className?: string;
}

const GenerativeCardArt: React.FC<{ card: TarotCard }> = ({ card }) => {
    const seed = useMemo(() => createNumericSeed(card.name + card.element), [card.name, card.element]);
    const random = useMemo(() => new SeededRandom(seed), [seed]);
    const color = (ELEMENT_HEX_COLORS as any)[card.element || 'Air'] || '#6E7BFF';

    const generatePath = () => {
        let path = "M 50 50 ";
        const steps = 12 + random.nextInt(0, 10);
        for (let i = 0; i < steps; i++) {
            const angle = (i / steps) * Math.PI * 2;
            const r = 20 + random.nextInt(0, 30);
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            path += `Q ${50 + random.nextInt(-20, 20)} ${50 + random.nextInt(-20, 20)} ${x} ${y} `;
        }
        return path + "Z";
    };

    const paths = useMemo(() => Array.from({ length: 4 }).map(() => generatePath()), [random]);

    return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-60" preserveAspectRatio="none">
                <defs>
                    <radialGradient id={`grad-${card.id}-${seed}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="100" height="100" fill={`url(#grad-${card.id}-${seed})`} />
                {paths.map((p, i) => (
                    <path
                        key={i}
                        d={p}
                        fill="none"
                        stroke={color}
                        strokeWidth={0.3}
                        opacity={0.5}
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.5}s` }}
                    />
                ))}
            </svg>
        </div>
    );
};

export const AnimatedCardFront: React.FC<AnimatedCardFrontProps> = ({ deckId, className }) => {
    const { getCardImagePath } = useApp();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Whimsical randomization: unique interval and delay for each instance
    const whimsicalConfig = useMemo(() => ({
        interval: 3500 + Math.random() * 5000, // Faster/slower cycling
        delay: Math.random() * 2500,           // Desynchronize starts
        rotateOffset: (Math.random() - 0.5) * 4 // Slight random tilt
    }), []);

    // List of major arcana IDs to cycle through
    const cardIds = useMemo(() =>
        TAROT_DECK.filter(c => c.arcana === 'Major').map(c => c.id),
        []);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        const timeout = setTimeout(() => {
            timer = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % cardIds.length);
            }, whimsicalConfig.interval);
        }, whimsicalConfig.delay);

        return () => {
            clearTimeout(timeout);
            if (timer) clearInterval(timer);
        };
    }, [cardIds.length, whimsicalConfig]);

    const activeCardId = cardIds[currentIndex];

    // Spring for flipping animation
    const { transform, opacity } = useSpring({
        opacity: isHovered ? 1 : 0,
        transform: `perspective(1000px) rotateY(${isHovered ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
    });

    const transitions = useTransition(activeCardId, {
        from: { opacity: 0, transform: 'scale(1.1)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.9)' },
        config: config.molasses,
    });

    return (
        <div
            className={`relative w-full aspect-[2/3] cursor-pointer group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ transform: `rotate(${whimsicalConfig.rotateOffset}deg)` }}
        >
            {/* FRONT SIDE (Cycling Images) */}
            <animated.div
                style={{
                    opacity: opacity.to(o => 1 - o),
                    transform,
                    rotateY: '0deg',
                }}
                className="absolute inset-0 z-10 w-full h-full rounded-2xl overflow-hidden bg-[#05060a] border border-white/10 shadow-2xl backface-hidden"
            >
                {transitions((style, item) => {
                    const card = TAROT_DECK.find(c => c.id === item)!;
                    const img = getCardImagePath(item, deckId);
                    const elementColor = (ELEMENT_COLORS as any)[card.element || 'Air'] || 'text-white';

                    return (
                        <animated.div style={style} className="absolute inset-0">
                            {/* Generative Art Layer */}
                            <div className="absolute inset-0 opacity-40">
                                <GenerativeCardArt card={card} />
                            </div>

                            {/* Main Artwork */}
                            <img
                                src={img}
                                alt={card.name}
                                className="w-full h-full object-cover transition-transform duration-[6s] group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-scanline pointer-events-none opacity-10"></div>

                            {/* Info Text */}
                            <div className="absolute inset-0 flex flex-col p-4 md:p-5">
                                <header>
                                    <p className="text-[7px] font-mono text-purple-400 uppercase tracking-[0.4em] mb-0.5">Manifest_Signal</p>
                                    <h3 className={`text-md md:text-lg font-bold font-dm-sans tracking-tight leading-none ${elementColor} truncate`}>{card.name}</h3>
                                </header>
                                <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-3 -mx-2 px-2 bg-black/40 backdrop-blur-sm">
                                    <span className="text-[6px] font-mono text-white/30 uppercase tracking-widest">ARC_ID: {item}</span>
                                    <div className="w-3 h-3 rounded-full border border-white/20 flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-teal-400 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    );
                })}
            </animated.div>

            {/* BACK SIDE (Deck Identity) */}
            <animated.div
                style={{
                    opacity,
                    transform,
                    rotateY: '180deg',
                }}
                className="absolute inset-0 z-0 w-full h-full rounded-2xl overflow-hidden bg-black border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] backface-hidden"
            >
                <CardBack deckId={deckId} animated className="scale-110" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full border border-purple-500/50 flex items-center justify-center mb-4 bg-black/60 shadow-glow">
                        <div className="text-purple-400 text-lg font-bold">ARC</div>
                    </div>
                    <p className="text-[9px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Conduit_Pattern</p>
                    <p className="text-[8px] text-white/40 font-mono mt-2 uppercase tracking-widest">Verify_Identity_Sequence</p>
                </div>
            </animated.div>
        </div>
    );
};

export default AnimatedCardFront;
