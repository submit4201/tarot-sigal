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
import {
    InfoIcon,
    SparklesIcon,
    TerminalIcon,
    ShieldIcon,
    LockIcon,
    ZapIcon,
    ShieldAlertIcon
} from '../components/icons';

// Solfeggio frequency mapping (matches server/core/synthesis_engine.py)
const SOLFEGGIO_MAP: Record<number, number> = {
    1: 174, 2: 285, 3: 396, 4: 417, 5: 528,
    6: 639, 7: 741, 8: 852, 9: 963,
    11: 528, 22: 432, 33: 963
};

// Helper to get house for a degree
const getHouseForDegree = (degree: number | undefined, houses: number[]): number => {
    if (degree === undefined || !houses || houses.length === 0) return 1;
    // Iterate through houses to find which one contains the degree
    for (let i = 0; i < 11; i++) {
        const cusp = houses[i];
        const nextCusp = houses[i + 1];
        if (cusp < nextCusp) {
            if (degree >= cusp && degree < nextCusp) return i + 1;
        } else {
            // Cusp wraps around 360/0
            if (degree >= cusp || degree < nextCusp) return i + 1;
        }
    }
    return 12;
};

// Sign data for elements and modalities
const SIGN_DATA: Record<string, { element: string, modality: string }> = {
    'Aries': { element: 'Fire', modality: 'Cardinal' },
    'Taurus': { element: 'Earth', modality: 'Fixed' },
    'Gemini': { element: 'Air', modality: 'Mutable' },
    'Cancer': { element: 'Water', modality: 'Cardinal' },
    'Leo': { element: 'Fire', modality: 'Fixed' },
    'Virgo': { element: 'Earth', modality: 'Mutable' },
    'Libra': { element: 'Air', modality: 'Cardinal' },
    'Scorpio': { element: 'Water', modality: 'Fixed' },
    'Sagittarius': { element: 'Fire', modality: 'Mutable' },
    'Capricorn': { element: 'Earth', modality: 'Cardinal' },
    'Aquarius': { element: 'Air', modality: 'Fixed' },
    'Pisces': { element: 'Water', modality: 'Mutable' }
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
    const [birthDate, setBirthDate] = useState<string>('');
    const [birthTime, setBirthTime] = useState<string>('');
    const [birthLocation, setBirthLocation] = useState<string>('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await birthProfileService.get();
            setProfile(data);
        } catch (err: any) {
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
                                value={birthLocation || ''}
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

    const getEnhancedBigThree = () => {
        if (!astroData) return [];
        const houseList = astroData.houses || [];

        return [
            {
                label: 'SUN',
                sign: astroData.sun?.sign,
                degree: astroData.sun?.degreeInSign,
                sabian: astroData.sun?.sabian,
                tarot: astroData.sun?.decanTarot,
                color: 'amber',
                house: getHouseForDegree(astroData.sun?.degree, houseList)
            },
            {
                label: 'MOON',
                sign: astroData.moon?.sign,
                degree: astroData.moon?.degreeInSign,
                sabian: astroData.moon?.sabian,
                tarot: astroData.moon?.decanTarot,
                color: 'cyan',
                house: getHouseForDegree(astroData.moon?.degree, houseList)
            },
            {
                label: 'RISING',
                sign: astroData.ascendant?.sign,
                degree: astroData.ascendant?.degreeInSign,
                sabian: astroData.ascendant?.sabian,
                tarot: astroData.ascendant?.decanTarot,
                color: 'purple',
                house: 1
            },
        ];
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 space-y-12 pb-24">
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

                {/* Planetary Alignment Matrix */}
                {fullData && astroData && (
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Planetary Alignment Matrix</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {[
                                { key: 'sun', label: 'Sun', color: 'amber' },
                                { key: 'moon', label: 'Moon', color: 'cyan' },
                                { key: 'mercury', label: 'Mercury', color: 'blue' },
                                { key: 'venus', label: 'Venus', color: 'pink' },
                                { key: 'mars', label: 'Mars', color: 'red' },
                                { key: 'jupiter', label: 'Jupiter', color: 'orange' },
                                { key: 'saturn', label: 'Saturn', color: 'stone' },
                                { key: 'uranus', label: 'Uranus', color: 'teal' },
                                { key: 'neptune', label: 'Neptune', color: 'indigo' },
                                { key: 'pluto', label: 'Pluto', color: 'purple' },
                                { key: 'ascendant', label: 'Rising', color: 'fuchsia' }
                            ].map((planet) => {
                                const data = (astroData as any)[planet.key];
                                if (!data) return null;

                                const colorMap: any = {
                                    amber: 'text-amber-400 border-amber-500/10 hover:border-amber-500/30 bg-amber-500/5',
                                    cyan: 'text-cyan-400 border-cyan-500/10 hover:border-cyan-500/30 bg-cyan-500/5',
                                    blue: 'text-blue-400 border-blue-500/10 hover:border-blue-500/30 bg-blue-500/5',
                                    pink: 'text-pink-400 border-pink-500/10 hover:border-pink-500/30 bg-pink-500/5',
                                    red: 'text-red-400 border-red-500/10 hover:border-red-500/30 bg-red-500/5',
                                    orange: 'text-orange-400 border-orange-500/10 hover:border-orange-500/30 bg-orange-500/5',
                                    stone: 'text-stone-400 border-stone-500/10 hover:border-stone-500/30 bg-stone-500/5',
                                    teal: 'text-teal-400 border-teal-500/10 hover:border-teal-500/30 bg-teal-500/5',
                                    indigo: 'text-indigo-400 border-indigo-500/10 hover:border-indigo-500/30 bg-indigo-500/5',
                                    purple: 'text-purple-400 border-purple-500/10 hover:border-purple-500/30 bg-purple-500/5',
                                    fuchsia: 'text-fuchsia-400 border-fuchsia-500/10 hover:border-fuchsia-500/30 bg-fuchsia-500/5'
                                };

                                return (
                                    <GlassPanel key={planet.key} className={`p-4 group ${colorMap[planet.color]} transition-all duration-300 relative overflow-hidden`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40">{planet.label}</span>
                                            <span className="text-[10px] font-mono opacity-20">{data.degreeInSign?.toFixed(1)}°</span>
                                        </div>
                                        <div className="text-xl font-black text-white uppercase tracking-tight mb-3 group-hover:scale-110 transition-transform origin-left">
                                            {data.sign}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] leading-tight text-white/40 italic line-clamp-2 min-h-[2.5em] group-hover:text-white/60 transition-colors">
                                                "{data.sabian}"
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider opacity-30 group-hover:opacity-60 transition-opacity">
                                                <span>⟡</span>
                                                <span>{data.decanTarot}</span>
                                            </div>
                                        </div>
                                    </GlassPanel>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            {/* Narrative Section moved up for clearer hierarchy */}
            <div className="max-w-5xl mx-auto w-full">
                <NarrativeSection
                    content={isTeaser ? (profile as BirthProfileTeaser).auraPreview : fullData?.llmNarrative || ''}
                    profileData={pData}
                />
            </div>

            {isTeaser && (
                <div className="max-w-2xl mx-auto">
                    <GlassPanel className="p-8 border-purple-500/50 relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <LockIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-white uppercase italic mb-2 tracking-tighter">Upgrade to Oracle Tier</h3>
                        <p className="text-purple-200/60 mb-4 italic text-sm">
                            You're seeing the outer shell of a 8-module deep profile.
                        </p>
                        <CyberButton variant="primary" onClick={() => window.location.hash = '#pricing'} className="w-full">
                            UNLOCK FULL NEURAL BLUEPRINT
                        </CyberButton>
                    </GlassPanel>
                </div>
            )}

            {!isTeaser && fullData && pData && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
                        <div className="lg:col-span-6 space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-px bg-purple-500"></span>
                                COSMIC_COMPASS [v2.0]
                            </h2>
                            <GlassPanel className="aspect-square flex items-center justify-center overflow-hidden p-8 border-white/5 group hover:border-purple-500/20 transition-all relative">
                                <CosmicCompass data={pData} />
                            </GlassPanel>
                        </div>

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

                    {/* Bento Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto auto-rows-[120px]">
                        {/* Life Path - Double Width/Height */}
                        <GlassPanel className="col-span-2 row-span-2 p-6 flex flex-col items-center justify-center text-center group border-white/5 hover:border-purple-500/40 hover:bg-white/5 transition-all relative overflow-hidden">
                            <div className="absolute top-0 left-0 p-4 font-mono text-[8px] text-white/5 uppercase tracking-widest">Neural Frequency</div>
                            <div className="text-6xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform mb-3">{numData?.lifePath}</div>
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 mb-4 transition-colors">Life Path</h4>
                            <div className="px-4 py-2 rounded-lg bg-black border border-purple-500/20 text-[9px] font-mono text-purple-400 uppercase tracking-widest group-hover:border-purple-500/50 transition-all">
                                {SOLFEGGIO_MAP[numData?.lifePath] || 432}Hz RESONANCE
                            </div>
                        </GlassPanel>

                        {/* Human Design - Double Width/Height */}
                        <GlassPanel className="col-span-2 row-span-2 p-6 flex flex-col items-center justify-center text-center group border-white/5 hover:border-amber-500/40 hover:bg-white/5 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/5 uppercase tracking-widest">Design Logic</div>
                            <div className="text-3xl font-black text-white uppercase tracking-tighter group-hover:scale-105 transition-transform mb-3">{hdData?.type}</div>
                            <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 mb-4">Aura Mechanism</h4>
                            <div className="grid grid-cols-1 gap-2 w-full max-w-[220px]">
                                <div className="text-[9px] font-mono py-1.5 px-3 rounded border border-white/10 bg-white/[0.02] text-white/60 uppercase tracking-widest flex justify-between">
                                    <span className="text-white/20">AUTH:</span> {hdData?.authority}
                                </div>
                                <div className="text-[9px] font-mono py-1.5 px-3 rounded border border-white/10 bg-white/[0.02] text-white/60 uppercase tracking-widest flex justify-between">
                                    <span className="text-white/20">PROF:</span> {hdData?.profile}
                                </div>
                                <div className="text-[9px] font-mono py-1.5 px-3 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 uppercase tracking-widest flex justify-between">
                                    <span className="text-indigo-300/40">G-KEY:</span> {hdData?.primaryGeneKey?.key} ({hdData?.primaryGeneKey?.lines[1]})
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Core Attributes */}
                        <GlassPanel className="p-4 flex flex-col items-center justify-center text-center group border-white/5 hover:border-blue-500/30 transition-all bg-white/[0.02]">
                            <div className="text-2xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{numData?.soulUrge}</div>
                            <h4 className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Soul Urge</h4>
                        </GlassPanel>

                        <GlassPanel className="p-4 flex flex-col items-center justify-center text-center group border-white/5 hover:border-pink-500/30 transition-all bg-white/[0.02]">
                            <div className="text-2xl font-black text-white mb-1 group-hover:scale-110 transition-transform">{numData?.destiny}</div>
                            <h4 className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Destiny</h4>
                        </GlassPanel>

                        <GlassPanel className="p-4 flex flex-col items-center justify-center text-center group border-white/5 hover:border-teal-500/30 transition-all bg-white/[0.02] relative">
                            <div className="text-xl font-black text-white leading-tight uppercase group-hover:scale-110 transition-transform truncate w-full flex items-center justify-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-teal-500 animate-pulse"></div>
                                {easternData?.baZi?.dayMaster}
                            </div>
                            <h4 className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">Neural Core (BaZi)</h4>
                            {easternData?.baZi?.elementDist && (
                                <div className="flex gap-0.5 w-full h-1 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                    {Object.entries(easternData.baZi.elementDist).map(([el, val]: any) => (
                                        <div
                                            key={el}
                                            title={`${el}: ${val}%`}
                                            className={`h-full ${el === 'Wood' ? 'bg-emerald-500' :
                                                el === 'Fire' ? 'bg-red-500' :
                                                    el === 'Earth' ? 'bg-amber-700' :
                                                        el === 'Metal' ? 'bg-slate-300' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${val}%` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </GlassPanel>

                        <GlassPanel className="p-4 flex flex-col items-center justify-center text-center group border-white/5 hover:border-emerald-500/30 transition-all bg-white/[0.02]">
                            <div className="text-xl font-black text-white leading-tight uppercase group-hover:scale-110 transition-transform truncate w-full">{easternData?.celticTree}</div>
                            <h4 className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/30">Celtic Tree</h4>
                        </GlassPanel>

                        {/* Dynamic Aspects - Double Width/Double Height */}
                        {astroData?.aspects && astroData.aspects.length > 0 && (
                            <GlassPanel className="col-span-2 row-span-2 p-6 flex flex-col group border-white/5 hover:border-indigo-500/40 hover:bg-white/5 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/5 uppercase tracking-widest">Neural Blueprint</div>
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 mb-4">Dynamic Aspects</h4>

                                <div className="space-y-3 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
                                    {astroData.aspects.map((asp: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 group/asp hover:border-indigo-500/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-white/80">{asp.p1}</span>
                                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded skew-x-[-10deg] ${asp.aspect === 'Conjunction' ? 'bg-amber-500/20 text-amber-400' :
                                                    asp.aspect === 'Opposition' ? 'bg-red-500/20 text-red-400' :
                                                        asp.aspect === 'Square' ? 'bg-orange-500/20 text-orange-400' :
                                                            asp.aspect === 'Trine' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {asp.aspect}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/80">{asp.p2}</span>
                                            </div>
                                            <div className="text-[9px] font-mono text-white/20 italic">
                                                orb {asp.orb.toFixed(1)}°
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassPanel>
                        )}

                        {/* Hero's Arc (Progressed Moon) - Double Width/Height */}
                        {progData && (
                            <GlassPanel className="col-span-2 row-span-2 p-6 flex flex-col group border-white/5 hover:border-fuchsia-500/40 hover:bg-white/5 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-white/5 uppercase tracking-widest">Temporal Flow</div>
                                <h4 className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40 mb-4">Hero's Arc</h4>

                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="text-[10px] font-mono text-fuchsia-500 uppercase tracking-widest mb-1">{progData.heroArc}</div>
                                    <div className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-fuchsia-400 transition-colors">
                                        {progData.phaseName}
                                    </div>
                                    <p className="text-[10px] text-white/40 italic leading-relaxed mb-4">
                                        "{progData.phaseDescription}"
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-white/20">
                                            <span>Phase Progress</span>
                                            <span>{progData.phaseProgress}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 transition-all duration-1000"
                                                style={{ width: `${progData.phaseProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </GlassPanel>
                        )}

                        {/* Full Width Callout: Karmic Debts */}
                        {numData?.karmicDebts?.length > 0 && (
                            <GlassPanel className="col-span-2 p-4 flex items-center justify-between group border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center gap-4">
                                    <ShieldAlertIcon className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="text-[9px] font-mono text-orange-400/60 tracking-[0.3em] uppercase">Karmic Load Detected</h4>
                                        <div className="flex gap-2 items-center mt-1">
                                            {numData.karmicDebts.map((debt: number) => (
                                                <span key={debt} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-[10px] font-mono rounded-md border border-orange-500/10">
                                                    #{debt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <InfoIcon className="w-4 h-4 text-white/10" />
                            </GlassPanel>
                        )}
                    </div>
                </>
            )}

            <div className="text-[8px] font-mono text-white/20 text-center pt-8 uppercase tracking-[0.5em]">
                Synthesis_Protocol_v2.5.1_ALIGNED
            </div>
        </div>
    );
};

export default BirthProfilePage;
