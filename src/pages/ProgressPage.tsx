import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UserIcon, BarChartIcon, SparklesIcon } from '../components/icons';
import { Page, Arcana } from '../types';
import { ACHIEVEMENTS_LIST } from '../services/achievementService';
import { TAROT_DECK } from '../constants';

const levelTitles: { [key: number]: string } = {
  1: "Neophyte",
  5: "Initiate",
  10: "Adept",
  15: "Mystic",
  20: "Oracle",
};

const getCurrentTitle = (level: number): string => {
  let currentTitle = "Neophyte";
  for (const keyString in levelTitles) {
    const levelKey = Number(keyString);
    if (level >= levelKey) {
      currentTitle = levelTitles[levelKey];
    }
  }
  return currentTitle;
};

const getNextTitle = (level: number): string | null => {
  let nextTitle: string | null = null;
  const sortedLevels = Object.keys(levelTitles).map(Number).sort((a, b) => a - b);
  for (const levelKey of sortedLevels) {
    if (level < levelKey) {
      nextTitle = `${levelTitles[levelKey]} (Lvl ${levelKey})`;
      break;
    }
  }
  return nextTitle;
}


const ProgressPage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
  const { isPremium, dailyDrawHistory, savedReadings, activeProfile } = useApp();

  if (!activeProfile) {
    return <div className="p-8 text-center text-text-muted">Initializing Profile Data...</div>;
  }

  const { level, xp, unlockedAchievements } = activeProfile;

  const xpForNextLevel = Math.round(500 * Math.pow(1.5, level - 1));
  const xpPercentage = (xp / xpForNextLevel) * 100;

  const allDrawnCards = useMemo(() => {
    // Map DailyDrawRecord (card name string) to a structure with card object
    const dailyCards = dailyDrawHistory.map(d => {
      // Find card object by name from TAROT_DECK
      const cardObj = TAROT_DECK.find(c => c.name === d.card);
      // Fallback for missing cards
      return { card: cardObj || { name: d.card, arcana: 'Major' as Arcana, id: 'unknown', keywords: [], meaning: '' }, isReversed: d.isRev };
    });
    const readingCards = savedReadings.flatMap(r => r.cards);
    return [...dailyCards, ...readingCards];
  }, [dailyDrawHistory, savedReadings]);

  const readingStats = useMemo(() => {
    if (allDrawnCards.length === 0) {
      return {
        totalReadings: dailyDrawHistory.length + savedReadings.length,
        arcanaCounts: { Major: 0, Wands: 0, Cups: 0, Swords: 0, Pentacles: 0 },
        mostFrequentArcana: 'N/A',
        mostFrequentCard: 'N/A',
      };
    }

    const arcanaCounts: { [key in Arcana]: number } = { Major: 0, Wands: 0, Cups: 0, Swords: 0, Pentacles: 0 };
    const cardCounts: { [key: string]: number } = {};

    for (const drawnCard of allDrawnCards) {
      if (drawnCard?.card && 'arcana' in drawnCard.card) {
        arcanaCounts[drawnCard.card.arcana]++;
      }
      if (drawnCard?.card?.name) {
        cardCounts[drawnCard.card.name] = (cardCounts[drawnCard.card.name] || 0) + 1;
      }
    }

    const mostFrequentArcana = Object.entries(arcanaCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as Arcana;
    const mostFrequentCard = Object.entries(cardCounts).length > 0 ? Object.entries(cardCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'None';

    return {
      totalReadings: dailyDrawHistory.length + savedReadings.length,
      arcanaCounts,
      mostFrequentArcana,
      mostFrequentCard,
    };
  }, [allDrawnCards, dailyDrawHistory, savedReadings]);

  const dailyStreak = useMemo(() => {
    if (dailyDrawHistory.length === 0) return 0;
    let streak = 1;
    const sortedHistory = [...dailyDrawHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const mostRecentDrawDate = new Date(sortedHistory[0].date);
    mostRecentDrawDate.setHours(0, 0, 0, 0);

    const diffTimeToday = today.getTime() - mostRecentDrawDate.getTime();
    const diffDaysToday = Math.floor(diffTimeToday / (1000 * 60 * 60 * 24));

    if (diffDaysToday > 1) return 0;

    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const current = new Date(sortedHistory[i].date);
      const previous = new Date(sortedHistory[i + 1].date);
      current.setHours(0, 0, 0, 0);
      previous.setHours(0, 0, 0, 0);

      const diffTime = current.getTime() - previous.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        break;
      }
    }
    return streak;
  }, [dailyDrawHistory]);


  return (
    <div className="w-full h-full p-4 md:p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-dm-sans text-white">Progression Nexus</h1>
        <p className="text-text-muted">Telemetric tracking of your mystic evolution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-2xl text-center">
            <div className="my-6 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-black/40 flex items-center justify-center border-2 border-purple-500/50 shadow-[0_0_20px_rgba(110,123,255,0.2)]">
                <UserIcon className="w-16 h-16 text-purple-400" />
              </div>
            </div>
            <p className="font-bold text-2xl text-white font-dm-sans tracking-tight">{getCurrentTitle(level)}</p>
            <p className="text-text-muted text-sm mt-1">Next: {getNextTitle(level) || 'Supreme Oracle'}</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Level {level}</h3>
              <span className="text-xs font-mono text-purple-400">{Math.floor(xp)} / {xpForNextLevel} XP</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 border border-white/5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Sync Streak</h3>
              <p className="text-3xl font-bold text-amber-500 font-dm-sans">{dailyStreak} Days</p>
            </div>
            <SparklesIcon className="w-10 h-10 text-amber-500/30" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6 font-dm-sans">Mystic Milestones ({unlockedAchievements.length}/{ACHIEVEMENTS_LIST.length})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
              {ACHIEVEMENTS_LIST.map(ach => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div key={ach.id} className="relative group flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-all duration-500 border ${isUnlocked ? 'border-purple-500/50 bg-purple-500/10 grayscale-0' : 'border-white/5 bg-white/5 grayscale opacity-30'}`}>
                      {ach.icon}
                    </div>
                    <p className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${isUnlocked ? 'text-white' : 'text-text-muted'}`}>{ach.name}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 glass-panel text-white text-[11px] rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl border-white/10">
                      <p className="font-bold mb-1">{ach.name} {isUnlocked && '✓'}</p>
                      <p className="text-text-muted leading-tight">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-6 font-dm-sans flex items-center gap-3">
              <BarChartIcon className="w-6 h-6 text-sky-400" />
              Pattern Analytics
            </h3>
            {isPremium ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Total Signals</p>
                    <p className="text-2xl font-bold text-white font-dm-sans">{readingStats.totalReadings}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Dominant Suit</p>
                    <p className="text-2xl font-bold text-purple-400 font-dm-sans">{readingStats.mostFrequentArcana}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 col-span-2">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Frequent Signature</p>
                    <p className="text-lg font-bold text-white font-dm-sans truncate">{readingStats.mostFrequentCard}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Arcana Saturation</h4>
                  <div className="space-y-4">
                    {Object.entries(readingStats.arcanaCounts).map(([arcana, count]) => {
                      const tarotCardsDrawn = allDrawnCards.filter(c => c && 'arcana' in c.card).length;
                      const countNum = count as number;
                      const percentage = tarotCardsDrawn > 0 ? (countNum / tarotCardsDrawn) * 100 : 0;
                      return (
                        <div key={arcana} className="group">
                          <div className="flex justify-between items-center text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tighter">
                            <span>{arcana}</span>
                            <span className="group-hover:text-white transition-colors">{countNum} Signals</span>
                          </div>
                          <div className="w-full bg-black/40 h-2 rounded-full border border-white/5 overflow-hidden">
                            <div
                              className="bg-sky-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-black/20 rounded-2xl border border-dashed border-white/10">
                <SparklesIcon className="w-12 h-12 mx-auto text-amber-500 mb-4 opacity-50" />
                <h4 className="text-xl font-bold text-white mb-2 font-dm-sans">Unlock Pattern Recognition</h4>
                <p className="text-text-muted text-sm max-w-xs mx-auto mb-6">Analyze long-term trends and arcana saturation across your entire history.</p>
                <button onClick={() => setPage('Profile')} className="px-8 py-3 rounded-full font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-lg">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;