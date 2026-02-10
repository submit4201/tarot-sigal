
import { TarotCard, SpreadType, Rune, AngelCard, DeckType, Element, OracleCard, Deck } from './types';

export const TAROT_DECK: TarotCard[] = [
  // Major Arcana
  { id: 'maj_0', name: 'The Fool', arcana: 'Major', keywords: ['Beginnings', 'Innocence', 'Spontaneity'], meaning: 'A new journey begins.', reversedMeaning: 'Recklessness, risk-taking.', microQuest: 'Do something spontaneous today.', element: 'Air' },
  { id: 'maj_1', name: 'The Magician', arcana: 'Major', keywords: ['Manifestation', 'Power', 'Inspired Action'], meaning: 'You have all the tools for success.', reversedMeaning: 'Manipulation, untapped talents.', microQuest: 'Use a skill you usually hide.', element: 'Air' },
  { id: 'maj_2', name: 'The High Priestess', arcana: 'Major', keywords: ['Intuition', 'Unconscious', 'Inner Voice'], meaning: 'Look beyond the obvious.', reversedMeaning: 'Secrets revealed, disconnected intuition.', microQuest: 'Spend 5 minutes in silence.', element: 'Water' },
  { id: 'maj_3', name: 'The Empress', arcana: 'Major', keywords: ['Fertility', 'Nurturing', 'Abundance'], meaning: 'Creativity and growth abound.', reversedMeaning: 'Creative block, dependence.', microQuest: 'Cook a meal or water a plant.', element: 'Earth' },
  { id: 'maj_4', name: 'The Emperor', arcana: 'Major', keywords: ['Authority', 'Structure', 'Control'], meaning: 'Establish order and structure.', reversedMeaning: 'Domination, rigidity.', microQuest: 'Organize your digital workspace.', element: 'Fire' },
  { id: 'maj_5', name: 'The Hierophant', arcana: 'Major', keywords: ['Tradition', 'Morality', 'Ethics'], meaning: 'Seek wisdom from established paths.', reversedMeaning: 'Rebellion, new approaches.', microQuest: 'Learn about an old tradition.', element: 'Earth' },
  { id: 'maj_6', name: 'The Lovers', arcana: 'Major', keywords: ['Love', 'Harmony', 'Choices'], meaning: 'Choose with your heart.', reversedMeaning: 'Disharmony, misalignment.', microQuest: 'Make a decision based on values.', element: 'Air' },
  { id: 'maj_7', name: 'The Chariot', arcana: 'Major', keywords: ['Control', 'Willpower', 'Victory'], meaning: 'Move forward with determination.', reversedMeaning: 'Lack of direction, aggression.', microQuest: 'Focus purely on one task.', element: 'Water' },
  { id: 'maj_8', name: 'Strength', arcana: 'Major', keywords: ['Courage', 'Patience', 'Compassion'], meaning: 'True power comes from within.', reversedMeaning: 'Weakness, self-doubt.', microQuest: 'Be patient with someone frustrating.', element: 'Fire' },
  { id: 'maj_9', name: 'The Hermit', arcana: 'Major', keywords: ['Soul-searching', 'Introspection', 'Solitude'], meaning: 'Withdraw to find guidance.', reversedMeaning: 'Isolation, withdrawal.', microQuest: 'Unplug for an hour.', element: 'Earth' },
  { id: 'maj_10', name: 'Wheel of Fortune', arcana: 'Major', keywords: ['Luck', 'Karma', 'Cycles'], meaning: 'A turning point is hand.', reversedMeaning: 'Bad luck, resistance to change.', microQuest: 'Acknowledge what you cannot control.', element: 'Fire' },
  { id: 'maj_11', name: 'Justice', arcana: 'Major', keywords: ['Truth', 'Fairness', 'Cause/Effect'], meaning: 'Integrity is required.', reversedMeaning: 'Unfairness, lack of accountability.', microQuest: 'Be honest in a tricky situation.', element: 'Air' },
  { id: 'maj_12', name: 'The Hanged Man', arcana: 'Major', keywords: ['Pause', 'Surrender', 'Perspectives'], meaning: 'Let go to gain a new view.', reversedMeaning: 'Stalling, needless sacrifice.', microQuest: 'Look at a problem upside-down.', element: 'Water' },
  { id: 'maj_13', name: 'Death', arcana: 'Major', keywords: ['Endings', 'Change', 'Transformation'], meaning: 'A cycle ends to let a new one begin.', reversedMeaning: 'Resistance to change, stagnation.', microQuest: 'Declutter one physical space.', element: 'Water' },
  { id: 'maj_14', name: 'Temperance', arcana: 'Major', keywords: ['Balance', 'Moderation', 'Patience'], meaning: 'Find the middle ground.', reversedMeaning: 'Imbalance, excess.', microQuest: 'Avoid any excess today.', element: 'Fire' },
  { id: 'maj_15', name: 'The Devil', arcana: 'Major', keywords: ['Bondage', 'Addiction', 'Materialism'], meaning: 'Face your shadow self.', reversedMeaning: 'Breaking free, detachment.', microQuest: 'Identify a limiting habit.', element: 'Earth' },
  { id: 'maj_16', name: 'The Tower', arcana: 'Major', keywords: ['Upheaval', 'Chaos', 'Revelation'], meaning: 'Sudden change shakes foundations.', reversedMeaning: 'Fear of change, avoiding disaster.', microQuest: 'Break a routine intentionally.', element: 'Fire' },
  { id: 'maj_17', name: 'The Star', arcana: 'Major', keywords: ['Hope', 'Faith', 'Rejuvenation'], meaning: 'Inspiration is coming.', reversedMeaning: 'Lack of faith, despair.', microQuest: 'Visualize your best future.', element: 'Air' },
  { id: 'maj_18', name: 'The Moon', arcana: 'Major', keywords: ['Illusion', 'Fear', 'Intuition'], meaning: 'Things are not as they seem.', reversedMeaning: 'Clarity, fear release.', microQuest: 'Write down a dream.', element: 'Water' },
  { id: 'maj_19', name: 'The Sun', arcana: 'Major', keywords: ['Positivity', 'Success', 'Vitality'], meaning: 'Joy and abundance are here.', reversedMeaning: 'Lack of success, pessimism.', microQuest: 'Spend time in natural light.', element: 'Fire' },
  { id: 'maj_20', name: 'Judgement', arcana: 'Major', keywords: ['Awakening', 'Rebirth', 'Calling'], meaning: 'Answer your inner calling.', reversedMeaning: 'Self-doubt, ignoring the call.', microQuest: 'Forgive yourself for a past error.', element: 'Fire' },
  { id: 'maj_21', name: 'The World', arcana: 'Major', keywords: ['Completion', 'Integration', 'Travel'], meaning: 'A cycle comes to a successful close.', reversedMeaning: 'Incompletion, shortcuts.', microQuest: 'Finish a pending task.', element: 'Earth' },

  // Wands (Fire)
  { id: 'w_1', name: 'Ace of Wands', arcana: 'Wands', keywords: ['Inspiration', 'Will', 'Spark'], meaning: 'A burst of energy.', reversedMeaning: 'Creative block.', microQuest: 'Start a new project draft.', element: 'Fire' },
  { id: 'w_2', name: 'Two of Wands', arcana: 'Wands', keywords: ['Planning', 'Future', 'Discovery'], meaning: 'Looking over the horizon.', reversedMeaning: 'Fear of the unknown.', microQuest: 'Plan a future trip.', element: 'Fire' },
  { id: 'w_3', name: 'Three of Wands', arcana: 'Wands', keywords: ['Expansion', 'Foresight', 'Wait'], meaning: 'Ships coming into harbor.', reversedMeaning: 'Delays in plans.', microQuest: 'Wait patiently for news.', element: 'Fire' },
  { id: 'w_4', name: 'Four of Wands', arcana: 'Wands', keywords: ['Celebration', 'Home', 'Stability'], meaning: 'Joyous homecoming.', reversedMeaning: 'Lack of harmony.', microQuest: 'Celebrate a small win.', element: 'Fire' },
  { id: 'w_5', name: 'Five of Wands', arcana: 'Wands', keywords: ['Conflict', 'Competition', 'Struggle'], meaning: 'Clashing energies.', reversedMeaning: 'Conflict avoidance.', microQuest: 'Stand your ground today.', element: 'Fire' },
  { id: 'w_6', name: 'Six of Wands', arcana: 'Wands', keywords: ['Victory', 'Success', 'Publicity'], meaning: 'Recognition for efforts.', reversedMeaning: 'Fall from grace.', microQuest: 'Share your work with others.', element: 'Fire' },
  { id: 'w_7', name: 'Seven of Wands', arcana: 'Wands', keywords: ['Defensiveness', 'Perseverance'], meaning: 'Defending your position.', reversedMeaning: 'Giving up.', microQuest: 'Protect your boundaries.', element: 'Fire' },
  { id: 'w_8', name: 'Eight of Wands', arcana: 'Wands', keywords: ['Speed', 'Action', 'Air travel'], meaning: 'Things moving fast.', reversedMeaning: 'Slow progress.', microQuest: 'Send those pending emails.', element: 'Fire' },
  { id: 'w_9', name: 'Nine of Wands', arcana: 'Wands', keywords: ['Resilience', 'Last stand'], meaning: 'Pushed to the limit.', reversedMeaning: 'Exhaustion.', microQuest: 'Keep going just a bit longer.', element: 'Fire' },
  { id: 'w_10', name: 'Ten of Wands', arcana: 'Wands', keywords: ['Burden', 'Responsibility'], meaning: 'Carrying too much.', reversedMeaning: 'Letting go of weight.', microQuest: 'Delegate one task.', element: 'Fire' },
  { id: 'w_11', name: 'Page of Wands', arcana: 'Wands', keywords: ['Exploration', 'Youthful', 'Discovery'], meaning: 'A message of inspiration.', reversedMeaning: 'Bad news, setbacks.', microQuest: 'Read a new article/book.', element: 'Fire' },
  { id: 'w_12', name: 'Knight of Wands', arcana: 'Wands', keywords: ['Action', 'Adventure', 'Impulse'], meaning: 'Charging forward.', reversedMeaning: 'Haste, scattered energy.', microQuest: 'Go for a run or walk.', element: 'Fire' },
  { id: 'w_13', name: 'Queen of Wands', arcana: 'Wands', keywords: ['Confidence', 'Focus', 'Passion'], meaning: 'Magnetic and strong.', reversedMeaning: 'Selfishness, jealousy.', microQuest: 'Take up more space today.', element: 'Fire' },
  { id: 'w_14', name: 'King of Wands', arcana: 'Wands', keywords: ['Leadership', 'Vision', 'Brave'], meaning: 'The visionary leader.', reversedMeaning: 'Impulsive, overbearing.', microQuest: 'Lead a meeting or group.', element: 'Fire' },

  // Cups (Water)
  { id: 'c_1', name: 'Ace of Cups', arcana: 'Cups', keywords: ['Love', 'Emotion', 'Intuition'], meaning: 'Emotional overflow.', reversedMeaning: 'Emotional block.', microQuest: 'Express your feelings.', element: 'Water' },
  { id: 'c_2', name: 'Two of Cups', arcana: 'Cups', keywords: ['Unified Love', 'Partnership'], meaning: 'Mutual attraction.', reversedMeaning: 'Breakup, disharmony.', microQuest: 'Call a close friend.', element: 'Water' },
  { id: 'c_3', name: 'Three of Cups', arcana: 'Cups', keywords: ['Celebration', 'Friendship'], meaning: 'Socializing and joy.', reversedMeaning: 'Isolation, overindulgence.', microQuest: 'Text three people you appreciate.', element: 'Water' },
  { id: 'c_4', name: 'Four of Cups', arcana: 'Cups', keywords: ['Meditation', 'Apathy', 'Reevaluation'], meaning: 'Boredom or missed offers.', reversedMeaning: 'New interest, motivation.', microQuest: 'Meditate for 10 minutes.', element: 'Water' },
  { id: 'c_5', name: 'Five of Cups', arcana: 'Cups', keywords: ['Loss', 'Regret', 'Grief'], meaning: 'Focusing on the spilled cups.', reversedMeaning: 'Acceptance, moving on.', microQuest: 'Identify one thing you are over.', element: 'Water' },
  { id: 'c_6', name: 'Six of Cups', arcana: 'Cups', keywords: ['Nostalgia', 'Childhood', 'Joy'], meaning: 'Looking back with love.', reversedMeaning: 'Stuck in the past.', microQuest: 'Look at old photos.', element: 'Water' },
  { id: 'c_7', name: 'Seven of Cups', arcana: 'Cups', keywords: ['Choices', 'Fantasy', 'Illusion'], meaning: 'Too many options.', reversedMeaning: 'Clarity, commitment.', microQuest: 'Narrow down your choices.', element: 'Water' },
  { id: 'c_8', name: 'Eight of Cups', arcana: 'Cups', keywords: ['Walking away', 'Disillusion'], meaning: 'Searching for more.', reversedMeaning: 'Fear of moving on.', microQuest: 'Leave a situation early.', element: 'Water' },
  { id: 'c_9', name: 'Nine of Cups', arcana: 'Cups', keywords: ['Satisfaction', 'Wishes'], meaning: 'The wish card.', reversedMeaning: 'Greed, dissatisfaction.', microQuest: 'Make a wish for yourself.', element: 'Water' },
  { id: 'c_10', name: 'Ten of Cups', arcana: 'Cups', keywords: ['Divine Love', 'Bliss'], meaning: 'Ultimate emotional fulfillment.', reversedMeaning: 'Broken home, disconnect.', microQuest: 'Eat dinner with family/friends.', element: 'Water' },
  { id: 'c_11', name: 'Page of Cups', arcana: 'Cups', keywords: ['Creativity', 'Messages', 'Feeling'], meaning: 'A sensitive message.', reversedMeaning: 'Emotional immaturity.', microQuest: 'Draw or doodle today.', element: 'Water' },
  { id: 'c_12', name: 'Knight of Cups', arcana: 'Cups', keywords: ['Romance', 'Charm', 'Beauty'], meaning: 'A romantic proposal.', reversedMeaning: 'Moody, unrealistic.', microQuest: 'Do something beautiful today.', element: 'Water' },
  { id: 'c_13', name: 'Queen of Cups', arcana: 'Cups', keywords: ['Compassion', 'Calm', 'Intuitive'], meaning: 'Emotional support.', reversedMeaning: 'Martyrdom, codependency.', microQuest: 'Listen deeply to someone.', element: 'Water' },
  { id: 'c_14', name: 'King of Cups', arcana: 'Cups', keywords: ['Balance', 'Control', 'Generous'], meaning: 'Emotional stability.', reversedMeaning: 'Volatility, manipulation.', microQuest: 'Stay calm under pressure.', element: 'Water' },

  // Swords (Air)
  { id: 's_1', name: 'Ace of Swords', arcana: 'Swords', keywords: ['Clarity', 'Breakthrough', 'Focus'], meaning: 'Mental power.', reversedMeaning: 'Confusion, chaos.', microQuest: 'Solve a puzzle.', element: 'Air' },
  { id: 's_2', name: 'Two of Swords', arcana: 'Swords', keywords: ['Indecision', 'Stalemate'], meaning: 'Crossroads.', reversedMeaning: 'Information overload.', microQuest: 'Make a minor choice quickly.', element: 'Air' },
  { id: 's_3', name: 'Three of Swords', arcana: 'Swords', keywords: ['Heartbreak', 'Grief', 'Sorrow'], meaning: 'Emotional pain.', reversedMeaning: 'Recovery, forgiveness.', microQuest: 'Acknowledge your sadness.', element: 'Air' },
  { id: 's_4', name: 'Four of Swords', arcana: 'Swords', keywords: ['Rest', 'Relaxation', 'Sanctuary'], meaning: 'Mental recovery.', reversedMeaning: 'Burnout, restlessness.', microQuest: 'Take a nap or long rest.', element: 'Air' },
  { id: 's_5', name: 'Five of Swords', arcana: 'Swords', keywords: ['Conflict', 'Defeat', 'Win at any cost'], meaning: 'Hollow victory.', reversedMeaning: 'Resentment, compromise.', microQuest: 'Pick your battles wisely.', element: 'Air' },
  { id: 's_6', name: 'Six of Swords', arcana: 'Swords', keywords: ['Transition', 'Moving on'], meaning: 'Leaving difficulties.', reversedMeaning: 'Stuck in transition.', microQuest: 'Let go of a grudge.', element: 'Air' },
  { id: 's_7', name: 'Seven of Swords', arcana: 'Swords', keywords: ['Deception', 'Strategy', 'Theft'], meaning: 'Sneaky behavior.', reversedMeaning: 'Confession, regret.', microQuest: 'Be extra careful with data.', element: 'Air' },
  { id: 's_8', name: 'Eight of Swords', arcana: 'Swords', keywords: ['Trapped', 'Restricted'], meaning: 'Imprisoned by thoughts.', reversedMeaning: 'Self-acceptance, release.', microQuest: 'Face a negative thought.', element: 'Air' },
  { id: 's_9', name: 'Nine of Swords', arcana: 'Swords', keywords: ['Anxiety', 'Nightmares'], meaning: 'Mental anguish.', reversedMeaning: 'Hope, light at end of tunnel.', microQuest: 'Write down your worries.', element: 'Air' },
  { id: 's_10', name: 'Ten of Swords', arcana: 'Swords', keywords: ['Betrayal', 'Rock bottom'], meaning: 'Ultimate ending.', reversedMeaning: 'Rising up, recovery.', microQuest: 'Admit when a cycle is over.', element: 'Air' },
  { id: 's_11', name: 'Page of Swords', arcana: 'Swords', keywords: ['Curiosity', 'Mental energy'], meaning: 'A message about truth.', reversedMeaning: 'Hasty words, gossip.', microQuest: 'Learn a new tech concept.', element: 'Air' },
  { id: 's_12', name: 'Knight of Swords', arcana: 'Swords', keywords: ['Haste', 'Action', 'Ambition'], meaning: 'Rushing in.', reversedMeaning: 'Aggression, disorder.', microQuest: 'Be direct in communication.', element: 'Air' },
  { id: 's_13', name: 'Queen of Swords', arcana: 'Swords', keywords: ['Perceptive', 'Direct', 'Independent'], meaning: 'Clear boundaries.', reversedMeaning: 'Cold, overly critical.', microQuest: 'Say "no" clearly today.', element: 'Air' },
  { id: 's_14', name: 'King of Swords', arcana: 'Swords', keywords: ['Intellect', 'Authority', 'Truth'], meaning: 'Objective logic.', reversedMeaning: 'Cruelty, manipulation.', microQuest: 'Solve a problem with data.', element: 'Air' },

  // Pentacles (Earth)
  { id: 'p_1', name: 'Ace of Pentacles', arcana: 'Pentacles', keywords: ['Wealth', 'Opportunity', 'Work'], meaning: 'New material start.', reversedMeaning: 'Lost opportunity.', microQuest: 'Check your bank balance.', element: 'Earth' },
  { id: 'p_2', name: 'Two of Pentacles', arcana: 'Pentacles', keywords: ['Balance', 'Adaptability'], meaning: 'Juggling priorities.', reversedMeaning: 'Disorganization.', microQuest: 'Balance your daily schedule.', element: 'Earth' },
  { id: 'p_3', name: 'Three of Pentacles', arcana: 'Pentacles', keywords: ['Teamwork', 'Collaboration'], meaning: 'Working together.', reversedMeaning: 'Lack of coordination.', microQuest: 'Help a colleague or friend.', element: 'Earth' },
  { id: 'p_4', name: 'Four of Pentacles', arcana: 'Pentacles', keywords: ['Possessiveness', 'Security'], meaning: 'Holding on tight.', reversedMeaning: 'Spending, release.', microQuest: 'Save some money today.', element: 'Earth' },
  { id: 'p_5', name: 'Five of Pentacles', arcana: 'Pentacles', keywords: ['Poverty', 'Isolation'], meaning: 'Hard times.', reversedMeaning: 'Recovery from loss.', microQuest: 'Ask for help if needed.', element: 'Earth' },
  { id: 'p_6', name: 'Six of Pentacles', arcana: 'Pentacles', keywords: ['Generosity', 'Charity'], meaning: 'Giving and receiving.', reversedMeaning: 'Selfishness, debt.', microQuest: 'Donate something small.', element: 'Earth' },
  { id: 'p_7', name: 'Seven of Pentacles', arcana: 'Pentacles', keywords: ['Patience', 'Investment'], meaning: 'Waiting for results.', reversedMeaning: 'Impatience, no growth.', microQuest: 'Review a long-term goal.', element: 'Earth' },
  { id: 'p_8', name: 'Eight of Pentacles', arcana: 'Pentacles', keywords: ['Apprenticeship', 'Skill'], meaning: 'Hard work paying off.', reversedMeaning: 'Lack of ambition.', microQuest: 'Practice a craft for an hour.', element: 'Earth' },
  { id: 'p_9', name: 'Nine of Pentacles', arcana: 'Pentacles', keywords: ['Independence', 'Luxury'], meaning: 'Enjoying your wealth.', reversedMeaning: 'Financial dependence.', microQuest: 'Treat yourself to one luxury.', element: 'Earth' },
  { id: 'p_10', name: 'Ten of Pentacles', arcana: 'Pentacles', keywords: ['Legacy', 'Culmination'], meaning: 'Long-term security.', reversedMeaning: 'Financial failure.', microQuest: 'Plan for your future legacy.', element: 'Earth' },
  { id: 'p_11', name: 'Page of Pentacles', arcana: 'Pentacles', keywords: ['Manifestation', 'Opportunity'], meaning: 'Financial news.', reversedMeaning: 'Lack of progress.', microQuest: 'Learn about investing.', element: 'Earth' },
  { id: 'p_12', name: 'Knight of Pentacles', arcana: 'Pentacles', keywords: ['Routine', 'Reliability'], meaning: 'Methodical progress.', reversedMeaning: 'Boredom, stagnation.', microQuest: 'Follow a strict routine today.', element: 'Earth' },
  { id: 'p_13', name: 'Queen of Pentacles', arcana: 'Pentacles', keywords: ['Nurturing', 'Practical'], meaning: 'The working parent.', reversedMeaning: 'Work-life imbalance.', microQuest: 'Take care of your body.', element: 'Earth' },
  { id: 'p_14', name: 'King of Pentacles', arcana: 'Pentacles', keywords: ['Abundance', 'Mastery'], meaning: 'Successful provider.', reversedMeaning: 'Greed, corruption.', microQuest: 'Take control of your budget.', element: 'Earth' },
];

