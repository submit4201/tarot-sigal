
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getDailySeed, calculateDailyNumber, drawDailyCard, calculateMonthlyNumber } from '../services/tarotService';
import { DrawnCard, DailyInsights } from '../types';
import DivinationCardDisplay from '../components/TarotCard';
import { SunIcon, BookOpenIcon, SparklesIcon, ZapIcon, DnaIcon, CompassIcon, LayersIcon } from '../components/icons';
import { generateContentWithRetry } from '../services/geminiService'; // Import the retry service
import { DAILY_INSIGHT_PROMPT } from '../constants/prompts';
import { generateCosmicBlueprint } from '../services/cosmicService';
import CosmicBlueprintDisplay from '../components/CosmicBlueprintDisplay';
import { TAROT_DECK } from '../constants';
import { getLocalDateString, getTimeUntilMidnight } from '../utils/dateUtils';

import CyberpunkAd from '@/components/ui/CyberpunkAd';
import PremiumModal from '../components/PremiumModal';

const TelemetryModule: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; className?: string }> = ({ icon, title, children, delay, className }) => {
    return (
        <div className={`glass-panel p-6 rounded-3xl border-white/5 animate-fade-in-up flex flex-col group transition-all duration-500 hover:bg-white/10 hover:border-purple-500/40 relative overflow-hidden ${className || ''}`} style={{ animationDelay: `${delay}ms` }}>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent -translate-y-full group-hover:animate-[scan_2s_infinite_linear] pointer-events-none"></div>
            <header className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h3 className="text-[10px] font-mono font-bold tracking-[0.4em] text-purple-400 flex items-center gap-2 uppercase">
                    <span className="text-purple-300">{icon}</span> {title}
                </h3>
            </header>
            <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap flex-grow font-dm-sans prose prose-invert max-w-none">
                {children}
            </div>
        </div>
    );
};

/**
 * @description Countdown timer displaying time until the next daily card flip.
 * Updates every second and resets at local midnight.
 */
const CountdownTimer: React.FC<{ hasChosen: boolean }> = ({ hasChosen }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeUntilMidnight());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex flex-col items-end group hover:border-teal-500/30 transition-all">
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 group-hover:text-teal-400 transition-colors">
                {hasChosen ? 'Next_Sync_In' : 'Session_Window'}
            </span>
            <span className="text-xs font-bold font-mono tracking-tight tabular-nums" style={{ color: hasChosen ? '#2dd4bf' : '#a78bfa' }}>
                {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
            </span>
        </div>
    );
};

