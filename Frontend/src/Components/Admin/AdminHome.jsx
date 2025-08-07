"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { adminAPI } from "../../services/api"

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSupervisors: 0,
    pendingApprovals: 0,
    completedTasks: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
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

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-lg">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Students</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
              <p className="text-sm text-green-600">Active students</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Supervisors</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSupervisors}</div>
              <p className="text-sm text-green-600">Available supervisors</p>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Approvals</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</div>
              <p className="text-sm text-red-600">Needs attention</p>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed Tasks</h3>
              <div className="text-2xl font-bold text-gray-900">{stats.completedTasks}</div>
              <p className="text-sm text-green-600">Total completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/users" 
            className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-semibold text-gray-900">Manage Users</h3>
            <p className="text-sm text-gray-600">Approve pending students</p>
          </Link>
          <Link 
            to="/admin/encadreurs" 
            className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👨‍🏫</div>
            <h3 className="font-semibold text-gray-900">Manage Supervisors</h3>
            <p className="text-sm text-gray-600">Add or edit supervisors</p>
          </Link>
          <Link 
            to="/admin/reports" 
            className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="font-semibold text-gray-900">View Reports</h3>
            <p className="text-sm text-gray-600">System statistics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
