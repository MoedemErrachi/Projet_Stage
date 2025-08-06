"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { studentAPI } from "../../services/api"

const StudentTasks = () => {
  const { user } = useUser()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [response, setResponse] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null)

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

  const handleResponseSubmit = async () => {
    if (selectedTask && response.trim()) {
      try {
        await studentAPI.updateTaskResponse(selectedTask.id, response)
        // Update local state
        setTasks(tasks.map((task) => 
          task.id === selectedTask.id 
            ? { ...task, response, status: task.status === "PENDING" ? "IN_PROGRESS" : task.status }
            : task
        ))
        setSelectedTask(null)
        setResponse("")
        setShowModal(false)
      } catch (error) {
        console.error("Error updating task response:", error)
        setError("Failed to update task response")
      }
    }
  }

  const handleCompleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to mark this task as completed?")) {
      try {
        await studentAPI.completeTask(taskId)
        setTasks(tasks.map((task) => 
          task.id === taskId ? { ...task, status: "COMPLETED" } : task
        ))
      } catch (error) {
        console.error("Error completing task:", error)
        setError("Failed to complete task")
      }
    }
  }

  const openResponseModal = (task) => {
    setSelectedTask(task)
    setResponse(task.response || "")
    setShowModal(true)
  }

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
                </div>
              )}

              {task.feedback && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-900 mb-2">Supervisor Feedback:</h4>
                  <p className="text-green-800 text-sm">{task.feedback}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {task.status !== "COMPLETED" && (
                  <button
                    onClick={() => openResponseModal(task)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {task.status === "PENDING" ? "Start Task" : "Update Response"}
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(task)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Details
                </button>
                {task.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Respond to Task</h3>
              <h4 className="text-md font-semibold text-gray-800 mb-2">{selectedTask.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedTask.description}</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response:</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Enter your response or progress update..."
                />
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
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Submit Response
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
                {selectedTaskDetails.response && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Your Response</label>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedTaskDetails.response}</p>
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