export const RUNE_DECK: Rune[] = [
    { id: 'rune_fehu', name: 'Fehu', symbol: 'ᚠ', keywords: ['Wealth', 'Abundance'], meaning: 'Possessions won or preserved.', reversible: true },
    { id: 'rune_uruz', name: 'Uruz', symbol: 'ᚢ', keywords: ['Strength', 'Power'], meaning: 'Physical strength and speed.', reversible: true },
    { id: 'rune_thurisaz', name: 'Thurisaz', symbol: 'ᚦ', keywords: ['Protection', 'Reactive Force'], meaning: 'Thorn, protective but sharp.', reversible: true },
    { id: 'rune_ansuz', name: 'Ansuz', symbol: 'ᚨ', keywords: ['Communication', 'Wisdom'], meaning: 'Divine signals and knowledge.', reversible: true },
    { id: 'rune_raidho', name: 'Raidho', symbol: 'ᚱ', keywords: ['Travel', 'Rhythm'], meaning: 'Journey, physical or spiritual.', reversible: true },
    { id: 'rune_kenaz', name: 'Kenaz', symbol: 'ᚲ', keywords: ['Vision', 'Knowledge'], meaning: 'The torch, inner light.', reversible: true },
];

export const ANGEL_CARD_DECK: AngelCard[] = [
    { id: 'angel_1', name: 'Guardian Angel', keywords: ['Protection', 'Love'], meaning: 'You are protected.' },
];

