"use client"

import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"

const StudentAssignments = () => {
  const [students, setStudents] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get both ready and approved students
      const [readyResponse, approvedResponse, supervisorsResponse] = await Promise.all([
        adminAPI.getReadyStudents(),
        adminAPI.getApprovedStudents(),
        adminAPI.getSupervisors()
      ])
      
      // Combine ready and approved students
      const allStudents = [...readyResponse.data, ...approvedResponse.data]
      setStudents(allStudents)
      setSupervisors(supervisorsResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load student assignments")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignStudent = (student) => {
    setSelectedStudent(student)
    setSelectedSupervisorId(student.supervisorId || "")
    setShowAssignModal(true)
  }

  const handleSubmitAssignment = async () => {
    if (selectedStudent && selectedSupervisorId) {
      try {
        await adminAPI.assignStudent(selectedStudent.id, parseInt(selectedSupervisorId))
        
        // Update local state
        setStudents(students.map(student => 
          student.id === selectedStudent.id 
            ? { ...student, supervisorId: parseInt(selectedSupervisorId), status: 'APPROVED' }
            : student
        ))
        
        setShowAssignModal(false)
        setSelectedStudent(null)
        setSelectedSupervisorId("")
      } catch (error) {
        console.error("Error assigning student:", error)
        setError("Failed to assign student to supervisor")
      }
    }
  }

  const getSupervisorName = (supervisorId) => {
    const supervisor = supervisors.find(s => s.id === supervisorId)
    return supervisor ? (supervisor.name || `${supervisor.firstName} ${supervisor.lastName}`) : "Unassigned"
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Assignments</h1>
        <p className="text-gray-600 text-lg">Assign students to supervisors</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Assignment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Students</h3>
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
              <p className="text-sm text-gray-600">Ready & Assigned</p>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Assigned</h3>
              <div className="text-2xl font-bold text-gray-900">
                {students.filter(s => s.supervisorId).length}
              </div>
              <p className="text-sm text-green-600">Have supervisors</p>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Unassigned</h3>
              <div className="text-2xl font-bold text-gray-900">
                {students.filter(s => !s.supervisorId).length}
              </div>
              <p className="text-sm text-red-600">Need assignment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Student Assignment Management</h2>
        
        {students.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-500">No students available for assignment</p>
            <p className="text-sm text-gray-400 mt-2">Students will appear here after completing all required documents</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.firstName?.charAt(0) || student.name?.charAt(0) || 'S'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName && student.lastName 
                              ? `${student.firstName} ${student.lastName}` 
                              : student.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                        </div>
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
                      <div className="flex items-center">
                        {student.status === 'APPROVED' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Approved & Assigned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ⏳ Ready for Assignment
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.supervisorId ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {getSupervisorName(student.supervisorId)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAssignStudent(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {student.supervisorId ? "Reassign" : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedStudent.supervisorId ? 'Reassign' : 'Assign'} Supervisor to{' '}
                {selectedStudent.name 
                  ? `${selectedStudent.name}` 
                  : selectedStudent.name || 'Student'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supervisor
                </label>
                <select
                  value={selectedSupervisorId}
                  onChange={(e) => setSelectedSupervisorId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a supervisor</option>
                  {supervisors.map((supervisor) => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.name || `${supervisor.firstName} ${supervisor.lastName}`} - {supervisor.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false)
                    setSelectedStudent(null)
                    setSelectedSupervisorId("")
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={!selectedSupervisorId}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedStudent.supervisorId ? 'Reassign' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentAssignments
