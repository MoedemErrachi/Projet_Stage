"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { supervisorAPI } from "../../services/api"

const TaskCreation = () => {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    studentId: "",
    dueDate: "",
    priority: "MEDIUM",
    category: "general",
  })

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDraft, setIsDraft] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchStudents()
    }
  }, [user])

  const fetchStudents = async () => {
    try {
      const response = await supervisorAPI.getStudents(user.id)
      setStudents(response.data)
    } catch (error) {
      console.error("Error fetching students:", error)
      setError("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const taskData = {
        ...formData,
        supervisorId: user.id
      }

      await supervisorAPI.createTask(taskData)
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        studentId: "",
        dueDate: "",
        priority: "MEDIUM",
        category: "general",
      })
      setIsDraft(false)
      alert("Task created successfully!")
    } catch (error) {
      console.error("Error creating task:", error)
      setError("Failed to create task. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const addTemplate = (template) => {
    setFormData({
      ...formData,
      description: formData.description + template,
    })
  }

  const handleSaveAsDraft = () => {
    if (formData.title && formData.description) {
      // In a real app, you'd save this to localStorage or backend
      localStorage.setItem('taskDraft', JSON.stringify(formData))
      alert("Task saved as draft successfully!")
      setIsDraft(true)
    } else {
      alert("Please fill in at least the title and description to save as draft.")
    }
  }

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('taskDraft')
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setFormData(draftData)
        setIsDraft(true)
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [])

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
        <p className="text-gray-600 text-lg">Assign a new task to your students</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {students.length === 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          You don't have any students assigned to you yet. Please contact the administrator to assign students.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter task title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Provide detailed task description, requirements, and expectations..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="general">General</option>
                        <option value="research">Research</option>
                        <option value="documentation">Documentation</option>
                        <option value="presentation">Presentation</option>
                        <option value="coding">Coding</option>
                        <option value="analysis">Analysis</option>
                        <option value="report">Report</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                      Assign to Student *
                    </label>
                    <select
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      disabled={students.length === 0}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSaveAsDraft}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {isDraft ? "Draft Saved" : "Save as Draft"}
                </button>
                <button
                  type="submit"
                  disabled={submitting || students.length === 0}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Students</h3>
            {students.length === 0 ? (
              <p className="text-sm text-gray-600">No students assigned</p>
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.studentId}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => addTemplate("\n\nDeliverables:\n- \n- \n- \n\nEvaluation Criteria:\n- \n- \n- ")}
                className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Add Deliverables Template
              </button>
              <button
                type="button"
                onClick={() => addTemplate("\n\nResources:\n- \n- \n\nReferences:\n- \n- ")}
                className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Add Resources Template
              </button>
              <button
                type="button"
                onClick={() => addTemplate("\n\nSubmission Requirements:\n- Format: \n- File size: \n- Deadline: ")}
                className="w-full text-left px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Add Submission Template
              </button>
            </div>
          </div>

          {/* Task Creation Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Creation Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Be specific about requirements and expectations</li>
              <li>• Set realistic deadlines considering student workload</li>
              <li>• Include relevant resources and references</li>
              <li>• Define clear evaluation criteria</li>
              <li>• Consider breaking large tasks into smaller milestones</li>
            </ul>
          </div>

          {/* Priority Guidelines */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Guidelines</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Urgent
                </span>
                <span className="text-sm text-gray-600">Critical tasks requiring immediate attention</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  High
                </span>
                <span className="text-sm text-gray-600">Important tasks with tight deadlines</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Medium
                </span>
                <span className="text-sm text-gray-600">Standard tasks with normal deadlines</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Low
                </span>
                <span className="text-sm text-gray-600">Optional or flexible deadline tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCreation
