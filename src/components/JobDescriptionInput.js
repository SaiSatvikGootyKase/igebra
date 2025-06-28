import React, { useState } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';

const JobDescriptionInput = ({ onSubmit, isLoading, error }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [sampleJobDescription] = useState(`Senior Software Engineer

We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions.

Requirements:
• 5+ years of experience in software development
• Proficiency in Python, JavaScript, and React
• Experience with cloud platforms (AWS, Azure, or GCP)
• Knowledge of database design and SQL
• Experience with microservices architecture
• Strong problem-solving and communication skills
• Experience with Agile development methodologies

Responsibilities:
• Design and implement scalable software solutions
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and technical discussions
• Contribute to architectural decisions
• Write clean, maintainable, and well-documented code

Nice to have:
• Experience with Docker and Kubernetes
• Knowledge of CI/CD pipelines
• Experience with machine learning frameworks
• Open source contributions`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobDescription.trim()) {
      onSubmit(jobDescription);
    }
  };

  const loadSample = () => {
    setJobDescription(sampleJobDescription);
  };

  return (
    <div className="glass-effect rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Start Your Interview Prep
        </h2>
        <p className="text-white/80 text-lg">
          Paste your job description below and let AI extract key skills and generate personalized questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-white mb-2">
            Job Description
          </label>
          <div className="relative">
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste your job description here..."
              className="w-full h-64 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <div className="absolute top-3 right-3">
              <FileText className="w-5 h-5 text-white/40" />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading || !jobDescription.trim()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Job Description...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze & Extract Skills
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={loadSample}
            disabled={isLoading}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors disabled:opacity-50 border border-white/20"
          >
            <Upload className="w-5 h-5 mr-2 inline" />
            Load Sample
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-200 mb-2">
          💡 Pro Tips
        </h3>
        <ul className="text-blue-100 text-sm space-y-1">
          <li>• Include the full job description for better skill extraction</li>
          <li>• The more detailed the description, the more personalized your questions will be</li>
          <li>• Include both technical requirements and soft skills for comprehensive preparation</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescriptionInput; 