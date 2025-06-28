import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard = ({ onStartNew }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setSessions(response.data.sessions);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading your interview history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Dashboard</h1>
              <p className="text-white/80">Track your interview preparation progress</p>
            </div>
            <button
              onClick={onStartNew}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start New Interview
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{sessions.length}</h3>
            <p className="text-white/60">Total Sessions</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {sessions.length > 0 ? formatDate(sessions[0].created_at).split(',')[0] : 'N/A'}
            </h3>
            <p className="text-white/60">Latest Session</p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {sessions.length > 0 ? Math.round(sessions.length / 7 * 100) : 0}%
            </h3>
            <p className="text-white/60">Weekly Goal</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="glass-effect rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <History className="w-6 h-6 mr-3" />
            Recent Sessions
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
              <p className="text-white/60 mb-6">Start your first interview preparation session to see your progress here.</p>
              <button
                onClick={onStartNew}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Session #{session.id}
                      </h3>
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {session.job_description}
                      </p>
                      <div className="flex items-center text-white/60 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(session.created_at)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="glass-effect rounded-lg p-8 mt-8">
          <h3 className="text-xl font-bold text-white mb-4">💡 Improvement Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/80">
            <div>
              <h4 className="font-medium text-white mb-2">Practice Regularly</h4>
              <p>Consistent practice helps improve your interview skills and confidence over time.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Review Feedback</h4>
              <p>Pay attention to the detailed feedback provided after each session to identify areas for improvement.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Try Different Roles</h4>
              <p>Practice with various job descriptions to prepare for different types of interviews.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Track Progress</h4>
              <p>Monitor your scores and improvements across different sessions to see your growth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 