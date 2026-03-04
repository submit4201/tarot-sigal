import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ZapIcon } from '../components/icons';
import { createCheckoutSession } from '../services/stripeService';
import CyberpunkAd from '../components/ui/CyberpunkAd';
import { DeckShowcase } from '../components/shop/DeckShowcase';
import { DeckPreviewModal } from '../components/shop/DeckPreviewModal';

/**
 * ShopPage — Restructured premium marketplace.
 * Features an immersive 3D DeckShowcase carousel and Stardust purchasing CTAs.
 */
const ShopPage: React.FC = () => {
    const { activeProfile, purchaseDeck, decks, activeDeckId, setActiveDeck, isPremium, hasRequiredTier } = useApp();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [previewDeckId, setPreviewDeckId] = useState<string | null>(null);

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
        <div className="flex flex-nowrap md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar relative z-20">
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
        <div className="relative w-full h-full p-6 md:px-14 md:py-10 flex flex-col animate-fade-in overflow-y-auto scroll-smooth gap-12">

            {/* Header section with Balance */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10 pt-4">
                <div className="max-w-2xl text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.5em] font-bold">Nexus_Exchange_v6.0 // IMMERSIVE_MODE</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Marketplace</h1>
                </div>
                <div className="flex items-center gap-4 relative z-20">
                    <div className="text-right">
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold mb-1">Energy_Balance</p>
                        <p className="text-3xl font-bold text-teal-400 flex items-center justify-end gap-2 font-dm-sans">
                            <ZapIcon className="w-6 h-6 animate-pulse" />
                            {stardust}
                        </p>
                    </div>
                </div>
            </header>

            {/* Immersive Deck Marketplace */}
            <section className="-mx-6 md:-mx-14 relative z-0 mt-4 md:mt-2">
                <DeckShowcase
                    decks={decks}
                    ownedDeckIds={ownedDeckIds}
                    activeDeckId={activeDeckId || decks[0]?.id}
                    stardust={stardust}
                    hasRequiredTier={hasRequiredTier}
                    onPurchase={purchaseDeck}
                    onSetActive={setActiveDeck}
                    onPreviewDraw={(id) => setPreviewDeckId(id)}
                />
            </section>

            {/* Bottom CTA Row (Stardust) */}
            <section className="space-y-4 mt-12 relative z-20">
                <header className="flex items-center gap-4">
                    <h2 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold">Surge_Energy</h2>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
                </header>
                <StardustSurgeBar />
            </section>

            <section className="mt-8 relative z-20">
                <CyberpunkAd variant="banner" isPremium={isPremium} />
            </section>

            <footer className="mt-10 text-center p-10 relative z-20 mb-20">
                <p className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <ZapIcon className="w-3 h-3" /> Data_Transmission_Secured // Nexus_Core_v6.0
                </p>
            </footer>

            {/* Sample Pack Preview Modal */}
            <DeckPreviewModal
                isOpen={!!previewDeckId}
                onClose={() => setPreviewDeckId(null)}
                deckId={previewDeckId}
                decks={decks}
            />
        </div>
    );
};

export default ShopPage;
