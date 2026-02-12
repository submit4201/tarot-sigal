import React from 'react';
import { useSpring, animated, to } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { CardBack } from '../CardBack';

interface CyberDeckProps {
    onShuffle: () => void;
    onDraw: () => void;
    deckCount: number;
    isFanned?: boolean;
}

export const CyberDeck: React.FC<CyberDeckProps> = ({ onShuffle, onDraw, deckCount, isFanned = false }) => {

    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

    // Spring for fan animation
    const { fanProgress } = useSpring({
        fanProgress: isFanned ? 1 : 0,
        config: { tension: 180, friction: 24 }
    });

    // Bind drag gesture
    const bind = useDrag(({ down, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
        // Apply physics-based movement
        api.start({ x: down ? mx : 0, y: down ? my : 0, immediate: down });

        if (!down) {
            // Throw Logic: High velocity release
            const speed = Math.sqrt(vx * vx + vy * vy);

            if (speed > 0.5 && dy < -0.5) {
                // Thrown UP (towards the "table")
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                onDraw();
            } else if (Math.abs(mx) > 150 || Math.abs(my) > 150) {
                // Dragged far enough: Shuffle
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(200);
                onShuffle();
            }
        }
    });

    // We render a stack visual
    return (
        <animated.div
            {...(bind as any)()}
            style={{ x, y, touchAction: 'none' }}
            className="w-48 h-72 relative cursor-grab active:cursor-grabbing"
        >
            {/* Visual Stack/Fan Effect */}
            {Array.from({ length: Math.max(0, Math.min(5, deckCount - 1)) }).map((_, i) => {
                // Calculate fan positions
                const offset = i - 2;
                const fanX = offset * 30; // Horizontal spread
                const fanY = Math.abs(offset) * 5; // Slight arc
                const fanRot = offset * 10; // Rotation fan

                // Stack positions
                const stackX = i * -2;
                const stackY = i * -2;
                const stackRot = 0;

                return (
                    <animated.div
                        key={i}
                        className="absolute inset-0 rounded-xl border border-white/20 bg-black shadow-xl origin-bottom"
                        style={{
                            transform: to([fanProgress], (p) => {
                                const currentX = stackX + (fanX - stackX) * p;
                                const currentY = stackY + (fanY - stackY) * p;
                                const currentRot = stackRot + (fanRot - stackRot) * p;
                                return `translate(${currentX}px, ${currentY}px) rotate(${currentRot}deg)`;
                            }),
                            zIndex: 10 - i
                        }}
                    >
                        <CardBack />
                    </animated.div>
                );
            })}

            {/* Top Card (Active) */}
            <div className="absolute inset-0 rounded-xl border border-teal-500/50 shadow-[0_0_30px_rgba(45,212,191,0.3)] z-50">
                <CardBack />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white/50 font-mono text-xs font-bold bg-black/50 px-2 py-1 rounded">
                        {isFanned ? 'THROW_TO_DEAL' : 'DRAG_TO_SHUFFLE'}
                    </span>
                </div>
            </div>

        </animated.div>
    );
};
