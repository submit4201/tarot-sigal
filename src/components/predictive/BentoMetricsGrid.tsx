import React from 'react';
import { motion } from 'framer-motion';
import { CompassIcon } from '../icons';
import MatrixDecryption from './MatrixDecryption';
import type { OptimizationWindow } from '../../types/predictive';

interface BentoMetricsGridProps {
    isPremium: boolean;
    optimizationWindows: OptimizationWindow[];
    monthlyNumber: { number: number; theme: string };
    yearlyNumber: { number: number; theme: string };
    dailyNumber: { number: number; theme: string };
    personalDay: { number: number; theme: string };
    lifePath: { number: number; theme: string };
}

const BentoMetricsGrid: React.FC<BentoMetricsGridProps> = ({
    isPremium,
    optimizationWindows,
    monthlyNumber,
    yearlyNumber,
    dailyNumber,
    personalDay,
    lifePath,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            {/* 1. Optimization Windows (Wide) */}
            <div className="lg:col-span-2 lg:row-span-2 glass-panel p-6 rounded-[2rem] border-white/5 bg-black/30 flex flex-col shrink-0 min-h-[300px]">
                <h3 className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                    <CompassIcon className="w-3 h-3" /> Optimization_Streams
                </h3>
                <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {optimizationWindows.slice(0, 5).map((win, i) => {
                        const colors: Record<string, string> = {
                            power: 'border-red-500/30 text-red-400 bg-red-500/5',
                            flow: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
                            harmony: 'border-green-500/30 text-green-400 bg-green-500/5',
                            rest: 'border-gray-500/30 text-gray-400 bg-gray-500/5',
                        };
                        const cls = colors[win.type] || colors.rest;
                        return (
                            <motion.div
                                key={`${win.channel}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`p-3 rounded-xl border ${cls.split(' ')[0]} ${cls.split(' ')[2]}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[10px] font-mono uppercase tracking-wider ${cls.split(' ')[1]}`}>
                                        {win.type} :: {win.channel}
                                    </span>
                                    <span className="text-[10px] font-mono text-white/30 truncate ml-2">
                                        Hr {win.startHour} → {win.endHour}
                                    </span>
                                </div>
                                <p className="text-[11px] text-white/60 leading-tight">{win.insight}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Universal Year (Small) */}
            <div className="glass-panel p-5 rounded-[2rem] border-white/5 bg-black/20 text-center hover:bg-white/5 transition-all group flex flex-col justify-center">
                <h3 className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-2 font-bold">Universal_Year</h3>
                <div className="text-3xl font-bold text-white font-mono group-hover:text-amber-400 transition-colors">{yearlyNumber.number}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1 truncate">{yearlyNumber.theme}</div>
            </div>

            {/* 3. Monthly Number (Small) */}
            <div className="glass-panel p-5 rounded-[2rem] border-white/5 bg-black/20 text-center hover:bg-white/5 transition-all group flex flex-col justify-center">
                <h3 className="text-[9px] font-mono text-teal-400 uppercase tracking-widest mb-2 font-bold">Monthly_Freq</h3>
                <div className="text-3xl font-bold text-white font-mono group-hover:text-teal-400 transition-colors">{monthlyNumber.number}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1 truncate">{monthlyNumber.theme}</div>
            </div>

            {/* 4. Daily Frequency (Small) */}
            <div className="glass-panel p-5 rounded-[2rem] border-white/5 bg-black/20 text-center hover:bg-white/5 transition-all group flex flex-col justify-center">
                <h3 className="text-[9px] font-mono text-fuchsia-400 uppercase tracking-widest mb-2 font-bold">Daily_Vibe</h3>
                <div className="text-3xl font-bold text-white font-mono group-hover:text-fuchsia-400 transition-colors">{dailyNumber.number}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1 truncate">{dailyNumber.theme}</div>
            </div>

            {/* 5. Matrix Decryption (Wide Bottom or Side) */}
            <div className="lg:col-span-2 lg:row-span-1 glass-panel rounded-[2rem] border-cyan-500/20 bg-black/40 overflow-hidden min-h-[220px]">
                <MatrixDecryption
                    isPremium={isPremium}
                    data={{
                        lifePath: lifePath,
                        annualCycle: yearlyNumber,
                        dailyVibration: dailyNumber,
                        personalDay: personalDay
                    }}
                />
            </div>

            {/* 6. Personal Day (Small) */}
            <div className="glass-panel p-5 rounded-[2rem] border-violet-500/20 bg-black/20 text-center hover:bg-white/5 transition-all group flex flex-col justify-center">
                <h3 className="text-[9px] font-mono text-violet-400 uppercase tracking-widest mb-2 font-bold">Personal_Day</h3>
                <div className="text-3xl font-bold text-white font-mono group-hover:text-violet-400 transition-colors">{personalDay.number}</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1 truncate">{personalDay.theme}</div>
            </div>

        </div>
    );
};

export default BentoMetricsGrid;
