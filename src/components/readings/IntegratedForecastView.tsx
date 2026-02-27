import React from 'react';
import { DrawnDivinationCard, UserProfile, SpreadType } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import DivinationCardDisplay from '../TarotCard';
import { SparklesIcon, ZapIcon, LayersIcon, BarChartIcon, BookIcon, ShareIcon, InboxIcon, Volume2Icon } from '../icons';
import { useSpring, animated, config } from 'react-spring';

interface IntegratedForecastViewProps {
    isPremium: boolean;
    spokenNarrative: string;
    activeProfile: UserProfile | null;
    practicalActions: string[];
    shadowMessage: string;
    aiSummary: string;
    cardRelationships: string;
    elementalDignity: string;
    numerologyThreads: string;
    readingTitle: string;
    setReadingTitle: (title: string) => void;
    handleSave: () => void;
    handleExport: () => void;
    drawnCards: (DrawnDivinationCard | null)[];
    selectedSpread: SpreadType;
    activeDeepDiveIndex: number | null;
    setActiveDeepDiveIndex: (index: number | null) => void;
    perCardDeepDives: string[];
    onSpeak: (text: string) => void;
}

export const IntegratedForecastView: React.FC<IntegratedForecastViewProps> = ({
    isPremium,
    spokenNarrative,
    activeProfile,
    practicalActions,
    shadowMessage,
    aiSummary,
    cardRelationships,
    elementalDignity,
    numerologyThreads,
    readingTitle,
    setReadingTitle,
    handleSave,
    handleExport,
    drawnCards,
    selectedSpread,
    activeDeepDiveIndex,
    setActiveDeepDiveIndex,
    perCardDeepDives,
    onSpeak
}) => {
    const headerSpring = useSpring({
        from: { opacity: 0, transform: 'translateY(-20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: config.molasses
    });

    const contentSpring = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        delay: 300,
        config: config.gentle
    });

    return (
        <div className="w-full min-h-screen bg-void relative overflow-x-hidden overflow-y-auto">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cosmic/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-hologram/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cosmic/50 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-24">
                {/* Dramatic Header */}
                <animated.header style={headerSpring} className="text-center space-y-8 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cosmic/10 border border-cosmic/20 rounded-full text-[10px] font-mono text-cosmic uppercase tracking-[0.3em] font-bold">
                        <span className="w-1.5 h-1.5 bg-cosmic rounded-full animate-pulse"></span>
                        Neural_Synthesis_Complete
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-8xl font-display font-bold text-white tracking-tight">
                            Integrated <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic to-hologram neon-glow">Forecast</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-white/60 font-medium">
                            The array has stabilized, <span className="text-white">{activeProfile?.currentName}</span>.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        {isPremium && spokenNarrative && (
                            <button
                                onClick={() => onSpeak(spokenNarrative)}
                                className="group flex items-center gap-3 px-8 py-4 bg-void-light border border-white/10 rounded-2xl hover:border-cosmic/50 transition-all shadow-xl hover:shadow-cosmic/20"
                            >
                                <div className="p-2 bg-cosmic/20 rounded-lg group-hover:scale-110 transition-transform">
                                    <Volume2Icon className="w-5 h-5 text-cosmic" />
                                </div>
                                <span className="text-sm font-bold text-white uppercase tracking-widest font-mono">Audio_Log</span>
                            </button>
                        )}
                        <div className="px-8 py-4 bg-void-light border border-white/10 rounded-2xl flex items-center gap-3">
                            <LayersIcon className="w-5 h-5 text-hologram" />
                            <span className="text-sm font-bold text-white uppercase tracking-widest font-mono">
                                {SPREAD_DETAILS[selectedSpread].name}
                            </span>
                        </div>
                    </div>
                </animated.header>

                <animated.div style={contentSpring} className="space-y-24">
                    {/* Primary Synthesis Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Master Narrative */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="glass-panel p-1 md:p-1 rounded-[2.5rem] border-white/10 group">
                                <div className="bg-[#0a0b12]/95 rounded-[2.2rem] p-10 md:p-16 space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <SparklesIcon className="w-48 h-48" />
                                    </div>
                                    <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] font-black border-l-2 border-cosmic pl-4">
                                        Synthesized_Outcome
                                    </h3>
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-2xl md:text-3xl leading-[1.6] text-white font-display font-light">
                                            {aiSummary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions & Insights Sub-grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="glass-panel p-8 rounded-[2rem] border-hologram/20 bg-hologram/5 space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-bold text-hologram font-mono uppercase tracking-[0.2em]">
                                        <ZapIcon className="w-4 h-4" /> Action_Protocols
                                    </h4>
                                    <ul className="space-y-4">
                                        {practicalActions.map((action, i) => (
                                            <li key={i} className="flex gap-4 group">
                                                <span className="flex-shrink-0 w-6 h-6 rounded bg-hologram/20 flex items-center justify-center text-[10px] text-hologram font-black font-mono group-hover:scale-110 transition-transform">
                                                    0{i + 1}
                                                </span>
                                                <p className="text-sm text-white/80 leading-relaxed font-medium group-hover:text-white transition-colors">
                                                    {action}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass-panel p-8 rounded-[2rem] border-cosmic/20 bg-cosmic/5 space-y-6">
                                    <h4 className="flex items-center gap-3 text-sm font-bold text-cosmic font-mono uppercase tracking-[0.2em]">
                                        <InboxIcon className="w-4 h-4" /> Shadow_Signal
                                    </h4>
                                    <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-cosmic/30 pl-4 py-1">
                                        {shadowMessage}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info Panels */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-8">
                                <h4 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold pb-4 border-b border-white/5">
                                    Quantum_Resonance
                                </h4>

                                {isPremium ? (
                                    <div className="space-y-8">
                                        <section className="space-y-2">
                                            <label className="text-[9px] font-mono text-amber-500 uppercase tracking-widest font-bold">Signal_Resonance</label>
                                            <p className="text-xs text-white/60 leading-relaxed">{cardRelationships}</p>
                                        </section>
                                        <section className="space-y-2">
                                            <label className="text-[9px] font-mono text-blue-400 uppercase tracking-widest font-bold">Elemental_Dignity</label>
                                            <p className="text-xs text-white/60 leading-relaxed">{elementalDignity}</p>
                                        </section>
                                        <section className="space-y-2">
                                            <label className="text-[9px] font-mono text-pink-400 uppercase tracking-widest font-bold">Numerology_Threads</label>
                                            <p className="text-xs text-white/60 leading-relaxed">{numerologyThreads}</p>
                                        </section>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center space-y-4">
                                        <BarChartIcon className="w-8 h-8 text-white/10 mx-auto" />
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Advanced Analysis Locked</p>
                                        <button className="text-xs text-cosmic hover:text-cosmic-light transition-colors font-bold uppercase tracking-widest">Upgrade Protocol</button>
                                    </div>
                                )}
                            </div>

                            <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
                                <h4 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold">
                                    Commit_Sequence
                                </h4>
                                <div className="space-y-4">
                                    <input
                                        value={readingTitle}
                                        onChange={e => setReadingTitle(e.target.value)}
                                        placeholder="Add mission log ID..."
                                        className="w-full bg-void border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cosmic-glow transition-colors text-white font-mono text-sm"
                                    />
                                    <button
                                        onClick={handleSave}
                                        className="w-full bg-gradient-to-r from-cosmic to-cosmic-dark hover:from-cosmic-glow hover:to-cosmic text-white font-bold py-4 rounded-xl transition-all shadow-glow active:scale-[0.98] text-sm uppercase font-mono tracking-widest"
                                    >
                                        Upload_to_Archive
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="w-full group flex items-center justify-center gap-2 text-[10px] text-white/30 hover:text-white transition-colors uppercase tracking-widest font-mono py-2"
                                    >
                                        <ShareIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                        Neural_Link_Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Visualization (The Cards) */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <h2 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] font-black">Matrix_Visualization</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                            {drawnCards.map((c, i) => (
                                <div key={i} className="flex flex-col gap-8 group animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-mono text-cosmic uppercase tracking-[0.2em] font-bold">Node_0{i + 1}</span>
                                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] font-bold italic">{SPREAD_DETAILS[selectedSpread!].positions[i]}</span>
                                        </div>
                                        <DivinationCardDisplay
                                            drawnCard={c}
                                            isRevealed={true}
                                            className="!w-full !h-auto aspect-[2/3] ring-1 ring-white/10 group-hover:ring-cosmic/50 transition-all duration-500 shadow-2xl group-hover:shadow-cosmic/20 mx-auto transform group-hover:-translate-y-2"
                                        />
                                    </div>

                                    <div
                                        className={`glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden transition-all duration-300 ${isPremium ? 'cursor-pointer hover:bg-white/5 active:scale-[0.99]' : ''}`}
                                        onClick={() => isPremium && setActiveDeepDiveIndex(activeDeepDiveIndex === i ? null : i)}
                                    >
                                        {isPremium && (
                                            <div className="absolute top-2 right-4">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeDeepDiveIndex === i ? 'bg-cosmic animate-pulse' : 'bg-white/10'}`}></div>
                                            </div>
                                        )}
                                        <div className="space-y-4">
                                            <p className="text-sm text-white/90 leading-relaxed font-medium">
                                                {c?.interpretation}
                                            </p>

                                            {isPremium && (
                                                <div className={`overflow-hidden transition-all duration-500 ${activeDeepDiveIndex === i ? 'max-h-[500px] opacity-100 pt-6 mt-6 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <BookIcon className="w-3 h-3 text-cosmic" />
                                                        <span className="text-[9px] font-mono text-cosmic uppercase tracking-widest font-black">Deep_Dive_Protocol</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 leading-relaxed italic font-light">
                                                        {perCardDeepDives[i] || "Data remains encrypted."}
                                                    </p>
                                                </div>
                                            )}

                                            {isPremium && activeDeepDiveIndex !== i && (
                                                <div className="pt-2 text-center">
                                                    <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black group-hover:text-cosmic transition-colors">Invoke Analysis</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </animated.div>
            </div>
        </div>
    );
};
