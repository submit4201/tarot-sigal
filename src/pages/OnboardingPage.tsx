import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { getSignFromDate } from '../services/astroService';

const initialFormData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds'> = {
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

const OnboardingPage: React.FC = () => {
  const { createProfile } = useApp();
  const { login, signup, user, isLoading: authLoading } = useAuth(); // Auth Context

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // For signup
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile Wizard state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  // --- Auth Handlers ---

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  // --- Wizard Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [id]: value };
      if (id === 'birthDate') {
        updatedData.astrologicalSign = getSignFromDate(value);
      }
      return updatedData;
    });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleProfileSubmit = async () => {
    if (!user) return;
    try {
      const finalData = {
        ...formData,
        currentName: formData.currentName.trim() || formData.givenName.trim(),
      };
      await createProfile(finalData);
      // App.tsx will automatically switch to main app when activeProfile is set
    } catch (error) {
      console.error("Profile creation failed", error);
      alert("Failed to create profile. Please try again.");
    }
  };


  // --- Renderers ---

  // 1. Auth Form (Login / Signup)
  if (!user) {
    return (
      <div className="w-screen h-screen bg-[#0B0C10] text-[#E0E6F1] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111218] p-8 rounded-3xl border border-[#232533] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

          <h2 className="text-3xl font-bold font-dm-sans text-white mb-6 tracking-tighter text-center">
            {authMode === 'login' ? 'Jack In' : 'New Identity'}
          </h2>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Operator Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Email_Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 uppercase tracking-widest mb-1">Passcode</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] disabled:opacity-50"
            >
              {authLoading ? 'Authenticating...' : (authMode === 'login' ? 'Connect' : 'Initialize')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(null); }}
              className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
            >
              {authMode === 'login' ? "Require new credentials? Initialize here." : "Already waiting? Connect here."}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Profile Creation Wizard
  const renderWizardStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold font-dm-sans text-white">Cosmic Blueprint</h2>
            <p className="text-white/60">Initialize your Gridpunk Arcana profile. This data seeds your numerological and astrological algorithms.</p>
            <div>
              <label htmlFor="givenName" className="block text-sm font-medium text-white/60 mb-1">Given Name (at birth)</label>
              <input type="text" id="givenName" value={formData.givenName} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
            </div>
            <div>
              <label htmlFor="currentName" className="block text-sm font-medium text-white/60 mb-1">Current Name</label>
              <input type="text" id="currentName" value={formData.currentName} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
              <p className="text-xs text-white/40 mt-1">The name you go by now. Used for 'Current Vibe'.</p>
            </div>
            <div>
              <label htmlFor="mothersMaidenName" className="block text-sm font-medium text-white/60 mb-1">Mother's Maiden Name</label>
              <input type="text" id="mothersMaidenName" value={formData.mothersMaidenName} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
              <p className="text-xs text-white/40 mt-1">Calculates Heritage Number.</p>
            </div>
            <button onClick={nextStep} disabled={!formData.givenName} className="w-full px-6 py-3 rounded-lg font-bold bg-[#5A67D8] text-white hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Next_Sequence</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold font-dm-sans text-white">Natal Coordinates</h2>
            <p className="text-white/60">Precise temporal and spatial coordinates unlock deeper insights.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-white/60 mb-1">Date of Birth</label>
                <input type="date" id="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
              </div>
              <div>
                <label htmlFor="birthTime" className="block text-sm font-medium text-white/60 mb-1">Time of Birth</label>
                <input type="time" id="birthTime" value={formData.birthTime} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
              </div>
            </div>
            <div>
              <label htmlFor="birthPlace" className="block text-sm font-medium text-white/60 mb-1">Place of Birth (City, Country)</label>
              <input type="text" id="birthPlace" value={formData.birthPlace} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]" />
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="w-full px-6 py-3 rounded-lg font-bold bg-[#232533] text-white/60 hover:bg-opacity-80 transition-colors">Back</button>
              <button onClick={nextStep} disabled={!formData.birthDate} className="w-full px-6 py-3 rounded-lg font-bold bg-[#5A67D8] text-white hover:bg-opacity-80 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Next_Sequence</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl font-bold font-dm-sans text-white">System Calibration</h2>
            <p className="text-white/60">Configure the AI's interaction parameters.</p>

            <div>
              <label htmlFor="readingStyle" className="block text-sm font-medium text-white/60 mb-2">Interpretation Protocol</label>
              <select id="readingStyle" value={formData.readingStyle} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]">
                <option value="mystical">Mystical & Poetic</option>
                <option value="practical">Practical & Action-Oriented</option>
                <option value="psychological">Psychological & Reflective</option>
              </select>
            </div>

            <div>
              <label htmlFor="readingFocus" className="block text-sm font-medium text-white/60 mb-2">Primary Directive</label>
              <select id="readingFocus" value={formData.readingFocus} onChange={handleInputChange} className="w-full p-3 bg-[#0B0C10] border border-[#232533] rounded-lg focus:ring-2 focus:ring-[#6E7BFF]">
                <option value="general">General Guidance</option>
                <option value="love">Love & Relationships</option>
                <option value="career">Career & Ambition</option>
                <option value="growth">Personal Growth</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="w-full px-6 py-3 rounded-lg font-bold bg-[#232533] text-white/60 hover:bg-opacity-80 transition-colors">Back</button>
              <button onClick={handleProfileSubmit} className="w-full px-6 py-3 rounded-lg font-bold bg-[#29C26A] text-white hover:bg-opacity-80 transition-colors">Complete_Initialization</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-[#0B0C10] text-[#E0E6F1] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#111218] p-8 rounded-3xl border border-[#232533] shadow-2xl shadow-black/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
        {renderWizardStep()}
      </div>
      <p className="text-xs text-text-muted mt-6">Cyber-Spiritual Link :: Establishing Connection...</p>
    </div>
  );
};

export default OnboardingPage;