import React, { useRef, useState } from 'react';

interface ParticleBurstButtonProps {
    onClick: () => void;
    label: string;
    icon?: React.ReactNode;
    className?: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    size: number;
}

const COLORS = ['#a855f7', '#2dd4bf', '#facc15', '#ef4444', '#3b82f6']; // Purple, Teal, Yellow, Red, Blue

const ParticleBurstButton: React.FC<ParticleBurstButtonProps> = ({ onClick, label, icon, className = '' }) => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    let particleIdCounter = useRef(0);

    const triggerBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent multiple rapid clicks from spawning infinite particles if not desired, 
        // though it looks cool. We'll allow it.

        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate click position relative to the button center
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        const newParticles: Particle[] = [];
        const numParticles = 40;

        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 8; // Burst speed
            newParticles.push({
                id: particleIdCounter.current++,
                x: startX,
                y: startY,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                alpha: 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: 2 + Math.random() * 6
            });
        }

        setParticles(prev => [...prev, ...newParticles]);

        // Start animation loop for these particles
        let animationFrame: number;
        let pList = newParticles;

        const animate = () => {
            pList = pList.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vy: p.vy + 0.2, // Gravity
                alpha: p.alpha - 0.02, // Fade out
            })).filter(p => p.alpha > 0);

            if (pList.length > 0) {
                setParticles(current => [
                    ...current.filter(cp => !pList.find(newP => newP.id === cp.id)),
                    ...pList
                ]);
                animationFrame = requestAnimationFrame(animate);
            } else {
                setParticles(current => current.filter(cp => !newParticles.find(newP => newP.id === cp.id)));
                cancelAnimationFrame(animationFrame);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        // Actually trigger the parent's onClick after a slight delay for the effect to show
        setTimeout(() => {
            onClick();
        }, 300);
    };

    return (
        <button
            ref={buttonRef}
            onClick={triggerBurst}
            className={`relative overflow-hidden group px-8 py-4 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 ${className}`}
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* Particles Canvas (HTML/SVG Overlay fallback) */}
            {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="absolute rounded-full"
                            style={{
                                left: `${p.x}px`,
                                top: `${p.y}px`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                backgroundColor: p.color,
                                opacity: Math.max(0, p.alpha),
                                transform: 'translate(-50%, -50%)',
                                boxShadow: `0 0 ${p.size * 2}px ${p.color}`
                            }}
                        />
                    ))}
                </div>
            )}

            <span className="relative z-10 flex items-center justify-center gap-3">
                {icon}
                {label}
            </span>
        </button>
    );
};

export default ParticleBurstButton;
