import React from 'react';
import { Flame, Zap, Award, Sparkles, TrendingUp } from 'lucide-react';
import { LevelInfo } from '../hooks/useGamification';

interface GamificationBarProps {
  xp: number;
  streak: number;
  currentLevelInfo: LevelInfo;
  nextLevel?: LevelInfo;
  levelProgress: number;
  recentGain: { amount: number; reason: string; id: number } | null;
}

export const GamificationBar: React.FC<GamificationBarProps> = ({
  xp,
  streak,
  currentLevelInfo,
  nextLevel,
  levelProgress,
  recentGain,
}) => {
  return (
    <div className="relative flex items-center gap-3 sm:gap-4">
      {/* Floating XP Gain Popup Notification */}
      {recentGain && (
        <div className="absolute -top-10 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{recentGain.amount} XP</span>
            <span className="text-[10px] opacity-90 font-medium hidden sm:inline">({recentGain.reason})</span>
          </div>
        </div>
      )}

      {/* Streak Badge */}
      <div 
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/15 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-red-950/50 border border-amber-300/60 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 font-bold text-xs shadow-sm hover:scale-105 transition-transform cursor-pointer"
        title={`You have a ${streak}-day active study streak! Keep practicing to protect your streak.`}
      >
        <span className="relative flex items-center justify-center">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
        </span>
        <span className="tabular-nums font-black text-sm">{streak}</span>
        <span className="hidden sm:inline text-[11px] font-semibold text-orange-600 dark:text-orange-400">Day Streak</span>
      </div>

      {/* XP & Level Widget */}
      <div 
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-pink-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm"
        title={`Current XP: ${xp}. Reach ${nextLevel ? nextLevel.minXP : 'max'} XP for Level ${currentLevelInfo.level + 1}`}
      >
        {/* Level Avatar Badge */}
        <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${currentLevelInfo.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
          <span>{currentLevelInfo.icon}</span>
        </div>

        {/* Level & Progress Bar */}
        <div className="flex flex-col min-w-[100px] sm:min-w-[130px]">
          <div className="flex items-center justify-between text-[11px] leading-tight mb-1">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span>Lv.{currentLevelInfo.level}</span>
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-normal">
                {currentLevelInfo.title}
              </span>
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px] tabular-nums">
              {xp} XP
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
