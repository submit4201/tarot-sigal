import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { DrawnCard, DailyInsights } from '../../types';
import { TAROT_DECK } from '../../constants';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../../services/geminiService';
import { DAILY_INSIGHT_PROMPT } from '../../constants/prompts';
import DivinationCardDisplay from '../TarotCard';
import { ZapIcon, BookOpenIcon, CompassIcon, SunIcon } from '../icons';

const TelemetryModule: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; className?: string }> = ({ icon, title, children, delay, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay / 1000, duration: 0.8, ease: "easeOut" }}
            className={`glass-panel p-6 rounded-3xl border-white/5 flex flex-col group transition-all duration-500 hover:bg-white/10 hover:border-cyan-500/40 relative overflow-hidden bg-black/40 backdrop-blur-xl ${className || ''}`}
        >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent -translate-y-full group-hover:animate-[scan_2s_infinite_linear] pointer-events-none"></div>
            <header className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-cyan-400 flex items-center gap-2 uppercase">
                    <span className="text-cyan-300">{icon}</span> {title}
                </h3>
            </header>
            <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap flex-grow font-dm-sans prose prose-invert max-w-none">
                {children}
            </div>
        </motion.div>
    );
};

const DivinationProtocol: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addDailyDrawToHistory, dailyDrawHistory, activeProfile, addXp, updateDailyDrawInsights } = useApp();
    const [chosenCard, setChosenCard] = useState<DrawnCard | null>(null);
    const [hasChosen, setHasChosen] = useState(false);
    const [dailyInsights, setDailyInsights] = useState<DailyInsights | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    useEffect(() => {
        if (!activeProfile) return;
        const todayRecord = dailyDrawHistory.find(record => record.date === todayStr);
        if (todayRecord) {
            const fullCardData = TAROT_DECK.find(c => c.name === todayRecord.card);
            if (fullCardData) {
                setChosenCard({ card: fullCardData, isReversed: !!todayRecord.isRev });
                setHasChosen(true);
                if (todayRecord.insights) setDailyInsights(todayRecord.insights);
                else generateInsights({ card: fullCardData, isReversed: !!todayRecord.isRev });
            }
        }
    }, [todayStr, dailyDrawHistory, activeProfile]);

    const handleDrawCard = () => {
        if (hasChosen || isShuffling || !activeProfile) return;
        setIsShuffling(true);
        setTimeout(() => {
            const card = { card: TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)], isReversed: Math.random() < 0.3 };
            setChosenCard(card);
            setHasChosen(true);
            addDailyDrawToHistory(card);
            addXp(15);
            generateInsights(card);
            setIsShuffling(false);
        }, 1200);
    };

    const generateInsights = async (card: DrawnCard) => {
        if (isGenerating || dailyInsights || !activeProfile) return;
        setIsGenerating(true);
        setError(null);
        try {
            const sign = activeProfile.astrologicalSign !== 'None' ? activeProfile.astrologicalSign : 'the Seeker';
            const cosmicInfo = activeProfile.birthDate
                ? `Life Path derived from birth date ${activeProfile.birthDate}`
                : 'Life Path: Unknown';
            const context = `Tarot Signal: "${card.card?.name}" (${card.isReversed ? 'Inverted Polarity' : 'Standard Polarity'}). Focus: ${activeProfile.readingFocus || 'general'}.`;

            // @note Uses the canonical DAILY_INSIGHT_PROMPT — single source of truth for daily prompts.
            // Subscription tier defaults to 'seeker' here; oracle-tier prompts route via ReadingsPage.
            const tier = (activeProfile.subscriptionTier === 'oracle' ? 'oracle' : 'seeker') as 'seeker' | 'oracle';
            const batchPrompt = DAILY_INSIGHT_PROMPT(sign, context, cosmicInfo, tier);

            // Schema includes patternRecognition + numerologyInsight — no more hardcoded placeholders.
            const textSchema = {
                type: Type.OBJECT,
                properties: {
                    horoscope: { type: Type.STRING },
                    cardReading: {
                        type: Type.OBJECT,
                        properties: {
                            coreMessage: { type: Type.STRING },
                            mysticalInsight: { type: Type.STRING },
                            todaysAction: { type: Type.STRING },
                            reflectionQuestion: { type: Type.STRING },
                        },
                    },
                    combinedGuidance: { type: Type.STRING },
                    patternRecognition: { type: Type.STRING },
                    numerologyInsight: { type: Type.STRING },
                },
            };

            setGenerationStatus('Establishing uplink...');

            // @note No forced model override — uses default Puter routing for cost efficiency.
            const textRes = await generateContentWithRetry({
                contents: batchPrompt,
                config: { responseMimeType: 'application/json', responseSchema: textSchema },
                usePuter: true,
            });

            const data = JSON.parse(textRes.text || '{}');
            setGenerationStatus('Rendering visual data...');

            const newInsights: DailyInsights = {
                horoscope: data.horoscope,
                cardReading: data.cardReading,
                combinedGuidance: data.combinedGuidance,
                // Real AI-generated fields — sourced from the prompt response, not placeholders.
                patternRecognition: data.patternRecognition || '',
                numerologyInsight: data.numerologyInsight || '',
                visionSigil: '',
            };

            setDailyInsights(newInsights);
            updateDailyDrawInsights(todayStr, newInsights);
            addXp(10);
        } catch (e: any) {
            setError('Link Unstable. Quota exhausted or signal lost. Please wait and refresh.');
            console.error(e);
        } finally {
            setIsGenerating(false);
            setGenerationStatus('');
        }
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 overflow-y-auto w-full h-full flex flex-col items-center">

            {/* Background elements */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.05),transparent_70%)] pointer-events-none"></div>

            <div className="w-full max-w-6xl p-8 pt-24 pb-32 relative z-10 min-h-full flex flex-col">
                <header className="flex justify-between items-center mb-16 w-full shrink-0">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-[0.3em] uppercase mb-2 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">Divination Protocol</h1>
                        <p className="font-sans text-cyan-500/50 tracking-widest uppercase text-xs">Extract the day's signal across the void.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-widest hover:bg-cyan-500/10 hover:border-cyan-400 transition-all rounded-full drop-shadow-lg"
                    >
                        [ Return to Orrery ]
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start flex-grow w-full">
                    {/* Left/Top: Card Display */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                        <div className="relative group cursor-pointer transition-all duration-1000 mb-8" onClick={handleDrawCard}>
                            {!hasChosen && (
                                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="px-8 py-4 rounded-full bg-cyan-900/40 backdrop-blur-3xl border border-cyan-500/50 text-white font-mono text-xs tracking-[0.4em] animate-pulse uppercase shadow-[0_0_20px_rgba(0,229,255,0.5)] font-bold">Initiate Sequence</div>
                                </div>
                            )}
                            <DivinationCardDisplay drawnCard={chosenCard || { card: TAROT_DECK[0], isReversed: false }} isRevealed={hasChosen} className={`mx-auto transition-all duration-1000 ${isShuffling ? 'scale-90 rotate-12 blur-md' : 'scale-100 hover:scale-[1.03] shadow-[0_0_40px_rgba(0,229,255,0.2)]'}`} />
                        </div>
                        <AnimatePresence>
                            {hasChosen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-8 py-3 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-[10px] font-mono text-cyan-300 uppercase tracking-[0.4em] flex items-center gap-3 shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-md"
                                >
                                    <ZapIcon className="w-4 h-4 text-cyan-400 animate-pulse" /> Signal Locked
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right/Bottom: Insight Feed */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {!hasChosen && (
                            <div className="flex-grow flex items-center justify-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl h-full font-mono text-sm tracking-widest text-white/30 uppercase text-center border-dashed">
                                Awaiting temporal alignment...
                            </div>
                        )}

                        {hasChosen && (
                            <AnimatePresence mode="popLayout">
                                <TelemetryModule icon={<SunIcon className="w-4 h-4" />} title="Celestial_Downlink" delay={200} className="border-l-amber-500/40 bg-amber-500/[0.03]">
                                    <p className="text-sm italic text-white/90">
                                        {isGenerating ? generationStatus : dailyInsights?.horoscope || "Decoding..."}
                                    </p>
                                </TelemetryModule>

                                {isGenerating && (
                                    <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 animate-pulse h-64 bg-white/[0.02] flex items-center justify-center">
                                        <span className="font-mono text-xs tracking-widest text-white/30 uppercase">Synthesizing Data...</span>
                                    </div>
                                )}

                                {!isGenerating && dailyInsights?.cardReading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="space-y-6"
                                    >
                                        <TelemetryModule icon={<BookOpenIcon className="w-4 h-4" />} title="Core_Data_Diagnostic" delay={400} className="border-l-sky-500/40 bg-sky-500/[0.02]">
                                            <div className="space-y-8">
                                                <p className="text-white text-xl font-medium tracking-tight leading-tight italic">"{dailyInsights.cardReading.coreMessage}"</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                                        <h4 className="text-[10px] font-mono text-cyan-400 uppercase mb-2 font-bold tracking-widest">Spectral_Insight</h4>
                                                        <p className="text-sm text-white/70">{dailyInsights.cardReading.mysticalInsight}</p>
                                                    </div>
                                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                                        <h4 className="text-[10px] font-mono text-fuchsia-400 uppercase mb-2 font-bold tracking-widest">Tactical_Directive</h4>
                                                        <p className="text-sm text-white/70">{dailyInsights.cardReading.todaysAction}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TelemetryModule>

                                        <TelemetryModule icon={<CompassIcon className="w-4 h-4" />} title="Integrated_Synthesis" delay={600} className="border-l-purple-500/40 bg-purple-500/[0.02]">
                                            <div className="text-[15px] leading-relaxed text-white/80">{dailyInsights.combinedGuidance}</div>
                                        </TelemetryModule>
                                    </motion.div>
                                )}

                                {!isGenerating && dailyInsights?.visionSigil && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="w-full glass-panel rounded-[2rem] border-white/5 bg-black overflow-hidden relative group h-48 shadow-2xl"
                                    >
                                        <img src={dailyInsights.visionSigil} alt="Vision Sigil" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-1000 group-hover:scale-105" />
                                        <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/80 backdrop-blur-md rounded border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/50">
                                            Generated_Sigil_Artifact
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] text-center animate-pulse">
                                System Alert: {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DivinationProtocol;
