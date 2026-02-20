import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SparklesIcon, HomeIcon } from '../components/icons';

const SuccessPage: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
    const { activeProfile } = useApp();

    // Clear the search params so it doesn't get stuck in a loop if they refresh
    useEffect(() => {
        if (window.location.search.includes('payment=success')) {
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }, []);

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col items-center justify-center bg-grid animate-fade-in">
            <div className="glass-panel p-10 md:p-16 rounded-[2.5rem] border-purple-500/40 bg-purple-500/[0.03] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center text-center max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <SparklesIcon className="w-10 h-10 text-purple-400" />
                </div>

                <h1 className="text-5xl font-bold font-dm-sans text-white tracking-tighter mb-4 neon-glow">
                    Transaction Complete
                </h1>

                <p className="text-lg text-white/60 mb-8 max-w-md">
                    Your payment was successful. The requested resources have been added to your account, Operator {activeProfile?.currentName || activeProfile?.givenName}.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={() => setPage('Daily')}
                        className="px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-purple-600 border border-purple-500 text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex items-center justify-center gap-2"
                    >
                        <HomeIcon className="w-4 h-4" />
                        Return to Nexus
                    </button>
                    <button
                        onClick={() => setPage('Shop')}
                        className="px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
