import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JournalIcon, CompassIcon, SparklesIcon, LayersIcon, ZapIcon } from '../components/icons';
import { SavedReading, DrawnDivinationCard, DeckType, JournalEntry } from '../types';
import DivinationCardDisplay from '../components/TarotCard';
import { generateContentWithRetry } from '../services/geminiService';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { SpreadCanvas } from '../components/3d/SpreadCanvas';

/**
 * SavedReadingEntry — Displays a single saved reading with rich tiered data.
 */
const SavedReadingEntry: React.FC<{ reading: SavedReading; onCardClick: (card: DrawnDivinationCard) => void; onView3D: (reading: SavedReading) => void; isPremium: boolean }> = ({ reading, onCardClick, onView3D, isPremium }) => {
    const { updateSavedReadingNotes, addXp } = useApp();
    const [notes, setNotes] = useState(reading.userNotes);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { setNotes(reading.userNotes); }, [reading.userNotes]);

    return (
        <GlassPanel className="p-8 space-y-8 group relative overflow-hidden" variant="default" hoverEffect>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cosmic/20 to-transparent"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">
                            {new Date(reading.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {reading.readingIntent && <span className="text-[9px] font-mono font-bold text-hologram bg-hologram/10 px-2 py-0.5 rounded border border-hologram/20 uppercase">Focus: {reading.readingIntent}</span>}
                    </div>
                    <h4 className="text-3xl font-bold font-display text-white group-hover:text-cosmic-light transition-colors tracking-tight">{reading.title}</h4>
                    <div className="flex gap-3 mt-4">
                        <span className="text-[9px] font-mono font-bold text-cosmic-light bg-cosmic/10 px-3 py-1 rounded-xl border border-cosmic/20 uppercase">{String(reading.spreadType || 'Unknown').replace(/-/g, '_')}</span>
                        <span className="text-[9px] font-mono font-bold text-hologram bg-hologram/10 px-3 py-1 rounded-xl border border-hologram/20 uppercase">{reading.deckType}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <CyberButton variant="ghost" size="sm" onClick={() => onView3D(reading)} icon={<LayersIcon className="w-4 h-4" />}>
                        Simulate_Holo
                    </CyberButton>
                </div>
            </div>

            {/* Summary & Shadow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                    <h5 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-4 font-bold">Synthesis_Narrative</h5>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans italic border-l-2 border-cosmic/30 pl-4">{reading.aiSummary}</p>
                </div>
                <div className="space-y-6">
                    {reading.shadowMessage && (
                        <div className="bg-cosmic/5 p-6 rounded-2xl border border-cosmic/10">
                            <h5 className="text-[10px] font-mono text-cosmic-light uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2"><LayersIcon className="w-3 h-3" /> Shadow_Signal</h5>
                            <p className="text-xs text-white/70 leading-relaxed">{reading.shadowMessage}</p>
                        </div>
                    )}
                    {reading.practicalActions && reading.practicalActions.length > 0 && (
                        <div>
                            <h5 className="text-[10px] font-mono text-hologram uppercase tracking-[0.3em] mb-3 font-bold flex items-center gap-2"><ZapIcon className="w-3 h-3" /> Action_Protocols</h5>
                            <ul className="space-y-2">
                                {reading.practicalActions.map((action, i) => (
                                    <li key={i} className="flex gap-3 items-start text-xs text-white/70">
                                        <span className="font-mono text-hologram/50 font-bold">{i + 1}.</span>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Panels */}
            {(reading.cardRelationships || reading.elementalDignity || reading.numerologyThreads) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border-t border-white/5 pt-8">
                    {reading.cardRelationships && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-nebula mb-2 font-bold uppercase tracking-wider">Resonance</p><p className="text-xs text-white/60">{reading.cardRelationships}</p></div>}
                    {reading.elementalDignity && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-blue-400 mb-2 font-bold uppercase tracking-wider">Elements</p><p className="text-xs text-white/60">{reading.elementalDignity}</p></div>}
                    {reading.numerologyThreads && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-pink-400 mb-2 font-bold uppercase tracking-wider">Numerology</p><p className="text-xs text-white/60">{reading.numerologyThreads}</p></div>}
                </div>
            )}

            {/* Cards Grid */}
            <div className="border-t border-white/5 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {reading.cards.map((c, i) => (
                        <div key={i} className="text-center group/card flex flex-col gap-3">
                            <p className="text-[8px] font-mono text-white/40 truncate uppercase opacity-40 group-hover/card:opacity-100">{reading.positions[i]}</p>
                            <DivinationCardDisplay drawnCard={c} isRevealed={true} onClick={() => onCardClick(c)} className="!w-full !h-auto aspect-[2/3] mx-auto cursor-pointer hover:scale-105 transition-all shadow-xl" />
                            {c.interpretation && (
                                <p className="text-[9px] text-white/50 leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all">{c.interpretation}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* User Notes */}
            <div className="border-t border-white/5 pt-8">
                <h5 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-4 font-bold">Operator_Observations</h5>
                {isEditing ? (
                    <div className="space-y-4">
                        <CyberInput multiline rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="INPUT_LOG_DATA..." />
                        <div className="flex justify-end gap-2">
                            <CyberButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</CyberButton>
                            <CyberButton variant="primary" size="sm" onClick={() => { updateSavedReadingNotes(reading.id, notes); setIsEditing(false); addXp(5); }}>Commit_Memory</CyberButton>
                        </div>
                    </div>
                ) : (
                    <div onClick={() => setIsEditing(true)} className="w-full p-6 rounded-3xl cursor-pointer hover:bg-white/5 bg-void-darker/30 border border-transparent hover:border-white/10 transition-all shadow-inner">
                        <p className="text-sm text-white/40 italic">{notes || 'SIGNAL_PENDING: Click to add observations...'}</p>
                    </div>
                )}
            </div>
        </GlassPanel>
    );
};

const JournalEntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    return (
        <GlassPanel className="p-6 relative overflow-hidden group" hoverEffect>
            <div className="absolute top-0 left-0 w-1 h-full bg-hologram/20 group-hover:bg-hologram transition-colors"></div>
            <div className="flex justify-between items-start mb-3 pl-4">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">
                    {new Date(entry.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className="text-[9px] font-mono font-bold text-hologram bg-hologram/10 px-3 py-1 rounded-xl border border-hologram/20 uppercase">Reflection</span>
            </div>
            <p className="pl-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">{entry.text}</p>
        </GlassPanel>
    );
};

const JournalPage: React.FC = () => {
    const { journalEntries, addJournalEntry, savedReadings, addXp, isPremium } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [newEntryText, setNewEntryText] = useState('');
    const [activeTab, setActiveTab] = useState<'readings' | 'journal'>('readings');
    const [dynamicPrompt, setDynamicPrompt] = useState("What is the most important message you received today?");
    const [readingIn3D, setReadingIn3D] = useState<SavedReading | null>(null);

    // ! AI Journal Analysis state (Premium feature)
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisExpanded, setAnalysisExpanded] = useState(true);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    // * Generate dynamic journal prompt on mount
    useEffect(() => {
        const prompts = [
            "What pattern have you noticed repeating in your life recently?",
            "Which card from your last reading felt most uncomfortable?",
            "How can you embody the energy of your Life Path number today?",
            "What is one small action you can take to align with your purpose?",
            "What shadow aspect are you ready to bring into the light?"
        ];
        // If we have a recent reading, try to be more specific
        if (savedReadings.length > 0) {
            const lastReading = savedReadings[0];
            if (lastReading.shadowMessage) {
                setDynamicPrompt(`Reflecting on your last reading: "${lastReading.shadowMessage}" - how does this manifest in your daily actions?`);
            } else {
                setDynamicPrompt(`Reflect on the "${lastReading.title}" reading. What has shifted since then?`);
            }
        } else {
            setDynamicPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        }
    }, [savedReadings]);

    const filteredReadings = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return savedReadings.filter(r =>
            (r.title?.toLowerCase() || '').includes(query) ||
            (r.userNotes?.toLowerCase() || '').includes(query)
        );
    }, [savedReadings, searchQuery]);

    const filteredJournalEntries = useMemo(() => {
        if (!searchQuery) return journalEntries;
        const query = searchQuery.toLowerCase();
        return journalEntries.filter(e => (e.text?.toLowerCase() || '').includes(query));
    }, [journalEntries, searchQuery]);

    const handleAddJournalEntry = () => {
        if (!newEntryText.trim()) return;
        addJournalEntry(newEntryText.trim());
        setNewEntryText('');
        addXp(15);
    };

    /**
     * handleAnalyzePatterns — Build a Gemini prompt from journal entries and
     * saved readings to surface recurring themes, patterns, and growth arcs.
     * Premium-gated feature.
     */
    const handleAnalyzePatterns = async () => {
        if (!isPremium) return;
        if (journalEntries.length === 0 && savedReadings.length === 0) {
            setAnalysisError('Insufficient data. Log more reflections or save readings first.');
            return;
        }

        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);
        setAnalysisExpanded(true);

        // * Build context from recent entries (limit to prevent token overflow)
        const recentJournals = journalEntries.slice(0, 15).map((e, i) =>
            `[Entry ${i + 1} — ${new Date(e.date).toLocaleDateString()}]: ${e.text}`
        ).join('\n');

        const recentReadings = savedReadings.slice(0, 10).map((r, i) => {
            const cardNames = r.cards.map(c => c.card.name).join(', ');
            return `[Reading ${i + 1} — ${r.title} (${r.spreadType}) on ${new Date(r.date).toLocaleDateString()}]:\n  Cards: ${cardNames}\n  Summary: ${r.aiSummary || 'N/A'}\n  Shadow: ${r.shadowMessage || 'N/A'}\n  User Notes: ${r.userNotes || 'N/A'}`;
        }).join('\n\n');

        const prompt = `You are a mystical AI pattern analyst for a cyber-divination app called Gridpunk Arcana. The user has been logging journal reflections and saving tarot/oracle readings. Your task: analyze ALL of the data below and surface deep, meaningful patterns.

## Journal Reflections:
${recentJournals || '(No journal entries yet)'}

## Saved Readings:
${recentReadings || '(No readings saved yet)'}

## Your Analysis Should Include:
1. **Recurring Themes** — What archetypes, elements, or emotional threads repeat?
2. **Growth Arc** — How has the user's journey evolved over time?
3. **Shadow Patterns** — What hidden or uncomfortable themes keep surfacing?
4. **Elemental Balance** — Based on cards drawn, is there a Fire/Water/Air/Earth imbalance?
5. **Actionable Insight** — One specific, practical recommendation.

Format your response in clean sections with headers. Use a mystical but grounded tone. Keep it concise (under 400 words). Do NOT use markdown code blocks.`;

        try {
            const response = await generateContentWithRetry({
                model: 'arcee-ai/trinity-large-preview:free',
                contents: prompt,
            });
            const text = response.text ?? '';
            setAnalysisResult(text);
            addXp(25); // * Reward for engaging with premium analysis
        } catch (err: any) {
            console.error('Journal analysis failed:', err);
            setAnalysisError('Analysis failed. The neural link is unstable — try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col bg-void text-white animate-fade-in overflow-hidden scroll-smooth relative">
            {readingIn3D && (
                <div className="fixed inset-0 z-[100] bg-black/95 animate-fade-in flex flex-col">
                    <div className="absolute top-8 right-8 z-50">
                        <CyberButton onClick={() => setReadingIn3D(null)} variant="secondary" icon={<ZapIcon className="w-4 h-4" />}>
                            TERMINATE_SIMULATION
                        </CyberButton>
                    </div>
                    <SpreadCanvas
                        spreadType={readingIn3D.spreadType}
                        cards={readingIn3D.cards}
                        revealedIndices={new Set(readingIn3D.cards.map((_, i) => i))}
                        isReadOnly={true}
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

            <header className="mb-10 flex-shrink-0 flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="max-w-2xl z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-cosmic animate-pulse"></div>
                        <span className="text-[10px] font-mono text-cosmic-light uppercase tracking-[0.6em] font-bold">Signal_Archive_v2.5</span>
                    </div>
                    <h1 className="text-6xl font-bold font-display text-white tracking-tighter neon-glow">Archive Logs</h1>
                </div>
                {/* ! AI Pattern Analysis button — Premium only */}
                {isPremium && (
                    <CyberButton
                        variant="primary"
                        onClick={handleAnalyzePatterns}
                        disabled={isAnalyzing || (journalEntries.length === 0 && savedReadings.length === 0)}
                        isLoading={isAnalyzing}
                        icon={<SparklesIcon className="w-4 h-4" />}
                        className="z-10"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze_Patterns'}
                    </CyberButton>
                )}
            </header>

            <div className="flex-grow overflow-y-auto space-y-8 pr-6 -mr-6 no-scrollbar z-10">

                {/* ! AI Analysis Result Panel */}
                {(analysisResult || analysisError) && (
                    <GlassPanel className="overflow-hidden shadow-2xl bg-gradient-to-br from-cosmic/5 to-nebula/5">
                        <button
                            onClick={() => setAnalysisExpanded(!analysisExpanded)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-nebula animate-pulse"></div>
                                <h3 className="text-xs font-mono text-nebula uppercase tracking-widest font-bold">Pattern_Analysis_Report</h3>
                            </div>
                            <span className="text-white/30 text-xs font-mono">{analysisExpanded ? '▲ COLLAPSE' : '▼ EXPAND'}</span>
                        </button>
                        {analysisExpanded && (
                            <div className="px-8 pb-8 animate-fade-in">
                                {analysisError ? (
                                    <p className="text-red-400 text-sm font-mono">{analysisError}</p>
                                ) : (
                                    <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans border-l-2 border-nebula/30 pl-6 space-y-2">
                                        {analysisResult}
                                    </div>
                                )}
                            </div>
                        )}
                    </GlassPanel>
                )}

                {/* Journal Input with Dynamic Prompt */}
                <GlassPanel className="p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <h3 className="text-xs font-mono text-hologram uppercase tracking-widest mb-4 font-bold flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> Daily_Reflection_Protocol</h3>
                    <p className="text-white/60 text-sm mb-4 italic">"{dynamicPrompt}"</p>
                    <div className="relative">
                        <CyberInput
                            multiline
                            rows={3}
                            value={newEntryText}
                            onChange={e => setNewEntryText(e.target.value)}
                            placeholder="Type your reflection here..."
                        />
                        <div className="mt-4 flex justify-end">
                            <CyberButton
                                onClick={handleAddJournalEntry}
                                disabled={!newEntryText.trim()}
                                size="sm"
                                variant="secondary"
                            >
                                Log_Entry
                            </CyberButton>
                        </div>
                    </div>
                </GlassPanel>

                {/* Search Bar */}
                <div className="max-w-md">
                    <CyberInput
                        placeholder="Search archives (title, notes, reflections)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<CompassIcon className="w-4 h-4 text-white/40" />}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-white/10 pb-4">
                    <button onClick={() => setActiveTab('readings')} className={`text-sm font-mono uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'readings' ? 'text-cosmic-light border-b-2 border-cosmic' : 'text-white/40 hover:text-white'}`}>Saved_Readings ({filteredReadings.length})</button>
                    <button onClick={() => setActiveTab('journal')} className={`text-sm font-mono uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'journal' ? 'text-hologram border-b-2 border-hologram' : 'text-white/40 hover:text-white'}`}>Journal_Entries ({filteredJournalEntries.length})</button>
                </div>

                {/* Content */}
                <div className="space-y-6 pb-20">
                    {activeTab === 'readings' ? (
                        filteredReadings.length > 0 ? (
                            filteredReadings.map(reading => (
                                <SavedReadingEntry key={reading.id} reading={reading} onCardClick={() => { }} onView3D={setReadingIn3D} isPremium={isPremium} />
                            ))
                        ) : (
                            <p className="text-center text-white/20 font-mono py-10">NO_SIGNAL_FOUND_IN_ARCHIVE</p>
                        )
                    ) : (
                        filteredJournalEntries.length > 0 ? (
                            filteredJournalEntries.map(entry => (
                                <JournalEntryCard key={entry.id} entry={entry} />
                            ))
                        ) : (
                            <p className="text-center text-white/20 font-mono py-10">NO_ENTRIES_LOGGED</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalPage;