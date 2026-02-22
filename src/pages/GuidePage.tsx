
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TAROT_DECK } from '../constants';
import { TarotCard } from '../types';
import PremiumModal from '../components/PremiumModal';
import { BookOpenIcon, SparklesIcon, CompassIcon } from '../components/icons';
import { generateContentWithRetry } from '../services/geminiService';
import { generateCosmicBlueprint } from '../services/cosmicService';
import DivinationCardDisplay from '../components/TarotCard';

/**
 * GuideCard — Individual card entry in the guide deck list.
 * ! Rethemed to match cyberpunk glass-panel design system.
 */
const GuideCard: React.FC<{ card: TarotCard; onSelect: () => void; isSelected: boolean; }> = ({ card, onSelect, isSelected }) => {
    return (
        <div onClick={onSelect} className={`p-5 bg-black/30 rounded-2xl border cursor-pointer hover:border-purple-400/40 transition-all duration-200 group ${isSelected ? 'border-purple-500/50 ring-2 ring-purple-500/30 bg-purple-500/5' : 'border-white/5'}`}>
            <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{card.name}</h3>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mt-1">{card.arcana}_Arcana</p>
        </div>
    );
};

/**
 * GuidePage — Premium AI-powered personalized tarot guide.
 * ! Rethemed to match cyberpunk glass-panel design system.
 */
