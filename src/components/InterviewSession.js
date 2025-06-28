import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Clock, Target, Mic, MicOff, Volume2, RefreshCw } from 'lucide-react';

const InterviewSession = ({ 
  questions, 
  currentQuestionIndex, 
  onSubmitAnswer, 
  isLoading, 
  error, 
  onBack 
}) => {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const [hasRecorded, setHasRecorded] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setRecognitionError('');
      };
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += t;
          } else {
            interimTranscript += t;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };
      recognitionRef.current.onerror = (event) => {
        setRecognitionError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        setIsRecording(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (isRecording) {
          setTimeout(() => {
            if (isRecording) startRecording();
          }, 100);
        }
      };
    } else {
      setRecognitionError('Speech recognition is not supported in this browser');
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // Ensure button state is always in sync
  useEffect(() => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [isRecording]);

  const startRecording = () => {
    setTranscript('');
    setRecognitionError('');
    setHasRecorded(false);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    setHasRecorded(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      onSubmitAnswer(transcript.trim());
      setTranscript('');
      setHasRecorded(false);
    }
  };

  const handleReRecord = () => {
    setTranscript('');
    setRecognitionError('');
    setHasRecorded(false);
    setIsRecording(true);
  };

  const getQuestionTypeColor = (type) => {
    return type === 'technical' ? 'bg-blue-500/20 text-blue-200' : 'bg-purple-500/20 text-purple-200';
  };
  const getQuestionTypeIcon = (type) => {
    return type === 'technical' ? '⚙️' : '💬';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="glass-effect rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <div className="flex items-center text-white/80">
              <Clock className="w-5 h-5 mr-2" />
              <span>Take your time to think</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-effect rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium mr-3 ${getQuestionTypeColor(currentQuestion.type)}`}>
                {getQuestionTypeIcon(currentQuestion.type)} {currentQuestion.type}
              </span>
              <span className="text-white/60 text-sm">
                Skill: {currentQuestion.skill}
              </span>
            </div>
            <button
              onClick={onBack}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {currentQuestion.question}
            </h3>
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-blue-300 mr-2" />
                <span className="text-blue-200 text-sm font-medium">What we're looking for:</span>
              </div>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• Clear, structured response</li>
                <li>• Specific examples and experiences</li>
                <li>• Technical accuracy and depth</li>
                <li>• Relevance to the role requirements</li>
              </ul>
            </div>
          </div>

          {/* Voice Recording Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <Volume2 className="w-5 h-5 mr-2" />
                Voice Your Answer
              </h4>
              <div className="flex items-center space-x-3">
                {!isRecording && !hasRecorded && (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isRecording}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Start Recording
                  </button>
                )}
                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  >
                    <MicOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </button>
                )}
                {hasRecorded && !isRecording && (
                  <button
                    type="button"
                    onClick={handleReRecord}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-record
                  </button>
                )}
                {isListening && (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">Listening...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Display */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-[60px] mb-2">
              {transcript ? (
                <span className="text-white/90 text-base">{transcript}</span>
              ) : (
                <span className="text-white/40 text-base">Your answer will appear here after recording...</span>
              )}
            </div>

            {/* Error Message */}
            {recognitionError && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                <p className="text-red-200 text-sm">{recognitionError}</p>
              </div>
            )}

            {/* Voice Instructions */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h5 className="text-blue-200 text-sm font-medium mb-2">Voice Input Tips:</h5>
              <ul className="text-blue-100 text-xs space-y-1">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Use technical terms naturally</li>
                <li>• Provide specific examples and experiences</li>
                <li>• Click "Stop Recording" when finished</li>
                <li>• You can re-record if needed</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-white/60 text-sm">
                {transcript.length} characters
              </div>
              <button
                type="submit"
                disabled={isLoading || !hasRecorded || !transcript.trim()}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Answer
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Tips */}
        <div className="glass-effect rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            💡 Interview Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
            <div>
              <h4 className="font-medium text-white mb-2">For Technical Questions:</h4>
              <ul className="space-y-1">
                <li>• Explain your thought process</li>
                <li>• Mention specific technologies</li>
                <li>• Provide code examples if relevant</li>
                <li>• Use voice for natural explanation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">For Behavioral Questions:</h4>
              <ul className="space-y-1">
                <li>• Use the STAR method</li>
                <li>• Include specific outcomes</li>
                <li>• Show your problem-solving approach</li>
                <li>• Speak naturally about experiences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession; 