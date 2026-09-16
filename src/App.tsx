/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Direction,
  Position,
  MazeVariantType,
  LevelConfig,
  GameStats,
  Collectible
} from './types';
import {
  MAZE_VARIANTS,
  loadLevelConfig,
  findShortestPath,
  createProceduralLevel
} from './utils/mazeGenerator';
import { sound } from './utils/audio';
import { HeaderInfo } from './components/HeaderInfo';
import { MazeBoard } from './components/MazeBoard';
import { GameControls } from './components/GameControls';
import { VictoryModal } from './components/VictoryModal';
import { ZafranAvatar } from './components/ZafranAvatar';
import { MosqueGoal } from './components/MosqueGoal';
import { CatCompanion } from './components/CatCompanion';

export default function App() {
  const [currentVariantId, setCurrentVariantId] = useState<MazeVariantType>('classic_madinatul');
  const [level, setLevel] = useState<LevelConfig>(() => loadLevelConfig('classic_madinatul'));

  // Player and Cat positions
  const [playerPos, setPlayerPos] = useState<Position>(() => ({ ...level.start }));
  const [catPos, setCatPos] = useState<Position>(() => ({ ...level.start }));
  const [playerDir, setPlayerDir] = useState<Direction>('RIGHT');
  const [catDir, setCatDir] = useState<Direction>('RIGHT');
  const [isMoving, setIsMoving] = useState(false);
  const [catMood, setCatMood] = useState<'normal' | 'happy' | 'meow' | 'purr'>('normal');

  // Footsteps trail for cat to follow
  const trailHistoryRef = useRef<Position[]>([{ ...level.start }]);

  // Game Stats
  const [score, setScore] = useState(0);
  const [steps, setSteps] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getIsMuted());

  // Cat Hint pawprints path
  const [hintPath, setHintPath] = useState<Position[]>([]);
  const [hintActive, setHintActive] = useState(false);

  // Shifting walls countdown timer for 'shifting_magic'
  const [gateCountdown, setGateCountdown] = useState<number>(6);

  // Voice Subtitle and Welcome State
  const [hasStarted, setHasStarted] = useState(false);
  const [voiceSubtitle, setVoiceSubtitle] = useState<string | null>(null);

  const currentVariantInfo = MAZE_VARIANTS.find(v => v.id === currentVariantId) || MAZE_VARIANTS[0];

  // Play Intro Voice: "Ayo ke Masjid Madinatul Qura bersama Zafran" + multiple meows
  const handlePlayIntroVoice = useCallback(() => {
    setVoiceSubtitle("Ayo ke Masjid Madinatul Qura bersama Zafran");
    sound.playIntroVoice(
      (idx) => {
        setCatMood('meow');
        setTimeout(() => setCatMood('normal'), 400);
      },
      () => {
        setVoiceSubtitle(null);
      }
    );
  }, []);

  const handleStartGame = () => {
    setHasStarted(true);
    handlePlayIntroVoice();
  };

  // Initialize or change level
  const initLevel = useCallback((variantId: MazeVariantType, customConfig?: LevelConfig) => {
    const newConfig = customConfig || loadLevelConfig(variantId);
    setLevel(newConfig);
    setCurrentVariantId(variantId);
    setPlayerPos({ ...newConfig.start });
    setCatPos({ ...newConfig.start });
    setPlayerDir('RIGHT');
    setCatDir('RIGHT');
    setIsMoving(false);
    trailHistoryRef.current = [{ ...newConfig.start }];
    setSteps(0);
    setTimeSeconds(0);
    setIsWon(false);
    setHintPath([]);
    setHintActive(false);
    setGateCountdown(6);
  }, []);

  // Timer loop
  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => {
      setTimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Shifting walls dynamic effect (Varian Labirin yang Berubah)
  useEffect(() => {
    if (isWon || !level.shiftingGates || level.shiftingGates.length === 0) return;

    const interval = setInterval(() => {
      setGateCountdown(prev => {
        if (prev <= 1) {
          // Toggle the shifting gates!
          setLevel(prevLevel => {
            if (!prevLevel.shiftingGates) return prevLevel;
            const updatedGates = prevLevel.shiftingGates.map(g => ({
              ...g,
              isOpen: !g.isOpen
            }));
            sound.playGateShift();
            return {
              ...prevLevel,
              shiftingGates: updatedGates
            };
          });
          return 6;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isWon, level.shiftingGates]);

  // Handle Movement Logic
  const handleMove = useCallback((dir: Direction) => {
    if (isWon) return;

    setPlayerPos(currentPos => {
      let dx = 0;
      let dy = 0;
      if (dir === 'UP') dy = -1;
      if (dir === 'DOWN') dy = 1;
      if (dir === 'LEFT') dx = -1;
      if (dir === 'RIGHT') dx = 1;

      const nextX = currentPos.x + dx;
      const nextY = currentPos.y + dy;

      // Boundary check
      if (nextX < 0 || nextX >= level.width || nextY < 0 || nextY >= level.height) {
        return currentPos;
      }

      // Wall collision check
      if (level.walls[nextY]?.[nextX]) {
        return currentPos; // Hit wall
      }

      // Shifting gate collision check
      if (level.shiftingGates) {
        const closedGate = level.shiftingGates.find(
          g => g.x === nextX && g.y === nextY && !g.isOpen
        );
        if (closedGate) {
          return currentPos; // Closed gate blocks path
        }
      }

      // Movement valid!
      sound.playFootstep();
      setPlayerDir(dir);
      setIsMoving(true);
      setTimeout(() => setIsMoving(false), 150);

      const nextPos = { x: nextX, y: nextY };

      // Update cat companion position (cat moves to Zafran's previous spot)
      setCatPos(() => {
        const prevTrail = trailHistoryRef.current;
        const lastPos = prevTrail.length > 0 ? prevTrail[prevTrail.length - 1] : currentPos;
        
        // Calculate cat direction
        if (lastPos.x > currentPos.x) setCatDir('RIGHT');
        else if (lastPos.x < currentPos.x) setCatDir('LEFT');
        else if (lastPos.y > currentPos.y) setCatDir('DOWN');
        else if (lastPos.y < currentPos.y) setCatDir('UP');

        return lastPos;
      });

      // Record trail
      trailHistoryRef.current.push({ ...currentPos });
      if (trailHistoryRef.current.length > 15) {
        trailHistoryRef.current.shift();
      }

      setSteps(s => s + 1);

      // Check Collectibles
      setLevel(prevLevel => {
        const updatedCollectibles = prevLevel.collectibles.map(col => {
          if (!col.collected && col.x === nextX && col.y === nextY) {
            sound.playCollect();
            setScore(sc => sc + col.points);

            if (col.type === 'cat_fish') {
              sound.playCatMeow(1.3);
              setCatMood('happy');
              setTimeout(() => setCatMood('normal'), 2000);
            }

            return { ...col, collected: true };
          }
          return col;
        });

        return {
          ...prevLevel,
          collectibles: updatedCollectibles
        };
      });

      // Check if reached the Goal: Masjid Madinatul Qura!
      if (nextX === level.goal.x && nextY === level.goal.y) {
        sound.playVictory();
        setIsWon(true);
        setScore(sc => sc + 500);
        setCatMood('happy');
      }

      // Clear hints as player walks
      setHintPath(prev => prev.filter(p => !(p.x === nextX && p.y === nextY)));

      return nextPos;
    });
  }, [isWon, level]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling on arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Click on cell handler (Auto-move if adjacent or pathfind)
  const handleCellClick = (target: Position) => {
    if (isWon) return;
    const dx = target.x - playerPos.x;
    const dy = target.y - playerPos.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      if (dx === 1) handleMove('RIGHT');
      else if (dx === -1) handleMove('LEFT');
      else if (dy === 1) handleMove('DOWN');
      else if (dy === -1) handleMove('UP');
    }
  };

  // Ask Cat for Hint (Cat sniffs path to mosque and leaves pawprints!)
  const handleAskCatHint = () => {
    sound.playCatMeow(1.2);
    setCatMood('meow');
    const path = findShortestPath(level.walls, playerPos, level.goal, level.shiftingGates);
    if (path.length > 0) {
      // Show next 6 steps
      const clueSteps = path.slice(0, 6);
      setHintPath(clueSteps);
      setHintActive(true);
      setTimeout(() => {
        setHintActive(false);
      }, 5000);
    }
  };

  // Pet the cat interaction
  const handlePetCat = () => {
    sound.playCatMeow();
    sound.playCatPurr();
    setCatMood('purr');
    setScore(s => s + 10);
    setTimeout(() => setCatMood('normal'), 1800);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Restart current level
  const handleReset = () => {
    initLevel(currentVariantId);
  };

  // Select a new maze variant
  const handleSelectVariant = (variantId: MazeVariantType) => {
    initLevel(variantId);
  };

  // Generate new random maze
  const handleGenerateNewRandom = () => {
    const randomTypes: MazeVariantType[] = ['random_easy', 'random_medium', 'random_hard'];
    const chosen = randomTypes[Math.floor(Math.random() * randomTypes.length)];
    const sizes = chosen === 'random_easy' ? 9 : chosen === 'random_medium' ? 13 : 17;
    const newConfig = createProceduralLevel(
      chosen,
      `Labirin Acak Baru (${sizes}x${sizes})`,
      sizes,
      sizes
    );
    initLevel(chosen, newConfig);
  };

  // Next level when winning
  const handleNextLevel = () => {
    const currentIndex = MAZE_VARIANTS.findIndex(v => v.id === currentVariantId);
    const nextIndex = (currentIndex + 1) % MAZE_VARIANTS.length;
    initLevel(MAZE_VARIANTS[nextIndex].id);
  };

  // Calculate Stars (1, 2, or 3 stars)
  const calculateStars = (): number => {
    const collected = level.collectibles.filter(c => c.collected).length;
    const total = level.collectibles.length;
    if (total === 0) return 3;
    if (collected === total && timeSeconds < 120) return 3;
    if (collected >= Math.ceil(total / 2)) return 2;
    return 1;
  };

  const collectedCount = level.collectibles.filter(c => c.collected).length;
  const totalCollectibles = level.collectibles.length;

  const gameStats: GameStats = {
    score,
    collectedCount,
    totalCollectibles,
    steps,
    timeSeconds,
    hintsUsed: hintActive ? 1 : 0,
    stars: calculateStars()
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200 text-slate-900 flex flex-col items-center justify-start py-4 px-2 sm:px-4 font-['Quicksand'] relative overflow-x-hidden">
      {/* Decorative Sky Clouds & Twinkling Stars (matching labirin.jpg) */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Soft Background Clouds */}
        <div className="absolute top-4 left-6 text-white/50 text-5xl">☁️</div>
        <div className="absolute top-16 right-10 text-white/40 text-6xl">☁️</div>
        <div className="absolute top-1/2 left-2 text-white/30 text-4xl">☁️</div>
        <div className="absolute bottom-10 right-4 text-white/40 text-5xl">☁️</div>

        {/* Scattered Cute Stars matching labirin.jpg */}
        <div className="absolute top-6 left-1/4 text-amber-300 text-xl animate-pulse">⭐</div>
        <div className="absolute top-12 right-1/4 text-amber-300 text-2xl animate-pulse delay-300">⭐</div>
        <div className="absolute top-24 left-10 text-amber-300 text-lg animate-pulse delay-700">⭐</div>
        <div className="absolute top-32 right-8 text-amber-300 text-xl animate-pulse delay-500">⭐</div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center space-y-4">
        {/* Header Information Banner */}
        <HeaderInfo
          currentVariant={currentVariantInfo}
          score={score}
          steps={steps}
          timeSeconds={timeSeconds}
          collectedCount={collectedCount}
          totalCollectibles={totalCollectibles}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onReset={handleReset}
          onAskCatHint={handleAskCatHint}
          hintActive={hintActive}
          onPlayIntroVoice={handlePlayIntroVoice}
          voiceSubtitle={voiceSubtitle}
        />

        {/* Shifting Gate Alert Toast for shifting_magic */}
        {currentVariantInfo.hasShiftingWalls && (
          <div className="flex items-center gap-2 bg-amber-400 text-amber-950 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm animate-pulse">
            <span>⏳ Pintu labirin bergeser dalam:</span>
            <span className="bg-amber-900 text-amber-100 px-2 py-0.5 rounded-full text-[11px] font-mono">
              {gateCountdown}s
            </span>
          </div>
        )}

        {/* Maze Presentation Layout with Zafran and Mosque Illustrations */}
        <div className="relative w-full flex flex-col items-center">
          {/* Top Left Zafran Illustration Card (Desktop / Tablet view matching labirin.jpg) */}
          <div className="hidden lg:flex flex-col items-center absolute -left-32 top-8 z-10 bg-white/90 p-3 rounded-2xl border-2 border-sky-400 shadow-md">
            <ZafranAvatar isWaving={true} size={70} />
            <span className="text-xs font-bold text-blue-900 mt-1">Zafran</span>
            <div className="mt-1">
              <CatCompanion mood={catMood} size={42} onPetCat={handlePetCat} />
            </div>
            <span className="text-[10px] text-amber-800 font-bold">Si Meong</span>
          </div>

          {/* Bottom Right Mosque Illustration Card (Desktop / Tablet view matching labirin.jpg) */}
          <div className="hidden lg:flex flex-col items-center absolute -right-36 bottom-6 z-10 bg-white/90 p-2 rounded-2xl border-2 border-emerald-400 shadow-md">
            <MosqueGoal size={110} />
            <span className="text-xs font-black text-emerald-900 -mt-1">Masjid Madinatul Qura</span>
          </div>

          {/* Interactive Maze Board */}
          <MazeBoard
            level={level}
            playerPos={playerPos}
            catPos={catPos}
            playerDir={playerDir}
            catDir={catDir}
            isMoving={isMoving}
            hintPath={hintPath}
            onCellClick={handleCellClick}
            onSwipe={handleMove}
            catMood={catMood}
            onPetCat={handlePetCat}
          />
        </div>

        {/* Quick Characters Bar for Mobile View */}
        <div className="flex lg:hidden items-center justify-between w-full max-w-[620px] px-3 py-1.5 bg-white/80 backdrop-blur-xs rounded-2xl border border-sky-300 text-xs font-bold">
          <div className="flex items-center gap-2">
            <ZafranAvatar size={34} />
            <span className="text-blue-900">Zafran & Meong</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800">
            <span>Tujuan:</span>
            <span className="text-emerald-700 underline font-black">Masjid Madinatul Qura 🕌</span>
          </div>
        </div>

        {/* Game Controls & D-Pad & Variant Switcher */}
        <GameControls
          onMove={handleMove}
          currentVariantId={currentVariantId}
          onSelectVariant={handleSelectVariant}
          onGenerateNewRandom={handleGenerateNewRandom}
          onPetCat={handlePetCat}
        />
      </div>

      {/* Welcome Start Modal */}
      {!hasStarted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white border-4 border-sky-400 rounded-3xl shadow-2xl p-6 text-center flex flex-col items-center overflow-hidden">
            {/* Top Color Accent */}
            <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" />

            {/* Mosque Art */}
            <div className="mt-2 mb-1">
              <MosqueGoal size={96} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-blue-900 font-['Fredoka'] mt-1">
              Petualangan Zafran
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              Menuju ke <span className="text-emerald-700 font-bold">Masjid Madinatul Qura</span>
            </p>

            {/* Zafran and Cat Banner */}
            <div className="flex items-center justify-center gap-6 my-4 bg-sky-50 border border-sky-200 rounded-2xl px-6 py-3 w-full">
              <div className="flex flex-col items-center">
                <ZafranAvatar isWaving={true} size={54} />
                <span className="text-xs font-bold text-blue-900 mt-1">Zafran</span>
              </div>

              <div className="text-xl text-sky-500 font-bold animate-pulse">❤️🐾</div>

              <div className="flex flex-col items-center">
                <CatCompanion mood="happy" size={50} />
                <span className="text-xs font-bold text-amber-800 mt-1">Si Meong</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-4 px-2">
              Klik tombol di bawah untuk memulai permainan dan mendengarkan suara pembuka bersama kucing kesayangan Zafran!
            </p>

            <button
              onClick={handleStartGame}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 active:scale-95 text-white font-extrabold text-base py-3 px-6 rounded-2xl shadow-lg transition-all"
            >
              <span>🔊</span>
              <span>Mulai Petualangan!</span>
            </button>
          </div>
        </div>
      )}

      {/* Victory Celebration Modal */}
      {isWon && (
        <VictoryModal
          stats={gameStats}
          currentLevelTitle={level.title}
          onNextLevel={handleNextLevel}
          onReplay={handleReset}
          onNewRandom={handleGenerateNewRandom}
        />
      )}
    </div>
  );
}
