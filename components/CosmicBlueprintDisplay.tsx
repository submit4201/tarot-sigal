import React, { useState } from 'react';
import { CosmicBlueprint, CosmicNumber, Pinnacle, Challenge } from '../types';

/**
 * NumberCard — Displays a single CosmicNumber with expandable description.
 */
const NumberCard: React.FC<{
  label: string;
  cosmicNumber: CosmicNumber;
  icon: string;
  accentColor?: string;
}> = ({ label, cosmicNumber, icon, accentColor = 'purple' }) => {
  const [expanded, setExpanded] = useState(false);

  const colorMap: Record<string, { text: string; border: string; bg: string }> = {
    purple: { text: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
    teal: { text: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-500/5' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
    rose: { text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5' },
    blue: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
    sky: { text: 'text-sky-400', border: 'border-sky-500/20', bg: 'bg-sky-500/5' },
    orange: { text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5' },
  };

  const colors = colorMap[accentColor] || colorMap.purple;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`p-4 rounded-2xl border ${colors.border} ${colors.bg} cursor-pointer hover:scale-[1.02] transition-all group`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-dm-sans ${colors.text}`}>{cosmicNumber.number}</span>
            <span className="text-xs text-white/60 font-semibold">{cosmicNumber.theme}</span>
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
        <p className="text-xs text-white/50 leading-relaxed border-t border-white/5 pt-3">
          {cosmicNumber.description}
        </p>
      </div>
      <p className="text-[8px] font-mono text-white/15 mt-1 group-hover:text-white/30 transition-colors">
        {expanded ? 'Click to collapse' : 'Click to expand'}
      </p>
    </div>
  );
};

/**
 * PinnacleCard — Renders a pinnacle or challenge lifecycle item.
 */
const LifecycleCard: React.FC<{
  item: Pinnacle | Challenge;
  type: 'pinnacle' | 'challenge';
  index: number;
}> = ({ item, type, index }) => {
  const isPinnacle = type === 'pinnacle';
  const color = isPinnacle ? 'text-amber-400' : 'text-rose-400';
  const borderColor = isPinnacle ? 'border-amber-500/15' : 'border-rose-500/15';
  const bgColor = isPinnacle ? 'bg-amber-500/5' : 'bg-rose-500/5';

  return (
    <div className={`p-3 rounded-xl border ${borderColor} ${bgColor}`}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold font-dm-sans ${color}`}>{item.number}</span>
          <span className="text-xs text-white/60 font-semibold">{item.theme}</span>
        </div>
        <span className="text-[8px] font-mono text-white/20 uppercase">{item.ageRange}</span>
      </div>
      <p className="text-[10px] text-white/40 leading-relaxed">{item.description}</p>
    </div>
  );
};

/**
 * CosmicBlueprintDisplay — Full display of all numerology calculations.
 *
 * ! Previously only showed 4 of 8 core numbers. Now shows all 8 plus
 *   Pinnacles, Challenges, and Karmic Debts in collapsible sections.
 */
const CosmicBlueprintDisplay: React.FC<{ blueprint: CosmicBlueprint }> = ({ blueprint }) => {
  const [showLifecycle, setShowLifecycle] = useState(false);

  // * Core numbers with their icons and accent colors
  const coreNumbers = [
    { key: 'lifePath', label: 'Life Path', icon: '🌀', color: 'purple', data: blueprint.lifePath },
    { key: 'destiny', label: 'Destiny', icon: '🔮', color: 'teal', data: blueprint.destiny },
    { key: 'soulUrge', label: 'Soul Urge', icon: '💜', color: 'rose', data: blueprint.soulUrge },
    { key: 'personality', label: 'Personality', icon: '🎭', color: 'amber', data: blueprint.personality },
    { key: 'heritage', label: 'Heritage', icon: '🧬', color: 'blue', data: blueprint.heritage },
    { key: 'currentVibe', label: 'Current Vibe', icon: '⚡', color: 'emerald', data: blueprint.currentVibe },
    { key: 'birthday', label: 'Birthday', icon: '🎂', color: 'sky', data: blueprint.birthday },
    { key: 'maturity', label: 'Maturity', icon: '🌙', color: 'orange', data: blueprint.maturity },
  ];

  return (
    <div className="space-y-6">
      {/* Core 8 Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coreNumbers.map(item => (
          <NumberCard
            key={item.key}
            label={item.label}
            cosmicNumber={item.data}
            icon={item.icon}
            accentColor={item.color}
          />
        ))}
      </div>

      {/* Karmic Debt Indicator */}
      {blueprint.karmicDebts.length > 0 && (
        <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">⚠</span>
            <div>
              <p className="text-[9px] font-mono text-red-400/60 uppercase tracking-[0.3em] font-bold">Karmic_Debt_Detected</p>
              <div className="flex gap-2 mt-1">
                {blueprint.karmicDebts.map(d => (
                  <span key={d} className="text-lg font-bold font-dm-sans text-red-400">{d}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-red-300/40 leading-relaxed mt-1">
            Karmic debts indicate lessons from past cycles that require attention in this lifetime.
          </p>
        </div>
      )}

      {/* Pinnacles & Challenges — collapsible */}
      <div>
        <button
          onClick={() => setShowLifecycle(!showLifecycle)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] font-bold">
              Lifecycle_Map ({blueprint.pinnacles.length} Pinnacles / {blueprint.challenges.length} Challenges)
            </span>
          </div>
          <span className={`text-white/20 transition-transform ${showLifecycle ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className={`overflow-hidden transition-all duration-500 ${showLifecycle ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          {blueprint.pinnacles.length > 0 && (
            <div className="mb-4">
              <p className="text-[9px] font-mono text-amber-400/50 uppercase tracking-[0.3em] font-bold mb-3">Pinnacles</p>
              <div className="space-y-2">
                {blueprint.pinnacles.map((p, i) => (
                  <LifecycleCard key={`pin-${i}`} item={p} type="pinnacle" index={i} />
                ))}
              </div>
            </div>
          )}

          {blueprint.challenges.length > 0 && (
            <div>
              <p className="text-[9px] font-mono text-rose-400/50 uppercase tracking-[0.3em] font-bold mb-3">Challenges</p>
              <div className="space-y-2">
                {blueprint.challenges.map((c, i) => (
                  <LifecycleCard key={`chal-${i}`} item={c} type="challenge" index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CosmicBlueprintDisplay;