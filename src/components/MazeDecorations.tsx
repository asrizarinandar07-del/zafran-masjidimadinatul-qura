import React from 'react';
import { Decoration, Collectible } from '../types';

export const MazeDecorationItem: React.FC<{ item: Decoration; cellSize: number }> = ({ item, cellSize }) => {
  const size = cellSize * 0.82;

  switch (item.type) {
    case 'tree':
      return (
        <svg viewBox="0 0 60 60" style={{ width: size, height: size }} className="drop-shadow-sm pointer-events-none">
          {/* Shadow */}
          <ellipse cx="30" cy="54" rx="16" ry="4" fill="#00000020" />
          {/* Trunk */}
          <rect x="26" y="36" width="8" height="17" rx="2" fill="#78350F" />
          {/* Roots */}
          <path d="M26 53 L22 55 M34 53 L38 55" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
          {/* Green Foliage */}
          <circle cx="30" cy="24" r="17" fill="#16A34A" />
          <circle cx="20" cy="27" r="12" fill="#22C55E" />
          <circle cx="40" cy="27" r="12" fill="#15803D" />
          <circle cx="30" cy="15" r="11" fill="#4ADE80" opacity="0.6" />
        </svg>
      );

    case 'palm':
      return (
        <svg viewBox="0 0 60 60" style={{ width: size, height: size }} className="drop-shadow-sm pointer-events-none">
          <ellipse cx="30" cy="54" rx="15" ry="3.5" fill="#00000020" />
          {/* Curved Trunk */}
          <path d="M30 52 C30 40, 26 30, 29 20" stroke="#854D0E" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Palm Fronds */}
          <path d="M29 20 C22 14, 12 18, 8 26" stroke="#15803D" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M29 20 C36 14, 46 18, 52 26" stroke="#15803D" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M29 20 C25 8, 33 4, 30 2" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M29 20 C18 10, 22 4, 20 2" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M29 20 C40 10, 38 4, 40 2" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Coconuts / Dates */}
          <circle cx="27" cy="22" r="2.5" fill="#713F12" />
          <circle cx="31" cy="23" r="2.5" fill="#713F12" />
        </svg>
      );

    case 'bush_flower':
      return (
        <svg viewBox="0 0 60 50" style={{ width: size, height: size * 0.85 }} className="drop-shadow-sm pointer-events-none">
          <ellipse cx="30" cy="42" rx="20" ry="5" fill="#00000020" />
          <circle cx="20" cy="32" r="14" fill="#22C55E" />
          <circle cx="40" cy="32" r="14" fill="#16A34A" />
          <circle cx="30" cy="25" r="15" fill="#4ADE80" />
          {/* Pink and yellow flower petals */}
          <circle cx="25" cy="24" r="4.5" fill="#FB7185" />
          <circle cx="25" cy="24" r="1.8" fill="#FEF08A" />
          <circle cx="36" cy="28" r="4" fill="#F43F5E" />
          <circle cx="36" cy="28" r="1.5" fill="#FEF08A" />
        </svg>
      );

    case 'small_flower':
      return (
        <svg viewBox="0 0 40 40" style={{ width: size * 0.75, height: size * 0.75 }} className="pointer-events-none">
          <circle cx="20" cy="20" r="6" fill="#F43F5E" />
          <circle cx="14" cy="17" r="4" fill="#FDA4AF" />
          <circle cx="26" cy="17" r="4" fill="#FDA4AF" />
          <circle cx="16" cy="25" r="4" fill="#FDA4AF" />
          <circle cx="24" cy="25" r="4" fill="#FDA4AF" />
          <circle cx="20" cy="20" r="3.2" fill="#FEF08A" />
        </svg>
      );

    case 'stone':
      return (
        <svg viewBox="0 0 40 30" style={{ width: size * 0.7, height: size * 0.55 }} className="pointer-events-none">
          <ellipse cx="20" cy="24" rx="14" ry="4" fill="#00000020" />
          <ellipse cx="18" cy="18" rx="12" ry="8" fill="#94A3B8" />
          <ellipse cx="25" cy="20" rx="8" ry="6" fill="#CBD5E1" />
          <circle cx="15" cy="15" r="2.5" fill="#F1F5F9" opacity="0.6" />
        </svg>
      );

    default:
      return null;
  }
};

