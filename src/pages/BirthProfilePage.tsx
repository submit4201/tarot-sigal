import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import CosmicCompass from '../components/CosmicCompass';
import PowerPlaceMap from '../components/PowerPlaceMap';
import AudioResonance from '../components/AudioResonance';
import NarrativeSection from '../components/profile/NarrativeSection';
import { BirthProfileData, BirthProfileTeaser } from '../types';
import { birthProfile as birthProfileService } from '../services/apiService';
import { InfoIcon, SparklesIcon, TerminalIcon, ShieldIcon, LockIcon } from '../components/icons';

// Solfeggio frequency mapping (matches server/core/synthesis_engine.py)
const SOLFEGGIO_MAP: Record<number, number> = {
    1: 174, 2: 285, 3: 396, 4: 417, 5: 528,
    6: 639, 7: 741, 8: 852, 9: 963,
    11: 528, 22: 432, 33: 963
};

const BirthProfilePage: React.FC = () => {
    const { user } = useAuth();
    const { activeProfile } = useApp();
    const [loading, setLoading] = useState(false);
    const [isInitialFetch, setIsInitialFetch] = useState(true);
    const [profile, setProfile] = useState<BirthProfileData | BirthProfileTeaser | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [fullName, setFullName] = useState(activeProfile?.givenName || '');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthLocation, setBirthLocation] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await birthProfileService.get();
            setProfile(data);
        } catch (err: any) {
            // Only log if it's not a 404 or "not found"
            if (!err.message?.includes('404') && !err.toString().includes('not found')) {
                console.error("Failed to fetch birth profile", err);
            }
        } finally {
            setIsInitialFetch(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await birthProfileService.update({
                fullName,
                birthDate,
                birthTime,
                birthLocation
            });
            setProfile(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isInitialFetch) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <TerminalIcon className="w-12 h-12 text-purple-500 animate-pulse mb-4" />
                <div className="font-mono text-sm text-purple-400 tracking-widest uppercase animate-pulse">
                    Accessing Cosmic Secure_Shell...
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">
                        The Birth Profile
                    </h1>
                    <p className="text-purple-400 font-mono text-sm uppercase tracking-widest max-w-xl mx-auto">
                        Your origin data is the encrypted seed of your entire holism. Provide your credentials to begin synthesis.
                    </p>
                </div>

                <GlassPanel className="p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/10 select-none">SYSTEM_INIT_v2.1</div>
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03]" />

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <CyberInput
                                label="Full Legal Birth Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name at birth"
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CyberInput
                                    label="Birth Date"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    required
                                />
                                <CyberInput
                                    label="Birth Time"
                                    type="time"
                                    value={birthTime}
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    required
                                />
                            </div>
                            <CyberInput
                                label="Birth Location"
                                value={birthLocation}
                                onChange={(e) => setBirthLocation(e.target.value)}
                                placeholder="City, Country"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 font-mono text-sm animate-shake">
                                <ShieldIcon className="w-4 h-4" />
                                <span>SYNTHESIS_ERROR: {error}</span>
                            </div>
                        )}

                        <CyberButton
                            type="submit"
                            variant="primary"
                            className="w-full py-4 text-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5 animate-spin" />
                                    ENCRYPTING_ORIGIN...
                                </span>
                            ) : 'GENERATE HOLISTIC PROFILE'}
                        </CyberButton>

                        <div className="pt-4 flex items-center gap-3 text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] justify-center">
                            <LockIcon className="w-3 h-3" />
                            Data secured with end-to-end cosmic encryption
                        </div>
                    </form>
                </GlassPanel>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                    {[
                        { icon: <SparklesIcon className="w-4 h-4" />, title: 'LLM Synthesis', desc: 'Neural narrative generated from your big three.' },
                        { icon: <InfoIcon className="w-4 h-4" />, title: 'Bio-Resonance', desc: 'Lifestyle protocols tuned to your elementals.' },
                        { icon: <ShieldIcon className="w-4 h-4" />, title: 'Oracle Secure', desc: 'Your cosmic fingerprint is yours alone.' },
                    ].map((feature, i) => (
                        <div key={i} className="flex gap-3 text-left">
                            <div className="mt-1 text-purple-500">{feature.icon}</div>
                            <div>
                                <h4 className="font-bold text-white text-xs uppercase tracking-wider">{feature.title}</h4>
                                <p className="text-[10px] text-white/40">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const isTeaser = 'isPremiumLocked' in profile;
    const fullData = !isTeaser ? (profile as BirthProfileData) : null;
    const pData = fullData?.profileData;
    const numData = pData?.numerology;
    const astroData = pData?.astrology;
    const easternData = pData?.eastern;
    const hdData = pData?.humanDesign;
    const progData = pData?.progressedMoon;

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 space-y-12 pb-24">
            {/* ================================================================ */}
            {/* HERO HEADER — Above the fold, immediate impact                    */}
            {/* ================================================================ */}
            <header className="relative border-b border-white/5 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-2 py-0.5 bg-purple-500 text-[10px] font-black uppercase text-black italic skew-x-[-12deg]">
                                System_Verified
                            </div>
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">
                                UID: {user?.id.substring(0, 8) || 'GUEST_PROTO'}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {isTeaser ? 'Cosmic Teaser' : 'Birth Profile'}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <p className="text-purple-400 font-mono text-sm tracking-widest uppercase">
                                Origin: {fullData ? fullData.birthLocation : 'Unknown Segment'}
                            </p>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <p className="text-white/40 font-mono text-[10px] uppercase">
                                Stardust_Level: {activeProfile?.level || 1}
                            </p>
                        </div>
                    </div>
                    {fullData && numData && <AudioResonance lifePath={numData.lifePath} />}
                </div>

                {/* ---- BIG THREE QUICK GLANCE (above the fold) ---- */}
                {fullData && astroData && (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {[
                            { label: 'SUN', sign: astroData.sun?.sign, degree: astroData.sun?.degreeInSign, sabian: astroData.sun?.sabian, tarot: astroData.sun?.decanTarot, color: 'amber' },
                            { label: 'MOON', sign: astroData.moon?.sign, degree: astroData.moon?.degreeInSign, sabian: astroData.moon?.sabian, tarot: astroData.moon?.decanTarot, color: 'cyan' },
                            { label: 'RISING', sign: astroData.ascendant?.sign, degree: astroData.ascendant?.degreeInSign, sabian: astroData.ascendant?.sabian, tarot: astroData.ascendant?.decanTarot, color: 'purple' },
                        ].map((item, i) => (
                            <GlassPanel key={i} className={`p-4 group border-${item.color}-500/10 hover:border-${item.color}-500/30 transition-all duration-500 cursor-default`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-2 h-2 rounded-full bg-${item.color}-400 animate-pulse`} />
                                    <span className="text-[10px] font-mono text-white/30 tracking-[0.4em] uppercase">{item.label}</span>
                                </div>
                                <div className="text-2xl font-black text-white uppercase tracking-tight">{item.sign}</div>
                                <div className="text-[10px] font-mono text-white/40 mt-1">{item.degree}°</div>
                                {/* Sabian Symbol — the real value add */}
                                <div className={`mt-3 pt-3 border-t border-white/5 text-xs text-${item.color}-200/50 italic leading-relaxed line-clamp-2`}>
                                    "{item.sabian}"
                                </div>
                                <div className={`text-[10px] font-mono text-${item.color}-400/40 mt-1`}>⟡ {item.tarot}</div>
                            </GlassPanel>
                        ))}
                    </div>
                )}
            </header>

            {/* ================================================================ */}
            {/* HERO'S ARC PROGRESS BAR — Current life chapter at a glance        */}
            {/* ================================================================ */}
            {fullData && progData && progData.phaseName && (
                <div className="max-w-5xl mx-auto w-full">
                    <GlassPanel className="p-6 border-indigo-500/10 hover:border-indigo-500/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">HERO'S ARC</span>
                                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-mono rounded-full uppercase tracking-wide">
                                    {progData.heroArc}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-white/30">
                                Year {progData.cycleYear} of 27.3
                            </span>
                        </div>

                        {/* Phase name */}
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-3">{progData.phaseName}</h3>

                        {/* Progress bar */}
                        <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progData.phaseProgress || 0}%` }}
                            />
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-sm opacity-50"
                                style={{ width: `${progData.phaseProgress || 0}%` }}
                            />
                        </div>

                        <p className="text-sm text-white/50 leading-relaxed">{progData.phaseAction}</p>
                    </GlassPanel>
                </div>
            )}

            {/* ================================================================ */}
            {/* NARRATIVE — The main LLM-generated content                        */}
            {/* ================================================================ */}
            <div className="max-w-5xl mx-auto w-full">
                <NarrativeSection
                    content={isTeaser ? (profile as BirthProfileTeaser).auraPreview : fullData?.llmNarrative || ''}
                    profileData={pData}
                />
            </div>

            {/* ================================================================ */}
            {/* PREMIUM LOCK TEASER                                              */}
            {/* ================================================================ */}
            {isTeaser && (
                <div className="max-w-2xl mx-auto">
                    <GlassPanel className="p-8 border-purple-500/50 relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <LockIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tighter">Upgrade to Oracle Tier</h3>
                        <p className="text-purple-200/60 mb-4 italic">
                            You're seeing the outer shell of a 8-module deep profile.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-6 max-w-sm mx-auto text-left">
                            {['Decision Engine', 'Prosperity Map', 'Bio-Resonance', "Hero's Arc", 'Ancestral Echo', 'Gene Key Transmission'].map((mod, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-white/40">
                                    <LockIcon className="w-3 h-3 text-purple-500/40" />
                                    <span>{mod}</span>
                                </div>
                            ))}
                        </div>
                        <CyberButton variant="primary" onClick={() => window.location.hash = '#pricing'} className="w-full">
                            UNLOCK FULL NEURAL BLUEPRINT
                        </CyberButton>
                    </GlassPanel>
                </div>
            )}

            {/* ================================================================ */}
            {/* INTERACTIVE VISUALIZATIONS                                        */}
            {/* ================================================================ */}
            {!isTeaser && fullData && pData && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                    {/* The Cosmic Compass */}
                    <div className="lg:col-span-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-px bg-purple-500"></span>
                            COSMIC_COMPASS [v2.0]
                        </h2>
                        <GlassPanel className="aspect-square flex items-center justify-center overflow-hidden p-8 border-white/5 group hover:border-purple-500/20 transition-all">
                            <CosmicCompass data={pData} />
                        </GlassPanel>
                    </div>

                    {/* The Power Place Map */}
                    <div className="lg:col-span-6 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-px bg-teal-500"></span>
                            SIGNAL_HOTSPOTS [v2.4]
                        </h2>
                        <GlassPanel className="aspect-square relative overflow-hidden border-white/5 group hover:border-teal-500/20 transition-all">
                            <PowerPlaceMap data={pData.astrology} />
                        </GlassPanel>
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* DATA DASHBOARD — 6-stat grid for at-a-glance profile data         */}
            {/* ================================================================ */}
            {!isTeaser && fullData && pData && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
                    {[
                        { label: 'Life Path', value: numData?.lifePath, color: 'purple', sub: `${SOLFEGGIO_MAP[numData?.lifePath] || 432}Hz` },
                        { label: 'Soul Urge', value: numData?.soulUrge, color: 'blue', sub: 'Inner Drive' },
                        { label: 'Destiny', value: numData?.destiny, color: 'pink', sub: 'Life Purpose' },
                        { label: 'Day Master', value: easternData?.baZi?.dayMaster, color: 'teal', sub: 'BaZi Element' },
                        { label: 'HD Type', value: hdData?.type, color: 'amber', sub: hdData?.authority },
                        { label: 'Celtic Tree', value: easternData?.celticTree, color: 'emerald', sub: 'Ogham Zodiac' },
                    ].map((stat, i) => (
                        <GlassPanel key={i} className={`p-4 flex flex-col items-center justify-center text-center group border-white/5 hover:border-${stat.color}-500/20 hover:bg-white/5 transition-all`}>
                            <h4 className="text-[10px] font-mono mb-2 uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{stat.label}</h4>
                            <div className="text-2xl md:text-3xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</div>
                            <div className={`mt-2 text-[9px] font-mono text-${stat.color}-400/40 uppercase tracking-wider`}>{stat.sub}</div>
                        </GlassPanel>
                    ))}
                </div>
            )}

            {/* Karmic Debts callout (if any) */}
            {!isTeaser && numData?.karmicDebts && numData.karmicDebts.length > 0 && (
                <div className="max-w-5xl mx-auto">
                    <GlassPanel className="p-4 border-orange-500/20 bg-orange-500/5">
                        <div className="flex items-center gap-3">
                            <ShieldIcon className="w-5 h-5 text-orange-400" />
                            <div>
                                <span className="text-[10px] font-mono text-orange-400/60 tracking-[0.3em] uppercase">KARMIC DEBTS DETECTED</span>
                                <div className="flex gap-2 mt-1">
                                    {numData.karmicDebts.map((debt: number) => (
                                        <span key={debt} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs font-mono rounded-full">
                                            #{debt}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};

export default BirthProfilePage;
