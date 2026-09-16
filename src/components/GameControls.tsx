import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Heart, Sparkles, Shuffle } from 'lucide-react';
import { Direction, MazeVariantType, MazeVariantInfo } from '../types';
import { MAZE_VARIANTS } from '../utils/mazeGenerator';

interface GameControlsProps {
  onMove: (dir: Direction) => void;
  currentVariantId: MazeVariantType;
  onSelectVariant: (variantId: MazeVariantType) => void;
  onGenerateNewRandom: () => void;
  onPetCat: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onMove,
  currentVariantId,
  onSelectVariant,
  onGenerateNewRandom,
  onPetCat
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-4 px-3">
      {/* Mobile & Touch D-Pad */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs text-slate-500 font-medium mb-1">
          Gunakan Tombol Arah atau Geser (Swipe) di Layar
        </div>

        {/* D-Pad Buttons */}
        <div className="grid grid-cols-3 gap-2 w-48 sm:w-56 select-none touch-manipulation">
          <div />
          <button
            onClick={() => onMove('UP')}
            className="flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl shadow-md border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            aria-label="Atas"
          >
            <ArrowUp className="w-6 h-6 stroke-[3]" />
          </button>
          <div />

          <button
            onClick={() => onMove('LEFT')}
            className="flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl shadow-md border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            aria-label="Kiri"
          >
            <ArrowLeft className="w-6 h-6 stroke-[3]" />
          </button>
          
          {/* Middle Pet Cat Quick Button */}
          <button
            onClick={onPetCat}
            className="flex flex-col items-center justify-center h-12 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-amber-950 rounded-2xl shadow-md border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all"
            title="Elus Kucing!"
            aria-label="Elus Kucing"
          >
            <span className="text-base">🐱</span>
            <span className="text-[10px] font-black -mt-1">ELUS</span>
          </button>

          <button
            onClick={() => onMove('RIGHT')}
            className="flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl shadow-md border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            aria-label="Kanan"
          >
            <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>

          <div />
          <button
            onClick={() => onMove('DOWN')}
            className="flex items-center justify-center h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl shadow-md border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
            aria-label="Bawah"
          >
            <ArrowDown className="w-6 h-6 stroke-[3]" />
          </button>
          <div />
        </div>
      </div>

      {/* Maze Variants Selector (Varian Labirin yang Berubah) */}
      <div className="w-full bg-white/95 backdrop-blur-sm border-2 border-sky-300 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pilih Varian Labirin:</span>
          </div>

          <button
            onClick={onGenerateNewRandom}
            className="flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 px-2.5 py-1 rounded-xl transition-colors border border-sky-300"
            title="Buat Labirin Acak Baru"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Rute Baru</span>
          </button>
        </div>

        {/* Variant Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MAZE_VARIANTS.map(variant => {
            const isSelected = currentVariantId === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => onSelectVariant(variant.id)}
                className={`flex flex-col text-left p-2 rounded-xl transition-all border text-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-sky-50'
                }`}
              >
                <span className="font-bold truncate">{variant.name}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {variant.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
