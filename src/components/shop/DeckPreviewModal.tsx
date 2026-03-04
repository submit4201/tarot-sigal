import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Deck, AnyCard } from '../../types';
import { XMarkIcon } from '../icons';
import ReactMarkdown from 'react-markdown';
import { ELEMENT_HEX_COLORS } from '../../constants';

interface DeckPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    deckId: string | null;
    decks: Deck[];
}

export const DeckPreviewModal: React.FC<DeckPreviewModalProps> = ({ isOpen, onClose, deckId, decks }) => {
    const [sampleCard, setSampleCard] = useState<AnyCard | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (isOpen && deckId) {
            const currentDeck = decks.find(d => d.id === deckId);
            if (currentDeck && currentDeck.cards.length > 0) {
                // Pick a random card to show off
                const randomCard = currentDeck.cards[Math.floor(Math.random() * currentDeck.cards.length)];
                setSampleCard(randomCard);
                setIsFlipped(false);
            }
        } else {
            setSampleCard(null);
            setIsFlipped(false);
        }
    }, [isOpen, deckId, decks]);

    if (!isOpen || !sampleCard) return null;

    const deckName = decks.find(d => d.id === deckId)?.name || 'Unknown Deck';
    const cardElement = (sampleCard as any).element || 'Void';
    const glowColor = (ELEMENT_HEX_COLORS as any)[cardElement] || '#a855f7';
    const isShadow = (sampleCard as any).isReversed || false;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    {/* Background Ambient Glow */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at center, ${glowColor}33 0%, transparent 70%)`
                        }}
                    ></div>

                    <motion.div
                        className="relative w-full max-w-sm flex flex-col items-center"
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-16 right-0 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all hover:rotate-90"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-2xl font-bold font-dm-sans text-white tracking-tight">
                                    SIGAL_<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">MANIFEST</span>
                                </h2>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-2">
                                    Demoing Protocol: <span className="text-teal-400">{deckName}</span>
                                </p>
                            </motion.div>
                        </div>

                        {/* Interactive 3D Card Flip */}
                        <div
                            className="relative w-[300px] aspect-[2/3] perspective-1000 cursor-pointer group"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Adaptive Glow Effect */}
                            <div
                                className={`absolute -inset-4 rounded-[2.5rem] blur-2xl opacity-40 transition-opacity duration-1000 ${isFlipped ? 'opacity-60' : 'opacity-20'}`}
                                style={{ backgroundColor: glowColor }}
                            ></div>

                            <motion.div
                                className="w-full h-full relative preserve-3d transition-transform duration-1000 ease-out"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                            >
                                {/* Card Back */}
                                <div className={`absolute inset-0 backface-hidden rounded-2xl border-2 shadow-2xl overflow-hidden bg-slate-950 transition-colors duration-500 ${isShadow ? 'border-purple-900/50' : 'border-teal-500/30'}`}>
                                    {/* Generative Grid Pattern (Replacing missing SVG) */}
                                    <div className="absolute inset-0 opacity-20" style={{
                                        backgroundImage: `linear-gradient(${glowColor}22 1px, transparent 1px), linear-gradient(90deg, ${glowColor}22 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px'
                                    }} />

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="relative w-24 h-24 mb-6">
                                            <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-full animate-pulse"></div>
                                            <div className="absolute inset-0 border border-teal-500/40 rounded-full flex items-center justify-center">
                                                <div className="w-16 h-16 border border-teal-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                                                    <div className="w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-mono text-[10px] text-teal-400/60 tracking-[0.5em] uppercase animate-pulse">Touch to manifest</div>
                                    </div>

                                    {/* Reactive scanning line */}
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent top-0 animate-scan pointer-events-none"></div>
                                </div>

                                {/* Card Front */}
                                <div className={`absolute inset-0 backface-hidden rounded-2xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black overflow-hidden transition-colors duration-500 ${isShadow ? 'border-purple-600/40' : 'border-white/20'}`} style={{ transform: 'rotateY(180deg)' }}>
                                    <img
                                        src={(sampleCard as any).image_url || sampleCard.imageUrl}
                                        alt={sampleCard.name}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Overlay Glow based on element */}
                                    <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen" style={{
                                        background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`
                                    }}></div>

                                    {/* Information Overlay */}
                                    <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-6 px-6 transition-transform duration-500 ${isFlipped ? 'translate-y-0' : 'translate-y-full'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[8px] font-mono text-white/40 tracking-widest uppercase">{cardElement} Protocol</span>
                                            {isShadow && <span className="text-[8px] font-mono text-purple-400 tracking-widest uppercase">Shadow Profile</span>}
                                        </div>
                                        <h3 className="text-white font-bold font-dm-sans text-2xl tracking-tight leading-none mb-1">{sampleCard.name}</h3>
                                        {sampleCard.keywords && (
                                            <p className="text-[9px] text-teal-400 font-mono tracking-widest uppercase mt-2">
                                                {sampleCard.keywords?.slice(0, 3).join(' // ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Interpretation Section */}
                        <motion.div
                            className="mt-10 text-center w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                            animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-4">Signal_Insight</h4>
                            <div className="text-sm text-white/90 font-dm-sans leading-relaxed max-w-xs mx-auto prose prose-invert prose-sm">
                                <ReactMarkdown>
                                    {(sampleCard as any).meaning_up || sampleCard.meaning}
                                </ReactMarkdown>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 px-6 py-2 rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-teal-400 transition-colors"
                            >
                                Close Manifest
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeckPreviewModal;
