import React, { useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import { SpreadType, DrawnDivinationCard } from '../../types';
import { SPREAD_DETAILS } from '../../constants';
// For now, importing from relative path, ensuring these components exist or are placeholders
import { HoloCard } from './HoloCard';

interface SpreadCanvasProps {
    spreadType: SpreadType;
    cards: (DrawnDivinationCard | null)[];
    onCardClick?: (index: number) => void;
    revealedIndices: Set<number>;
    isReadOnly?: boolean;
}

export const SpreadCanvas: React.FC<SpreadCanvasProps> = ({
    spreadType,
    cards,
    onCardClick,
    revealedIndices,
    isReadOnly = false
}) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Spring for pan and zoom
    const [{ x, y, scale }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        scale: 1,
        config: { mass: 1, tension: 170, friction: 26 }
    }));

    // Gesture handler
    useGesture(
        {
            onDrag: ({ offset: [ox, oy] }) => {
                api.start({ x: ox, y: oy });
            },
            onPinch: ({ offset: [s], memo }) => {
                api.start({ scale: s });
                return memo;
            },
            onWheel: ({ delta: [, dy], ctrlKey }) => {
                if (ctrlKey) {
                    api.start({ scale: scale.get() - dy * 0.001 });
                } else {
                    // logic for panning if desired, but drag handles pan well
                }
            }
        },
        {
            target: canvasRef,
            drag: { from: () => [x.get(), y.get()] },
            pinch: { scaleBounds: { min: 0.5, max: 2 }, rubric: [scale.get()] }
        }
    );

    const layout = SPREAD_DETAILS[spreadType]?.layout;

    return (
        <div ref={canvasRef} className="w-full h-full relative overflow-hidden bg-black/90 cursor-grab active:cursor-grabbing touch-none">
            <animated.div
                style={{
                    x,
                    y,
                    scale,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transformOrigin: 'center center',
                    touchAction: 'none'
                }}
            >
                {cards.map((card, i) => {
                    const pos = layout?.[i];
                    if (!card || !pos) return null; // Or render placeholder logic if needed

                    return (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                                width: '180px', // base width
                                height: '270px', // base height, aspect ratio
                                zIndex: 10 + i
                            }}
                        >
                            <HoloCard
                                card={card}
                                isRevealed={revealedIndices.has(i)}
                                onClick={() => onCardClick && onCardClick(i)}
                                className="w-full h-full"
                            />
                        </div>
                    )
                })}
            </animated.div>

            {/* Overlay UI for controls could go here (reset zoom, etc) */}
        </div>
    );
};
