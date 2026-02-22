import React, { useState } from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import {
    CpuIcon,
    BinaryIcon,
    MapPinIcon,
    ActivityIcon,
    ZapIcon,
    ShieldAlertIcon,
    ChevronRightIcon,
    CompassIcon,
    SparklesIcon,
    DnaIcon,
    SunIcon,
} from '../icons';

/**
 * NarrativeSection
 * ================
 * * NOTE: Parses structured LLM output (split by '### ') and renders each
 *   narrative module as a premium interactive card.
 *
 * ! IMPORTANT: The LLM output MUST use '### [SECTION_NAME]' headers for parsing.
 *   This component maps each header to a unique icon, color, and layout.
 */

interface NarrativeSectionProps {
    content: string;
    /** Raw profile data for displaying structured stats alongside narrative */
    profileData?: any;
}

// ----------------------------------------------------------------
// Section configuration: maps section keywords to visual treatments
// ----------------------------------------------------------------
interface SectionConfig {
    icon: React.ReactNode;
    accentColor: string;
    bgGradient: string;
    borderColor: string;
    label: string;
}

const getSectionConfig = (title: string): SectionConfig => {
    const t = title.toUpperCase();

    if (t.includes('ARCHETYPE'))
        return {
            icon: <SparklesIcon className="w-5 h-5" />,
            accentColor: 'text-purple-400',
            bgGradient: 'from-purple-500/10 via-transparent to-transparent',
            borderColor: 'border-purple-500/20 hover:border-purple-500/40',
            label: 'ARCHETYPE DESIGNATION'
        };
    if (t.includes('CORE'))
        return {
            icon: <CpuIcon className="w-5 h-5" />,
            accentColor: 'text-blue-400',
            bgGradient: 'from-blue-500/10 via-transparent to-transparent',
            borderColor: 'border-blue-500/20 hover:border-blue-500/40',
            label: 'CORE SYNTHESIS'
        };
    if (t.includes('DECISION'))
        return {
            icon: <CompassIcon className="w-5 h-5" />,
            accentColor: 'text-amber-400',
            bgGradient: 'from-amber-500/10 via-transparent to-transparent',
            borderColor: 'border-amber-500/20 hover:border-amber-500/40',
            label: 'DECISION ENGINE'
        };
    if (t.includes('PROSPERITY'))
        return {
            icon: <MapPinIcon className="w-5 h-5" />,
            accentColor: 'text-emerald-400',
            bgGradient: 'from-emerald-500/10 via-transparent to-transparent',
            borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
            label: 'PROSPERITY MAP'
        };
    if (t.includes('BIO'))
        return {
            icon: <ActivityIcon className="w-5 h-5" />,
            accentColor: 'text-red-400',
            bgGradient: 'from-red-500/10 via-transparent to-transparent',
            borderColor: 'border-red-500/20 hover:border-red-500/40',
            label: 'BIO-RESONANCE'
        };
    if (t.includes('ANCESTRAL'))
        return {
            icon: <ShieldAlertIcon className="w-5 h-5" />,
            accentColor: 'text-orange-400',
            bgGradient: 'from-orange-500/10 via-transparent to-transparent',
            borderColor: 'border-orange-500/20 hover:border-orange-500/40',
            label: 'ANCESTRAL ENCRYPTION'
        };
    if (t.includes('HERO'))
        return {
            icon: <ChevronRightIcon className="w-5 h-5" />,
            accentColor: 'text-indigo-400',
            bgGradient: 'from-indigo-500/10 via-transparent to-transparent',
            borderColor: 'border-indigo-500/20 hover:border-indigo-500/40',
            label: "HERO'S ARC"
        };
    if (t.includes('GENE'))
        return {
            icon: <DnaIcon className="w-5 h-5" />,
            accentColor: 'text-pink-400',
            bgGradient: 'from-pink-500/10 via-transparent to-transparent',
            borderColor: 'border-pink-500/20 hover:border-pink-500/40',
            label: 'GENE KEY TRANSMISSION'
        };

    // Default fallback
    return {
        icon: <BinaryIcon className="w-5 h-5" />,
        accentColor: 'text-purple-400',
        bgGradient: 'from-purple-500/10 via-transparent to-transparent',
        borderColor: 'border-purple-500/20 hover:border-purple-500/40',
        label: 'MODULE'
    };
};

