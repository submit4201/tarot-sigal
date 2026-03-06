import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useConfig } from '../../context/ConfigContext';
import { LockIcon, UserIcon, ShieldIcon, SparklesIcon, SlidersIcon, ActivityIcon, LayersIcon } from '../icons';

import { motion, AnimatePresence } from 'framer-motion';

import IdentityCore from '../grimoire/IdentityCore';

type ConfigTab = 'identity' | 'arsenal' | 'world' | 'technical';

import ArsenalCore from '../grimoire/ArsenalCore';


const GrimoireConfig: React.FC<{ onClose: () => void; initialTab?: ConfigTab }> = ({ onClose, initialTab = 'identity' }) => {
    const { isPremium, setPage } = useApp();
    const { config, updateWorldConfig, updateTechnicalConfig } = useConfig();
    const [activeTab, setActiveTab] = useState<ConfigTab>(initialTab);

    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-50 overflow-hidden w-full h-full flex flex-col items-center">
            {/* Background elements */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(236,72,153,0.05),transparent_70%)] pointer-events-none"></div>

            <div className="w-full max-w-7xl h-full p-6 md:p-12 relative z-10 flex flex-col">
                <header className="flex justify-between items-center mb-8 w-full shrink-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-[0.2em] uppercase mb-1 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
                            Grimoire Hub
                        </h1>
                        <p className="font-sans text-pink-500/50 tracking-widest uppercase text-[10px]">Unified Control Matrix</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-pink-500/30 text-pink-400 font-mono text-xs uppercase tracking-widest hover:bg-pink-500/10 hover:border-pink-400 transition-all rounded-full drop-shadow-lg"
                    >
                        [ Return ]
                    </button>
                </header>

                <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden h-full">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => setActiveTab('identity')}
                            className={`p-4 rounded-xl flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${activeTab === 'identity' ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 border shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 border hover:text-white/80'}`}
                        >
                            <UserIcon className="w-4 h-4" /> Identity Matrix
                        </button>
                        <button
                            onClick={() => setActiveTab('arsenal')}
                            className={`p-4 rounded-xl flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${activeTab === 'arsenal' ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 border shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 border hover:text-white/80'}`}
                        >
                            <LayersIcon className="w-4 h-4" /> Arsenal Hub
                        </button>
                        <button
                            onClick={() => setActiveTab('world')}
                            className={`p-4 rounded-xl flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${activeTab === 'world' ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 border shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 border hover:text-white/80'}`}
                        >
                            <SparklesIcon className="w-4 h-4" /> World Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('technical')}
                            className={`p-4 rounded-xl flex items-center gap-3 font-mono text-xs uppercase tracking-widest transition-all ${activeTab === 'technical' ? 'bg-pink-500/20 border-pink-500/50 text-pink-300 border shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-white/5 border-transparent text-white/50 hover:bg-white/10 border hover:text-white/80'}`}
                        >
                            <SlidersIcon className="w-4 h-4" /> Technical
                        </button>

                        <div className="mt-auto pt-8">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-900/20 to-transparent border border-pink-500/20">
                                <h3 className="text-[10px] font-mono text-pink-400/70 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                    <ShieldIcon className="w-3 h-3" /> Clearance
                                </h3>
                                <div className="text-sm font-bold font-mono tracking-widest text-white">
                                    {isPremium ? 'ORACLE TIER' : 'INITIATE TIER'}
                                </div>
                                {!isPremium && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            setPage('Pricing');
                                        }}
                                        className="w-full mt-3 px-3 py-2 bg-pink-500/20 text-pink-300 font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-pink-500/30 transition-colors border border-pink-500/30"
                                    >
                                        Upgrade
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow glass-panel rounded-3xl border-white/10 bg-black/40 overflow-y-auto p-6 md:p-10 relative custom-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'identity' && <IdentityCore />}
                                {activeTab === 'arsenal' && <ArsenalCore />}

                                {activeTab === 'world' && (
                                    <div className="space-y-8 max-w-2xl">
                                        <h2 className="text-xl font-mono text-white tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                            <SparklesIcon className="w-5 h-5 text-purple-400" /> World Configuration
                                        </h2>

                                        {/* AI Verbosity */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-mono text-white/60 uppercase tracking-widest">AI Interpreter Verbosity</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(['minimal', 'balanced', 'verbose'] as const).map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => updateWorldConfig({ aiVerbosity: level })}
                                                        className={`p-3 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors ${config.world.aiVerbosity === level ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-white/30 font-sans">Adjusts the length and depth of generated readings and AI Insights.</p>
                                        </div>

                                        {/* Narrative Tone */}
                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            <label className="text-xs font-mono text-white/60 uppercase tracking-widest">Narrative Tone</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(['mystic', 'clinical', 'cyberpunk'] as const).map(tone => (
                                                    <button
                                                        key={tone}
                                                        onClick={() => updateWorldConfig({ narrativeTone: tone })}
                                                        className={`p-3 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors ${config.world.narrativeTone === tone ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
                                                    >
                                                        {tone}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-white/30 font-sans">Sets the voice and atmosphere of the AI interpreter.</p>
                                        </div>

                                        {/* Theme */}
                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            <label className="text-xs font-mono text-white/60 uppercase tracking-widest">UI Theme Override</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {(['void', 'neon', 'monochrome'] as const).map(theme => (
                                                    <button
                                                        key={theme}
                                                        onClick={() => updateWorldConfig({ theme: theme })}
                                                        className={`p-3 rounded-lg font-mono text-xs uppercase tracking-wider border transition-colors ${config.world.theme === theme ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
                                                    >
                                                        {theme}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-white/30 font-sans">WARNING: Theme overrides may require a system restart (refresh) to apply fully to all components.</p>
                                        </div>

                                        {/* Dynamic Backgrounds */}
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mt-6">
                                            <div>
                                                <div className="text-sm font-mono text-white uppercase tracking-widest">Dynamic Backgrounds</div>
                                                <div className="text-[10px] text-white/40 font-sans mt-1">Enable particle effects and animated grids. Disable for performance.</div>
                                            </div>
                                            <button
                                                onClick={() => updateWorldConfig({ dynamicBackgrounds: !config.world.dynamicBackgrounds })}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${config.world.dynamicBackgrounds ? 'bg-purple-500' : 'bg-white/20'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.world.dynamicBackgrounds ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'technical' && (
                                    <div className="space-y-8 max-w-2xl">
                                        <h2 className="text-xl font-mono text-white tracking-widest uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                            <ActivityIcon className="w-5 h-5 text-teal-400" /> Technical Parameters
                                        </h2>

                                        {/* API Gateway */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-white/60 uppercase tracking-widest">API Gateway</label>
                                            <input
                                                type="text"
                                                value={config.technical.apiGateway}
                                                onChange={(e) => updateTechnicalConfig({ apiGateway: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                                            />
                                            <p className="text-[10px] text-teal-400/50 font-sans italic">Network endpoint for astrometric computations.</p>
                                        </div>

                                        {/* API Keys */}
                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
                                                    <LockIcon className="w-3 h-3 text-teal-400" /> LLM Integration Key
                                                </label>
                                                <input
                                                    type="password"
                                                    value={config.technical.apiKeys?.llmApiKey || ''}
                                                    onChange={(e) => updateTechnicalConfig({ apiKeys: { ...config.technical.apiKeys, llmApiKey: e.target.value } })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                                                    placeholder="sk-..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-mono text-white/60 uppercase tracking-widest flex items-center gap-2">
                                                    <LockIcon className="w-3 h-3 text-teal-400" /> Sync API Key
                                                </label>
                                                <input
                                                    type="password"
                                                    value={config.technical.apiKeys?.syncApiKey || ''}
                                                    onChange={(e) => updateTechnicalConfig({ apiKeys: { ...config.technical.apiKeys, syncApiKey: e.target.value } })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                                                    placeholder="sync_..."
                                                />
                                            </div>
                                            <p className="text-[10px] text-white/30 font-sans">Keys are encrypted and stored locally in your browser context.</p>
                                        </div>

                                        {/* Sync Interval */}
                                        <div className="space-y-2 pt-6 border-t border-white/5">
                                            <label className="text-xs font-mono text-white/60 uppercase tracking-widest">Data Sync Interval (seconds)</label>
                                            <input
                                                type="number"
                                                value={config.technical.dataSyncInterval}
                                                onChange={(e) => updateTechnicalConfig({ dataSyncInterval: parseInt(e.target.value) || 3600 })}
                                                className="w-full max-w-[200px] bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                                            />
                                        </div>

                                        {/* Toggles */}
                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div>
                                                    <div className="text-sm font-mono text-white uppercase tracking-widest">Telemetry Collection</div>
                                                    <div className="text-[10px] text-white/40 font-sans mt-1">Send anonymous usage stats to the Gridpunk Nexus.</div>
                                                </div>
                                                <button
                                                    onClick={() => updateTechnicalConfig({ enableTelemetry: !config.technical.enableTelemetry })}
                                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${config.technical.enableTelemetry ? 'bg-teal-500' : 'bg-white/20'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.technical.enableTelemetry ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div>
                                                    <div className="text-sm font-mono text-white uppercase tracking-widest text-red-300">Debug Mode</div>
                                                    <div className="text-[10px] text-white/40 font-sans mt-1">Enable verbose console logging and developer tools.</div>
                                                </div>
                                                <button
                                                    onClick={() => updateTechnicalConfig({ debugMode: !config.technical.debugMode })}
                                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${config.technical.debugMode ? 'bg-red-500' : 'bg-white/20'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.technical.debugMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default GrimoireConfig;

