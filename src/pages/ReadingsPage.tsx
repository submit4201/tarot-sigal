import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SpreadType, DrawnDivinationCard, Page, Deck, AnyCard } from '../types';
import { SPREAD_DETAILS, SHOP_DECKS } from '../constants';
import { getShuffledPreparedDeck } from '../services/tarotService';
import DivinationCardDisplay from '../components/TarotCard';
import { CardBack } from '../components/CardBack';
import PremiumModal from '../components/PremiumModal';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../services/geminiService';
import { SparklesIcon, LayersIcon, ZapIcon, BookOpenIcon, CompassIcon, UserIcon } from '../components/icons';
import { generateCosmicBlueprint } from '../services/cosmicService';
import { useHaptic } from '../hooks/useHaptic';
import { useTilt } from '../hooks/useTilt';
import { formatReadingForExport } from '../utils/exportUtils';

// * TTS Helper function
const speakText = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for mystical feel
    utterance.pitch = 0.9; // Slightly deeper
    window.speechSynthesis.speak(utterance);
};

const ReadingsPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { isPremium, addSavedReading, activeProfile, addXp, addStardust } = useApp();

    // * Reading Steps: focus-intent (Premium) -> select-spread -> select-deck -> charging -> picking-cards -> revealing -> summary
    const [readingStep, setReadingStep] = useState<'focus-intent' | 'select-spread' | 'select-deck' | 'charging' | 'picking-cards' | 'revealing' | 'summary'>('select-spread');

    // * State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [fullDeckInPlay, setFullDeckInPlay] = useState<DrawnDivinationCard[]>([]);
    const [drawnCards, setDrawnCards] = useState<(DrawnDivinationCard | null)[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [currentPickingIndex, setCurrentPickingIndex] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

    // * Immersion State
    const [shuffleEnergy, setShuffleEnergy] = useState(0); // Used for visual intensity now
    const [stabilizationProgress, setStabilizationProgress] = useState(0);
    const [hasShuffledEnough, setHasShuffledEnough] = useState(false);
    const lastMoveTimeRef = useRef<number>(Date.now());
    const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
    const { triggerSelection, triggerHover, triggerImpact, triggerRipple } = useHaptic();

    // * Reading Data
    const [aiSummary, setAiSummary] = useState('');
    const [readingTitle, setReadingTitle] = useState('');
    const [readingIntent, setReadingIntent] = useState('general'); // Premium: love, career, shadow, general
    const [userQuestion, setUserQuestion] = useState(''); // Premium
    const [refinedQuestion, setRefinedQuestion] = useState(''); // Premium AI output

    // * Extended Reading Data (Tiered)
    const [practicalActions, setPracticalActions] = useState<string[]>([]);
    const [shadowMessage, setShadowMessage] = useState('');
    const [cardRelationships, setCardRelationships] = useState('');
    const [elementalDignity, setElementalDignity] = useState('');
    const [numerologyThreads, setNumerologyThreads] = useState('');
    const [spokenNarrative, setSpokenNarrative] = useState('');
    const [perCardDeepDives, setPerCardDeepDives] = useState<string[]>([]); // New deep dive content

    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isRefiningQuestion, setIsRefiningQuestion] = useState(false);
    const [error, setError] = useState('');
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [activeDeepDiveIndex, setActiveDeepDiveIndex] = useState<number | null>(null); // For accordion view

    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);

    // * Initialize reading step based on Premium status
    useEffect(() => {
        // If user is premium, start with Intent. If not, start with Spread selection.
        if (isPremium && readingStep === 'select-spread' && !selectedSpread) {
            // We allow them to go back to select-spread, so only force this on init if desired.
            // For now, let's add a "Start New Reading" flow button that decides this.
        }
    }, [isPremium]);

    const handleStartReading = () => {
        if (isPremium) {
            setReadingStep('focus-intent');
        } else {
            setReadingStep('select-spread');
        }
        // Reset state
        setSelectedSpread(null);
        setSelectedDeck(null);
        setDrawnCards([]);
        setRevealedIndices(new Set());
        setAiSummary('');
        setReadingTitle('');
        setPracticalActions([]);
        setShadowMessage('');
        setCardRelationships('');
        setElementalDignity('');
        setNumerologyThreads('');
        setSpokenNarrative('');
        setPerCardDeepDives([]);
        setUserQuestion('');
        setRefinedQuestion('');
    };

    const handleSelectSpread = (spread: SpreadType) => {
        if (SPREAD_DETAILS[spread].isPremium && !isPremium) {
            setIsPremiumModalOpen(true);
            return;
        }
        setSelectedSpread(spread);
        setReadingStep('select-deck');
    };

    const handleSelectDeck = (deck: Deck) => {
        setSelectedDeck(deck);
        setReadingStep('charging');
        setShuffleEnergy(0);
        setStabilizationProgress(0);
        setHasShuffledEnough(false);
        lastMoveTimeRef.current = Date.now();
        triggerSelection();
    };

    // Charging Logic Loop
    useEffect(() => {
        if (readingStep !== 'charging') return;

        const interval = setInterval(() => {
            const timeSinceLastMove = Date.now() - lastMoveTimeRef.current;

            // Visual Decay of Chaos
            setShuffleEnergy(prev => Math.max(0, prev - 2));

            // Stabilization Logic
            if (hasShuffledEnough) {
                const progress = Math.min(100, (timeSinceLastMove / 2500) * 100);
                setStabilizationProgress(progress);

                if (progress >= 100) {
                    clearInterval(interval);
                    completeCharging();
                }
            }
        }, 50);

        return () => clearInterval(interval);
    }, [readingStep, hasShuffledEnough]);

    const handleChargingMove = () => {
        lastMoveTimeRef.current = Date.now();
        setShuffleEnergy(prev => Math.min(100, prev + 10)); // Spark energy
        setStabilizationProgress(0); // Reset stabilization

        if (!hasShuffledEnough && shuffleEnergy > 50) {
            setHasShuffledEnough(true);
        }

        // Haptic feedback for "shuffling feel" - trigger occasionally
        if (Math.random() > 0.7) triggerHover();
    };

    const completeCharging = () => {
        const shuffled = getShuffledPreparedDeck(selectedDeck!.cards, Date.now());
        setFullDeckInPlay(shuffled);
        setDrawnCards(new Array(SPREAD_DETAILS[selectedSpread!].cardCount).fill(null));

        setTimeout(() => {
            setReadingStep('picking-cards');
            setCurrentPickingIndex(0);
        }, 500);
    };

    const handlePickCard = (card: DrawnDivinationCard) => {
        if (!selectedSpread || currentPickingIndex >= SPREAD_DETAILS[selectedSpread].cardCount || animatingCardId) return;

        triggerSelection();
        setAnimatingCardId(card.card.id);
        setTimeout(() => {
            setDrawnCards(prev => {
                const next = [...prev];
                next[currentPickingIndex] = card;
                return next;
            });
            setFullDeckInPlay(prev => prev.filter(c => c.card.id !== card.card.id));
            if (currentPickingIndex + 1 >= SPREAD_DETAILS[selectedSpread!].cardCount) {
                setReadingStep('revealing');
            } else {
                setCurrentPickingIndex(prev => prev + 1);
            }
            setAnimatingCardId(null);
            triggerImpact();
            addXp(2);
        }, 1000);
    };

    const handleReveal = (index: number) => {
        if (revealedIndices.has(index)) return;
        setRevealedIndices(prev => new Set(prev).add(index));
    };

    // * Premium Feature: AI Question Refiner
    const handleRefineQuestion = async () => {
        if (!userQuestion.trim()) return;
        setIsRefiningQuestion(true);
        try {
            const prompt = `Rewrite this Tarot question to be more empowering and focused on self-growth. Avoid yes/no.
            User Input: "${userQuestion}"
            Context: ${readingIntent} focus.
            Output: Just the refined question text.`;

            const response = await generateContentWithRetry({ model: 'gemini-3-flash-preview', contents: prompt });
            setRefinedQuestion(response.text || userQuestion);
        } catch (e) {
            console.error(e);
            setRefinedQuestion(userQuestion); // Fallback
        } finally {
            setIsRefiningQuestion(false);
        }
    };

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setError('');

        // BATCH PROMPT
        const nodesInfo = drawnCards.map((c, i) => {
            const pos = SPREAD_DETAILS[selectedSpread!].positions[i] || `Node ${i + 1}`;
            return `Node: ${pos}. Card: ${c?.card.name} (${c?.isReversed ? 'Reversed' : 'Upright'}). Meaning: ${c?.card.meaning}.`;
        }).join('\n');

        const userContext = isPremium ? `User Question: ${refinedQuestion || userQuestion}. Intent: ${readingIntent}.` : '';

        const basePrompt = `Perform a high-fidelity, mystical-cyberpunk diagnostic synthesis for a Tarot reading.
        Array Pattern: ${selectedSpread}.
        User Context: Life Path ${cosmicBlueprint?.lifePath.number}. ${userContext}
        Data Streams:
        ${nodesInfo}
        
        Task:
        1. **Node Analysis**: For each card position, provide a ${isPremium ? 'deep, multi-layered esoteric analysis (2 paragraphs)' : 'concise but profound interpretation'}. Connect the card's archetype to the position's meaning using rich, evocative language.
        2. **Master Synthesis**: Weave a cohesive narrative that connects all cards into a singular "Cosmic Story". What is the overarching theme? (${isPremium ? 'Holistic, highly detailed, 500+ words. MUST reference card interactions.' : '200+ words'}).
        3. **Tactical Directives**: Provide 3 specific, ritualistic or practical actions the user can take to align with this energy immediately.
        4. **Shadow Signal**: Identify what is being avoided, repressed, or overlooked (The Shadow).
        ${isPremium ? `
        5. **Resonance Analysis**: Analyze how adjacent cards influence each other (elemental dignities, reinforcing/opposing energies).
        6. **Elemental Audit**: Assess the balance of Fire/Water/Air/Earth in the spread.
        7. **Numerological Threads**: Identify repeating numbers or sequences and their meaning.
        8. **Spoken Narrative Script**: A DEEPLY IMMERSIVE, second-person narrative script designed to be read aloud (TTS).
           - **Crucial**: It MUST explicitly reference the spread positions naturally (e.g., "In the foundation of your past, [Card] suggests...", "Crossing your path is [Card]...").
           - Tone: Warm, authoritative, mystical Oracle. 
           - Length: 300-500 words.
        9. **Deep Dive Protocols**: Provide a deep esoteric symbolism analysis for EACH card (astrology, kabbalah, numerology connection).
        ` : ''}
        
        Tone: Cyber-Shamanic, Mystical, Empathetic, but clinically precise. Use terms like 'frequency', 'alignment', 'archetype', 'void', 'manifestation'.
        Return strictly as JSON.`;

        // * Dynamic Schema
        const schemaProps: any = {
            nodeInterpretations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: isPremium ? "Deep multi-paragraph analysis per card" : "2-3 sentence practical interpretation per card"
            },
            summary: { type: Type.STRING, description: "Master synthesis narrative." },
            practicalActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 specific actionable steps." },
            shadowMessage: { type: Type.STRING, description: "The underlying shadow warning." }
        };

        if (isPremium) {
            schemaProps.cardRelationships = { type: Type.STRING, description: "Analysis of card interactions." };
            schemaProps.elementalDignity = { type: Type.STRING, description: "Elemental strengths/weaknesses." };
            schemaProps.numerologyThreads = { type: Type.STRING, description: "Numerological patterns." };
            schemaProps.spokenNarrative = { type: Type.STRING, description: "A script designed to be read aloud via TTS." };
            schemaProps.perCardDeepDives = {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Deep esoteric symbolism analysis for each card, matching order."
            };
        }

        const schema = {
            type: Type.OBJECT,
            properties: schemaProps,
            required: ["nodeInterpretations", "summary", "practicalActions", "shadowMessage"]
        };

        try {
            const response = await generateContentWithRetry({
                model: 'gemini-3-flash-preview',
                contents: basePrompt,
                config: { responseMimeType: 'application/json', responseSchema: schema }
            });

            const data = JSON.parse(response.text || '{}');

            setDrawnCards(prev => prev.map((c, i) => ({
                ...c!,
                interpretation: data.nodeInterpretations?.[i] || "Data unavailable."
            })));
            setAiSummary(data.summary || "Synthesis incomplete.");
            setPracticalActions(data.practicalActions || []);
            setShadowMessage(data.shadowMessage || "");

            if (isPremium) {
                setCardRelationships(data.cardRelationships || "");
                setElementalDignity(data.elementalDignity || "");
                setNumerologyThreads(data.numerologyThreads || "");
                setSpokenNarrative(data.spokenNarrative || "");
                setPerCardDeepDives(data.perCardDeepDives || []);
            }

            setReadingStep('summary');
            addStardust(isPremium ? 50 : 25);
            addXp(isPremium ? 100 : 50);
        } catch (e: any) {
            console.error(e);
            setError("Ether congestion detected. Please try again.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const handleSave = () => {
        if (!selectedSpread || !selectedDeck) return;
        triggerSelection();
        addSavedReading({
            spreadType: selectedSpread,
            deckType: selectedDeck.type,
            deckId: selectedDeck.id,
            positions: SPREAD_DETAILS[selectedSpread].positions,
            cards: drawnCards as DrawnDivinationCard[],
            title: readingTitle || `LOG_SESSION_${Date.now()}`,
            aiSummary,
            userNotes: '',
            practicalActions,
            shadowMessage,
            cardRelationships,
            elementalDignity,
            numerologyThreads,
            spokenNarrative,
            readingIntent: isPremium ? readingIntent : undefined, // Only save intent if premium flow used
            refinedQuestion: isPremium ? refinedQuestion : undefined
        });
        setReadingStep('select-spread'); // Default back to start
        setSelectedSpread(null);
        setRevealedIndices(new Set());
    };

    const handleExport = () => {
        if (!selectedSpread || !selectedDeck) return;
        triggerSelection();
        const exportText = formatReadingForExport({
            spreadType: selectedSpread,
            cards: drawnCards,
            deckId: selectedDeck.id,
            date: new Date().toISOString(),
            intent: readingIntent,
            summary: aiSummary,
            practicalActions,
            shadowMessage
        });
        navigator.clipboard.writeText(exportText);
        // Could use a toast here, but for now just visual feedback via button text change or similar would be good. 
        // Or just let the user assume it worked. Let's add a simple alert or reuse error state for "Copied!"
        setError("DATA EXPORTED TO NEURAL-LINK (Clipboard)");
        setTimeout(() => setError(""), 3000);
    };

    // --- RENDERERS ---

    // --- RENDERERS ---

    const renderCharging = () => (
        <div
            className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative overflow-hidden"
            onMouseMove={handleChargingMove}
            onTouchMove={handleChargingMove}
            onClick={handleChargingMove} // For tap-to-shuffle on mobile
        >
            <div className="absolute inset-0 bg-purple-900/10 pointer-events-none"></div>

            <h2 className="text-6xl font-bold text-white mb-2 uppercase tracking-tighter neon-glow animate-pulse">
                {hasShuffledEnough && stabilizationProgress > 0 ? 'Stabilizing Link...' : 'Shuffle Conduit'}
            </h2>
            <p className="text-white/40 font-mono text-sm uppercase tracking-[0.5em] mb-20">
                {hasShuffledEnough ? (stabilizationProgress > 0 ? 'Hold Still to Lock Signal' : 'Keep Moving to Reshuffle') : 'Agitate Void to Initialize'}
            </p>

            <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Orbital Rings - Speed based on shuffleEnergy */}
                <div className={`absolute inset-0 border border-white/10 rounded-full transition-all duration-300 ${shuffleEnergy > 10 ? 'animate-spin-fast' : 'animate-spin-slow'}`} style={{ width: '100%', height: '100%', animationDuration: `${3000 / (shuffleEnergy + 10)}ms` }}></div>
                <div className={`absolute inset-0 border border-teal-500/20 rounded-full transition-all duration-300 ${shuffleEnergy > 10 ? 'animate-spin-fast-reverse' : 'animate-reverse-spin'}`} style={{ width: '80%', height: '80%', margin: '10%', animationDuration: `${5000 / (shuffleEnergy + 10)}ms` }}></div>

                {/* Core Energy Orb - Pulses with shuffleEnergy */}
                {/* Animated Deck Stack */}
                <div className="relative w-48 h-72 perspective-1000">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-transform duration-100 ease-linear"
                            style={{
                                transform: `
                                    translateZ(${i * -2}px) 
                                    rotate(${Math.sin((Date.now() / 100) + i) * (shuffleEnergy / 10)}deg)
                                    translateX(${Math.cos((Date.now() / 100) + i) * (shuffleEnergy / 5)}px)
                                    translateY(${Math.sin((Date.now() / 100) + i) * (shuffleEnergy / 5)}px)
                                `,
                                zIndex: 10 - i,
                                opacity: 1 - (i * 0.1)
                            }}
                        >
                            <CardBack className="shadow-2xl border-white/20" />
                        </div>
                    ))}
                </div>

                {/* Stabilization Ring - Fills when still */}
                <svg className="absolute w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * stabilizationProgress / 100)}
                        className="transition-all duration-100 ease-linear shadow-[0_0_20px_rgba(45,212,191,0.8)]"
                    />
                </svg>

                {/* Text Indicator */}
                <div className="absolute z-10 font-mono text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] text-center">
                    {stabilizationProgress > 0 && hasShuffledEnough ? `${(2.5 - (stabilizationProgress / 100 * 2.5)).toFixed(1)}s` : 'MIX'}
                </div>
            </div>
        </div>
    );
    const renderFocusIntent = () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in">
            <h1 className="text-5xl font-bold font-dm-sans text-white mb-8 tracking-tighter neon-glow">Focus Your Energy</h1>
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 max-w-3xl w-full">
                <p className="text-white/60 mb-6 text-center">What is calling for clarity today?</p>
                <div className="flex gap-4 mb-8 justify-center flex-wrap">
                    {['General Guidance', 'Love & Connection', 'Career & Purpose', 'Shadow Work'].map(intent => (
                        <button
                            key={intent}
                            onClick={() => setReadingIntent(intent)}
                            className={`px-6 py-3 rounded-xl border font-mono text-xs uppercase tracking-widest transition-all ${readingIntent === intent ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/30 border-white/10 text-white/40 hover:text-white'}`}
                        >
                            {intent}
                        </button>
                    ))}
                </div>

                <div className="relative mb-8">
                    <input
                        value={userQuestion}
                        onChange={e => setUserQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-purple-500 outline-none"
                    />
                    <button
                        onClick={handleRefineQuestion}
                        disabled={!userQuestion || isRefiningQuestion}
                        className="absolute right-3 top-3 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-400 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {isRefiningQuestion ? 'Refining...' : 'Refine'}
                    </button>
                </div>

                {refinedQuestion && refinedQuestion !== userQuestion && (
                    <div className="mb-8 p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                        <p className="text-[10px] text-teal-400 uppercase font-bold mb-2 tracking-widest">Suggested Focus</p>
                        <p className="text-white text-lg font-dm-sans italic">"{refinedQuestion}"</p>
                    </div>
                )}

                <button
                    onClick={() => setReadingStep('select-spread')}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl uppercase tracking-widest shadow-glow transition-all"
                >
                    Initialize Spread Selection
                </button>
            </div>
        </div>
    );

    const renderSelectSpread = () => (
        // ... Similar to original but with back button if coming from intent
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative z-10">
            {isPremium && (
                <button onClick={() => setReadingStep('focus-intent')} className="absolute top-8 left-8 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest">← Back to Intent</button>
            )}
            <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow text-center">Select Array</h2>
            <input type="text" placeholder="SEARCH_PROTOCOLS..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-96 bg-transparent border-b border-white/20 text-white font-mono text-xl py-2 focus:outline-none focus:border-purple-500 mb-12 text-center placeholder-white/20" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {Object.entries(SPREAD_DETAILS).filter(([_, s]) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(([key, spread]) => (
                    <div key={key} onClick={() => handleSelectSpread(key as SpreadType)} className={`glass-panel p-8 rounded-[2rem] cursor-pointer hover:border-purple-500/50 transition-all group relative overflow-hidden ${spread.isPremium && !isPremium ? 'opacity-70 grayscale' : ''}`}>
                        {spread.isPremium && <div className="absolute top-4 right-4 text-amber-400"><SparklesIcon className="w-4 h-4" /></div>}
                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">{spread.name}</h3>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">{spread.description}</p>
                        <div className="flex justify-between items-center text-xs font-mono text-white/30 uppercase tracking-widest">
                            <span>{spread.cardCount}_Nodes</span>
                            <span className="group-hover:text-purple-400 transition-colors">{spread.isPremium && !isPremium ? 'PREMIUM_LOCKED' : 'Load_Protocol'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSummary = () => (
        <div className="w-full h-full p-8 overflow-y-auto animate-fade-in bg-grid flex flex-col items-center py-20 pb-40">
            <header className="text-center mb-16 max-w-4xl relative">
                {isPremium && spokenNarrative && (
                    <button onClick={() => speakText(spokenNarrative)} className="absolute -right-20 top-0 p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10" title="Play Spoken Narrative">
                        <div className="w-6 h-6 text-white">🔊</div>
                    </button>
                )}
                <div className="w-24 h-24 rounded-[2.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow"><SparklesIcon className="w-12 h-12 text-teal-400" /></div>
                <h1 className="text-7xl font-bold font-dm-sans text-white mb-4 tracking-tighter neon-glow text-center">Integrated Forecast</h1>
                <p className="text-text-muted text-xl leading-relaxed text-center">{activeProfile?.currentName}, the array is complete.</p>
            </header>

            {/* Practical Actions & Shadow (Free & Premium) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
                <div className="glass-panel p-10 rounded-[2rem] border-white/5">
                    <h3 className="text-xl font-bold text-teal-400 mb-6 font-mono uppercase tracking-widest flex items-center gap-3"><ZapIcon className="w-5 h-5" /> Action_Protocols</h3>
                    <ul className="space-y-4">
                        {practicalActions.map((action, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <span className="w-6 h-6 rounded bg-teal-500/20 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">{i + 1}</span>
                                <p className="text-white/80 leading-relaxed text-sm">{action}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass-panel p-10 rounded-[2rem] border-purple-500/20 bg-purple-500/5">
                    <h3 className="text-xl font-bold text-purple-400 mb-6 font-mono uppercase tracking-widest flex items-center gap-3"><LayersIcon className="w-5 h-5" /> Shadow_Signal</h3>
                    <p className="text-white/80 leading-relaxed italic border-l-4 border-purple-500/30 pl-4">{shadowMessage}</p>
                </div>
            </div>

            {/* Master Synthesis */}
            <div className="max-w-6xl w-full glass-panel p-16 rounded-[3rem] border-white/10 bg-[#0a0b12]/95 relative overflow-hidden shadow-2xl mb-20">
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none"><SparklesIcon className="w-96 h-96" /></div>
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-8 font-bold">Master_Synthesis_Narrative</h3>
                <p className="text-2xl leading-relaxed text-text-primary whitespace-pre-wrap font-dm-sans">{aiSummary}</p>
            </div>

            {/* Premium: Deep Analysis Panels */}
            {isPremium && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mb-20">
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-4 font-bold">Signal_Resonance</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{cardRelationships}</p>
                    </div>
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 font-bold">Elemental_Dignity</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{elementalDignity}</p>
                    </div>
                    <div className="glass-panel p-8 rounded-[2rem] border-white/5">
                        <h4 className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-4 font-bold">Numerology_Threads</h4>
                        <p className="text-sm text-white/70 leading-relaxed">{numerologyThreads}</p>
                    </div>
                </div>
            )}

            {/* Save Controls */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mb-20">
                <input value={readingTitle} onChange={e => setReadingTitle(e.target.value)} placeholder="LOG_SESSION_ID..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-10 py-6 focus:outline-none focus:border-purple-500 transition-colors text-white font-mono text-xl shadow-inner" />
                <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-14 py-6 rounded-2xl transition-all shadow-glow active:scale-95 text-xl uppercase font-mono tracking-widest">Commit_Archive</button>
            </div>

            {/* Export */}
            <button onClick={handleExport} className="mb-20 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest border-b border-white/10 hover:border-white transition-all pb-1">
                Export to Neural-Link
            </button>

            {/* Cards Grid with Deep Dives */}
            <div className="mt-20 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {drawnCards.map((c, i) => (
                    <div key={i} className="flex flex-col gap-6 group relative">
                        <p className="text-center text-xs font-mono text-white/40 uppercase tracking-widest">{SPREAD_DETAILS[selectedSpread!].positions[i]}</p>
                        <DivinationCardDisplay drawnCard={c} isRevealed={true} className="!w-full !h-auto aspect-[2/3] ring-1 ring-white/5 group-hover:ring-purple-500/40 transition-all shadow-xl mx-auto max-w-[300px]" />

                        <div className={`p-6 bg-white/5 rounded-2xl border border-white/5 transition-all ${isPremium ? 'cursor-pointer hover:bg-white/10' : ''}`} onClick={() => isPremium && setActiveDeepDiveIndex(activeDeepDiveIndex === i ? null : i)}>
                            <p className="text-sm text-white/80 leading-relaxed text-center">{c?.interpretation}</p>
                            {isPremium && (
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeDeepDiveIndex === i ? 'max-h-[500px] opacity-100 mt-6 pt-6 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3">Deep_Dive_Protocol</p>
                                    <p className="text-sm text-white/60 leading-relaxed italic">{perCardDeepDives[i] || "Data encrypted."}</p>
                                </div>
                            )}
                            {isPremium && activeDeepDiveIndex !== i && <p className="mt-4 text-[10px] text-center text-purple-500/50 uppercase tracking-widest group-hover:text-purple-400">Expand Analysis</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPicking = () => {
        // Fan-Out Logic for 78 Cards
        const cardWidth = 140; // px
        const deckSize = fullDeckInPlay.length;
        const totalAngle = 120; // degrees spread
        const startAngle = -60;
        const anglePerCard = totalAngle / deckSize;
        const radius = 800; // px, radius of the arc

        return (
            <div className="w-full h-full relative p-20 flex flex-col items-center animate-fade-in overflow-hidden">
                <header className="text-center mb-4 z-20 pointer-events-none">
                    <h2 className="text-4xl font-bold font-dm-sans text-white uppercase tracking-tighter">Manifest Array</h2>
                    <p className="text-text-muted font-mono text-xs mt-2 uppercase tracking-[0.4em] animate-pulse">
                        Select {SPREAD_DETAILS[selectedSpread!].cardCount - drawnCards.filter(Boolean).length} more vectors
                    </p>
                </header>

                {/* Drawn Cards Slots (Preview) */}
                <div className="flex gap-4 mb-20 z-20 pointer-events-none">
                    {drawnCards.map((c, i) => (
                        <div key={i} className={`w-12 h-20 rounded border ${c ? 'bg-purple-500 border-purple-400' : 'bg-white/5 border-white/10'} transition-all`}></div>
                    ))}
                </div>

                {/* Fan Container - Lifted up and contained */}
                <div className="absolute inset-x-0 bottom-[5vh] h-[500px] flex justify-center items-end perspective-1000 overflow-visible">
                    <div className="relative w-full h-full flex justify-center items-end">
                        {fullDeckInPlay.map((card, i) => {
                            const angle = startAngle + (i * anglePerCard);
                            // Dynamic spread based on screen width to keep edges in view
                            const spreadFactor = window.innerWidth < 768 ? 8 : 12;
                            const isHovered = hoveredCardIndex === i;

                            return (
                                <div
                                    key={card.card.id}
                                    className={`absolute bottom-0 w-[140px] h-[220px] rounded-xl bg-gradient-to-br from-[#1a1c25] to-[#0d0e14] border border-white/20 shadow-2xl transition-all duration-200 cursor-pointer origin-bottom transform-gpu
                                        ${isHovered ? 'z-50 scale-110 brightness-125 border-purple-500' : 'brightness-90'}
                                    `}
                                    style={{
                                        transform: `
                                            translateX(${(i - deckSize / 2) * spreadFactor}px) 
                                            rotate(${angle}deg) 
                                            translateY(${isHovered ? -120 : 0}px)
                                        `,
                                        zIndex: isHovered ? 100 : i,
                                        boxShadow: isHovered ? '0 0 40px rgba(168,85,247,0.6)' : '0 4px 10px rgba(0,0,0,0.5)'
                                    }}
                                    onMouseEnter={() => { setHoveredCardIndex(i); triggerHover(); }}
                                    onMouseLeave={() => setHoveredCardIndex(null)}
                                    onClick={() => handlePickCard(card)}
                                >
                                    <div className="w-full h-full rounded-xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Animating Card Overlay */}
                {animatingCardId && (
                    <div className="absolute left-1/2 bottom-[200px] w-48 h-80 rounded-xl bg-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.8)] z-[200] animate-ping-slow pointer-events-none"
                        style={{ transform: 'translate(-50%, 0)' }}
                    ></div>
                )}
            </div>
        );
    };

    const renderRevealing = () => {
        const totalCards = SPREAD_DETAILS[selectedSpread!].cardCount;
        const centerIndex = (totalCards - 1) / 2;

        return (
            <div className="w-full h-full relative overflow-hidden bg-[#030407] animate-fade-in flex flex-col items-center justify-center">
                <header className="absolute top-10 z-20 text-center w-full pointer-events-none">
                    <span className="px-6 py-2 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[10px] uppercase tracking-[0.5em] border border-purple-500/20 font-bold backdrop-blur-md">Ritual_Revealing</span>
                    <h2 className="text-5xl font-bold font-dm-sans text-white mt-4 tracking-tighter neon-glow">Spread Manifestation</h2>
                </header>

                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

                {/* LAYOUT CONTAINER */}
                <div className="relative w-full max-w-[95vw] h-[60vh] flex items-center justify-center mb-20">
                    {drawnCards.map((card, i) => {
                        const isRevealed = revealedIndices.has(i);
                        const layout = SPREAD_DETAILS[selectedSpread!].layout;
                        const pos = layout ? layout[i] : null;

                        // Default Fan Logic (Fallback)
                        const offsetFromCenter = i - centerIndex;
                        const spacing = 14;
                        const fanRotation = offsetFromCenter * 5;
                        const fanTranslateY = Math.abs(offsetFromCenter) * 15;
                        const fanXOffset = `${offsetFromCenter * spacing}vw`;

                        // Style Generation
                        const style: React.CSSProperties = pos ? {
                            position: 'absolute',
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                            zIndex: 10 + i,
                            width: '18vw',
                            maxWidth: '180px', // Smaller max width for complex spreads
                            transition: 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
                        } : {
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-9vw',
                            transform: `translateX(${fanXOffset}) rotate(${fanRotation}deg) translateY(${fanTranslateY}px)`,
                            zIndex: 10 + i,
                            transition: 'all 0.5s ease-out'
                        };

                        // Tilt Hook (Per card would be expensive if we called useTilt for every card in a loop without extraction)
                        // Optimization: Create a TiltWrapper component.
                        // For now, let's just wrap the DivinationCardDisplay in a TiltWrapper component defined below or inline it if simple.
                        // Actually, defining a component inside render is bad practice -> remounts.
                        // Let's create `components/TiltCardWrapper.tsx` real quick or use a helper file. 
                        // I'll make a specialized TiltCard component in a separate file.
                        // Wait, I can't restart this replacement block. 
                        // I will use a simple inline Wrapper component defined OUTSIDE ReadingsPage or just perform the logic inside a mapped sub-component.
                        // Refactoring `ReadingsPage` to use a sub-component for the card is better.

                        return (
                            <div
                                key={i}
                                className={`group origin-center ${pos ? '' : 'transition-all duration-500 ease-out hover:z-[100] hover:scale-110 hover:-translate-y-10'}`}
                                style={style}
                            >
                                <TiltCardWrapper isRevealed={isRevealed} label={SPREAD_DETAILS[selectedSpread!].positions[i]}>
                                    <DivinationCardDisplay
                                        drawnCard={card}
                                        isRevealed={isRevealed}
                                        onClick={() => handleReveal(i)}
                                        className={`!w-full !h-auto aspect-[2/3] shadow-2xl cursor-pointer ${isRevealed ? 'ring-1 ring-white/20' : 'brightness-75 hover:brightness-100'}`}
                                    />
                                </TiltCardWrapper>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute bottom-12 z-20 flex gap-4">
                    {revealedIndices.size < SPREAD_DETAILS[selectedSpread!].cardCount && (
                        <button onClick={() => {
                            const allIndices = new Set<number>();
                            for (let i = 0; i < SPREAD_DETAILS[selectedSpread!].cardCount; i++) allIndices.add(i);
                            setRevealedIndices(allIndices);
                        }} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-xl transition-all font-mono text-xs uppercase tracking-widest backdrop-blur-md">
                            Reveal_All_Signatures
                        </button>
                    )}

                    {revealedIndices.size === SPREAD_DETAILS[selectedSpread!].cardCount && (
                        <button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="px-16 py-6 bg-gradient-to-r from-purple-700 to-blue-700 hover:scale-105 transition-all text-white font-bold rounded-2xl shadow-glow active:scale-95 flex items-center gap-6 group">
                            <SparklesIcon className="w-8 h-8 group-hover:rotate-90 transition-transform duration-1000" />
                            <span className="text-2xl tracking-tighter uppercase font-mono">{isGeneratingSummary ? 'Processing_Batch...' : 'Unify_Array'}</span>
                        </button>
                    )}
                </div>
                {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 glass-panel border-red-500/50 text-red-400 rounded-3xl text-center max-w-sm animate-fade-in z-[100] backdrop-blur-xl">
                    <p className="font-mono text-sm mb-4 uppercase tracking-widest font-bold">Link Failure</p>
                    <p className="text-sm leading-relaxed">{error}</p>
                    <button onClick={() => setError('')} className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-all font-mono text-[10px] uppercase">Acknowledge</button>
                </div>}
            </div>
        );
    };

    const renderSelectDeck = () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-grid animate-fade-in p-10">
            <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow">Select Conduit</h2>
            <div className="flex gap-10 overflow-x-auto p-12 max-w-full no-scrollbar">
                {SHOP_DECKS.filter(d => activeProfile?.decks.includes(d.id)).map(deck => (
                    <div key={deck.id} onClick={() => handleSelectDeck(deck)} className="glass-panel min-w-[400px] p-12 rounded-[3.5rem] cursor-pointer hover:border-teal-500/50 transition-all group relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000"><LayersIcon className="w-32 h-32 text-white" /></div>
                        <h3 className="text-4xl font-bold text-white group-hover:text-teal-400 transition-colors mb-6">{deck.name}</h3>
                        <p className="text-text-muted text-lg leading-relaxed mb-10">{deck.description}</p>
                        <div className="px-10 py-5 rounded-2xl bg-teal-500/10 text-teal-400 text-xs font-mono font-bold uppercase text-center border border-teal-500/20 shadow-glow group-hover:bg-teal-500 group-hover:text-white transition-all">Synchronize_Signal</div>
                    </div>
                ))}
            </div>
            <button onClick={() => setReadingStep('select-spread')} className="mt-20 text-text-muted hover:text-white font-mono text-sm uppercase tracking-widest underline underline-offset-8 transition-opacity opacity-40 hover:opacity-100">Abort_Protocol</button>
        </div>
    );

    return (
        <div className="w-full h-full relative overflow-hidden">
            {!isPremium && !readingStep.startsWith('summary') && !readingStep.startsWith('revealing') && (
                <div className="absolute top-8 right-8 z-50">
                    <button onClick={() => setIsPremiumModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500 hover:text-white transition-all shadow-glow">
                        <ZapIcon className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest">Upgrade Protocol</span>
                    </button>
                </div>
            )}

            {readingStep === 'focus-intent' && renderFocusIntent()}
            {readingStep === 'select-spread' && renderSelectSpread()}
            {readingStep === 'select-deck' && renderSelectDeck()}
            {readingStep === 'charging' && renderCharging()}
            {readingStep === 'picking-cards' && renderPicking()}
            {readingStep === 'revealing' && renderRevealing()}
            {readingStep === 'summary' && renderSummary()}

            <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} onUpgrade={() => { setIsPremiumModalOpen(false); setPage('Profile'); }} />
        </div>
    );
};

// Sub-component for Tilt Logic
const TiltCardWrapper: React.FC<{ children: React.ReactNode; isRevealed: boolean; label: string }> = ({ children, isRevealed, label }) => {
    const { style, onMouseMove, onMouseLeave } = useTilt(10);
    return (
        <div
            className={`flex flex-col items-center gap-2 transition-transform duration-300 relative`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={style}
        >
            <p className="text-[9px] font-mono text-purple-400 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded backdrop-blur-md border border-purple-500/30 absolute -top-8 z-50 whitespace-nowrap">{label}</p>
            {children}
        </div>
    );
};

export default ReadingsPage;