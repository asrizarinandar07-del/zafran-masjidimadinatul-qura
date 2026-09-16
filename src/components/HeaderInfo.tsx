import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles, Compass } from 'lucide-react';
import { MazeVariantInfo } from '../types';

interface HeaderInfoProps {
  currentVariant: MazeVariantInfo;
  score: number;
  steps: number;
  timeSeconds: number;
  collectedCount: number;
  totalCollectibles: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onAskCatHint: () => void;
  hintActive: boolean;
  onPlayIntroVoice: () => void;
  voiceSubtitle: string | null;
}

export const HeaderInfo: React.FC<HeaderInfoProps> = ({
  currentVariant,
  score,
  steps,
  timeSeconds,
  collectedCount,
  totalCollectibles,
  isMuted,
  onToggleMute,
  onReset,
  onAskCatHint,
  hintActive,
  onPlayIntroVoice,
  voiceSubtitle
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-3 px-3">
      {/* Playful Top Cloud/Banner Header matching labirin.jpg */}
      <div className="relative w-full bg-white/95 backdrop-blur-sm border-4 border-sky-400 rounded-3xl shadow-lg px-4 py-3 sm:py-4">
        {/* Decorative Top Star */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-white rounded-full p-1.5 shadow-md border-2 border-amber-500">
          <Sparkles className="w-5 h-5 text-amber-100 fill-amber-300" />
        </div>

        {/* Title matching "Let's Go to the Mosque!" in Indonesian */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 tracking-wide font-['Fredoka'] mt-1">
          Ayo ke Masjid Madinatul Qura!
        </h1>

        {/* Subtitle Pill with Voice Play Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <div className="inline-flex items-center gap-1.5 bg-sky-100 border border-sky-300 text-sky-900 text-xs sm:text-sm font-semibold px-4 py-1 rounded-full shadow-xs">
            <span>🐾</span>
            <span>Bantu Zafran & Si Kucing menemukan jalan ke masjid!</span>
          </div>

          <button
            onClick={onPlayIntroVoice}
            className="inline-flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs px-3 py-1 rounded-full shadow-xs border border-amber-500 transition-all active:scale-95"
            title="Dengarkan Suara: Ayo ke Masjid Madinatul Qura bersama Zafran"
          >
            <span>🔊</span>
            <span>Suara Pembuka</span>
          </button>
        </div>

        {/* Active Speech Subtitle Banner */}
        {voiceSubtitle && (
          <div className="mt-2.5 mx-auto max-w-md bg-amber-50 border-2 border-amber-400 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-2xl shadow-sm animate-bounce flex items-center justify-center gap-2">
            <span>🗣️</span>
            <span>"{voiceSubtitle}"</span>
          </div>
        )}

        {/* Current Maze Badge & Shifting Notice */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-xs">
            {currentVariant.name}
          </span>
          <span className="bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {currentVariant.badge}
          </span>
          {currentVariant.hasShiftingWalls && (
            <span className="bg-rose-100 border border-rose-300 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
              ⚠️ Dinding Pintu Berpindah!
            </span>
          )}
        </div>
      </div>

      {/* Status Indicators Bar */}
      <div className="w-full bg-white/90 backdrop-blur-xs border-2 border-sky-300 rounded-2xl shadow-sm px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-700">
        {/* Score & Collectibles */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1 text-amber-600" title="Skor Petualangan">
            <span className="text-base">⭐</span>
            <span>{score}</span>
          </div>

          <div className="flex items-center gap-1 text-emerald-600" title="Koleksi Barang & Makanan Kucing">
            <span className="text-base">🎒</span>
            <span>
              {collectedCount}/{totalCollectibles}
            </span>
          </div>

          <div className="flex items-center gap-1 text-blue-600" title="Waktu">
            <span className="text-base">⏱️</span>
            <span>{formatTime(timeSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-500" title="Jumlah Langkah">
            <span>👣</span>
            <span>{steps}</span>
          </div>
        </div>

        {/* Quick Actions (Hint, Sound, Restart) */}
        <div className="flex items-center gap-2">
          {/* Ask Cat Hint */}
          <button
            onClick={onAskCatHint}
            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl font-bold transition-all shadow-xs active:scale-95 ${
              hintActive
                ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
            }`}
            title="Minta Bantuan Kucing (Tunjukkan Jejak Kaki)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Jejak</span> Kucing
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Restart Level */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Mulai Ulang Labirin Ini"
            aria-label="Reset Maze"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
