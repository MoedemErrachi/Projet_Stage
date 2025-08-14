"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "./UserContext"
import { authAPI } from "../services/api"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authAPI.login(formData)
      const userData = response.data

      // Store user data
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase(),
        status: userData.status?.toLowerCase(),
        studentId: userData.studentId,
        department: userData.department,
      }

      login(user)

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/admin")
      } else if (user.role === "encadreur") {
        navigate("/encadreur")
      } else if (user.role === "student") {
        navigate("/student")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Internship Management System</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        {/*<div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Demo Accounts:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Admin:</span> admin@university.edu
            </p>
            <p>
              <span className="font-medium">Supervisor:</span> supervisor@university.edu
            </p>
            <p>
              <span className="font-medium">Student:</span> student@university.edu
            </p>
            <p>
              <span className="font-medium">Password:</span> password
            </p>
          </div>
        </div>*/}
      </div>
    </div>
  )
}

export default Login
