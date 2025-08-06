"use client"
import { Link, useLocation } from "react-router-dom"
import { useUser } from "./UserContext"

const Sidebar = () => {
  const { user, logout } = useUser()
  const location = useLocation()

  const getMenuItems = () => {
    const basePath = `/${user.role}`

    // For pending students, show limited menu
    if (user.role === "student" && user.status === "pending") {
      return [{ path: `${basePath}`, label: "Dashboard", icon: "📊" }]
    }

    switch (user.role) {
      case "admin":
        return [
          { path: `${basePath}`, label: "Dashboard", icon: "📊" },
          { path: `${basePath}/users`, label: "User Management", icon: "👥" },
          { path: `${basePath}/encadreurs`, label: "Supervisors", icon: "👨‍🏫" },
          { path: `${basePath}/assignments`, label: "Student Assignments", icon: "🔗" },
          { path: `${basePath}/reports`, label: "Reports", icon: "📈" },
        ]
      case "encadreur":
        return [
          { path: `${basePath}`, label: "Dashboard", icon: "📊" },
          { path: `${basePath}/students`, label: "My Students", icon: "👨‍🎓" },
          { path: `${basePath}/tasks`, label: "Task Management", icon: "📋" },
          { path: `${basePath}/create-task`, label: "Create Task", icon: "➕" },
        ]
      case "student":
        return [
          { path: `${basePath}`, label: "Dashboard", icon: "📊" },
          { path: `${basePath}/tasks`, label: "My Tasks", icon: "📝" },
          { path: `${basePath}/progress`, label: "Progress", icon: "📈" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="fixed left-0 top-0 w-72 h-screen bg-slate-800 text-white flex flex-col z-50">
      {/* Header */}
      <div className="p-8 border-b border-slate-700 text-center">
        <h2 className="text-2xl font-bold mb-1">IMS</h2>
        <p className="text-xs text-slate-400 uppercase tracking-wider">Internship Management</p>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-slate-700 flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg font-bold">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{user?.name}</p>
          <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
          {user?.role === "student" && user?.status && (
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                user.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : user.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {user.status}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          {getMenuItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-slate-700 text-white border-l-4 border-blue-500"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span className="text-xl w-6 text-center">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-4 w-full px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-all duration-200"
        >
          <span className="text-xl w-6 text-center">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
