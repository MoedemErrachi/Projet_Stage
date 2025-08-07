import React, { useState, useEffect } from 'react';
import { adminAPI, downloadFile } from '../../services/api';

const StudentAssignments = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, supervisorsResponse] = await Promise.all([
        adminAPI.getStudentAssignments(),
        adminAPI.getSupervisors()
      ]);
      
      setStudents(studentsResponse.data);
      setSupervisors(supervisorsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = (student) => {
    setSelectedStudent(student);
    setSelectedSupervisor('');
    setShowAssignModal(true);
  };

  const handleViewDetails = (student) => {
    setSelectedStudentDetails(student);
    setShowDetailsModal(true);
  };

  const handleAssignmentSubmit = async () => {
    if (selectedStudent && selectedSupervisor) {
      try {
        await adminAPI.assignStudentToSupervisor({
          studentId: selectedStudent.id,
          supervisorId: parseInt(selectedSupervisor)
        });
        
        // Update local state
        setStudents(students.map(student => 
          student.id === selectedStudent.id 
            ? { ...student, supervisorId: parseInt(selectedSupervisor), status: 'approved' }
            : student
        ));
        
        setShowAssignModal(false);
        setSelectedStudent(null);
        setSelectedSupervisor('');
      } catch (error) {
        console.error('Error assigning student:', error);
        setError('Failed to assign student');
      }
    }
  };

  const handleDownloadFile = (filePath, fileName, fileType) => {
    if (filePath && fileName) {
      downloadFile(filePath, fileType, 'view');
    } else {
      console.error('File path or name not available');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready_for_assignment':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'documents_pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'ready_for_assignment':
        return 'Ready for Assignment';
      case 'approved':
        return 'Assigned';
      case 'documents_pending':
        return 'Documents Pending';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Assignments</h1>
        <p className="text-gray-600 text-lg">Assign students to supervisors and manage assignments</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Students Available for Assignment</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No students available for assignment
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.department || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.supervisorId ? (
                        <span className="text-green-600">
                          {supervisors.find(s => s.id === student.supervisorId)?.firstName} {supervisors.find(s => s.id === student.supervisorId)?.lastName}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View All
                      </button>
                      {student.status === 'ready_for_assignment' && (
                        <button
                          onClick={() => handleAssignStudent(student)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Student to Supervisor</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Student: {selectedStudent.firstName} {selectedStudent.lastName}</p>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Supervisor:</label>
                <select
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a supervisor...</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.firstName} {supervisor.lastName} - {supervisor.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignmentSubmit}
                  disabled={!selectedSupervisor}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudentDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedStudentDetails.firstName} {selectedStudentDetails.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student ID</label>
                    <p className="text-sm text-gray-900">{selectedStudentDetails.studentId}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedStudentDetails.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-sm text-gray-900">{selectedStudentDetails.department || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedStudentDetails.status)}`}>
                      {getStatusText(selectedStudentDetails.status)}
                    </span>
                  </div>
                </div>

                {/* Application Files */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Application Files</h4>
                  <div className="space-y-2">
                    {selectedStudentDetails.cvFileName && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-blue-900">CV: </span>
                          <span className="text-sm text-blue-800">{selectedStudentDetails.cvFileName}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(selectedStudentDetails.cvFilePath, selectedStudentDetails.cvFileName, 'application')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    )}
                    
                    {selectedStudentDetails.motivationFileName && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-green-900">Motivation Letter: </span>
                          <span className="text-sm text-green-800">{selectedStudentDetails.motivationFileName}</span>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(selectedStudentDetails.motivationFilePath, selectedStudentDetails.motivationFileName, 'application')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Documents */}
                {(selectedStudentDetails.transcriptFileName || selectedStudentDetails.recommendationFileName || selectedStudentDetails.portfolioFileName) && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Additional Documents</h4>
                    <div className="space-y-2">
                      {selectedStudentDetails.transcriptFileName && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-purple-900">Transcript: </span>
                            <span className="text-sm text-purple-800">{selectedStudentDetails.transcriptFileName}</span>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(selectedStudentDetails.transcriptFilePath, selectedStudentDetails.transcriptFileName, 'documents')}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      )}
                      
                      {selectedStudentDetails.recommendationFileName && (
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-orange-900">Recommendation: </span>
                            <span className="text-sm text-orange-800">{selectedStudentDetails.recommendationFileName}</span>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(selectedStudentDetails.recommendationFilePath, selectedStudentDetails.recommendationFileName, 'documents')}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      )}
                      
                      {selectedStudentDetails.portfolioFileName && (
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-indigo-900">Portfolio: </span>
                            <span className="text-sm text-indigo-800">{selectedStudentDetails.portfolioFileName}</span>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(selectedStudentDetails.portfolioFilePath, selectedStudentDetails.portfolioFileName, 'documents')}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
