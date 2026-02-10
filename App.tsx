import React, { useEffect } from 'react';
import { Page } from './types';
import DailyPage from './pages/DailyPage';
import ReadingsPage from './pages/ReadingsPage';
import JournalPage from './pages/JournalPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import GuidePage from './pages/GuidePage';
import ShopPage from './pages/ShopPage';
import { HomeIcon, CardsIcon, JournalIcon, BarChartIcon, UserIcon, CompassIcon, ShoppingCartIcon, SparklesIcon, ZapIcon } from './components/icons';
import { AppProvider, useApp } from './context/AppContext';
import { checkAndUnlockAchievements } from './services/achievementService';

const navItems = [
  { name: 'Daily', icon: HomeIcon, page: 'Daily' as Page },
  { name: 'Readings', icon: CardsIcon, page: 'Readings' as Page },
  { name: 'Journal', icon: JournalIcon, page: 'Journal' as Page },
  { name: 'Guide', icon: CompassIcon, page: 'Guide' as Page },
  { name: 'Shop', icon: ShoppingCartIcon, page: 'Shop' as Page },
  { name: 'Progress', icon: BarChartIcon, page: 'Progress' as Page },
  { name: 'Profile', icon: UserIcon, page: 'Profile' as Page },
];

const Sidebar: React.FC<{ activePage: Page; setPage: (page: Page) => void; activeProfile: any; }> = ({ activePage, setPage, activeProfile }) => {
  const xpForNextLevel = Math.round(500 * Math.pow(1.5, activeProfile.level - 1));
  const xpPercentage = (activeProfile.xp / xpForNextLevel) * 100;

  return (
    <nav className="hidden md:flex flex-col w-72 bg-[#08090d] border-r border-white/5 p-6 relative">
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
      
      <div className="mb-10 relative z-10">
          <h1 className="text-xl font-bold font-dm-sans text-white tracking-tighter flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            GRIDPUNK ARCANA
          </h1>
          <div className="mt-4 p-4 glass-panel rounded-xl border-purple-500/20">
            <p className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.2em] mb-2">OPERATOR_STATUS</p>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-bold text-white truncate">{activeProfile.currentName || activeProfile.givenName}</span>
              <span className="text-[10px] font-mono text-purple-400">LVL_{activeProfile.level}</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-3">
              <div className="bg-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${xpPercentage}%` }}></div>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <SparklesIcon className="w-3 h-3" />
              <span className="text-xs font-mono font-bold">{activeProfile.stardust} <span className="text-[9px] text-amber-400/50">DUST</span></span>
            </div>
          </div>
      </div>

      <div className="flex-grow space-y-2 relative z-10">
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">SYSTEM_MODULES</p>
        {navItems.map(item => (
          <button
            key={item.name}
            onClick={() => setPage(item.page)}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all w-full group relative overflow-hidden ${
              activePage === item.page
                ? 'bg-purple-600/10 text-white border border-purple-500/30'
                : 'text-text-muted hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            {activePage === item.page && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
            )}
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${activePage === item.page ? 'text-purple-400' : 'text-white/40'}`} />
            <span className="font-semibold text-sm tracking-tight">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3 text-white/20 text-[10px] font-mono">
          <ZapIcon className="w-3 h-3 text-teal-500 animate-pulse" />
          <span>ETHER_STABLE_v2.5.0</span>
        </div>
      </div>
    </nav>
  );
};

const BottomNav: React.FC<{ activePage: Page; setPage: (page: Page) => void }> = ({ activePage, setPage }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d0e14]/90 backdrop-blur-2xl border-t border-white/5 flex justify-around p-2 z-50">
    {navItems.slice(0, 5).map(item => (
      <button
        key={item.name}
        onClick={() => setPage(item.page)}
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
          activePage === item.page ? 'text-purple-400 bg-purple-500/10' : 'text-white/40'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name}</span>
      </button>
    ))}
  </nav>
);

const pageComponents: { [key in Page]: React.ComponentType<any> } = {
  Daily: DailyPage,
  Readings: ReadingsPage,
  Journal: JournalPage,
  Guide: GuidePage,
  Shop: ShopPage,
  Progress: ProgressPage,
  Profile: ProfilePage,
  Onboarding: OnboardingPage,
};

const AppContent: React.FC = () => {
    const { profiles, activeProfile, activePage, setPage, dailyDrawHistory, savedReadings, journalEntries, unlockAchievement } = useApp();

    useEffect(() => {
        if (activeProfile) {
            const stateForAchievements = {
                unlockedAchievements: activeProfile.unlockedAchievements,
                dailyDrawHistory,
                savedReadings,
                journalEntries,
            };
            checkAndUnlockAchievements(stateForAchievements, unlockAchievement);
        }
    }, [activeProfile, dailyDrawHistory, savedReadings, journalEntries, unlockAchievement]);

    if (profiles.length === 0 || !activeProfile) {
        return <OnboardingPage />;
    }

    const ActivePageComponent = pageComponents[activePage];
  
    return (
      <div className="w-screen h-screen flex bg-[#030407] text-[#E0E6F1] overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          setPage={setPage} 
          activeProfile={activeProfile}
        />
        <main className="flex-1 overflow-hidden pb-20 md:pb-0 relative">
          <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>
          <ActivePageComponent setPage={setPage} />
        </main>
        <BottomNav activePage={activePage} setPage={setPage} />
      </div>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
        <AppContent />
    </AppProvider>
  );
};

export default App;