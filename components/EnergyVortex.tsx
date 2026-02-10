
import React, { useEffect, useRef } from 'react';

// CSS-only vortex effect, but we can enhance it with a small canvas if performance allows. 
// For now, pure CSS pulsing nebula effect.

const EnergyVortex: React.FC<{ intensity: number, color?: string }> = ({ intensity, color = 'purple' }) => {
    return (
        <div className="relative w-96 h-96 flex items-center justify-center animate-fade-in">
            {/* Core Nebula - Layer 1 (Base) */}
            <div className={`absolute w-full h-full rounded-full opacity-40 blur-3xl`}
                style={{
                    background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
                    transform: `scale(${1 + intensity * 0.2})`,
                    transition: 'all 2s ease-in-out'
                }}
            ></div>

            {/* Pulsing Rings - Layer 2 */}
            <div className="absolute w-[80%] h-[80%] rounded-full border-2 border-white/10 animate-[spin_10s_linear_infinite]"
                style={{ animationDuration: `${20 - intensity * 10}s` }}></div>
            <div className="absolute w-[60%] h-[60%] rounded-full border border-white/20 animate-[spin_7s_linear_infinite_reverse]"
                style={{ animationDuration: `${15 - intensity * 8}s` }}></div>

            {/* Particle Glows - Layer 3 */}
            <div className="absolute inset-0 animate-pulse" style={{ animationDuration: '3s' }}>
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-teal-400 blur-xl rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-purple-500 blur-xl rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-amber-400 blur-lg rounded-full"></div>
            </div>

            {/* Center Core */}
            <div className={`absolute w-20 h-20 bg-white rounded-full blur-2xl mix-blend-overlay transition-all duration-1000`}
                style={{ opacity: 0.2 + intensity * 0.3, transform: `scale(${0.8 + intensity * 0.5})` }}></div>
        </div>
    );
};

export default EnergyVortex;
