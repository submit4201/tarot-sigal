import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AstroAspect } from '../../types';

interface PlanetData {
    key: string;
    label: string;
    short: string;
    color: string;
    degree: number;
    sign: string;
    degreeInSign: number;
    house?: number;
}

interface InteractiveNatalChartProps {
    data: {
        astrology: {
            sun: any;
            moon: any;
            mercury: any;
            venus: any;
            mars: any;
            jupiter: any;
            saturn: any;
            uranus: any;
            neptune: any;
            pluto: any;
            ascendant: any;
            aspects: AstroAspect[];
            houses: number[];
        };
    };
    onPlanetClick: (planet: PlanetData) => void;
}

const PLANET_CONFIG = [
    { key: 'sun', label: 'Sun', short: '☉', color: '#FACC15' },
    { key: 'moon', label: 'Moon', short: '☽', color: '#22D3EE' },
    { key: 'mercury', label: 'Mercury', short: '☿', color: '#60A5FA' },
    { key: 'venus', label: 'Venus', short: '♀', color: '#F472B6' },
    { key: 'mars', label: 'Mars', short: '♂', color: '#F87171' },
    { key: 'jupiter', label: 'Jupiter', short: '♃', color: '#FB923C' },
    { key: 'saturn', label: 'Saturn', short: '♄', color: '#A8A29E' },
    { key: 'uranus', label: 'Uranus', short: '♅', color: '#2DD4BF' },
    { key: 'neptune', label: 'Neptune', short: '♆', color: '#818CF8' },
    { key: 'pluto', label: 'Pluto', short: '♇', color: '#C084FC' },
    { key: 'ascendant', label: 'Ascendant', short: 'ASC', color: '#E879F9' },
];

const SIGN_CONFIG = [
    { name: "Aries", short: "ARI", color: "#F87171", element: 'Fire' },
    { name: "Taurus", short: "TAU", color: "#A3E635", element: 'Earth' },
    { name: "Gemini", short: "GEM", color: "#60A5FA", element: 'Air' },
    { name: "Cancer", short: "CAN", color: "#F472B6", element: 'Water' },
    { name: "Leo", short: "LEO", color: "#FACC15", element: 'Fire' },
    { name: "Virgo", short: "VIR", color: "#A3E635", element: 'Earth' },
    { name: "Libra", short: "LIB", color: "#60A5FA", element: 'Air' },
    { name: "Scorpio", short: "SCO", color: "#F472B6", element: 'Water' },
    { name: "Sagittarius", short: "SAG", color: "#F87171", element: 'Fire' },
    { name: "Capricorn", short: "CAP", color: "#A3E635", element: 'Earth' },
    { name: "Aquarius", short: "AQU", color: "#60A5FA", element: 'Air' },
    { name: "Pisces", short: "PIS", color: "#F472B6", element: 'Water' }
];

const ASPECT_COLORS: Record<string, string> = {
    'Conjunction': '#FACC15',
    'Opposition': '#F87171',
    'Square': '#FB923C',
    'Trine': '#4ADE80',
    'Sextile': '#60A5FA',
};

