import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Shuffle, 
  CheckCircle2, 
  Circle, 
  Layers, 
  Grid3X3, 
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsTabProps {
  cards: Flashcard[];
  onEarnXP?: (amount: number, reason: string) => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({ cards: initialCards, onEarnXP }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // Sync if initialCards change
  useEffect(() => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
  }, [initialCards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (next && onEarnXP) {
        onEarnXP(10, 'Flipped Flashcard');
      }
      return next;
    });
  }, [onEarnXP]);

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (id: number) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (onEarnXP) {
          onEarnXP(20, 'Mastered Flashcard!');
        }
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'single') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleFlip, handleNext, handlePrev]);

  if (!cards || cards.length === 0) {
    return <div className="p-8 text-center text-slate-500">No flashcards available.</div>;
  }

  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);
  const masteredCount = masteredIds.size;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/90 dark:bg-[#140f31]/90 border-2 border-indigo-200/80 dark:border-indigo-800/60 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Card {currentIndex + 1} of {cards.length}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{masteredCount} of {cards.length} Mastered</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-300/40 dark:border-amber-700/40">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            +10 XP / Flip
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
            title="Shuffle flashcards"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />

          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
            title={viewMode === 'single' ? 'Switch to Grid View' : 'Switch to Single Card View'}
          >
            {viewMode === 'single' ? (
              <>
                <Grid3X3 className="w-3.5 h-3.5 text-purple-500" />
                <span>Grid View</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Study Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-2xl h-[360px] sm:h-[390px] cursor-pointer select-none group [perspective:1000px]"
              onClick={handleFlip}
            >
              <div
                className={`relative w-full h-full duration-500 transition-transform [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* FRONT SIDE (QUESTION) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl p-7 sm:p-9 bg-white dark:bg-[#161036] border-2 border-indigo-200 dark:border-indigo-800/80 shadow-xl flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase bg-gradient-to-r from-indigo-500/15 to-purple-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {currentCard?.category || 'Question'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      <span>Click to flip</span>
                      <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="my-auto py-4 text-center">
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                      {currentCard?.question}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-indigo-900/50">
                    <span className="flex items-center gap-1.5 font-bold text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active Recall (+10 XP)
                    </span>
                    <span className="hidden sm:inline font-medium">Space to Flip &bull; &larr; &rarr; to Navigate</span>
                  </div>
                </div>

                {/* BACK SIDE (ANSWER) */}
                <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white shadow-2xl flex flex-col justify-between border-2 border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-white/20 text-white backdrop-blur-md">
                      Answer & Explanation
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-100 font-medium">
                      <span>Click to flip back</span>
                      <RotateCw className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="my-auto py-4">
                    <p className="text-base sm:text-lg text-white font-semibold leading-relaxed">
                      {currentCard?.answer}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-indigo-100 pt-3 border-t border-white/15">
                    <span className="font-bold">Card #{currentCard?.id}</span>
                    <span>Click card to see question</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            <button
              onClick={handlePrev}
              className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-white dark:bg-[#18123c] border-2 border-indigo-200/80 dark:border-indigo-800/80 hover:bg-slate-50 dark:hover:bg-[#1f184e] text-slate-800 dark:text-slate-200 shadow-md flex items-center gap-2 font-bold text-sm transition-all"
              title="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              onClick={() => currentCard && toggleMastered(currentCard.id)}
              className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm flex items-center gap-2 shadow-md transition-all ${
                isCurrentMastered
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/25 ring-2 ring-emerald-400'
                  : 'bg-white dark:bg-[#18123c] border-indigo-200/80 dark:border-indigo-800/80 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
              }`}
            >
              {isCurrentMastered ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Mastered (+20 XP)</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span>Mark Mastered</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
              title="Next card"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Grid Overview Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const isMastered = masteredIds.has(card.id);
            return (
              <div
                key={card.id || i}
                onClick={() => {
                  setCurrentIndex(i);
                  setViewMode('single');
                }}
                className="group p-5 rounded-2xl bg-white dark:bg-[#161036] border-2 border-indigo-100 dark:border-indigo-900/60 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
                      #{i + 1} {card.category}
                    </span>
                    {isMastered && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-3 mb-2">
                    {card.question}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                    {card.answer}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-indigo-900/50 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Open in Study Mode &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
