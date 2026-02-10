import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JournalIcon, CompassIcon, SparklesIcon } from '../components/icons';
import { SPREAD_DETAILS } from '../constants';
import { SavedReading, DrawnDivinationCard, Rune, DeckType } from '../types';
import DivinationCardDisplay from '../components/TarotCard';
import CardDetailModal from '../components/CardDetailModal';
import { GoogleGenAI } from '@google/genai';

const SavedReadingEntry: React.FC<{ reading: SavedReading; onCardClick: (card: DrawnDivinationCard) => void; }> = ({ reading, onCardClick }) => {
    const { updateSavedReadingNotes, addXp, activeProfile } = useApp();
    const [notes, setNotes] = useState(reading.userNotes);
    const [isEditing, setIsEditing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [residualWisdom, setResidualWisdom] = useState<string | null>(null);

    useEffect(() => { setNotes(reading.userNotes); }, [reading.userNotes]);

    const handleDeepDive = async () => {
        if (isAnalyzing || residualWisdom) return;
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Re-analyze this past reading from ${new Date(reading.date).toLocaleDateString()}.
            Context: ${reading.aiSummary.slice(0, 500)}.
            Requirement: What new "residual wisdom" emerges if we look at this data stream through the lens of a "future" observer? Deliver 150 words of cinematic insight.`;
            const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setResidualWisdom(res.text);
            addXp(10);
        } catch (e) { console.error(e); } 
        finally { setIsAnalyzing(false); }
    };

    return (
        <div className="bg-[#0a0b12]/60 p-8 rounded-[2.5rem] border border-white/5 space-y-8 hover:border-purple-500/20 transition-all group shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.4em] mb-2 font-bold">
                        {new Date(reading.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h4 className="text-3xl font-bold font-dm-sans text-white group-hover:text-purple-400 transition-colors tracking-tight">{reading.title}</h4>
                    <div className="flex gap-3 mt-4">
                        <span className="text-[9px] font-mono font-bold text-purple-400 bg-purple-400/10 px-3 py-1 rounded-xl border border-purple-400/20 uppercase">{reading.spreadType.replace(/-/g, '_')}</span>
                        <span className="text-[9px] font-mono font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-xl border border-teal-400/20 uppercase">{reading.deckType}</span>
                    </div>
                </div>
                <button onClick={handleDeepDive} className="px-5 py-2 rounded-xl bg-purple-600/10 border border-purple-500/30 text-purple-400 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2">
                    {isAnalyzing ? 'Processing...' : <><SparklesIcon className="w-3 h-3"/> {residualWisdom ? 'Archive Deep-Scan Complete' : 'Perform Deep-Scan'}</>}
                </button>
            </div>
            
            <div className="border-t border-white/5 pt-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                    {reading.cards.map((c, i) => (
                        <div key={i} className="text-center group/card">
                             <p className="text-[8px] font-mono text-text-muted mb-2 truncate uppercase opacity-40 group-hover/card:opacity-100">{reading.positions[i]}</p>
                             <DivinationCardDisplay drawnCard={c} isRevealed={true} onClick={() => onCardClick(c)} className="!w-full !h-auto aspect-[2/3] mx-auto cursor-pointer hover:scale-105 transition-all shadow-xl" />
                        </div>
                    ))}
                </div>
            </div>

            {residualWisdom && <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-sm text-text-muted italic animate-fade-in">### Residual Wisdom Analysis: "{residualWisdom}"</div>}

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

const JournalPage: React.FC = () => {
  const { journalEntries, addJournalEntry, savedReadings, addXp } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDeck, setFilterDeck] = useState<DeckType | 'all'>('all');
  const [filterSpread, setFilterSpread] = useState<string>('all');
  const [newEntryText, setNewEntryText] = useState('');
  const [modalCard, setModalCard] = useState<DrawnDivinationCard | null>(null);

  const filteredReadings = useMemo(() => {
      return savedReadings.filter(r => {
          const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               r.userNotes.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDeck = filterDeck === 'all' || r.deckType === filterDeck;
          const matchesSpread = filterSpread === 'all' || r.spreadType === filterSpread;
          return matchesSearch && matchesDeck && matchesSpread;
      });
  }, [savedReadings, searchQuery, filterDeck, filterSpread]);

  const availableSpreads = useMemo(() => Array.from(new Set(savedReadings.map(r => r.spreadType))), [savedReadings]);

  return (
    <>
      <div className="w-full h-full p-6 md:p-14 flex flex-col bg-grid animate-fade-in overflow-hidden scroll-smooth">
        <header className="mb-14 flex-shrink-0 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-2xl">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] font-bold">Signal_Archive_v2.5</span>
            </div>
            <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Archive Logs</h1>
          </div>
        </header>
        
        <div className="flex-grow overflow-y-auto space-y-16 pr-6 -mr-6 no-scrollbar">
          <section className="glass-panel p-10 rounded-[3rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col lg:flex-row gap-8 items-end">
              <div className="flex-grow w-full">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2 font-bold">Metadata_Scan</p>
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="SCANNING_ARCHIVE_DATA..." className="bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono text-white focus:outline-none focus:border-purple-500 w-full" />
              </div>
              <div className="w-full lg:w-48">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2 font-bold">Class_Isolation</p>
                  <select value={filterDeck} onChange={e => setFilterDeck(e.target.value as any)} className="bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono text-white w-full">
                      <option value="all">ALL_DECKS</option>
                      <option value="tarot">TAROT</option>
                      <option value="runes">RUNES</option>
                      <option value="oracle">ORACLE</option>
                  </select>
              </div>
              <div className="w-full lg:w-48">
                  <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2 font-bold">Pattern_Filter</p>
                  <select value={filterSpread} onChange={e => setFilterSpread(e.target.value)} className="bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono text-white w-full">
                      <option value="all">ALL_SPREADS</option>
                      {availableSpreads.map(s => <option key={s} value={s}>{s.toUpperCase().replace(/-/g, '_')}</option>)}
                  </select>
              </div>
          </section>

          <section className="space-y-12">
               {filteredReadings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-12">
                    {filteredReadings.map(reading => (
                        <SavedReadingEntry key={reading.id} reading={reading} onCardClick={setModalCard} />
                    ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center py-40 text-center opacity-20">
                      <CompassIcon className="w-20 h-20 mb-6 text-white/40" />
                      <h3 className="text-2xl font-mono uppercase font-bold tracking-widest">No matching signals found</h3>
                  </div>
              )}
          </section>
        </div>
      </div>
      <CardDetailModal drawnCard={modalCard} onClose={() => setModalCard(null)} />
    </>
  );
};

export default JournalPage;