const InteractiveNatalChart: React.FC<InteractiveNatalChartProps> = ({ data, onPlanetClick }) => {
    const { astrology } = data;
    const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

    const getCoords = (degree: number, radius: number, center: number = 250) => {
        // Correcting for traditional natal chart view where Ascendant (0 houses) is at 9 o'clock
        // But SVG angles start at 3 o'clock (0 rad).
        // So we rotate by 180 degrees.
        const angleRad = (degree + 180) * (Math.PI / 180);
        return {
            x: center + radius * Math.cos(angleRad),
            y: center + radius * Math.sin(angleRad)
        };
    };

    const planets = useMemo(() => {
        return PLANET_CONFIG.map(p => {
            const pData = (astrology as any)[p.key];
            if (!pData) return null;
            return {
                ...p,
                degree: pData.degree,
                sign: pData.sign,
                degreeInSign: pData.degreeInSign,
                house: pData.house
            } as PlanetData;
        }).filter(Boolean) as PlanetData[];
    }, [astrology]);

    const houses = astrology.houses || [];
    const aspects = astrology.aspects || [];

    const ascDegree = astrology.ascendant?.degree || 0;

    return (
        <div className="relative w-full aspect-square max-w-[600px] mx-auto group">
            <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl overflow-visible select-none">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                    </radialGradient>
                </defs>

                {/* Background Glow */}
                <circle cx="250" cy="250" r="240" fill="url(#centerGradient)" />

                {/* Outer Zodiac Ring */}
                <circle cx="250" cy="250" r="220" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="40" />
                {SIGN_CONFIG.map((sign, i) => {
                    const startDeg = i * 30 - ascDegree;
                    const midDeg = startDeg + 15;
                    const { x, y } = getCoords(midDeg, 220);

                    return (
                        <g key={sign.name}>
                            <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={sign.color}
                                className="text-[10px] font-mono font-bold opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                            >
                                {sign.short}
                            </text>
                            {/* Segment Lines */}
                            {(() => {
                                const p1 = getCoords(startDeg, 200);
                                const p2 = getCoords(startDeg, 240);
                                return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
                            })()}
                        </g>
                    );
                })}

                {/* House Divisions */}
                <g opacity="0.2">
                    {houses.map((houseDeg, i) => {
                        const deg = houseDeg - ascDegree;
                        const p1 = getCoords(deg, 50);
                        const p2 = getCoords(deg, 200);
                        return (
                            <line
                                key={`house-${i}`}
                                x1={p1.x} y1={p1.y}
                                x2={p2.x} y2={p2.y}
                                stroke="white"
                                strokeWidth={i % 3 === 0 ? 2 : 0.5}
                                strokeDasharray={i % 3 === 0 ? "" : "4 4"}
                            />
                        );
                    })}
                </g>

                {/* Aspect Lines */}
                <g className="aspect-lines">
                    {aspects.map((aspect, i) => {
                        const p1 = planets.find(p => p.label === aspect.p1);
                        const p2 = planets.find(p => p.label === aspect.p2);
                        if (!p1 || !p2) return null;

                        const lineP1 = getCoords(p1.degree - ascDegree, 170);
                        const lineP2 = getCoords(p2.degree - ascDegree, 170);
                        const color = ASPECT_COLORS[aspect.aspect] || 'rgba(255,255,255,0.1)';
                        const isHovered = hoveredEntry === p1.key || hoveredEntry === p2.key;

                        return (
                            <motion.line
                                key={`aspect-${i}`}
                                x1={lineP1.x} y1={lineP1.y}
                                x2={lineP2.x} y2={lineP2.y}
                                stroke={color}
                                strokeWidth={isHovered ? 2 : 0.5}
                                opacity={isHovered ? 0.8 : 0.2}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: isHovered ? 0.8 : 0.2 }}
                                transition={{ duration: 1.5, delay: i * 0.05 }}
                            />
                        );
                    })}
                </g>

                {/* Planetary Nodes */}
                {planets.map((p) => {
                    const deg = p.degree - ascDegree;
                    const pos = getCoords(deg, 185);
                    const labelPos = getCoords(deg, 205);
                    const isHovered = hoveredEntry === p.key;

                    return (
                        <motion.g
                            key={p.key}
                            onMouseEnter={() => setHoveredEntry(p.key)}
                            onMouseLeave={() => setHoveredEntry(null)}
                            onClick={() => onPlanetClick(p)}
                            className="cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                        >
                            {/* Connector line to center */}
                            <line
                                x1={250} y1={250}
                                x2={pos.x} y2={pos.y}
                                stroke={p.color}
                                strokeWidth="0.5"
                                strokeDasharray="2 2"
                                opacity={isHovered ? 0.4 : 0.1}
                            />

                            {/* Planet Pulse */}
                            {isHovered && (
                                <motion.circle
                                    cx={pos.x} cy={pos.y} r={12}
                                    fill="none"
                                    stroke={p.color}
                                    initial={{ scale: 1, opacity: 0.5 }}
                                    animate={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            {/* Planet Node */}
                            <circle
                                cx={pos.x} cy={pos.y} r={isHovered ? 8 : 6}
                                fill={p.color}
                                filter="url(#glow)"
                            />

                            {/* Glyph/Symbol */}
                            <text
                                x={pos.x} y={pos.y + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="black"
                                className="text-[10px] font-bold"
                            >
                                {p.short}
                            </text>

                            {/* Label */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.g
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <rect
                                            x={labelPos.x - 40} y={labelPos.y - 12}
                                            width={80} height={24} rx={4}
                                            fill="rgba(0,0,0,0.8)"
                                            stroke={p.color}
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={labelPos.x} y={labelPos.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="white"
                                            className="text-[9px] font-mono uppercase tracking-widest"
                                        >
                                            {p.label}
                                        </text>
                                    </motion.g>
                                )}
                            </AnimatePresence>
                        </motion.g>
                    );
                })}

                {/* Center Core */}
                <circle cx="250" cy="250" r="40" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <motion.circle
                    cx="250" cy="250" r="30"
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="0.5"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    strokeDasharray="5 5"
                />
            </svg>

            {/* Narrative Tooltip (Overlay) */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/80 border border-white/10 backdrop-blur-md p-3 rounded-lg overflow-hidden max-w-[200px]">
                    <div className="text-[10px] text-purple-400 font-mono mb-1">CURRENT SEQUENCE</div>
                    <div className="text-white font-bold tracking-tight">
                        {hoveredEntry ?
                            planets.find(p => p.key === hoveredEntry)?.label.toUpperCase() :
                            'NEXUS CORE'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveNatalChart;
