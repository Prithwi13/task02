export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  questions: QuestionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  id: string;
  question: string;
  answer: string;
  audioTranscription?: string;
  timestamp: string;
}

export interface DailyQuestion {
  id: string;
  text: string;
  category: 'reflection' | 'gratitude' | 'goals' | 'mood' | 'creativity';
}

export interface AppState {
  currentEntry: JournalEntry | null;
  entries: JournalEntry[];
  isRecording: boolean;
  isMirrorActive: boolean;
  currentQuestionIndex: number;
  dailyQuestions: DailyQuestion[];
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}