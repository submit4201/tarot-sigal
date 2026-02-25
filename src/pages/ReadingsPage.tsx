import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SpreadType, DrawnDivinationCard, Page, Deck, AnyCard } from '../types';
import { SPREAD_DETAILS, SHOP_DECKS, TAROT_DECK } from '../constants';
import { getShuffledPreparedDeck } from '../services/tarotService';
import PremiumModal from '../components/PremiumModal';
import { generateContentWithRetry } from '../services/geminiService';
import { SparklesIcon, LayersIcon, ZapIcon } from '../components/icons';
import { generateCosmicBlueprint } from '../services/cosmicService';
import { TAROT_QUESTION_REFINER_PROMPT, TAROT_INTERPRETATION_PROMPT } from '../constants/prompts';
import { useHaptic } from '../hooks/useHaptic';
import { useTilt } from '../hooks/useTilt';
import { formatReadingForExport } from '../utils/exportUtils';
import { db } from '../services/apiService';

// * Extracted Components
import { IntentFocusView } from '../components/readings/IntentFocusView';
import { SpreadSelectionView } from '../components/readings/SpreadSelectionView';
import { DeckSelectionView } from '../components/readings/DeckSelectionView';
import { ChargingView } from '../components/readings/ChargingView';
import { PickingView } from '../components/readings/PickingView';
import { RevealingView } from '../components/readings/RevealingView';
import { IntegratedForecastView } from '../components/readings/IntegratedForecastView';
// * TTS Helper function
const speakText = (text: string) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for mystical feel
    utterance.pitch = 0.9; // Slightly deeper
    window.speechSynthesis.speak(utterance);
};

const ReadingsPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { isPremium, addSavedReading, activeProfile, addXp, addStardust, decks } = useApp();

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
    const [recentJournalContext, setRecentJournalContext] = useState<string>('');

    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);

    // * Initialize reading step based on Premium status
    useEffect(() => {
        // If user is premium, start with Intent. If not, start with Spread selection.
        if (isPremium && readingStep === 'select-spread' && !selectedSpread) {
            // We allow them to go back to select-spread, so only force this on init if desired.
            // For now, let's add a "Start New Reading" flow button that decides this.
        }

        // Fetch journal context for personalized readings
        const fetchContext = async () => {
            try {
                const entries = await db.getJournalEntries();
                if (entries && entries.length > 0) {
                    // Take last 3 entries for context
                    const context = entries.slice(-3).map((e: any) => e.content).join(' | ');
                    setRecentJournalContext(context);
                }
            } catch (e) {
                console.error("Failed to fetch journal context:", e);
            }
        };
        fetchContext();
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
                    // Stabilization complete. User can now click to draw.
                }
            }
        }, 50);

        return () => clearInterval(interval);
    }, [readingStep, hasShuffledEnough]);

    const handleChargingMove = () => {
        lastMoveTimeRef.current = Date.now();
        setIsShuffling(true);
        setShuffleEnergy(prev => {
            const next = Math.min(100, prev + 25);
            if (next >= 100 && !hasShuffledEnough) {
                setHasShuffledEnough(true);
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
            }
            return next;
        });

        // Haptic feedback
        triggerHover();
        setTimeout(() => setIsShuffling(false), 150);
    };

    const completeCharging = () => {
        // Use the master TAROT_DECK for logic, while selectedDeck provides the visual theme
        const deckToUse = TAROT_DECK;
        const shuffled = getShuffledPreparedDeck(deckToUse || [], Date.now());
        setFullDeckInPlay(shuffled);
        setDrawnCards(new Array(SPREAD_DETAILS[selectedSpread!].cardCount).fill(null));
        setCurrentPickingIndex(0);

        // Final transition to picking is handled by the caller or effect
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
            const prompt = TAROT_QUESTION_REFINER_PROMPT(userQuestion, readingIntent);

            const response = await generateContentWithRetry({ model: 'arcee-ai/trinity-large-preview:free', contents: prompt });
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
        try {
            // BATCH PROMPT
            const nodesInfo = drawnCards.map((c, i) => {
                const pos = SPREAD_DETAILS[selectedSpread!].positions[i] || `Node ${i + 1}`;
                return `Node: ${pos}. Card: ${c?.card.name} (${c?.isReversed ? 'Reversed' : 'Upright'}). Meaning: ${c?.card.meaning}.`;
            }).join('\n');

            const userContext = isPremium ? `Raw User Question: ${userQuestion}. Intent: ${readingIntent}.` : '';
            const journalContext = isPremium && recentJournalContext ? `Recent Life Events/Journal Context: ${recentJournalContext}` : '';

            const spreadName = SPREAD_DETAILS[selectedSpread!].name;
            const cosmicInfo = cosmicBlueprint ? `Life Path ${cosmicBlueprint.lifePath.number} (${cosmicBlueprint.lifePath.theme})` : 'Unknown';
            const userContextStr = isPremium ? `Raw User Question: ${userQuestion}. Intent: ${readingIntent}.` : '';
            const journalContextStr = isPremium && recentJournalContext ? `Recent Life Events/Journal Context: ${recentJournalContext}` : '';

            const basePrompt = TAROT_INTERPRETATION_PROMPT(spreadName, cosmicInfo, userContextStr, journalContextStr, nodesInfo, isPremium);

            const response = await generateContentWithRetry({
                model: 'z-ai/glm-4.5-air:free',
                contents: basePrompt
            });

            const data = (() => {
                try {
                    let text = response.text || '{}';
                    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    return JSON.parse(text);
                } catch (e) {
                    console.error("Failed to parse AI response:", e);
                    return {};
                }
            })();

            setDrawnCards(prev => prev.map((c, i) => ({
                ...c!,
                interpretation: data.nodeInterpretations?.[i] || "Data unavailable."
            })));
            setAiSummary(data.summary || "Synthesis incomplete.");
            setPracticalActions(data.practicalActions || []);
            setShadowMessage(data.shadowMessage || "");
            if (data.refinedQuestion) setRefinedQuestion(data.refinedQuestion);

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

    const handleRevealAll = () => {
        if (!selectedSpread) return;
        const all = new Set<number>();
        for (let i = 0; i < SPREAD_DETAILS[selectedSpread].cardCount; i++) all.add(i);
        setRevealedIndices(all);
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            {!isPremium && !['summary', 'revealing'].includes(readingStep) && (
                <div className="absolute top-8 right-8 z-50">
                    <button onClick={() => setIsPremiumModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 hover:bg-amber-500 hover:text-white transition-all shadow-glow">
                        <ZapIcon className="w-4 h-4" />
                        <span className="font-mono text-xs font-bold uppercase tracking-widest">Upgrade Protocol</span>
                    </button>
                </div>
            )}

            {readingStep === 'focus-intent' && (
                <IntentFocusView
                    readingIntent={readingIntent}
                    setReadingIntent={setReadingIntent}
                    userQuestion={userQuestion}
                    setUserQuestion={setUserQuestion}
                    refinedQuestion={refinedQuestion}
                    isRefiningQuestion={isRefiningQuestion}
                    handleRefineQuestion={handleRefineQuestion} // Keeping for manual refinement if desired, but generation now handles it
                    onComplete={() => setReadingStep('select-spread')}
                />
            )}

            {readingStep === 'select-spread' && (
                <SpreadSelectionView
                    isPremium={isPremium}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectSpread={handleSelectSpread}
                    onBack={isPremium ? () => setReadingStep('focus-intent') : undefined}
                    setIsPremiumModalOpen={setIsPremiumModalOpen}
                />
            )}

            {readingStep === 'select-deck' && (
                <DeckSelectionView
                    activeProfile={activeProfile}
                    onSelectDeck={handleSelectDeck}
                    onAbort={() => setReadingStep('select-spread')}
                />
            )}

            {readingStep === 'charging' && (
                <ChargingView
                    hasShuffledEnough={hasShuffledEnough}
                    shuffleEnergy={shuffleEnergy}
                    isShuffling={isShuffling}
                    onShuffle={handleChargingMove}
                    onMove={() => {
                        if (hasShuffledEnough) {
                            completeCharging();
                            setTimeout(() => setReadingStep('picking-cards'), 300);
                        }
                    }}
                    selectedDeckId={selectedDeck?.id}
                />
            )}

            {readingStep === 'picking-cards' && (
                <PickingView
                    selectedSpread={selectedSpread}
                    currentPickingIndex={currentPickingIndex}
                    fullDeckInPlay={fullDeckInPlay}
                    drawnCards={drawnCards}
                    onPickCard={handlePickCard}
                    onHover={triggerHover}
                    selectedDeckId={selectedDeck?.id}
                />
            )}

            {readingStep === 'revealing' && selectedSpread && (
                <RevealingView
                    selectedSpread={selectedSpread}
                    drawnCards={drawnCards}
                    revealedIndices={revealedIndices}
                    onReveal={handleReveal}
                    onRevealAll={handleRevealAll}
                    onGenerateSummary={handleGenerateSummary}
                    isGeneratingSummary={isGeneratingSummary}
                    selectedDeckId={selectedDeck?.id}
                    error={error}
                />
            )}

            {readingStep === 'summary' && selectedSpread && (
                <IntegratedForecastView
                    isPremium={isPremium}
                    spokenNarrative={spokenNarrative}
                    activeProfile={activeProfile}
                    practicalActions={practicalActions}
                    shadowMessage={shadowMessage}
                    aiSummary={aiSummary}
                    cardRelationships={cardRelationships}
                    elementalDignity={elementalDignity}
                    numerologyThreads={numerologyThreads}
                    readingTitle={readingTitle}
                    setReadingTitle={setReadingTitle}
                    handleSave={handleSave}
                    handleExport={handleExport}
                    drawnCards={drawnCards}
                    selectedSpread={selectedSpread}
                    activeDeepDiveIndex={activeDeepDiveIndex}
                    setActiveDeepDiveIndex={setActiveDeepDiveIndex}
                    perCardDeepDives={perCardDeepDives}
                    onSpeak={speakText}
                />
            )}

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