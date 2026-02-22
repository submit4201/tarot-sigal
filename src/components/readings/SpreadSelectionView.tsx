import React from 'react';
import { SpreadType } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import { SparklesIcon } from '../icons';

interface SpreadSelectionViewProps {
    isPremium: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSelectSpread: (spread: SpreadType) => void;
    onBack?: () => void;
    setIsPremiumModalOpen: (open: boolean) => void;
}

export const SpreadSelectionView: React.FC<SpreadSelectionViewProps> = ({
    isPremium,
    searchQuery,
    setSearchQuery,
    onSelectSpread,
    onBack,
    setIsPremiumModalOpen
}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative z-10">
            {isPremium && onBack && (
                <button onClick={onBack} className="absolute top-8 left-8 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest">← Back to Intent</button>
            )}
            <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow text-center">Select Array</h2>
            <input
                type="text"
                placeholder="SEARCH_PROTOCOLS..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full max-w-xl bg-void-dark/50 backdrop-blur-md border border-white/10 rounded-2xl text-white font-mono text-xl px-8 py-4 focus:outline-none focus:border-cosmic-glow/50 focus:bg-void-dark/80 mb-16 text-center placeholder-white/10 transition-all shadow-2xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12 max-w-[90rem] w-full h-[75vh] overflow-y-auto p-8 custom-scrollbar">
                {Object.entries(SPREAD_DETAILS).filter(([_, s]) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(([key, spread]) => (
                    <div
                        key={key}
                        onClick={() => onSelectSpread(key as SpreadType)}
                        className={`glass-panel p-12 rounded-[3.5rem] cursor-pointer hover:border-cosmic-glow transition-all group relative overflow-hidden flex flex-col min-h-[600px] ${spread.isPremium && !isPremium ? 'opacity-70 grayscale shadow-none' : 'hover:shadow-[0_0_80px_rgba(168,85,247,0.3)] shadow-2xl'}`}
                    >
                        {spread.isPremium && (
                            <div className="absolute top-10 right-10 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/30 to-rose-500/30 border border-amber-500/50 text-amber-200 text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(245,158,11,0.2)] z-20">
                                <SparklesIcon className="w-4 h-4 animate-pulse" />
                                Oracle Tier
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-4xl font-black text-white group-hover:text-hologram transition-colors mb-4 tracking-tighter uppercase">{spread.name}</h3>
                            <div className="flex gap-8 text-sm font-mono uppercase tracking-[0.25em] text-white/40">
                                <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-hologram shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>{spread.cardCount} Nodes</span>
                                <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-cosmic shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>{spread.deck.join(' + ')}</span>
                            </div>
                        </div>

                        {/* Visual Spread Layout Diagram */}
                        {spread.layout && (
                            <div className="relative w-full h-64 mb-10 bg-void-dark/80 rounded-[2.5rem] border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-cosmic/30 transition-all shadow-inner">
                                <div className="absolute inset-0 bg-grid opacity-20"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-cosmic/5 to-transparent"></div>
                                <div className="relative w-full h-full scale-[0.85] origin-center opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[0.9]">
                                    {spread.layout.map((pos, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-14 h-24 bg-white/5 border border-white/20 rounded-lg shadow-2xl transition-all duration-700 group-hover:border-cosmic-glow group-hover:bg-cosmic/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                                            style={{
                                                left: `${pos.x}%`,
                                                top: `${pos.y}%`,
                                                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-grid opacity-10"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-grow mb-10">
                            <p className="text-white/80 text-lg leading-relaxed italic font-serif opacity-80 group-hover:opacity-100 transition-opacity">
                                {spread.description}
                            </p>
                        </div>

                        <div className="mt-auto space-y-6">
                            <div className="flex flex-wrap gap-3 py-4 border-y border-white/5">
                                {spread.positions.map((pos, i) => (
                                    <span key={i} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest whitespace-nowrap group-hover:border-white/20 transition-colors">
                                        {pos}
                                    </span>
                                ))}
                            </div>

                            <div className={`w-full py-6 rounded-2xl font-black text-xl text-center transition-all duration-500 border relative overflow-hidden flex items-center justify-center gap-3 ${spread.isPremium && !isPremium
                                    ? 'bg-white/5 border-white/10 text-white/20'
                                    : 'bg-gradient-to-r from-cosmic-dark/40 to-cosmic/40 border-cosmic/30 text-white group-hover:from-cosmic-dark group-hover:to-cosmic group-hover:border-cosmic group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                                }`}>
                                {spread.isPremium && !isPremium ? (
                                    <>LOCKED_PROTOCOL</>
                                ) : (
                                    <>
                                        <span className="tracking-[0.5em] ml-[0.5em]">EXECUTE</span>
                                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
