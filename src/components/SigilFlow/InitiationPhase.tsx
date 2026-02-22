import React, { useState } from 'react';
import EnergyVortex from '../EnergyVortex';

interface InitiationPhaseProps {
    onComplete: (focus: string, refinedQuestion: string) => void;
}

const InitiationPhase: React.FC<InitiationPhaseProps> = ({ onComplete }) => {
    const [focus, setFocus] = useState('');

    const handleSubmit = () => {
        if (!focus.trim()) return;
        onComplete(focus, ''); // Pass empty string for refinedQuestion, will be handled in main prompt
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden p-8 animate-fade-in">
            <div className="absolute inset-0 bg-indigo-950 transition-colors duration-[5s]"></div>

            <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
                <EnergyVortex intensity={focus.length > 0 ? 0.8 : 0.2} color={focus.length > 0 ? '#fbbf24' : '#818cf8'} />

                <h2 className="text-3xl font-bold font-dm-sans text-white mb-8 text-center neon-glow mt-8">Where does your soul seek clarity?</h2>

                <div className="w-full relative">
                    <input
                        type="text"
                        value={focus}
                        onChange={(e) => setFocus(e.target.value)}
                        placeholder="e.g., Will I get fired?"
                        className="w-full bg-black/40 border border-white/20 rounded-full py-4 px-8 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all text-center backdrop-blur-md"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    />
                </div>

                {focus.trim() && (
                    <div className="mt-8 animate-fade-in-up w-full text-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/50 px-8 py-3 rounded-full font-bold uppercase text-sm tracking-widest transition-all hover:scale-105 active:scale-95 shadow-glow"
                        >
                            Cast Sigil
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InitiationPhase;
