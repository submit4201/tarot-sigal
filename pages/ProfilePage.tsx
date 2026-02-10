import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AstrologicalSign, UserProfile } from '../types';
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

const AddProfileForm: React.FC<{ onSave: (profileData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'>) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialNewProfileData);

  const getSignFromDate = (dateString: string): AstrologicalSign => {
      if (!dateString) return 'None';
      const date = new Date(`${dateString}T00:00:00`); // Add time to avoid timezone issues
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
      return 'None';
  };

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
    <div className="bg-[#111218] p-6 rounded-xl border border-[#232533] animate-fade-in">
        <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4">Create New Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="givenName" className="block text-sm font-medium text-text-muted mb-1">Given Name (at birth)</label>
                <input type="text" id="givenName" value={formData.givenName} onChange={handleInputChange} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
            </div>
            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-text-muted mb-1">Date of Birth</label>
                <input type="date" id="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
            </div>
             <div className="md:col-span-2">
                <p className="text-xs text-text-muted">You can add more details like current name and birth place from the main profile view after saving.</p>
            </div>
        </div>
        <div className="flex gap-4 mt-6">
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 text-sm rounded-lg font-bold bg-[#29C26A] text-white hover:bg-opacity-80 transition-colors">Save Profile</button>
            <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm rounded-lg font-bold bg-[#232533] text-text-primary hover:bg-opacity-80 transition-colors">Cancel</button>
        </div>
    </div>
  )
}


const ProfilePage: React.FC = () => {
  const { isPremium, setIsPremium, activeProfile, updateActiveProfile, profiles, switchProfile, addProfile, deleteProfile, setPage } = useApp();
  const [mode, setMode] = useState<'viewing' | 'adding'>('viewing');

  const handleProfileChange = (field: keyof UserProfile, value: string | UserProfile['readingStyle'] | UserProfile['readingFocus']) => {
    if (!activeProfile) return;
    updateActiveProfile({ ...activeProfile, [field]: value });
  };
  
  const cosmicBlueprint = useMemo(() => activeProfile ? generateCosmicBlueprint(activeProfile) : null, [activeProfile]);
  
  const myDecks = useMemo(() => {
    if (!activeProfile) return [];
    return SHOP_DECKS.filter(deck => activeProfile.ownedDeckIds.includes(deck.id));
  }, [activeProfile]);


  const getSignFromDate = (dateString: string): AstrologicalSign => {
      if (!dateString) return 'None';
      const date = new Date(`${dateString}T00:00:00`); // Add time to avoid timezone issues
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
      return 'None';
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeProfile) return;
    const newDate = e.target.value;
    const newSign = getSignFromDate(newDate);
    updateActiveProfile({ ...activeProfile, birthDate: newDate, astrologicalSign: newSign });
  };
  
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

  if (!activeProfile || !cosmicBlueprint) {
    return <div>Loading profile...</div>; // Should not happen if App.tsx logic is correct
  }

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-dm-sans text-text-primary">Profile & Settings</h1>
        <p className="text-text-muted">Customize your experience and manage your data.</p>
      </header>
      
      {/* Profile Management Section */}
      <div className="mb-8 bg-[#111218] p-6 rounded-xl border border-[#232533]">
         <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4">Manage Profiles</h2>
         {mode === 'viewing' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                    <label htmlFor="profile-switcher" className="block text-sm font-medium text-text-muted mb-1">Active Profile</label>
                    <select id="profile-switcher" value={activeProfile.id} onChange={(e) => switchProfile(e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]">
                       {profiles.map(p => (
                            <option key={p.id} value={p.id}>{p.currentName || p.givenName}</option>
                       ))}
                    </select>
                </div>
                <div className="flex gap-2 md:col-span-2">
                   <button onClick={() => setMode('adding')} className="flex-1 px-4 py-2 text-sm rounded-lg font-bold bg-[#5A67D8] text-white hover:bg-opacity-80 transition-colors">Add New Profile</button>
                   <button onClick={handleDeleteProfile} disabled={profiles.length <= 1} className="flex-1 px-4 py-2 text-sm rounded-lg font-bold bg-[#EF4444]/80 text-white hover:bg-[#EF4444] transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Delete Active Profile</button>
                </div>
              </div>
         ) : (
            <AddProfileForm onSave={handleAddNewProfile} onCancel={() => setMode('viewing')} />
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#111218] p-6 rounded-xl border border-[#232533]">
              <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4 flex items-center gap-3">
                <UserIcon className="w-6 h-6" />
                Personal Details for {activeProfile.currentName || activeProfile.givenName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="givenName" className="block text-sm font-medium text-text-muted mb-1">Given Name (at birth)</label>
                  <input type="text" id="givenName" value={activeProfile.givenName} onChange={(e) => handleProfileChange('givenName', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
                </div>
                <div>
                  <label htmlFor="currentName" className="block text-sm font-medium text-text-muted mb-1">Current Name</label>
                  <input type="text" id="currentName" value={activeProfile.currentName} onChange={(e) => handleProfileChange('currentName', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" placeholder="For 'Current Vibe' number"/>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="mothersMaidenName" className="block text-sm font-medium text-text-muted mb-1">Mother's Maiden Name</label>
                  <input type="text" id="mothersMaidenName" value={activeProfile.mothersMaidenName} onChange={(e) => handleProfileChange('mothersMaidenName', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
                </div>
                 <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-text-muted mb-1">Date of Birth</label>
                  <input type="date" id="birthDate" value={activeProfile.birthDate} onChange={handleDateChange} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
                </div>
                <div>
                  <label htmlFor="birthTime" className="block text-sm font-medium text-text-muted mb-1">Time of Birth</label>
                  <input type="time" id="birthTime" value={activeProfile.birthTime} onChange={(e) => handleProfileChange('birthTime', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="birthPlace" className="block text-sm font-medium text-text-muted mb-1">Place of Birth (City, Country)</label>
                  <input type="text" id="birthPlace" value={activeProfile.birthPlace} onChange={(e) => handleProfileChange('birthPlace', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
                </div>
              </div>
            </div>
             <div className="bg-[#111218] p-6 rounded-xl border border-[#232533]">
                <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4 flex items-center gap-3">
                    <SlidersIcon className="w-6 h-6" />
                    Reading Preferences
                </h2>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="readingStyle" className="block text-sm font-medium text-text-muted mb-1">AI Reading Style</label>
                        <select id="readingStyle" value={activeProfile.readingStyle} onChange={(e) => handleProfileChange('readingStyle', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]">
                            <option value="mystical">Mystical & Poetic</option>
                            <option value="practical">Practical & Action-Oriented</option>
                            <option value="psychological">Psychological & Reflective</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="readingFocus" className="block text-sm font-medium text-text-muted mb-1">Current Life Focus</label>
                         <select id="readingFocus" value={activeProfile.readingFocus} onChange={(e) => handleProfileChange('readingFocus', e.target.value)} className="w-full p-2 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]">
                            <option value="general">General Guidance</option>
                            <option value="love">Love & Relationships</option>
                            <option value="career">Career & Ambition</option>
                            <option value="growth">Personal Growth</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Blueprint & Status */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#111218] p-6 rounded-xl border border-[#232533]">
                <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4">Cosmic Blueprint</h2>
                <CosmicBlueprintDisplay blueprint={cosmicBlueprint} />
            </div>
            <div className="bg-[#111218] p-6 rounded-xl border border-[#232533]">
                <h2 className="text-2xl font-semibold font-dm-sans text-text-primary mb-4">My Decks</h2>
                <div className="space-y-3">
                    {myDecks.map(deck => (
                        <div key={deck.id} className="flex items-center gap-3 p-3 bg-[#0B0C10] rounded-lg">
                            <LayersIcon className="w-8 h-8 text-text-muted" />
                            <div>
                                <h4 className="font-semibold text-text-primary">{deck.name}</h4>
                                <p className="text-xs text-text-muted capitalize">{deck.type} Deck</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => setPage('Shop')} className="w-full mt-2 p-3 text-center bg-transparent border-2 border-dashed border-[#232533] rounded-lg text-text-muted hover:border-[#29C26A] hover:text-[#29C26A] transition-colors">
                        + Acquire More Decks
                    </button>
                </div>
            </div>
            <div className="bg-[#111218] p-6 rounded-xl border border-[#FF7A1A]">
                <h2 className="text-2xl font-semibold font-dm-sans text-[#FF7A1A] mb-2">Gridpunk Premium</h2>
                <p className="text-text-muted mb-4">{isPremium ? "You have unlocked all features. Thank you for your support!" : "Unlock advanced features, unlimited readings, and deeper AI insights."}</p>
                <button onClick={() => setIsPremium(!isPremium)} className="w-full px-6 py-3 rounded-lg font-bold bg-[#D95B00] text-white hover:bg-opacity-80 transition-colors">
                    {isPremium ? "Disable Premium Features" : "Activate Premium (Dev)"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
