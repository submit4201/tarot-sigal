import React from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_DECKS } from '../constants';
import { SparklesIcon } from '../components/icons';

const ShopPage: React.FC = () => {
    const { activeProfile, purchaseDeck, setPage } = useApp();

    if (!activeProfile) {
        return <div>Loading profile...</div>;
    }

    const { stardust, ownedDeckIds } = activeProfile;

    return (
        <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold font-dm-sans text-text-primary">The Nexus Shop</h1>
                    <p className="text-text-muted">Acquire new tools to aid your journey.</p>
                </div>
                <div className="bg-[#111218] p-3 rounded-xl border border-[#232533] text-right">
                    <p className="text-sm font-semibold text-text-muted">Your Balance</p>
                    <p className="text-2xl font-bold text-amber-400 flex items-center gap-2 justify-end">
                        <SparklesIcon className="w-5 h-5" />
                        {stardust}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SHOP_DECKS.map(deck => {
                    const isOwned = ownedDeckIds.includes(deck.id);
                    const canAfford = stardust >= deck.price;

                    return (
                        <div key={deck.id} className={`bg-[#111218] p-6 rounded-xl border border-[#232533] flex flex-col transition-all duration-300 ${isOwned ? 'opacity-60' : ''}`}>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-2xl font-semibold font-dm-sans text-text-primary">{deck.name}</h2>
                                    <span className={`text-xs font-bold capitalize text-white px-2 py-1 rounded-full ${deck.type === 'tarot' ? 'bg-purple-600' : 'bg-green-600'}`}>{deck.type}</span>
                                </div>
                                <p className="text-text-muted text-sm">{deck.description}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-[#232533]">
                                {isOwned ? (
                                    <button disabled className="w-full px-4 py-2 rounded-lg font-bold bg-[#232533] text-text-muted cursor-not-allowed">
                                        In Your Collection
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-amber-400 flex items-center gap-1">
                                            <SparklesIcon className="w-4 h-4" />
                                            {deck.price}
                                        </p>
                                        <button
                                            onClick={() => purchaseDeck(deck)}
                                            disabled={!canAfford}
                                            className="px-6 py-2 rounded-lg font-bold bg-[#5A67D8] text-white hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {canAfford ? 'Acquire' : 'Not Enough Stardust'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
             <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold text-text-primary">How to earn Stardust?</h3>
                <p className="text-text-muted max-w-md mx-auto mt-2">
                    You earn Stardust by engaging with the app: complete your daily draw, perform readings, write in your journal, and level up by gaining XP.
                    Visit your <button onClick={() => setPage('Progress')} className="font-bold text-purple-400 hover:underline">Progress</button> page to see your stats.
                </p>
            </div>
        </div>
    );
};

export default ShopPage;