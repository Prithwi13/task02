import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, SkipForward } from 'lucide-react';
import { DailyQuestion, QuestionResponse } from '../types';
import VoiceToText from './VoiceToText';
import { v4 as uuidv4 } from 'uuid';

interface JournalQuestionsProps {
  questions: DailyQuestion[];
  responses: QuestionResponse[];
  onResponseUpdate: (responses: QuestionResponse[]) => void;
  onComplete: () => void;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
}

const JournalQuestions: React.FC<JournalQuestionsProps> = ({
  questions,
  responses,
  onResponseUpdate,
  onComplete,
  isRecording,
  onRecordingChange
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.question === currentQuestion?.text);

  React.useEffect(() => {
    if (currentResponse) {
      setCurrentAnswer(currentResponse.answer);
    } else {
      setCurrentAnswer('');
    }
  }, [currentResponse, currentQuestionIndex]);

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
  };

  const saveCurrentAnswer = () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    const newResponse: QuestionResponse = {
      id: currentResponse?.id || uuidv4(),
      question: currentQuestion.text,
      answer: currentAnswer.trim(),
      audioTranscription: currentAnswer.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedResponses = responses.filter(r => r.question !== currentQuestion.text);
    updatedResponses.push(newResponse);
    onResponseUpdate(updatedResponses);
  };

  const goToNextQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      onRecordingChange(false); // Stop recording when moving to next question
    } else {
      // All questions completed
      onComplete();
    }
  };

  const goToPreviousQuestion = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      onRecordingChange(false); // Stop recording when moving to previous question
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      onRecordingChange(false);
    } else {
      onComplete();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      reflection: 'bg-blue-100 text-blue-800',
      gratitude: 'bg-green-100 text-green-800',
      goals: 'bg-purple-100 text-purple-800',
      mood: 'bg-yellow-100 text-yellow-800',
      creativity: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (!currentQuestion) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No questions available</h2>
        <p className="text-gray-600">Please check back later for daily questions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(currentQuestion.category)}`}>
          {currentQuestion.category}
        </span>
      </div>

      {/* Question */}
      <div className="journal-card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentQuestion.text}
        </h2>
        
        {/* Manual text input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Response
          </label>
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here or use voice input below..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Voice input */}
        <VoiceToText
          onTranscriptChange={handleAnswerChange}
          isRecording={isRecording}
          onRecordingChange={onRecordingChange}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={skipQuestion}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <SkipForward size={20} />
            <span>Skip</span>
          </button>

          <button
            onClick={goToNextQuestion}
            className="flex items-center space-x-2 btn-primary"
          >
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <Save size={20} />
                <span>Complete</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalQuestions;