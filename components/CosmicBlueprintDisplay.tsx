import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CosmicBlueprint, Pinnacle, Challenge } from '../types';
import { DestinyIcon, HeritageIcon, LifePathIcon, SoulUrgeIcon, PersonalityIcon, PinnacleIcon, ChallengeIcon, BirthdayIcon, MaturityIcon, SparklesIcon } from './icons';

interface NumberCardProps {
  icon: React.ReactNode;
  title: string;
  number: number;
  theme: string;
  description: string;
  colorClass: string;
}

const NumberCard: React.FC<NumberCardProps> = ({ icon, title, number, theme, description, colorClass }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-black/40 p-3 rounded-xl border border-white/5 border-l-2 ${colorClass} transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="opacity-50 group-hover:opacity-100 transition-opacity p-1.5 bg-white/5 rounded-lg">{icon}</span>
          <div>
            <h4 className="text-[8px] font-mono font-bold uppercase tracking-widest text-text-muted">
              {title}
            </h4>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-left text-white hover:text-purple-400 transition-colors focus:outline-none flex items-center gap-1"
            >
                {theme}
            </button>
          </div>
        </div>
        <span className="text-xl font-bold font-mono text-white tracking-tighter">{number}</span>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
            <p className="text-[10px] font-dm-sans text-text-muted pt-3 leading-relaxed border-t border-white/5 mt-3">
              {description}
            </p>
        </div>
      </div>
    </div>
  );
};

const CosmicBlueprintDisplay: React.FC<{ blueprint: CosmicBlueprint }> = ({ blueprint }) => {
  return (
    <div className="space-y-2">
      <NumberCard
        icon={<LifePathIcon className="w-3 h-3 text-purple-400" />}
        title="Path"
        number={blueprint.lifePath.number}
        theme={blueprint.lifePath.theme}
        description={blueprint.lifePath.description}
        colorClass="border-purple-400/50"
      />
      <NumberCard
        icon={<DestinyIcon className="w-3 h-3 text-sky-400" />}
        title="Destiny"
        number={blueprint.destiny.number}
        theme={blueprint.destiny.theme}
        description={blueprint.destiny.description}
        colorClass="border-sky-400/50"
      />
      <NumberCard
        icon={<SoulUrgeIcon className="w-3 h-3 text-pink-400" />}
        title="Soul"
        number={blueprint.soulUrge.number}
        theme={blueprint.soulUrge.theme}
        description={blueprint.soulUrge.description}
        colorClass="border-pink-400/50"
      />
      <NumberCard
        icon={<PersonalityIcon className="w-3 h-3 text-teal-400" />}
        title="Persona"
        number={blueprint.personality.number}
        theme={blueprint.personality.theme}
        description={blueprint.personality.description}
        colorClass="border-teal-400/50"
      />
    </div>
  );
};

export default CosmicBlueprintDisplay;