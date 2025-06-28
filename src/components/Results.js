import React from 'react';
import { Trophy, TrendingUp, CheckCircle, AlertCircle, RefreshCw, Download, Share2 } from 'lucide-react';

const Results = ({ questions, answers, evaluations, jobDescription, onRestart }) => {
  const overallScore = evaluations.reduce((sum, evaluation) => sum + evaluation.overall_score, 0) / evaluations.length;
  
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-500/20 border-green-400/30';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-400/30';
    return 'bg-red-500/20 border-red-400/30';
  };

  const getPerformanceLevel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const downloadResults = () => {
    const resultsData = {
      jobDescription,
      overallScore,
      questions,
      answers,
      evaluations,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-lg p-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">Interview Complete!</h1>
          </div>
          <p className="text-xl text-white/80 mb-6">
            Here's your comprehensive performance analysis
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Start New Interview
            </button>
            <button
              onClick={downloadResults}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-white/20 flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Results
            </button>
          </div>
        </div>

        {/* Overall Score */}
        <div className="glass-effect rounded-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Overall Performance</h2>
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBackground(overallScore)} border-4 mb-4`}>
              <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore.toFixed(1)}
              </span>
            </div>
            <p className={`text-2xl font-semibold ${getScoreColor(overallScore)}`}>
              {getPerformanceLevel(overallScore)}
            </p>
            <p className="text-white/60 mt-2">Out of 10 points</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['technical_accuracy', 'communication_clarity', 'depth_of_knowledge', 'contextual_understanding', 'problem_solving'].map((metric) => {
              const avgScore = evaluations.reduce((sum, evaluation) => sum + evaluation[metric], 0) / evaluations.length;
              const metricLabels = {
                technical_accuracy: 'Technical Accuracy',
                communication_clarity: 'Communication',
                depth_of_knowledge: 'Knowledge Depth',
                contextual_understanding: 'Context Understanding',
                problem_solving: 'Problem Solving'
              };
              
              return (
                <div key={metric} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreBackground(avgScore)} border-2 mx-auto mb-2 flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${getScoreColor(avgScore)}`}>
                      {avgScore.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">{metricLabels[metric]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const evaluation = evaluations[index];
            const answer = answers[index];
            
            return (
              <div key={index} className="glass-effect rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium mr-3">
                      Question {index + 1}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.type === 'technical' ? 'bg-blue-500/20 text-blue-200' : 'bg-purple-500/20 text-purple-200'
                    }`}>
                      {question.type}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(evaluation.overall_score)}`}>
                    <span className={getScoreColor(evaluation.overall_score)}>
                      {evaluation.overall_score.toFixed(1)}/10
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Question:</h3>
                  <p className="text-white/80">{question.question}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Your Answer:</h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/80">{answer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {evaluation.strengths.map((strength, idx) => (
                        <li key={idx} className="text-green-200 text-sm flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {evaluation.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-yellow-200 text-sm flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-200 mb-2">Detailed Feedback:</h4>
                  <p className="text-blue-100 text-sm">{evaluation.feedback}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="glass-effect rounded-lg p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">What's Next?</h3>
          <p className="text-white/80 mb-6">
            Review your performance, practice areas for improvement, and try again with different questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Practice Again
            </button>
            <button
              onClick={downloadResults}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-white/20 flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Save Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results; 