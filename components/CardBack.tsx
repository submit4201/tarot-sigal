
import React from 'react';
import { SunIcon } from './icons';

export const CardBack: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`absolute inset-0 [backface-visibility:hidden] glass-panel rounded-2xl border-white/10 flex flex-col items-center justify-center p-8 overflow-hidden bg-[#0a0b12] ${className}`}>
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent"></div>

        <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white/5">
                <SunIcon className="w-full h-full text-white/5" />
            </div>
        </div>

        <div className="text-center space-y-2 relative z-10">
            <h3 className="text-[10px] font-mono font-bold tracking-[0.8em] uppercase text-white/20">GRIDPUNK</h3>
            <h3 className="text-[10px] font-mono font-bold tracking-[0.8em] uppercase text-white/20">ARCANA</h3>
        </div>
        <div className="absolute bottom-8 w-12 h-[1px] bg-white/10"></div>
    </div>
);
