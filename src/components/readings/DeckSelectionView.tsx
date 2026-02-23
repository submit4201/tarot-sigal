import React from 'react';
import { Deck, UserProfile } from '../../types';
import { LayersIcon } from '../icons';
import { useApp } from '../../context/AppContext';

interface DeckSelectionViewProps {
    activeProfile: UserProfile | null;
    onSelectDeck: (deck: Deck) => void;
    onAbort: () => void;
}

export const DeckSelectionView: React.FC<DeckSelectionViewProps> = ({
    activeProfile,
    onSelectDeck,
    onAbort
}) => {
    const { getDeckBackPath, decks } = useApp();
    const ownedDecks = decks.filter(d => activeProfile?.ownedDeckIds.includes(d.id) || d.price === 0);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-grid animate-fade-in p-6">
            <header className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter neon-glow">Select Conduit</h2>
                <p className="text-text-muted font-mono text-xs uppercase tracking-[0.3em] mt-2">Initialize_Deck_Symmetry</p>
            </header>

            <div className="flex gap-6 overflow-x-auto p-4 max-w-7xl no-scrollbar overflow-y-hidden">
                {ownedDecks.map(deck => (
                    <div
                        key={deck.id}
                        onClick={() => onSelectDeck(deck)}
                        className="glass-panel min-w-[320px] md:min-w-[400px] p-8 rounded-3xl cursor-pointer border-white/5 hover:border-teal-500/40 transition-all group relative overflow-hidden shadow-2xl hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                            <LayersIcon className="w-32 h-32 text-white" />
                        </div>

                        <div className="w-full aspect-[2/3] max-h-60 rounded-xl bg-black/40 border border-white/10 mb-6 overflow-hidden relative shadow-inner">
                            <img
                                src={getDeckBackPath(deck.id)}
                                alt={deck.name}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>

                        <h3 className="text-2xl font-bold text-white group-hover:text-teal-400 transition-colors mb-2">{deck.name}</h3>
                        <p className="text-text-muted text-sm leading-relaxed mb-8 flex-grow opacity-60 line-clamp-3">{deck.description}</p>

                        <div className="py-4 rounded-xl bg-teal-500/10 text-teal-400 text-[10px] font-mono font-bold uppercase text-center border border-teal-500/20 shadow-glow group-hover:bg-teal-500 group-hover:text-white transition-all tracking-widest">
                            Establish_Link
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onAbort} className="mt-12 text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest underline underline-offset-8 transition-opacity opacity-40 hover:opacity-100 italic">
                Abort_Protocol
            </button>
        </div>
    );
};
