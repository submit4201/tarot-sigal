import React from 'react';

const Sparkline = ({ data }: { data: number[] }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 40;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full flex flex-col items-center">
            <svg viewBox={`0 -5 100 50`} className="w-full h-12 overflow-visible">
                <polyline
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    points={points}
                    className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
                />
                {data.map((val, i) => (
                    <circle
                        key={i}
                        cx={(i / (data.length - 1)) * width}
                        cy={height - ((val - min) / range) * height}
                        r="2"
                        fill="#2dd4bf"
                    />
                ))}
            </svg>
            <div className="flex justify-between w-full text-[8px] font-mono text-white/50 uppercase mt-2">
                <span>7 Days Ago</span>
                <span>Today</span>
            </div>
        </div>
    );
};

export default Sparkline;
