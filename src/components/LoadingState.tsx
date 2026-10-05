import React, { useState, useEffect } from 'react';
import { Sparkles, FileText, Brain, HelpCircle, Bot } from 'lucide-react';

interface LoadingStateProps {
  fileName?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ fileName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { text: 'Scanning document and parsing key topics...', icon: FileText },
    { text: 'Synthesizing 5 core bullet point takeaways...', icon: Sparkles },
    { text: 'Generating 8 active-recall 3D flashcards...', icon: Brain },
    { text: 'Formulating 5 comprehension quiz questions...', icon: HelpCircle },
    { text: 'Preparing your personalized Study Buddy chat assistant...', icon: Bot },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [steps.length]);

  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="max-w-xl mx-auto py-12 px-6 text-center animate-fadeIn">
      <div className="relative inline-flex items-center justify-center mb-8">
        {/* Glowing backdrop rings */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse" />
        
        {/* Animated Gradient Spinner */}
        <div className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-950 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <CurrentIcon className="w-7 h-7 transition-all duration-300" />
          </div>
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
        Building Your Study Pack
      </h3>

      {fileName && (
        <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-950/60 inline-block px-3 py-1 rounded-full">
          {fileName}
        </p>
      )}

      <div className="h-10 flex items-center justify-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium transition-all duration-300">
          {steps[currentStepIndex].text}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentStepIndex
                ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                : 'w-2 bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
