import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldIcon, ActivityIcon, ZapIcon } from '../icons';

/**
 * ArsenalCore Component
 * Core of the Arsenal Hub, focusing on stats, engagement metrics, and mastery.
 */
const ArsenalCore: React.FC = () => {
    const { activeProfile, savedReadings, dailyDrawHistory } = useApp();

    if (!activeProfile) {
        return (
            <div className="flex items-center justify-center h-64 text-pink-500/50 font-mono text-sm uppercase tracking-widest">
                [ Profile Initialization Required ]
            </div>
        );
    }

    // Collection Stats
    const totalDecksInCollection = 12; // Placeholder for total available decks
    const unlockedCount = activeProfile.ownedDeckIds?.length || 0;
    const masteryPercent = Math.round((unlockedCount / totalDecksInCollection) * 100);

    // Engagement Stats
    const totalReadings = savedReadings?.length || 0;
    const dailyStreak = dailyDrawHistory?.length || 0; // Simplified streak calculation

    // Achievement Stats
    const totalAchievements = 15;
    const unlockedAchievementsCount = activeProfile.unlockedAchievements?.length || 0;
    const achievementCompletion = Math.round((unlockedAchievementsCount / totalAchievements) * 100);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header / Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-pink-400 font-mono text-[10px] uppercase tracking-widest">
                        <ActivityIcon className="w-3 h-3" /> Collection Mastery
                    </div>
                    <div className="text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                        {masteryPercent}% <span className="text-xs text-white/30 uppercase tracking-tighter">Synchronized</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                            style={{ width: `${masteryPercent}%` }}
                        ></div>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-purple-400 font-mono text-[10px] uppercase tracking-widest">
                        <ZapIcon className="w-3 h-3" /> Digital Relics
                    </div>
                    <div className="text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                        {unlockedCount}<span className="text-xs text-white/30"> / {totalDecksInCollection}</span>
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Active Deck Licenses</div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] uppercase tracking-widest">
                        <ShieldIcon className="w-3 h-3" /> Achievements
                    </div>
                    <div className="text-3xl font-bold font-mono text-white flex items-baseline gap-2">
                        {unlockedAchievementsCount}<span className="text-xs text-white/30"> / {totalAchievements}</span>
                    </div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-2">Matrix Accolades</div>
                </div>
            </div>

            {/* Engagement Metrics */}
            <section className="space-y-4">
                <h3 className="text-xs font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
                    <ActivityIcon className="w-3 h-3 text-pink-400" /> Operational Engagement
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                        <div className="text-[10px] text-white/30 uppercase tracking-tighter">Total Readings</div>
                        <div className="text-xl font-mono text-white">{totalReadings}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                        <div className="text-[10px] text-white/30 uppercase tracking-tighter">Signal Stability</div>
                        <div className="text-xl font-mono text-white">{dailyStreak} Days</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                        <div className="text-[10px] text-white/30 uppercase tracking-tighter">Vault Progress</div>
                        <div className="text-xl font-mono text-white">{achievementCompletion}%</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
                        <div className="text-[10px] text-white/30 uppercase tracking-tighter">Stardust Surplus</div>
                        <div className="text-xl font-mono text-pink-400">{activeProfile.stardust || 0}</div>
                    </div>
                </div>
            </section>

            {/* Footer Status */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                    Arsenal System Nominal
                </div>
                <div>Last Synchronized: {new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    );
};

export default ArsenalCore;
