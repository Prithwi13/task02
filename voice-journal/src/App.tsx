import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Settings, Menu, X } from 'lucide-react';
import { JournalEntry, DailyQuestion, QuestionResponse } from './types';
import { storageUtils, defaultQuestions } from './utils/storage';
import CalendarView from './components/CalendarView';
import JournalQuestions from './components/JournalQuestions';
import CameraMirror from './components/CameraMirror';
import { v4 as uuidv4 } from 'uuid';

type ViewMode = 'calendar' | 'journal' | 'settings';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isMirrorActive, setIsMirrorActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize app data
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = () => {
    // Load journal entries
    const savedEntries = storageUtils.getAllJournalEntries();
    setEntries(savedEntries);

    // Load questions or use defaults
    let savedQuestions = storageUtils.getDailyQuestions();
    if (savedQuestions.length === 0) {
      savedQuestions = defaultQuestions;
      storageUtils.saveDailyQuestions(savedQuestions);
    }
    setQuestions(savedQuestions);

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  };

  const getRandomQuestions = (count: number = 5): DailyQuestion[] => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const existingEntry = storageUtils.getJournalEntryByDate(date);
    
    if (existingEntry) {
      setCurrentEntry(existingEntry);
      setViewMode('journal');
    } else {
      // Create new entry for this date
      const newEntry: JournalEntry = {
        id: uuidv4(),
        date: date,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCurrentEntry(newEntry);
      setViewMode('journal');
    }
  };

  const handleNewEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    handleDateSelect(today);
  };

  const handleResponseUpdate = (responses: QuestionResponse[]) => {
    if (!currentEntry) return;

    const updatedEntry: JournalEntry = {
      ...currentEntry,
      questions: responses,
      updatedAt: new Date().toISOString()
    };

    setCurrentEntry(updatedEntry);
    storageUtils.saveJournalEntry(updatedEntry);
    
    // Update entries list
    const updatedEntries = entries.filter(e => e.id !== updatedEntry.id);
    updatedEntries.push(updatedEntry);
    setEntries(updatedEntries);
  };

  const handleJournalComplete = () => {
    setIsRecording(false);
    setViewMode('calendar');
    // Refresh entries
    const savedEntries = storageUtils.getAllJournalEntries();
    setEntries(savedEntries);
  };

  const getCurrentQuestions = (): DailyQuestion[] => {
    if (currentEntry && currentEntry.questions.length > 0) {
      // Return questions from existing entry
      return currentEntry.questions.map(response => ({
        id: response.id,
        text: response.question,
        category: 'reflection' // Default category for existing entries
      }));
    }
    // Return random questions for new entry
    return getRandomQuestions(5);
  };

  const renderNavigation = () => {
    const navItems = [
      { id: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar' },
      { id: 'journal' as ViewMode, icon: BookOpen, label: 'Journal' },
      { id: 'settings' as ViewMode, icon: Settings, label: 'Settings' }
    ];

    return (
      <>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setViewMode(item.id);
                if (item.id === 'journal' && !currentEntry) {
                  handleNewEntry();
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg border border-gray-200 p-2 min-w-[150px] z-50">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setViewMode(item.id);
                    setIsMobileMenuOpen(false);
                    if (item.id === 'journal' && !currentEntry) {
                      handleNewEntry();
                    }
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    viewMode === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="journal-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
          <div className="space-y-3">
            <button
              onClick={storageUtils.exportAllData}
              className="w-full btn-secondary text-left"
            >
              Export Journal Data
            </button>
            <label className="block">
              <span className="btn-secondary cursor-pointer w-full inline-block text-center">
                Import Journal Data
              </span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    storageUtils.importData(file)
                      .then(() => {
                        loadAppData();
                        alert('Data imported successfully!');
                      })
                      .catch(() => {
                        alert('Error importing data. Please check the file format.');
                      });
                  }
                }}
              />
            </label>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all journal data? This cannot be undone.')) {
                  storageUtils.clearAllData();
                  loadAppData();
                  setCurrentEntry(null);
                  setViewMode('calendar');
                }
              }}
              className="w-full bg-red-100 text-red-700 hover:bg-red-200 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="journal-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">App Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Total Entries:</strong> {entries.length}</p>
            <p><strong>Questions Available:</strong> {questions.length}</p>
            <p><strong>Storage Used:</strong> {Math.round(JSON.stringify(entries).length / 1024)} KB</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-gray-900">Voice Journal</h1>
            </div>
            {renderNavigation()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {viewMode === 'calendar' && (
              <CalendarView
                entries={entries}
                onDateSelect={handleDateSelect}
                onNewEntry={handleNewEntry}
                selectedDate={selectedDate}
              />
            )}

            {viewMode === 'journal' && currentEntry && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Journal Entry - {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className="btn-secondary"
                  >
                    Back to Calendar
                  </button>
                </div>

                <JournalQuestions
                  questions={getCurrentQuestions()}
                  responses={currentEntry.questions}
                  onResponseUpdate={handleResponseUpdate}
                  onComplete={handleJournalComplete}
                  isRecording={isRecording}
                  onRecordingChange={setIsRecording}
                />
              </div>
            )}

            {viewMode === 'settings' && renderSettings()}
          </div>

          {/* Sidebar - Camera Mirror */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CameraMirror
                isActive={isMirrorActive}
                onToggle={() => setIsMirrorActive(!isMirrorActive)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
