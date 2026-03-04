import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SparklesIcon, ZapIcon, CrownIcon } from '../components/icons';
import { createCheckoutSession } from '../services/stripeService';
import CyberpunkAd from '../components/ui/CyberpunkAd';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  tier: 'free' | 'seeker' | 'oracle';
}

const tiers: PricingTier[] = [
  {
    name: 'Initiate',
    price: '$0',
    period: 'forever',
    description: 'For casual observers',
    tier: 'free',
    cta: 'Current Plan',
    features: [
      '1 Daily Card Draw',
      '3 Spreads per type',
      'Short insights only',
      'Standard decks',
      'Ads supported'
    ]
  },
  {
    name: 'Seeker',
    price: '$8.99',
    period: 'per month',
    description: 'For serious practitioners',
    tier: 'seeker',
    cta: 'Subscribe Now',
    highlighted: true,
    features: [
      'Unlimited readings',
      'Full AI analysis',
      'Journal pattern matching',
      'Premium decks access',
      'Ad-free experience',
      '2x Stardust on purchases'
    ]
  },
  {
    name: 'Oracle',
    price: '$14.99',
    period: 'per month',
    description: 'For the fully awakened',
    tier: 'oracle',
    cta: 'Ascend Now',
    features: [
      'Everything in Seeker',
      'Live Oracle AI support',
      'Priority generation',
      'Exclusive "Void" deck',
      'Early feature access',
      '3x Stardust on purchases'
    ]
  }
];

const PricingPage: React.FC = () => {
  const { activeProfile, setPage, isPremium } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.tier === 'free') {
      return;
    }

    setIsProcessing(true);
    try {
      await createCheckoutSession('subscription', tier.tier);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(`Failed to start checkout: ${errorMessage}`);
      setIsProcessing(false);
    }
  };

  const currentTier = activeProfile?.subscriptionTier || 'free';

  return (
    <div className="w-full h-full p-6 md:p-14 flex flex-col animate-fade-in overflow-y-auto scroll-smooth">
      <header className="mb-12 flex-shrink-0 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] font-bold">Access_Tiers_v2.5</span>
        </div>
        <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow mb-4">
          Choose Your Connection
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto">
          Select the bandwidth that matches your divination needs. Upgrade or downgrade anytime.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {tiers.map((tier) => {
          const isCurrent = currentTier === tier.tier;

          return (
            <div
              key={tier.tier}
              className={`glass-panel p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 ${tier.highlighted
                ? 'border-purple-500/40 bg-purple-500/[0.03] transform scale-105'
                : 'hover:border-purple-500/20'
                }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
                  Recommended
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {tier.tier === 'free' && <SparklesIcon className="w-5 h-5 text-white/40" />}
                  {tier.tier === 'seeker' && <ZapIcon className="w-5 h-5 text-purple-400" />}
                  {tier.tier === 'oracle' && <CrownIcon className="w-5 h-5 text-amber-400" />}
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">
                    {tier.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-white tracking-tight">{tier.price}</span>
                  <span className="text-sm text-white/30 font-mono">/{tier.period}</span>
                </div>

                <p className="text-sm text-white/40">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="text-purple-400 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier)}
                disabled={isCurrent || isProcessing}
                className={`w-full py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest transition-all ${isCurrent || isProcessing
                  ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                  : tier.highlighted
                    ? 'bg-purple-600 border border-purple-500 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                    : 'bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white'
                  }`}
              >
                {isProcessing ? 'Processing...' : isCurrent ? 'Current Plan' : tier.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto">
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
          <h3 className="text-xl font-bold text-white mb-3">Need more Stardust?</h3>
          <p className="text-sm text-white/40 mb-6">
            Purchase one-time Stardust packs to unlock decks and features instantly.
          </p>
          <button
            onClick={() => setPage('Shop')}
            className="px-8 py-3 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all font-mono text-xs uppercase tracking-widest"
          >
            View Stardust Packs
          </button>
        </div>
      </div>

      <div className="mt-20">
        <CyberpunkAd variant="banner" isPremium={isPremium} />
      </div>
    </div>
  );
};

export default PricingPage;
