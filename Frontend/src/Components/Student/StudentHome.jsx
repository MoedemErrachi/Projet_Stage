"use client"
import { useState, useEffect } from "react"
import { useUser } from "../UserContext"
import { studentAPI } from "../../services/api"
import Sidebar from "../Sidebar"

const StudentHome = () => {
  const { user } = useUser()
  const [stats, setStats] = useState({
    activeTasks: 0,
    completedTasks: 0,
    totalTasks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id && user?.status === "approved") {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const response = await studentAPI.getDashboardStats(user.id)
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (user?.status === "pending") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-72">
          <div className="p-8">
            <div className="max-w-md mx-auto mt-16">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⏳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
                <p className="text-gray-600 mb-4">Your account is currently under review by the administrator.</p>
                <p className="text-gray-600 mb-6">You will be notified once your account is approved.</p>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.href = "/login"
                  }}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user?.status === "rejected") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-72">
          <div className="p-8">
            <div className="max-w-md mx-auto mt-16">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">❌</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Rejected</h2>
                <p className="text-gray-600 mb-4">Your account has been rejected by the administrator.</p>
                <p className="text-gray-600 mb-6">Please contact support for more information.</p>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.href = "/login"
                  }}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 text-lg">Track your internship progress and manage your tasks</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.activeTasks}</div>
              <p className="text-sm text-orange-600">Current assignments</p>
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
              <div className="text-2xl font-bold text-gray-900">{stats.completedTasks}</div>
              <p className="text-sm text-gray-600">Tasks finished</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTasks}</div>
              <p className="text-sm text-green-600">All assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</h3>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
              </div>
              <p className="text-sm text-green-600">Completion rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">View My Tasks</h4>
                <p className="text-sm text-gray-600">Check your current assignments</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                View Tasks
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Track Progress</h4>
                <p className="text-sm text-gray-600">Monitor your internship progress</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                View Progress
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {stats.totalTasks === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-500">No tasks assigned yet</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  You have {stats.activeTasks} active tasks and {stats.completedTasks} completed tasks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHome
