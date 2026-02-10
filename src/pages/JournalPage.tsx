import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JournalIcon, CompassIcon, SparklesIcon, LayersIcon, ZapIcon } from '../components/icons';
import { SPREAD_DETAILS, SHOP_DECKS } from '../constants';
import { SavedReading, DrawnDivinationCard, Rune, DeckType, JournalEntry } from '../types';
import DivinationCardDisplay from '../components/TarotCard';
import { generateContentWithRetry } from '../services/geminiService';

/**
 * SavedReadingEntry — Displays a single saved reading with rich tiered data.
 */
const SavedReadingEntry: React.FC<{ reading: SavedReading; onCardClick: (card: DrawnDivinationCard) => void; isPremium: boolean }> = ({ reading, onCardClick, isPremium }) => {
    const { updateSavedReadingNotes, addXp } = useApp();
    const [notes, setNotes] = useState(reading.userNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [activeDeepDiveIndex, setActiveDeepDiveIndex] = useState<number | null>(null);

    useEffect(() => { setNotes(reading.userNotes); }, [reading.userNotes]);

    return (
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-8 hover:border-purple-500/20 transition-all group shadow-2xl relative overflow-hidden bg-[#0a0b12]/60">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.4em] font-bold">
                            {new Date(reading.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {reading.readingIntent && <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20 uppercase">Focus: {reading.readingIntent}</span>}
                    </div>
                    <h4 className="text-3xl font-bold font-dm-sans text-white group-hover:text-purple-400 transition-colors tracking-tight">{reading.title}</h4>
                    <div className="flex gap-3 mt-4">
                        <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-xl border border-purple-400/20 uppercase">{reading.spreadType.replace(/-/g, '_')}</span>
                        <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-xl border border-teal-400/20 uppercase">{reading.deckType}</span>
                    </div>
                </div>
            </div>

            {/* Summary & Shadow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                <div>
                    <h5 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-4 font-bold">Synthesis_Narrative</h5>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-dm-sans italic border-l-2 border-purple-500/30 pl-4">{reading.aiSummary}</p>
                </div>
                <div className="space-y-6">
                    {reading.shadowMessage && (
                        <div className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10">
                            <h5 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2"><LayersIcon className="w-3 h-3" /> Shadow_Signal</h5>
                            <p className="text-xs text-white/70 leading-relaxed">{reading.shadowMessage}</p>
                        </div>
                    )}
                    {reading.practicalActions && reading.practicalActions.length > 0 && (
                        <div>
                            <h5 className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.3em] mb-3 font-bold flex items-center gap-2"><ZapIcon className="w-3 h-3" /> Action_Protocols</h5>
                            <ul className="space-y-2">
                                {reading.practicalActions.map((action, i) => (
                                    <li key={i} className="flex gap-3 items-start text-xs text-white/70">
                                        <span className="font-mono text-teal-500/50 font-bold">{i + 1}.</span>
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
                    {reading.cardRelationships && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-amber-500 mb-2 font-bold uppercase tracking-wider">Resonance</p><p className="text-xs text-white/60">{reading.cardRelationships}</p></div>}
                    {reading.elementalDignity && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-blue-400 mb-2 font-bold uppercase tracking-wider">Elements</p><p className="text-xs text-white/60">{reading.elementalDignity}</p></div>}
                    {reading.numerologyThreads && <div className="bg-white/5 p-4 rounded-xl"><p className="text-[9px] text-pink-400 mb-2 font-bold uppercase tracking-wider">Numerology</p><p className="text-xs text-white/60">{reading.numerologyThreads}</p></div>}
                </div>
            )}

            {/* Cards Grid */}
            <div className="border-t border-white/5 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {reading.cards.map((c, i) => (
                        <div key={i} className="text-center group/card flex flex-col gap-3">
                            <p className="text-[8px] font-mono text-text-muted truncate uppercase opacity-40 group-hover/card:opacity-100">{reading.positions[i]}</p>
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
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-32 p-6 bg-black/40 border border-white/10 rounded-3xl focus:ring-2 focus:ring-purple-500 font-mono text-sm shadow-inner" placeholder="INPUT_LOG_DATA..." />
                        <button onClick={() => { updateSavedReadingNotes(reading.id, notes); setIsEditing(false); addXp(5); }} className="px-8 py-3 text-xs font-mono font-bold rounded-2xl bg-teal-600 text-white uppercase tracking-widest shadow-glow">Commit_Memory</button>
                    </div>
                ) : (
                    <div onClick={() => setIsEditing(true)} className="w-full p-6 rounded-3xl cursor-pointer hover:bg-white/5 bg-black/30 border border-transparent hover:border-white/10 transition-all shadow-inner">
                        <p className="text-sm text-text-muted italic">{notes || 'SIGNAL_PENDING: Click to add observations...'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const JournalEntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl border-white/5 hover:border-teal-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/20 group-hover:bg-teal-500 transition-colors"></div>
            <div className="flex justify-between items-start mb-3 pl-4">
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.4em] font-bold">
                    {new Date(entry.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-xl border border-teal-400/20 uppercase">Reflection</span>
            </div>
            <p className="pl-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-dm-sans">{entry.text}</p>
        </div>
    );
};

const JournalPage: React.FC = () => {
    const { journalEntries, addJournalEntry, savedReadings, addXp, isPremium } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDeck, setFilterDeck] = useState<DeckType | 'all'>('all');
    const [newEntryText, setNewEntryText] = useState('');
    const [activeTab, setActiveTab] = useState<'readings' | 'journal'>('readings');
    const [dynamicPrompt, setDynamicPrompt] = useState("What is the most important message you received today?");

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
        return savedReadings.filter(r =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.userNotes.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [savedReadings, searchQuery]);

    const filteredJournalEntries = useMemo(() => {
        if (!searchQuery) return journalEntries;
        return journalEntries.filter(e => e.text.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [journalEntries, searchQuery]);

    const handleAddJournalEntry = () => {
        if (!newEntryText.trim()) return;
        addJournalEntry(newEntryText.trim());
        setNewEntryText('');
        addXp(15);
    };

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col bg-grid animate-fade-in overflow-hidden scroll-smooth">
            <header className="mb-10 flex-shrink-0 flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] font-bold">Signal_Archive_v2.5</span>
                    </div>
                    <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Archive Logs</h1>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto space-y-8 pr-6 -mr-6 no-scrollbar">

                {/* Journal Input with Dynamic Prompt */}
                <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                    <h3 className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-4 font-bold flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> Daily_Reflection_Protocol</h3>
                    <p className="text-white/60 text-sm mb-4 italic">"{dynamicPrompt}"</p>
                    <div className="relative">
                        <textarea
                            value={newEntryText}
                            onChange={e => setNewEntryText(e.target.value)}
                            placeholder="Type your reflection here..."
                            className="w-full h-24 p-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none"
                        />
                        <button
                            onClick={handleAddJournalEntry}
                            disabled={!newEntryText.trim()}
                            className="absolute bottom-4 right-4 px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-glow disabled:opacity-50"
                        >
                            Log_Entry
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-white/10 pb-4">
                    <button onClick={() => setActiveTab('readings')} className={`text-sm font-mono uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'readings' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/40 hover:text-white'}`}>Saved_Readings ({savedReadings.length})</button>
                    <button onClick={() => setActiveTab('journal')} className={`text-sm font-mono uppercase tracking-widest font-bold pb-2 transition-all ${activeTab === 'journal' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-white/40 hover:text-white'}`}>Journal_Entries ({journalEntries.length})</button>
                </div>

                {/* Content */}
                <div className="space-y-6 pb-20">
                    {activeTab === 'readings' ? (
                        filteredReadings.length > 0 ? (
                            filteredReadings.map(reading => (
                                <SavedReadingEntry key={reading.id} reading={reading} onCardClick={() => { }} isPremium={isPremium} />
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