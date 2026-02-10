
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { DrawnDivinationCard, SpreadType } from '../types';

interface CardAnimationCanvasProps {
  drawnCards: DrawnDivinationCard[];
  spreadType: SpreadType;
  cardDimensions: { width: number; height: number };
  onAnimationComplete: () => void;
}

interface AnimatedCard {
  targetX: number;
  targetY: number;
  targetRotation: number;
  currentX: number;
  currentY: number;
  currentRotation: number;
  color: p5.Color;
  index: number;
}

const calculateSpreadPositions = (
  p: p5,
  spreadType: SpreadType,
  cardCount: number,
  canvasWidth: number,
  canvasHeight: number,
  cardWidth: number,
  cardHeight: number,
): { x: number; y: number; rotation: number }[] => {
  const positions: { x: number; y: number; rotation: number }[] = [];
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const marginX = cardWidth * 0.2; // Small margin for visual spacing
  const marginY = cardHeight * 0.2;

  switch (spreadType) {
    case '3-card': // Past, Present, Future (horizontal)
    case 'mind-body-spirit':
    case 'three-rune-norn':
      const totalWidth = cardCount * cardWidth + (cardCount - 1) * marginX;
      let startX = centerX - totalWidth / 2;
      for (let i = 0; i < cardCount; i++) {
        positions.push({
          x: startX + i * (cardWidth + marginX) + cardWidth / 2,
          y: centerY,
          rotation: 0,
        });
      }
      break;

    case 'career-path': // 2x2 grid, or slightly staggered
      const cols = 2;
      const rows = Math.ceil(cardCount / cols);
      const gridWidth = cols * cardWidth + (cols - 1) * marginX;
      const gridHeight = rows * cardHeight + (rows - 1) * marginY;
      let startGridX = centerX - gridWidth / 2;
      let startGridY = centerY - gridHeight / 2;
      for (let i = 0; i < cardCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions.push({
          x: startGridX + col * (cardWidth + marginX) + cardWidth / 2,
          y: startGridY + row * (cardHeight + marginY) + cardHeight / 2,
          rotation: 0,
        });
      }
      break;

    case 'the-great-work': // 5 cards, often a cross or inverted T
      // Center card
      positions.push({ x: centerX, y: centerY, rotation: 0 });
      // Other 4 cards around it
      positions.push({ x: centerX, y: centerY - cardHeight - marginY, rotation: 0 }); // Top
      positions.push({ x: centerX - cardWidth - marginX, y: centerY, rotation: 0 }); // Left
      positions.push({ x: centerX + cardWidth + marginX, y: centerY, rotation: 0 }); // Right
      positions.push({ x: centerX, y: centerY + cardHeight + marginY, rotation: 0 }); // Bottom
      break;

    case 'relationship': // often 2 rows of 3, or a larger cluster
      const relCols = 3;
      const relRows = 2;
      const relGridWidth = relCols * cardWidth + (relCols - 1) * marginX;
      const relGridHeight = relRows * cardHeight + (relRows - 1) * marginY;
      let relStartGridX = centerX - relGridWidth / 2;
      let relStartGridY = centerY - relGridHeight / 2;
      for (let i = 0; i < cardCount; i++) {
        const col = i % relCols;
        const row = Math.floor(i / relCols);
        positions.push({
          x: relStartGridX + col * (cardWidth + marginX) + cardWidth / 2,
          y: relStartGridY + row * (cardHeight + marginY) + cardHeight / 2,
          rotation: 0,
        });
      }
      break;

    case 'decision-making': // often 3 on left (Path A), 3 on right (Path B), 1 in middle
      const pathXOffset = canvasWidth / 4;
      const pathYOffset = cardHeight + marginY;

      // Path A (left side)
      positions.push({ x: centerX - pathXOffset, y: centerY - pathYOffset, rotation: 0 }); // Path A Action
      positions.push({ x: centerX - pathXOffset, y: centerY, rotation: 0 }); // Path A Outcome
      positions.push({ x: centerX - pathXOffset, y: centerY + pathYOffset, rotation: 0 }); // Path A Outcome

      // Path B (right side)
      positions.push({ x: centerX + pathXOffset, y: centerY - pathYOffset, rotation: 0 }); // Path B Action
      positions.push({ x: centerX + pathXOffset, y: centerY, rotation: 0 }); // Path B Outcome
      positions.push({ x: centerX + pathXOffset, y: centerY + pathYOffset, rotation: 0 }); // Path B Outcome

      // Central Advice
      positions.push({ x: centerX, y: centerY, rotation: 0 });
      break;

    case 'celtic-cross': // Complex 11-card layout
      // Center cross (6 cards)
      positions.push({ x: centerX, y: centerY, rotation: 0 }); // 1. Heart
      positions.push({ x: centerX + cardWidth * 0.7, y: centerY, rotation: 90 }); // 2. Challenge (crossing)
      positions.push({ x: centerX, y: centerY + cardHeight, rotation: 0 }); // 3. Foundation
      positions.push({ x: centerX - cardWidth, y: centerY, rotation: 0 }); // 4. Past
      positions.push({ x: centerX, y: centerY - cardHeight, rotation: 0 }); // 5. Crown
      positions.push({ x: centerX + cardWidth, y: centerY, rotation: 0 }); // 6. Future

      // Staff (4 cards)
      const staffX = centerX + cardWidth * 2;
      positions.push({ x: staffX, y: centerY + cardHeight * 1.5, rotation: 0 }); // 7. Your Attitude
      positions.push({ x: staffX, y: centerY + cardHeight * 0.5, rotation: 0 }); // 8. External Influences
      positions.push({ x: staffX, y: centerY - cardHeight * 0.5, rotation: 0 }); // 9. Hopes and Fears
      positions.push({ x: staffX, y: centerY - cardHeight * 1.5, rotation: 0 }); // 10. Final Outcome

      // Overall Theme (1 card) - usually on top of the staff or slightly above
      positions.push({ x: centerX - cardWidth * 1.5, y: centerY - cardHeight * 1.5, rotation: 0 });
      break;

    case 'single-rune':
    case 'animal-spirit-guide':
      positions.push({ x: centerX, y: centerY, rotation: 0 });
      break;
    
    case 'five-rune-cross': // Similar to the-great-work but can be more spread
      // Center card
      positions.push({ x: centerX, y: centerY, rotation: 0 });
      // Other 4 cards in a cross
      positions.push({ x: centerX, y: centerY - cardHeight, rotation: 0 }); // Top
      positions.push({ x: centerX - cardWidth, y: centerY, rotation: 0 }); // Left
      positions.push({ x: centerX + cardWidth, y: centerY, rotation: 0 }); // Right
      positions.push({ x: centerX, y: centerY + cardHeight, rotation: 0 }); // Bottom
      break;

    case 'nine-rune-grid': // 3x3 grid
      const gridCols = 3;
      const gridRows = 3;
      const gridTotalWidth = gridCols * cardWidth + (gridCols - 1) * marginX;
      const gridTotalHeight = gridRows * cardHeight + (gridRows - 1) * marginY;
      let gridStartX = centerX - gridTotalWidth / 2;
      let gridStartY = centerY - gridTotalHeight / 2;
      for (let i = 0; i < cardCount; i++) {
        const col = i % gridCols;
        const row = Math.floor(i / gridCols);
        positions.push({
          x: gridStartX + col * (cardWidth + marginX) + cardWidth / 2,
          y: gridStartY + row * (cardHeight + marginY) + cardHeight / 2,
          rotation: 0,
        });
      }
      break;

    case 'sacred-geometry': // A triangular or aligned pattern
      positions.push({ x: centerX, y: centerY - cardHeight / 1.5, rotation: 0 }); // Top
      positions.push({ x: centerX - cardWidth, y: centerY + cardHeight / 2, rotation: 0 }); // Bottom Left
      positions.push({ x: centerX + cardWidth, y: centerY + cardHeight / 2, rotation: 0 }); // Bottom Right
      break;
    
    case 'full-cast': // This is a special case, handled as free-form in ReadingsPage.
                     // For animation, we can just do a general fan, or randomly distribute.
                     // Let's do a more structured fan for the animation phase.
      const fanRadius = Math.min(canvasWidth, canvasHeight) * 0.4;
      const angleStep = p.TWO_PI / cardCount;
      for (let i = 0; i < cardCount; i++) {
        const angle = i * angleStep - p.HALF_PI; // Start from top
        positions.push({
          x: centerX + fanRadius * p.cos(angle),
          y: centerY + fanRadius * p.sin(angle),
          rotation: angle + p.HALF_PI, // Rotate to follow the fan curve
        });
      }
      break;


    default: // Default to a simple horizontal fan for unknown or new spread types
      const defaultTotalWidth = cardCount * cardWidth + (cardCount - 1) * marginX;
      let defaultStartX = centerX - defaultTotalWidth / 2;
      for (let i = 0; i < cardCount; i++) {
        positions.push({
          x: defaultStartX + i * (cardWidth + marginX) + cardWidth / 2,
          y: centerY,
          rotation: 0,
        });
      }
      break;
  }
  return positions;
};


