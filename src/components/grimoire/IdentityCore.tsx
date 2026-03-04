import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types';
import { getSignFromDate } from '../../services/astroService';
import { generateCosmicBlueprint } from '../../services/cosmicService';
import CosmicBlueprintDisplay from '../CosmicBlueprintDisplay';
import NarrativeSection from '../profile/NarrativeSection';
import { SparklesIcon, SlidersIcon, UserIcon, ZapIcon } from '../icons';

import { SHOP_DECKS } from '../../constants';
import { verifySubscription } from '../../services/stripeService';
import { generateWithPuter } from '../../services/puterService';

const IdentityCore: React.FC = () => {
    const { isPremium, activeProfile, updateActiveProfile, setPage, refetchProfile } = useApp();

    const { logout, user } = useAuth();

    const [isSaving, setIsSaving] = useState(false);
    const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

    // Initialize pending profile when active profile loads
    useEffect(() => {
        if (activeProfile && !pendingProfile) {
            setPendingProfile(JSON.parse(JSON.stringify(activeProfile)));
        }
    }, [activeProfile]);

    const getDeltas = useMemo(() => {
        if (!activeProfile || !pendingProfile) return [];
        const deltas: string[] = [];
        const fields: (keyof UserProfile)[] = [
            'givenName', 'currentName', 'mothersMaidenName',
            'birthDate', 'birthTime', 'birthPlace',
            'readingStyle', 'readingFocus'
        ];

        fields.forEach(field => {
            if (pendingProfile[field] !== activeProfile[field]) {
                deltas.push(field);
            }
        });
        return deltas;
    }, [activeProfile, pendingProfile]);

    const isFieldChanged = (field: keyof UserProfile) => getDeltas.includes(field);

    const handleProfileChange = (field: keyof UserProfile, value: string | UserProfile['readingStyle'] | UserProfile['readingFocus']) => {
        if (!pendingProfile) return;
        const updated = { ...pendingProfile, [field]: value };

        if (field === 'birthDate') {
            updated.astrologicalSign = getSignFromDate(value as string);
        }

        setPendingProfile(updated);
    };

    const handleSaveChanges = async () => {
        if (!pendingProfile) return;
        setIsSaving(true);
        try {
            await updateActiveProfile(pendingProfile);
        } finally {
            setIsSaving(false);
        }
    };


    const displayProfile = pendingProfile || activeProfile;
    const cosmicBlueprint = useMemo(() => displayProfile ? generateCosmicBlueprint(displayProfile) : null, [displayProfile]);



    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState('');
    const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
    const [streamingNarrative, setStreamingNarrative] = useState('');

    const handleGenerateNarrative = async () => {
        if (!displayProfile || !cosmicBlueprint) return;
        setIsGeneratingNarrative(true);
        setStreamingNarrative('');

        try {
            const blueprintSummary = JSON.stringify({
                lifePath: cosmicBlueprint.lifePath,
                destiny: cosmicBlueprint.destiny,
                soulUrge: cosmicBlueprint.soulUrge,
                personality: cosmicBlueprint.personality,
                pinnacles: cosmicBlueprint.pinnacles.map(p => p.theme),
                challenges: cosmicBlueprint.challenges.map(c => c.theme)
            }, null, 2);

            const prompt = `
          You are a MASTER SYNTHESIST of Western and Eastern Esotericism.
          Generate a detailed "Life Narrative" based on this Numerology Blueprint:
          ${blueprintSummary}
          
          User Name: ${displayProfile.currentName || displayProfile.givenName}
          Birth Date: ${displayProfile.birthDate}
          
          STRUCTURE:
          ### ARCHETYPE DESIGNATION
          (A cool 3-word title)
          
          ### CORE SYNTHESIS
          (Deep dive into their life path and destiny)
          
          ### DECISION ENGINE
          (How they should make decisions)
          
          ### PROSPERITY MAP
          (Where their abundance lies)
          
          ### BIO-RESONANCE
          (Health and energy tips)
          
          ### ANCESTRAL ENCRYPTION
          (Karmic patterns)
          
          ### HERO'S ARC
          (Current life phase)
          
          Keep it cyberpunk, mystical, and direct. Use 2nd person ("You").
          `;

            const messages = [{ role: 'user', content: prompt }];
            const fullText = await generateWithPuter(messages, (chunk) => {
                setStreamingNarrative(prev => prev + chunk);
            });

            const updated = { ...displayProfile, llm_narrative: fullText };
            await updateActiveProfile(updated);

        } catch (e) {
            console.error("Narrative generation failed", e);
        } finally {
            setIsGeneratingNarrative(false);
        }
    };

    const handleSyncSubscription = async () => {
        setIsSyncing(true);
        setSyncMessage('Checking Stripe...');
        try {
            const res = await verifySubscription();
            if ((res as any).is_premium && (res as any).tier) {
                setSyncMessage('Subscription mapped! Updating profile...');
                await refetchProfile();
                setSyncMessage('Subscription mapped!');
                setTimeout(() => setSyncMessage(''), 3000);
            } else {
                setSyncMessage((res as any).message || 'Verification complete.');
                setTimeout(() => setSyncMessage(''), 3000);
            }
        } catch (err) {
            setSyncMessage('Sync failed.');
            setTimeout(() => setSyncMessage(''), 3000);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to jack out?")) {
            await logout();
        }
    };

    if (!activeProfile || !displayProfile || !cosmicBlueprint) {
        return <div className="p-8 text-center text-text-muted animate-pulse font-mono">Initializing_Identity_Core...</div>;
    }

    return (
        <div className="w-full space-y-10 animate-fade-in p-2">
            {/* Identity & Logout Section */}
            <section className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center border border-white/10 shadow-glow-sm">
                        <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{displayProfile.currentName || displayProfile.givenName}</h3>
                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">{user?.email || 'Identified_User'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-[10px] uppercase tracking-widest"
                >
                    Disconnect_Session
                </button>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Column: Forms */}
                <div className="lg:col-span-3 space-y-8">
                    <section className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            {isSaving && (
                                <span className="text-[9px] font-mono text-teal-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
                                    Syncing...
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <UserIcon className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Biometric_Details</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Given_Name</span>
                                    {isFieldChanged('givenName') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="text" value={displayProfile.givenName} onChange={(e) => handleProfileChange('givenName', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('givenName') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Current_Name</span>
                                    {isFieldChanged('currentName') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="text" value={displayProfile.currentName} onChange={(e) => handleProfileChange('currentName', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('currentName') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>
                            <div className="md:col-span-2 space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Mothers_Maiden_Name</span>
                                    {isFieldChanged('mothersMaidenName') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="text" value={displayProfile.mothersMaidenName} onChange={(e) => handleProfileChange('mothersMaidenName', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('mothersMaidenName') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Date_of_Birth</span>
                                    {isFieldChanged('birthDate') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="date" value={displayProfile.birthDate} onChange={(e) => handleProfileChange('birthDate', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('birthDate') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Time_of_Birth</span>
                                    {isFieldChanged('birthTime') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="time" value={displayProfile.birthTime} onChange={(e) => handleProfileChange('birthTime', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('birthTime') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>
                            <div className="md:col-span-2 space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Place_of_Origin</span>
                                    {isFieldChanged('birthPlace') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <input type="text" value={displayProfile.birthPlace} onChange={(e) => handleProfileChange('birthPlace', e.target.value)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('birthPlace') ? 'border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner`} />
                            </div>

                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className={`px-6 py-2.5 rounded-xl border border-teal-500/50 bg-teal-500/10 hover:bg-teal-500/30 text-teal-400 font-mono text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(20,184,166,0.15)] flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSaving ? "Encrypting..." : "Update_Identity"}
                            </button>
                        </div>
                    </section>

                    <section className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <SlidersIcon className="w-4 h-4 text-teal-400" />
                            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.4em] font-bold">Reading_Protocol</span>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>AI_Vocalization_Style</span>
                                    {isFieldChanged('readingStyle') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <select value={displayProfile.readingStyle} onChange={(e) => handleProfileChange('readingStyle', e.target.value as any)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('readingStyle') ? 'border-pink-500/50' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500`}>
                                    <option value="mystical">Mystical_Encryption</option>
                                    <option value="practical">Direct_Output</option>
                                    <option value="psychological">Analytical_Deep_Scan</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold ml-1 flex justify-between">
                                    <span>Target_Focus_Array</span>
                                    {isFieldChanged('readingFocus') && <span className="text-pink-500 animate-pulse">[DELL]</span>}
                                </label>
                                <select value={displayProfile.readingFocus} onChange={(e) => handleProfileChange('readingFocus', e.target.value as any)} className={`w-full p-3.5 bg-black/40 border ${isFieldChanged('readingFocus') ? 'border-pink-500/50' : 'border-white/10'} rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-purple-500`}>
                                    <option value="general">Global_Guidance</option>
                                    <option value="love">Limbic_Resonance</option>
                                    <option value="career">Strategic_Ambition</option>
                                    <option value="growth">Neural_Evolution</option>
                                </select>
                            </div>

                        </div>
                    </section>
                </div>

                {/* Right Column: Blueprint & Status */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Experience & Progression */}
                    <section className="glass-panel p-8 rounded-[2rem] border-purple-500/20 bg-purple-900/[0.03] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Neural_Rank</span>
                            </div>
                            <div className="font-mono text-3xl font-bold text-white tracking-tighter">NODE_{displayProfile.level}</div>
                        </div>

                        <div className="mb-6 relative">
                            <div className="flex justify-between text-[9px] font-mono text-white/50 mb-2 uppercase tracking-widest">
                                <span>XP: {displayProfile.xp}</span>
                                <span>Limit: {Math.round(500 * Math.pow(1.5, displayProfile.level - 1))}</span>
                            </div>
                            <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-900 via-purple-500 to-indigo-500 transition-all duration-1000 ease-out relative"
                                    style={{ width: `${(displayProfile.xp / Math.round(500 * Math.pow(1.5, displayProfile.level - 1))) * 100}%` }}
                                >
                                    <div className="absolute top-0 right-0 h-full w-[2px] bg-white/50 blur-[1px]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <SparklesIcon className="w-4 h-4 text-purple-400/60" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-[11px] mb-0.5">Iterative_Reward</h4>
                                <p className="text-[8px] text-white/30 font-mono uppercase tracking-widest">
                                    Level {displayProfile.level + 1} Access Pending
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Temporal_Blueprint</span>
                        </div>
                        <div className="scale-95 origin-top">
                            <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
                        </div>
                    </section>

                    {/* Narrative Section */}
                    {(displayProfile.llm_narrative || isGeneratingNarrative) ? (
                        <section className="glass-panel p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-900/[0.03] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <ZapIcon className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] font-bold">Narrative_Stream</span>
                                </div>
                                {isGeneratingNarrative && <span className="text-[10px] font-mono text-indigo-400 animate-pulse">SYNC_IN_PROGRESS</span>}
                            </div>

                            <div className="text-xs">
                                <NarrativeSection content={isGeneratingNarrative ? streamingNarrative : (displayProfile.llm_narrative || "")} profileData={{ numerology: cosmicBlueprint }} />
                            </div>
                        </section>
                    ) : (
                        <section className="glass-panel p-8 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl text-center space-y-5">
                            <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                                <ZapIcon className="w-6 h-6 text-white/20" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Initialize Synthesis</h3>
                                <p className="text-white/30 text-[10px] max-w-xs mx-auto leading-relaxed">
                                    Synthesize your biometric and temporal data into a high-density life narrative.
                                </p>
                            </div>
                            <button
                                onClick={handleGenerateNarrative}
                                disabled={isGeneratingNarrative}
                                className="w-full py-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-indigo-400 font-bold font-mono text-[9px] uppercase tracking-[0.2em] transition-all shadow-glow"
                            >
                                {isGeneratingNarrative ? "Synthesizing..." : "Initialize_Synthesis_v1.0"}
                            </button>
                        </section>
                    )}

                    {/* Subscription & Sync */}
                    <section className="glass-panel p-8 rounded-[2rem] border-amber-500/20 bg-amber-500/[0.02] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
                        <div className="flex items-center gap-3 mb-6">
                            <SparklesIcon className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.4em] font-bold">System_Permissions</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Tier</span>
                                <span className="text-white font-bold text-xs uppercase">{displayProfile.subscriptionTier || 'Seeker'}</span>
                            </div>
                            <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mb-1">Status</span>
                                <span className={`text-xs font-bold uppercase ${isPremium ? 'text-amber-400' : 'text-white/40'}`}>
                                    {isPremium ? 'Authorized' : 'Restricted'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleSyncSubscription}
                                disabled={isSyncing}
                                className="w-full py-3 rounded-xl font-bold font-mono text-[9px] uppercase tracking-widest bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                            >
                                {isSyncing ? "Syncing..." : "Sync_Auth_Status"}
                            </button>

                            {!isPremium && (
                                <button
                                    onClick={() => setPage('Pricing')}
                                    className="w-full py-3 rounded-xl font-bold font-mono text-[9px] uppercase tracking-widest bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all shadow-glow"
                                >
                                    Upgrade_Protocol
                                </button>
                            )}
                        </div>

                        {syncMessage && (
                            <p className="text-center mt-4 text-[9px] font-mono text-amber-400 animate-pulse">
                                {syncMessage}
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default IdentityCore;
