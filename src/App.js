import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import JobDescriptionInput from './components/JobDescriptionInput';
import InterviewSession from './components/InterviewSession';
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import { Brain, Target, Award, Users } from 'lucide-react';

// Configure axios base URL
axios.defaults.baseURL = 'https://igebra.onrender.com';

function App() {
  const [currentStep, setCurrentStep] = useState('input');
  const [jobDescription, setJobDescription] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJobDescriptionSubmit = async (description) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/parse-job-description', {
        job_description: description
      });
      
      setJobDescription(description);
      setExtractedSkills(response.data.skills);
      setCurrentStep('questions');
    } catch (err) {
      setError('Failed to parse job description. Please try again.');
      console.error('Error parsing job description:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async (difficulty = 'intermediate') => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/generate-questions', {
        job_description: jobDescription,
        skills: extractedSkills,
        difficulty: difficulty
      });
      
      setQuestions(response.data.questions);
      setCurrentStep('interview');
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error('Error generating questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (answer) => {
    setIsLoading(true);
    setError('');
    
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const response = await axios.post('/api/evaluate-answer', {
        question: currentQuestion.question,
        answer: answer,
        job_context: jobDescription
      });
      
      const newAnswers = [...answers, answer];
      const newEvaluations = [...evaluations, response.data.evaluation];
      
      setAnswers(newAnswers);
      setEvaluations(newEvaluations);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Interview completed
        await saveSession(newAnswers, newEvaluations);
        setCurrentStep('results');
      }
    } catch (err) {
      setError('Failed to evaluate answer. Please try again.');
      console.error('Error evaluating answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async (sessionAnswers, sessionEvaluations) => {
    try {
      await axios.post('/api/save-session', {
        job_description: jobDescription,
        questions: questions,
        answers: sessionAnswers,
        scores: sessionEvaluations
      });
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  const resetSession = () => {
    setCurrentStep('input');
    setJobDescription('');
    setExtractedSkills([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setEvaluations([]);
    setError('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'input':
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                  AI Interview Prep
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Transform job descriptions into personalized interview preparation
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="glass-effect rounded-lg p-6 text-center">
                    <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Analysis</h3>
                    <p className="text-white/70 text-sm">Intelligent job description parsing and skill extraction</p>
                  </div>
                  <div className="glass-effect rounded-lg p-6 text-center">
                    <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Personalized Questions</h3>
                    <p className="text-white/70 text-sm">Job-specific interview questions tailored to your role</p>
                  </div>
                  <div className="glass-effect rounded-lg p-6 text-center">
                    <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Real-time Evaluation</h3>
                    <p className="text-white/70 text-sm">Instant feedback with multi-dimensional scoring</p>
                  </div>
                  <div className="glass-effect rounded-lg p-6 text-center">
                    <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Professional Insights</h3>
                    <p className="text-white/70 text-sm">Expert-level feedback to improve your performance</p>
                  </div>
                </div>
              </div>
              
              <JobDescriptionInput 
                onSubmit={handleJobDescriptionSubmit}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        );
      
      case 'questions':
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
              <div className="glass-effect rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Skills Extracted
                </h2>
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                  {extractedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl text-white mb-4">
                    Ready to generate personalized questions?
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => generateQuestions('beginner')}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Generating...' : 'Beginner Level'}
                    </button>
                    <button
                      onClick={() => generateQuestions('intermediate')}
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Generating...' : 'Intermediate Level'}
                    </button>
                    <button
                      onClick={() => generateQuestions('advanced')}
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Generating...' : 'Advanced Level'}
                    </button>
                  </div>
                  
                  <button
                    onClick={resetSession}
                    className="mt-6 text-white/70 hover:text-white transition-colors"
                  >
                    ← Back to Job Description
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'interview':
        return (
          <InterviewSession
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onSubmitAnswer={submitAnswer}
            isLoading={isLoading}
            error={error}
            onBack={() => setCurrentStep('questions')}
          />
        );
      
      case 'results':
        return (
          <Results
            questions={questions}
            answers={answers}
            evaluations={evaluations}
            jobDescription={jobDescription}
            onRestart={resetSession}
          />
        );
      
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Header currentStep={currentStep} />
        {renderCurrentStep()}
      </div>
    </Router>
  );
}

export default App; 
