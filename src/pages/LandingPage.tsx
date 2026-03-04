import React, { useEffect, useRef } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { SparklesIcon, ZapIcon, CardsIcon } from '../components/icons';

interface LandingPageProps {
    onInitiate: (mode: 'login' | 'signup') => void;
}

/**
 * useRevealOnScroll — Intersection Observer hook for scroll-triggered
 * fade-in animations. Adds `.revealed` class to elements with `.reveal`.
 */
const useRevealOnScroll = () => {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
};

/**
 * FloatingParticles — Lightweight canvas-based ambient particle effect.
 * Renders gentle purple/teal orbs drifting upward behind the hero.
 */
const FloatingParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const particles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number; color: string }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // @note Seed initial particles
        const colors = ['rgba(168,85,247,', 'rgba(20,184,166,', 'rgba(192,132,252,'];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -(Math.random() * 0.4 + 0.1),
                alpha: Math.random() * 0.5 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                // Wrap particles
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${p.alpha})`;
                ctx.fill();
            });
            animId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
};

const FEATURES = [
    {
        tag: '01_DIVINATION',
        title: 'AI-Enhanced Readings',
        desc: 'Deep-learning interpretations that analyze card combinations, elemental dignities, and numerological harmonics in real-time.',
        icon: '🔮',
    },
    {
        tag: '02_GRIMOIRE',
        title: 'Digital Grimoire',
        desc: 'Every draw is recorded. Track your journey with a searchable journal that links readings, reflections, and evolving patterns.',
        icon: '📖',
    },
    {
        tag: '03_PROGRESSION',
        title: 'RPG Mechanics',
        desc: 'Earn Stardust and XP as you practice. Level up your profile to unlock premium decks, sigils, and customization.',
        icon: '⚡',
    },
    {
        tag: '04_BIRTH_CHART',
        title: 'Cosmic Birth Profile',
        desc: 'Generate a full natal chart with Sabian Symbols, planetary transits, and an AI-narrated Hero\'s Arc unique to your stars.',
        icon: '✨',
    },
];

const STEPS = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up and set your birth data for personalized cosmic alignment.' },
    { num: '02', title: 'Draw Your Cards', desc: 'Choose a spread type and let the AI channel your reading in real-time.' },
    { num: '03', title: 'Receive Insight', desc: 'Get deep narrative interpretations, shadow work analysis, and actionable guidance.' },
    { num: '04', title: 'Track & Evolve', desc: 'Journal your reflections, earn XP, unlock achievements, and watch your patterns emerge.' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onInitiate }) => {
    useRevealOnScroll();

    return (
        <div className="w-screen min-h-screen bg-void text-white overflow-y-auto overflow-x-hidden relative font-sans">
            {/* ============ AMBIENT LAYERS ============ */}
            <FloatingParticles />
            <div className="fixed inset-0 opacity-5 pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-cosmic/20 via-void to-void pointer-events-none z-0"></div>

            {/* ============ NAVIGATION ============ */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 bg-cosmic-glow rounded-full animate-pulse shadow-[0_0_12px_#a855f7]"></span>
                        <span className="font-display font-black tracking-[0.15em] text-xl neon-glow uppercase">SIGAL</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <a href="#features" className="hidden sm:inline text-sm font-mono text-white/50 hover:text-cosmic-glow transition-colors uppercase tracking-widest">
                            Features
                        </a>
                        <a href="#pricing" className="hidden sm:inline text-sm font-mono text-white/50 hover:text-cosmic-glow transition-colors uppercase tracking-widest">
                            Pricing
                        </a>
                        <button
                            onClick={() => onInitiate('login')}
                            className="text-sm font-mono text-white/70 hover:text-cosmic-glow transition-colors uppercase tracking-widest px-4 py-2 border border-white/10 rounded-xl hover:border-cosmic/40 hover:bg-cosmic/5"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* ============ HERO SECTION ============ */}
                <section className="pt-40 pb-32 px-6 flex flex-col items-center text-center relative overflow-hidden">
                    {/* Hero glow orb */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cosmic/15 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cosmic/30 bg-cosmic/10 mb-8 backdrop-blur-md">
                        <SparklesIcon className="w-4 h-4 text-cosmic-glow" />
                        <span className="text-xs font-mono text-cosmic-light tracking-widest uppercase">System v3.0 Online</span>
                    </div>

                    <h1 className="reveal text-5xl sm:text-6xl md:text-8xl font-black font-display tracking-tighter mb-6 leading-[0.95] max-w-5xl mx-auto">
                        Divine Intelligence,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-glow via-purple-300 to-teal-400">
                            Digitally Channeled
                        </span>
                    </h1>

                    <p className="reveal text-lg md:text-xl text-white/50 font-serif max-w-2xl mx-auto mb-12 leading-relaxed">
                        Sigal fuses ancient esoteric traditions with bleeding-edge AI — delivering deep synthesized tarot insights, cosmic birth profiles, and gamified spiritual progression.
                    </p>

                    <div className="reveal flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                        <CyberButton
                            onClick={() => onInitiate('signup')}
                            variant="primary"
                            className="flex-1 py-4 text-lg"
                        >
                            BEGIN_TRANSMISSION
                        </CyberButton>
                        <a
                            href="#features"
                            className="flex-1 py-4 text-lg font-mono uppercase tracking-widest text-center border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                        >
                            Explore
                        </a>
                    </div>

                    {/* Floating card preview */}
                    <div className="reveal mt-20 perspective-[1200px]">
                        <div className="w-52 h-80 transform rotate-y-[-8deg] rotate-x-[6deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-all duration-700 ease-out mx-auto">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cosmic/30 via-void-light to-hologram/10 border border-white/15 flex flex-col items-center justify-center p-6 shadow-[0_0_80px_rgba(168,85,247,0.25),0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-cosmic/10 to-transparent"></div>
                                <CardsIcon className="w-16 h-16 text-cosmic-glow opacity-40 mb-4 relative z-10" />
                                <div className="text-center font-display font-bold text-xl tracking-widest text-white neon-glow relative z-10">THE FOOL</div>
                                <div className="text-[10px] font-mono text-white/30 mt-2 tracking-widest relative z-10">0 — NEW BEGINNINGS</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ FEATURES SECTION ============ */}
                <section id="features" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="reveal text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Core Modules</h2>
                            <p className="reveal text-white/40 font-mono text-sm uppercase tracking-widest">Advanced tools for the modern mystic</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {FEATURES.map((feat, i) => (
                                <div
                                    key={i}
                                    className="reveal group"
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                >
                                    <GlassPanel className="p-8 h-full border-white/5 hover:border-cosmic/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                                        <div className="flex items-start gap-5">
                                            <div className="text-3xl">{feat.icon}</div>
                                            <div>
                                                <div className="text-[10px] font-mono text-cosmic tracking-[0.2em] mb-2 uppercase">{feat.tag}</div>
                                                <h3 className="text-xl font-display font-bold mb-2">{feat.title}</h3>
                                                <p className="text-white/50 font-serif leading-relaxed text-sm">{feat.desc}</p>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============ HOW IT WORKS ============ */}
                <section className="py-32 px-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic/5 to-transparent pointer-events-none"></div>
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="reveal text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">How It Works</h2>
                            <p className="reveal text-white/40 font-mono text-sm uppercase tracking-widest">Four steps to cosmic alignment</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {STEPS.map((step, i) => (
                                <div
                                    key={i}
                                    className="reveal text-center"
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cosmic/10 border border-cosmic/20 flex items-center justify-center text-2xl font-display font-black text-cosmic-glow">
                                        {step.num}
                                    </div>
                                    <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-white/40 text-sm font-serif leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============ SHOWCASE PANEL ============ */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <GlassPanel className="reveal p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden border-cosmic/20 relative">
                            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cosmic/10 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="flex-1 space-y-6 relative z-10">
                                <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tighter">
                                    Holographic <span className="text-cosmic-glow">Archetypes</span>
                                </h2>
                                <p className="text-white/50 font-serif leading-relaxed">
                                    Experience daily draws through physics-based interactive cards that react to your device. The Arcana isn't just read — it's felt. Each card pulses with cosmic data unique to your journey.
                                </p>
                                <ul className="space-y-4 pt-4">
                                    {['Daily Neural Alignment', 'AI Pattern Recognition', 'Gamified Sync Rate', 'Shadow Work Analysis'].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 font-mono text-sm text-white/80">
                                            <ZapIcon className="w-4 h-4 text-hologram" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="grid grid-cols-2 gap-4">
                                    {['THE MAGICIAN', 'HIGH PRIESTESS', 'THE EMPRESS', 'THE EMPEROR'].map((name, i) => (
                                        <div
                                            key={i}
                                            className="w-28 h-40 rounded-xl bg-gradient-to-br from-cosmic/20 to-void-lighter border border-white/10 flex flex-col items-center justify-center p-3 hover:border-cosmic/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 hover:-translate-y-1"
                                            style={{ animationDelay: `${i * 200}ms` }}
                                        >
                                            <CardsIcon className="w-8 h-8 text-cosmic-glow/50 mb-2" />
                                            <div className="text-[8px] font-mono text-white/60 text-center tracking-wider">{name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                </section>

                {/* ============ PRICING SECTION ============ */}
                <section className="py-32 px-6" id="pricing">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="reveal text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">Choose Your Protocol</h2>
                            <p className="reveal text-white/40 font-mono text-sm uppercase tracking-widest">Elevate your consciousness</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Free Tier */}
                            <div className="reveal bg-void-lighter border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-white/20 hover:-translate-y-1 duration-500">
                                <h3 className="text-2xl font-display font-bold mb-2">Initiate</h3>
                                <div className="text-4xl font-black font-display mb-6">Free</div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> Standard AI Interpretations</li>
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> Basic Journaling</li>
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> 3-Card Spreads</li>
                                </ul>
                                <CyberButton onClick={() => onInitiate('signup')} variant="secondary" className="w-full">Start Free</CyberButton>
                            </div>

                            {/* Seeker Tier */}
                            <div className="reveal bg-void border-2 border-cosmic rounded-2xl p-8 flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-[0_0_60px_rgba(168,85,247,0.15)]" style={{ transitionDelay: '80ms' }}>
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cosmic-glow via-purple-300 to-teal-400"></div>
                                <div className="absolute top-4 right-4 bg-cosmic/20 text-cosmic-light border border-cosmic/50 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold">
                                    Recommended
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-2 text-cosmic-light">Seeker</h3>
                                <div className="text-4xl font-black font-display mb-2">$4.99<span className="text-sm font-normal text-white/40">/mo</span></div>
                                <p className="text-xs font-mono text-white/30 mb-6">For dedicated practitioners.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-2 text-sm text-white"><span className="text-hologram">✓</span> Advanced AI Interpretations</li>
                                    <li className="flex items-center gap-2 text-sm text-white"><span className="text-hologram">✓</span> Unrestricted Spreads</li>
                                    <li className="flex items-center gap-2 text-sm text-white"><span className="text-hologram">✓</span> Shadow Work Analysis</li>
                                    <li className="flex items-center gap-2 text-sm text-white"><span className="text-hologram">✓</span> Save Unlimited Readings</li>
                                </ul>
                                <CyberButton onClick={() => onInitiate('signup')} variant="primary" className="w-full">Upgrade to Seeker</CyberButton>
                            </div>

                            {/* Oracle Tier */}
                            <div className="reveal bg-void-lighter border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-white/20 hover:-translate-y-1 duration-500" style={{ transitionDelay: '160ms' }}>
                                <h3 className="text-2xl font-display font-bold mb-2">Oracle</h3>
                                <div className="text-4xl font-black font-display mb-2">$9.99<span className="text-sm font-normal text-white/40">/mo</span></div>
                                <p className="text-xs font-mono text-white/30 mb-6">The ultimate divination setup.</p>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> Everything in Seeker</li>
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> GPT-4o / Pro AI Processing</li>
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> Vision Sigil Generation</li>
                                    <li className="flex items-center gap-2 text-sm text-white/60"><span className="text-cosmic">✓</span> Priority Support</li>
                                </ul>
                                <CyberButton onClick={() => onInitiate('signup')} variant="secondary" className="w-full">Become Oracular</CyberButton>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ FINAL CTA ============ */}
                <section className="py-32 px-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmic/10 to-transparent pointer-events-none"></div>
                    <div className="max-w-3xl mx-auto text-center relative z-10">
                        <h2 className="reveal text-4xl md:text-6xl font-display font-black tracking-tighter mb-6">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-glow to-hologram">Decode Your Destiny</span>?
                        </h2>
                        <p className="reveal text-white/40 font-serif text-lg mb-10 leading-relaxed">
                            Join thousands of seekers already using Sigal to navigate the digital ether with cosmic precision.
                        </p>
                        <div className="reveal">
                            <CyberButton
                                onClick={() => onInitiate('signup')}
                                variant="primary"
                                className="px-12 py-5 text-lg"
                            >
                                INITIATE_LINK NOW
                            </CyberButton>
                        </div>
                    </div>
                </section>
            </main>

            {/* ============ FOOTER ============ */}
            <footer className="border-t border-white/5 py-12 bg-void z-10 relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-cosmic rounded-full"></span>
                        <span className="font-display font-bold tracking-widest text-sm uppercase">SIGAL</span>
                    </div>
                    <div className="flex gap-8 text-sm font-mono text-white/30">
                        <a href="#features" className="hover:text-cosmic-glow transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-cosmic-glow transition-colors">Pricing</a>
                    </div>
                    <p className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} Sigal. System Offline when Unobserved.
                    </p>
                </div>
            </footer>

            {/* ============ SCROLL REVEAL STYLES ============ */}
            <style>{`
                .reveal {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