export const ORACLE_DECK: OracleCard[] = [
    { id: 'oracle_1', name: 'Intuition', keywords: ['Insight'], meaning: 'Follow your inner voice.' },
];

export const NUMEROLOGY_MEANINGS: { [key: number]: { theme: string; description: string } } = {
  1: { theme: "The Leader", description: "Independence, innovation, and leadership." },
  2: { theme: "The Diplomat", description: "Cooperation, harmony, and partnership." },
  3: { theme: "The Communicator", description: "Creativity, self-expression, and joy." },
  4: { theme: "The Builder", description: "Stability, hard work, and practicality." },
  5: { theme: "The Adventurer", description: "Freedom, change, and curiosity." },
  6: { theme: "The Nurturer", description: "Responsibility, love, and community." },
  7: { theme: "The Seeker", description: "Introspection, wisdom, and spirituality." },
  8: { theme: "The Powerhouse", description: "Ambition, abundance, and authority." },
  9: { theme: "The Humanitarian", description: "Compassion, completion, and universal love." },
  11: { theme: "The Visionary", description: "Intuition, idealism, and spiritual insight." },
  22: { theme: "The Master Builder", description: "Large-scale manifestation and practical dreams." },
  33: { theme: "The Master Teacher", description: "Healing, compassion, and spiritual guidance." },
};

