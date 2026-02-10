
import React from 'react';
import { SavedReading } from '../../types';
import { ZapIcon, EditIcon, CheckSquareIcon } from '../icons';

interface ActionableAltarProps {
    reading: SavedReading;
}

const ActionableAltar: React.FC<ActionableAltarProps> = ({ reading }) => {
    return (
        <div className="w-full max-w-6xl mx-auto mt-20 p-4 pb-40 animate-fade-in-up text-white" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-6 mb-12">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h2 className="text-[11px] font-mono text-white/40 uppercase tracking-[0.8em] font-bold">Integration_Protocols</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Micro-Rituals / Actions */}
                <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group">
                    <h3 className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 font-bold">
                        <ZapIcon className="w-4 h-4" /> Tactical_Directives
                    </h3>
                    <ul className="space-y-4">
                        {reading.practicalActions?.map((action, i) => (
                            <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group/item">
                                <div className="mt-1 w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-black group-hover/item:border-teal-500/50">
                                    <CheckSquareIcon className="w-3 h-3 text-transparent group-hover/item:text-teal-400 transition-colors" />
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed font-dm-sans">{action}</p>
                            </li>
                        )) || (
                                <li className="text-sm text-white/30 italic">No specific directives generated. Focus on clarity.</li>
                            )}
                    </ul>
                </div>

                {/* Journaling Prompts */}
                <div className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group">
                    <h3 className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 font-bold">
                        <EditIcon className="w-4 h-4" /> Reflection_prompts
                    </h3>
                    <textarea
                        className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 resize-none font-dm-sans leading-relaxed"
                        placeholder="Reflect on the synthesis here..."
                        defaultValue={reading.reflectionQuestion || ""}
                    ></textarea>
                    <div className="mt-4 flex justify-end">
                        <button className="text-[10px] font-mono text-white/50 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 transition-all">
                            Save_Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionableAltar;
