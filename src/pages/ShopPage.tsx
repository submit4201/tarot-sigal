import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SparklesIcon, ZapIcon } from '../components/icons';
import { createCheckoutSession } from '../services/stripeService';
import { AnimatedCardFront } from '../components/AnimatedCardFront';
import CyberpunkAd from '@/components/ui/CyberpunkAd';

/**
 * ShopPage — Restructured premium marketplace.
 * Stardust CTAs at top/bottom, decks look like "Daily Cards" with fluid previews.
 */
const ShopPage: React.FC = () => {
    const { activeProfile, purchaseDeck, setPage, decks, activeDeckId, setActiveDeck, isPremium, hasRequiredTier } = useApp();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handleStardustPurchase = async (packTier: string) => {
        setIsPurchasing(true);
        try {
            await createCheckoutSession('stardust', packTier as any);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            alert(`Failed to start checkout: ${errorMessage}`);
            setIsPurchasing(false);
        }
    };

    if (!activeProfile) {
        return <div className="p-8 text-center text-text-muted animate-pulse font-mono">Initializing_Shop_Data...</div>;
    }

    const { stardust, ownedDeckIds } = activeProfile;

    const stardustPacks = [
        { name: 'Volt', tier: 'spark', price: 0.99, stardust: 250, color: 'purple', status: 'STABLE' },
        { name: 'Kinetic', tier: 'ember', price: 2.99, stardust: 1000, color: 'purple', status: 'HIGH' },
        { name: 'Core', tier: 'supernova', price: 4.99, stardust: 2500, color: 'amber', popular: true, status: 'SURGE' },
        { name: 'Quantum', tier: 'cosmic_rift', price: 9.99, stardust: 7500, color: 'amber', bestValue: true, status: 'RIFT' }
    ];

    const StardustSurgeBar = () => (
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            {stardustPacks.map(pack => {
                const isAmber = pack.color === 'amber';
                return (
                    <button
                        key={pack.tier}
                        onClick={() => handleStardustPurchase(pack.tier)}
                        disabled={isPurchasing}
                        className={`flex-shrink-0 w-64 md:w-auto glass-panel p-5 rounded-2xl border-white/5 bg-white/[0.02] flex items-center justify-between group transition-all duration-500 hover:scale-[1.02] active:scale-95 ${isAmber ? 'hover:border-amber-500/40' : 'hover:border-purple-500/40'}`}
                    >
                        <div className="flex items-center gap-4">
                            <ZapIcon className={`w-8 h-8 ${isAmber ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]'}`} />
                            <div className="text-left">
                                <p className="text-[9px] font-mono text-white/30 uppercase font-bold leading-none mb-1">{pack.name}_Surge</p>
                                <p className="text-lg font-bold text-white font-dm-sans">+{pack.stardust}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-white/60 mb-1">${pack.price}</p>
                            <span className={`text-[7px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${isAmber ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-purple-500/20 border-purple-500/40 text-purple-400'}`}>
                                {isPurchasing ? '...' : pack.status}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="w-full h-full p-6 md:px-14 md:py-10 flex flex-col bg-grid animate-fade-in overflow-y-auto scroll-smooth gap-16">
            {/* Header section with Balance */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
                <div className="max-w-2xl text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.5em] font-bold">Nexus_Exchange_v5.0 // FLUID_SYNC_ACTIVE</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Marketplace</h1>
                </div>
                <div className="glass-panel px-8 py-5 rounded-2xl border-purple-500/30 flex items-center gap-4 bg-purple-500/5 shadow-glow">
                    <div className="text-right">
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold mb-1">Energy_Balance</p>
                        <p className="text-3xl font-bold text-teal-400 flex items-center justify-end gap-2 font-dm-sans">
                            <ZapIcon className="w-6 h-6 animate-pulse" />
                            {stardust}
                        </p>
                    </div>
                </div>
            </header>

            {/* Top CTA Row */}
            <section className="space-y-4">
                <header className="flex items-center gap-4">
                    <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">Surge_Energy</h2>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
                </header>
                <StardustSurgeBar />
            </section>

            {/* Deck Marketplace Row */}
            <section className="space-y-8">
                <header className="flex items-center gap-4">
                    <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">Signal_Conduits</h2>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {decks.map(deck => {
                        const isOwned = ownedDeckIds.includes(deck.id) || deck.price === 0;
                        const isActive = activeDeckId === deck.id;
                        const tierMet = hasRequiredTier(deck.tierRequirement);
                        const canAfford = stardust >= (deck.price || 0) && tierMet;

                        return (
                            <div key={deck.id} className="flex flex-col group items-center">
                                {/* The "Daily Card" Container */}
                                <div className={`relative w-full max-w-[280px] transition-all duration-700 ${isActive ? 'scale-105' : 'hover:scale-[1.02]'}`}>
                                    <AnimatedCardFront
                                        deckId={deck.id}
                                        className={`${isActive ? 'ring-4 ring-teal-400/30' : 'group-hover:ring-2 group-hover:ring-purple-500/30'}`}
                                    />

                                    {isActive && (
                                        <div className="absolute top-4 right-4 z-50">
                                            <div className="bg-teal-400 text-black px-3 py-1 rounded-full font-mono text-[7px] uppercase font-bold tracking-widest shadow-glow">Active</div>
                                        </div>
                                    )}

                                    {!isOwned && deck.tierRequirement && deck.tierRequirement !== 'free' && (
                                        <div className="absolute top-4 left-4 z-50">
                                            <div className={`px-3 py-1 rounded-full font-mono text-[7px] uppercase font-bold tracking-widest shadow-glow border ${tierMet ? 'bg-white/10 text-white/60 border-white/20' : 'bg-red-500/20 text-red-400 border-red-500/40'}`}>
                                                {deck.tierRequirement} Required
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions below the card */}
                                <div className="w-full max-w-[280px] mt-6 flex flex-col items-center">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{deck.name}</h3>
                                    {isOwned ? (
                                        <button
                                            onClick={() => setActiveDeck(deck.id)}
                                            disabled={isActive}
                                            className={`w-full py-3 rounded-xl font-bold font-mono text-[9px] uppercase tracking-[0.2em] transition-all border ${isActive
                                                ? 'bg-white/5 text-white/20 border-white/5 cursor-default'
                                                : 'bg-teal-500/10 border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-black shadow-glow'}`}
                                        >
                                            {isActive ? 'SIGNAL_LOCKED' : 'ESTABLISH_LINK'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => purchaseDeck(deck)}
                                            disabled={!canAfford}
                                            className={`w-full py-3 rounded-xl font-bold font-mono text-[9px] uppercase tracking-[0.2em] transition-all border flex items-center justify-center gap-2 ${canAfford
                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-black shadow-glow'
                                                : !tierMet
                                                    ? 'bg-red-500/5 border-red-500/20 text-red-400/40 cursor-not-allowed'
                                                    : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'}`}
                                        >
                                            <SparklesIcon className="w-3 h-3" />
                                            {canAfford
                                                ? `ACQUIRE (${deck.price})`
                                                : !tierMet
                                                    ? `${deck.tierRequirement?.toUpperCase()}_LOCKED`
                                                    : `LOW_ENERGY (${deck.price})`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Bottom CTA Row */}
            <section className="space-y-4 pt-10">
                <header className="flex items-center gap-4">
                    <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">Surge_Repeat</h2>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
                </header>
                <StardustSurgeBar />
            </section>

            <section className="mt-8">
                <CyberpunkAd variant="banner" isPremium={isPremium} />
            </section>

            <footer className="mt-20 text-center glass-panel p-10 rounded-[2rem] border-white/5 bg-white/[0.01]">
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <ZapIcon className="w-3 h-3" /> Data_Transmission_Secured // Nexus_Core_v5.0
                </p>
            </footer>
        </div>
    );
};

export default ShopPage;
