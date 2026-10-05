import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Bot, 
  ArrowRight,
  Orbit,
  LayoutGrid,
  Waves,
  ScrollText
} from 'lucide-react';
import { SAMPLE_NOTES, SampleNote } from '../data/sampleNotes';
import { AccordionGallery, AccordionItem } from './react-bits/AccordionGallery';
import { InfiniteSpiral, SpiralItem } from './react-bits/InfiniteSpiral';
import { MicroSlats } from './react-bits/MicroSlats';
import { ScrollStack, ScrollStackItem } from './react-bits/ScrollStack';

interface EmptyStateProps {
  onSelectSample: (sample: SampleNote) => void;
  onFocusInput: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectSample, onFocusInput }) => {
  const [showcaseMode, setShowcaseMode] = useState<'slats' | 'accordion' | 'spiral' | 'stack'>('accordion');

  const extraNotes: Record<string, SampleNote> = {
    astrophysics: {
      id: 'astrophysics-stars',
      title: 'Astrophysics: Stellar Evolution & Black Holes',
      subject: 'Physics',
      icon: '🌌',
      preview: 'Nuclear fusion, red giants, supernovae, event horizons, and general relativity.',
      content: `Astrophysics and Stellar Evolution: From Nebulae to Black Holes\n\n1. Star Formation: Molecular gas clouds undergo gravitational collapse, forming protostars.\n2. Main Sequence: Stars maintain hydrostatic equilibrium by fusing hydrogen into helium in their cores.\n3. Late Stages: Massive stars exhaust hydrogen, swell into red supergiants, and fuse elements up to iron.\n4. Supernovae: Core collapse triggers a violent supernova explosion, dispersing heavy elements into the cosmos.\n5. Remnants: Depending on the initial mass, the remnant becomes a white dwarf, a neutron star, or a gravitational singularity known as a black hole, surrounded by an event horizon.`
    },
    genetics: {
      id: 'genetics-crispr',
      title: 'Genetics & Molecular Biology: DNA, RNA & CRISPR',
      subject: 'Genetics',
      icon: '🧬',
      preview: 'DNA replication, transcription, translation, genetic regulation, and CRISPR-Cas9 genome editing.',
      content: `Molecular Genetics: Structure, Function, and Modern Biotechnology\n\n1. DNA Structure: Double helix with antiparallel strands composed of nucleotide bases: adenine, thymine, cytosine, and guanine.\n2. Central Dogma: Information flows from DNA to RNA (transcription) and from RNA to functional proteins (translation via ribosomes).\n3. Gene Regulation: Operons, transcription factors, and epigenetics govern which genes are expressed in response to internal and environmental cues.\n4. Mutations: Point mutations, frameshifts, and chromosomal rearrangements provide the genetic variation necessary for evolution.\n5. Biotechnology: CRISPR-Cas9 utilizes guide RNA and Cas9 endonuclease to introduce precise, targeted modifications into genomic sequences.`
    }
  };

  const accordionItems: AccordionItem[] = [
    {
      image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=900&q=80',
      label: 'Biology: Photosynthesis & Cells',
      onClick: () => onSelectSample(SAMPLE_NOTES[0]),
    },
    {
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80',
      label: 'History: Scientific Revolution',
      onClick: () => onSelectSample(SAMPLE_NOTES[1]),
    },
    {
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
      label: 'AI & Neural Networks',
      onClick: () => onSelectSample(SAMPLE_NOTES[2]),
    },
    {
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
      label: 'Astrophysics & Space Science',
      onClick: () => onSelectSample(extraNotes.astrophysics),
    },
    {
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80',
      label: 'Genetics & Molecular Biology',
      onClick: () => onSelectSample(extraNotes.genetics),
    },
  ];

  const spiralItems: SpiralItem[] = [
    {
      src: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400&q=80',
      alt: 'Plant Biology & Photosynthesis',
      label: '🌱 Plant Biology',
      onClick: () => onSelectSample(SAMPLE_NOTES[0]),
    },
    {
      src: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=80',
      alt: 'Scientific Revolution & History',
      label: '🔭 Enlightenment',
      onClick: () => onSelectSample(SAMPLE_NOTES[1]),
    },
    {
      src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80',
      alt: 'Neural Networks & Deep Learning',
      label: '🧠 Neural Nets',
      onClick: () => onSelectSample(SAMPLE_NOTES[2]),
    },
    {
      src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
      alt: 'Astrophysics & Space',
      label: '🌌 Astrophysics',
      onClick: () => onSelectSample(extraNotes.astrophysics),
    },
    {
      src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
      alt: 'Genetics & DNA',
      label: '🧬 Genetics',
      onClick: () => onSelectSample(extraNotes.genetics),
    },
    {
      src: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80',
      alt: 'Quantum Mechanics',
      label: '⚛️ Quantum Physics',
      onClick: () => onSelectSample(SAMPLE_NOTES[0]),
    },
    {
      src: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=400&q=80',
      alt: 'Organic Chemistry',
      label: '⚗️ Chemistry',
      onClick: () => onSelectSample(SAMPLE_NOTES[1]),
    },
    {
      src: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80',
      alt: 'Neuroscience',
      label: '⚡ Neuroscience',
      onClick: () => onSelectSample(SAMPLE_NOTES[2]),
    },
  ];

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      {/* Friendly Hero Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Interactive Study Hub powered by Gemini AI</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Turn Any Material Into Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Personal Study Pack</span>
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Upload any lecture PDF or paste study notes. In seconds, Gemini produces a 5-bullet summary, 8 interactive flip flashcards, a 5-question quiz, and a dedicated AI tutor.
        </p>
      </div>

      {/* Interactive React Bits Showcase: MicroSlats, Accordion, Spiral & ScrollStack */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                React Bits Interactive Showcase
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                Interactive Canvas
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
              {showcaseMode === 'slats' && 'Fluid MicroSlats Wave Simulation'}
              {showcaseMode === 'accordion' && 'GSAP Smooth Accordion Showcase'}
              {showcaseMode === 'spiral' && '3D Infinite Spiral Helix'}
              {showcaseMode === 'stack' && 'Lenis Smooth ScrollStack'}
            </h3>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto flex-wrap gap-1">
            <button
              onClick={() => setShowcaseMode('slats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showcaseMode === 'slats'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Fluid Wave</span>
            </button>

            <button
              onClick={() => setShowcaseMode('accordion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showcaseMode === 'accordion'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Accordion</span>
            </button>

            <button
              onClick={() => setShowcaseMode('spiral')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showcaseMode === 'spiral'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>3D Spiral</span>
            </button>

            <button
              onClick={() => setShowcaseMode('stack')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                showcaseMode === 'stack'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>Scroll Stack</span>
            </button>
          </div>
        </div>

        {/* Gallery / Visual Mount Container */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-950">
          {/* 1. MicroSlats */}
          {showcaseMode === 'slats' && (
            <div className="h-[380px] sm:h-[420px] relative w-full overflow-hidden">
              <MicroSlats
                preset="swell"
                color="#6366f1"
                glintColor="#e0e7ff"
                backgroundColor="#030712"
                slatWidth={12}
                slatHeight={28}
                gap={3}
                roundness={0.8}
                interactive={true}
                cursorStrength={1.5}
                cursorSize={50}
                swirl={0.4}
                trail={1.6}
                lean={0.2}
                intro={true}
              />
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40">
                <div className="inline-flex items-center gap-2 self-start bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  <span>Interactive WebGL: Move or click cursor to stir the wave</span>
                </div>

                <div className="pointer-events-auto space-y-3 max-w-lg">
                  <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                    Experience The Pulse of Learning
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Study Buddy transforms static text into dynamic knowledge packs with interactive visuals, 3D recall cards, and active scoring.
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      onClick={() => onSelectSample(SAMPLE_NOTES[0])}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      🌱 Biology Demo
                    </button>
                    <button
                      onClick={() => onSelectSample(SAMPLE_NOTES[1])}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      🔭 History Demo
                    </button>
                    <button
                      onClick={() => onSelectSample(SAMPLE_NOTES[2])}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-md"
                    >
                      🧠 AI Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. AccordionGallery */}
          {showcaseMode === 'accordion' && (
            <div className="p-3">
              <AccordionGallery
                items={accordionItems}
                defaultIndex={0}
                expandRatio={0.52}
                trigger="hover"
                accentColor="#818cf8"
                overlayColor="#020617"
                textColor="#ffffff"
                height={360}
                gap={10}
                radius={16}
                duration={0.65}
                parallax={0.5}
                tilt={7}
              />
            </div>
          )}

          {/* 3. InfiniteSpiral */}
          {showcaseMode === 'spiral' && (
            <div className="h-[420px] relative">
              <div className="absolute top-4 left-4 z-10 text-[11px] font-semibold text-slate-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                💡 Drag or scroll to rotate the 3D helix &bull; Click to load
              </div>
              <InfiniteSpiral
                items={spiralItems}
                animationMode="all"
                speed={0.55}
                radius={180}
                cardWidth={130}
                cardHeight={130}
                verticalSpacing={65}
                perspective={1000}
                cardRadius={16}
                centerScale={1.25}
                edgeBlur={5}
                cardsPerTurn={7}
                pauseOnHover={true}
                imageFit="cover"
              />
            </div>
          )}

          {/* 4. ScrollStack */}
          {showcaseMode === 'stack' && (
            <div className="h-[460px] relative w-full bg-slate-900">
              <div className="absolute top-4 left-4 z-20 text-[11px] font-semibold text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                📜 Scroll down inside container to see cards stack
              </div>
              <ScrollStack
                itemDistance={50}
                itemScale={0.04}
                itemStackDistance={24}
                stackPosition="15%"
                scaleEndPosition="5%"
                baseScale={0.88}
                blurAmount={1}
                className="h-full"
              >
                <ScrollStackItem itemClassName="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Step 1: 5-Bullet Summary</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-white">
                      Instant Synthesis of Lengthy Notes
                    </h4>
                    <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                      Gemini parses lecture slides, articles, and textbooks into 5 high-yield bullets with essential vocabulary terms and text-to-speech reading.
                    </p>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-purple-900 via-purple-950 to-slate-900 border border-purple-500/30 text-white">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Step 2: 8 Active-Recall Flashcards</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-white">
                      Interactive 3D Flip Card System
                    </h4>
                    <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                      Reinforce memory retention with realistic 3D flipping, keyboard navigation (Space & Arrow keys), shuffling, and mastery progress tracking.
                    </p>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 border border-emerald-500/30 text-white">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Step 3: 5-Question Diagnostic Quiz</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-white">
                      Multiple Choice with Instant Rationale
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                      Get immediate feedback on correct vs incorrect choices, view one-line rationale explanations, and celebrate high scores with confetti.
                    </p>
                  </div>
                </ScrollStackItem>

                <ScrollStackItem itemClassName="bg-gradient-to-br from-pink-900 via-pink-950 to-slate-900 border border-pink-500/30 text-white">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Step 4: Grounded Document Tutor</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-white">
                      Ask Any Doubt Directly To Your Notes
                    </h4>
                    <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
                      Chat directly with Gemini about your document. Request intuitive analogies, exam traps, and customized problem step-by-steps.
                    </p>
                  </div>
                </ScrollStackItem>
              </ScrollStack>
            </div>
          )}
        </div>
      </div>

      {/* 4 Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3.5">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            5-Bullet Summary
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            High-yield core takeaways distilling hours of reading into concise points you can absorb in 60 seconds.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3.5">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            8 Flip Flashcards
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Interactive 3D flip cards designed for active recall. Track mastery and test your retention hands-free.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3.5">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            5-Question Quiz
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Multiple-choice questions with instant scoring, feedback, and one-line rationale for every answer.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3.5">
            <Bot className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
            Document Chat
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ask any question directly to your notes. Get analogies, problem step-by-steps, and exam tips.
          </p>
        </div>
      </div>

      {/* Quick Try Sample Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              No file on hand?
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Try a Curated Sample Study Topic
            </h3>
          </div>
          <button
            onClick={onFocusInput}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Or paste your own notes above</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLE_NOTES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-2xs hover:shadow-md cursor-pointer transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{sample.icon}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {sample.subject}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.preview}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Load Sample</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
