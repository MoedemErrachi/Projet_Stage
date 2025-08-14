"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "./UserContext"
import { authAPI } from "../services/api"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    phone: "",
    university: "",
    major: "",
    year: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [motivationFile, setMotivationFile] = useState(null)

  const { login } = useUser()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB for application documents)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, DOC, and DOCX files are allowed")
        return
      }

      if (fileType === "cv") {
        setCvFile(file)
      } else {
        setMotivationFile(file)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!cvFile || !motivationFile) {
      setError("Both CV and Motivation Letter are required")
      setLoading(false)
      return
    }

    try {
      // Create the userData object with files
      const userData = {
        ...formData,
        cvFile: cvFile,
        motivationFile: motivationFile,
      }

      const response = await authAPI.signup(userData)

      // Create user object for login (pending status)
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        role: "student",
        status: "pending",
      }

      login(newUser)
      navigate("/student")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for Internship</h1>
          <p className="text-gray-600">Submit your application to join our internship program</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your university email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your student ID"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2">
                  University *
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                  placeholder="Enter your university name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-semibold text-gray-700 mb-2">
                  Major/Field of Study *
                </label>
                <input
                  type="text"
                  id="major"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Computer Science"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                  Academic Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select your year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="cv" className="block text-sm font-semibold text-gray-700 mb-2">
                  Curriculum Vitae (CV) *
                </label>
                <input
                  type="file"
                  id="cv"
                  onChange={(e) => handleFileChange(e, "cv")}
                  required
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                {cvFile && <p className="text-sm text-green-600 mt-1">✓ {cvFile.name} selected</p>}
                <p className="text-xs text-gray-500 mt-1">Upload your CV in PDF, DOC, or DOCX format (max 5MB)</p>
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Motivation Letter *
                </label>
                <input
                  type="file"
                  id="motivation"
                  onChange={(e) => handleFileChange(e, "motivation")}
                  required
                  accept=".pdf,.doc,.docx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                {motivationFile && <p className="text-sm text-green-600 mt-1">✓ {motivationFile.name} selected</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Upload your motivation letter in PDF, DOC, or DOCX format (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Submitting Application..." : "Submit Application"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Application Process:</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Submit your application with required documents</li>
            <li>2. Wait for admin review and approval</li>
            <li>3. Complete additional documentation if approved</li>
            <li>4. Get assigned to a supervisor</li>
            <li>5. Begin your internship tasks</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Signup
