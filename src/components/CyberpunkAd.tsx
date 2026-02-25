import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface CyberpunkAdProps {
    onClose: () => void;
    isVisible: boolean;
}

/**
 * CyberpunkAd
 * A high-impact, immersive "ad break" for free tier users.
 * Mimics a data-stream interruption or a "corporate priority broadcast".
 */
const CyberpunkAd: React.FC<CyberpunkAdProps> = ({ onClose, isVisible }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canClose, setCanClose] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

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
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Backdrop with Glitch Effect */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

            {/* Binary Stream Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none select-none font-mono text-[10px] text-cyan-500 flex flex-wrap gap-1 p-2 overflow-hidden">
                {Array.from({ length: 500 }).map((_, i) => (
                    <span key={i}>{Math.random() > 0.5 ? '1' : '0'}</span>
                ))}
            </div>

            {/* Ad Container */}
            <div className="relative w-full max-w-2xl h-[400px] border border-cyan-500/30 bg-black shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center p-8 m-4">
                {/* Scanner Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/50 animate-pulse-fast shadow-[0_0_15px_#06b6d4]"
                    style={{ animation: 'scan 3s linear infinite' }} />

                {/* Corporate Branding */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 animate-ping" />
                    <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em] uppercase">Priority Data Stream</span>
                </div>

                {/* Close Button */}
                {canClose ? (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-cyan-400 hover:text-white hover:bg-cyan-500/20 rounded transition-all active:scale-95"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="absolute top-4 right-4 font-mono text-cyan-400 text-sm">
                        SECURE IN: {timeLeft}s
                    </div>
                )}

                {/* Ad Content Placeholder / Google AdSense */}
                <div className="w-full flex-grow flex flex-col items-center justify-center text-center gap-6">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Neuro-Link <span className="text-cyan-400">Enhancement</span>
                    </h2>

                    <p className="max-w-md text-cyan-300/70 font-mono text-xs leading-relaxed uppercase">
                        Experience pure arcana without corporate interruptions.
                        Upgrade to <span className="text-amber-400 font-bold underline">ORACLE TIER</span> for 99.9% uptime and zero-latency readings.
                    </p>

                    <button
                        onClick={() => window.open('/upgrade', '_blank')}
                        className="px-8 py-3 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] transform -skew-x-12 hover:bg-white transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    >
                        Jack In Now
                    </button>

                    {/* Placeholder for real AdSense container */}
                    <div id="ad-container" className="mt-4 w-[320px] h-[50px] border border-dashed border-white/10 flex items-center justify-center">
                        <span className="text-[10px] text-white/20 font-mono italic">AD-NET NODE #420-69</span>
                    </div>
                </div>

                {/* Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-pulse-fast {
                    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default CyberpunkAd;
