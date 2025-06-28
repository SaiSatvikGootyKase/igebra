import React from 'react';
import { Brain } from 'lucide-react';

const Header = ({ currentStep }) => {
  const steps = [
    { key: 'input', label: 'Job Description', completed: currentStep !== 'input' },
    { key: 'questions', label: 'Skills & Questions', completed: ['interview', 'results'].includes(currentStep) },
    { key: 'interview', label: 'Interview', completed: currentStep === 'results' },
    { key: 'results', label: 'Results', completed: currentStep === 'results' }
  ];

  return (
    <header className="glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-xl font-bold text-white">AI Interview Prep</h1>
          </div>
          
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {step.completed ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.key ? 'text-white' : 'text-white/60'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-4 w-8 h-0.5 ${
                      step.completed ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 