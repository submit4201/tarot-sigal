
import React from 'react';
import { DrawnDivinationCard, SavedReading } from '../../types';
import HolographicCard from '../HolographicCard';
import { CompassIcon } from '../icons';

interface CoreReadingPhaseProps {
    reading: SavedReading;
    onCardClick: (index: number) => void;
}

const CoreReadingPhase: React.FC<CoreReadingPhaseProps> = ({ reading, onCardClick }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto z-10 animate-fade-in relative transition-all duration-1000">
            {/* THE SPREAD */}
            {/* THE SPREAD - 3 Card Layout */}
            <div className="relative w-full max-w-5xl h-[500px] mb-16 flex items-center justify-center perspective-[1000px]">
                {/* Connecting Lines (Background) */}
                <div className="absolute top-1/2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent -z-10"></div>

                {reading.cards.map((card, index) => {
                    // Position calculations
                    let positionClass = "";
                    let label = "";

                    if (index === 0) {
                        positionClass = "translate-x-[-120%] rotate-[-5deg] mt-8";
                        label = "The Roots (Past)";
                    } else if (index === 1) {
                        positionClass = "z-20 -mt-8 scale-110 shadow-[0_0_50px_rgba(168,85,247,0.3)]";
                        label = "The Catalyst (Present)";
                    } else if (index === 2) {
                        positionClass = "translate-x-[120%] rotate-[5deg] mt-8";
                        label = "The Horizon (Future)";
                    }

                    return (
                        <div key={index} className={`absolute flex flex-col items-center gap-6 group transition-all duration-700 ${positionClass}`}>
                            <div className="relative">
                                {/* Position Marker */}
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono text-purple-400 uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-3 py-1 rounded-full border border-purple-500/30 whitespace-nowrap z-30 pointer-events-none">
                                    {label}
                                </div>

                                <HolographicCard
                                    card={card}
                                    isRevealed={true}
                                    onClick={() => onCardClick(index)}
                                    className="w-[22vw] h-[34vw] max-w-[240px] max-h-[380px] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl ring-1 ring-white/10 group-hover:ring-purple-400/50"
                                />

                                {/* Label Below */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 w-full">
                                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest truncate max-w-[150px] mx-auto">{card.card.name}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* NARRATIVE SYNTHESIS */}
            <div className="w-full max-w-4xl px-4 animate-fade-in-up"
                style={{ animationDelay: '0.5s' }}>
                <div className="glass-panel p-8 md:p-12 rounded-[2rem] border-white/10 bg-gradient-to-b from-purple-900/10 to-transparent relative overflow-hidden backdrop-blur-xl group hover:border-purple-500/30 transition-all">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>

                    <header className="flex items-center gap-4 mb-6 opacity-80">
                        <div className="p-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                            <CompassIcon className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-xs font-mono text-purple-300 uppercase tracking-[0.4em] font-bold">Pattern_Synthesis</h3>
                    </header>

                    <p className="text-lg md:text-xl leading-relaxed text-white/90 font-dm-sans italic border-l-2 border-purple-500/30 pl-6">
                        "{reading.aiSummary}"
                    </p>

                    {reading.shadowMessage && (
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-[10px] font-mono text-red-400 uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                Shadow_Signal_Detected
                            </p>
                            <p className="text-sm text-text-muted leading-relaxed">
                                {reading.shadowMessage}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoreReadingPhase;
