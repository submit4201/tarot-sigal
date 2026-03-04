import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCartIcon, HomeIcon } from '../components/icons';

const CancelPage: React.FC<{ setPage: (page: any) => void }> = ({ setPage }) => {
    const { activeProfile } = useApp();

    // Clear the search params so it doesn't get stuck in a loop if they refresh
    useEffect(() => {
        if (window.location.search.includes('payment=cancelled')) {
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        }
    }, []);

    return (
        <div className="w-full h-full p-6 md:p-14 flex flex-col items-center justify-center animate-fade-in">
            <div className="glass-panel p-10 md:p-16 rounded-[2.5rem] border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-5xl font-bold font-dm-sans text-white tracking-tighter mb-4">
                    Transaction Cancelled
                </h1>

                <p className="text-lg text-white/60 mb-8 max-w-md">
                    The payment process was interrupted. No resources have been deducted from your account, Operator {activeProfile?.currentName || activeProfile?.givenName}.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button
                        onClick={() => setPage('Shop')}
                        className="px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-amber-600/20 border border-amber-500/30 text-amber-400 hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCartIcon className="w-4 h-4" />
                        Return to Shop
                    </button>
                    <button
                        onClick={() => setPage('Daily')}
                        className="px-8 py-4 rounded-2xl font-bold font-mono text-[10px] uppercase tracking-widest bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <HomeIcon className="w-4 h-4" />
                        Back to Nexus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;
