
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpreadType, DrawnDivinationCard, Page, Deck, AnyCard } from '../types';
import { SPREAD_DETAILS, SHOP_DECKS } from '../constants';
import { getShuffledPreparedDeck } from '../services/tarotService';
import DivinationCardDisplay from '../components/TarotCard';
import PremiumModal from '../components/PremiumModal';
import { Type } from '@google/genai';
import { generateContentWithRetry } from '../services/geminiService'; // Import retry service
import { SparklesIcon, LayersIcon, ZapIcon } from '../components/icons';
import { generateCosmicBlueprint } from '../services/cosmicService';

const getLayoutStyles = (spreadType: SpreadType, index: number, count: number): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', transform: 'translate(-50%, -50%)', transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' };
    
    switch (spreadType) {
        case 'celtic-cross':
            const cc = [
                { top: '50%', left: '35%', zIndex: 5 }, // 1. Heart
                { top: '50%', left: '35%', transform: 'translate(-50%, -50%) rotate(90deg)', zIndex: 10 }, // 2. Challenge
                { top: '82%', left: '35%' }, // 3. Root
                { top: '50%', left: '15%' }, // 4. Past
                { top: '18%', left: '35%' }, // 5. Crown
                { top: '50%', left: '55%' }, // 6. Future
                { top: '85%', left: '85%' }, // 7. Attitude
                { top: '65%', left: '85%' }, // 8. External
                { top: '45%', left: '85%' }, // 9. Hopes/Fears
                { top: '25%', left: '85%' }, // 10. Outcome
                { top: '10%', left: '60%', transform: 'translate(-50%, -50%) scale(1.1)' }, // 11. Synthesis
            ];
            return { ...base, ...(cc[index] || {}) };
        case 'pentagram':
            const pAngle = (index * 72 - 90) * (Math.PI / 180);
            return { ...base, left: `${50 + Math.cos(pAngle) * 35}%`, top: `${50 + Math.sin(pAngle) * 35}%` };
        case 'partnership':
            const part = [
                { top: '30%', left: '25%' }, { top: '50%', left: '25%' }, { top: '70%', left: '25%' }, // Operator A
                { top: '30%', left: '75%' }, { top: '50%', left: '75%' }, { top: '70%', left: '75%' }, // Operator B
                { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.1)' } // Nexus
            ];
            return { ...base, ...(part[index] || {}) };
        case 'shadow-work':
            const sw = [
                { top: '35%', left: '40%' }, { top: '35%', left: '60%' }, 
                { top: '65%', left: '40%' }, { top: '65%', left: '60%' }
            ];
            return { ...base, ...(sw[index] || {}) };
        case '3-card':
        case 'mind-body-spirit':
            return { ...base, left: `${(index + 1) * 25}%`, top: '50%' };
        default:
            const cols = Math.ceil(Math.sqrt(count));
            const row = Math.floor(index / cols);
            const col = index % cols;
            return {
                ...base,
                left: `${(col + 1) * (100 / (cols + 1))}%`,
                top: `${(row + 1) * (100 / (Math.ceil(count / cols) + 1))}%`
            };
    }
};

const ReadingsPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    const { isPremium, addSavedReading, activeProfile, addXp, addStardust } = useApp();
    const [readingStep, setReadingStep] = useState<'select-spread' | 'select-deck' | 'picking-cards' | 'revealing' | 'summary'>('select-spread');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [fullDeckInPlay, setFullDeckInPlay] = useState<DrawnDivinationCard[]>([]);
    const [drawnCards, setDrawnCards] = useState<(DrawnDivinationCard | null)[]>([]);
    const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
    const [currentPickingIndex, setCurrentPickingIndex] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [readingTitle, setReadingTitle] = useState('');
    const [error, setError] = useState('');
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);
    
    const filteredSpreads = useMemo(() => {
        return Object.entries(SPREAD_DETAILS).filter(([_, spread]) => {
            return spread.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   spread.description.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [searchQuery]);

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
        setIsShuffling(true);
        setTimeout(() => {
            const shuffled = getShuffledPreparedDeck(deck.cards, Date.now());
            setFullDeckInPlay(shuffled);
            setDrawnCards(new Array(SPREAD_DETAILS[selectedSpread!].cardCount).fill(null));
            setReadingStep('picking-cards');
            setCurrentPickingIndex(0);
            setIsShuffling(false);
        }, 800);
    };
    
    const handleQuickDraw = () => {
        // Bypasses deck selection for a fast 3-card reading
        setSelectedSpread('3-card');
        const defaultDeck = SHOP_DECKS.find(d => d.id === 'default_tarot');
        if (!defaultDeck) {
            setError("Default deck not found!");
            return;
        }
        // Re-use handleSelectDeck logic to start the reading
        handleSelectDeck(defaultDeck);
    };

    const handlePickCard = (card: DrawnDivinationCard) => {
        if (!selectedSpread || currentPickingIndex >= SPREAD_DETAILS[selectedSpread].cardCount || animatingCardId) return;
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
            addXp(2);
        }, 1000); // Match new 1s animation duration
    };

    const handleReveal = (index: number) => {
        if (revealedIndices.has(index)) return;
        setRevealedIndices(prev => new Set(prev).add(index));
    };

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setError('');
        
        // BATCH PROMPT
        const nodesInfo = drawnCards.map((c, i) => {
            const pos = SPREAD_DETAILS[selectedSpread!].positions[i] || `Node ${i+1}`;
            return `Node: ${pos}. Card: ${c?.card.name} (${c?.isReversed ? 'Reversed' : 'Upright'}).`;
        }).join('\n');

        const prompt = `Perform a high-fidelity diagnostic synthesis. 
        Array Pattern: ${selectedSpread}.
        User Profile: Life Path ${cosmicBlueprint?.lifePath.number}. Focus: ${activeProfile?.readingFocus}.
        Data Streams:
        ${nodesInfo}
        
        Task: 
        1. For each node, provide a 1-sentence interpretation.
        2. Provide a master tactical directive (The Summary).
        3. Keep the tone Cyberpunk-Gothic and technical.
        Return as JSON.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                nodeInterpretations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of 1-sentence interpretations corresponding to the node order."
                },
                summary: { type: Type.STRING, description: "The master synthesis narrative." }
            },
            required: ["nodeInterpretations", "summary"]
        };

        try {
            const response = await generateContentWithRetry({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: schema }
            });
            
            const data = JSON.parse(response.text || '{}');
            setDrawnCards(prev => prev.map((c, i) => ({ ...c!, interpretation: data.nodeInterpretations?.[i] || "Data unavailable." })));
            setAiSummary(data.summary || "Synthesis incomplete.");
            setReadingStep('summary');
            addStardust(25);
            addXp(50);
        } catch (e: any) { 
            console.error(e);
            setError("Ether congestion detected. Please try again."); 
        } finally { 
            setIsGeneratingSummary(false); 
        }
    };

    const handleSave = () => {
        if (!selectedSpread || !selectedDeck) return;
        addSavedReading({
            spreadType: selectedSpread,
            deckType: selectedDeck.type,
            deckId: selectedDeck.id,
            positions: SPREAD_DETAILS[selectedSpread].positions,
            cards: drawnCards as DrawnDivinationCard[],
            title: readingTitle || `LOG_SESSION_${Date.now()}`,
            aiSummary,
            userNotes: ''
        });
        setReadingStep('select-spread');
        setSelectedSpread(null);
        setRevealedIndices(new Set());
    };

    const renderSelectSpread = () => (
        <div className="w-full h-full p-8 overflow-y-auto bg-grid animate-fade-in">
            <header className="mb-12 max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-6xl font-bold font-dm-sans text-white mb-2 tracking-tighter neon-glow">Geometric Array</h1>
                    <p className="text-text-muted text-xl">Select a diagnostic protocol for your temporal signals.</p>
                </div>
                <input type="text" placeholder="FILTER_PATTERNS..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-purple-500 font-mono text-sm w-full md:w-80" />
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                <div 
                    onClick={handleQuickDraw} 
                    className="glass-panel group p-10 rounded-[2.5rem] cursor-pointer border-purple-500/50 bg-gradient-to-br from-purple-600/20 to-blue-600/10 hover:bg-white/5 transition-all relative overflow-hidden flex flex-col min-h-[250px] ring-2 ring-purple-500/30 hover:ring-purple-500"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
                        <ZapIcon className="w-24 h-24 text-purple-300"/>
                    </div>
                    <h3 className="text-2xl font-bold font-dm-sans text-white group-hover:text-purple-300 mb-2">Quick Draw</h3>
                    <p className="text-text-muted text-sm flex-grow leading-relaxed">A fast 3-card reading with the default Gridpunk Tarot deck.</p>
                    <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-purple-300 uppercase font-bold flex justify-between">
                        <span>3 Nodes</span>
                        <span className="text-teal-400">INSTANT</span>
                    </div>
                </div>
                {filteredSpreads.map(([key, spread]) => (
                    <div key={key} onClick={() => handleSelectSpread(key as SpreadType)} className="glass-panel group p-10 rounded-[2.5rem] cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all relative overflow-hidden flex flex-col min-h-[250px]">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><LayersIcon className="w-24 h-24 text-white"/></div>
                        <h3 className="text-2xl font-bold font-dm-sans text-white group-hover:text-purple-400 mb-2">{spread.name}</h3>
                        <p className="text-text-muted text-sm flex-grow leading-relaxed">{spread.description}</p>
                        <div className="mt-8 pt-4 border-t border-white/5 text-[10px] font-mono text-purple-400 uppercase font-bold flex justify-between">
                            <span>{spread.cardCount} Data Nodes</span>
                            {spread.isPremium && <span className="text-amber-500 tracking-widest">PREMIUM</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPicking = () => (
        <div className="w-full h-full flex flex-col overflow-hidden relative bg-[#030407]">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
            <div className="p-14 flex-shrink-0 z-20 text-center animate-fade-in">
                <p className="text-[10px] font-mono text-purple-400 tracking-[0.5em] uppercase mb-4 font-bold">Protocol: {selectedSpread?.replace(/-/g, '_')}</p>
                <h2 className="text-6xl font-bold font-dm-sans text-white mb-2 tracking-tight">Channeling <span className="text-purple-400 italic neon-glow">{SPREAD_DETAILS[selectedSpread!]?.positions[currentPickingIndex]}</span></h2>
                <div className="mt-4 flex justify-center gap-1">
                    {Array.from({ length: SPREAD_DETAILS[selectedSpread!]?.cardCount }).map((_, i) => (
                        <div key={i} className={`h-1 w-8 rounded-full transition-all ${i === currentPickingIndex ? 'bg-purple-500 shadow-glow w-12' : i < currentPickingIndex ? 'bg-teal-500' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
            <div className="flex-grow relative flex items-center justify-center">
                <div className="absolute w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full animate-pulse"></div>
                {fullDeckInPlay.slice(0, 40).map((card, i) => {
                    const count = Math.min(fullDeckInPlay.length, 40);
                    const normalized = (i / (count - 1)) - 0.5;
                    const isAnimating = animatingCardId === card.card.id;
                    return (
                        <div 
                            key={card.card.id} 
                            onClick={() => handlePickCard(card)} 
                            className={`picking-card-wrapper ${isAnimating ? 'selected' : ''}`} 
                            style={{ 
                                '--fan-translate': `translate(${normalized * 1200}px, ${Math.pow(normalized * 2, 2) * 200}px)`, 
                                '--fan-rotation': `${normalized * 85}deg`, 
                                zIndex: i 
                            } as any}
                        >
                            <div className="w-full h-full glass-panel rounded-2xl border-white/10 flex items-center justify-center overflow-hidden hover:border-purple-500 transition-all duration-300 shadow-2xl">
                                <div className="absolute inset-0 bg-grid opacity-20"></div>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shadow-inner"><div className="w-2 h-2 bg-purple-500/40 rounded-full animate-pulse"></div></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderRevealing = () => (
        <div className="w-full h-full relative overflow-hidden bg-[#030407] animate-fade-in">
            <header className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
                <span className="px-6 py-2 rounded-full bg-purple-500/10 text-purple-400 font-mono text-[10px] uppercase tracking-[0.5em] border border-purple-500/20 font-bold">Ritual_Revealing</span>
                <h2 className="text-5xl font-bold font-dm-sans text-white mt-4 tracking-tighter">Spread Manifestation</h2>
            </header>
            
            <div className="w-full h-full relative p-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
                {drawnCards.map((card, i) => {
                    const style = getLayoutStyles(selectedSpread!, i, SPREAD_DETAILS[selectedSpread!].cardCount);
                    const isRevealed = revealedIndices.has(i);
                    return (
                        <div key={i} style={style} className="z-10 group">
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-center pointer-events-none w-max group-hover:scale-110 transition-transform">
                                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100">{SPREAD_DETAILS[selectedSpread!].positions[i]}</p>
                            </div>
                            <DivinationCardDisplay 
                                drawnCard={card} 
                                isRevealed={isRevealed} 
                                onClick={() => handleReveal(i)} 
                                className={`!w-[135px] !h-[215px] shadow-2xl transition-all duration-700 ${isRevealed ? 'scale-100 ring-4 ring-purple-500/10' : 'scale-90 opacity-40 hover:opacity-100 hover:scale-95'}`}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
                {revealedIndices.size === SPREAD_DETAILS[selectedSpread!]?.cardCount ? (
                    <button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="px-16 py-6 bg-gradient-to-r from-purple-700 to-blue-700 hover:scale-105 transition-all text-white font-bold rounded-3xl shadow-glow active:scale-95 flex items-center gap-6 group">
                        <SparklesIcon className="w-8 h-8 group-hover:rotate-90 transition-transform duration-1000" />
                        <span className="text-2xl tracking-tighter uppercase font-mono">{isGeneratingSummary ? 'Processing_Batch...' : 'Unify_Array'}</span>
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-purple-500 transition-all duration-700 shadow-glow" style={{ width: `${(revealedIndices.size / SPREAD_DETAILS[selectedSpread!].cardCount) * 100}%` }}></div>
                        </div>
                        <p className="text-text-muted font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Touch nodes to reveal signal ({revealedIndices.size}/{SPREAD_DETAILS[selectedSpread!].cardCount})</p>
                    </div>
                )}
            </div>
            {error && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 glass-panel border-red-500/50 text-red-400 rounded-3xl text-center max-w-sm animate-fade-in z-[100] backdrop-blur-xl">
                <p className="font-mono text-sm mb-4 uppercase tracking-widest font-bold">Link Failure</p>
                <p className="text-sm leading-relaxed">{error}</p>
                <button onClick={() => setError('')} className="mt-6 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-xl transition-all font-mono text-[10px] uppercase">Acknowledge</button>
            </div>}
        </div>
    );

    const renderStep = () => {
        switch (readingStep) {
            case 'select-spread': return renderSelectSpread();
            case 'select-deck': return (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-grid animate-fade-in p-10">
                    <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow">Select Conduit</h2>
                    <div className="flex gap-10 overflow-x-auto p-12 max-w-full no-scrollbar">
                        {SHOP_DECKS.filter(d => activeProfile?.ownedDeckIds.includes(d.id)).map(deck => (
                            <div key={deck.id} onClick={() => handleSelectDeck(deck)} className="glass-panel min-w-[400px] p-12 rounded-[3.5rem] cursor-pointer hover:border-teal-500/50 transition-all group relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000"><LayersIcon className="w-32 h-32 text-white"/></div>
                                <h3 className="text-4xl font-bold text-white group-hover:text-teal-400 transition-colors mb-6">{deck.name}</h3>
                                <p className="text-text-muted text-lg leading-relaxed mb-10">{deck.description}</p>
                                <div className="px-10 py-5 rounded-2xl bg-teal-500/10 text-teal-400 text-xs font-mono font-bold uppercase text-center border border-teal-500/20 shadow-glow group-hover:bg-teal-500 group-hover:text-white transition-all">Synchronize_Signal</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setReadingStep('select-spread')} className="mt-20 text-text-muted hover:text-white font-mono text-sm uppercase tracking-widest underline underline-offset-8 transition-opacity opacity-40 hover:opacity-100">Abort_Protocol</button>
                </div>
            );
            case 'picking-cards': return renderPicking();
            case 'revealing': return renderRevealing();
            case 'summary': return (
                <div className="w-full h-full p-8 overflow-y-auto animate-fade-in bg-grid flex flex-col items-center py-20">
                    <header className="text-center mb-16 max-w-3xl">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-8 shadow-glow"><SparklesIcon className="w-12 h-12 text-teal-400"/></div>
                        <h1 className="text-7xl font-bold font-dm-sans text-white mb-4 tracking-tighter neon-glow">Integrated Forecast</h1>
                        <p className="text-text-muted text-xl leading-relaxed">The divergent signals have been processed into a single tactical directive.</p>
                    </header>
                    <div className="max-w-5xl w-full glass-panel p-16 rounded-[4rem] border-white/10 bg-[#0a0b12]/95 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none"><SparklesIcon className="w-96 h-96"/></div>
                        <p className="text-3xl leading-relaxed text-text-primary whitespace-pre-wrap italic mb-16 font-dm-sans border-l-8 border-purple-500/40 pl-12 shadow-text">"{aiSummary}"</p>
                        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row gap-6">
                            <input value={readingTitle} onChange={e => setReadingTitle(e.target.value)} placeholder="LOG_SESSION_ID..." className="flex-grow bg-white/5 border border-white/10 rounded-3xl px-10 py-6 focus:outline-none focus:border-purple-500 transition-colors text-white font-mono text-xl shadow-inner" />
                            <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-14 py-6 rounded-3xl transition-all shadow-glow active:scale-95 text-xl uppercase font-mono tracking-widest">Commit_Archive</button>
                        </div>
                    </div>
                    <div className="mt-20 w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {drawnCards.map((c, i) => (
                             <div key={i} className="flex flex-col gap-4 text-center group">
                                <DivinationCardDisplay drawnCard={c} isRevealed={true} className="!w-full !h-auto aspect-[2/3] ring-1 ring-white/5 group-hover:ring-purple-500/40 transition-all shadow-xl" />
                                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{SPREAD_DETAILS[selectedSpread!].positions[i]}</p>
                             </div>
                        ))}
                    </div>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            {renderStep()}
            <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} onUpgrade={() => { setIsPremiumModalOpen(false); setPage('Profile'); }} />
        </div>
    );
};

export default ReadingsPage;