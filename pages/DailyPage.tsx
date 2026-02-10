
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getDailySeed, calculateDailyNumber, drawDailyCard, calculateMonthlyNumber } from '../services/tarotService';
import { DrawnCard, DailyInsights } from '../types';
import DivinationCardDisplay from '../components/TarotCard';
import { SunIcon, BookOpenIcon, SparklesIcon, ZapIcon, DnaIcon, CompassIcon } from '../components/icons';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../services/geminiService'; // Import the retry service
import { generateCosmicBlueprint } from '../services/cosmicService';
import CosmicBlueprintDisplay from '../components/CosmicBlueprintDisplay';
import { TAROT_DECK } from '../constants';

const TelemetryModule: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; delay: number; className?: string }> = ({ icon, title, children, delay, className }) => {
    return (
        <div className={`glass-panel p-6 rounded-3xl border-white/5 animate-fade-in-up flex flex-col group transition-all duration-500 hover:bg-white/10 hover:border-purple-500/40 relative overflow-hidden ${className || ''}`} style={{ animationDelay: `${delay}ms`}}>
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

const DailyPage: React.FC = () => {
  const { addDailyDrawToHistory, dailyDrawHistory, activeProfile, addXp, updateDailyDrawInsights } = useApp();
  const [chosenCard, setChosenCard] = useState<DrawnCard | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [dailyInsights, setDailyInsights] = useState<DailyInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  if (!activeProfile) return <div className="p-8 font-mono animate-pulse text-purple-400 uppercase tracking-widest">Initialising_Link...</div>;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dailySeed = useMemo(() => getDailySeed(activeProfile, today), [activeProfile, todayStr]);
  const dailyNumber = useMemo(() => calculateDailyNumber(today), [todayStr]);
  const monthlyNumber = useMemo(() => calculateMonthlyNumber(today), [today.getMonth()]);
  const cosmicBlueprint = useMemo(() => generateCosmicBlueprint(activeProfile), [activeProfile]);
  const frequencyFingerprint = useMemo(() => dailySeed.toString(16).toUpperCase().padStart(8, '0'), [dailySeed]);

  useEffect(() => {
    const todayRecord = dailyDrawHistory.find(record => record.date === todayStr);
    if (todayRecord) {
      const fullCardData = TAROT_DECK.find(c => c.id === todayRecord.drawnCard.card.id);
      if (fullCardData) {
        setChosenCard({ card: fullCardData, isReversed: !!todayRecord.drawnCard.isReversed });
        setHasChosen(true);
        if (todayRecord.insights) setDailyInsights(todayRecord.insights);
        else generateInsights({ card: fullCardData, isReversed: !!todayRecord.drawnCard.isReversed });
      }
    }
  }, [todayStr, dailyDrawHistory]);

  const handleDrawCard = () => {
    if (hasChosen || isShuffling) return;
    setIsShuffling(true);
    setTimeout(() => {
        const card = drawDailyCard(dailySeed);
        setChosenCard(card);
        setHasChosen(true);
        addDailyDrawToHistory(card);
        addXp(15);
        generateInsights(card);
        setIsShuffling(false);
    }, 1200);
  };

  const generateInsights = async (card: DrawnCard) => {
    if (isGenerating || dailyInsights) return;
    setIsGenerating(true);
    setError(null);
    try {
        const sign = activeProfile.astrologicalSign !== 'None' ? activeProfile.astrologicalSign : 'the Seeker';
        
        // BATCH TEXT PROMPT
        const batchPrompt = `Generate a comprehensive daily diagnostic for ${sign}.
        Tarot: "${card.card?.name}" (${card.isReversed ? 'Inverted' : 'Standard'}).
        Life Path: ${cosmicBlueprint.lifePath.number}. Focus: ${activeProfile.readingFocus}.
        Requirement:
        1. A 100-word cyberpunk daily horoscope.
        2. A structured tarot reading (message, insight, action, reflection).
        3. A combined technical guidance synthesis.
        Return as JSON.`;

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
                        reflectionQuestion: { type: Type.STRING }
                    }
                },
                combinedGuidance: { type: Type.STRING }
            }
        };

        setGenerationStatus('Establishing uplink...');
        
        // Step 1: Generate Text (Critical)
        const textRes = await generateContentWithRetry({ 
            model: 'gemini-3-flash-preview', 
            contents: batchPrompt,
            config: { responseMimeType: 'application/json', responseSchema: textSchema }
        });

        const data = JSON.parse(textRes.text || '{}');
        
        setGenerationStatus('Rendering visual data...');

        // Step 2: Generate Sigil (Secondary) - Sequential to avoid burst rate limits
        let sigilBase64 = "";
        try {
            const sigilRes = await generateContentWithRetry({ 
                model: 'gemini-2.5-flash-image', 
                contents: { parts: [{ text: `A cyberpunk digital sigil for card ${card.card.name}. Electric cyan circuitry, abstract sacred geometry, dark background.` }] }
            });
            for (const part of sigilRes.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) sigilBase64 = `data:image/png;base64,${part.inlineData.data}`;
            }
        } catch (imgErr) {
            console.warn("Sigil generation failed, skipping visual artifact.", imgErr);
            // Non-critical failure, proceed with text
        }

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
      <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-16 gap-8 relative z-20">
          <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-glow animate-pulse"></div>
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.5em] font-bold">Ether_Link_Connected</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow glitch-text" data-text="Daily Revelation">Daily Revelation</h1>
          </div>
          <div className="flex gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl border-white/5 flex flex-col items-end group hover:border-purple-500/30 transition-all">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1 group-hover:text-purple-400 transition-colors">Session_Fingerprint</span>
                  <span className="text-xs font-bold text-purple-400 font-mono tracking-tight">0x{frequencyFingerprint}</span>
              </div>
          </div>
      </header>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 items-start relative z-10">
        <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 shadow-2xl relative overflow-hidden bg-black/40">
                <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3 font-bold"><DnaIcon className="w-4 h-4"/> Bio_Telemetry</h3>
                <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
            </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group cursor-pointer transition-all duration-1000" onClick={handleDrawCard}>
              {!hasChosen && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
                    <div className="px-10 py-6 rounded-full bg-purple-600/30 backdrop-blur-3xl border border-purple-500/50 text-white font-mono text-xs tracking-[0.6em] animate-pulse uppercase shadow-glow font-bold">Synchronize_Ether</div>
                </div>
              )}
              <DivinationCardDisplay drawnCard={chosenCard || { card: TAROT_DECK[0], isReversed: false }} isRevealed={hasChosen} className={`mx-auto transition-all duration-1000 ${isShuffling ? 'scale-90 rotate-12 blur-md' : 'scale-100 hover:scale-[1.03]'}`} />
            </div>
            {hasChosen && <div className="mt-12 px-10 py-4 rounded-full border border-teal-500/20 bg-teal-500/5 text-[10px] font-mono text-teal-400 uppercase tracking-[0.6em] flex items-center gap-4 animate-fade-in shadow-glow font-bold"><ZapIcon className="w-4 h-4 animate-pulse"/> Signal_Alignment_Stabilized</div>}
        </div>

        <div className="lg:col-span-4 space-y-6">
            <TelemetryModule icon={<SunIcon className="w-4 h-4"/>} title="Celestial_Downlink" delay={200} className="border-l-amber-500/40 bg-amber-500/[0.03] min-h-[220px]">
                <p className="text-lg italic leading-relaxed text-white font-dm-sans">
                  {isGenerating ? generationStatus : dailyInsights?.horoscope || "Awaiting synchronization phase..."}
                </p>
            </TelemetryModule>
            <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 grid grid-cols-2 gap-8 relative overflow-hidden bg-black/40">
                <div className="relative">
                    <p className="text-[9px] font-mono text-text-muted uppercase mb-1 tracking-widest font-bold">Universal_Day</p>
                    <p className="text-5xl font-bold text-white font-dm-sans tracking-tighter">{dailyNumber.number}</p>
                    <p className="text-[10px] text-purple-400 font-mono mt-1 opacity-70 uppercase font-bold">{dailyNumber.theme}</p>
                </div>
                <div className="relative text-right">
                    <p className="text-[9px] font-mono text-text-muted uppercase mb-1 tracking-widest font-bold">Temporal_Phase</p>
                    <p className="text-5xl font-bold text-teal-400 font-dm-sans tracking-tighter">{monthlyNumber.number}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full max-w-7xl pb-40 px-4 relative z-10">
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
                        <TelemetryModule icon={<BookOpenIcon className="w-4 h-4"/>} title="Core_Data_Diagnostic" delay={100} className="lg:col-span-8 border-l-sky-500/40 bg-sky-500/[0.02]">
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
                            </div>
                        </TelemetryModule>
                        <div className="lg:col-span-4 glass-panel rounded-[2.5rem] border-white/5 bg-black/40 overflow-hidden relative group h-full shadow-2xl">
                             {dailyInsights.visionSigil ? <img src={dailyInsights.visionSigil} alt="Vision Sigil" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 group-hover:scale-110 transition-transform duration-[4s]" /> : <div className="flex flex-col items-center justify-center py-20 gap-4"><SparklesIcon className="w-10 h-10 text-white/10 animate-spin-slow" /><span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Rendering_Sigil...</span></div>}
                        </div>
                    </div>
                )}
                {dailyInsights?.combinedGuidance && (
                    <TelemetryModule icon={<CompassIcon className="w-4 h-4"/>} title="Integrated_Synthesis" delay={300} className="border-l-purple-500/40 bg-purple-500/[0.02]">
                        <div className="text-lg leading-relaxed text-text-muted">{dailyInsights.combinedGuidance}</div>
                    </TelemetryModule>
                )}
            </div>
        )}
        {error && <div className="mt-12 bg-red-500/10 border border-red-500/20 text-red-400 p-10 rounded-[2.5rem] font-mono text-[11px] uppercase tracking-[0.4em] text-center animate-pulse shadow-glow">
            Signal Interruption: {error}
        </div>}
      </div>
    </div>
  );
};

export default DailyPage;