export const MazeCollectibleItem: React.FC<{ item: Collectible; cellSize: number }> = ({ item, cellSize }) => {
  if (item.collected) return null;
  const size = cellSize * 0.72;

  switch (item.type) {
    case 'date':
      return (
        <div
          className="relative inline-flex items-center justify-center animate-pulse"
          style={{ width: size, height: size }}
          title={`${item.label} (+${item.points})`}
        >
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <ellipse cx="20" cy="34" rx="10" ry="3" fill="#00000025" />
            {/* Rich brown dates */}
            <ellipse cx="18" cy="20" rx="8" ry="12" fill="#78350F" transform="rotate(-15 18 20)" />
            <ellipse cx="24" cy="21" rx="7" ry="11" fill="#92400E" transform="rotate(15 24 21)" />
            <path d="M16 12 C18 10, 22 10, 24 12" stroke="#451A03" strokeWidth="1.5" fill="none" />
            <ellipse cx="16" cy="16" rx="2" ry="4" fill="#FEF3C7" opacity="0.4" transform="rotate(-15 16 16)" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        </div>
      );

    case 'cat_fish':
      return (
        <div
          className="relative inline-flex items-center justify-center animate-bounce"
          style={{ width: size, height: size, animationDuration: '1.4s' }}
          title={`${item.label} (+${item.points}) - Buat si Meong!`}
        >
          <svg viewBox="0 0 50 40" className="w-full h-full drop-shadow-md">
            {/* Fish for Cat */}
            <path d="M12 20 C18 10, 34 10, 42 20 C34 30, 18 30, 12 20 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            {/* Tail fin */}
            <polygon points="12,20 2,12 5,20 2,28" fill="#0284C7" />
            {/* Eye */}
            <circle cx="36" cy="18" r="2.2" fill="#0F172A" />
            <circle cx="36.8" cy="17.2" r="0.8" fill="#FFFFFF" />
            {/* Gills & Scales */}
            <path d="M30 15 C28 20, 28 22, 30 25" stroke="#0284C7" strokeWidth="1.2" fill="none" />
            {/* Little heart */}
            <text x="20" y="8" fontSize="11" fill="#F43F5E">❤️</text>
          </svg>
        </div>
      );

    case 'tasbih':
      return (
        <div
          className="relative inline-flex items-center justify-center animate-spin"
          style={{ width: size, height: size, animationDuration: '12s' }}
          title={`${item.label} (+${item.points})`}
        >
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            {/* Circular Prayer Beads */}
            <circle cx="20" cy="20" r="12" stroke="#D97706" strokeWidth="3.5" strokeDasharray="3.2 2" fill="none" />
            {/* Tassel */}
            <line x1="20" y1="32" x2="20" y2="38" stroke="#15803D" strokeWidth="2.5" />
            <circle cx="20" cy="32" r="2.5" fill="#15803D" />
            <circle cx="20" cy="20" r="3" fill="#FDE68A" />
          </svg>
        </div>
      );

    case 'lantern':
      return (
        <div
          className="relative inline-flex items-center justify-center animate-pulse"
          style={{ width: size, height: size }}
          title={`${item.label} (+${item.points})`}
        >
          <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-md">
            <ellipse cx="20" cy="46" rx="8" ry="3" fill="#00000020" />
            {/* Top Ring */}
            <circle cx="20" cy="7" r="4" stroke="#D97706" strokeWidth="1.5" fill="none" />
            {/* Cap */}
            <polygon points="12,14 28,14 20,8" fill="#B45309" />
            {/* Glass body glowing */}
            <polygon points="14,14 26,14 28,32 12,32" fill="#FEF08A" stroke="#B45309" strokeWidth="1.5" />
            {/* Light glow core */}
            <ellipse cx="20" cy="23" rx="4" ry="6" fill="#F59E0B" opacity="0.75" />
            {/* Base */}
            <rect x="13" y="32" width="14" height="4" rx="1.5" fill="#B45309" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
