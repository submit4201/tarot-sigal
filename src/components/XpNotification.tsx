
import React, { useEffect, useState } from 'react';
import { ZapIcon } from './icons';

interface XpNotificationProps {
    amount: number;
    reason?: string;
    onComplete: () => void;
}

const XpNotification: React.FC<XpNotificationProps> = ({ amount, reason, onComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slide in
        setTimeout(() => setIsVisible(true), 50);

        // Slide out and cleanup
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for exit animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed bottom-24 right-6 z-50 transform transition-all duration-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="glass-panel p-4 pr-6 flex items-center gap-4 border-l-4 border-l-purple-500 bg-black/80 shadow-2xl backdrop-blur-md rounded-r-xl rounded-l-sm">
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 animate-pulse"></div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 text-purple-400 relative z-10">
                        <ZapIcon className="w-5 h-5" />
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold text-white font-dm-sans leading-none mb-1">+{amount} XP</h4>
                    <p className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">{reason || 'Activity_Complete'}</p>
                </div>
            </div>
        </div>
    );
};

export default XpNotification;
