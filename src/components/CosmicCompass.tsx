import React, { useState } from 'react';

interface CompassProps {
    data: {
        numerology: any;
        astrology: any;
        eastern: any;
        humanDesign: any;
    };
}

const PLANETS = [
    { key: 'sun', label: 'Sun', color: '#FACC15' },
    { key: 'moon', label: 'Moon', color: '#22D3EE' },
    { key: 'mercury', label: 'Mercury', short: 'MER', color: '#60A5FA' },
    { key: 'venus', label: 'Venus', short: 'VEN', color: '#F472B6' },
    { key: 'mars', label: 'Mars', short: 'MAR', color: '#F87171' },
    { key: 'jupiter', label: 'Jupiter', short: 'JUP', color: '#FB923C' },
    { key: 'saturn', label: 'Saturn', short: 'SAT', color: '#A8A29E' },
    { key: 'uranus', label: 'Uranus', short: 'URA', color: '#2DD4BF' },
    { key: 'neptune', label: 'Neptune', short: 'NEP', color: '#818CF8' },
    { key: 'pluto', label: 'Pluto', short: 'PLU', color: '#C084FC' },
    { key: 'ascendant', label: 'Ascendant', short: 'ASC', color: '#E879F9' },
];

const ASPECT_COLORS: Record<string, string> = {
    'Conjunction': '#F59E0B',
    'Opposition': '#EF4444',
    'Square': '#F97316',
    'Trine': '#10B981',
    'Sextile': '#3B82F6',
};

const CosmicCompass: React.FC<CompassProps> = ({ data }) => {
    const { numerology, astrology } = data;
    const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

    const signs = [
        { name: "ARI", color: "#F87171" },
        { name: "TAU", color: "#A3E635" },
        { name: "GEM", color: "#60A5FA" },
        { name: "CAN", color: "#F472B6" },
        { name: "LEO", color: "#FACC15" },
        { name: "VIR", color: "#A3E635" },
        { name: "LIB", color: "#60A5FA" },
        { name: "SCO", color: "#F472B6" },
        { name: "SAG", color: "#F87171" },
        { name: "CAP", color: "#A3E635" },
        { name: "AQU", color: "#60A5FA" },
        { name: "PIS", color: "#F472B6" }
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

    const planetData = PLANETS.map(p => {
        const pData = astrology[p.key];
        return {
            ...p,
            degree: pData?.degree,
            sign: pData?.sign,
            degreeInSign: pData?.degreeInSign
        };
    }).filter(p => p.degree !== undefined);

    const getPlanetDegree = (name: string) => {
        const found = planetData.find(p => p.label.toLowerCase() === name.toLowerCase());
        return found?.degree;
    };

    const aspects = astrology.aspects || [];

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
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
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
                        <text key={sign.name} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={sign.color} opacity={0.4} fontSize="9" className="font-mono font-bold tracking-tighter">
                            {sign.name}
                        </text>
                    );
                })}

                {/* Grid Lines */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
                    const p1 = getCoords(deg, 150);
                    const p2 = getCoords(deg, 180);
                    return (
                        <line key={deg} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    );
                })}

                {/* Aspect Lines */}
                {aspects.map((aspect: any, idx: number) => {
                    const deg1 = getPlanetDegree(aspect.p1);
                    const deg2 = getPlanetDegree(aspect.p2);
                    if (deg1 === undefined || deg2 === undefined) return null;

                    const p1 = getCoords(deg1, 110);
                    const p2 = getCoords(deg2, 110);
                    const color = ASPECT_COLORS[aspect.aspect] || 'rgba(255,255,255,0.2)';
                    const isHovered = hoveredPlanet === aspect.p1 || hoveredPlanet === aspect.p2;

                    return (
                        <line
                            key={`aspect-${idx}`}
                            x1={p1.x} y1={p1.y}
                            x2={p2.x} y2={p2.y}
                            stroke={color}
                            strokeWidth={isHovered ? 2 : 0.5}
                            opacity={isHovered ? 0.8 : 0.3}
                            className="transition-all duration-300"
                        />
                    );
                })}

                {/* Planet Positions */}
                {planetData.map((p) => {
                    const isHovered = hoveredPlanet === p.label;
                    const rOrb = 145;
                    const coords = getCoords(p.degree, rOrb);
                    const textCoords = getCoords(p.degree, rOrb - 15);
                    const lineEndCoords = getCoords(p.degree, 110);

                    return (
                        <g
                            key={p.key}
                            onMouseEnter={() => setHoveredPlanet(p.label)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                            className="cursor-pointer transition-all duration-300"
                        >
                            <line
                                x1={lineEndCoords.x}
                                y1={lineEndCoords.y}
                                x2={coords.x}
                                y2={coords.y}
                                stroke={p.color}
                                strokeWidth={isHovered ? 2 : 1}
                                strokeDasharray={isHovered ? "" : "2 2"}
                                opacity={isHovered ? 0.8 : 0.3}
                            />
                            <circle
                                cx={coords.x}
                                cy={coords.y}
                                r={isHovered ? 8 : 4}
                                fill={p.color}
                                filter="url(#neon)"
                                className="transition-all duration-300"
                            />
                            <text
                                x={textCoords.x}
                                y={textCoords.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={p.color}
                                fontSize={isHovered ? 12 : 8}
                                opacity={isHovered ? 1 : 0.7}
                                className="font-mono font-black uppercase transition-all duration-300"
                            >
                                {p.short || p.label.toUpperCase().substring(0, 3)}
                            </text>

                            {/* Hover Tooltip (drawn on SVG) */}
                            {isHovered && (
                                <g className="pointer-events-none">
                                    <rect
                                        x={150}
                                        y={170}
                                        width={100}
                                        height={60}
                                        rx={4}
                                        fill="rgba(0,0,0,0.8)"
                                        stroke={p.color}
                                        strokeWidth="1"
                                    />
                                    <text x="200" y="185" fill={p.color} fontSize="10" textAnchor="middle" className="font-mono font-bold uppercase">{p.label}</text>
                                    <text x="200" y="200" fill="white" fontSize="10" textAnchor="middle" className="font-mono">{p.sign}</text>
                                    <text x="200" y="215" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" className="font-mono">{p.degreeInSign.toFixed(2)}°</text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* Middle Ring: Outline */}
                <circle cx="200" cy="200" r="110" fill="rgba(0,0,0,0.5)" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" className="pointer-events-none" />

                {/* Center Core: Numerology */}
                {!hoveredPlanet && (
                    <g className="pointer-events-none">
                        <text x="200" y="185" textAnchor="middle" fill="#22D3EE" fontSize="8" className="font-mono uppercase tracking-[0.5em] opacity-40">CORE</text>
                        <text x="200" y="215" textAnchor="middle" fill="white" fontSize="36" className="font-black italic drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{numerology.lifePath}</text>
                    </g>
                )}

                {/* Radar Sweep Effect */}
                <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" className="pointer-events-none" />
                <g className="origin-center animate-[spin_10s_linear_infinite] pointer-events-none">
                    <line x1="200" y1="200" x2="200" y2="90" stroke="url(#sweep-grad)" strokeWidth="2" />
                    <defs>
                        <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </g>

                {/* Center Crosshairs */}
                <line x1="200" y1="90" x2="200" y2="310" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" className="pointer-events-none" />
                <line x1="90" y1="200" x2="310" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" className="pointer-events-none" />
            </svg>
        </div>
    );
};

export default CosmicCompass;
