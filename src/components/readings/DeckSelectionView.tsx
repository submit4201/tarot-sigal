import React from 'react';
import { Deck, UserProfile } from '../../types';
import { SHOP_DECKS } from '../../constants';
import { LayersIcon } from '../icons';

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
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-grid animate-fade-in p-10">
            <h2 className="text-6xl font-bold text-white mb-12 uppercase tracking-tighter neon-glow">Select Conduit</h2>
            <div className="flex gap-10 overflow-x-auto p-12 max-w-full no-scrollbar">
                {SHOP_DECKS.filter(d => activeProfile?.ownedDeckIds.includes(d.id)).map(deck => (
                    <div key={deck.id} onClick={() => onSelectDeck(deck)} className="glass-panel min-w-[400px] p-12 rounded-[3.5rem] cursor-pointer hover:border-teal-500/50 transition-all group relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000"><LayersIcon className="w-32 h-32 text-white" /></div>
                        <h3 className="text-4xl font-bold text-white group-hover:text-teal-400 transition-colors mb-6">{deck.name}</h3>
                        <p className="text-text-muted text-lg leading-relaxed mb-10">{deck.description}</p>
                        <div className="px-10 py-5 rounded-2xl bg-teal-500/10 text-teal-400 text-xs font-mono font-bold uppercase text-center border border-teal-500/20 shadow-glow group-hover:bg-teal-500 group-hover:text-white transition-all">Synchronize_Signal</div>
                    </div>
                ))}
            </div>
            <button onClick={onAbort} className="mt-20 text-text-muted hover:text-white font-mono text-sm uppercase tracking-widest underline underline-offset-8 transition-opacity opacity-40 hover:opacity-100">Abort_Protocol</button>
        </div>
    );
};
