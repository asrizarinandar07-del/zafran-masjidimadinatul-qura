import React, { useState, useEffect } from 'react';
import { Direction } from '../types';
import { sound } from '../utils/audio';

interface CatCompanionProps {
  direction?: Direction;
  isMoving?: boolean;
  size?: number;
  mood?: 'normal' | 'happy' | 'meow' | 'purr';
  onPetCat?: () => void;
}

export const CatCompanion: React.FC<CatCompanionProps> = ({
  direction = 'RIGHT',
  isMoving = false,
  size = 36,
  mood = 'normal',
  onPetCat
}) => {
  const [showHearts, setShowHearts] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const isLeft = direction === 'LEFT';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCatMeow(1.15);
    sound.playCatPurr();
    setShowHearts(true);
    const phrases = ['Meow! 🐾', 'Purrr~ ❤️', 'Ayo Zafran!', 'Masjid dekat! ✨'];
    setBubbleText(phrases[Math.floor(Math.random() * phrases.length)]);
    if (onPetCat) onPetCat();

    setTimeout(() => {
      setShowHearts(false);
      setBubbleText(null);
    }, 1800);
  };

  useEffect(() => {
    if (mood === 'meow') {
      setBubbleText('Meow! 🐾');
      const timer = setTimeout(() => setBubbleText(null), 1500);
      return () => clearTimeout(timer);
    }
    if (mood === 'purr') {
      setShowHearts(true);
      const timer = setTimeout(() => setShowHearts(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  return (
    <div
      onClick={handleClick}
      className="relative inline-flex items-center justify-center cursor-pointer select-none group"
      style={{
        width: size,
        height: size,
        transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)'
      }}
      title="Klik untuk mengelus Kucing Zafran!"
    >
      {/* Speech Bubble / Meow */}
      {bubbleText && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap z-30 animate-bounce pointer-events-none"
          style={{ transform: isLeft ? 'translateX(-50%) scaleX(-1)' : 'translateX(-50%)' }}
        >
          {bubbleText}
        </div>
      )}

      {/* Floating Hearts Animation */}
      {showHearts && (
        <div
          className="absolute -top-6 -right-2 text-rose-500 text-sm font-bold animate-ping pointer-events-none z-30"
          style={{ transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          ❤️
        </div>
      )}

      <svg
        viewBox="0 0 100 90"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cat Shadow */}
        <ellipse cx="50" cy="84" rx="28" ry="5" fill="#00000020" />

        {/* Animated Tail */}
        <path
          d="M20 55 C12 45, 5 35, 12 25 C16 20, 20 25, 18 32 C16 38, 22 45, 26 52"
          stroke="#EA580C"
          strokeWidth="6.5"
          strokeLinecap="round"
          className="origin-[26px_52px] animate-pulse"
        />
        {/* Tail White Tip */}
        <circle cx="12" cy="24" r="3.5" fill="#FFF7ED" />

        {/* Back Leg Left */}
        <ellipse
          cx="28"
          cy="75"
          rx="7"
          ry="10"
          fill="#EA580C"
          className={isMoving ? 'animate-bounce' : ''}
          style={{ animationDuration: '0.25s' }}
        />
        <ellipse cx="27" cy="83" rx="6" ry="3.5" fill="#FFF7ED" />

        {/* Front Leg Left */}
        <ellipse
          cx="62"
          cy="76"
          rx="6"
          ry="9"
          fill="#EA580C"
          className={isMoving ? 'animate-bounce' : ''}
          style={{ animationDuration: '0.25s', animationDelay: '0.12s' }}
        />
        <ellipse cx="63" cy="83" rx="5.5" ry="3.5" fill="#FFF7ED" />

        {/* Main Body (Ginger/Orange) */}
        <ellipse cx="45" cy="58" rx="26" ry="18" fill="#F97316" />
        
        {/* Tabby Stripes on Back */}
        <path d="M38 43 C38 48, 42 50, 44 48" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M46 43 C46 49, 50 51, 52 49" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M30 46 C30 50, 33 52, 35 50" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* White Belly Patch */}
        <ellipse cx="48" cy="64" rx="14" ry="10" fill="#FFF7ED" opacity="0.85" />

        {/* Front Leg Right */}
        <ellipse
          cx="72"
          cy="76"
          rx="6"
          ry="9"
          fill="#EA580C"
          className={isMoving ? 'animate-bounce' : ''}
          style={{ animationDuration: '0.25s' }}
        />
        <ellipse cx="73" cy="83" rx="5.5" ry="3.5" fill="#FFF7ED" />

        {/* Cat Head */}
        <circle cx="70" cy="42" r="18" fill="#F97316" />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M60 30 L55 12 L70 24 Z" fill="#EA580C" />
        <path d="M59 27 L56 16 L67 24 Z" fill="#FBCFE8" />

        {/* Right Ear */}
        <path d="M74 24 L85 14 L83 30 Z" fill="#EA580C" />
        <path d="M76 25 L83 17 L81 29 Z" fill="#FBCFE8" />

        {/* White Muzzle */}
        <ellipse cx="74" cy="47" rx="9" ry="7" fill="#FFF7ED" />

        {/* Pink Nose */}
        <polygon points="73,44 76,44 74.5,47" fill="#F43F5E" />

        {/* Cute Eyes */}
        <ellipse cx="67" cy="38" rx="2.8" ry="3.5" fill="#1E293B" />
        <ellipse cx="78" cy="38" rx="2.8" ry="3.5" fill="#1E293B" />
        {/* Eye sparkles */}
        <circle cx="68" cy="37" r="1" fill="#FFFFFF" />
        <circle cx="79" cy="37" r="1" fill="#FFFFFF" />

        {/* Mouth */}
        <path d="M72 48 C73 50, 74.5 50, 74.5 48 C74.5 50, 76 50, 77 48" stroke="#BE123C" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="62" y1="46" x2="52" y2="44" stroke="#475569" strokeWidth="1" />
        <line x1="62" y1="48" x2="51" y2="49" stroke="#475569" strokeWidth="1" />
        <line x1="82" y1="46" x2="92" y2="44" stroke="#475569" strokeWidth="1" />
        <line x1="82" y1="48" x2="93" y2="49" stroke="#475569" strokeWidth="1" />

        {/* Collar with Little Golden Bell */}
        <path d="M60 55 C66 61, 78 61, 82 55" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="71" cy="59" r="3.2" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
        <circle cx="71" cy="60" r="0.8" fill="#78350F" />
      </svg>
    </div>
  );
};