export const SHOP_DECKS: Deck[] = [
    { id: 'default_tarot', name: 'Gridpunk Tarot', type: 'tarot', description: 'The standard issue cyber-arcana.', price: 0, cards: TAROT_DECK },
    { id: 'ancient_runes', name: 'Elder Futhark', type: 'runes', description: 'Ancestral signals from the deep past.', price: 0, cards: RUNE_DECK },
];

export const ELEMENT_COLORS: { [key in Element]: string } = { Fire: 'text-[#FF7A1A]', Earth: 'text-[#29C26A]', Air: 'text-[#21C7F2]', Water: 'text-[#6E7BFF]' };
export const ELEMENT_HEX_COLORS: { [key in Element]: string } = { Fire: '#FF7A1A', Earth: '#29C26A', Air: '#21C7F2', Water: '#6E7BFF' };
export const ELEMENT_BORDERS: { [key in Element]: string } = { Fire: 'border-[#FF7A1A]', Earth: 'border-[#29C26A]', Air: 'border-[#21C7F2]', Water: 'border-[#6E7BFF]' };

export const SPREAD_DETAILS: { [key in SpreadType]: { name: string; description: string; cardCount: number; isPremium: boolean; positions: string[]; positionMeanings: string[]; deck: DeckType[] } } = {
  '3-card': {
    name: 'Three Card Spread',
    description: 'A quick overview of past, present, and future signals.',
    cardCount: 3,
    isPremium: false,
    positions: ['The Past', 'The Present', 'The Future'],
    positionMeanings: ['Foundational events.', 'Immediate challenges.', 'The likely trajectory.'],
    deck: ['tarot'],
  },
  'mind-body-spirit': {
    name: 'Holistic Sync',
    description: 'A multi-layer check on your essential systems.',
    cardCount: 3,
    isPremium: false,
    positions: ['Mind', 'Body', 'Spirit'],
    positionMeanings: ['Mental processing.', 'Physical vitality.', 'Spiritual frequency.'],
    deck: ['tarot'],
  },
  'career-path': {
    name: 'Pathfinder Protocol',
    description: 'Professional trajectory diagnostic.',
    cardCount: 4,
    isPremium: false,
    positions: ['Current Role', 'Your Strengths', 'Potential Glitch', 'The Upgrade'],
    positionMeanings: ['Current status.', 'Inherent skills.', 'Hidden obstacles.', 'Next evolution.'],
    deck: ['tarot'],
  },
  'celtic-cross': {
    name: 'Celtic Cross',
    description: 'The standard high-resolution diagnostic.',
    cardCount: 11,
    isPremium: true,
    positions: ['Heart', 'Challenge', 'Root', 'Past', 'Crown', 'Future', 'Self', 'Environment', 'Hopes/Fears', 'Outcome', 'Synthesis'],
    positionMeanings: ['The central issue.', 'Crossing force.', 'Root cause.', 'Passing signals.', 'Goal state.', 'Upcoming data.', 'Internal attitude.', 'Environmental factors.', 'Psychological blocks.', 'Final result.', 'Overarching logic.'],
    deck: ['tarot'],
  },
  'partnership': {
      name: 'Nexus Partnership',
      description: 'Analyze the bridge between two signals.',
      cardCount: 7,
      isPremium: true,
      positions: ['Operator 1', 'Operator 2', 'Current Sync', 'Friction Point', 'Shared Drive', 'Potential', 'Future'],
      positionMeanings: ['Your state.', 'Theirs.', 'Present connection.', 'Conflict source.', 'Unified goal.', 'Untapped energy.', 'Long-term link.'],
      deck: ['tarot'],
  },
  'shadow-work': {
      name: 'Shadow Work Probe',
      description: 'Deep-layer diagnostic of the subconscious.',
      cardCount: 4,
      isPremium: true,
      positions: ['The Mask', 'The Hidden', 'The Trigger', 'The Integration'],
      positionMeanings: ['What you show.', 'What you hide.', 'What causes glitches.', 'How to resolve.'],
      deck: ['tarot'],
  },
  'pentagram': {
    name: 'Elemental Pentagram',
    description: 'Balance your fundamental frequencies.',
    cardCount: 5,
    isPremium: true,
    positions: ['Spirit', 'Fire', 'Water', 'Air', 'Earth'],
    positionMeanings: ['Core intent.', 'Action.', 'Emotion.', 'Logic.', 'Manifestation.'],
    deck: ['tarot'],
  },
  'lunar-cycle': {
      name: 'Lunar Cycle Chronology',
      description: 'Temporal mapping based on lunar phases.',
      cardCount: 8,
      isPremium: true,
      positions: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'],
      positionMeanings: ['Initiation.', 'Growth.', 'Action.', 'Refinement.', 'Manifestation.', 'Release.', 'Forgiveness.', 'Rest.'],
      deck: ['tarot'],
  },
  // Placeholders for rest to match SpreadType union
  'relationship': { name: 'Relationship', description: '', cardCount: 3, isPremium: true, positions: ['Self', 'Other', 'Union'], positionMeanings: ['You', 'Them', 'The Relationship'], deck: ['tarot'] },
  'decision-making': { name: 'Binary Fork', description: '', cardCount: 2, isPremium: true, positions: ['Option A', 'Option B'], positionMeanings: ['Path One', 'Path Two'], deck: ['tarot'] },
  'the-great-work': { name: 'Great Work', description: '', cardCount: 5, isPremium: true, positions: ['Core', 'Work', 'Result', 'Lesson', 'Future'], positionMeanings: ['Soul', 'Task', 'Outcome', 'Learning', 'Next'], deck: ['tarot'] },
  'single-rune': { name: 'Single Rune', description: '', cardCount: 1, isPremium: false, positions: ['Signal'], positionMeanings: ['Core message.'], deck: ['runes'] },
  'three-rune-norn': { name: 'The Three Norns', description: '', cardCount: 3, isPremium: false, positions: ['Urd', 'Verdandi', 'Skuld'], positionMeanings: ['Past', 'Present', 'Future'], deck: ['runes'] },
  'five-rune-cross': { name: 'Five Rune Cross', description: '', cardCount: 5, isPremium: true, positions: [], positionMeanings: [], deck: ['runes'] },
  'nine-rune-grid': { name: 'Nine Rune Grid', description: '', cardCount: 9, isPremium: true, positions: [], positionMeanings: [], deck: ['runes'] },
  'full-cast': { name: 'Full Casting', description: '', cardCount: 24, isPremium: true, positions: [], positionMeanings: [], deck: ['runes'] },
  'animal-spirit-guide': { name: 'Spirit Guide', description: '', cardCount: 1, isPremium: false, positions: ['Guide'], positionMeanings: ['The archetype.'], deck: ['oracle'] },
  'sacred-geometry': { name: 'Geometry', description: '', cardCount: 3, isPremium: false, positions: [], positionMeanings: [], deck: ['oracle'] },
  'year-ahead': { name: 'Year Ahead', description: '', cardCount: 12, isPremium: true, positions: [], positionMeanings: [], deck: ['tarot'] },
  'binary-star': { name: 'Binary Star', description: '', cardCount: 2, isPremium: false, positions: [], positionMeanings: [], deck: ['tarot'] },
  'chakra-alignment': { name: 'Chakra Scan', description: '', cardCount: 7, isPremium: true, positions: [], positionMeanings: [], deck: ['tarot'] },
};
