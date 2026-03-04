import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Page } from '../../types';
import { useApp } from '../../context/AppContext';

interface CelestialOrreryProps {
    onSelectProtocol: (protocol: Page) => void;
    activePage: Page;
}

interface OrbitNode {
    id: Page;
    label: string;
    angle: number;
    radius: number;
    color: string;
    borderColor: string;
    glow: string;
    bg: string;
    tier?: 'free' | 'seeker' | 'mystic' | 'oracle';
}

const ORBIT_NODES: OrbitNode[] = [
    { id: 'Daily', label: 'Daily Uplink', angle: 0, radius: 140, color: 'text-cyan-400', borderColor: 'border-cyan-500/50', glow: 'shadow-[0_0_30px_rgba(0,229,255,0.4)]', bg: 'bg-cyan-900/20' },
    { id: 'Readings', label: 'Quantum Spreads', angle: 180, radius: 140, color: 'text-indigo-400', borderColor: 'border-indigo-500/50', glow: 'shadow-[0_0_30px_rgba(129,140,248,0.4)]', bg: 'bg-indigo-900/20' },

    { id: 'Progress', label: 'Astral Metrics', angle: 60, radius: 220, color: 'text-amber-400', borderColor: 'border-amber-500/50', glow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]', bg: 'bg-amber-900/20' },
    { id: 'Journal', label: 'Neural Logs', angle: 180, radius: 220, color: 'text-emerald-400', borderColor: 'border-emerald-500/50', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.4)]', bg: 'bg-emerald-900/20' },
    { id: 'BirthProfile', label: 'Natal Matrix', angle: 300, radius: 220, color: 'text-violet-400', borderColor: 'border-violet-500/50', glow: 'shadow-[0_0_30px_rgba(167,139,250,0.4)]', bg: 'bg-violet-900/20', tier: 'seeker' },

    { id: 'Shop', label: 'Market Crypt', angle: 120, radius: 180, color: 'text-magenta-400', borderColor: 'border-magenta-500/50', glow: 'shadow-[0_0_30px_rgba(255,0,255,0.4)]', bg: 'bg-magenta-900/20' },
    { id: 'Profile', label: 'Identity Core', angle: 240, radius: 180, color: 'text-rose-400', borderColor: 'border-rose-500/50', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.4)]', bg: 'bg-rose-900/20' },
    { id: 'Grimoire', label: 'Grimoire Config', angle: 150, radius: 260, color: 'text-orange-400', borderColor: 'border-orange-500/50', glow: 'shadow-[0_0_30px_rgba(251,146,60,0.4)]', bg: 'bg-orange-900/20' },
];

const GlitchText: React.FC<{ text: string; active: boolean; className?: string }> = ({ text, active, className }) => {
    if (!active) return <span className={className}>{text}</span>;
    return (
        <span className={`relative inline-block ${className}`}>
            <span className="absolute top-0 left-[1px] -ml-[1px] text-red-500 opacity-70 animate-[glitch-anim_0.3s_infinite_linear_alternate-reverse] clip-path-glitch-1" aria-hidden="true">{text}</span>
            <span className="absolute top-0 left-[-1px] ml-[1px] text-blue-500 opacity-70 animate-[glitch-anim_0.4s_infinite_linear_alternate-reverse] clip-path-glitch-2" aria-hidden="true">{text}</span>
            {text}
        </span>
    );
};

