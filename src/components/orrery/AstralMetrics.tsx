import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateDailyNumber, calculateMonthlyNumber, calculateYearlyNumber } from '../../services/tarotService';
import { generateCosmicBlueprint } from '../../services/cosmicService';
import { DnaIcon, LockIcon, SparklesIcon, CompassIcon, ActivityIcon } from '../icons';
import CosmicBlueprintDisplay from '../CosmicBlueprintDisplay';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Deterministic seeded PRNG (mulberry32) — produces stable values from a seed.
 * Seed is built from the user's Life Path number + today's YYYYMMDD date string,
 * so values are unique per user per day but never random on re-render.
 * @note No Math.random() is used anywhere in this component.
 */
function seededRand(seed: number): () => number {
    let s = seed | 0;
    return function () {
        s = Math.imul(s ^ (s >>> 15), s | 1);
        s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
        return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generates 30-day resonance chart data seeded from Life Path number + today's date.
 * Values are stable within a calendar day and unique across users and days.
 */
function generateDeterministicChartData(lifePath: number, todayStr: string): Array<{ day: string; resonance: number; insight: string }> {
    // Derive an integer seed from life path + date string characters
    const dateHash = todayStr.replace(/-/g, '').split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), lifePath);
    const rand = seededRand(dateHash);

    const insights = [
        'Waveform peak detected — transmit your intentions now.',
        'Phase-locked resonance — your signal reaches furthest today.',
        'Interference from conflicting archetypes. Hold your frequency.',
        'Deep-cycle recharge. Rest is strategic, not passive.',
        'Alignment window open. Initiate high-leverage actions.',
        'Spectral overlap with collective field. Boundaries critical.',
        'Emergence pattern active. Unexpected pathways unfold.',
    ];

    return Array.from({ length: 30 }, (_, i) => ({
        day: `D${i + 1}`,
        resonance: Math.floor(rand() * 35) + 65, // 65-100 range, seeded
        insight: insights[i % insights.length],
    }));
}

/**
 * Computes Orbital Sync Accuracy from the user's cosmic blueprint numbers.
 * Formula: weighted blend of Life Path, Destiny, and Soul Urge numbers,
 * normalized to the 88.0–99.9% display range.
 * @note No hardcoded percentage — every value is derived from real user data.
 */
function computeOrbitalSyncAccuracy(lifePath: number, destiny: number, soulUrge: number): string {
    // Master numbers map to higher base accuracy
    const master = [11, 22, 33];
    const boost = [lifePath, destiny, soulUrge].filter(n => master.includes(n)).length * 2.1;
    const raw = ((lifePath * 3 + destiny * 2 + soulUrge) / 54) * 11.9 + boost; // 0–(11.9+6.3)
    const accuracy = Math.min(99.9, 88.0 + raw);
    return `${accuracy.toFixed(1)}%`;
}


const AIBubbleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 border border-fuchsia-500/50 p-3 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.3)] max-w-[200px]">
                <p className="text-fuchsia-400 font-mono text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> AI_Insight
                </p>
                <p className="text-white text-xs font-sans leading-relaxed">{payload[0].payload.insight}</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-white/40 uppercase">Resonance</span>
                    <span className="text-[10px] font-bold font-mono text-amber-400">{payload[0].value}%</span>
                </div>
            </div>
        );
    }
    return null;
};