const GuidePage: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => {
    const { isPremium, activeProfile } = useApp();
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [interpretation, setInterpretation] = useState('');

    if (!activeProfile) {
        return <div className="p-8 text-center text-text-muted animate-pulse font-mono">Initializing_Guide_Data...</div>;
    }

    const cosmicBlueprint = useMemo(() => generateCosmicBlueprint(activeProfile), [activeProfile]);

    const handleSelectCard = (card: TarotCard) => {
        if (!isPremium) {
            setIsPremiumModalOpen(true);
            return;
        }
        setSelectedCard(card);
        setInterpretation('');
        setError('');
    };

    const generateInterpretation = async () => {
        if (!selectedCard) return;

        setIsLoading(true);
        setError('');
        setInterpretation('');

        const blueprintSummary = `
          - Life Path Number: ${cosmicBlueprint.lifePath.number} (${cosmicBlueprint.lifePath.theme})
          - Destiny Number: ${cosmicBlueprint.destiny.number} (${cosmicBlueprint.destiny.theme})
          - Soul Urge: ${cosmicBlueprint.soulUrge.number} (${cosmicBlueprint.soulUrge.theme})
          - Preferred Reading Style: ${activeProfile.readingStyle}
          - Stated Life Focus: ${activeProfile.readingFocus}
        `;

        const prompt = `You are a master Tarot reader creating a personalized guide entry for a seeker. Your task is to interpret a single Tarot card through the unique lens of their Cosmic Blueprint and personal preferences.

        **Seeker's Profile:**
        ${blueprintSummary}

        **Card to Interpret:**
        - Card: ${selectedCard.name}
        - Arcana: ${selectedCard.arcana}
        - Keywords: ${selectedCard.keywords.join(', ')}
        - Core Upright Meaning: ${selectedCard.meaning}
        - Core Reversed Meaning: ${selectedCard.reversedMeaning}

        **Instructions:**
        Craft a deep and personalized interpretation of this card specifically for this person. The entire response must be written in a **${activeProfile.readingStyle}** tone and framed around their life focus of **'${activeProfile.readingFocus}'**.
        1.  **Introduction:** Start by introducing the universal energy of the ${selectedCard.name} card, immediately connecting it to their focus on **'${activeProfile.readingFocus}'**.
        2.  **Life Path Resonance:** Explain how the card's theme directly interacts with their life's journey, as defined by their **Life Path number (${cosmicBlueprint.lifePath.number})**. How does this card's lesson manifest in their core challenges and opportunities within their stated focus area?
        3.  **Destiny Number Application:** Describe how they can actively use the energy of this card to achieve their life's purpose, as outlined by their **Destiny number (${cosmicBlueprint.destiny.number})**.
        4.  **Soul Urge Connection:** Analyze how this card's message speaks to their deepest desires and motivations, linked to their **Soul Urge number (${cosmicBlueprint.soulUrge.number})**.
        5.  **Personalized Affirmation:** Conclude with a powerful, personalized affirmation that combines the card's wisdom with one of their key blueprint numbers, relevant to their focus.

        **Tone & Focus:** The writing must be consistently **${activeProfile.readingStyle}**. All examples and advice should be tailored to **'${activeProfile.readingFocus}'**. Address the user directly.`;

        try {
            const response = await generateContentWithRetry({
                model: 'arcee-ai/trinity-large-preview:free',
                contents: prompt,
            });
            setInterpretation(response.text || "Interpretation unavailable.");
        } catch (err) {
            console.error("Error generating interpretation:", err);
            setError("The cosmic energies are congested. Please try again in a moment.");
        } finally {
            setIsLoading(false);
        }
    }

    if (!isPremium) {
        return (
            <div className="w-full h-full p-6 md:p-14 flex flex-col items-center justify-center text-center bg-grid animate-fade-in">
                <div className="w-24 h-24 rounded-[2.5rem] bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 shadow-glow">
                    <CompassIcon className="w-12 h-12 text-purple-400" />
                </div>
                <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Personalized Guide</h1>
                <p className="text-lg text-white/40 mt-4 max-w-lg mx-auto leading-relaxed">Unlock a deeper understanding of the Tarot. The Guide provides AI-powered interpretations of each card, tailored specifically to your unique Cosmic Blueprint.</p>
                <button onClick={() => setPage('Profile')} className="mt-10 px-12 py-5 rounded-2xl font-bold font-mono text-sm uppercase tracking-widest bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all shadow-glow">
                    Upgrade_to_Premium
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col lg:flex-row gap-10 bg-grid animate-fade-in overflow-hidden">
            <div className="lg:w-1/3 flex-shrink-0 flex flex-col">
                <header className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] font-bold">Archive_Reference</span>
                    </div>
                    <h1 className="text-4xl font-bold font-dm-sans text-white tracking-tighter">Tarot Guide</h1>
                    <p className="text-sm text-white/40 mt-2">Select a node to explore its personalized resonance.</p>
                </header>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-2 no-scrollbar">
                    {TAROT_DECK.map(card => (
                        <GuideCard key={card.id} card={card} onSelect={() => handleSelectCard(card)} isSelected={selectedCard?.id === card.id} />
                    ))}
                </div>
            </div>

            <main className="flex-1 glass-panel rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col items-center justify-center p-10 text-center overflow-hidden">
                {!selectedCard ? (
                    <>
                        <CompassIcon className="w-24 h-24 text-purple-400/20" />
                        <p className="mt-6 text-white/30 text-lg">Select a card from the archive to begin.</p>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center overflow-y-auto no-scrollbar">
                        <DivinationCardDisplay drawnCard={{ card: selectedCard, isReversed: false }} isRevealed={true} className="!w-[200px] !h-[340px] flex-shrink-0 shadow-2xl" />
                        <div className="flex-grow w-full overflow-y-auto mt-8 text-left p-8 bg-black/30 rounded-2xl border border-white/5">
                            {!interpretation && !isLoading && !error && (
                                <div className="text-center flex flex-col items-center justify-center h-full gap-4">
                                    <h2 className="text-xl font-bold font-dm-sans text-white">Personalized Interpretation</h2>
                                    <p className="text-white/40 text-sm max-w-sm">Generate an AI-powered meaning for {selectedCard.name}, tailored to your Cosmic Blueprint.</p>
                                    <button onClick={generateInterpretation} className="mt-4 px-10 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-glow flex items-center gap-3">
                                        <SparklesIcon className="w-5 h-5" />
                                        Generate_Insight
                                    </button>
                                </div>
                            )}
                            {isLoading && <p className="text-white/40 animate-pulse text-center font-mono text-sm">Consulting_Digital_Ether...</p>}
                            {error && <p className="text-red-400 text-center">{error}</p>}
                            {interpretation && <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">{interpretation}</p>}
                        </div>
                    </div>
                )}
            </main>

            <PremiumModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
                onUpgrade={() => {
                    setIsPremiumModalOpen(false);
                    setPage('Profile');
                }}
            />
        </div>
    );
};

export default GuidePage;
