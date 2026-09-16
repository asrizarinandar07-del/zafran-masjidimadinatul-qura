import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Clock, Footprints, Sparkles, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import { GameStats } from '../types';
import { sound } from '../utils/audio';
import { ZafranAvatar } from './ZafranAvatar';
import { CatCompanion } from './CatCompanion';
import { MosqueGoal } from './MosqueGoal';

interface VictoryModalProps {
  stats: GameStats;
  currentLevelTitle: string;
  onNextLevel: () => void;
  onReplay: () => void;
  onNewRandom: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  currentLevelTitle,
  onNextLevel,
  onReplay,
  onNewRandom
}) => {
  const [isCatSpeaking, setIsCatSpeaking] = useState(false);
  const [subtitle, setSubtitle] = useState<string | null>("Zafran Attaqi Subrata Anak Soleh");

  const playVictoryVoice = () => {
    setSubtitle("Zafran Attaqi Subrata Anak Soleh");
    sound.playVictoryVoice(
      (idx) => {
        setIsCatSpeaking(true);
        setTimeout(() => setIsCatSpeaking(false), 400);
      },
      () => {
        setSubtitle(null);
      }
    );
  };

  useEffect(() => {
    // Launch celebratory confetti burst!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch {
      // Confetti fallback
    }

    // Automatically trigger the victory voice after slight fanfare delay
    const timer = setTimeout(() => {
      playVictoryVoice();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white border-4 border-emerald-500 rounded-3xl shadow-2xl p-5 sm:p-6 text-center flex flex-col items-center overflow-hidden">
        {/* Festive Top Banner */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-emerald-500 to-sky-400" />

        {/* Golden Mosque Illustration */}
        <div className="mt-2 mb-1">
          <MosqueGoal size={100} />
        </div>

        {/* Alhamdulillah Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-emerald-800 font-['Fredoka'] mt-1">
          Alhamdulillah!
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
          Zafran & Si Kucing berhasil sampai di <span className="text-emerald-700 font-bold">Masjid Madinatul Qura</span>!
        </p>

        {/* Dedicated "Zafran Attaqi Subrata Anak Soleh" Golden Badge with voice button */}
        <div className="my-2.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 p-2.5 rounded-2xl shadow-md border-2 border-amber-300 flex flex-col items-center animate-pulse">
          <div className="flex items-center gap-1.5 font-black text-sm sm:text-base font-['Fredoka']">
            <span>✨</span>
            <span>Zafran Attaqi Subrata Anak Soleh</span>
            <span>✨</span>
          </div>
          <button
            onClick={playVictoryVoice}
            className="mt-1.5 flex items-center gap-1.5 bg-white/90 hover:bg-white text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs active:scale-95 transition-all"
            title="Dengarkan Suara Kemenangan"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Putar Suara & Meong Kucing</span>
          </button>
        </div>

        {/* Characters Celebration Duo */}
        <div className="flex items-center justify-center gap-6 my-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-2 w-full">
          <div className="flex flex-col items-center">
            <ZafranAvatar isWaving={true} size={48} />
            <span className="text-[11px] font-bold text-slate-700 mt-1">Zafran</span>
          </div>

          <div className="text-2xl animate-bounce">🎉</div>

          <div className="flex flex-col items-center">
            <CatCompanion mood={isCatSpeaking ? 'meow' : 'happy'} size={44} />
            <span className="text-[11px] font-bold text-amber-800 mt-1">Si Meong</span>
          </div>
        </div>

        {/* Star Rating Display */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {[1, 2, 3].map(starNum => {
            const isEarned = starNum <= stats.stars;
            return (
              <div
                key={starNum}
                className={`transform transition-all duration-300 ${
                  isEarned ? 'scale-110 text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-300'
                }`}
              >
                <Star className="w-8 h-8 fill-current stroke-amber-500 stroke-1" />
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4 text-xs font-bold">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 flex flex-col items-center">
            <div className="text-amber-700 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Skor</span>
            </div>
            <span className="text-base text-amber-900 font-black mt-0.5">{stats.score}</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-xl p-2 flex flex-col items-center">
            <div className="text-sky-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Waktu</span>
            </div>
            <span className="text-base text-sky-900 font-black mt-0.5">{formatTime(stats.timeSeconds)}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex flex-col items-center">
            <div className="text-emerald-700 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5" />
              <span>Langkah</span>
            </div>
            <span className="text-base text-emerald-900 font-black mt-0.5">{stats.steps}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <button
            onClick={onNextLevel}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md transition-all active:scale-95"
          >
            <span>Varian Berikutnya</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReplay}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-2xl transition-all"
            title="Main Ulang Level Ini"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

