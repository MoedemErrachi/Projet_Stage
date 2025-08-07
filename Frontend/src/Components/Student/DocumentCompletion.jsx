import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { studentAPI } from '../../services/api';

const DocumentCompletion = () => {
  const { user, updateUser } = useUser();
  const [files, setFiles] = useState({
    transcript: null,
    recommendation: null,
    portfolio: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user can upload documents
  const canUploadDocuments = user?.status === 'documents_pending';

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canUploadDocuments) {
      setError('You are not authorized to upload documents at this time.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    // Check if all required files are selected
    if (!files.transcript || !files.recommendation) {
      setError('Academic transcript and recommendation letter are required');
      setLoading(false);
      return;
    }

    try {
      await studentAPI.submitDocuments(user.id, files);
      
      // Update user status
      updateUser({ 
        status: 'ready_for_assignment',
        documentsCompleted: true 
      });
      
      setSuccess('Documents submitted successfully! You are now ready for supervisor assignment.');
    } catch (error) {
      console.error('Error submitting documents:', error);
      setError('Failed to submit documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canUploadDocuments) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Submission</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800">Document Submission Not Available</h3>
              <p className="text-yellow-700 text-sm mt-1">
                {user?.status === 'pending' && 'Your application is still under review. You will be able to submit documents once approved.'}
                {user?.status === 'approved' && 'You have already been assigned to a supervisor. Document submission is complete.'}
                {user?.status === 'ready_for_assignment' && 'Your documents have been submitted and you are ready for supervisor assignment.'}
                {user?.status === 'rejected' && 'Your application was not approved.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Documentation</h1>
        <p className="text-gray-600 text-lg">
          Congratulations! Your application has been approved. Please submit the following documents to complete your enrollment.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <div className="flex items-center">
          <span className="text-2xl mr-3">🎉</span>
          <div>
            <h3 className="font-semibold text-green-800">Application Approved!</h3>
            <p className="text-green-700 text-sm">
              Your internship application has been approved. Complete the documentation below to proceed to supervisor assignment.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Required Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Required Documents</h2>
          
          <div className="space-y-6">
            {/* Academic Transcript */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Academic Transcript *</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload your official academic transcript showing your current grades and completed courses.
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'transcript')}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {files.transcript && (
                    <p className="text-sm text-green-600 mt-2">✓ {files.transcript.name} selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation Letter */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Recommendation Letter *</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload a recommendation letter from a professor or academic advisor.
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'recommendation')}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {files.recommendation && (
                    <p className="text-sm text-green-600 mt-2">✓ {files.recommendation.name} selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Optional Documents</h2>
          
          <div className="space-y-6">
            {/* Portfolio */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Portfolio (Optional)</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Upload a portfolio showcasing your projects, work samples, or achievements.
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'portfolio')}
                    accept=".pdf,.doc,.docx,.zip,.rar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {files.portfolio && (
                    <p className="text-sm text-green-600 mt-2">✓ {files.portfolio.name} selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Requirements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">File Requirements:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Maximum file size: 10MB per file</li>
            <li>• Accepted formats: PDF, DOC, DOCX (ZIP/RAR for portfolio)</li>
            <li>• All documents should be clearly labeled and readable</li>
            <li>• Ensure all personal information is visible and correct</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || (!files.transcript || !files.recommendation)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Submitting Documents..." : "Submit Documents"}
          </button>
        </div>
      </form>

      {/* Process Timeline */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-sm text-gray-600">Application submitted and approved</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
            <span className="text-sm text-gray-600">Complete additional documentation (current step)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">3</span>
            </div>
            <span className="text-sm text-gray-600">Admin assigns you to a supervisor</span>
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
};

export default DocumentCompletion;
