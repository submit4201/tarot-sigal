import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';
import { getSignFromDate } from '../services/astroService';
import { GlassPanel } from '../components/ui/GlassPanel';
import { CyberButton } from '../components/ui/CyberButton';
import { CyberInput } from '../components/ui/CyberInput';

const initialFormData: Omit<UserProfile, 'id' | 'level' | 'xp' | 'unlockedAchievements' | 'stardust' | 'ownedDeckIds' | 'subscriptionTier' | 'subscriptionExpiry' | 'isPremium'> = {
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

interface OnboardingPageProps {
  initialAuthMode?: 'login' | 'signup';
  onBackToLanding?: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ initialAuthMode = 'signup', onBackToLanding }) => {
  const { createProfile } = useApp();
  const { login, signup, user, isLoading: authLoading } = useAuth(); // Auth Context

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialAuthMode);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      <div className="w-screen h-screen bg-void text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
        <div className="noise-bg"></div>

        <GlassPanel className="w-full max-w-md p-8 relative overflow-hidden animate-fade-in-up">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute top-4 left-4 text-xs font-mono text-white/40 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              &lt; System_Root
            </button>
          )}

          <h2 className="text-4xl font-bold font-display text-white mb-8 tracking-tighter text-center neon-glow mt-4">
            {authMode === 'login' ? 'JACK IN' : 'INITIATE'}
          </h2>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-6 font-mono">
              //! ERROR: {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            {authMode === 'signup' && (
              <CyberInput
                label="Operator Name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            )}

            <CyberInput
              label="Email_Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <CyberInput
              label="Passcode_Sequence"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <CyberButton
              type="submit"
              isLoading={authLoading}
              className="w-full"
              variant="primary"
            >
              {authMode === 'login' ? 'Establish Link' : 'Create Identity'}
            </CyberButton>
          </form>

          <div className="mt-8 text-center bg-white/5 p-4 rounded-xl">
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(null); }}
              className="text-xs font-mono text-cosmic-light hover:text-cosmic-glow transition-colors uppercase tracking-widest hover:underline underline-offset-4"
            >
              {authMode === 'login' ? "[ NO_CREDENTIALS? INITIALIZE_NEW_USER ]" : "[ EXISTING_USER? ACCESS_LINK ]"}
            </button>
          </div>
        </GlassPanel>

        <p className="fixed bottom-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
          Gridpunk Arcana v3.0 :: Secure Connection
        </p>
      </div>
    );
  }

  // 2. Profile Creation Wizard
  const renderWizardStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl font-bold font-display text-white mb-2 neon-glow">Cosmic Blueprint</h2>
              <p className="text-white/60 text-sm font-mono">STEP 1/3 :: IDENTITY_SEED</p>
            </div>

            <CyberInput
              id="givenName"
              label="Given Name (Birth)"
              value={formData.givenName}
              onChange={handleInputChange}
            />

            <CyberInput
              id="currentName"
              label="Current Alias"
              value={formData.currentName}
              onChange={handleInputChange}
              placeholder="How should we address you?"
            />

            <CyberInput
              id="mothersMaidenName"
              label="Matrilineal Code (Mother's Maiden)"
              value={formData.mothersMaidenName}
              onChange={handleInputChange}
              placeholder="Used for heritage algorithms"
            />

            <CyberButton
              onClick={nextStep}
              disabled={!formData.givenName}
              className="w-full"
              variant="primary"
            >
              Next_Sequence
            </CyberButton>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl font-bold font-display text-white mb-2 neon-glow">Natal Coordinates</h2>
              <p className="text-white/60 text-sm font-mono">STEP 2/3 :: TEMPORAL_LOCK</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CyberInput
                id="birthDate"
                label="Date of Birth"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
              <CyberInput
                id="birthTime"
                label="Time of Birth"
                type="time"
                value={formData.birthTime}
                onChange={handleInputChange}
              />
            </div>

            <CyberInput
              id="birthPlace"
              label="Origin Point (City, Country)"
              value={formData.birthPlace}
              onChange={handleInputChange}
            />

            <div className="flex gap-4 pt-4">
              <CyberButton onClick={prevStep} variant="secondary" className="flex-1">Back</CyberButton>
              <CyberButton
                onClick={nextStep}
                disabled={!formData.birthDate}
                className="flex-1"
                variant="primary"
              >
                Next_Sequence
              </CyberButton>
            </div>
          </div>
        );
      case 3: // Select boxes need custom styling or a CyberSelect component. For now, mimicking CyberInput style.
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl font-bold font-display text-white mb-2 neon-glow">System Calibration</h2>
              <p className="text-white/60 text-sm font-mono">STEP 3/3 :: INTERFACE_PROTOCOLS</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="readingStyle" className="block text-xs font-mono text-white/40 uppercase tracking-widest pl-1">Interpretation Protocol</label>
              <select
                id="readingStyle"
                value={formData.readingStyle}
                onChange={handleInputChange}
                className="w-full bg-void-lighter border-white/10 rounded-xl px-6 py-4 text-white font-mono text-sm border focus:border-cosmic-glow focus:outline-none appearance-none transition-all hover:border-white/20"
              >
                <option value="mystical">Mystical & Poetic</option>
                <option value="practical">Practical & Action-Oriented</option>
                <option value="psychological">Psychological & Reflective</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="readingFocus" className="block text-xs font-mono text-white/40 uppercase tracking-widest pl-1">Primary Directive</label>
              <select
                id="readingFocus"
                value={formData.readingFocus}
                onChange={handleInputChange}
                className="w-full bg-void-lighter border-white/10 rounded-xl px-6 py-4 text-white font-mono text-sm border focus:border-cosmic-glow focus:outline-none appearance-none transition-all hover:border-white/20"
              >
                <option value="general">General Guidance</option>
                <option value="love">Love & Relationships</option>
                <option value="career">Career & Ambition</option>
                <option value="growth">Personal Growth</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <CyberButton onClick={prevStep} variant="secondary" className="flex-1">Back</CyberButton>
              <CyberButton onClick={handleProfileSubmit} variant="primary" className="flex-1">Initialize_System</CyberButton>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-void text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
      <div className="noise-bg"></div>

      <GlassPanel className="w-full max-w-2xl p-8 relative overflow-hidden shadow-2xl shadow-cosmic/10">
        {renderWizardStep()}
      </GlassPanel>

      <p className="fixed bottom-6 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] animate-pulse-slow">
        Cyber-Spiritual Link :: Establishing Connection...
      </p>
    </div>
  );
};

export default OnboardingPage;