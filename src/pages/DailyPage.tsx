import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';
import { getDailySeed, calculateDailyNumber } from '../services/tarotService';
import { motion, AnimatePresence } from 'framer-motion';

// Icons placeholders for HUD
import { DnaIcon, UserIcon } from '../components/icons';

// Component imports
import { useNavigate } from 'react-router-dom';
import CelestialOrrery from '../components/orrery/CelestialOrrery';
import DivinationProtocol from '../components/orrery/DivinationProtocol';
import AstralMetrics from '../components/orrery/AstralMetrics';
import GrimoireConfig from '../components/orrery/GrimoireConfig';

type Protocol = 'ORRERY' | 'DIVINATION' | 'ASTRAL' | 'GRIMOIRE';


const DailyPage: React.FC = () => {
    const { activeProfile } = useApp();
    const navigate = useNavigate();
    const [activeProtocol, setActiveProtocol] = useState<Protocol>('ORRERY');

    if (!activeProfile) return <div className="fixed inset-0 bg-black flex items-center justify-center font-mono animate-pulse text-purple-400 uppercase tracking-widest text-sm z-50">Initialising_Aether...</div>;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dailySeed = useMemo(() => getDailySeed(activeProfile, today), [activeProfile, todayStr]);
    const dailyNumber = useMemo(() => calculateDailyNumber(today), [todayStr]);
    const frequencyFingerprint = useMemo(() => dailySeed.toString(16).toUpperCase().padStart(8, '0'), [dailySeed]);

    const handleSelectProtocol = (id: Page) => {
        // Map planetary node clicks to internal state or global navigation
        if (id === 'Daily') {
            setActiveProtocol('DIVINATION');
            return;
        }
        if (id === 'Progress') {
            setActiveProtocol('ASTRAL');
            return;
        }
        if (id === 'Grimoire') {
            setActiveProtocol('GRIMOIRE');
            return;
        }

        // Global navigation for standard pages (Readings, Journal, etc.)
        navigate(`/${id.toLowerCase()}`);
    };

    // Handle closing protocols to return to the Orrery
    const closeProtocol = () => setActiveProtocol('ORRERY');

    return (
        <div className="fixed inset-0 bg-[#030407] overflow-hidden flex items-center justify-center font-sans text-white z-0">
            {/* Deep Void Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-[#030407] to-[#030407] pointer-events-none"></div>

            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

            {/* --- HEADS UP DISPLAY (HUD) --- */}
            {/* Top Left: System Status & Resonance */}
            <div className="absolute top-6 left-6 z-20 flex flex-col items-start gap-1 pointer-events-none">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(0,255,102,0.8)] animate-[pulse_2s_infinite]"></div>
                    <span className="font-mono text-[9px] text-green-400 tracking-[0.3em] font-bold uppercase">Uplink_Active</span>
                </div>
                <div className="text-xl font-bold font-mono text-purple-100 tracking-widest uppercase">Sigal</div>
                <div className="flex items-center gap-2 mt-2 bg-purple-900/20 border border-purple-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm pointer-events-auto cursor-help group">
                    <DnaIcon className="w-3 h-3 text-purple-400" />
                    <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest">Resonance: {dailyNumber.number}</span>

                    <div className="absolute top-10 left-0 w-48 p-3 bg-black/90 border border-purple-500/30 rounded-lg text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        Theme: {dailyNumber.theme}
                    </div>
                </div>
            </div>

            {/* Top Right: Profile */}
            <div className="absolute top-6 right-6 z-20 pointer-events-none">
                <div className="flex flex-col items-end gap-2 bg-white/[0.02] border border-white/5 backdrop-blur-md px-4 py-3 rounded-2xl pointer-events-auto hover:bg-white/[0.05] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="font-sans text-sm font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{activeProfile.givenName}</div>
                            <div className="font-mono text-[9px] text-white/40 tracking-widest uppercase mt-0.5">LVL {Math.floor(activeProfile.xp / 100) + 1} Seeker</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-cyan-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Left: Fingerprint */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none opacity-50">
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Cycle_Fingerprint</div>
                <div className="font-mono text-xs text-white/60 tracking-widest">0x{frequencyFingerprint}</div>
            </div>

            {/* --- CENTRAL PROTOCOL RENDERER --- */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {activeProtocol === 'ORRERY' && (
                        <motion.div
                            key="orrery"
                            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <CelestialOrrery onSelectProtocol={handleSelectProtocol} activePage="Daily" />
                        </motion.div>
                    )}

                    {activeProtocol === 'DIVINATION' && (
                        <motion.div
                            key="divination"
                            initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0"
                        >
                            <DivinationProtocol onClose={closeProtocol} />
                        </motion.div>
                    )}

                    {activeProtocol === 'ASTRAL' && (
                        <motion.div
                            key="astral"
                            initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0"
                        >
                            <AstralMetrics onClose={closeProtocol} />
                        </motion.div>
                    )}

                    {activeProtocol === 'GRIMOIRE' && (
                        <motion.div
                            key="grimoire"
                            initial={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0"
                        >
                            <GrimoireConfig onClose={closeProtocol} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DailyPage;
