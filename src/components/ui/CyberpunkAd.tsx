import React, { useState, useEffect } from 'react';
import { SparklesIcon, ZapIcon, WifiIcon, ActivityIcon, TerminalIcon, XIcon } from '../icons';
import AdSense from '../AdSense';

interface AdContent {
    company: string;
    tagline: string;
    cta: string;
    icon: React.ReactNode;
    color: string;
    slotId?: string;
}

const ADS: AdContent[] = [
    {
        company: "AETHER_CORP",
        tagline: "DON'T SETTLE FOR STATIC. ACCESS THE VOID.",
        cta: "UPGRADE TO ORACLE",
        icon: <SparklesIcon className="w-4 h-4" />,
        color: "text-amber-500",
        slotId: "AD_SLOT_ORACLE"
    },
    {
        company: "NEURAL_LINK",
        tagline: "BYPASS THE LIMITS. REAL-TIME DIVINATION.",
        cta: "SEEKER ACCESS NOW",
        icon: <ZapIcon className="w-4 h-4" />,
        color: "text-purple-500",
        slotId: "AD_SLOT_SEEKER"
    },
    {
        company: "GRID_PULSE",
        tagline: "HIGH-BANDWIDTH DESTINY TRACKING.",
        cta: "SYNC YOUR SIGNAL",
        icon: <ActivityIcon className="w-4 h-4" />,
        color: "text-teal-500",
        slotId: "AD_SLOT_SIGNAL"
    },
    {
        company: "BIO_SYNTH",
        tagline: "OPTIMIZE YOUR KARMIC THROUGHPUT.",
        cta: "ASCEND TODAY",
        icon: <WifiIcon className="w-4 h-4" />,
        color: "text-blue-500",
        slotId: "AD_SLOT_ASCEND"
    }
];

interface CyberpunkAdProps {
    variant?: 'sidebar' | 'banner' | 'inline' | 'modal';
    className?: string;
    isPremium?: boolean;
    isVisible?: boolean; // For modal variant
    onClose?: () => void; // For modal variant
}

