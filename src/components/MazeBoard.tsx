import React, { useRef, useEffect } from 'react';
import { LevelConfig, Position, Direction, ShiftingGate } from '../types';
import { ZafranAvatar } from './ZafranAvatar';
import { CatCompanion } from './CatCompanion';
import { MosqueGoal } from './MosqueGoal';
import { MazeDecorationItem, MazeCollectibleItem } from './MazeDecorations';

interface MazeBoardProps {
  level: LevelConfig;
  playerPos: Position;
  catPos: Position;
  playerDir: Direction;
  catDir: Direction;
  isMoving: boolean;
  hintPath: Position[];
  onCellClick?: (pos: Position) => void;
  onSwipe?: (dir: Direction) => void;
  catMood: 'normal' | 'happy' | 'meow' | 'purr';
  onPetCat: () => void;
}

export const MazeBoard: React.FC<MazeBoardProps> = ({
  level,
  playerPos,
  catPos,
  playerDir,
  catDir,
  isMoving,
  hintPath,
  onCellClick,
  onSwipe,
  catMood,
  onPetCat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const { width, height, walls, start, goal, decorations, collectibles, shiftingGates } = level;

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !onSwipe) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        onSwipe(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        onSwipe(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  };

  // Helper to test if a tile is a closed shifting gate
  const isClosedGate = (x: number, y: number): ShiftingGate | undefined => {
    if (!shiftingGates) return undefined;
    return shiftingGates.find(g => g.x === x && g.y === y && !g.isOpen);
  };

  const isOpenGate = (x: number, y: number): ShiftingGate | undefined => {
    if (!shiftingGates) return undefined;
    return shiftingGates.find(g => g.x === x && g.y === y && g.isOpen);
  };

  // Helper to test if a tile has a pawprint hint
  const isHintTile = (x: number, y: number) => {
    return hintPath.some(p => p.x === x && p.y === y);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative select-none touch-none w-full max-w-[620px] mx-auto p-3 sm:p-4 bg-white rounded-3xl border-4 border-blue-600 shadow-xl overflow-hidden"
    >
      {/* Maze Outer Decorative Stitched Line (matching labirin.jpg) */}
      <div className="absolute inset-1.5 border-2 border-dashed border-blue-300 rounded-[22px] pointer-events-none z-10" />

      {/* Grid Container */}
      <div
        className="relative grid gap-0 w-full aspect-square mx-auto bg-slate-50 rounded-2xl overflow-hidden border-2 border-blue-200"
        style={{
          gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`
        }}
      >
        {/* Render Grid Cells */}
        {Array.from({ length: height }).map((_, y) =>
          Array.from({ length: width }).map((_, x) => {
            const isWall = walls[y]?.[x] ?? true;
            const closedGate = isClosedGate(x, y);
            const openGate = isOpenGate(x, y);
            const isStart = x === start.x && y === start.y;
            const isGoal = x === goal.x && y === goal.y;
            const isHint = isHintTile(x, y);
            const dec = decorations.find(d => d.x === x && d.y === y);
            const col = collectibles.find(c => c.x === x && c.y === y && !c.collected);

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => onCellClick && onCellClick({ x, y })}
                className={`relative flex items-center justify-center transition-colors duration-150 ${
                  isWall
                    ? 'bg-blue-600 border-[0.5px] border-blue-700'
                    : closedGate
                    ? 'bg-amber-700 border-2 border-amber-900'
                    : openGate
                    ? 'bg-emerald-100 border border-emerald-300'
                    : isStart
                    ? 'bg-blue-50'
                    : isGoal
                    ? 'bg-emerald-50'
                    : 'bg-white hover:bg-sky-50'
                }`}
              >
                {/* Entrance Indicator Arrow */}
                {isStart && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none animate-pulse">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 fill-current">
                      <path d="M4 10h10v-4l6 6-6 6v-4h-10z" />
                    </svg>
                  </div>
                )}

                {/* Exit Indicator Arrow */}
                {isGoal && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 flex items-center pointer-events-none animate-bounce">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 fill-current">
                      <path d="M4 10h10v-4l6 6-6 6v-4h-10z" />
                    </svg>
                  </div>
                )}

                {/* Shifting Gate Graphic */}
                {closedGate && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-amber-200 font-bold">
                    <span>🚪🔒</span>
                  </div>
                )}
                {openGate && (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] text-emerald-600 font-bold opacity-75">
                    <span>✨🚪</span>
                  </div>
                )}

                {/* Cat Pawprint Hint Clue */}
                {isHint && !isWall && !closedGate && (
                  <div className="absolute flex items-center justify-center text-amber-500 animate-pulse text-xs pointer-events-none z-10">
                    🐾
                  </div>
                )}

                {/* In-maze Decoration */}
                {dec && !isWall && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <MazeDecorationItem item={dec} cellSize={40} />
                  </div>
                )}

                {/* Collectible Item */}
                {col && !isWall && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <MazeCollectibleItem item={col} cellSize={38} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Dynamic Overlay: Cat Companion */}
        <div
          className="absolute z-20 transition-all duration-200 pointer-events-auto flex items-center justify-center"
          style={{
            width: `${100 / width}%`,
            height: `${100 / height}%`,
            left: `${(catPos.x / width) * 100}%`,
            top: `${(catPos.y / height) * 100}%`,
            transform: 'scale(0.92)'
          }}
        >
          <CatCompanion
            direction={catDir}
            isMoving={isMoving}
            mood={catMood}
            onPetCat={onPetCat}
          />
        </div>

        {/* Dynamic Overlay: Zafran Character */}
        <div
          className="absolute z-30 transition-all duration-150 pointer-events-none flex items-center justify-center"
          style={{
            width: `${100 / width}%`,
            height: `${100 / height}%`,
            left: `${(playerPos.x / width) * 100}%`,
            top: `${(playerPos.y / height) * 100}%`,
            transform: 'scale(1.05)'
          }}
        >
          <ZafranAvatar
            direction={playerDir}
            isMoving={isMoving}
          />
        </div>
      </div>
    </div>
  );
};
