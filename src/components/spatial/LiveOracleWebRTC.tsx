import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveOracleProps {
    spreadComplete: boolean;
    isActive: boolean;
    onToggle: (active: boolean) => void;
    audioIntensity: number;
    userTier?: 'seeker' | 'initiate' | 'oracle';
}

export const LiveOracleWebRTC: React.FC<LiveOracleProps> = ({ spreadComplete, isActive, onToggle, audioIntensity, userTier = 'oracle' }) => {
    const [connectionState, setConnectionState] = useState<'idle' | 'connecting' | 'connected'>('idle');

    useEffect(() => {
        if (!isActive) {
            setConnectionState('idle');
            return;
        }
        if (isActive && connectionState === 'idle') {
            setConnectionState('connecting');
            // Simulate WebRTC connection latency
            const timer = setTimeout(() => {
                setConnectionState('connected');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isActive, connectionState]);

    if (!spreadComplete) return null;

    if (userTier !== 'oracle') {
        // Fallback for lower tiers: No WebRTC Live session available
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur border border-white/10 rounded-full py-2 px-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
            >
                {isActive ? (
                    connectionState === 'connecting' ? (
                        <>
                            <div className="w-3 h-3 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                            <span className="text-sm font-semibold text-amber-500/80 animate-pulse">
                                Initializing WebRTC...
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-1 items-center h-4 w-6">
                                <motion.div
                                    className="w-1 bg-[#d4af37]"
                                    animate={{ height: `${20 + audioIntensity * 80}%` }}
                                    transition={{ type: 'tween', duration: 0.1 }}
                                />
                                <motion.div
                                    className="w-1 bg-[#d4af37]"
                                    animate={{ height: `${40 + audioIntensity * 60}%` }}
                                    transition={{ type: 'tween', duration: 0.15 }}
                                />
                                <motion.div
                                    className="w-1 bg-[#d4af37]"
                                    animate={{ height: `${30 + audioIntensity * 70}%` }}
                                    transition={{ type: 'tween', duration: 0.12 }}
                                />
                            </div>
                            <span className="text-sm font-semibold text-[#d4af37] animate-pulse">
                                Oracle is speaking...
                            </span>
                            <button
                                onClick={() => {
                                    onToggle(false);
                                }}
                                className="ml-4 w-8 h-8 rounded-full bg-red-900/50 hover:bg-red-800 border border-red-500/30 flex items-center justify-center transition-colors"
                            >
                                <span className="text-xs">⏹</span>
                            </button>
                        </>
                    )
                ) : (
                    <>
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-sm text-white/80 font-medium">Ready for Oracle Session</span>
                        <button
                            onClick={() => onToggle(true)}
                            className="ml-2 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors uppercase tracking-widest"
                        >
                            Connect
                        </button>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
