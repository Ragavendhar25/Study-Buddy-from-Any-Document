import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Check, 
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Zap,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface QuizTabProps {
  questions: QuizQuestion[];
  onEarnXP?: (amount: number, reason: string) => void;
  onExtendStreak?: () => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ questions, onEarnXP, onExtendStreak }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [viewAllMode, setViewAllMode] = useState(false);

  // Reset when questions change
  useEffect(() => {
    setSelectedAnswers({});
    setCurrentStep(0);
  }, [questions]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (selectedAnswers[questionId] !== undefined) return;

    const updated = { ...selectedAnswers, [questionId]: optionIdx };
    setSelectedAnswers(updated);

    const q = questions.find(item => item.id === questionId);
    const isCorrect = q && q.correctAnswer === optionIdx;

    if (onEarnXP) {
      if (isCorrect) {
        onEarnXP(25, 'Correct Answer (+25 XP)');
      } else {
        onEarnXP(10, 'Quiz Attempt (+10 XP)');
      }
    }

    // If all questions are answered, check if we should trigger confetti and streak
    if (Object.keys(updated).length === questions.length) {
      calculateAndTriggerConfetti(updated);
    }
  };

  const calculateAndTriggerConfetti = (answers: Record<number, number>) => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percent = (correctCount / questions.length) * 100;
    if (percent >= 60) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
        });
      } catch {}

      if (onEarnXP) {
        onEarnXP(50, 'Quiz Completed (+50 XP Bonus!)');
      }
      if (onExtendStreak) {
        onExtendStreak();
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  let totalScore = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      totalScore++;
    }
  });
  const scorePercent = questions.length > 0 ? Math.round((totalScore / questions.length) * 100) : 0;

  const currentQ = questions[currentStep] || questions[0];
  const optionLabels = ['A', 'B', 'C', 'D'];

  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center text-slate-500">No quiz questions available.</div>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Score Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/90 dark:bg-[#140f31]/90 border-2 border-indigo-200/80 dark:border-indigo-800/60 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Comprehension Check
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50">
                +25 XP / Correct
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              5 multiple-choice questions with instant rationale & scoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1d1646] text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-indigo-900">
            <span>Answered: {answeredCount} / {questions.length}</span>
          </div>

          {answeredCount > 0 && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold border border-indigo-300 dark:border-indigo-700">
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Score: {totalScore} / {questions.length} ({scorePercent}%)</span>
            </div>
          )}

          <button
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f184e] transition-colors"
            title="Reset Quiz"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Completion Trophy Card with Streak Bonus */}
      {isAllAnswered && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-indigo-600/15 via-purple-600/15 to-emerald-600/15 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-emerald-950/60 border-2 border-indigo-300 dark:border-indigo-700 shadow-xl animate-fadeIn backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30 flex-shrink-0">
                {scorePercent}%
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                  <span>
                    {scorePercent >= 80 ? 'Mastery Achieved! 🎉' : scorePercent >= 60 ? 'Great Progress! 👍' : 'Good Effort! Keep Reviewing 📚'}
                  </span>
                  {scorePercent >= 60 && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black">
                      +50 XP
                    </span>
                  )}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  You answered {totalScore} out of {questions.length} questions correctly. Your study streak has been credited!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewAllMode(!viewAllMode)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-[#1a1440] border-2 border-indigo-200 dark:border-indigo-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#221b54] shadow-sm transition-all"
              >
                {viewAllMode ? 'Step View' : 'Review All 5'}
              </button>

              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION VIEW: Either Step-by-Step OR All-In-One */}
      {!viewAllMode ? (
        /* Single Question Step-by-Step Card */
        <div className="space-y-4">
          {/* Question Stepper Tabs */}
          <div className="flex items-center justify-center gap-2 py-2">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctAnswer;
              const isCurrent = idx === currentStep;

              return (
                <button
                  key={q.id || idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'ring-3 ring-indigo-500 ring-offset-2 dark:ring-offset-[#0b0819] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : isAnswered
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border border-emerald-400'
                        : 'bg-rose-500 text-white border border-rose-400'
                      : 'bg-white dark:bg-[#18123c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-indigo-900/80 hover:border-indigo-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#150f33] border-2 border-indigo-200/80 dark:border-indigo-800/70 shadow-xl space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Question {currentStep + 1} of {questions.length}
              </span>
              {selectedAnswers[currentQ.id] !== undefined && (
                <span className={`flex items-center gap-1 font-bold ${
                  selectedAnswers[currentQ.id] === currentQ.correctAnswer
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Correct (+25 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Incorrect (+10 XP)</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid gap-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isAnswered = selectedAnswers[currentQ.id] !== undefined;
                const isCorrect = optIdx === currentQ.correctAnswer;

                let buttonStyle = 'border-slate-200 dark:border-indigo-900/60 bg-slate-50/60 dark:bg-[#1b1442]/60 hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-[#201850] text-slate-900 dark:text-slate-100';

                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 font-bold ring-2 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500';
                  } else {
                    buttonStyle = 'border-slate-200/50 dark:border-indigo-900/30 opacity-50 text-slate-500 dark:text-slate-400';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 group ${buttonStyle} ${
                      !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 transition-colors ${
                      isAnswered && isCorrect
                        ? 'bg-emerald-500 text-white'
                        : isAnswered && isSelected && !isCorrect
                        ? 'bg-rose-500 text-white'
                        : 'bg-white dark:bg-[#231b56] border border-slate-200 dark:border-indigo-700 text-slate-700 dark:text-slate-200 group-hover:border-indigo-400 group-hover:text-indigo-600'
                    }`}>
                      {isAnswered && isCorrect ? (
                        <Check className="w-5 h-5" />
                      ) : isAnswered && isSelected && !isCorrect ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        optionLabels[optIdx]
                      )}
                    </div>
                    <span className="pt-0.5 text-sm sm:text-base leading-relaxed font-semibold">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedAnswers[currentQ.id] !== undefined && (
              <div className="p-5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/50 border-2 border-indigo-200 dark:border-indigo-800/80 animate-fadeIn space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Info className="w-4 h-4 text-indigo-500" />
                  <span>One-Line Explanation</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-indigo-900/50">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f184e] disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentStep((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentStep === questions.length - 1}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f184e] disabled:opacity-40 flex items-center gap-1.5 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* All-in-one Review Mode */
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#150f33] border-2 border-indigo-200/80 dark:border-indigo-800/70 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full border border-indigo-200">
                    Question {idx + 1}
                  </span>
                  {isAnswered && (
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isCorrect ? 'Correct (+25 XP)' : 'Incorrect (+10 XP)'}
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {q.question}
                </h4>

                <div className="grid gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isRight = optIdx === q.correctAnswer;

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-xl text-sm border-2 flex items-center gap-3 ${
                          isRight
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                            : isSelected
                            ? 'bg-rose-500/15 border-rose-500 text-rose-900 dark:text-rose-100 font-bold'
                            : 'bg-slate-50 dark:bg-[#1c1544] border-slate-200 dark:border-indigo-900/50 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="font-bold text-xs w-6 h-6 rounded-lg flex items-center justify-center bg-white dark:bg-[#251c5b] shadow-xs">
                          {optionLabels[optIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/40 text-xs text-slate-700 dark:text-slate-200 border border-indigo-200 dark:border-indigo-800 font-medium">
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 mr-1.5">Explanation:</span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
