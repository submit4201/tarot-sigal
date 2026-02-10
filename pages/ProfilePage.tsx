import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { getSignFromDate } from '../services/astroService';
import { generateCosmicBlueprint } from '../services/cosmicService';
import CosmicBlueprintDisplay from '../components/CosmicBlueprintDisplay';
import { SparklesIcon, SlidersIcon, UserIcon, LayersIcon } from '../components/icons';
import { SHOP_DECKS } from '../constants';

const initialNewProfileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'> = {
  givenName: '',
  currentName: '',
  mothersMaidenName: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
  astrologicalSign: 'None',
  birthConstellation: '',
  readingStyle: 'mystical',
  readingFocus: 'general',
};

/**
 * AddProfileForm — Inline form for creating a new user profile.
 * Uses shared getSignFromDate from astroService.
 */
const AddProfileForm: React.FC<{ onSave: (profileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'>) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialNewProfileData);

  // * getSignFromDate imported from services/astroService.ts — no local duplicate

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [id]: value };
      if (id === 'birthDate') {
        updatedData.astrologicalSign = getSignFromDate(value);
      }
      return updatedData;
    });
  };

  const handleSubmit = () => {
    if (!formData.givenName || !formData.birthDate) {
      alert("Given Name and Date of Birth are required.");
      return;
    }
    const finalData = { ...formData, currentName: formData.currentName || formData.givenName };
    onSave(finalData);
  }

  return (
    <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold font-dm-sans text-white tracking-tight">Create New Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="givenName" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Given_Name (at birth)</label>
          <input type="text" id="givenName" value={formData.givenName} onChange={handleInputChange} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Date_of_Birth</label>
          <input type="date" id="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-white/30 italic">You can add more details like current name and birth place from the main profile view after saving.</p>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={handleSubmit} className="flex-1 px-8 py-4 rounded-2xl font-bold font-mono text-sm uppercase tracking-widest bg-teal-600 text-white hover:bg-teal-500 transition-all shadow-glow">Save_Profile</button>
        <button onClick={onCancel} className="flex-1 px-8 py-4 rounded-2xl font-bold font-mono text-sm uppercase tracking-widest bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition-all">Cancel</button>
      </div>
    </div>
  )
}


const ProfilePage: React.FC = () => {
  const { isPremium, setIsPremium, activeProfile, updateActiveProfile, profiles, switchProfile, addProfile, deleteProfile, setPage } = useApp();
  const [mode, setMode] = useState<'viewing' | 'adding'>('viewing');

  // ! Debounced profile saving — prevents writing to localStorage on every keystroke
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  /**
   * debouncedSave — Queues a profile update with 500ms debounce.
   * Shows a subtle "saving" indicator while the timeout is pending.
   */
  const debouncedSave = useCallback((updatedProfile: UserProfile) => {
    setPendingProfile(updatedProfile);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      updateActiveProfile(updatedProfile);
      setIsSaving(false);
      setPendingProfile(null);
    }, 500);
  }, [updateActiveProfile]);

  // * Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * handleProfileChange — Updates a single field on the active profile.
   * Uses debounced save to avoid writing on every keystroke.
   */
  const handleProfileChange = (field: keyof UserProfile, value: string | UserProfile['readingStyle'] | UserProfile['readingFocus']) => {
    if (!activeProfile) return;
    const base = pendingProfile || activeProfile;
    const updated = { ...base, [field]: value };

    // * If changing birthDate, also recalculate astrological sign
    if (field === 'birthDate') {
      updated.astrologicalSign = getSignFromDate(value as string);
    }

    debouncedSave(updated);
  };

  // * Use pending profile for display if we have uncommitted changes
  const displayProfile = pendingProfile || activeProfile;

  const cosmicBlueprint = useMemo(() => displayProfile ? generateCosmicBlueprint(displayProfile) : null, [displayProfile]);

  const myDecks = useMemo(() => {
    if (!activeProfile) return [];
    return SHOP_DECKS.filter(deck => activeProfile.ownedDeckIds.includes(deck.id));
  }, [activeProfile]);

  const handleAddNewProfile = (profileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'>) => {
    addProfile(profileData);
    setMode('viewing');
  };

  const handleDeleteProfile = () => {
    if (!activeProfile) return;
    if (window.confirm(`Are you sure you want to delete the profile for "${activeProfile.currentName || activeProfile.givenName}"? This action cannot be undone.`)) {
      deleteProfile(activeProfile.id);
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
        {/* Profile Management Section */}
        <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.4em] font-bold">Profile_Management</span>
          </div>
          {mode === 'viewing' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label htmlFor="profile-switcher" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Active_Operator</label>
                <select id="profile-switcher" value={activeProfile.id} onChange={(e) => switchProfile(e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500">
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.currentName || p.givenName}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 md:col-span-2">
                <button onClick={() => setMode('adding')} className="flex-1 px-6 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white transition-all">Add_Profile</button>
                <button onClick={handleDeleteProfile} disabled={profiles.length <= 1} className="flex-1 px-6 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed">Delete_Profile</button>
              </div>
            </div>
          ) : (
            <AddProfileForm onSave={handleAddNewProfile} onCancel={() => setMode('viewing')} />
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-3 space-y-10">
            <section className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <UserIcon className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em] font-bold">Personal_Details</span>
              </div>
              <h3 className="text-2xl font-bold font-dm-sans text-white tracking-tight mb-8">
                {displayProfile.currentName || displayProfile.givenName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="givenName" className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-2 font-bold">Given_Name</label>
                  <input type="text" id="givenName" value={displayProfile.givenName} onChange={(e) => handleProfileChange('givenName', e.target.value)} className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner" />
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
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-[0.4em] font-bold">Gridpunk_Premium</span>
              </div>
              <p className="text-sm text-white/40 mb-6 leading-relaxed">{isPremium ? "You have unlocked all features. Thank you for your support!" : "Unlock advanced features, unlimited readings, and deeper AI insights."}</p>
              <button onClick={() => setIsPremium(!isPremium)} className="w-full px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all shadow-glow">
                {isPremium ? "Disable_Premium" : "Activate_Premium (Dev)"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
