import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateContentWithRetry } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';
import { generateCosmicBlueprint } from '../../services/cosmicService';
import type { SpatialCard, AstralSnapshot } from '../../types/tarot-spatial';

interface ReadingSynthesisProps {
    spreadCards: SpatialCard[];
    spreadType: string;
    spreadId: string;
    astral: AstralSnapshot;
    onClose: () => void;
}

export const ReadingSynthesis: React.FC<ReadingSynthesisProps> = ({ spreadCards, spreadType, spreadId, astral, onClose }) => {
    const { activeProfile, addSavedReading, addXp, activeDeckId } = useApp();
    const [isGenerating, setIsGenerating] = useState(true);
    const [narrative, setNarrative] = useState<string>('');
    const [prompts, setPrompts] = useState<string[]>([]);
    const [hasError, setHasError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!spreadCards || spreadCards.length === 0) return;

        const generateSynthesis = async () => {
            setIsGenerating(true);
            setHasError(false);

            try {
                const cosmic = activeProfile ? generateCosmicBlueprint(activeProfile) : null;
                const lifePathInfo = cosmic?.lifePath?.number ? `Life Path ${cosmic.lifePath.number}` : 'Unknown';
                const dailyNum = astral.dailyNumber || 'Unknown';
                const dominantElement = astral.dominantElement || 'Unknown';

                const cardsInfo = spreadCards.map((c, i) => `Position ${i + 1}: ${c.card.name} (${c.isReversed ? 'Reversed' : 'Upright'})`).join(', ');

                const prompt = `You are an elite cyber-mystic oracle analyzing a Tarot spread.
Spread Type: ${spreadType}
Cards: ${cardsInfo}

User Astral Metrics:
- Life Path: ${lifePathInfo}
- Daily Number: ${dailyNum}
- Dominant Element: ${dominantElement}

Phase 1: Deep Dive Narrative (approx 800 words, use Markdown). 
Synthesize the cards into a cohesive story connecting their past, present, and future, or the relevant spread positions. 
CRITICAL REQUIREMENT: You MUST strictly cite and synthesize at least two specific Astral Metrics listed above (e.g. Life Path, Daily Number, or Dominant Element). Merge the symbolism of the tarot cards with these metrics natively. Keep the tone cyberpunk, ethereal, and profound.

Phase 2: The Integration Journal.
After the narrative, output exactly 3 distinct, tailored journaling prompts designed for the user's "Orgit" workflow, reflecting the reading. Prefix each prompt exactly with "PROMPT: ". Do not use numbering.`;

                const res = await generateContentWithRetry({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000,
                    }
                });

                const text = res?.text;
                if (!text) throw new Error("No synthesis generated");

                // Split into narrative and prompts
                const lines = text.split('\n');
                const rawNarrative: string[] = [];
                const rawPrompts: string[] = [];

                lines.forEach((line: string) => {
                    if (line.trim().startsWith('PROMPT:')) {
                        rawPrompts.push(line.replace('PROMPT:', '').trim());
                    } else {
                        rawNarrative.push(line);
                    }
                });

                setNarrative(rawNarrative.join('\n').trim());
                setPrompts(rawPrompts);
            } catch (err) {
                console.error("Failed to generate synthesis:", err);
                setHasError(true);
            } finally {
                setIsGenerating(false);
            }
        };

        generateSynthesis();
    }, [spreadCards, spreadType, astral, activeProfile]);

    const handleSaveReading = async () => {
        if (!addSavedReading || isSaved) return;
        setIsSaving(true);
        try {
            const drawnCards = spreadCards.map((sc, i) => ({
                card: sc.card,
                isReversed: sc.isReversed || false,
                positionId: `zone_${i}`
            }));

            await addSavedReading({
                title: `${spreadType.replace('_', ' ').toUpperCase()} READING`,
                spreadType: spreadId as any,
                deckType: 'tarot',
                deckId: activeDeckId || 'default_tarot',
                positions: spreadCards.map((_, i) => `zone_${i}`),
                aiSummary: narrative,
                userNotes: '',
                cards: drawnCards,
                practicalActions: prompts
            });

            if (addXp) {
                await addXp(25, 'Reading Integrated');
            }
            setIsSaved(true);
        } catch (err) {
            console.error('Failed to save reading:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-xl flex justify-center items-start pt-[10vh] pb-[10vh] overflow-y-auto px-4 sm:px-12 custom-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="max-w-3xl w-full flex flex-col gap-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-0 top-0 text-white/40 hover:text-white transition-colors"
                    >
                        [ CLOSE ]
                    </button>

                    <div className="text-center">
                        <h2 className="text-2xl font-mono uppercase tracking-[0.2em] text-purple-400 mb-2">The Synthesis</h2>
                        <div className="w-16 h-px bg-purple-500/30 mx-auto"></div>
                    </div>

                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 rounded-full border border-purple-500/30 border-t-purple-400 animate-spin"></div>
                            <p className="text-xs font-mono text-purple-300/50 uppercase tracking-widest animate-pulse">
                                Synthesizing Oracle Data...
                            </p>
                        </div>
                    ) : hasError ? (
                        <div className="text-center text-red-400 border border-red-500/20 bg-red-500/5 p-6 rounded-xl">
                            <p className="font-mono text-sm uppercase tracking-widest">Signal Interrupted</p>
                            <p className="text-xs opacity-70 mt-2">The oracle could not process the telemetry. Try again.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {/* Deep Dive Narrative */}
                            <div className="prose prose-invert prose-purple max-w-none text-white/70 font-light leading-relaxed">
                                {narrative.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line === '' ? <br /> : <p className="mb-4">{line}</p>}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Journal Area */}
                            {prompts.length > 0 && (
                                <div className="border border-white/10 bg-white/5 rounded-2xl p-8 pb-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/50 via-purple-500/50 to-indigo-500/50"></div>
                                    <h3 className="text-xl font-mono uppercase tracking-widest text-teal-400 mb-6">Integration Journal</h3>
                                    <p className="text-sm text-white/40 mb-8 border-b border-white/5 pb-4">
                                        Reflect on these customized Orgit prompts to align your trajectory with the reading.
                                    </p>
                                    <div className="flex flex-col gap-6">
                                        {prompts.map((prompt, j) => (
                                            <div key={j} className="flex gap-4">
                                                <div className="w-6 h-6 shrink-0 rounded-full border border-teal-500/30 text-teal-400 flex items-center justify-center text-xs font-mono">
                                                    {j + 1}
                                                </div>
                                                <p className="text-white/80 leading-relaxed font-light">{prompt}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-white/5">
                                        <button
                                            onClick={handleSaveReading}
                                            disabled={isSaving || isSaved}
                                            className={`w-full py-3 rounded-xl transition-all font-mono uppercase tracking-wider text-sm flex items-center justify-center gap-3 border ${isSaved
                                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 cursor-default'
                                                : 'bg-teal-500/10 text-teal-300 border-teal-500/20 hover:bg-teal-500/20 hover:border-teal-500/40 cursor-pointer'
                                                }`}
                                        >
                                            <span>{isSaving ? 'Enshrining...' : isSaved ? 'Reading Enshrined' : 'Send to Orgit'}</span>
                                            {!isSaving && !isSaved && <span className="text-base">↗</span>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
