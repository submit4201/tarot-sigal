
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDailyNumber, calculateMonthlyNumber, calculateYearlyNumber, reduceNumber } from '../services/tarotService';
import { DnaIcon, LockIcon, UnlockIcon, ChevronLeftIcon, SparklesIcon, ZapIcon, CompassIcon } from '../components/icons';
import CosmicBlueprintDisplay from '../components/CosmicBlueprintDisplay';
import { generateCosmicBlueprint } from '../services/cosmicService';

const NumerologyPage: React.FC = () => {
    const { activeProfile, isPremium, isSeeker, isOracle } = useApp();
    const today = new Date();

    // Check for hash change to handle "back" navigation if needed, though App.tsx handles main nav.
    // We can add a simple back button to Daily.

    const dailyNumber = useMemo(() => calculateDailyNumber(today), []);
    const monthlyNumber = useMemo(() => calculateMonthlyNumber(today), []);
    const yearlyNumber = useMemo(() => calculateYearlyNumber(today), []);
    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);

    if (!activeProfile || !cosmicBlueprint) return null;

    const handleBack = () => {
        window.location.hash = '#daily';
    };

    return (
        <div className="w-full h-full p-4 md:p-10 overflow-y-auto relative flex flex-col items-center animate-fade-in scroll-smooth">
            <header className="w-full max-w-5xl flex items-center gap-6 mb-12 relative z-20">
                <button onClick={handleBack} className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all group">
                    <ChevronLeftIcon className="w-6 h-6 text-white/50 group-hover:text-purple-400" />
                </button>
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Numerological Matrix</h1>
                    <p className="text-sm font-mono text-purple-400 mt-2 uppercase tracking-widest">Frequency Analysis // {activeProfile.givenName}</p>
                </div>
            </header>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* Life Path & Core Blueprint */}
                <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-black/40 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><DnaIcon className="w-24 h-24 text-purple-500" /></div>
                    <h3 className="text-xs font-mono text-purple-400 uppercase tracking-[0.3em] mb-6 font-bold flex items-center gap-2">Core_Signature</h3>
                    <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
                </div>

                {/* Current Temporal Frequencies */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-purple-900/10 to-transparent relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <h3 className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mb-4 font-bold">Universal_Year</h3>
                        <div className="flex items-baseline gap-6">
                            <span className="text-6xl font-bold text-white font-dm-sans tracking-tighter">{yearlyNumber.number}</span>
                            <div>
                                <h4 className="text-xl text-purple-300 font-bold mb-1">{yearlyNumber.theme}</h4>
                                <p className="text-xs text-white/60 leading-relaxed max-w-xs">{yearlyNumber.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all">
                            <h3 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-2 font-bold">Current_Month</h3>
                            <div className="text-4xl font-bold text-white font-dm-sans mb-1">{monthlyNumber.number}</div>
                            <div className="text-xs text-white/50 font-mono uppercase">{monthlyNumber.theme}</div>
                        </div>
                        <div className="glass-panel p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all">
                            <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2 font-bold">Today's_Frequency</h3>
                            <div className="text-4xl font-bold text-white font-dm-sans mb-1">{dailyNumber.number}</div>
                            <div className="text-xs text-white/50 font-mono uppercase">{dailyNumber.theme}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational / Deep Dive Content Placeholder */}
            <div className="w-full max-w-5xl glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.02] relative group">
                {!isPremium && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border border-purple-500/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
                        <LockIcon className="w-12 h-12 text-purple-400/50 mb-4 animate-pulse" />
                        <h4 className="text-xl font-bold text-white mb-2">Matrix Decryption Locked</h4>
                        <p className="text-sm text-text-muted max-w-sm mb-6">Upgrade to Seeker or Oracle tier to access deep numerical synthesis and temporal frequency decryption.</p>
                        <button
                            onClick={() => window.location.hash = '#pricing'}
                            className="px-8 py-3 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-600 hover:text-white transition-all font-mono text-xs uppercase tracking-widest shadow-glow"
                        >
                            Establish_Connection
                        </button>
                    </div>
                )}
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.3em] mb-6 font-bold">Matrix_Decryption</h3>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-text-muted leading-relaxed ${!isPremium ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                    <div>
                        <strong className="text-white block mb-2">Life Path Number</strong>
                        Calculated from your full birth date, this represents your core purpose and the primary trajectory of your existence in this timeline.
                    </div>
                    <div>
                        <strong className="text-white block mb-2">Universal Year</strong>
                        The global frequency affecting the collective consciousness. Your personal year cycles operate within this broader context.
                    </div>
                    <div>
                        <strong className="text-white block mb-2">Daily Vibration</strong>
                        The specific energy available for transmutation today. Use this frequency to align your micro-actions with cosmic timing.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumerologyPage;