const DailyPage: React.FC = () => {
    const { addDailyDrawToHistory, dailyDrawHistory, activeProfile, addXp, updateDailyDrawInsights, updateDailyDrawReflection, isPremium } = useApp();
    const [chosenCard, setChosenCard] = useState<DrawnCard | null>(null);
    const [hasChosen, setHasChosen] = useState(false);
    const [dailyInsights, setDailyInsights] = useState<DailyInsights | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isAdVisible, setIsAdVisible] = useState(false);
    const [isPaywallVisible, setIsPaywallVisible] = useState(false);
    const [pendingInsightsCard, setPendingInsightsCard] = useState<DrawnCard | null>(null);

    if (!activeProfile) return <div className="p-8 font-mono animate-pulse text-purple-400 uppercase tracking-widest">Initialising_Link...</div>;

    const today = new Date();
    // @note Uses local timezone date string so daily card resets at local midnight, not UTC
    const todayStr = getLocalDateString(today);
    const dailySeed = useMemo(() => getDailySeed(activeProfile, today), [activeProfile, todayStr]);
    const dailyNumber = useMemo(() => calculateDailyNumber(today), [todayStr]);

    // Hash for display only
    const frequencyFingerprint = useMemo(() => dailySeed.toString(16).toUpperCase().padStart(8, '0'), [dailySeed]);

    useEffect(() => {
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
    }, [todayStr, dailyDrawHistory]);

    const handleDrawCard = () => {
        if (hasChosen || isShuffling) return;
        setIsShuffling(true);
        setTimeout(() => {
            // Reverted to true random draw (per user request)
            // const card = drawDailyCard(dailySeed); 
            const card = { card: TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)], isReversed: Math.random() < 0.3 };

            setChosenCard(card);
            setHasChosen(true);
            addDailyDrawToHistory(card);
            addXp(15);
            generateInsights(card);
            setIsShuffling(false);
        }, 1200);
    };

    const handleNavigateToNumerology = () => {
        window.location.hash = '#numerology';
    };

    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);

    const handleAdFinish = () => {
        setIsAdVisible(false);
        if (pendingInsightsCard) {
            // Trigger generation automatically after ad
            generateInsights(pendingInsightsCard);
            setPendingInsightsCard(null);
        }
    };

    const generateInsights = async (card: DrawnCard) => {
        if (isGenerating || dailyInsights) return;

        if (!isPremium && !pendingInsightsCard) {
            setPendingInsightsCard(card);
            setIsAdVisible(true);
            return;
        }

        if (!isPremium && pendingInsightsCard) {
            // If we're here, it means the ad was shown, and now we need to show the paywall.
            // This path should ideally be handled by the modal flow, but as a fallback:
            setIsPaywallVisible(true);
            return;
        }

        setIsGenerating(true);
        setError(null);
        try {
            const sign = activeProfile.astrologicalSign !== 'None' ? activeProfile.astrologicalSign : 'the Seeker';
            // journalContext is now handled by DailyGuidance internally or passed via props
            const journalContext = ''; // Placeholder, actual context will be passed to DailyGuidance

            const cosmicInfo = activeProfile.birthDate ? `Calculated. Focus: ${activeProfile.readingFocus}. Cosmic Alignment: Life Path ${cosmicBlueprint?.lifePath.number}` : 'Unknown';

            // BATCH TEXT PROMPT - Consolidated in constants/prompts.ts
            const batchPrompt = DAILY_INSIGHT_PROMPT(sign, journalContext, cosmicInfo)
                .replace('{cardName}', card.card?.name || 'Unknown Card')
                .replace('{polarity}', card.isReversed ? 'Inverted Polarity' : 'Standard Polarity');

            setGenerationStatus('Establishing uplink...');

            // Step 1: Generate Text (Critical)
            const textRes = await generateContentWithRetry({
                usePuter: true,
                contents: batchPrompt
            });

            // Extract text handling potential json markdown wrappers
            let rawText = textRes.text || '{}';
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(rawText);

            setGenerationStatus('Rendering visual data...');

            // Step 2: Generate Sigil (Secondary)
            let sigilBase64 = "";
            // Sigil generation deactivated due to OpenRouter chat/completions limitation.
            // Image generation via OpenRouter requires specialized routing 
            // and an image-capable model.

            const newInsights: DailyInsights = {
                horoscope: data.horoscope,
                cardReading: data.cardReading,
                combinedGuidance: data.combinedGuidance,
                patternRecognition: 'Sector pattern stabilized.',
                numerologyInsight: `Frequency: ${dailyNumber.number} (${dailyNumber.theme}).`,
                visionSigil: sigilBase64
            };

            setDailyInsights(newInsights);
            updateDailyDrawInsights(todayStr, newInsights);
            addXp(10);
            setPendingInsightsCard(null); // Clear pending card after successful generation
        } catch (e: any) {
            setError("Link Unstable. Quota exhausted or signal lost. Please wait and refresh.");
            console.error(e);
        } finally {
            setIsGenerating(false);
            setGenerationStatus('');
        }
    };

    return (
        <div className="w-full h-full p-4 md:p-6 lg:p-10 overflow-y-auto bg-grid relative flex flex-col items-center scroll-smooth">
            <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 gap-8 relative z-20">
                <div className="flex flex-col items-center md:items-start group cursor-help">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-glow animate-pulse"></div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.5em] font-bold">Ether_Link_Connected</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow glitch-text" data-text="Daily Revelation">Daily Revelation</h1>

                    {/* Contextual Tooltip */}
                    <div className="absolute top-full left-0 mt-4 p-4 bg-black/90 border border-purple-500/30 rounded-xl text-xs text-text-muted max-w-xs backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <p className="font-mono text-purple-400 mb-1 uppercase font-bold">Protocol Info</p>
                        This reading is deterministically seeded by your specific bio-data and the current date. It remains constant for 24 hours.
                    </div>
                </div>

                <div className="flex gap-4">
                    <CountdownTimer hasChosen={hasChosen} />
                    <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex flex-col items-end group hover:border-purple-500/30 transition-all">
                        <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 group-hover:text-purple-400 transition-colors">Session_Fingerprint</span>
                        <span className="text-xs font-bold text-purple-400 font-mono tracking-tight">0x{frequencyFingerprint}</span>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start relative z-10">

                {/* Left Col: Numerology Link */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-10">
                    <button
                        onClick={handleNavigateToNumerology}
                        className="w-full glass-panel p-6 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden bg-black/40 group hover:bg-purple-900/10 hover:border-purple-500/30 transition-all text-left"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity"><DnaIcon className="w-8 h-8 text-purple-500" /></div>
                        <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-3 font-bold">Numerology_Link</h3>
                        <div className="text-4xl font-bold text-white font-dm-sans mb-1">{dailyNumber.number}</div>
                        <div className="text-[10px] text-white/50 font-mono uppercase mb-4">{dailyNumber.theme}</div>
                        <div className="flex items-center gap-2 text-xs text-purple-300 font-bold group-hover:translate-x-2 transition-transform">
                            <span>Access Matrix</span> <span className="text-lg">→</span>
                        </div>
                    </button>
                </div>

                {/* Center: Card Draw */}
                <div className="lg:col-span-6 flex flex-col items-center">
                    <div className="relative group cursor-pointer transition-all duration-1000" onClick={handleDrawCard}>
                        {!hasChosen && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                                <div className="px-10 py-6 rounded-full bg-purple-600/30 backdrop-blur-3xl border border-purple-500/50 text-white font-mono text-xs tracking-[0.6em] animate-pulse uppercase shadow-glow font-bold">Synchronize_Ether</div>
                            </div>
                        )}
                        <DivinationCardDisplay drawnCard={chosenCard || { card: TAROT_DECK[0], isReversed: false }} isRevealed={hasChosen} className={`mx-auto transition-all duration-1000 ${isShuffling ? 'scale-90 rotate-12 blur-md' : 'scale-100 hover:scale-[1.03]'}`} />
                    </div>
                    {hasChosen && <div className="mt-12 px-10 py-4 rounded-full border border-teal-500/20 bg-teal-500/5 text-[10px] font-mono text-teal-400 uppercase tracking-[0.6em] flex items-center gap-4 animate-fade-in shadow-glow font-bold"><ZapIcon className="w-4 h-4 animate-pulse" /> Signal_Alignment_Stabilized</div>}
                </div>

                {/* Right Col: Horoscope / Context */}
                <div className="lg:col-span-3 space-y-6">
                    <TelemetryModule icon={<SunIcon className="w-4 h-4" />} title="Celestial_Downlink" delay={200} className="border-l-amber-500/40 bg-amber-500/[0.03] min-h-[220px]">
                        <p className="text-sm italic leading-relaxed text-white font-dm-sans">
                            {isGenerating ? generationStatus : dailyInsights?.horoscope || "Awaiting synchronization..."}
                        </p>
                    </TelemetryModule>
                </div>
            </div>

            {/* Bottom: Detailed Insights */}
            <div className="w-full max-w-5xl pb-40 px-4 relative z-10">
                {hasChosen && (
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <h2 className="text-[11px] font-mono text-white/40 uppercase tracking-[0.8em] font-bold">Expansion_Protocols</h2>
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                )}

                {isGenerating ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => <div key={i} className="glass-panel p-10 rounded-[2.5rem] border-white/5 animate-pulse h-64 bg-white/[0.02]"></div>)}
                    </div>
                ) : (
                    <div className="space-y-10">
                        {hasChosen && dailyInsights?.cardReading && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
                                <TelemetryModule icon={<BookOpenIcon className="w-4 h-4" />} title="Core_Data_Diagnostic" delay={100} className="lg:col-span-8 border-l-sky-500/40 bg-sky-500/[0.02]">
                                    <div className="space-y-8">
                                        <p className="text-white/90 text-2xl font-medium tracking-tight leading-tight italic">"{dailyInsights.cardReading.coreMessage}"</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                                                <h4 className="text-[10px] font-mono text-purple-400 uppercase mb-3 font-bold tracking-widest">Spectral_Insight</h4>
                                                <p className="text-sm leading-relaxed text-text-muted">{dailyInsights.cardReading.mysticalInsight}</p>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors shadow-inner">
                                                <h4 className="text-[10px] font-mono text-teal-400 uppercase mb-3 font-bold tracking-widest">Tactical_Directive</h4>
                                                <p className="text-sm leading-relaxed text-text-muted">{dailyInsights.cardReading.todaysAction}</p>
                                            </div>
                                        </div>

                                        {/* Reflection Question Section */}
                                        <div className="p-8 bg-purple-500/5 rounded-[2.5rem] border border-purple-500/20 shadow-glow mx-auto max-w-2xl text-center">
                                            <h4 className="text-[10px] font-mono text-purple-300 uppercase mb-4 font-bold tracking-[0.4em]">Daily_Koan</h4>
                                            <p className="text-xl text-white font-medium italic leading-relaxed">
                                                {dailyInsights.cardReading.reflectionQuestion}
                                            </p>
                                        </div>

                                        {/* Personal Reflection Area */}
                                        <div className="pt-6">
                                            <h4 className="text-[10px] font-mono text-text-muted uppercase mb-4 font-bold tracking-widest">Personal_Reflection_Log</h4>
                                            <textarea
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-all resize-none font-dm-sans"
                                                placeholder="Decrypt your internal signals here..."
                                                defaultValue={dailyDrawHistory.find(r => r.date === todayStr)?.userReflection || ''}
                                                onBlur={(e) => updateDailyDrawReflection(todayStr, e.target.value)}
                                            ></textarea>
                                            <p className="text-[9px] font-mono text-text-muted mt-2 text-right uppercase tracking-widest">Auto_Syncing_Enabled</p>
                                        </div>
                                    </div>
                                </TelemetryModule>
                                <div className="lg:col-span-4 glass-panel rounded-[2.5rem] border-white/5 bg-black/40 overflow-hidden relative group h-full shadow-2xl min-h-[300px]">
                                    {dailyInsights.visionSigil ? (
                                        <img src={dailyInsights.visionSigil} alt="Vision Sigil" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 group-hover:scale-110 transition-transform duration-[4s]" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-4 relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent"></div>
                                            <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center animate-pulse">
                                                <div className="w-16 h-16 border border-white/5 rounded-full animate-ping"></div>
                                            </div>
                                            <SparklesIcon className="w-10 h-10 text-white/20" />
                                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] z-10">Neural_Static_Active</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {dailyInsights?.combinedGuidance && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <TelemetryModule icon={<CompassIcon className="w-4 h-4" />} title="Pattern_Recognition" delay={300} className="border-l-purple-500/40 bg-purple-500/[0.02]">
                                    <div className="text-sm leading-relaxed text-text-muted">{dailyInsights.patternRecognition}</div>
                                </TelemetryModule>
                                <TelemetryModule icon={<LayersIcon className="w-4 h-4" />} title="Numerology_Weight" delay={400} className="border-l-teal-500/40 bg-teal-500/[0.02]">
                                    <div className="text-sm leading-relaxed text-text-muted">{dailyInsights.numerologyInsight}</div>
                                </TelemetryModule>
                            </div>
                        )}
                        {dailyInsights?.combinedGuidance && (
                            <TelemetryModule icon={<CompassIcon className="w-4 h-4" />} title="Integrated_Synthesis" delay={500} className="border-l-purple-500/40 bg-purple-500/[0.02]">
                                <div className="text-lg leading-relaxed text-text-muted">{dailyInsights.combinedGuidance}</div>
                            </TelemetryModule>
                        )}
                    </div>
                )}
                {error && <div className="mt-12 bg-red-500/10 border border-red-500/20 text-red-400 p-10 rounded-[2.5rem] font-mono text-[11px] uppercase tracking-[0.4em] text-center animate-pulse shadow-glow">
                    Signal Interruption: {error}
                </div>}
            </div>

            {/* Premium Gating */}
            <CyberpunkAd
                variant="modal"
                isVisible={isAdVisible}
                onClose={handleAdFinish}
                isPremium={isPremium}
            />
            <PremiumModal
                isOpen={isPaywallVisible}
                onClose={() => {
                    setIsPaywallVisible(false);
                    // If user closes paywall, and there was a pending card,
                    // we might want to clear it or re-evaluate.
                    // For now, let's just clear it.
                    setPendingInsightsCard(null);
                }}
                onUpgrade={() => window.location.hash = '#profile'}
            />
        </div>
    );
};

export default DailyPage;