const CelestialOrrery: React.FC<CelestialOrreryProps> = ({ onSelectProtocol, activePage }) => {
    const { activeProfile } = useApp();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    const userTier = activeProfile?.subscriptionTier || 'free';
    const tierRanking = { 'free': 0, 'seeker': 1, 'mystic': 2, 'oracle': 3 };

    // If a node is hovered, slow down the entire system rotation
    const rotationDuration = hoveredNode ? 240 : 120; // Slower default rotation to make it more "stately"

    const isTierLocked = (node: OrbitNode) => {
        if (!node.tier) return false;
        return tierRanking[userTier] < tierRanking[node.tier];
    };

    return (
        <div className="relative w-[700px] h-[700px] flex items-center justify-center scale-75 md:scale-100">

            {/* Background Grid/Targeting UI */}
            <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none opacity-20"></div>
            <div className="absolute inset-8 border border-white/5 rounded-full pointer-events-none opacity-20"></div>
            <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none"></div>
            <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

            {/* Center Nexus */}
            <div className="absolute z-10 w-24 h-24 rounded-full bg-black border border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.15)] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-t border-purple-400/50 animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full border-b border-cyan-400/50 animate-[spin_3s_linear_infinite_reverse]"></div>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-[pulse_2s_infinite]"></div>
                <div className="absolute font-mono text-[8px] text-purple-300 uppercase tracking-widest mt-12 opacity-50">Core</div>
            </div>

            {/* Orbit Rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <circle cx="350" cy="350" r="140" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 8" className="opacity-20" />
                <circle cx="350" cy="350" r="180" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2 12" className="opacity-20" />
                <circle cx="350" cy="350" r="220" fill="none" stroke="white" strokeWidth="1" strokeDasharray="1 6" className="opacity-20" />
            </svg>

            {/* Orbit System */}
            <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
            >
                {ORBIT_NODES.map((node) => {
                    const x = 350 + node.radius * Math.cos(node.angle * (Math.PI / 180)) - 32;
                    const y = 350 + node.radius * Math.sin(node.angle * (Math.PI / 180)) - 32;

                    const isHovered = hoveredNode === node.id;
                    const isMuted = hoveredNode !== null && hoveredNode !== node.id;
                    const isActive = activePage === node.id;
                    const isLocked = isTierLocked(node);

                    return (
                        <div
                            key={node.id}
                            className={`absolute flex flex-col items-center justify-center group cursor-pointer transition-opacity duration-500 ${isMuted ? 'opacity-20' : 'opacity-100'}`}
                            style={{ left: x, top: y }}
                            onMouseEnter={() => setHoveredNode(node.id)}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => {
                                if (isLocked) return;
                                if (node.id === 'Profile') {
                                    window.location.href = '#/grimoire?tab=identity';
                                } else if (node.id === 'Grimoire') {
                                    window.location.href = '#/grimoire';
                                } else {
                                    onSelectProtocol(node.id);
                                }
                            }}
                        >
                            {/* Node Core - Counter Rotate */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
                                className={`w-14 h-14 rounded-full border ${isHovered ? node.borderColor : isActive ? 'border-white/60' : 'border-white/10'} ${isHovered ? node.bg : isActive ? 'bg-white/10' : 'bg-black/60'} backdrop-blur-xl flex items-center justify-center transition-all duration-500 ${isHovered ? node.glow : ''} ${isHovered ? 'scale-110' : 'scale-100'}`}
                            >
                                {/* Inner tech ring */}
                                {isHovered && <div className="absolute inset-1 rounded-full border border-current opacity-30 animate-[spin_2s_linear_infinite] border-t-transparent" style={{ color: 'inherit' }}></div>}

                                {/* Core blip / Icon */}
                                {isLocked ? (
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">Locked</div>
                                ) : (
                                    <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-white' : isActive ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/40'} transition-colors duration-300 shadow-glow`}></div>
                                )}
                            </motion.div>

                            {/* Label - Counter Rotate */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
                                className="absolute top-16 flex flex-col items-center"
                            >
                                <div className={`whitespace-nowrap font-mono text-[9px] tracking-[0.2em] font-bold ${isHovered ? node.color : isActive ? 'text-white' : 'text-white/40'} uppercase transition-colors duration-300`}>
                                    <GlitchText text={isLocked ? '[ RESTRICTED ]' : `[ ${node.label} ]`} active={isHovered} />
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};


export default CelestialOrrery;
