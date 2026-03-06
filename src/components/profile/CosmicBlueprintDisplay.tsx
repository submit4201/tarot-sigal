import React from 'react';
import { SparklesIcon, ShieldIcon, ActivityIcon, TerminalIcon } from 'lucide-react';
import { CosmicBlueprint } from '../../types';
import GlassPanel from '../ui/GlassPanel';

interface CosmicBlueprintDisplayProps {
    blueprint: CosmicBlueprint;
    sunSign: string;
    moonSign: string;
    synthesis: string;
}

const CosmicBlueprintDisplay: React.FC<CosmicBlueprintDisplayProps> = ({
    blueprint,
    sunSign,
    moonSign,
    synthesis
}) => {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Core Signature</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">ALIGNED</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Life Path */}
                <GlassPanel className="p-6 border-purple-500/20 bg-purple-500/5 group hover:bg-purple-500/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <ActivityIcon className="w-5 h-5" />
                        </div>
                        <div className="text-4xl font-black text-white italic tracking-tighter">{blueprint.lifePath.number}</div>
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">Life Path: {blueprint.lifePath.theme}</h3>
                    <p className="text-xs text-white/60 leading-relaxed italic">"{blueprint.lifePath.description}"</p>
                </GlassPanel>

                {/* Destiny */}
                <GlassPanel className="p-6 border-cyan-500/20 bg-cyan-500/5 group hover:bg-cyan-500/10 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                            <ShieldIcon className="w-5 h-5" />
                        </div>
                        <div className="text-4xl font-black text-white italic tracking-tighter">{blueprint.destiny.number}</div>
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-1">Destiny: {blueprint.destiny.theme}</h3>
                    <p className="text-xs text-white/60 leading-relaxed italic">"{blueprint.destiny.description}"</p>
                </GlassPanel>

                {/* Sun & Moon Summary */}
                <GlassPanel className="p-6 border-amber-500/20 bg-amber-500/5 md:col-span-2 group hover:bg-amber-500/10 transition-all">
                    <div className="flex items-center gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <TerminalIcon className="w-4 h-4 text-amber-500" />
                                <span className="text-[10px] font-mono text-amber-500/60 uppercase tracking-widest">Luminaries_Decoded</span>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1">Sun_Ego</div>
                                    <div className="text-xl font-black text-white uppercase tracking-tighter">{sunSign}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-1">Moon_Soul</div>
                                    <div className="text-xl font-black text-white uppercase tracking-tighter">{moonSign}</div>
                                </div>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed italic border-l-2 border-amber-500/20 pl-4 py-1">
                                {synthesis}
                            </p>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </section>
    );
};

export default CosmicBlueprintDisplay;
