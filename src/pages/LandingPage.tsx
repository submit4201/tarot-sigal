import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { SparklesIcon, ZapIcon, CardsIcon, HomeIcon } from '../components/icons';
// We'll import a HoloCard for a teaser effect later if needed

interface LandingPageProps {
    onInitiate: (mode: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onInitiate }) => {
    return (
        <div className="w-screen min-h-screen bg-void text-white overflow-x-hidden relative font-sans">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid opacity-5 pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-cosmic/20 via-void to-void pointer-events-none z-0"></div>
            <div className="noise-bg opacity-40 z-0"></div>

            {/* Navigation */}
            <nav className="relative z-50 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cosmic-glow rounded-full animate-pulse shadow-[0_0_10px_#a855f7]"></span>
                    <span className="font-display font-bold tracking-widest text-xl neon-glow">GRIDPUNK ARCANA</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => onInitiate('login')} className="text-sm font-mono text-white/70 hover:text-cosmic-glow transition-colors uppercase tracking-widest leading-none">
                        [ Login ]
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
                {/* Hero Section */}
                <section className="pt-24 pb-32 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cosmic/30 bg-cosmic/10 mb-8 backdrop-blur-md">
                        <SparklesIcon className="w-4 h-4 text-cosmic-glow" />
                        <span className="text-xs font-mono text-cosmic-light tracking-widest uppercase">System v3.0 Online</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-6 leading-tight max-w-4xl mx-auto">
                        Decrypt the Universe with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-glow to-teal-400">Cyber-Divination</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 font-serif max-w-2xl mx-auto mb-10 leading-relaxed">
                        Gridpunk Arcana fuses ancient esoteric traditions with bleeding-edge AI to provide deep synthesized insights, holographic tarot, and gamified spiritual progression.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto">
                        <CyberButton
                            onClick={() => onInitiate('signup')}
                            variant="primary"
                            className="flex-1 py-4 text-lg"
                        >
                            INITIATE_LINK
                        </CyberButton>
                    </div>
                </section>

                {/* 3D Teaser Section */}
                <section className="mb-32 relative">
                    <GlassPanel className="p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden border-cosmic/30">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">Holographic Archetypes</h2>
                            <p className="text-white/60 font-serif leading-relaxed">
                                Experience your daily draws through physics-based, interactive 3D holographic cards that react to your device. The Arcana isn't just read; it's felt.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {['Daily Neural Alignment', 'AI Pattern Recognition', 'Gamified Sync Rate'].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 font-mono text-sm text-white/80">
                                        <ZapIcon className="w-4 h-4 text-cosmic" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 flex justify-center perspective-[1000px]">
                            <div className="w-48 h-72 transform rotate-y-[-15deg] rotate-x-[10deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-all duration-700 ease-out z-10">
                                {/* Static preview block instead of full physics for landing to avoid overhead, or use an image */}
                                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cosmic/40 to-void border border-white/20 flex flex-col items-center justify-center p-4 shadow-[0_0_50px_rgba(168,85,247,0.3)] backdrop-blur-sm">
                                    <CardsIcon className="w-16 h-16 text-cosmic-glow opacity-50 mb-4" />
                                    <div className="text-center font-display font-bold text-xl tracking-widest text-white neon-glow">THE FOOL</div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </section>

                {/* Pricing Section */}
                <section className="mb-24" id="pricing">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Choose Your Protocol</h2>
                        <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Elevate your consciousness</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Tier */}
                        <div className="bg-void-lighter border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-white/30">
                            <h3 className="text-2xl font-display font-bold mb-2">Initiate</h3>
                            <div className="text-3xl font-black font-display mb-6">Free</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> Standard AI Interpretations</li>
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> Basic Journaling</li>
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> 3-Card Spreads</li>
                            </ul>
                            <CyberButton onClick={() => onInitiate('signup')} variant="secondary" className="w-full">Start Free</CyberButton>
                        </div>

                        {/* Seeker Tier (Premium) */}
                        <div className="bg-void border border-cosmic rounded-2xl p-8 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cosmic-glow to-teal-400"></div>
                            <div className="absolute top-4 right-4 bg-cosmic/20 text-cosmic-light border border-cosmic/50 text-[10px] uppercase tracking-widest px-2 py-1 rounded-full font-bold">Recommended</div>

                            <h3 className="text-2xl font-display font-bold mb-2 text-cosmic-light">Seeker</h3>
                            <div className="text-3xl font-black font-display mb-2">$4.99<span className="text-sm font-normal text-white/50">/mo</span></div>
                            <p className="text-xs font-mono text-white/40 mb-6">For dedicated practitioners.</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm text-white"><span className="text-teal-400">✓</span> Advanced AI Interpretations</li>
                                <li className="flex items-center gap-2 text-sm text-white"><span className="text-teal-400">✓</span> Unrestricted Spreads</li>
                                <li className="flex items-center gap-2 text-sm text-white"><span className="text-teal-400">✓</span> Shadow Work Analysis</li>
                                <li className="flex items-center gap-2 text-sm text-white"><span className="text-teal-400">✓</span> Save Unlimited Readings</li>
                            </ul>
                            <CyberButton onClick={() => onInitiate('signup')} variant="primary" className="w-full">Upgrade to Seeker</CyberButton>
                        </div>

                        {/* Oracle Tier */}
                        <div className="bg-void-lighter border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-white/30">
                            <h3 className="text-2xl font-display font-bold mb-2">Oracle</h3>
                            <div className="text-3xl font-black font-display mb-2">$9.99<span className="text-sm font-normal text-white/50">/mo</span></div>
                            <p className="text-xs font-mono text-white/40 mb-6">The ultimate divination setup.</p>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> Everything in Seeker</li>
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> GPT-4o / Pro AI Processing</li>
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> Vision Sigil Generation (Costly)</li>
                                <li className="flex items-center gap-2 text-sm text-white/70"><span className="text-cosmic">✓</span> Priority Support</li>
                            </ul>
                            <CyberButton onClick={() => onInitiate('signup')} variant="secondary" className="w-full">Become Oracular</CyberButton>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center bg-void z-10 relative">
                <p className="text-xs font-mono text-white/30 uppercase tracking-[0.2em]">© {new Date().getFullYear()} Gridpunk Arcana. System Offline when Unobserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
