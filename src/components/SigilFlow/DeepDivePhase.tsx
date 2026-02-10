
import React, { useState } from 'react';
import { DrawnDivinationCard, TarotCard } from '../../types';
import HolographicCard from '../HolographicCard';
import { SparklesIcon, XIcon, LayersIcon } from '../icons';

interface DeepDivePhaseProps {
    card: DrawnDivinationCard;
    positionLabel: string;
    onClose: () => void;
}

/**
 * DeepDivePhase — Full-screen modal for inspecting a single card at
 * three AI-generated interpretation depths: Keywords, Symbolic, and Esoteric.
 * 
 * ! Each depth level pulls from a dedicated AI-populated field on the card.
 * * Falls back gracefully to static card data when AI fields are null
 *   (e.g. during background generation or API failure).
 */
const DeepDivePhase: React.FC<DeepDivePhaseProps> = ({ card, positionLabel, onClose }) => {
    const [depthLevel, setDepthLevel] = useState<'keywords' | 'symbolic' | 'esoteric'>('symbolic');
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    // * Cast to TarotCard for element/arcana access (safe — non-tarot cards just lack these fields)
    const tarotCard = card.card as TarotCard;

    const handleHotspotClick = (target: string) => {
        setActiveTooltip(target);
    };

    /**
     * Returns the interpretation text for the currently selected depth level.
     * 
     * ! Priority: AI-generated field → static card data fallback
     * * This ensures the slider always shows *something*, even if the
     *   Gemini response hasn't arrived yet or the API call failed.
     */
    const getInterpretation = (): { text: string; isAI: boolean } => {
        if (depthLevel === 'keywords') {
            // AI keyword analysis if available, otherwise raw keywords
            const aiText = card.keywordAnalysis;
            if (aiText) return { text: aiText, isAI: true };
            return { text: "Keywords: " + card.card.keywords.join(', '), isAI: false };
        }
        if (depthLevel === 'symbolic') {
            // AI symbolic interpretation if available, otherwise static meaning
            const aiText = card.symbolicInterpretation;
            if (aiText) return { text: aiText, isAI: true };
            return { text: card.card.meaning, isAI: false };
        }
        if (depthLevel === 'esoteric') {
            // AI esoteric interpretation — "Data encrypted." is the API failure fallback
            const aiText = card.esotericInterpretation;
            if (aiText && aiText !== "Data encrypted.") return { text: aiText, isAI: true };
            if (aiText === "Data encrypted.") return { text: aiText, isAI: false };
            return { text: "Esoteric data unavailable.", isAI: false };
        }
        return { text: "", isAI: false };
    };

    /**
     * Returns tooltip content based on the hotspot target.
     * 
     * ! Uses actual card data instead of hardcoded placeholder strings.
     * * 'symbol' shows the card's archetypal identity and keywords.
     * * 'element' shows the card's elemental association and orientation.
     */
    const getTooltipContent = (target: string): { title: string; body: string } => {
        if (target === 'symbol') {
            return {
                title: 'Archetypal_Symbol',
                body: `${card.card.name} — ${card.card.keywords.join(', ')}. ${card.isReversed ? 'Reversed: the shadow aspect of this archetype is active.' : 'Upright: this archetype expresses its full potential.'}`
            };
        }
        // 'element' hotspot
        const element = tarotCard.element || 'Unknown';
        const arcana = tarotCard.arcana || 'Minor';
        return {
            title: 'Elemental_Essence',
            body: `Element: ${element} | ${arcana} Arcana. ${card.isReversed
                ? `Reversed ${element} energy suggests blocked or internalized force.`
                : `Upright ${element} energy flows freely, amplifying the card's core message.`}`
        };
    };

    const interpretation = getInterpretation();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-3xl animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group z-50"
            >
                <XIcon className="w-6 h-6 text-white/50 group-hover:text-white" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-7xl h-full max-h-[90vh] items-center relative z-40">
                {/* Visual Side */}
                <div className="flex items-center justify-center relative h-full">
                    <div className="relative w-full aspect-[2/3] max-w-[500px] animate-fade-in-up md:scale-90 lg:scale-100 transition-transform">
                        <HolographicCard
                            card={card}
                            isRevealed={true}
                            showHotspots={true}
                            onHotspotClick={handleHotspotClick}
                            className="w-full h-full shadow-[0_0_100px_rgba(168,85,247,0.2)]"
                        />

                        {/* Tooltips Overlay — now uses dynamic card data */}
                        {activeTooltip && (() => {
                            const tooltip = getTooltipContent(activeTooltip);
                            return (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-purple-500/50 p-6 rounded-2xl max-w-sm backdrop-blur-xl animate-scale-in z-50 shadow-2xl">
                                    <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2 font-bold">{tooltip.title}</h4>
                                    <p className="text-sm text-white leading-relaxed">
                                        {tooltip.body}
                                    </p>
                                    <button className="absolute top-2 right-2 text-white/30 hover:text-white" onClick={(e) => { e.stopPropagation(); setActiveTooltip(null); }}>
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                </div>

                {/* Data Side */}
                <div className="flex flex-col h-full justify-center space-y-8 animate-fade-in-right p-4">
                    <div>
                        <p className="text-xs font-mono text-purple-400 uppercase tracking-[0.4em] mb-2 font-bold">{positionLabel}</p>
                        <h2 className="text-5xl font-bold font-dm-sans text-white tracking-tighter neon-glow mb-4">{card.card.name}</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-transparent"></div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2rem] border-white/10 bg-white/[0.02] relative overflow-hidden min-h-[200px]">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><SparklesIcon className="w-32 h-32" /></div>

                        {/* AI vs static indicator */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-1.5 h-1.5 rounded-full ${interpretation.isAI ? 'bg-green-400 animate-pulse' : 'bg-yellow-500/50'}`}></div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">
                                {interpretation.isAI ? 'AI_Generated' : 'Static_Fallback'}
                            </span>
                        </div>

                        <p className="text-lg leading-relaxed text-text-muted relative z-10 transition-all duration-500 ease-in-out">
                            {interpretation.text}
                        </p>
                    </div>

                    {/* Depth Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold flex items-center gap-2">
                                <LayersIcon className="w-3 h-3" /> Interpretation Depth
                            </label>
                            <span className="text-xs text-purple-400 font-bold uppercase">{depthLevel}</span>
                        </div>

                        <div className="relative h-1 bg-white/10 rounded-full w-full max-w-md">
                            <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-500"
                                style={{ width: depthLevel === 'keywords' ? '0%' : depthLevel === 'symbolic' ? '50%' : '100%' }}></div>

                            <button onClick={() => setDepthLevel('keywords')} className={`absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 rounded-full border-2 transition-all ${depthLevel === 'keywords' ? 'bg-black border-purple-500 scale-125' : 'bg-white/20 border-transparent hover:bg-white/50'}`}></button>
                            <button onClick={() => setDepthLevel('symbolic')} className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all ${depthLevel === 'symbolic' ? 'bg-black border-purple-500 scale-125' : 'bg-white/20 border-transparent hover:bg-white/50'}`}></button>
                            <button onClick={() => setDepthLevel('esoteric')} className={`absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 rounded-full border-2 transition-all ${depthLevel === 'esoteric' ? 'bg-black border-purple-500 scale-125' : 'bg-white/20 border-transparent hover:bg-white/50'}`}></button>
                        </div>

                        <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest mt-2 max-w-md">
                            <span>Keywords</span>
                            <span>Symbolic</span>
                            <span>Esoteric</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeepDivePhase;
