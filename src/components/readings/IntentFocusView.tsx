import React from 'react';

interface IntentFocusViewProps {
    readingIntent: string;
    setReadingIntent: (intent: string) => void;
    userQuestion: string;
    setUserQuestion: (question: string) => void;
    refinedQuestion: string;
    isRefiningQuestion: boolean;
    handleRefineQuestion: () => void;
    onComplete: () => void;
}

export const IntentFocusView: React.FC<IntentFocusViewProps> = ({
    readingIntent,
    setReadingIntent,
    userQuestion,
    setUserQuestion,
    refinedQuestion,
    isRefiningQuestion,
    handleRefineQuestion,
    onComplete
}) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-grid animate-fade-in">
            <h1 className="text-5xl font-bold font-dm-sans text-white mb-8 tracking-tighter neon-glow">Focus Your Energy</h1>
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 max-w-3xl w-full">
                <p className="text-white/60 mb-6 text-center">What is calling for clarity today?</p>
                <div className="flex gap-4 mb-8 justify-center flex-wrap">
                    {['General Guidance', 'Love & Connection', 'Career & Purpose', 'Shadow Work'].map(intent => (
                        <button
                            key={intent}
                            onClick={() => setReadingIntent(intent)}
                            className={`px-6 py-3 rounded-xl border font-mono text-xs uppercase tracking-widest transition-all ${readingIntent === intent ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/30 border-white/10 text-white/40 hover:text-white'}`}
                        >
                            {intent}
                        </button>
                    ))}
                </div>

                <div className="relative mb-8">
                    <input
                        value={userQuestion}
                        onChange={e => setUserQuestion(e.target.value)}
                        placeholder="Type your question..."
                        className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-purple-500 outline-none"
                    />
                    <button
                        onClick={handleRefineQuestion}
                        disabled={!userQuestion || isRefiningQuestion}
                        className="absolute right-3 top-3 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-400 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {isRefiningQuestion ? 'Refining...' : 'Refine'}
                    </button>
                </div>

                {refinedQuestion && refinedQuestion !== userQuestion && (
                    <div className="mb-8 p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                        <p className="text-[10px] text-teal-400 uppercase font-bold mb-2 tracking-widest">Suggested Focus</p>
                        <p className="text-white text-lg font-dm-sans italic">"{refinedQuestion}"</p>
                    </div>
                )}

                <button
                    onClick={onComplete}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl uppercase tracking-widest shadow-glow transition-all"
                >
                    Initialize Spread Selection
                </button>
            </div>
        </div>
    );
};
