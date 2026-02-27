import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { getSignFromDate } from '../services/astroService';
import { generateCosmicBlueprint } from '../services/cosmicService';
import CosmicBlueprintDisplay from '../components/CosmicBlueprintDisplay';
import NarrativeSection from '../components/profile/NarrativeSection';
import { SparklesIcon, SlidersIcon, UserIcon, LayersIcon, ZapIcon } from '../components/icons';
import { SHOP_DECKS } from '../constants';
import { verifySubscription } from '../services/stripeService';
import { generateWithPuter } from '../services/puterService';
import CyberpunkAd from '@/components/ui/CyberpunkAd';

const ProfilePage: React.FC = () => {
  const { isPremium, activeProfile, updateActiveProfile, setPage, refetchProfile, togglePremium } = useApp();
  const { logout, user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // Initialize pending profile when active profile loads
  useEffect(() => {
    if (activeProfile && !pendingProfile) {
      setPendingProfile(activeProfile);
    }
  }, [activeProfile]);

  /**
   * handleProfileChange — Updates a single field on the locally cached profile.
   * Does NOT automatically save to server.
   */
  const handleProfileChange = (field: keyof UserProfile, value: string | UserProfile['readingStyle'] | UserProfile['readingFocus']) => {
    if (!pendingProfile) return;
    const updated = { ...pendingProfile, [field]: value };

    // * If changing birthDate, also recalculate astrological sign
    if (field === 'birthDate') {
      updated.astrologicalSign = getSignFromDate(value as string);
    }

    setPendingProfile(updated);
  };

  /**
   * handleSaveChanges — Manually commits the pending profile to the backend.
   */
  const handleSaveChanges = async () => {
    if (!pendingProfile) return;
    setIsSaving(true);
    try {
      await updateActiveProfile(pendingProfile);
    } finally {
      setIsSaving(false);
    }
  };

  // * Use pending profile for display
  const displayProfile = pendingProfile || activeProfile;

  const cosmicBlueprint = useMemo(() => displayProfile ? generateCosmicBlueprint(displayProfile) : null, [displayProfile]);

  const myDecks = useMemo(() => {
    if (!activeProfile) return [];
    return SHOP_DECKS.filter(deck => activeProfile.ownedDeckIds.includes(deck.id));
  }, [activeProfile]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  
  // * Narrative Generation State
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [streamingNarrative, setStreamingNarrative] = useState('');

  const handleGenerateNarrative = async () => {
      if (!displayProfile || !cosmicBlueprint) return;
      setIsGeneratingNarrative(true);
      setStreamingNarrative('');
      
      try {
          // Construct a prompt from the blueprint data
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
          
          // Save the generated narrative to the profile
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
        try {
          await refetchProfile();
          setSyncMessage('Subscription mapped!');
        } catch {
          // If refetch fails, still clear the message after a short delay
          setSyncMessage('Subscription mapped, but failed to refresh profile. Please reload.');
        } finally {
          setTimeout(() => setSyncMessage(''), 3000);
        }
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
      // App.tsx auth state change will trigger redirect to Onboarding
    }
  };

  if (!activeProfile || !displayProfile || !cosmicBlueprint) {
    return <div className="p-8 text-center text-text-muted animate-pulse font-mono">Initializing_Profile_Data...</div>;
  }

  return (
    <div className="w-full h-full p-6 md:p-14 flex flex-col bg-grid animate-fade-in overflow-y-auto scroll-smooth">
      <header className="mb-12 flex-shrink-0 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.6em] font-bold">Operator_Config_v2.5</span>
          </div>
          <h1 className="text-6xl font-bold font-dm-sans text-white tracking-tighter neon-glow">Profile & Settings</h1>
          <p className="text-lg text-white/40 mt-2">Customize your experience and manage your data.</p>
        </div>
        {/* ! Saving indicator — appears during debounce window */}
        {isSaving && (
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></div>
            Syncing...
          </span>
        )}
      </header>

      <div className="space-y-10">

        {/* Identity & Logout Section (Replaced Profile Management) */}
        <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{displayProfile.currentName || displayProfile.givenName}</h3>
            <p className="text-white/40 font-mono text-xs uppercase tracking-widest">{user?.email || 'Identified_User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-8 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-xs uppercase tracking-widest"
          >
            Disconnect_Session
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-3 space-y-10">
            <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <UserIcon className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Personal_Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="givenName" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Given_Name</label>
                  <div className="relative">
                    <input type="text" id="givenName" value={displayProfile.givenName} onChange={(e) => handleProfileChange('givenName', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div>
                  <label htmlFor="currentName" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Current_Name</label>
                  <input type="text" id="currentName" value={displayProfile.currentName} onChange={(e) => handleProfileChange('currentName', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" placeholder="For 'Current Vibe' number" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="mothersMaidenName" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Mothers_Maiden_Name</label>
                  <input type="text" id="mothersMaidenName" value={displayProfile.mothersMaidenName} onChange={(e) => handleProfileChange('mothersMaidenName', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Date_of_Birth</label>
                  <input type="date" id="birthDate" value={displayProfile.birthDate} onChange={(e) => handleProfileChange('birthDate', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
                </div>
                <div>
                  <label htmlFor="birthTime" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Time_of_Birth</label>
                  <input type="time" id="birthTime" value={displayProfile.birthTime} onChange={(e) => handleProfileChange('birthTime', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="birthPlace" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Place_of_Origin</label>
                  <input type="text" id="birthPlace" value={displayProfile.birthPlace} onChange={(e) => handleProfileChange('birthPlace', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
                </div>
              </div>

              {/* Explicit Save Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className={`px-8 py-3 rounded-xl border border-teal-500/50 bg-teal-500/10 hover:bg-teal-500/30 text-teal-400 font-mono text-sm uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(20,184,166,0.15)] flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                      Encrypting_Data...
                    </>
                  ) : (
                    'Update_Profile'
                  )}
                </button>
              </div>
            </section>

            <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <SlidersIcon className="w-5 h-5 text-teal-400" />
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.4em] font-bold">Reading_Preferences</span>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="readingStyle" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">AI_Reading_Style</label>
                  <select id="readingStyle" value={displayProfile.readingStyle} onChange={(e) => handleProfileChange('readingStyle', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="mystical">Mystical & Poetic</option>
                    <option value="practical">Practical & Action-Oriented</option>
                    <option value="psychological">Psychological & Reflective</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="readingFocus" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Current_Life_Focus</label>
                  <select id="readingFocus" value={displayProfile.readingFocus} onChange={(e) => handleProfileChange('readingFocus', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500">
                    <option value="general">General Guidance</option>
                    <option value="love">Love & Relationships</option>
                    <option value="career">Career & Ambition</option>
                    <option value="growth">Personal Growth</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Blueprint & Status */}
          <div className="lg:col-span-2 space-y-10">
            {/* Experience & Progression */}
            <section className="glass-panel p-10 rounded-[2.5rem] border-purple-500/20 bg-purple-900/[0.05] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Resonance_Level</span>
                </div>
                <div className="font-mono text-4xl font-bold text-white tracking-tighter">LVL_{displayProfile.level}</div>
              </div>

              <div className="mb-6 relative">
                <div className="flex justify-between text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">
                  <span>XP: {displayProfile.xp}</span>
                  <span>Next: {Math.round(500 * Math.pow(1.5, displayProfile.level - 1))}</span>
                </div>
                <div className="h-4 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className="h-full bg-gradient-to-r from-purple-900 via-purple-500 to-indigo-500 transition-all duration-1000 ease-out relative"
                    style={{ width: `${(displayProfile.xp / Math.round(500 * Math.pow(1.5, displayProfile.level - 1))) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 right-0 h-full w-[2px] bg-white/50 blur-[1px]"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-0.5">Next Reward</h4>
                  <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    {(displayProfile.level + 1) * 10} Stardust + {(displayProfile.level + 1) % 5 === 0 ? 'New Deck Unlock' : 'Cosmic Insight'}
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Cosmic_Blueprint</span>
              </div>
              <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
            </section>

            {/* Narrative Section - Puter.js Integration */}
            {(displayProfile.llm_narrative || isGeneratingNarrative) ? (
                <section className="glass-panel p-10 rounded-[2.5rem] border-indigo-500/20 bg-indigo-900/[0.05] shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                             <ZapIcon className="w-5 h-5 text-indigo-400" />
                             <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.4em] font-bold">Life_Narrative_Synthesis</span>
                        </div>
                        {isGeneratingNarrative && <span className="text-xs font-mono text-indigo-400 animate-pulse">TRANSMITTING...</span>}
                     </div>
                     
                     <NarrativeSection content={isGeneratingNarrative ? streamingNarrative : (displayProfile.llm_narrative || "")} profileData={{ numerology: cosmicBlueprint }} />
                </section>
            ) : (
                <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                        <ZapIcon className="w-8 h-8 text-white/20" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Generate Life Narrative</h3>
                        <p className="text-white/40 text-sm max-w-md mx-auto">
                            Invoke the Puter.js AI to synthesize your full cosmic profile into a detailed cyberpunk narrative.
                        </p>
                    </div>
                    <button 
                        onClick={handleGenerateNarrative}
                        disabled={isGeneratingNarrative}
                        className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs uppercase tracking-widest transition-all shadow-glow disabled:opacity-50"
                    >
                        {isGeneratingNarrative ? "Synthesizing..." : "Initialize_Synthesis"}
                    </button>
                </section>
            )}

            <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <LayersIcon className="w-5 h-5 text-teal-400" />
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.4em] font-bold">Owned_Decks</span>
              </div>
              <div className="space-y-4">
                {myDecks.map(deck => (
                  <div key={deck.id} className="flex items-center gap-4 p-5 bg-black/30 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group">
                    <LayersIcon className="w-8 h-8 text-white/20 group-hover:text-purple-400 transition-colors" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{deck.name}</h4>
                      <p className="text-[10px] text-white/30 capitalize font-mono">{deck.type}_Deck</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setPage('Shop')} className="w-full mt-3 p-5 text-center bg-transparent border-2 border-dashed border-white/10 rounded-2xl text-white/30 hover:border-teal-500/40 hover:text-teal-400 transition-all font-mono text-sm uppercase tracking-widest">
                  + Acquire_More
                </button>
              </div>
            </section>

            <section className="glass-panel p-10 rounded-[2.5rem] border-amber-500/20 bg-amber-500/[0.02] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
              <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.4em] font-bold">Subscription_Status</span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Current Plan:</span>
                  <span className="text-white font-bold capitalize">{displayProfile.subscriptionTier || 'free'}</span>
                </div>
                {isPremium && displayProfile.subscriptionExpiry && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Expires:</span>
                    <span className="text-white/80 text-sm">
                      {new Date(displayProfile.subscriptionExpiry).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-white/40 mb-6 leading-relaxed">
                {isPremium
                  ? "You have unlocked premium features. Thank you for your support!"
                  : "Unlock advanced features, unlimited readings, and deeper AI insights."}
              </p>

              <button
                onClick={() => setPage('Pricing')}
                className="w-full mb-3 px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all shadow-glow"
              >
                {isPremium ? "Manage_Subscription" : "Upgrade_Now"}
              </button>

              <button
                onClick={handleSyncSubscription}
                disabled={isSyncing}
                className="w-full px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "Sync_Subscription_With_Stripe"}
              </button>

              {syncMessage && (
                <p className="text-center mt-4 text-xs font-mono text-amber-400 animate-pulse">
                  {syncMessage}
                </p>
              )}

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-4">Development_Tools</p>
                <button
                  onClick={() => {
                    togglePremium();
                    setSyncMessage('Tier cycled. Status updated in local state.');
                    setTimeout(() => setSyncMessage(''), 3000);
                  }}
                  className="w-full px-8 py-3 rounded-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-colors font-mono text-[10px] uppercase tracking-widest"
                >
                  Cycle_Subscription_Tier
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-20">
          <CyberpunkAd variant="banner" isPremium={isPremium} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
