"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { supervisorAPI, downloadFile } from "../../services/api"

const TaskManagement = () => {
  const { user } = useUser()
  const [tasks, setTasks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter states
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null)

  const [selectedTask, setSelectedTask] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [grade, setGrade] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [tasksResponse, studentsResponse] = await Promise.all([
        supervisorAPI.getTasks(user.id),
        supervisorAPI.getStudents(user.id)
      ])
      
      setTasks(tasksResponse.data)
      setStudents(studentsResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load tasks and students")
    } finally {
      setLoading(false)
    }
  }

  // Get student name by ID
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId)
    return student ? student.name : "Unknown Student"
  }

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const studentMatch = !selectedStudent || task.studentId.toString() === selectedStudent
    const statusMatch = !selectedStatus || task.status === selectedStatus
    return studentMatch && statusMatch
  })

  const handleViewDetails = (task) => {
    setSelectedTaskDetails(task)
    setShowDetailsModal(true)
  }

  const handleReviewTask = (task) => {
    setSelectedTask(task)
    setFeedback(task.feedback || "")
    setGrade(task.grade || "")
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    if (selectedTask && grade) {
      try {
        await supervisorAPI.gradeTask(selectedTask.id, { grade, feedback })
        
        // Update local state
        setTasks(tasks.map((task) => 
          task.id === selectedTask.id 
            ? { ...task, grade, feedback }
            : task
        ))
        
        setShowReviewModal(false)
        setSelectedTask(null)
        setFeedback("")
        setGrade("")
      } catch (error) {
        console.error("Error grading task:", error)
        setError("Failed to grade task")
      }
    }
  }

  const handleDownloadFile = (task, fileType, action = 'view') => {
    // Use the stored filename (attachmentFilePath or responseFilePath) for download
    let storedFileName;
    if (fileType === 'task') {
      storedFileName = task.attachmentFilePath;
    } else {
      storedFileName = task.responseFilePath;
    }
    
    if (storedFileName) {
      downloadFile(storedFileName, fileType, action);
    } else {
      console.error('No stored filename found for', fileType);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "OVERDUE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      case "URGENT":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
        <p className="text-gray-600 text-lg">Monitor and review tasks assigned to your students</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              <p className="text-sm text-gray-600">All tasks</p>
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
              <div className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === "PENDING").length}
              </div>
              <p className="text-sm text-yellow-600">Need attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">In Progress</h3>
              <div className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === "IN_PROGRESS").length}
              </div>
              <p className="text-sm text-blue-600">Being worked on</p>
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
              <div className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => t.status === "COMPLETED").length}
              </div>
              <p className="text-sm text-green-600">Finished</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-6 flex space-x-4">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Students</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-6">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-600">No tasks match your current filters.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status.toLowerCase().replace('_', ' ')}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority.toLowerCase()} priority
                    </span>
                    <span className="text-sm text-gray-600">Student: {getStudentName(task.studentId)}</span>
                  </div>
                </div>
                {task.grade && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Grade: {task.grade}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{task.description}</p>

              {/* Task Attachment (Supervisor's file) */}
              {task.attachmentFileName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">📎 Your Task Attachment:</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-800 text-sm">{task.attachmentFileName}</span>
                    <button 
                      onClick={() => handleDownloadFile(task, 'task', 'view')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadFile(task, 'task', 'download')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Due Date:</span> {task.dueDate}
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {task.category || 'General'}
                </span>
              </div>

              {task.response && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Student Response:</h4>
                  <p className="text-blue-800 text-sm">{task.response}</p>
                  {/* Student's Response File */}
                  {task.responseFileName && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-blue-700 text-sm">📎 {task.responseFileName}</span>
                      <button 
                        onClick={() => handleDownloadFile(task, 'response', 'view')}
                        className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadFile(task, 'response', 'download')}
                        className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
              )}

              {task.feedback && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-900 mb-2">Your Feedback:</h4>
                  <p className="text-green-800 text-sm">{task.feedback}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleViewDetails(task)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
                {task.status === "COMPLETED" && (
                  <button
                    onClick={() => handleReviewTask(task)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {task.grade ? "Update Grade" : "Grade & Review"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Grade & Review Task</h3>
              <h4 className="text-md font-semibold text-gray-800 mb-2">{selectedTask.title}</h4>
              <p className="text-sm text-gray-600 mb-4">Student: {getStudentName(selectedTask.studentId)}</p>

              {selectedTask.response && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">Student Response:</h5>
                  <p className="text-sm text-gray-600">{selectedTask.response}</p>
                  {selectedTask.responseFileName && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-gray-700 text-sm">📎 {selectedTask.responseFileName}</span>
                      <button 
                        onClick={() => handleDownloadFile(selectedTask, 'response', 'view')}
                        className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadFile(selectedTask, 'response', 'download')}
                        className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional):</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Provide feedback to the student..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={!grade}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && selectedTaskDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <p className="text-sm text-gray-900">{getStudentName(selectedTaskDetails.studentId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTaskDetails.status)}`}
                    >
                      {selectedTaskDetails.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTaskDetails.priority)}`}
                    >
                      {selectedTaskDetails.priority.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.dueDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.category || 'General'}</p>
                </div>
                
                {/* Task Attachment in Details */}
                {selectedTaskDetails.attachmentFileName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Your Task Attachment</label>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-800">📎 {selectedTaskDetails.attachmentFileName}</span>
                        <button 
                          onClick={() => handleDownloadFile(selectedTaskDetails, 'task', 'view')}
                          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadFile(selectedTaskDetails, 'task', 'download')}
                          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTaskDetails.response && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Student Response</label>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedTaskDetails.response}</p>
                      {selectedTaskDetails.responseFileName && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-blue-700 text-sm">📎 {selectedTaskDetails.responseFileName}</span>
                          <button 
                            onClick={() => handleDownloadFile(selectedTaskDetails, 'response', 'view')}
                            className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadFile(selectedTaskDetails, 'response', 'download')}
                            className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedTaskDetails.grade && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grade</label>
                    <p className="text-sm text-gray-900">{selectedTaskDetails.grade}</p>
                  </div>
                )}
                {selectedTaskDetails.feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Feedback</label>
                    <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">{selectedTaskDetails.feedback}</p>
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
  )
}

export default TaskManagement
