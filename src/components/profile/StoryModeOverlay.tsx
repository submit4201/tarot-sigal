import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '../icons';

interface StoryModeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle: string;
    narrative: string;
    color: string;
    glyph: string;
}

const StoryModeOverlay: React.FC<StoryModeOverlayProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    narrative,
    color,
    glyph
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                        onClick={onClose}
                    />

                    {/* Content Container */}
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 10, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-gradient-to-br from-zinc-900/50 to-black/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                        >
                            <XMarkIcon className="w-6 h-6 text-white/50" />
                        </button>

                        <div className="flex flex-col md:flex-row min-h-[500px]">
                            {/* Left Side: Visual / Glyph */}
                            <div className="w-full md:w-1/3 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                                <motion.div
                                    initial={{ rotate: -180, scale: 0 }}
                                    animate={{ rotate: 0, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="relative w-40 h-40 flex items-center justify-center rounded-full"
                                    style={{
                                        boxShadow: `0 0 80px ${color}33`,
                                        border: `2px solid ${color}66`
                                    }}
                                >
                                    <div className="text-7xl" style={{ color }}>{glyph}</div>

                                    {/* Orbits */}
                                    <motion.div
                                        className="absolute inset-[-20px] rounded-full border border-dashed border-white/10"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    />
                                    <motion.div
                                        className="absolute inset-[-40px] rounded-full border border-dotted border-white/10"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>

                                <div className="mt-8 text-center">
                                    <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mb-2">Architectural Anchor</div>
                                    <div className="text-xl font-bold text-white tracking-tight">{title}</div>
                                    <div className="text-sm text-zinc-400 mt-1">{subtitle}</div>
                                </div>
                            </div>

                            {/* Right Side: Narrative Content */}
                            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-6">
                                    <SparklesIcon className="w-5 h-5" style={{ color }} />
                                    <span className="text-[10px] font-mono tracking-wider opacity-50 uppercase">Celestial Synthesis</span>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold leading-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                                        The resonance of {title} in your unique timeline.
                                    </h2>

                                    <div className="text-lg text-zinc-300 leading-relaxed font-serif italic border-l-2 border-white/20 pl-6">
                                        "{narrative}"
                                    </div>

                                    <div className="pt-8 flex gap-4">
                                        <button className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-sm">
                                            Deep Dive Interpretation
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-transparent text-white border border-white/20 font-bold rounded-lg hover:bg-white/5 transition-colors text-sm"
                                        >
                                            Continue Journey
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StoryModeOverlay;
