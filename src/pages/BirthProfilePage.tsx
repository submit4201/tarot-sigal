import React, { useState, useEffect } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import PowerPlaceMap from '../components/PowerPlaceMap';
import AudioResonance from '../components/AudioResonance';
import NarrativeSection from '../components/profile/NarrativeSection';
import InteractiveNatalChart from '../components/profile/InteractiveNatalChart';
import StoryModeOverlay from '../components/profile/StoryModeOverlay';
import { BirthProfileData, BirthProfileTeaser } from '../types';
import { birthProfile as birthProfileService } from '../services/apiService';
import {
    InfoIcon,
    SparklesIcon,
    TerminalIcon,
    ShieldIcon,
    LockIcon,
    ShieldAlertIcon
} from '../components/icons';

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
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [profile, setProfile] = useState<BirthProfileData | BirthProfileTeaser | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [storyModePlanet, setStoryModePlanet] = useState<any | null>(null);

    // Form states
    const [fullName, setFullName] = useState(activeProfile?.givenName || '');
    const [birthDate, setBirthDate] = useState<string>('');
    const [birthTime, setBirthTime] = useState<string>('');
    const [birthLocation, setBirthLocation] = useState<string>('');
    const [profileLabel, setProfileLabel] = useState<string>('');

    useEffect(() => {
        fetchProfiles();
    }, []);

    /** Fetch all birth profiles for the current user */
    const fetchProfiles = async () => {
        try {
            const data = await birthProfileService.list();
            const list = Array.isArray(data) ? data : [];
            setProfiles(list);
            // Auto-select the primary profile, or the first one
            if (list.length > 0) {
                const primary = list.find((p: any) => p.isPrimary || p.is_primary) || list[0];
                setSelectedProfileId(primary.id);
                setProfile(primary);
            }
        } catch (err: any) {
            if (!err.message?.includes('404') && !err.toString().includes('not found')) {
                console.error("Failed to fetch birth profiles", err);
            }
        } finally {
            setIsInitialFetch(false);
        }
    };

    /** Switch to a different profile */
    const handleSelectProfile = (id: string) => {
        setSelectedProfileId(id);
        const found = profiles.find((p: any) => p.id === id);
        if (found) setProfile(found);
    };

    /** Create a new birth profile (own or friend) */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newProfile = await birthProfileService.create({
                fullName,
                birthDate,
                birthTime,
                birthLocation,
                label: profileLabel || (profiles.length === 0 ? 'Me' : fullName.split(' ')[0]),
            });
            // Refresh list after creation
            const updatedList = await birthProfileService.list();
            const list = Array.isArray(updatedList) ? updatedList : [];
            setProfiles(list);

            // Auto-select the newly created profile instead of the primary
            const newId = newProfile?.id;
            if (newId) {
                const found = list.find((p: any) => p.id === newId);
                if (found) {
                    setSelectedProfileId(newId);
                    setProfile(found);
                }
            } else if (list.length > 0) {
                // Fallback: select the most recently created profile
                const latest = list[list.length - 1];
                setSelectedProfileId(latest.id);
                setProfile(latest);
            }

            setShowAddForm(false);
            // Reset form
            setFullName('');
            setBirthDate('');
            setBirthTime('');
            setBirthLocation('');
            setProfileLabel('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /** Delete a non-primary profile */
    const handleDelete = async (profileId: string) => {
        if (!confirm('Delete this birth profile? This cannot be undone.')) return;
        try {
            await birthProfileService.delete(profileId);
            await fetchProfiles();
        } catch (err: any) {
            setError(err.message);
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

    if (!profile || showAddForm) {
        return (
            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase italic">
                        {showAddForm ? 'Add a Friend\'s Chart' : 'The Birth Profile'}
                    </h1>
                    <p className="text-purple-400 font-mono text-sm uppercase tracking-widest max-w-xl mx-auto">
                        {showAddForm
                            ? 'Add a friend\'s birth data to generate their cosmic blueprint.'
                            : 'Your origin data is the encrypted seed of your entire holism. Provide your credentials to begin synthesis.'}
                    </p>
                    {showAddForm && (
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="text-xs font-mono text-white/40 hover:text-white/70 uppercase tracking-widest transition-colors"
                        >
                            ← Back to profiles
                        </button>
                    )}
                </div>

                <GlassPanel className="p-8 md:p-12 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-white/10 select-none">SYSTEM_INIT_v2.1</div>
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03]" />

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            {showAddForm && (
                                <CyberInput
                                    label="Profile Label"
                                    value={profileLabel}
                                    onChange={(e) => setProfileLabel(e.target.value)}
                                    placeholder="e.g., Sarah, Alex, Mom..."
                                />
                            )}
                            <CyberInput
                                label="Full Legal Birth Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full name at birth"
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
                            ) : showAddForm ? 'ADD FRIEND\'S PROFILE' : 'GENERATE HOLISTIC PROFILE'}
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



    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 space-y-12 pb-24">
            {/* Profile Switcher Tabs */}
            {profiles.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 mb-4">
                    {profiles.map((p: any) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelectProfile(p.id)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg font-mono text-xs uppercase tracking-widest transition-all whitespace-nowrap group ${selectedProfileId === p.id
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 border-b-transparent'
                                : 'text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {(p.isPrimary || p.is_primary) && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            )}
                            <span>{p.label || p.fullName?.split(' ')[0] || 'Profile'}</span>
                            {/* Delete button for non-primary profiles */}
                            {!(p.isPrimary || p.is_primary) && selectedProfileId === p.id && (
                                <span
                                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                                    className="ml-2 text-red-400/50 hover:text-red-400 cursor-pointer transition-colors text-[10px]"
                                    title="Delete this profile"
                                >
                                    ✕
                                </span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-1 px-4 py-2 text-white/20 hover:text-purple-400 font-mono text-xs uppercase tracking-widest transition-all hover:bg-purple-500/10 rounded-t-lg border border-transparent"
                    >
                        <SparklesIcon className="w-3 h-3" />
                        <span>Add Friend</span>
                    </button>
                </div>
            )}
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
                    {/* Cosmic Compass Full Width */}
                    <div className="max-w-4xl mx-auto w-full space-y-4 mb-16">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                Neural Chart [v2.0]
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
                        </div>
                        <GlassPanel className="aspect-square w-full max-w-2xl mx-auto flex items-center justify-center overflow-hidden p-2 md:p-8 border-purple-500/20 bg-black/40 relative shadow-[0_0_50px_rgba(168,85,247,0.05)] group hover:shadow-[0_0_80px_rgba(168,85,247,0.1)] transition-all duration-700">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                            {astroData && <InteractiveNatalChart
                                data={pData}
                                onPlanetClick={(planet) => setStoryModePlanet(planet)}
                            />}
                        </GlassPanel>
                        <div className="text-center font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] animate-pulse">
                            Tap planetary nodes for an immersive sequence decryption
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mb-16 space-y-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-border text-2xl font-black text-white uppercase italic tracking-tighter">
                                SIGNAL_HOTSPOTS [v2.4]
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent" />
                        </div>
                        <GlassPanel className="h-[400px] w-full relative overflow-hidden border-teal-500/20 group hover:border-teal-500/40 transition-all shadow-[0_0_30px_rgba(20,184,166,0.05)] hover:shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                            <PowerPlaceMap data={pData.astrology} />
                        </GlassPanel>
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

            {/* Story Mode Overlay */}
            {storyModePlanet && (
                <StoryModeOverlay
                    isOpen={!!storyModePlanet}
                    onClose={() => setStoryModePlanet(null)}
                    title={`${storyModePlanet.label} in ${storyModePlanet.sign}`}
                    subtitle={`House ${storyModePlanet.house || '?'}`}
                    glyph={storyModePlanet.short}
                    color={storyModePlanet.color}
                    narrative={
                        // We can pull the Sabian text from the astroData based on the planet key
                        (astroData as any)[storyModePlanet.key]?.sabian ||
                        "The cosmic currents whisper secrets of this placement. A neural pathway opens, revealing the archetype of your soul's architecture."
                    }
                />
            )}
        </div>
    );
};

export default BirthProfilePage;
