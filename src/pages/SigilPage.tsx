import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DrawnDivinationCard, SavedReading } from '../types';
import { drawTarotCard } from '../services/tarotService';
import { generateContentWithRetry } from '../services/geminiService';
import { Type } from '@google/genai';
import InitiationPhase from '../components/SigilFlow/InitiationPhase';
import RevealPhase from '../components/SigilFlow/RevealPhase';
import CoreReadingPhase from '../components/SigilFlow/CoreReadingPhase';
import DeepDivePhase from '../components/SigilFlow/DeepDivePhase';
import ActionableAltar from '../components/SigilFlow/ActionableAltar';
import { ChevronLeftIcon } from '../components/icons';

type Phase = 'initiation' | 'reveal' | 'core';

const SigilPage: React.FC = () => {
    const { activeProfile, addXp } = useApp();
    const [phase, setPhase] = useState<Phase>('initiation');
    const [focus, setFocus] = useState('');
    const [cards, setCards] = useState<DrawnDivinationCard[]>([]);
    const [readingData, setReadingData] = useState<SavedReading | null>(null);
    const [deepDiveIndex, setDeepDiveIndex] = useState<number | null>(null);

    const handleBack = () => {
        if (phase !== 'initiation') {
            if (window.confirm("Abort the ritual? Progress will be lost.")) {
                setPhase('initiation');
                setCards([]);
                setReadingData(null);
            }
        } else {
            window.location.hash = '#readings';
        }
    };

    const handleInitiationComplete = async (userFocus: string, refinedQuestion: string) => {
        setFocus(refinedQuestion || userFocus);

        // DRAW CARDS
        const drawnCards: DrawnDivinationCard[] = [
            { card: drawTarotCard().card, isReversed: Math.random() > 0.8 },
            { card: drawTarotCard().card, isReversed: Math.random() > 0.8 },
            { card: drawTarotCard().card, isReversed: Math.random() > 0.8 }
        ];
        setCards(drawnCards);
        setPhase('reveal');

        // GENERATE READING IN BACKGROUND
        generateReading(drawnCards, refinedQuestion || userFocus);
    };

    const generateReading = async (drawnCards: DrawnDivinationCard[], question: string) => {
        try {
            const prompt = `
            Perform a 3-card Past/Present/Future Sigil Reading for ${activeProfile?.givenName}.
            Focus: "${question}".
            Cards: 
            1. Past: ${drawnCards[0].card.name} (${drawnCards[0].isReversed ? 'Rev' : 'Up'})
            2. Present: ${drawnCards[1].card.name} (${drawnCards[1].isReversed ? 'Rev' : 'Up'})
            3. Future: ${drawnCards[2].card.name} (${drawnCards[2].isReversed ? 'Rev' : 'Up'})

            Return JSON with:
            - aiSummary (approx 100 words, mystical cyberpunk tone)
            - practicalActions (3 actionable bullet points)
            - shadowMessage (warning or hidden influence to watch for)
            - reflectionQuestion (deep prompt)
            - keywordAnalyses (Array of 3 strings: For each card, a concise keyword-level breakdown highlighting the core themes, associations, and energies. 2-3 sentences.)
            - symbolicInterpretations (Array of 3 strings: For each card, a rich symbolic reading connecting the card's imagery and archetype to the querent's focus question. 3-4 sentences.)
            - esotericInterpretations (Array of 3 strings: Deep kabbalistic/astrological/hermetic analysis for Past, Present, Future cards respectively. 4-5 sentences.)
            `;

            const schema = {
                type: Type.OBJECT,
                properties: {
                    aiSummary: { type: Type.STRING },
                    practicalActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    shadowMessage: { type: Type.STRING },
                    reflectionQuestion: { type: Type.STRING },
                    keywordAnalyses: { type: Type.ARRAY, items: { type: Type.STRING } },
                    symbolicInterpretations: { type: Type.ARRAY, items: { type: Type.STRING } },
                    esotericInterpretations: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            };

            const result = await generateContentWithRetry({
                model: 'gemini-2.0-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                config: { responseMimeType: 'application/json', responseSchema: schema }
            });

            const data = JSON.parse(result.text || '{}');

            // Map all depth-level interpretations to cards
            const cardsWithIntepretation = drawnCards.map((c, i) => ({
                ...c,
                keywordAnalysis: data.keywordAnalyses?.[i] || null,
                symbolicInterpretation: data.symbolicInterpretations?.[i] || null,
                esotericInterpretation: data.esotericInterpretations?.[i] || "Data encrypted."
            }));

            const newReading: SavedReading = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                spreadType: '3-card', // Using existing type for now
                deckType: 'tarot',
                deckId: 'default',
                positions: ['Past', 'Present', 'Future'],
                cards: cardsWithIntepretation,
                title: question,
                aiSummary: data.aiSummary,
                userNotes: '',
                practicalActions: data.practicalActions,
                shadowMessage: data.shadowMessage,
                reflectionQuestion: data.reflectionQuestion
            };
            setReadingData(newReading);
            addXp(50);

        } catch (e) {
            console.error("Sigil generation failed", e);
            // Fallback for demo
            setReadingData({
                id: Date.now().toString(),
                date: new Date().toISOString(),
                spreadType: '3-card',
                deckType: 'tarot',
                deckId: 'default',
                positions: ['Past', 'Present', 'Future'],
                cards: drawnCards,
                title: question,
                aiSummary: "The signals are chaotic, yet a pattern emerges. Trust the void.",
                userNotes: '',
                practicalActions: ["Meditate on the disruption.", "Seek clarity in silence.", "Reboot your routine."],
                shadowMessage: "Beware of static interference in your emotional spectrum.",
                reflectionQuestion: "What frequency are you broadcasting?"
            });
        }
    };

    return (
        <div className="w-full h-full bg-black relative overflow-hidden flex flex-col">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a103c_0%,_#000000_70%)] opacity-50 pointer-events-none"></div>

            {/* Header */}
            <header className="absolute top-0 left-0 w-full p-6 z-50 flex items-center justify-between">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6 text-white/50 hover:text-white" />
                </button>
                <div className="text-[10px] font-mono text-purple-500 uppercase tracking-widest animate-pulse">
                    SIGIL_PROTOCOL_V2.0 // PHASE: {phase.toUpperCase()}
                </div>
                <div className="w-6"></div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow relative z-10 w-full overflow-y-auto">
                {phase === 'initiation' && (
                    <InitiationPhase onComplete={handleInitiationComplete} />
                )}

                {phase === 'reveal' && (
                    <RevealPhase cards={cards} onComplete={() => setPhase('core')} />
                )}

                {phase === 'core' && readingData && (
                    <div className="pt-20 pb-20 fade-in">
                        <div className="text-center mb-10 px-4">
                            <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2 font-bold">Focus_Lock</p>
                            <h2 className="text-2xl md:text-4xl text-white font-dm-sans neon-glow max-w-2xl mx-auto">"{focus}"</h2>
                        </div>

                        <CoreReadingPhase reading={readingData} onCardClick={setDeepDiveIndex} />

                        <ActionableAltar reading={readingData} />
                    </div>
                )}

                {/* Loader State for Reading Data */}
                {phase === 'core' && !readingData && (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest animate-pulse">Synthesizing_Pattern...</p>
                    </div>
                )}
            </main>

            {/* Deep Dive Modal */}
            {deepDiveIndex !== null && readingData && (
                <DeepDivePhase
                    card={readingData.cards[deepDiveIndex]}
                    positionLabel={readingData.positions[deepDiveIndex]}
                    onClose={() => setDeepDiveIndex(null)}
                />
            )}
        </div>
    );
};

export default SigilPage;
