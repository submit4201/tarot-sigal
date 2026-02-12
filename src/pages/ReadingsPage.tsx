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
import { SpreadCanvas } from '../components/3d/SpreadCanvas';
import { CyberDeck } from '../components/3d/CyberDeck';
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
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative overflow-hidden">
            <h2 className="text-6xl font-bold text-white mb-8 uppercase tracking-tighter neon-glow animate-pulse">
                {hasShuffledEnough ? 'Deck Charged' : 'Shuffle Deck'}
            </h2>
            <div className="relative w-full h-full flex items-center justify-center">
                <CyberDeck
                    deckCount={selectedDeck?.cards.length || 78}
                    onShuffle={handleChargingMove}
                    onDraw={completeCharging}
                    isFanned={hasShuffledEnough}
                />
                <p className="absolute bottom-20 text-white/40 font-mono text-xs uppercase tracking-[0.2em]">
                    {hasShuffledEnough ? 'Throw to Deal' : 'Drag to Shuffle'}
                </p>
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

    const renderPicking = () => {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in relative">
                <h2 className="text-4xl font-bold text-white mb-8">Deal Cards</h2>
                <div className="relative">
                    <CyberDeck
                        deckCount={Math.max(1, SPREAD_DETAILS[selectedSpread!].cardCount - currentPickingIndex)}
                        onShuffle={() => { }} // No shuffle in picking
                        onDraw={() => {
                            if (fullDeckInPlay.length > 0) {
                                handlePickCard(fullDeckInPlay[0]);
                            }
                        }}
                    />
                </div>
                <div className="mt-8 flex gap-2">
                    {drawnCards.map((c, i) => (
                        <div key={i} className={`w-8 h-12 rounded border ${c ? 'bg-purple-500' : 'bg-white/10'}`}></div>
                    ))}
                </div>
            </div>
        );
    };

    const renderRevealing = () => {
        if (!selectedSpread) return null;
        return (
            <div className="w-full h-full relative bg-[#030407] animate-fade-in">
                <div className="absolute inset-x-0 top-0 h-16 z-20 bg-gradient-to-b from-black to-transparent pointer-events-none" />
                <SpreadCanvas
                    spreadType={selectedSpread}
                    cards={drawnCards}
                    revealedIndices={revealedIndices}
                    onCardClick={handleReveal}
                />

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {revealedIndices.size < SPREAD_DETAILS[selectedSpread].cardCount ? (
                        <button onClick={() => {
                            const all = new Set<number>();
                            for (let i = 0; i < SPREAD_DETAILS[selectedSpread].cardCount; i++) all.add(i);
                            setRevealedIndices(all);
                        }} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition-all font-mono uppercase tracking-widest border border-white/10">Reveal All</button>
                    ) : (
                        <button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition-all text-white font-bold rounded-xl shadow-glow active:scale-95 flex items-center gap-2">
                            <SparklesIcon className={`w-5 h-5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                            <span className="font-mono uppercase tracking-widest">{isGeneratingSummary ? 'Synthesizing...' : 'Complete Reading'}</span>
                        </button>
                    )}
                </div>
                {error && <div className="absolute top-20 left-1/2 -translate-x-1/2 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50 backdrop-blur-md">{error}</div>}
            </div>
        );
    };

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

            <div className="max-w-6xl w-full glass-panel p-16 rounded-[3rem] border-white/10 bg-[#0a0b12]/95 relative overflow-hidden shadow-2xl mb-20">
                <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none"><SparklesIcon className="w-96 h-96" /></div>
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.4em] mb-8 font-bold">Master_Synthesis_Narrative</h3>
                <p className="text-2xl leading-relaxed text-text-primary whitespace-pre-wrap font-dm-sans">{aiSummary}</p>
            </div>

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

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl mb-20">
                <input value={readingTitle} onChange={e => setReadingTitle(e.target.value)} placeholder="LOG_SESSION_ID..." className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-10 py-6 focus:outline-none focus:border-purple-500 transition-colors text-white font-mono text-xl shadow-inner" />
                <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-14 py-6 rounded-2xl transition-all shadow-glow active:scale-95 text-xl uppercase font-mono tracking-widest">Commit_Archive</button>
            </div>

            <button onClick={handleExport} className="mb-20 text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest border-b border-white/10 hover:border-white transition-all pb-1">
                Export to Neural-Link
            </button>

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

    const renderSelectDeck = () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-grid animate-fade-in p-10">
            <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow">Select Conduit</h2>
            <div className="flex gap-10 overflow-x-auto p-12 max-w-full no-scrollbar">
                {SHOP_DECKS.filter(d => activeProfile?.ownedDeckIds.includes(d.id)).map(deck => (
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