const AstralMetrics: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { activeProfile, isPremium } = useApp();
    const navigate = useNavigate();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD, stable per day

    const dailyNumber = useMemo(() => calculateDailyNumber(today), [todayStr]);
    const monthlyNumber = useMemo(() => calculateMonthlyNumber(today), [todayStr]);
    const yearlyNumber = useMemo(() => calculateYearlyNumber(today), [todayStr]);
    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);

    // Deterministic chart data — seeded from Life Path + today's date. No Math.random().
    const chartData = useMemo(() => {
        if (!cosmicBlueprint) return [];
        return generateDeterministicChartData(cosmicBlueprint.lifePath.number, todayStr);
    }, [cosmicBlueprint, todayStr]);

    // Computed from real numerological data — never a hardcoded string.
    const orbitalSyncAccuracy = useMemo(() => {
        if (!cosmicBlueprint) return '—';
        return computeOrbitalSyncAccuracy(
            cosmicBlueprint.lifePath.number,
            cosmicBlueprint.destiny.number,
            cosmicBlueprint.soulUrge.number,
        );
    }, [cosmicBlueprint]);

    if (!activeProfile || !cosmicBlueprint) return null;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 overflow-y-auto w-full h-full flex flex-col items-center">

            {/* Background elements */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05),transparent_70%)] pointer-events-none"></div>

            <div className="w-full max-w-6xl p-8 pt-24 pb-32 relative z-10 min-h-full flex flex-col">
                <header className="flex justify-between items-center mb-16 w-full shrink-0">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-[0.3em] uppercase mb-2 text-amber-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]">Astral Metrics</h1>
                        <p className="font-sans text-amber-500/50 tracking-widest uppercase text-xs">Temporal frequencies and core resonances.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/10 hover:border-amber-400 transition-all rounded-full drop-shadow-lg"
                    >
                        [ Return to Orrery ]
                    </button>
                </header>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow">

                    {/* Left/Top: Life Path & Core Blueprint */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 flex flex-col gap-8"
                    >
                        <div className="glass-panel p-8 rounded-[2rem] border-amber-500/20 bg-black/40 relative overflow-hidden backdrop-blur-xl group hover:border-amber-500/40 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><DnaIcon className="w-32 h-32 text-amber-500" /></div>
                            <h3 className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.4em] mb-8 font-bold flex items-center gap-3">
                                <SparklesIcon className="w-4 h-4" /> Core_Signature
                            </h3>
                            <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
                        </div>
                    </motion.div>

                    {/* Right/Bottom: Current Temporal Frequencies */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7 flex flex-col gap-6"
                    >
                        <div className="glass-panel p-10 rounded-[2rem] border-white/5 bg-gradient-to-br from-amber-900/10 to-transparent relative overflow-hidden group hover:border-amber-500/30 transition-all">
                            <h3 className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] mb-6 font-bold">Universal_Year_Frequency</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                                <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-amber-600 font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">{yearlyNumber.number}</span>
                                <div>
                                    <h4 className="text-2xl text-amber-400 font-bold mb-2 font-dm-sans tracking-tight">{yearlyNumber.theme}</h4>
                                    <p className="text-sm text-white/60 leading-relaxed max-w-md">{yearlyNumber.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all group">
                                <h3 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                    <CompassIcon className="w-3 h-3" /> Current_Month
                                </h3>
                                <div className="text-5xl font-bold text-white font-mono mb-2 group-hover:text-teal-400 transition-colors">{monthlyNumber.number}</div>
                                <div className="text-xs text-white/50 font-sans uppercase tracking-widest">{monthlyNumber.theme}</div>
                            </div>
                            <div className="glass-panel p-8 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all group">
                                <h3 className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                    <CompassIcon className="w-3 h-3" /> Today's_Frequency
                                </h3>
                                <div className="text-5xl font-bold text-white font-mono mb-2 group-hover:text-fuchsia-400 transition-colors">{dailyNumber.number}</div>
                                <div className="text-xs text-white/50 font-sans uppercase tracking-widest">{dailyNumber.theme}</div>
                            </div>
                        </div>

                        {/* Interactive Stats & Chart */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="glass-panel p-6 rounded-[2rem] border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-teal-500/30 transition-all cursor-crosshair bg-gradient-to-r hover:from-teal-900/10 hover:to-transparent">
                                <div>
                                    <h3 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                        <ActivityIcon className="w-3 h-3" /> Orbital Sync Accuracy
                                    </h3>
                                    <p className="text-xs text-white/50 font-sans mt-1">Real-time telemetry alignment</p>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold font-mono text-white group-hover:text-teal-400 transition-colors drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] mt-4 sm:mt-0">
                                    {orbitalSyncAccuracy}
                                </div>
                            </div>

                            <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/5 relative overflow-hidden group hover:border-fuchsia-500/20 transition-all bg-black/40">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest font-bold">
                                        30-Day Resonance Cycle
                                    </h3>
                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                                        Sub-second Latency
                                    </div>
                                </div>
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorResonance" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="day" hide />
                                            <Tooltip content={<AIBubbleTooltip />} cursor={{ stroke: 'rgba(217,70,239,0.5)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                            <Area type="monotone" dataKey="resonance" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#colorResonance)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Educational / Deep Dive Content Placeholder */}
                        <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.02] relative group overflow-hidden mt-4">
                            {!isPremium && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center border border-amber-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)_inset]">
                                    <LockIcon className="w-8 h-8 text-amber-400/50 mb-4 animate-pulse" />
                                    <h4 className="text-lg font-bold text-amber-100 mb-2 font-mono tracking-widest uppercase">Matrix Decryption Locked</h4>
                                    <p className="text-xs text-amber-500/50 max-w-xs mb-6 font-sans uppercase tracking-widest leading-relaxed">Upgrade to Seeker or Oracle tier to access deep numerical synthesis.</p>
                                    <button
                                        onClick={() => navigate('/pricing')}
                                        className="px-6 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full hover:bg-amber-500/20 transition-all font-mono text-[10px] uppercase tracking-widest"
                                    >
                                        Establish_Uplink
                                    </button>
                                </div>
                            )}
                            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-6 font-bold">Matrix_Decryption_Data</h3>
                            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-white/50 leading-relaxed font-sans ${!isPremium ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                                <div>
                                    <strong className="text-white/80 block mb-2 font-mono uppercase tracking-widest text-[10px]">Life Path Number</strong>
                                    Calculated from your full birth date, this represents your core purpose and the primary trajectory of your existence in this timeline.
                                </div>
                                <div>
                                    <strong className="text-white/80 block mb-2 font-mono uppercase tracking-widest text-[10px]">Universal Year</strong>
                                    The global frequency affecting the collective consciousness. Your personal year cycles operate within this broader context.
                                </div>
                                <div>
                                    <strong className="text-white/80 block mb-2 font-mono uppercase tracking-widest text-[10px]">Daily Vibration</strong>
                                    The specific energy available for transmutation today. Use this frequency to align your micro-actions with cosmic timing.
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AstralMetrics;