const CyberpunkAd: React.FC<CyberpunkAdProps> = ({
    variant = 'inline',
    className = '',
    isPremium = false,
    isVisible = false,
    onClose
}) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canClose, setCanClose] = useState(false);

    // Choose a random ad once per mount
    const [ad] = useState(() => ADS[Math.floor(Math.random() * ADS.length)]);

    useEffect(() => {
        if (variant !== 'modal' || !isVisible) return;

        setTimeLeft(5);
        setCanClose(false);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanClose(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isVisible, variant]);

    // Hide completely for premium users
    if (isPremium) return null;

    const handleCtaClick = () => {
        window.location.hash = '#profile';
    };

    if (variant === 'modal') {
        if (!isVisible) return null;
        return (
            <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${className}`}>
                {/* Backdrop with Glitch Effect */}
                <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in" />

                {/* Binary Stream Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none font-mono text-[10px] text-cyan-500 flex flex-wrap gap-1 p-2 overflow-hidden">
                    {Array.from({ length: 500 }).map((_, i) => (
                        <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 10}ms` }}>
                            {Math.random() > 0.5 ? '1' : '0'}
                        </span>
                    ))}
                </div>

                {/* Ad Container */}
                <div className="relative w-full max-w-2xl border border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center p-8 m-4 rounded-lg overflow-hidden animate-scale-in">
                    {/* Scanner Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 shadow-[0_0_15px_#06b6d4] animate-scan"
                        style={{ animation: 'scan 4s linear infinite' }} />

                    {/* Corporate Branding */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 animate-ping" />
                        <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em] uppercase opacity-50">Priority Data Stream</span>
                    </div>

                    {/* Close Button */}
                    {canClose && onClose ? (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-cyan-400 hover:text-white hover:bg-cyan-500/20 rounded transition-all active:scale-95 z-50"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <div className="absolute top-4 right-4 font-mono text-cyan-400 text-[10px] tracking-widest bg-cyan-500/10 px-3 py-1 border border-cyan-500/20 rounded-full">
                            SECURE_CHANNEL: {timeLeft}s
                        </div>
                    )}

                    {/* Ad Content */}
                    <div className="w-full flex flex-col items-center justify-center text-center gap-6 mt-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${ad.color} shadow-glow-sm`}>
                                {React.cloneElement(ad.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                            </div>
                            <h2 className={`text-2xl font-black ${ad.color} tracking-tighter uppercase italic`}>
                                {ad.company} <span className="text-white">Uplink</span>
                            </h2>
                        </div>

                        <p className="max-w-md text-white/70 font-mono text-[11px] leading-relaxed uppercase tracking-wider">
                            {ad.tagline}
                        </p>

                        {/* Real AdSense Slot */}
                        <div className="w-full max-w-md min-h-[250px] border border-white/5 bg-black/40 rounded-xl overflow-hidden shadow-inner flex items-center justify-center relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none">
                                <TerminalIcon className="w-12 h-12 mb-2" />
                                <span className="text-[10px] font-mono">ENCRYPTED_AD_NODE</span>
                            </div>
                            <AdSense slot={ad.slotId || ''} format="rectangle" />
                        </div>

                        <button
                            onClick={handleCtaClick}
                            className="w-full max-w-sm py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] transform -skew-x-12 hover:bg-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)] active:translate-y-1"
                        >
                            Process Upgrade
                        </button>
                    </div>

                    {/* Decoration */}
                    <div className="absolute bottom-4 right-4 text-[8px] font-mono text-white/10 italic">
                        PROTOCOL_TX: {Math.random().toString(16).substring(2, 10).toUpperCase()}
                    </div>
                </div>

                <style>{`
                    @keyframes scan {
                        0% { top: 0; }
                        100% { top: 100%; }
                    }
                    .animate-scale-in {
                        animation: scale-in 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    }
                    @keyframes scale-in {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>
            </div>
        );
    }

    if (variant === 'sidebar') {
        return (
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-all ${className}`}>
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                    {React.cloneElement(ad.icon as React.ReactElement<{ className?: string }>, {
                        className: `${(ad.icon as React.ReactElement<{ className?: string }>).props.className || ''} ${ad.color}`
                    })}
                </div>
                <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2 font-bold">SPONSORED_UPLINK</div>

                {/* Real Ad Integration */}
                <div className="mb-4 min-h-[100px] border border-white/5 rounded-lg overflow-hidden bg-black/20">
                    <AdSense slot={ad.slotId || ''} format="rectangle" />
                </div>

                <div className={`text-[10px] font-mono ${ad.color} mb-1 font-bold`}>{ad.company}</div>
                <div className="text-xs font-dm-sans text-white/70 mb-4 tracking-tight leading-tight uppercase font-medium">{ad.tagline}</div>
                <button
                    onClick={handleCtaClick}
                    className="w-full py-2 bg-gradient-to-r from-purple-600/10 to-purple-500/5 border border-purple-500/30 text-purple-400 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-glow-sm flex items-center justify-center gap-2"
                >
                    <TerminalIcon className="w-3 h-3" />
                    {ad.cta}
                </button>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className={`w-full max-w-5xl mx-auto p-6 glass-panel rounded-3xl border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-purple-500/30 transition-all relative overflow-hidden ${className}`}>
                <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${ad.color}`}>
                        {React.cloneElement(ad.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                    <div className="flex flex-col flex-grow">
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mb-1 font-bold">COMMERCIAL_BANDWIDTH</div>
                        <div className="text-base font-bold text-white tracking-tight uppercase">{ad.company}: <span className="text-white/60">{ad.tagline}</span></div>
                    </div>
                </div>

                {/* Real Ad Integration */}
                <div className="flex-grow max-w-md w-full relative z-10 mx-4 border border-white/5 rounded-xl bg-black/20 overflow-hidden min-h-[60px]">
                    <AdSense slot={ad.slotId || ''} format="horizontal" />
                </div>

                <button
                    onClick={handleCtaClick}
                    className="whitespace-nowrap px-8 py-3 rounded-xl bg-purple-600 border border-purple-500 text-white font-mono text-[10px] uppercase tracking-widest hover:bg-purple-500 transition-all shadow-glow relative z-10 flex items-center gap-2"
                >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    {ad.cta}
                </button>
            </div>
        );
    }

    return (
        <div className={`w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-4 group hover:bg-white/10 transition-all ${className}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`${ad.color} opacity-50 group-hover:opacity-100 transition-opacity`}>
                        {ad.icon}
                    </div>
                    <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider">{ad.tagline}</div>
                </div>
                <button
                    onClick={handleCtaClick}
                    className="text-[9px] font-mono text-purple-400 uppercase tracking-widest border-b border-purple-500/30 hover:text-white hover:border-purple-500 transition-all"
                >
                    {ad.cta}
                </button>
            </div>

            {/* Real Ad Integration */}
            <div className="border border-white/5 rounded-xl bg-black/20 overflow-hidden min-h-[50px]">
                <AdSense slot={ad.slotId || ''} format="fluid" />
            </div>
        </div>
    );
};

export default CyberpunkAd;
