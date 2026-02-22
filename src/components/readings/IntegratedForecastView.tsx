import React from 'react';
import { DrawnDivinationCard, UserProfile, SpreadType } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
import DivinationCardDisplay from '../TarotCard';
import { SparklesIcon, ZapIcon, LayersIcon } from '../icons';

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
    return (
        <div className="w-full h-full p-8 overflow-y-auto animate-fade-in bg-grid flex flex-col items-center py-20 pb-40">
            <header className="text-center mb-16 max-w-4xl relative">
                {isPremium && spokenNarrative && (
                    <button onClick={() => onSpeak(spokenNarrative)} className="absolute -right-20 top-0 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10" title="Play Spoken Narrative">
                        <div className="w-6 h-6 text-white">🔊</div>
                    </button>
                )}
                <div className="w-24 h-24 rounded-[2.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow"><SparklesIcon className="w-12 h-12 text-teal-400" /></div>
                <h1 className="text-7xl font-bold font-dm-sans text-white mb-4 tracking-tighter neon-glow text-center">Integrated Forecast</h1>
                <p className="text-text-muted text-xl leading-relaxed text-center">{activeProfile?.currentName}, the array is complete.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
                <div className="glass-panel p-10 rounded-[2rem] border-white/5">
                    <h3 className="text-xl font-bold text-teal-400 mb-6 font-mono uppercase tracking-widest flex items-center gap-3"><ZapIcon className="w-5 h-5" /> Action_Protocols</h3>
                    <ul className="space-y-4">
                        {practicalActions.map((action, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <span className="w-6 h-6 rounded bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">{i + 1}</span>
                                <p className="text-white/80 leading-relaxed text-sm">{action}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-panel p-10 rounded-[2rem] border-purple-500/20 bg-purple-500/5">
                    <h3 className="text-xl font-bold text-purple-400 mb-6 font-mono uppercase tracking-widest flex items-center gap-3"><LayersIcon className="w-5 h-5" /> Shadow_Signal</h3>
                    <p className="text-white/80 leading-relaxed italic border-l-4 border-purple-500/30 pl-4">{shadowMessage}</p>
                </div>
            </div>

            <div className="max-w-6xl w-full glass-panel p-16 rounded-[3rem] border-white/10 bg-[#0a0b12]/95 relative overflow-hidden shadow-2xl mb-20">
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none"><SparklesIcon className="w-96 h-96" /></div>
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-8 font-bold">Master_Synthesis_Narrative</h3>
                <p className="text-2xl leading-relaxed text-text-primary whitespace-pre-wrap font-dm-sans">{aiSummary}</p>
            </div>

            {isPremium && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-20">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-4 font-bold">Signal_Resonance</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{cardRelationships}</p>
                    </div>
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 font-bold">Elemental_Dignity</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{elementalDignity}</p>
                    </div>
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-4 font-bold">Numerology_Threads</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{numerologyThreads}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mb-20">
                <input value={readingTitle} onChange={e => setReadingTitle(e.target.value)} placeholder="LOG_SESSION_ID..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-10 py-6 focus:outline-none focus:border-purple-500 transition-colors text-white font-mono text-xl shadow-inner" />
                <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-14 py-6 rounded-2xl transition-all shadow-glow active:scale-95 text-xl uppercase font-mono tracking-widest">Commit_Archive</button>
            </div>

            <button onClick={handleExport} className="mb-20 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest border-b border-white/10 hover:border-white transition-all pb-1">
                Export to Neural-Link
            </button>

            <div className="mt-20 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {drawnCards.map((c, i) => (
                    <div key={i} className="flex flex-col gap-6 group relative">
                        <p className="text-center text-xs font-mono text-white/40 uppercase tracking-widest">{SPREAD_DETAILS[selectedSpread!].positions[i]}</p>
                        <DivinationCardDisplay drawnCard={c} isRevealed={true} className="!w-full !h-auto aspect-[2/3] ring-1 ring-white/5 group-hover:ring-purple-500/40 transition-all shadow-xl mx-auto max-w-[300px]" />

                        <div className={`p-6 bg-white/5 rounded-2xl border border-white/5 transition-all ${isPremium ? 'cursor-pointer hover:bg-white/10' : ''}`} onClick={() => isPremium && setActiveDeepDiveIndex(activeDeepDiveIndex === i ? null : i)}>
                            <p className="text-sm text-white/80 leading-relaxed text-center">{c?.interpretation}</p>
                            {isPremium && (
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeDeepDiveIndex === i ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3">Deep_Dive_Protocol</p>
                                    <p className="text-sm text-white/60 leading-relaxed italic">{perCardDeepDives[i] || "Data encrypted."}</p>
                                </div>
                            )}
                            {isPremium && activeDeepDiveIndex !== i && <p className="mt-4 text-[10px] text-center text-purple-500/50 uppercase tracking-widest group-hover:text-purple-400">Expand Analysis</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
