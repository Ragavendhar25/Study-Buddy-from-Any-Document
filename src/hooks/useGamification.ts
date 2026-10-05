import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: string;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Novice Scholar', minXP: 0, maxXP: 100, icon: '🌱', color: 'from-emerald-500 to-teal-600' },
  { level: 2, title: 'Curious Explorer', minXP: 100, maxXP: 250, icon: '⚡', color: 'from-blue-500 to-indigo-600' },
  { level: 3, title: 'Active Learner', minXP: 250, maxXP: 500, icon: '🔥', color: 'from-purple-500 to-pink-600' },
  { level: 4, title: 'Master Scholar', minXP: 500, maxXP: 900, icon: '⭐', color: 'from-amber-500 to-orange-600' },
  { level: 5, title: 'Academic Grandmaster', minXP: 900, maxXP: 1500, icon: '👑', color: 'from-rose-500 to-red-600' },
];

export function useGamification() {
  const [xp, setXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_buddy_xp');
      return saved ? parseInt(saved, 10) : 40; // start with 40 starter XP
    }
    return 40;
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_buddy_streak');
      return saved ? parseInt(saved, 10) : 3; // starter 3-day streak
    }
    return 3;
  });

  const [recentGain, setRecentGain] = useState<{ amount: number; reason: string; id: number } | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('study_buddy_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('study_buddy_streak', streak.toString());
  }, [streak]);

  // Determine level
  const currentLevelInfo = LEVELS.slice().reverse().find(l => xp >= l.minXP) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevelInfo.level + 1);

  const xpInLevel = xp - currentLevelInfo.minXP;
  const levelSpan = nextLevel ? nextLevel.minXP - currentLevelInfo.minXP : 500;
  const levelProgress = Math.min(100, Math.max(0, Math.round((xpInLevel / levelSpan) * 100)));

  const addXP = useCallback((amount: number, reason: string) => {
    setXp((prev) => {
      const newXp = prev + amount;
      // Check if leveled up
      const oldLevel = LEVELS.slice().reverse().find(l => prev >= l.minXP)?.level || 1;
      const newLevel = LEVELS.slice().reverse().find(l => newXp >= l.minXP)?.level || 1;
      
      if (newLevel > oldLevel) {
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.3 },
            colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'],
          });
        } catch {}
      }
      return newXp;
    });

    const gainId = Date.now();
    setRecentGain({ amount, reason, id: gainId });
    setTimeout(() => {
      setRecentGain((current) => (current?.id === gainId ? null : current));
    }, 2400);
  }, []);

  const incrementStreak = useCallback(() => {
    setStreak((prev) => prev + 1);
    addXP(30, 'Streak Extended');
  }, [addXP]);

  return {
    xp,
    streak,
    currentLevelInfo,
    nextLevel,
    levelProgress,
    recentGain,
    addXP,
    incrementStreak,
  };
}
