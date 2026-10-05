export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface StudyPack {
  title: string;
  summary: string[];
  keyTerms?: KeyTerm[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export interface DocumentContext {
  type: 'text' | 'pdf';
  content: string; // raw text or base64
  fileName?: string;
  title?: string;
  summary?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
