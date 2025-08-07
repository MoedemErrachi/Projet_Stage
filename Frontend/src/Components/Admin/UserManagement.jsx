"use client"

import { useState, useEffect } from "react"
import { adminAPI, downloadFile } from "../../services/api"

const UserManagement = () => {
  const [pendingStudents, setPendingStudents] = useState([])
  const [approvedStudents, setApprovedStudents] = useState([])
  const [documentsIncompleteStudents, setDocumentsIncompleteStudents] = useState([])
  const [readyStudents, setReadyStudents] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const [pendingResponse, approvedResponse, documentsResponse, readyResponse] = await Promise.all([
        adminAPI.getPendingStudents(),
        adminAPI.getApprovedStudents(),
        adminAPI.getDocumentsIncompleteStudents(),
        adminAPI.getReadyStudents()
      ])
      setPendingStudents(pendingResponse.data)
      setApprovedStudents(approvedResponse.data)
      setDocumentsIncompleteStudents(documentsResponse.data)
      setReadyStudents(readyResponse.data)
    } catch (error) {
      console.error("Error fetching students:", error)
      setError("Failed to load student data")
    } finally {
      setLoading(false)
    }
  }

  const handleStudentAction = async (studentId, action) => {
    try {
      if (action === "approve") {
        await adminAPI.approveStudent(studentId)
        // Move student from pending to documents incomplete
        const student = pendingStudents.find(s => s.id === studentId)
        if (student) {
          setPendingStudents(prev => prev.filter(s => s.id !== studentId))
          setDocumentsIncompleteStudents(prev => [...prev, { ...student, status: "DOCUMENTS_PENDING" }])
        }
      } else if (action === "reject") {
        await adminAPI.rejectStudent(studentId)
        setPendingStudents(prev => prev.filter(s => s.id !== studentId))
      }
    } catch (error) {
      console.error(`Error ${action}ing student:`, error)
      setError(`Failed to ${action} student`)
    }
  }

  const handleViewApplication = (student) => {
    setSelectedApplication(student)
    setShowApplicationModal(true)
  }

  const handleDownloadApplicationFile = (student, fileType) => {
    let storedFileName;
    if (fileType === 'cv') {
      storedFileName = student.cvFilePath;
    } else if (fileType === 'motivation') {
      storedFileName = student.motivationFilePath;
    }
    
    if (storedFileName) {
      downloadFile(storedFileName, 'application', 'view');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
        <p className="text-gray-600 text-lg">Review and manage student internship applications</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Applications ({pendingStudents.length})
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Documents Pending ({documentsIncompleteStudents.length})
            </button>
            <button
              onClick={() => setActiveTab("ready")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ready"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Ready for Assignment ({readyStudents.length})
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "approved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Approved ({approvedStudents.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {activeTab === "pending" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Applications</h2>
            <p className="text-gray-600 mb-6">Review student applications and their submitted documents</p>

            {pendingStudents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-500">No pending applications</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                            <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                            <div className="text-sm text-gray-500">📞 {student.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{student.university}</div>
                            <div className="text-sm text-gray-500">{student.major}</div>
                            <div className="text-sm text-gray-500">{student.academicYear}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {student.cvFileName && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-blue-600">📄 CV</span>
                                <button
                                  onClick={() => handleDownloadApplicationFile(student, 'cv')}
                                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                  View
                                </button>
                              </div>
                            )}
                            {student.motivationFileName && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-green-600">📝 Motivation</span>
                                <button
                                  onClick={() => handleDownloadApplicationFile(student, 'motivation')}
                                  className="text-xs text-green-600 hover:text-green-800 underline"
                                >
                                  View
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewApplication(student)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            👁️ Review
                          </button>
                          <button
                            onClick={() => handleStudentAction(student.id, "approve")}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleStudentAction(student.id, "reject")}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            ✗ Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents Pending</h2>
            <p className="text-gray-600 mb-6">Students who need to complete additional documentation</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                These students have been approved but need to submit additional documents before supervisor assignment.
              </p>
            </div>

            {documentsIncompleteStudents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-gray-500">No students pending document completion</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentsIncompleteStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email} • {student.studentId}</p>
                        <p className="text-sm text-gray-500">{student.major} • {student.academicYear}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Documents Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "ready" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready for Assignment</h2>
            <p className="text-gray-600 mb-6">Students who have completed all requirements and are ready for supervisor assignment</p>

            {readyStudents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-gray-500">No students ready for assignment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {readyStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email} • {student.studentId}</p>
                        <p className="text-sm text-gray-500">{student.major} • {student.academicYear}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Ready for Assignment
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "approved" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Approved Students</h2>
            <p className="text-gray-600 mb-6">All students who have been approved for the internship program</p>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Application Review Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Review</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Personal Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Student ID</label>
                      <p className="text-sm text-gray-900">{selectedApplication.studentId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedApplication.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Academic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">University</label>
                      <p className="text-sm text-gray-900">{selectedApplication.university}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Major</label>
                      <p className="text-sm text-gray-900">{selectedApplication.major}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                      <p className="text-sm text-gray-900">{selectedApplication.academicYear}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Application Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-4">Submitted Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.cvFileName && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Curriculum Vitae</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">📄 {selectedApplication.cvFileName}</span>
                        <button
                          onClick={() => handleDownloadApplicationFile(selectedApplication, 'cv')}
                          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                        >
                          View CV
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedApplication.motivationFileName && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-700 mb-2">Motivation Letter</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">📝 {selectedApplication.motivationFileName}</span>
                        <button
                          onClick={() => handleDownloadApplicationFile(selectedApplication, 'motivation')}
                          className="text-green-600 hover:text-green-800 text-sm underline font-medium"
                        >
                          View Letter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleStudentAction(selectedApplication.id, "reject")
                    setShowApplicationModal(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => {
                    handleStudentAction(selectedApplication.id, "approve")
                    setShowApplicationModal(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
