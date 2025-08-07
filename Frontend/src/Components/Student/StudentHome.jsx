import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { studentAPI } from '../../services/api';
import DocumentCompletion from './DocumentCompletion';

const StudentHome = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.status === 'approved' && user?.id) {
      fetchDashboardStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await studentAPI.getDashboardStats(user.id);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    logout();
    navigate('/login');
  };

  // Show document completion for students with documents_pending status
  if (user?.status === 'documents_pending') {
    return <DocumentCompletion />;
  }

  // Show restricted access for pending students
  if (user?.status === 'pending') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Under Review</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏳</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Application Pending</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Your internship application is currently under review by our administrators. 
                You will receive an email notification once your application has been processed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">1</span>
              </div>
              <span className="text-sm text-gray-600">Application submitted (current step)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">2</span>
              </div>
              <span className="text-sm text-gray-600">Admin reviews your application</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">3</span>
              </div>
              <span className="text-sm text-gray-600">Complete additional documentation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">4</span>
              </div>
              <span className="text-sm text-gray-600">Get assigned to a supervisor</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">5</span>
              </div>
              <span className="text-sm text-gray-600">Begin your internship tasks</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReturnToLogin}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Show rejection message for rejected students
  if (user?.status === 'rejected') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-3">❌</span>
            <div>
              <h3 className="font-semibold text-red-800">Application Not Approved</h3>
              <p className="text-red-700 text-sm mt-1">
                Unfortunately, your internship application was not approved at this time. 
                This could be due to various factors such as capacity limitations or specific requirements not being met.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
          <div className="space-y-3 text-gray-600">
            <p>• You may contact the administration for feedback on your application</p>
            <p>• Consider applying again in the next application period</p>
            <p>• Review and improve your application materials for future submissions</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReturnToLogin}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Show waiting for assignment message
  if (user?.status === 'ready_for_assignment') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ready for Assignment</h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <h3 className="font-semibold text-blue-800">Documents Submitted Successfully</h3>
              <p className="text-blue-700 text-sm mt-1">
                Your documents have been submitted and reviewed. You are now ready to be assigned to a supervisor.
                Please wait while an administrator assigns you to an appropriate supervisor.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-600">Application approved</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-gray-600">Documents submitted</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </div>
              <span className="text-sm text-gray-600">Waiting for supervisor assignment (current step)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-xs">4</span>
              </div>
              <span className="text-sm text-gray-600">Begin your internship tasks</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full dashboard for approved students (assigned to supervisor)
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back, {user?.firstName} {user?.lastName}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTasks || 0}</div>
              <p className="text-sm text-blue-600">Assigned to you</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.completedTasks || 0}</div>
              <p className="text-sm text-green-600">Tasks finished</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.pendingTasks || 0}</div>
              <p className="text-sm text-yellow-600">Awaiting start</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.inProgressTasks || 0}</div>
              <p className="text-sm text-purple-600">Currently working</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/student/tasks" 
            className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="font-semibold text-gray-900">View Tasks</h3>
            <p className="text-sm text-gray-600">See all assigned tasks</p>
          </Link>
          <Link 
            to="/student/progress" 
            className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="font-semibold text-gray-900">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
