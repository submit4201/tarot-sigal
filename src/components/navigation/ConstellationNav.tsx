import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../../types';
import CelestialOrrery from '../orrery/CelestialOrrery';

interface ConstellationNavProps {
    activePage: Page;
    setPage: (page: Page) => void;
}

const ConstellationNav: React.FC<ConstellationNavProps> = ({ activePage, setPage }) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 z-[9000] bg-[#030407]/95 flex items-center justify-center overflow-hidden backdrop-blur-sm"
            >
                {/* Background Tech layer */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent"></div>

                    {/* Animated scanning lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-[scan_4s_linear_infinite]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-magenta-500/20 to-transparent animate-[scan_4s_linear_infinite_reverse]"></div>
                </div>

                {/* Main Orrery Hub */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-mono text-xs tracking-[0.5em] text-cyan-400 uppercase opacity-60 mb-2"
                        >
                            Neural Matrix
                        </motion.h2>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="font-sans text-2xl font-black tracking-tighter text-white uppercase italic"
                        >
                            Celestial Orrery
                        </motion.h1>
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mt-4"></div>
                    </div>

                    <CelestialOrrery activePage={activePage} onSelectProtocol={setPage} />

                    {/* Footer instructions */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase"
                        >
                            Select Planet to Dock // Neural Link active
                        </motion.div>
                    </div>
                </div>

                {/* Close Button UI elements */}
                <div className="absolute top-8 right-8 text-right font-mono text-[8px] opacity-20 hidden md:block select-none">
                    <div>TERMINAL_ID: ARCANA_OS_HUB</div>
                    <div>SECURE_CONN: ESTABLISHED</div>
                    <div>ENCRYPTION: QUANTUM_AES</div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConstellationNav;