const CardAnimationCanvas: React.FC<CardAnimationCanvasProps> = ({
  drawnCards,
  spreadType,
  cardDimensions,
  onAnimationComplete,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let sketch: p5;
    let animatedCards: AnimatedCard[] = [];
    let animationStage: 'condensing' | 'fanning' | 'complete' = 'condensing';
    let startTime: number;
    const CONDENSING_DURATION = 800; // ms
    const FANNING_DURATION = 1200; // ms
    const EASING_POWER = 3; // For smoother animation: (t) => t^EASING_POWER

    const sketchFunction = (p: p5) => {
      let canvasWidth: number;
      let canvasHeight: number;
      let cardWidth = cardDimensions.width;
      let cardHeight = cardDimensions.height;
      let targetPositions: { x: number; y: number; rotation: number }[] = [];

      p.setup = () => {
        if (canvasRef.current) {
          canvasWidth = canvasRef.current.offsetWidth;
          canvasHeight = canvasRef.current.offsetHeight;
          p.createCanvas(canvasWidth, canvasHeight).parent(canvasRef.current);
          p.rectMode(p.CENTER);
          p.angleMode(p.DEGREES);

          targetPositions = calculateSpreadPositions(
            p,
            spreadType,
            drawnCards.length,
            canvasWidth,
            canvasHeight,
            cardWidth,
            cardHeight,
          );

          // Initialize cards for condensing animation
          const initialCenterX = canvasWidth / 2;
          const initialCenterY = canvasHeight / 2;
          animatedCards = drawnCards.map((_, i) => ({
            targetX: initialCenterX,
            targetY: initialCenterY,
            targetRotation: 0,
            currentX: initialCenterX + p.random(-50, 50), // Start scattered around center
            currentY: initialCenterY + p.random(-50, 50),
            currentRotation: p.random(-15, 15),
            color: p.color(p.random(30, 60), p.random(30, 60), p.random(60, 100)), // Subtle blue/purple tones for card backs
            index: i,
          }));

          startTime = p.millis();
        }
      };

      p.draw = () => {
        if (!canvasRef.current) return;
        // FIX: Explicitly create a p5.Color object for background to avoid potential string literal interpretation issues.
        // The previous `p.background(p.color(11, 12, 16))` was causing an error "Expected 1 arguments, but got 0".
        // Using `p.background(R,G,B)` directly resolves this by passing RGB values as separate arguments.
        p.background(11, 12, 16); 
        // Removed `p.clear()` as `p.background()` already clears the canvas for each frame.
        // `p.clear()` might also be problematic in some p5.js render contexts.

        const currentTime = p.millis();
        let progress = 0;

        if (animationStage === 'condensing') {
          const elapsed = currentTime - startTime;
          progress = p.min(1, elapsed / CONDENSING_DURATION);
          const easedProgress = p.pow(progress, EASING_POWER);

          for (let i = 0; i < animatedCards.length; i++) {
            const card = animatedCards[i];
            card.currentX = p.lerp(card.currentX, canvasWidth / 2, easedProgress);
            card.currentY = p.lerp(card.currentY, canvasHeight / 2, easedProgress);
            card.currentRotation = p.lerp(card.currentRotation, 0, easedProgress);
          }

          if (progress >= 1) {
            animationStage = 'fanning';
            startTime = currentTime; // Reset start time for next stage
          }
        } else if (animationStage === 'fanning') {
          const elapsed = currentTime - startTime;
          progress = p.min(1, elapsed / FANNING_DURATION);
          const easedProgress = p.pow(progress, EASING_POWER);

          // Before fanning, ensure current positions are correctly set to center for a smooth start
          if (progress === 0) {
            for (let i = 0; i < animatedCards.length; i++) {
                animatedCards[i].currentX = canvasWidth / 2;
                animatedCards[i].currentY = canvasHeight / 2;
                animatedCards[i].currentRotation = 0;
            }
          }

          for (let i = 0; i < animatedCards.length; i++) {
            const card = animatedCards[i];
            const target = targetPositions[i];
            card.currentX = p.lerp(card.currentX, target.x, easedProgress);
            card.currentY = p.lerp(card.currentY, target.y, easedProgress);
            card.currentRotation = p.lerp(card.currentRotation, target.rotation, easedProgress);
            card.targetX = target.x; // Update target for smooth lerp if canvas resizes
            card.targetY = target.y;
            card.targetRotation = target.rotation;
          }

          if (progress >= 1) {
            animationStage = 'complete';
            onAnimationComplete();
            p.noLoop(); // Stop drawing once complete
          }
        }

        // Draw cards
        for (const card of animatedCards) {
          p.push();
          p.translate(card.currentX, card.currentY);
          p.rotate(card.currentRotation);
          p.fill(card.color);
          p.noStroke();
          p.rect(0, 0, cardWidth, cardHeight, 8); // Rounded corners
          p.pop();
        }
      };

      p.windowResized = () => {
        if (canvasRef.current) {
          canvasWidth = canvasRef.current.offsetWidth;
          canvasHeight = canvasRef.current.offsetHeight;
          p.resizeCanvas(canvasWidth, canvasHeight);

          // Recalculate target positions on resize
          targetPositions = calculateSpreadPositions(
            p,
            spreadType,
            drawnCards.length,
            canvasWidth,
            canvasHeight,
            cardWidth,
            cardHeight,
          );

          // Instantly update current positions to new targets if animation is complete or fanning
          if (animationStage === 'fanning' || animationStage === 'complete') {
            for (let i = 0; i < animatedCards.length; i++) {
                const card = animatedCards[i];
                const target = targetPositions[i];
                card.currentX = target.x;
                card.currentY = target.y;
                card.currentRotation = target.rotation;
            }
          }
        }
      };
    };

    sketch = new p5(sketchFunction);

    return () => {
      sketch.remove();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawnCards, spreadType, cardDimensions, onAnimationComplete]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full flex items-center justify-center bg-[#0B0C10]" // Fill parent, match app background
      aria-hidden="true" // Hide from screen readers as it's purely decorative
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted text-lg font-semibold animate-pulse">
        Setting up the spread...
      </div>
    </div>
  );
};

export default CardAnimationCanvas;