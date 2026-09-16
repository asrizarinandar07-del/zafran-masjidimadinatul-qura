import React from 'react';
import { Direction } from '../types';

interface ZafranAvatarProps {
  direction?: Direction;
  isMoving?: boolean;
  size?: number;
  isWaving?: boolean;
}

export const ZafranAvatar: React.FC<ZafranAvatarProps> = ({
  direction = 'DOWN',
  isMoving = false,
  size = 40,
  isWaving = false
}) => {
  const isLeft = direction === 'LEFT';
  const isUp = direction === 'UP';

  return (
    <div 
      className={`relative inline-flex items-center justify-center transition-transform duration-200 ${
        isMoving ? 'animate-bounce' : ''
      }`}
      style={{
        width: size,
        height: size,
        transform: isLeft ? 'scaleX(-1)' : 'scaleX(1)'
      }}
      title="Zafran"
    >
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="50" cy="115" rx="30" ry="5" fill="#00000022" />

        {/* Feet / Sandals */}
        <g className={isMoving ? 'animate-pulse' : ''}>
          {/* Left Foot */}
          <ellipse cx="40" cy="110" rx="9" ry="5" fill="#8D5B4C" />
          <path d="M33 109 C36 106, 44 106, 47 109" stroke="#5D3A1A" strokeWidth="2.5" />
          
          {/* Right Foot */}
          <ellipse cx="60" cy="110" rx="9" ry="5" fill="#8D5B4C" />
          <path d="M53 109 C56 106, 64 106, 67 109" stroke="#5D3A1A" strokeWidth="2.5" />
        </g>

        {/* White Pants */}
        <path d="M35 88 L35 107 L45 107 L47 95 L53 95 L55 107 L65 107 L65 88 Z" fill="#F4F4F6" />
        <line x1="50" y1="95" x2="50" y2="105" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* White Koko Shirt (Baju Muslim) */}
        <path
          d="M26 48 C28 44, 38 42, 50 42 C62 42, 72 44, 74 48 L76 90 C76 93, 72 95, 68 95 L32 95 C28 95, 24 93, 24 90 Z"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Koko Collar & Buttons */}
        <path d="M43 43 C46 47, 54 47, 57 43" stroke="#0D9488" strokeWidth="2.5" fill="none" />
        <line x1="50" y1="47" x2="50" y2="78" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="1 4" />
        <circle cx="50" cy="52" r="1.5" fill="#0D9488" />
        <circle cx="50" cy="60" r="1.5" fill="#0D9488" />
        <circle cx="50" cy="68" r="1.5" fill="#0D9488" />

        {/* Pocket */}
        <rect x="32" y="62" width="9" height="10" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />

        {/* Left Arm & Hand */}
        {isWaving ? (
          <g className="animate-spin origin-[28px_50px]" style={{ animationDuration: '1.2s' }}>
            {/* Waving Arm */}
            <path d="M26 48 C20 40, 16 32, 14 24" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <circle cx="14" cy="22" r="5" fill="#FBCFE8" stroke="#F472B6" strokeWidth="0.5" />
          </g>
        ) : (
          <g>
            <path d="M26 48 L18 68" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
            <circle cx="17" cy="71" r="4.5" fill="#FDE047" opacity="0.9" />
          </g>
        )}

        {/* Right Arm & Hand */}
        <g>
          <path d="M74 48 L82 68" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          <circle cx="83" cy="71" r="4.5" fill="#FDE047" opacity="0.9" />
        </g>

        {/* Head & Neck */}
        <rect x="44" y="38" width="12" height="8" rx="2" fill="#FDDFB7" />

        {/* Ears */}
        <circle cx="28" cy="30" r="5" fill="#FDDFB7" />
        <circle cx="72" cy="30" r="5" fill="#FDDFB7" />

        {/* Face */}
        <ellipse cx="50" cy="32" rx="22" ry="20" fill="#FDDFB7" />

        {/* Hair side tufts */}
        <path d="M28 26 C28 20, 32 18, 38 18" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 26 C72 20, 68 18, 62 18" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

        {!isUp ? (
          <>
            {/* Joyful Eyes */}
            <ellipse cx="42" cy="31" rx="3" ry="4" fill="#1E293B" />
            <ellipse cx="58" cy="31" rx="3" ry="4" fill="#1E293B" />
            <circle cx="43.5" cy="29.5" r="1.2" fill="#FFFFFF" />
            <circle cx="59.5" cy="29.5" r="1.2" fill="#FFFFFF" />

            {/* Cute Eyebrows */}
            <path d="M38 24 C41 22, 45 23, 46 24" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M54 24 C55 23, 59 22, 62 24" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="36" cy="36" r="3.5" fill="#FDA4AF" opacity="0.6" />
            <circle cx="64" cy="36" r="3.5" fill="#FDA4AF" opacity="0.6" />

            {/* Happy Smile */}
            <path d="M45 37 C47 41, 53 41, 55 37" stroke="#BE123C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          /* Back of head */
          <path d="M30 24 C30 38, 70 38, 70 24 Z" fill="#1E293B" />
        )}

        {/* White Songkok / Peci with Islamic Embroidery (as seen in labirin.jpg) */}
        <g>
          {/* Main Peci Dome/Cap */}
          <path
            d="M30 18 C30 7, 50 4, 70 18 L70 22 C60 25, 40 25, 30 22 Z"
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="1.2"
          />
          {/* Decorative Pattern on Rim */}
          <path
            d="M32 19 L35 16 L38 19 L41 16 L44 19 L47 16 L50 19 L53 16 L56 19 L59 16 L62 19 L65 16 L68 19"
            stroke="#10B981"
            strokeWidth="1.2"
            fill="none"
          />
          <line x1="30" y1="21" x2="70" y2="21" stroke="#059669" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
};
