import React from 'react';
import { motion } from 'framer-motion';
import { LockIcon } from '../icons';
import { useNavigate } from 'react-router-dom';

interface MatrixDecryptionProps {
    isPremium: boolean;
    data: {
        lifePath: { number: number; theme: string };
        annualCycle: { number: number; theme: string };
        dailyVibration: { number: number; theme: string };
        personalDay: { number: number; theme: string };
    };
}

const MatrixDecryption: React.FC<MatrixDecryptionProps> = ({ isPremium, data }) => {
    const navigate = useNavigate();

    return (
        <div className="relative h-full min-h-[200px] overflow-hidden">
            {!isPremium && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                    <LockIcon className="w-6 h-6 text-amber-400/50 mb-3 animate-pulse" />
                    <h4 className="text-sm font-bold text-amber-100 mb-1 font-mono tracking-widest uppercase">
                        Matrix Decryption Locked
                    </h4>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="mt-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full hover:bg-amber-500/20 transition-all font-mono text-[9px] uppercase tracking-widest"
                    >
                        Establish_Uplink
                    </button>
                </div>
            )}

            <div className={`p-6 ${!isPremium ? 'blur-sm opacity-30 select-none' : ''}`}>
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold mb-4">
                    Numerical_Synthesis_Engine
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Life_Path', val: data.lifePath.number, sub: data.lifePath.theme },
                        { label: 'Annual_Freq', val: data.annualCycle.number, sub: data.annualCycle.theme },
                        { label: 'Daily_Vibe', val: data.dailyVibration.number, sub: data.dailyVibration.theme },
                        { label: 'Personal_Sync', val: data.personalDay.number, sub: data.personalDay.theme },
                    ].map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                        >
                            <div className="text-[9px] text-gray-500 font-mono uppercase mb-1">{item.label}</div>
                            <div className="text-2xl font-bold text-white font-mono">{item.val}</div>
                            <div className="text-[9px] text-cyan-400/60 uppercase tracking-tighter truncate">{item.sub}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase">
                        <span>Sync_Probability</span>
                        <span className="text-cyan-400">0.982</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '98.2%' }}
                            className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatrixDecryption;
