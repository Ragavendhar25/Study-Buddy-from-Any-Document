import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Moon, 
  Sun, 
  FileText, 
  UploadCloud, 
  FileUp, 
  X, 
  Check, 
  Layers, 
  HelpCircle, 
  Bot, 
  ArrowRight, 
  RotateCcw,
  AlertCircle,
  Zap,
  Flame
} from 'lucide-react';
import { StudyPack, DocumentContext } from './types';
import { SummaryTab } from './components/SummaryTab';
import { FlashcardsTab } from './components/FlashcardsTab';
import { QuizTab } from './components/QuizTab';
import { ChatTab } from './components/ChatTab';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { GamificationBar } from './components/GamificationBar';
import { useGamification } from './hooks/useGamification';
import { SAMPLE_NOTES, SampleNote } from './data/sampleNotes';
import { SlingButton } from './components/react-bits/SlingButton';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_buddy_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('study_buddy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('study_buddy_theme', 'light');
    }
  }, [darkMode]);

  // Gamification hook
  const {
    xp,
    streak,
    currentLevelInfo,
    nextLevel,
    levelProgress,
    recentGain,
    addXP,
    incrementStreak,
  } = useGamification();

  // Input states
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [pastedText, setPastedText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // App processing states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studyPack, setStudyPack] = useState<StudyPack | null>(null);
  const [documentContext, setDocumentContext] = useState<DocumentContext | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz' | 'chat'>('summary');
  const [showInputPanel, setShowInputPanel] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  // Handle PDF file selection
  const handleFileChange = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB. Please upload a smaller PDF or paste its text.');
      return;
    }

    setError(null);
    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPdfBase64(base64);
    };
    reader.onerror = () => {
      setError('Failed to read the PDF file.');
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick sample picker
  const handleSelectSample = (sample: SampleNote) => {
    setInputMode('text');
    setPastedText(sample.content);
    setError(null);
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearInput = () => {
    setPdfFile(null);
    setPdfBase64(null);
    setPastedText('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger Study Pack Generation
  const handleGenerate = async () => {
    setError(null);

    let payload: { type: 'pdf' | 'text'; content: string; title?: string } | null = null;

    if (inputMode === 'pdf') {
      if (!pdfBase64 || !pdfFile) {
        setError('Please choose or drop a PDF file first.');
        return;
      }
      payload = {
        type: 'pdf',
        content: pdfBase64,
        title: pdfFile.name.replace(/\.pdf$/i, ''),
      };
    } else {
      const trimmed = pastedText.trim();
      if (!trimmed) {
        setError('Please paste or write your study notes first.');
        return;
      }
      if (trimmed.length < 50) {
        setError('Please provide at least a few sentences so Gemini can formulate meaningful summary, flashcards, and quiz.');
        return;
      }
      payload = {
        type: 'text',
        content: trimmed,
        title: trimmed.slice(0, 40) + '...',
      };
    }

    setLoading(true);

    try {
      const response = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to generate study pack.');
      }

      if (!resData.data) {
        throw new Error('No data received from study pack generator.');
      }

      setStudyPack(resData.data);
      setDocumentContext({
        type: payload.type,
        content: payload.content,
        fileName: inputMode === 'pdf' ? pdfFile?.name : 'Pasted Notes',
        title: resData.data.title || payload.title,
        summary: resData.data.summary,
      });

      // Award XP for creating a study pack!
      addXP(50, 'Study Pack Generated!');

      setActiveTab('summary');
      setShowInputPanel(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while communicating with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0a071b] text-slate-800 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar with Gamification Engine */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-[#0f0b24]/90 border-b-2 border-indigo-100/80 dark:border-indigo-900/60 shadow-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Study Buddy
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold hidden sm:block">
                Interactive Summaries &bull; 3D Flashcards &bull; Quizzes &bull; AI Tutor
              </p>
            </div>
          </div>

          {/* Gamification Bar (Streak & XP Level) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <GamificationBar
              xp={xp}
              streak={streak}
              currentLevelInfo={currentLevelInfo}
              nextLevel={nextLevel}
              levelProgress={levelProgress}
              recentGain={recentGain}
            />

            {studyPack && (
              <button
                onClick={() => setShowInputPanel(!showInputPanel)}
                className="text-xs font-black px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-[#1a143f] dark:hover:bg-[#251d59] text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">{showInputPanel ? 'Hide Input' : 'New Note'}</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-2xl border-2 border-slate-200/80 dark:border-indigo-900/70 text-slate-700 dark:text-slate-200 bg-white dark:bg-[#150f33] hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors shadow-sm"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* INPUT CARD (Collapsible when viewing results) */}
        {(showInputPanel || !studyPack) && (
          <div 
            ref={inputSectionRef}
            className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#120d2c]/95 border-2 border-indigo-200/80 dark:border-indigo-800/70 shadow-xl relative overflow-hidden transition-all duration-300 backdrop-blur-xl"
          >
            {/* Soft decorative background glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              {/* Header inside Input card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {studyPack ? 'Upload Another Study Document' : 'Feed Your Study Buddy'}
                    </h2>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                      +50 XP on Generate
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    Upload a lecture PDF or paste notes to generate interactive flashcards, quizzes & AI chat.
                  </p>
                </div>

                {/* Input Mode Switcher */}
                <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-[#1d1646] border-2 border-slate-200 dark:border-indigo-900 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setInputMode('pdf');
                      setError(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      inputMode === 'pdf'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setInputMode('text');
                      setError(null);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      inputMode === 'text'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paste Text</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-400 text-rose-900 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 font-semibold">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PDF UPLOAD MODE */}
              {inputMode === 'pdf' ? (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-500/10 ring-4 ring-indigo-500/20'
                        : pdfFile
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-indigo-300 dark:border-indigo-800/80 hover:border-indigo-500 bg-slate-50/70 dark:bg-[#171138]/60 hover:bg-indigo-50/30'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      accept="application/pdf,.pdf"
                      className="hidden"
                    />

                    {pdfFile ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Check className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-base">
                            {pdfFile.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                            {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Ready for Synthesis
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Replace File
                          </button>
                          <span className="text-slate-400">&bull;</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClearInput();
                            }}
                            className="text-xs font-extrabold text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                          <FileUp className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 dark:text-slate-200 text-base">
                            Drop your study PDF here, or <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4">browse files</span>
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Supports syllabi, lecture slides, research papers, and textbook chapters (up to 20MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* PASTE TEXT MODE */
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your lecture notes, textbook excerpt, study guide, or article here..."
                      rows={7}
                      className="w-full p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-[#171138]/80 border-2 border-indigo-200 dark:border-indigo-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all font-mono font-medium"
                    />
                    {pastedText && (
                      <button
                        onClick={handleClearInput}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Clear text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Word count & Sample preset buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        Try Sample:
                      </span>
                      {SAMPLE_NOTES.map((sample) => (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSelectSample(sample)}
                          className="px-3 py-1 rounded-xl bg-white dark:bg-[#1e1747] hover:bg-indigo-50 dark:hover:bg-indigo-900/60 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-bold border-2 border-indigo-100 dark:border-indigo-800/60 shadow-2xs"
                        >
                          {sample.icon} {sample.subject}
                        </button>
                      ))}
                    </div>

                    <span className="font-bold text-slate-600 dark:text-slate-400 self-end sm:self-auto">
                      {wordCount} words &bull; {pastedText.length} characters
                    </span>
                  </div>
                </div>
              )}

              {/* Action Button with tactile Sling launcher */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-indigo-900/60">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left font-medium">
                  Generates 5-bullet summary, 8 flashcards, 5 multiple-choice quiz questions & AI chat tutor.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    disabled={loading || (inputMode === 'pdf' ? !pdfBase64 : !pastedText.trim())}
                    onClick={handleGenerate}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Study Pack</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <LoadingState 
            fileName={inputMode === 'pdf' ? pdfFile?.name : 'Your Pasted Notes'} 
          />
        )}

        {/* RESULTS VIEW */}
        {!loading && studyPack && documentContext && (
          <div className="space-y-6">
            {/* Tabs Header Navigation */}
            <div className="p-1.5 rounded-3xl bg-white/95 dark:bg-[#120d2c]/95 border-2 border-indigo-200/80 dark:border-indigo-800/70 shadow-lg flex items-center gap-1.5 overflow-x-auto scrollbar-none backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === 'summary'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1d1646]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Summary</span>
                <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                  activeTab === 'summary' ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  5
                </span>
              </button>

              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1d1646]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Flashcards</span>
                <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                  activeTab === 'flashcards' ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {studyPack.flashcards.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1d1646]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
                <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                  activeTab === 'quiz' ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {studyPack.quiz.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1d1646]'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Chat</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'summary' && (
                <SummaryTab 
                  studyPack={studyPack} 
                  documentTitle={documentContext.title || documentContext.fileName} 
                />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardsTab 
                  cards={studyPack.flashcards} 
                  onEarnXP={addXP}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizTab 
                  questions={studyPack.quiz} 
                  onEarnXP={addXP}
                  onExtendStreak={incrementStreak}
                />
              )}

              {activeTab === 'chat' && (
                <ChatTab 
                  documentContext={documentContext} 
                  studyPack={studyPack} 
                  onEarnXP={addXP}
                />
              )}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !studyPack && (
          <EmptyState 
            onSelectSample={handleSelectSample} 
            onFocusInput={() => {
              setInputMode('text');
              inputSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t-2 border-indigo-100/60 dark:border-indigo-950/80 text-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
        <p>
          Study Buddy &bull; Powered by Gemini AI &bull; Interactive Summaries, Flashcards, Quizzes, AI Chat & React Bits
        </p>
      </footer>
    </div>
  );
}
