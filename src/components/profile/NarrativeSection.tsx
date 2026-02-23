import React, { useState, useMemo } from 'react';
import { useTrail, animated, config as springConfig } from 'react-spring';
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
    TerminalIcon,
    CrownIcon,
} from '../icons';

/**
 * NarrativeSection
 * ================
 * * NOTE: Parses structured LLM output and renders each narrative module 
 *   as a premium interactive card with staggered animations.
 *
 * ! IMPROVED: Handle both '### TITLE' and 'TITLE: Content' formats for resilience.
 */

interface NarrativeSectionProps {
    content: string;
    profileData?: any;
}

interface SectionData {
    id: number;
    title: string;
    body: string;
}

interface SectionConfig {
    icon: React.ReactNode;
    accentColor: string;
    bgGradient: string;
    borderColor: string;
    label: string;
    pattern?: string;
}

const getSectionConfig = (title: string): SectionConfig => {
    const t = title.toUpperCase();

    if (t.includes('ARCHETYPE'))
        return {
            icon: <CrownIcon className="w-5 h-5" />,
            accentColor: 'text-purple-400',
            bgGradient: 'from-purple-500/10 via-transparent to-transparent',
            borderColor: 'border-purple-500/20 hover:border-purple-500/40',
            label: 'ARCHETYPE DESIGNATION',
        };
    if (t.includes('CORE') || t.includes('IDENTITY'))
        return {
            icon: <CpuIcon className="w-5 h-5" />,
            accentColor: 'text-blue-400',
            bgGradient: 'from-blue-500/10 via-transparent to-transparent',
            borderColor: 'border-blue-500/20 hover:border-blue-500/40',
            label: 'CORE SYNTHESIS',
            pattern: 'bg-grid-white/[0.02]'
        };
    if (t.includes('DECISION'))
        return {
            icon: <CompassIcon className="w-5 h-5" />,
            accentColor: 'text-amber-400',
            bgGradient: 'from-amber-500/10 via-transparent to-transparent',
            borderColor: 'border-amber-500/20 hover:border-amber-500/40',
            label: 'DECISION ENGINE',
            pattern: 'bg-scanline opacity-[0.05]'
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
            label: 'BIO-RESONANCE',
            pattern: 'bg-dot-white/[0.05]'
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
            icon: <ZapIcon className="w-5 h-5" />,
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

    // Robust parsing logic
    const sections: SectionData[] = useMemo(() => {
        // First try splitting by '### '
        let parts = content.split('### ').filter(s => s.trim().length > 0);

        // If that failed (e.g. LLM used only headers or newlines), try a secondary split
        if (parts.length <= 1 && content.includes('\n\n')) {
            // Fallback: look for Title: Content pattern
            const matches = Array.from(content.matchAll(/([A-Z\s_]{3,}):([\s\S]+?)(?=[A-Z\s_]{3,}:|$)/g));
            if (matches.length > 0) {
                return matches.map((m, i) => ({
                    id: i,
                    title: m[1].trim().replace(/_/g, ' '),
                    body: m[2].trim()
                }));
            }
        }

        return parts.map((part, i) => {
            const lines = part.split('\n');
            const title = lines[0].trim().replace(/[\[\]]/g, '');
            const body = lines.slice(1).join('\n').trim();
            return {
                id: i,
                title,
                body
            };
        });
    }, [content]);

    // Memoize animation config to prevent recursion/feedback loops
    const trailConfig = React.useMemo(() => ({
        from: { opacity: 0, transform: 'translate3d(-20px,0,0) scale(0.95)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'translate3d(0,0,0) scale(1)', filter: 'blur(0px)' },
        config: springConfig.gentle,
        delay: 200,
    }), []);

    // Staggered animation for section reveals
    const trail = useTrail(sections.length, trailConfig);

    const renderBody = (body: string) => {
        return body.split('\n').filter(l => l.trim().length > 0).map((line, i) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                return (
                    <div key={i} className="flex items-start gap-3 py-1.5 group/line">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50 mt-2.5 flex-shrink-0 group-hover/line:scale-125 transition-transform" />
                        <span className="text-blue-50/70 leading-relaxed text-sm">{trimmed.replace(/^[-•]\s*/, '')}</span>
                    </div>
                );
            }
            return <p key={i} className="text-blue-50/80 leading-relaxed mb-4 text-sm md:text-base">{trimmed}</p>;
        });
    };

    return (
        <div className="space-y-6">
            {trail.map((style, idx) => {
                const section = sections[idx];
                const config = getSectionConfig(section.title);
                const isExpanded = expandedIdx === idx;

                // ---- ARCHETYPE: Dramatic Hero Module ----
                if (section.title.toUpperCase().includes('ARCHETYPE')) {
                    return (
                        <animated.div key={section.id} style={style} className="relative py-16 flex flex-col items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent blur-3xl -z-10 animate-pulse" />
                            <div className="mb-4 px-6 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm">
                                <span className="text-[10px] font-mono text-purple-400 tracking-[0.6em] uppercase font-bold">
                                    Archetype Designation
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/10 tracking-tighter uppercase italic text-center leading-[0.9]">
                                {section.body.trim()}
                            </h2>
                            <div className="mt-8 flex items-center gap-4">
                                <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-500/40" />
                                <div className="p-2 rounded-full border border-purple-500/20 bg-purple-500/5">
                                    <SparklesIcon className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-500/40" />
                            </div>
                        </animated.div>
                    );
                }

                // ---- Standard Interactive Module Card ----
                return (
                    <animated.div key={section.id} style={style}>
                        <GlassPanel
                            className={`relative overflow-hidden group transition-all duration-500 ${isExpanded ? 'ring-1 ring-white/10' : ''} ${config.borderColor}`}
                        >
                            {/* Visual patterns and gradients */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-40 transition-opacity duration-700`} />
                            {config.pattern && <div className={`absolute inset-0 pointer-events-none ${config.pattern} z-0`} />}

                            <div className="relative z-10 p-6 md:p-8">
                                <header
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] group-hover:border-white/20 transition-all duration-500 ${config.accentColor}`}>
                                            {config.icon}
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase block mb-1">{config.label}</span>
                                            <h3 className="text-lg md:text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                                                {section.title}
                                                <div className={`w-1.5 h-1.5 rounded-full ${config.accentColor.replace('text', 'bg')} animate-ping shadow-[0_0_8px_currentColor]`} />
                                            </h3>
                                        </div>
                                    </div>

                                    <div className={`p-2 rounded-full bg-white/5 border border-white/5 text-white/20 transition-all duration-500 ${isExpanded ? 'rotate-90 text-white' : 'group-hover:text-white/40'}`}>
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </div>
                                </header>

                                <div className={`mt-6 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isExpanded ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0 px-2'}`}>
                                    <div className="pt-6 border-t border-white/5">
                                        <div className="prose prose-invert max-w-none">
                                            {renderBody(section.body)}
                                        </div>

                                        {/* Dynamic stats footer if profile data matches this section */}
                                        {(section.title.toUpperCase().includes('SYNTHESIS') || section.title.toUpperCase().includes('IDENTITY')) && profileData?.astrology && (
                                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                <div className="text-center">
                                                    <div className="text-[9px] font-mono text-white/20 uppercase mb-1">Sun Sign</div>
                                                    <div className="text-xs font-bold text-white">{profileData.astrology.sun?.sign}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[9px] font-mono text-white/20 uppercase mb-1">Moon Sign</div>
                                                    <div className="text-xs font-bold text-white">{profileData.astrology.moon?.sign}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[9px] font-mono text-white/20 uppercase mb-1">Human Design</div>
                                                    <div className="text-xs font-bold text-white">{profileData.humanDesign?.type}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-[9px] font-mono text-white/20 uppercase mb-1">Life Path</div>
                                                    <div className="text-xs font-bold text-white">{profileData.numerology?.lifePath}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {!isExpanded && (
                                    <div
                                        className="mt-4 flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] cursor-pointer hover:text-white/40 transition-colors"
                                        onClick={() => setExpandedIdx(idx)}
                                    >
                                        <TerminalIcon className="w-3 h-3" />
                                        Initialize Deep Analysis...
                                    </div>
                                )}
                            </div>

                            {/* Corner Tech Accents */}
                            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                                <div className="absolute top-0 right-0 w-px h-4 bg-gradient-to-b from-white/20 to-transparent" />
                                <div className="absolute top-0 right-0 h-px w-4 bg-gradient-to-l from-white/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                                <div className="absolute bottom-0 left-0 w-px h-4 bg-gradient-to-t from-white/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 h-px w-4 bg-gradient-to-r from-white/20 to-transparent" />
                            </div>
                        </GlassPanel>
                    </animated.div>
                );
            })}
        </div>
    );
};

export default NarrativeSection;
