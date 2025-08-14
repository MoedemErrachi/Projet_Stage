"use client"

import { useState, useEffect } from "react"
import { adminAPI } from "../../services/api"

const EncadreurManagement = () => {
  const [encadreurs, setEncadreurs] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEncadreur, setNewEncadreur] = useState({
    name: "",
    email: "",
    department: "",
    password: "password"
  })
  const [editingEncadreur, setEditingEncadreur] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEncadreurs()
  }, [])

  const fetchEncadreurs = async () => {
    try {
      const response = await adminAPI.getSupervisors()
      setEncadreurs(response.data)
    } catch (error) {
      console.error("Error fetching supervisors:", error)
      setError("Failed to load supervisors")
    } finally {
      setLoading(false)
    }
  }

  const handleAddEncadreur = async (e) => {
    e.preventDefault()
    if (newEncadreur.name && newEncadreur.email && newEncadreur.department) {
      try {
        const supervisorData = {
          ...newEncadreur,
          password: "password" // Set default password
        }
        await adminAPI.addSupervisor(supervisorData)
        await fetchEncadreurs() // Refresh the list
        setNewEncadreur({ name: "", email: "", department: "", password: "password" })
        setShowAddModal(false)
        setError("") // Clear any previous errors
      } catch (error) {
        console.error("Error adding supervisor:", error)
        setError("Failed to add supervisor")
      }
    }
  }

  const handleEditEncadreur = (encadreur) => {
    setEditingEncadreur(encadreur)
    setNewEncadreur({
      name: encadreur.name || "",
      email: encadreur.email || "",
      department: encadreur.department || "",
      password: "password"
    })
    setShowEditModal(true)
  }

  const handleRemoveEncadreur = async (encadreurId) => {
    if (window.confirm("Are you sure you want to remove this supervisor?")) {
      try {
        await adminAPI.deleteSupervisor(encadreurId)
        setEncadreurs((prev) => prev.filter((enc) => enc.id !== encadreurId))
      } catch (error) {
        console.error("Error removing supervisor:", error)
        setError("Failed to remove supervisor")
      }
    }
  }

  const handleUpdateEncadreur = async (e) => {
    e.preventDefault()
    if (newEncadreur.name && newEncadreur.email && newEncadreur.department) {
      try {
        await adminAPI.updateSupervisor(editingEncadreur.id, newEncadreur)
        await fetchEncadreurs() // Refresh the list
        setNewEncadreur({ name: "", email: "", department: "", password: "password" })
        setShowEditModal(false)
        setEditingEncadreur(null)
        setError("") // Clear any previous errors
      } catch (error) {
        console.error("Error updating supervisor:", error)
        setError("Failed to update supervisor")
      }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Supervisor Management</h1>
            <p className="text-gray-600 text-lg">Manage supervisors and their assignments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">+</span>
            Add Supervisor
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Supervisors List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {encadreurs.map((encadreur) => (
                <tr key={encadreur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {encadreur.name || `${encadreur.firstName} ${encadreur.lastName}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{encadreur.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{encadreur.department || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditEncadreur(encadreur)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveEncadreur(encadreur.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supervisor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Supervisor</h3>
              <form onSubmit={handleAddEncadreur} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newEncadreur.name}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEncadreur.email}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newEncadreur.department}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Default password will be set to: <strong>password</strong>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewEncadreur({ name: "", email: "", department: "", password: "password" })
                      setError("")
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Supervisor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Supervisor</h3>
              <form onSubmit={handleUpdateEncadreur} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newEncadreur.name}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEncadreur.email}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newEncadreur.department}
                    onChange={(e) => setNewEncadreur({ ...newEncadreur, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingEncadreur(null)
                      setNewEncadreur({ name: "", email: "", department: "", password: "password" })
                      setError("")
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Update Supervisor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EncadreurManagement
