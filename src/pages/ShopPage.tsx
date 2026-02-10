import React from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_DECKS } from '../constants';
import { SparklesIcon, LayersIcon } from '../components/icons';

/**
 * ShopPage — Stardust-powered deck marketplace.
 * ! Rethemed to match cyberpunk glass-panel design system.
 */
const ShopPage: React.FC = () => {
    const { activeProfile, purchaseDeck, setPage } = useApp();

    if (!activeProfile) {
        return <div className="p-8 text-center text-text-muted animate-pulse font-mono">Initializing_Shop_Data...</div>;
    }

    const { stardust, ownedDeckIds } = activeProfile;

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col bg-grid animate-fade-in overflow-y-auto scroll-smooth">
            <header className="mb-12 flex-shrink-0 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.6em] font-bold">Nexus_Exchange_v2.5</span>
                    </div>
                    <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">The Nexus Shop</h1>
                    <p className="text-lg text-white/40 mt-2">Acquire new conduits to amplify your signal.</p>
                </div>
                <div className="glass-panel px-8 py-5 rounded-2xl border-amber-500/20 flex items-center gap-4">
                    <div>
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold mb-1">Balance</p>
                        <p className="text-3xl font-bold text-amber-400 flex items-center gap-2 font-dm-sans">
                            <SparklesIcon className="w-6 h-6" />
                            {stardust}
                        </p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {SHOP_DECKS.map(deck => {
                    const isOwned = ownedDeckIds.includes(deck.id);
                    const canAfford = stardust >= deck.price;

                    return (
                        <div key={deck.id} className={`glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col transition-all duration-500 group relative overflow-hidden hover:border-purple-500/20 ${isOwned ? 'opacity-50' : ''}`}>
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold font-dm-sans text-white group-hover:text-purple-400 transition-colors tracking-tight">{deck.name}</h2>
                                    <span className={`text-[9px] font-mono font-bold capitalize text-white px-3 py-1.5 rounded-xl border uppercase tracking-wider ${deck.type === 'tarot' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-teal-500/10 border-teal-500/30 text-teal-400'}`}>{deck.type}</span>
                                </div>
                                <p className="text-sm text-white/40 leading-relaxed">{deck.description}</p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/5">
                                {isOwned ? (
                                    <div className="w-full px-6 py-4 text-center rounded-2xl bg-white/5 border border-white/10 text-white/30 font-mono text-[10px] uppercase tracking-widest">
                                        In_Collection ✓
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold text-amber-400 flex items-center gap-2 font-dm-sans">
                                            <SparklesIcon className="w-5 h-5" />
                                            {deck.price}
                                        </p>
                                        <button
                                            onClick={() => purchaseDeck(deck)}
                                            disabled={!canAfford}
                                            className="px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all shadow-glow disabled:opacity-20 disabled:cursor-not-allowed"
                                        >
                                            {canAfford ? 'Acquire_Signal' : 'Insufficient_Dust'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-16 text-center glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                <h3 className="text-xl font-bold text-white font-dm-sans mb-3">How to Earn Stardust?</h3>
                <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                    You earn Stardust by engaging with the system: complete your daily draw, perform readings, write in your journal, and level up by gaining XP.
                    Visit your <button onClick={() => setPage('Progress')} className="font-bold text-purple-400 hover:underline">Progress</button> page to see your stats.
                </p>
            </div>
        </div>
    );
};

export default ShopPage;