const NarrativeSection: React.FC<NarrativeSectionProps> = ({ content, profileData }) => {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    // Parsing logic to split markdown sections
    const sections = content.split('### ').filter(s => s.trim().length > 0);

    const cleanTitle = (title: string) => title.replace(/[\[\]]/g, '').trim();

    // Format body text: handle bullet points and paragraphs
    const renderBody = (body: string) => {
        const lines = body.split('\n').filter(l => l.trim().length > 0);

        return lines.map((line, i) => {
            const trimmed = line.trim();

            // Bullet point
            if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                return (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-2.5 flex-shrink-0 opacity-60" />
                        <span className="text-blue-50/80 leading-relaxed">{trimmed.replace(/^[-•]\s*/, '')}</span>
                    </div>
                );
            }

            // Regular paragraph
            return (
                <p key={i} className="text-blue-50/80 leading-relaxed mb-3">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className="space-y-6">
            {sections.map((section, idx) => {
                const lines = section.split('\n');
                const title = lines[0].trim();
                const body = lines.slice(1).join('\n').trim();
                const config = getSectionConfig(title);
                const isExpanded = expandedIdx === idx;

                // ---- ARCHETYPE: Hero Module (full-width, large, dramatic) ----
                if (title.toUpperCase().includes('ARCHETYPE')) {
                    return (
                        <div key={idx} className="relative py-12 flex flex-col items-center justify-center">
                            {/* Glow background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl -z-10 animate-pulse" />
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent -z-10" />

                            {/* Designation badge */}
                            <div className="mb-4 px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                                <span className="text-[10px] font-mono text-purple-400 tracking-[0.5em] uppercase">
                                    Archetype Designation
                                </span>
                            </div>

                            {/* The big title */}
                            <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/20 tracking-tighter uppercase italic text-center leading-tight">
                                {body.trim()}
                            </h2>

                            {/* Decorative line */}
                            <div className="mt-6 flex items-center gap-2">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
                                <SparklesIcon className="w-4 h-4 text-purple-500 animate-pulse" />
                                <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-500/50" />
                            </div>
                        </div>
                    );
                }

                // ---- GENE KEY: Special poetic layout ----
                if (title.toUpperCase().includes('GENE')) {
                    return (
                        <GlassPanel key={idx} className={`p-8 relative overflow-hidden ${config.borderColor} transition-all duration-500`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-50`} />
                            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.02] z-10" />

                            <div className="relative z-20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${config.accentColor}`}>
                                        {config.icon}
                                    </div>
                                    <div>
                                        <span className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">{config.label}</span>
                                        <div className="h-px w-16 bg-gradient-to-r from-pink-500/30 to-transparent mt-1" />
                                    </div>
                                </div>

                                <div className="border-l-2 border-pink-500/30 pl-6 py-2 italic">
                                    <div className="text-blue-50/80 leading-relaxed text-lg font-serif">
                                        {renderBody(body)}
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    );
                }

                // ---- Standard Module Card ----
                return (
                    <GlassPanel
                        key={idx}
                        className={`relative overflow-hidden group ${config.borderColor} transition-all duration-500 cursor-pointer`}
                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                    >
                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                        {/* Scanline */}
                        <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.02] z-10" />

                        <div className="relative z-20 p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${config.accentColor}`}>
                                        {config.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                                            {cleanTitle(title)}
                                            <span className={`w-1.5 h-1.5 rounded-full ${config.accentColor.replace('text', 'bg')} animate-pulse`} />
                                        </h3>
                                        <span className="text-[10px] font-mono text-white/20 tracking-[0.3em] uppercase">{config.label}</span>
                                    </div>
                                </div>

                                {/* Expand indicator */}
                                <div className={`text-white/20 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                                    <ChevronRightIcon className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Body */}
                            <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-32 opacity-90'}`}>
                                <div className="prose prose-invert max-w-none">
                                    {renderBody(body)}
                                </div>
                            </div>

                            {/* "Read more" fade overlay when collapsed */}
                            {!isExpanded && body.length > 200 && (
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-30 flex items-end justify-center pb-2">
                                    <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Tap to expand</span>
                                </div>
                            )}
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10" />
                    </GlassPanel>
                );
            })}
        </div>
    );
};

export default NarrativeSection;
