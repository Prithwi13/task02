import { JournalEntry, DailyQuestion } from '../types';

const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'voice_journal_entries',
  DAILY_QUESTIONS: 'voice_journal_questions',
  APP_SETTINGS: 'voice_journal_settings'
};

export const storageUtils = {
  // Journal entries
  saveJournalEntry: (entry: JournalEntry): void => {
    try {
      const existingEntries = storageUtils.getAllJournalEntries();
      const updatedEntries = existingEntries.filter(e => e.id !== entry.id);
      updatedEntries.push(entry);
      
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  },

  getAllJournalEntries: (): JournalEntry[] => {
    try {
      const entries = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error retrieving journal entries:', error);
      return [];
    }
  },

  getJournalEntryByDate: (date: string): JournalEntry | null => {
    try {
      const entries = storageUtils.getAllJournalEntries();
      return entries.find(entry => entry.date === date) || null;
    } catch (error) {
      console.error('Error retrieving journal entry by date:', error);
      return null;
    }
  },

  deleteJournalEntry: (entryId: string): void => {
    try {
      const existingEntries = storageUtils.getAllJournalEntries();
      const updatedEntries = existingEntries.filter(e => e.id !== entryId);
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  },

  // Daily questions
  saveDailyQuestions: (questions: DailyQuestion[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_QUESTIONS, JSON.stringify(questions));
    } catch (error) {
      console.error('Error saving daily questions:', error);
    }
  },

  getDailyQuestions: (): DailyQuestion[] => {
    try {
      const questions = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTIONS);
      return questions ? JSON.parse(questions) : [];
    } catch (error) {
      console.error('Error retrieving daily questions:', error);
      return [];
    }
  },

  // App settings
  saveAppSettings: (settings: any): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  },

  getAppSettings: (): any => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error retrieving app settings:', error);
      return {};
    }
  },

  // Utility functions
  exportAllData: () => {
    try {
      const data = {
        entries: storageUtils.getAllJournalEntries(),
        questions: storageUtils.getDailyQuestions(),
        settings: storageUtils.getAppSettings(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  },

  importData: (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            if (data.entries) {
              localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(data.entries));
            }
            if (data.questions) {
              localStorage.setItem(STORAGE_KEYS.DAILY_QUESTIONS, JSON.stringify(data.questions));
            }
            if (data.settings) {
              localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(data.settings));
            }
            
            resolve(true);
          } catch (parseError) {
            console.error('Error parsing import file:', parseError);
            reject(parseError);
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    });
  },

  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
};

// Default questions that will be loaded if none exist
export const defaultQuestions: DailyQuestion[] = [
  {
    id: '1',
    text: 'How are you feeling today? Describe your current emotional state.',
    category: 'mood'
  },
  {
    id: '2',
    text: 'What are three things you\'re grateful for today?',
    category: 'gratitude'
  },
  {
    id: '3',
    text: 'What was the most meaningful part of your day?',
    category: 'reflection'
  },
  {
    id: '4',
    text: 'What challenge did you face today, and how did you handle it?',
    category: 'reflection'
  },
  {
    id: '5',
    text: 'What goal would you like to focus on tomorrow?',
    category: 'goals'
  },
  {
    id: '6',
    text: 'If you could change one thing about today, what would it be?',
    category: 'reflection'
  },
  {
    id: '7',
    text: 'What made you smile or laugh today?',
    category: 'gratitude'
  },
  {
    id: '8',
    text: 'Describe something creative or inspiring you encountered today.',
    category: 'creativity'
  },
  {
    id: '9',
    text: 'What lesson did you learn about yourself today?',
    category: 'reflection'
  },
  {
    id: '10',
    text: 'How did you take care of your well-being today?',
    category: 'mood'
  }
];