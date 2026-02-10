
import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SparklesIcon, ZapIcon, LayersIcon } from './icons';
// import confetti from 'canvas-confetti'; // We'll simulate this with CSS for now to avoid dep bloat

interface LevelUpModalProps {
    newLevel: number;
    onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
    const { activeProfile } = useApp();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setShowContent(true), 100);

        // Auto-close safety
        // setTimeout(onClose, 8000); 
    }, []);

    const stardustReward = newLevel * 10;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle,_#a855f750_0%,_transparent_70%)] animate-[spin_10s_linear_infinite]"></div>
            </div>

            <div className={`relative z-10 text-center transform transition-all duration-700 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>

                <h2 className="text-[12px] font-mono text-teal-400 uppercase tracking-[0.8em] mb-4 font-bold animate-pulse">System_Upgrade_Complete</h2>

                <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-50 animate-pulse"></div>
                    <h1 className="relative text-8xl md:text-9xl font-bold font-dm-sans text-white tracking-tighter neon-glow" style={{ textShadow: '0 0 50px rgba(168,85,247,0.8)' }}>
                        {newLevel}
                    </h1>
                </div>

                <div className="space-y-2 mb-10">
                    <h3 className="text-2xl font-bold text-white font-dm-sans">Clearance Level Increased</h3>
                    <p className="text-white/50">Operator {activeProfile?.givenName} has reached Level {newLevel}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto mb-10">
                    {/* Reward Card */}
                    <div className="glass-panel p-4 flex items-center gap-4 bg-amber-500/10 border-amber-500/30">
                        <div className="p-3 bg-amber-500/20 rounded-full">
                            <SparklesIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Reward_Dispensed</p>
                            <p className="text-lg font-bold text-white">+{stardustReward} Stardust</p>
                        </div>
                    </div>

                    {/* Unlock Teaser (Generic for now) */}
                    <div className="glass-panel p-4 flex items-center gap-4 bg-purple-500/10 border-purple-500/30">
                        <div className="p-3 bg-purple-500/20 rounded-full">
                            <LayersIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">Features_Unlocked</p>
                            <p className="text-sm text-white/80">New cosmic frequencies available.</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="px-10 py-4 bg-white text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-purple-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-xl"
                >
                    Acknowledge
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
