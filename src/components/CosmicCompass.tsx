import React from 'react';

interface CompassProps {
    data: {
        numerology: any;
        astrology: any;
        eastern: any;
        humanDesign: any;
    };
}

const CosmicCompass: React.FC<CompassProps> = ({ data }) => {
    const { numerology, astrology } = data;
    const { sun, moon, ascendant } = astrology;

    const signs = [
        "ARI", "TAU", "GEM", "CAN", "LEO", "VIR",
        "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"
    ];

    // Helper to calculate SVG points from degree (0-360)
    const getCoords = (degree: number, radius: number) => {
        // SVG angles start from right (0 deg), we want top to be 0 for zodiac (Aries)
        const angleRad = (degree - 90) * (Math.PI / 180);
        return {
            x: 200 + radius * Math.cos(angleRad),
            y: 200 + radius * Math.sin(angleRad)
        };
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_30px_rgba(168,85,247,0.3)] select-none">
                <defs>
                    <radialGradient id="compass-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </radialGradient>
                    <filter id="neon">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle cx="200" cy="200" r="180" fill="url(#compass-glow)" />

                {/* Outer Ring: Astrology (Zodiac) */}
                <circle cx="200" cy="200" r="165" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="30" />

                {/* Zodiac Markers */}
                {signs.map((sign, i) => {
                    const { x, y } = getCoords(i * 30 + 15, 165);
                    return (
                        <text key={sign} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.2)" fontSize="9" className="font-mono font-bold tracking-tighter">
                            {sign}
                        </text>
                    );
                })}

                {/* Sun Position */}
                {sun && (
                    <g className="animate-pulse">
                        <line x1="200" y1="200" {...getCoords(sun.degree, 150)} stroke="rgba(250, 204, 21, 0.2)" strokeWidth="1" strokeDasharray="4 2" />
                        <circle {...getCoords(sun.degree, 150)} r="6" fill="#FACC15" filter="url(#neon)" />
                        <text {...getCoords(sun.degree, 135)} textAnchor="middle" fill="#FACC15" fontSize="8" className="font-mono font-black uppercase">SUN</text>
                    </g>
                )}

                {/* Moon Position */}
                {moon && (
                    <g>
                        <line x1="200" y1="200" {...getCoords(moon.degree, 150)} stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" strokeDasharray="4 2" />
                        <circle {...getCoords(moon.degree, 150)} r="5" fill="#22D3EE" filter="url(#neon)" />
                        <text {...getCoords(moon.degree, 135)} textAnchor="middle" fill="#22D3EE" fontSize="8" className="font-mono font-black uppercase">MON</text>
                    </g>
                )}

                {/* Ascendant Position */}
                {ascendant && (
                    <g>
                        <line x1="200" y1="200" {...getCoords(ascendant.degree, 150)} stroke="rgba(168, 85, 247, 0.4)" strokeWidth="2" />
                        <path d={`M 200 200 L ${getCoords(ascendant.degree, 160).x} ${getCoords(ascendant.degree, 160).y}`} stroke="#A855F7" strokeWidth="2" filter="url(#neon)" />
                        <text {...getCoords(ascendant.degree, 175)} textAnchor="middle" fill="#A855F7" fontSize="10" className="font-mono font-black uppercase tracking-widest">ASC</text>
                    </g>
                )}

                {/* Middle Ring: Numerology */}
                <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(34, 211, 238, 0.1)" strokeWidth="2" />
                <text x="200" y="225" textAnchor="middle" fill="#22D3EE" fontSize="8" className="font-mono uppercase tracking-[0.5em] opacity-40">CORE_SYNTHESIS</text>
                <text x="200" y="215" textAnchor="middle" fill="white" fontSize="64" className="font-black italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{numerology.lifePath}</text>

                {/* Radar Sweep Effect */}
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="1" />
                <g className="origin-center animate-[spin_10s_linear_infinite]">
                    <line x1="200" y1="200" x2="200" y2="50" stroke="url(#sweep-grad)" strokeWidth="2" />
                    <defs>
                        <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </g>

                {/* Crosshairs */}
                <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </svg>
        </div>
    );
};

export default CosmicCompass;
