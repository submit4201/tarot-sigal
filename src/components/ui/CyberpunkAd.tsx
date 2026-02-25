import React from 'react';
import { SparklesIcon, ZapIcon, WifiIcon, ActivityIcon, TerminalIcon } from '../icons';

interface AdContent {
    company: string;
    tagline: string;
    cta: string;
    icon: React.ReactNode;
    color: string;
}

const ADS: AdContent[] = [
    {
        company: "AETHER_CORP",
        tagline: "DON'T SETTLE FOR STATIC. ACCESS THE VOID.",
        cta: "UPGRADE TO ORACLE",
        icon: <SparklesIcon className="w-4 h-4" />,
        color: "text-amber-500"
    },
    {
        company: "NEURAL_LINK",
        tagline: "BYPASS THE LIMITS. REAL-TIME DIVINATION.",
        cta: "SEEKER ACCESS NOW",
        icon: <ZapIcon className="w-4 h-4" />,
        color: "text-purple-500"
    },
    {
        company: "GRID_PULSE",
        tagline: "HIGH-BANDWIDTH DESTINY TRACKING.",
        cta: "SYNC YOUR SIGNAL",
        icon: <ActivityIcon className="w-4 h-4" />,
        color: "text-teal-500"
    },
    {
        company: "BIO_SYNTH",
        tagline: "OPTIMIZE YOUR KARMIC THROUGHPUT.",
        cta: "ASCEND TODAY",
        icon: <WifiIcon className="w-4 h-4" />,
        color: "text-blue-500"
    }
];

interface CyberpunkAdProps {
    variant?: 'sidebar' | 'banner' | 'inline';
    className?: string;
}

const CyberpunkAd: React.FC<CyberpunkAdProps> = ({ variant = 'inline', className = '' }) => {
    // Use a stable random index based on some simple logic or just random for now
    const ad = ADS[Math.floor(Math.random() * ADS.length)];

    const handleCtaClick = () => {
        window.location.hash = '#pricing';
    };

    if (variant === 'sidebar') {
        return (
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black/40 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-all ${className}`}>
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                    {React.cloneElement(ad.icon as React.ReactElement<{ className?: string }>, {
                        className: `${(ad.icon as React.ReactElement<{ className?: string }>).props.className || ''} ${ad.color}`
                    })}
                </div>
                <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2 font-bold">SPONSORED_UPLINK</div>
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
                <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${ad.color}`}>
                        {React.cloneElement(ad.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.4em] mb-1 font-bold">COMMERCIAL_BANDWIDTH</div>
                        <div className="text-base font-bold text-white tracking-tight uppercase">{ad.company}: <span className="text-white/60">{ad.tagline}</span></div>
                    </div>
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
        <div className={`w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4 group hover:bg-white/10 transition-all ${className}`}>
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
    );
};

export default CyberpunkAd;
