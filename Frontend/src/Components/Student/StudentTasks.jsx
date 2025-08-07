"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { studentAPI, downloadFile } from "../../services/api"

const StudentTasks = () => {
  const { user } = useUser()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [response, setResponse] = useState("")
  const [responseFile, setResponseFile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null)
  const [modalType, setModalType] = useState("") // "start" or "complete"

  useEffect(() => {
    if (user?.id) {
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const response = await studentAPI.getTasks(user.id)
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleStartTask = async (task) => {
    try {
      await studentAPI.updateTaskResponse(task.id, "Task started")
      // Update local state
      setTasks(tasks.map((t) => 
        t.id === task.id 
          ? { ...t, status: "IN_PROGRESS" }
          : t
      ))
    } catch (error) {
      console.error("Error starting task:", error)
      setError("Failed to start task")
    }
  }

  const handleCompleteTask = (task) => {
    setSelectedTask(task)
    setResponse("")
    setResponseFile(null)
    setModalType("complete")
    setShowModal(true)
  }

  const handleResponseSubmit = async () => {
    if (selectedTask && response.trim()) {
      try {
        await studentAPI.completeTask(selectedTask.id, response, responseFile)
        
        // Update local state
        setTasks(tasks.map((task) => 
          task.id === selectedTask.id 
            ? { ...task, response, status: "COMPLETED", responseFileName: responseFile?.name }
            : task
        ))
        setSelectedTask(null)
        setResponse("")
        setResponseFile(null)
        setShowModal(false)
      } catch (error) {
        console.error("Error completing task:", error)
        setError("Failed to complete task")
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      case "urgent":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetails = (task) => {
    setSelectedTaskDetails(task)
    setShowDetailsModal(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB")
        return
      }
      setResponseFile(file)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600 text-lg">Manage your assigned tasks and deadlines</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-6">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Assigned</h3>
            <p className="text-gray-600">You don't have any tasks assigned yet.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority?.toLowerCase()} priority
                    </span>
                    <span className="text-sm text-gray-600">Category: {task.category || 'General'}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                >
                  {task.status?.toLowerCase().replace('_', ' ')}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{task.description}</p>

              {/* Task Attachment (Supervisor's file) */}
              {task.attachmentFileName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">📎 Task Attachment:</h4>
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
                {task.grade && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Grade: {task.grade}
                  </span>
                )}
              </div>

              {task.response && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">Your Response:</h4>
                  <p className="text-blue-800 text-sm">{task.response}</p>
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
                  <h4 className="font-medium text-green-900 mb-2">Supervisor Feedback:</h4>
                  <p className="text-green-800 text-sm">{task.feedback}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {task.status === "PENDING" && (
                  <button
                    onClick={() => handleStartTask(task)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Task
                  </button>
                )}
                {task.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(task)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Complete Task Modal */}
      {showModal && selectedTask && modalType === "complete" && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Task</h3>
              <h4 className="text-md font-semibold text-gray-800 mb-2">{selectedTask.title}</h4>

              {/* Show task attachment in modal */}
              {selectedTask.attachmentFileName && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Task Attachment:</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-800 text-sm">📎 {selectedTask.attachmentFileName}</span>
                    <button 
                      onClick={() => handleDownloadFile(selectedTask, 'task', 'view')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadFile(selectedTask, 'task', 'download')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Completion Message: *</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Describe what you have completed and any important notes..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach File (Optional):</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png"
                />
                {responseFile && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {responseFile.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Max file size: 10MB. Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR, JPG, PNG</p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResponseSubmit}
                  disabled={!response.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Task
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
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTaskDetails.status)}`}
                    >
                      {selectedTaskDetails.status?.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTaskDetails.priority)}`}
                    >
                      {selectedTaskDetails.priority?.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <p className="text-sm text-gray-900">{selectedTaskDetails.dueDate}</p>
                </div>
                
                {/* Task Attachment in Details Modal */}
                {selectedTaskDetails.attachmentFileName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Task Attachment</label>
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
                    <label className="block text-sm font-medium text-gray-700">Your Response</label>
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

export default StudentTasks
