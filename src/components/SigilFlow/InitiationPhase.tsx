
import React, { useState } from 'react';
import EnergyVortex from '../EnergyVortex';
import { SparklesIcon } from '../icons';
import { generateContentWithRetry } from '../../services/geminiService';

interface InitiationPhaseProps {
    onComplete: (focus: string, refinedQuestion: string) => void;
}

const InitiationPhase: React.FC<InitiationPhaseProps> = ({ onComplete }) => {
    const [focus, setFocus] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [suggestion, setSuggestion] = useState<string | null>(null);

    const handleRefine = async () => {
        if (!focus || isRefining) return;
        setIsRefining(true);
        try {
            const prompt = `Rephrase this tarot question to be more empowering and open-ended: "${focus}". Return only the refined question, no quotes.`;
            const result = await generateContentWithRetry({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });
            setSuggestion(result.text || focus);
        } catch (e) {
            console.error(e);
            setSuggestion(focus); // Fallback
        } finally {
            setIsRefining(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden p-8 animate-fade-in">
            <div className="absolute inset-0 bg-indigo-950 transition-colors duration-[5s]"></div>

            <div className="relative z-10 flex flex-col items-center max-w-xl w-full">
                <EnergyVortex intensity={focus.length > 0 ? 0.8 : 0.2} color={suggestion ? '#fbbf24' : '#818cf8'} />

                <h2 className="text-3xl font-bold font-dm-sans text-white mb-8 text-center neon-glow mt-8">Where does your soul seek clarity?</h2>

                <div className="w-full relative">
                    <input
                        type="text"
                        value={focus}
                        onChange={(e) => { setFocus(e.target.value); if (suggestion) setSuggestion(null); }}
                        placeholder="e.g., Will I get fired?"
                        className="w-full bg-black/40 border border-white/20 rounded-full py-4 px-8 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all text-center backdrop-blur-md"
                        onBlur={() => { if (focus && !suggestion) handleRefine(); }}
                    />
                    {isRefining && <div className="absolute right-4 top-1/2 -translate-y-1/2"><SparklesIcon className="w-5 h-5 text-purple-400 animate-spin" /></div>}
                </div>

                {suggestion && (
                    <div className="mt-8 bg-white/5 border border-amber-500/30 p-6 rounded-2xl animate-fade-in-up w-full text-center">
                        <p className="text-xs font-mono text-amber-400 mb-2 uppercase tracking-widest">Alignment_Suggestion</p>
                        <p className="text-lg italic text-white mb-6">"{suggestion}"</p>
                        <button
                            onClick={() => onComplete(focus, suggestion)}
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
