import React from 'react';

interface MosqueGoalProps {
  size?: number;
  className?: string;
}

export const MosqueGoal: React.FC<MosqueGoalProps> = ({
  size = 80,
  className = ''
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title="Masjid Madinatul Qura"
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Golden Ground Base */}
        <ellipse cx="80" cy="148" rx="65" ry="10" fill="#FEF08A" opacity="0.4" />

        {/* Path leading to door */}
        <path d="M68 155 L74 135 L86 135 L92 155 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />

        {/* Outer Flower Bushes */}
        <g>
          {/* Left bush */}
          <circle cx="28" cy="142" r="14" fill="#22C55E" />
          <circle cx="40" cy="145" r="12" fill="#16A34A" />
          <circle cx="25" cy="138" r="3" fill="#F43F5E" />
          <circle cx="34" cy="142" r="3" fill="#FB7185" />

          {/* Right bush */}
          <circle cx="132" cy="142" r="14" fill="#22C55E" />
          <circle cx="120" cy="145" r="12" fill="#16A34A" />
          <circle cx="135" cy="138" r="3" fill="#F43F5E" />
          <circle cx="126" cy="142" r="3" fill="#FB7185" />
        </g>

        {/* Mosque Main Body (Sandstone/Warm Cream) */}
        <rect x="52" y="90" width="56" height="50" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
        
        {/* Decorative cornice bands */}
        <rect x="50" y="88" width="60" height="5" rx="1.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
        <rect x="54" y="102" width="52" height="3" fill="#FDE68A" />

        {/* Main Arched Wooden Door */}
        <path
          d="M70 140 L70 118 C70 110, 90 110, 90 118 L90 140 Z"
          fill="#78350F"
          stroke="#451A03"
          strokeWidth="1.5"
        />
        {/* Door frame decorative arch */}
        <path
          d="M66 140 L66 116 C66 104, 94 104, 94 116 L94 140"
          fill="none"
          stroke="#0D9488"
          strokeWidth="2"
        />
        {/* Door split & handle */}
        <line x1="80" y1="114" x2="80" y2="140" stroke="#451A03" strokeWidth="1" />
        <circle cx="77" cy="127" r="1.5" fill="#FBBF24" />
        <circle cx="83" cy="127" r="1.5" fill="#FBBF24" />

        {/* Small Arched Windows */}
        {/* Left window */}
        <path d="M57 118 C57 112, 63 112, 63 118 L63 128 L57 128 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
        <line x1="60" y1="113" x2="60" y2="128" stroke="#E0F2FE" strokeWidth="0.8" />

        {/* Right window */}
        <path d="M97 118 C97 112, 103 112, 103 118 L103 128 L97 128 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
        <line x1="100" y1="113" x2="100" y2="128" stroke="#E0F2FE" strokeWidth="0.8" />

        {/* Central Emerald Green Dome */}
        <path
          d="M52 88 C52 52, 108 52, 108 88 Z"
          fill="#10B981"
          stroke="#047857"
          strokeWidth="2"
        />
        {/* Dome shading & decorative stripes */}
        <path d="M66 88 C66 60, 94 60, 94 88" fill="#059669" stroke="#047857" strokeWidth="1" opacity="0.6" />
        <path d="M74 88 C74 65, 86 65, 86 88" fill="#34D399" opacity="0.4" />

        {/* Golden Finial & Crescent on Central Dome */}
        <line x1="80" y1="52" x2="80" y2="40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="80" cy="40" r="3" fill="#FBBF24" />
        {/* Crescent Moon */}
        <path
          d="M80 37 C77 37, 75 34, 75 31 C75 27, 78 25, 82 25 C80 27, 80 30, 82 32 C84 34, 86 34, 86 32 C85 36, 83 37, 80 37 Z"
          fill="#F59E0B"
        />

        {/* Left Minaret */}
        <g>
          {/* Shaft */}
          <rect x="36" y="60" width="12" height="80" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          {/* Balcony 1 */}
          <rect x="34" y="80" width="16" height="5" rx="1" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          {/* Balcony 2 */}
          <rect x="34" y="58" width="16" height="5" rx="1" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          {/* Minaret Dome */}
          <path d="M36 58 C36 44, 48 44, 48 58 Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
          {/* Minaret Spire & Crescent */}
          <line x1="42" y1="44" x2="42" y2="34" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="42" cy="33" r="2" fill="#FBBF24" />
          {/* Small slit windows */}
          <rect x="40" y="92" width="4" height="7" rx="2" fill="#0284C7" />
          <rect x="40" y="112" width="4" height="7" rx="2" fill="#0284C7" />
        </g>

        {/* Right Minaret */}
        <g>
          {/* Shaft */}
          <rect x="112" y="60" width="12" height="80" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          {/* Balcony 1 */}
          <rect x="110" y="80" width="16" height="5" rx="1" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          {/* Balcony 2 */}
          <rect x="110" y="58" width="16" height="5" rx="1" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          {/* Minaret Dome */}
          <path d="M112 58 C112 44, 124 44, 124 58 Z" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
          {/* Minaret Spire & Crescent */}
          <line x1="118" y1="44" x2="118" y2="34" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="118" cy="33" r="2" fill="#FBBF24" />
          {/* Small slit windows */}
          <rect x="116" y="92" width="4" height="7" rx="2" fill="#0284C7" />
          <rect x="116" y="112" width="4" height="7" rx="2" fill="#0284C7" />
        </g>

        {/* Mosque Name Inscription Badge */}
        <rect x="62" y="94" width="36" height="7" rx="3.5" fill="#065F46" />
        <text
          x="80"
          y="99.5"
          textAnchor="middle"
          fill="#FDE68A"
          fontSize="4.2"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          MADINATUL QURA
        </text>
      </svg>
    </div>
  );
};
