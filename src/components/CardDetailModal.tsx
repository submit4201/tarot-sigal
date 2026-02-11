import React from 'react';
import { DrawnDivinationCard, TarotCard } from '../types';
import { ELEMENT_COLORS } from '../constants';
import { SparklesIcon, ZapIcon, AirIcon, EarthIcon, FireIcon, WaterIcon, MajorArcanaIcon } from './icons';
import { GlassPanel } from './ui/GlassPanel';
import { useTilt } from '../hooks/useTilt';

const CardDetailModal: React.FC<{ drawnCard: DrawnDivinationCard | null; onClose: () => void; }> = ({ drawnCard, onClose }) => {
    if (!drawnCard || !drawnCard.card) return null;

    const { card } = drawnCard;
    const isTarot = 'arcana' in card;
    const isAngel = card.id ? card.id.startsWith('angel_') : (card as any).category === 'angel'; // Fallback check

    // Tilt Effect for the modal card
    const tilt = useTilt(10);

    const ElementIcon = () => {
        if (!isTarot) return null;
        const tarotCard = card as TarotCard;
        const color = ELEMENT_COLORS[tarotCard.element] || 'text-white';
        const iconProps = { className: `w-5 h-5 ${color}` };
        if (tarotCard.arcana === 'Major') { return <MajorArcanaIcon {...iconProps} />; }
        switch (tarotCard.element) {
            case 'Fire': return <FireIcon {...iconProps} />;
            case 'Water': return <WaterIcon {...iconProps} />;
            case 'Air': return <AirIcon {...iconProps} />;
            case 'Earth': return <EarthIcon {...iconProps} />;
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

            <div className="relative w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-start pointer-events-auto" onClick={e => e.stopPropagation()}>

                {/* 3D Card Display */}
                <div
                    className="w-full md:w-1/3 aspect-[2/3] relative perspective-1000 group"
                    style={tilt.style}
                    onMouseMove={tilt.onMouseMove}
                    onMouseLeave={tilt.onMouseLeave}
                >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)] border border-white/20 relative transform-gpu transition-transform duration-300 group-hover:scale-105">
                        {card.imageUrl ? (
                            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                <span className="text-white/20 font-mono text-xs">NO_IMG_DATA</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-3xl font-bold text-white font-display uppercase tracking-tight">{card.name}</h2>
                            {isTarot && <p className="text-purple-400 font-mono text-xs uppercase tracking-widest mt-2">{(card as TarotCard).arcana}</p>}
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <GlassPanel className="flex-1 w-full max-h-[80vh] overflow-y-auto custom-scrollbar p-8 rounded-[2.5rem] bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-4 font-bold">Semantic_Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {card.keywords?.map(kw => (
                                    <span key={kw} className="px-3 py-1 bg-purple-500/10 text-purple-300 text-xs font-mono rounded border border-purple-500/20">{kw}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-4 font-bold">Core_Meaning</h3>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-white/80 leading-relaxed font-sans text-sm">{card.meaning}</p>
                            </div>
                            {isTarot && (
                                <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/5 opacity-70">
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold">Reversed_Polarity</p>
                                    <p className="text-white/60 leading-relaxed font-sans text-xs">{(card as TarotCard).reversedMeaning}</p>
                                </div>
                            )}
                        </div>

                        {isTarot && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ZapIcon className="w-4 h-4 text-teal-400" />
                                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold">Micro_Quest</span>
                                    </div>
                                    <p className="text-xs text-white/70 italic">{(card as TarotCard).microQuest}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ElementIcon />
                                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Element</span>
                                    </div>
                                    <p className="text-xs text-white/70 font-bold">{(card as TarotCard).element}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default CardDetailModal;