
import React from 'react';
import { DrawnDivinationCard, TarotCard } from '../types';
import { ELEMENT_COLORS, ELEMENT_HEX_COLORS } from '../constants';
import { SunIcon } from './icons';
import { SeededRandom, createNumericSeed } from '../services/tarotService';
import { CardBack } from './CardBack';

interface DivinationCardDisplayProps {
    drawnCard: DrawnDivinationCard | null;
    isRevealed: boolean;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const GenerativeCardArt: React.FC<{ card: TarotCard }> = ({ card }) => {
    if (!card || !card.name || !card.element) {
        return (
            <div className="absolute inset-0 bg-[#05060a] flex items-center justify-center">
                <div className="w-full h-[1px] bg-red-500/20 animate-pulse"></div>
            </div>
        );
    }

    const seed = createNumericSeed(card.name + card.element);
    const random = new SeededRandom(seed);
    const color = (ELEMENT_HEX_COLORS as any)[card.element] || '#6E7BFF';

    // Generate complex paths
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

    const paths = Array.from({ length: 4 }).map(() => generatePath());

    return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-70" preserveAspectRatio="none">
                <defs>
                    <radialGradient id={`grad-${card.id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <rect width="100" height="100" fill={`url(#grad-${card.id})`} />

                {paths.map((p, i) => (
                    <path
                        key={i}
                        d={p}
                        fill="none"
                        stroke={color}
                        strokeWidth={0.3}
                        opacity={0.6}
                        filter="url(#glow)"
                        className="animate-pulse"
                        style={{ animationDelay: `${i * 0.5}s` }}
                    />
                ))}

                {Array.from({ length: 15 }).map((_, i) => (
                    <circle
                        key={`c-${i}`}
                        cx={random.nextInt(0, 100)} cy={random.nextInt(0, 100)}
                        r={random.nextInt(1, 4)}
                        fill={color}
                        opacity={0.2}
                    />
                ))}
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none"></div>
            <div className="absolute inset-0 shimmer-reveal pointer-events-none opacity-20"></div>
        </div>
    );
};

const TarotCardDisplay: React.FC<{ drawnCard: DrawnDivinationCard | null, isRevealed: boolean, className?: string, style?: React.CSSProperties, onClick?: () => void }> = ({ drawnCard, isRevealed, className, style, onClick }) => {
    if (!drawnCard || !drawnCard.card) return null;

    const { card, isReversed } = drawnCard;
    const tarotCard = card as TarotCard;
    const elementColor = (ELEMENT_COLORS as any)[tarotCard.element || 'Air'] || 'text-white';

    return (
        <div
            className={`relative w-[280px] h-[450px] [perspective:1500px] select-none ${className}`}
            style={style}
            onClick={onClick}
        >
            <div
                className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer"
                style={{ transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                <CardBack className={className} />

                {/* Card Front */}
                <div
                    className="absolute inset-0 [backface-visibility:hidden] bg-[#05060a] rounded-2xl border border-white/10 p-6 flex flex-col [transform:rotateY(180deg)] overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-grid opacity-15"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <header className="mb-4">
                            <p className="text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-text-muted mb-1">{tarotCard.arcana || 'Signal'} Phase</p>
                            <h2 className={`text-2xl font-bold font-dm-sans tracking-tight leading-tight ${elementColor} neon-glow`}>{tarotCard.name || 'Unknown'}</h2>
                        </header>

                        <div className="flex-grow relative my-4 rounded-xl border border-white/5 bg-black/60 shadow-inner overflow-hidden">
                            <GenerativeCardArt card={tarotCard} />
                        </div>

                        <footer className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono uppercase tracking-widest text-text-muted mb-1">Polarity</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${elementColor}`}>
                                    {isReversed ? 'INVERTED' : 'UPRIGHT'}
                                </span>
                            </div>
                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                                <div className={`w-2 h-2 rounded-full ${isReversed ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]'}`}></div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DivinationCardDisplay: React.FC<DivinationCardDisplayProps> = (props) => {
    return <TarotCardDisplay {...props} />;
};

export default DivinationCardDisplay;
