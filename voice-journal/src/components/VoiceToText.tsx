import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

interface VoiceToTextProps {
  onTranscriptChange: (transcript: string) => void;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({
  onTranscriptChange,
  isRecording,
  onRecordingChange
}) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' ';
          } else {
            interimTranscript += transcriptPart;
          }
        }

        const fullTranscript = transcript + finalTranscript + interimTranscript;
        setTranscript(fullTranscript);
        onTranscriptChange(fullTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        onRecordingChange(false);
      };

      recognition.onend = () => {
        if (isRecording) {
          // If we're supposed to be recording but recognition ended, restart it
          try {
            recognition.start();
          } catch (err) {
            console.error('Error restarting recognition:', err);
            onRecordingChange(false);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start voice recognition');
        onRecordingChange(false);
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }
    onRecordingChange(!isRecording);
  };

  const clearTranscript = () => {
    setTranscript('');
    onTranscriptChange('');
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Volume2 className="text-yellow-600 mr-2" size={20} />
          <p className="text-yellow-800 text-sm">
            Voice recognition is not supported in this browser. Please type your response manually.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-800">Voice Input</h4>
        <div className="flex space-x-2">
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse-slow'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          {transcript && (
            <button
              onClick={clearTranscript}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="relative">
        <div className="min-h-[120px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          {isRecording && (
            <div className="absolute top-2 right-2 flex items-center text-red-500 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
              Recording...
            </div>
          )}
          
          {transcript ? (
            <p className="text-gray-800 leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-gray-500 italic">
              {isRecording 
                ? 'Listening... Start speaking to see your words appear here.'
                : 'Click the microphone button to start voice input.'}
            </p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>Tip: Speak clearly and at a normal pace for best results. The app will continue listening until you stop recording.</p>
      </div>
    </div>
  );
};

export default VoiceToText;