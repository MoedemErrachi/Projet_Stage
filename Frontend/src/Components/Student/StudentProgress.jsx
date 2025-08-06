"use client"

import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { studentAPI } from "../../services/api"

const StudentProgress = () => {
  const { user } = useUser()
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({
    activeTasks: 0,
    completedTasks: 0,
    totalTasks: 0,
    averageGrade: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user?.id) {
      fetchProgressData()
    }
  }, [user])

  const fetchProgressData = async () => {
    try {
      const [tasksResponse, statsResponse] = await Promise.all([
        studentAPI.getTasks(user.id),
        studentAPI.getDashboardStats(user.id)
      ])
      
      const tasksData = tasksResponse.data
      setTasks(tasksData)
      
      // Calculate additional stats
      const gradedTasks = tasksData.filter(task => task.grade)
      const averageGrade = gradedTasks.length > 0 
        ? calculateAverageGrade(gradedTasks.map(task => task.grade))
        : null

      setStats({
        ...statsResponse.data,
        averageGrade
      })
    } catch (error) {
      console.error("Error fetching progress data:", error)
      setError("Failed to load progress data")
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageGrade = (grades) => {
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D': 1.0, 'F': 0.0
    }
    
    const totalPoints = grades.reduce((sum, grade) => sum + (gradePoints[grade] || 0), 0)
    const average = totalPoints / grades.length
    
    // Convert back to letter grade
    if (average >= 3.85) return 'A'
    if (average >= 3.5) return 'A-'
    if (average >= 3.15) return 'B+'
    if (average >= 2.85) return 'B'
    if (average >= 2.5) return 'B-'
    if (average >= 2.15) return 'C+'
    if (average >= 1.85) return 'C'
    if (average >= 1.5) return 'C-'
    if (average >= 0.5) return 'D'
    return 'F'
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const getRecentActivities = () => {
    return tasks
      .filter(task => task.status === "COMPLETED" || task.response)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        activity: task.status === "COMPLETED" 
          ? `Completed "${task.title}"`
          : `Updated response for "${task.title}"`,
        date: new Date(task.updatedAt).toLocaleDateString(),
        type: task.status === "COMPLETED" ? "completion" : "progress"
      }))
  }

  const getMilestones = () => {
    const completedTasks = getTasksByStatus("COMPLETED")
    const inProgressTasks = getTasksByStatus("IN_PROGRESS")
    const pendingTasks = getTasksByStatus("PENDING")
    
    const milestones = [
      ...completedTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: true,
        date: task.dueDate,
        grade: task.grade
      })),
      ...inProgressTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: false,
        date: task.dueDate,
        current: true
      })),
      ...pendingTasks.slice(0, 3).map(task => ({
        id: task.id,
        title: task.title,
        completed: false,
        date: task.dueDate
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date))
    
    return milestones.slice(0, 7) // Show max 7 milestones
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

  const progressData = {
    overallProgress: stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0,
    completedTasks: stats.completedTasks,
    totalTasks: stats.totalTasks,
    averageGrade: stats.averageGrade || "N/A",
    daysRemaining: 45, // This could be calculated based on internship end date
  }

  const milestones = getMilestones()
  const recentActivities = getRecentActivities()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Overview</h1>
        <p className="text-gray-600 text-lg">Track your internship progress and milestones</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overall Progress</h3>
              <div className="text-2xl font-bold text-gray-900">{progressData.overallProgress}%</div>
              <p className="text-sm text-green-600">
                {progressData.overallProgress >= 75 ? "Excellent" : 
                 progressData.overallProgress >= 50 ? "Good" : 
                 progressData.overallProgress >= 25 ? "Fair" : "Getting Started"}
              </p>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tasks Completed</h3>
              <div className="text-2xl font-bold text-gray-900">
                {progressData.completedTasks}/{progressData.totalTasks}
              </div>
              <p className="text-sm text-gray-600">Tasks done</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Average Grade</h3>
              <div className="text-2xl font-bold text-gray-900">{progressData.averageGrade}</div>
              <p className="text-sm text-green-600">
                {progressData.averageGrade === "N/A" ? "No grades yet" : "Great work!"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.activeTasks}</div>
              <p className="text-sm text-gray-600">In progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Milestones Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Milestones</h2>
          {milestones.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-gray-500">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed
                          ? "bg-green-500 text-white"
                          : milestone.current
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {milestone.completed ? "✓" : index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${milestone.completed ? "text-gray-900" : "text-gray-600"}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-gray-500">Due: {milestone.date}</p>
                    {milestone.completed && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                        {milestone.grade && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Grade: {milestone.grade}
                          </span>
                        )}
                      </div>
                    )}
                    {milestone.current && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-500">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "completion"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {activity.type === "completion" ? "✅" : "📝"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProgress
