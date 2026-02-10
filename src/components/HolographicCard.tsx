
import React, { useState } from 'react';
import { DrawnDivinationCard, TarotCard } from '../types';
import { ELEMENT_COLORS, ELEMENT_HEX_COLORS } from '../constants';
import { SunIcon, SparklesIcon } from './icons';

interface HolographicCardProps {
    card: DrawnDivinationCard;
    isRevealed: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    showHotspots?: boolean;
    onHotspotClick?: (target: 'symbol' | 'element' | 'number') => void;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ card, isRevealed, onClick, className, style, showHotspots, onHotspotClick }) => {
    const tarotCard = card.card as TarotCard;
    const elementColor = (ELEMENT_COLORS as any)[tarotCard.element || 'Air'] || 'text-white';
    const hexColor = (ELEMENT_HEX_COLORS as any)[tarotCard.element || 'Air'] || '#a855f7';

    // Simple generative art placeholder since we don't have the full GenerativeCardArt in this file context,
    // in real usage we would import it, but for now we'll use a simplified version or assume integration.
    // Actually, let's create a visual approximation.

    return (
        <div
            className={`relative group perspective-[1500px] cursor-pointer ${className}`}
            style={style}
            onClick={onClick}
        >
            <div
                className="relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d]"
                style={{ transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* BACK */}
                <div className="absolute inset-0 [backface-visibility:hidden] glass-panel rounded-xl border border-white/10 bg-black/80 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-grid opacity-20 animate-[pulse_4s_infinite]"></div>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow">
                        <SunIcon className="w-6 h-6 text-white/20" />
                    </div>
                </div>

                {/* FRONT */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden bg-[#05060a] border border-white/10 shadow-2xl">
                    {/* Neon Border Snap */}
                    <div className="absolute inset-0 border-2 opacity-50" style={{ borderColor: hexColor, boxShadow: `0 0 15px ${hexColor}40` }}></div>

                    {/* Content */}
                    <div className="relative z-10 p-4 h-full flex flex-col">
                        <header className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-mono uppercase tracking-widest text-white/50">{tarotCard.arcana || 'Minor'}</span>
                            <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${elementColor}`}>{card.isReversed ? 'REV' : 'UP'}</span>
                        </header>
                        <h3 className={`text-lg font-bold font-dm-sans leading-tight ${elementColor} mb-2 neon-glow`}>{tarotCard.name}</h3>

                        {/* Art Area */}
                        <div className="flex-grow bg-black/50 rounded border border-white/5 relative overflow-hidden group-hover:border-white/20 transition-colors">
                            {/* Abstract Visuals */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full blur-xl opacity-40 mix-blend-screen" style={{ backgroundColor: hexColor }}></div>
                                <SparklesIcon className="w-8 h-8 text-white/20" />
                            </div>

                            {/* HOTSPOTS */}
                            {showHotspots && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onHotspotClick?.('symbol'); }}
                                        className="absolute top-1/4 left-1/4 w-6 h-6 rounded-full bg-white/10 border border-white/30 backdrop-blur-md animate-pulse hover:bg-white/30 hover:scale-125 transition-all flex items-center justify-center"
                                    >
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onHotspotClick?.('element'); }}
                                        className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full bg-white/10 border border-white/30 backdrop-blur-md animate-pulse hover:bg-white/30 hover:scale-125 transition-all flex items-center justify-center"
                                        style={{ animationDelay: '0.5s' }}
                                    >
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HolographicCard;
