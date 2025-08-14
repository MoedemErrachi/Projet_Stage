const API_BASE_URL = "http://localhost:8081"

// Helper function to create headers
const getHeaders = (includeContentType = true) => {
  const headers = {}
  if (includeContentType) {
    headers["Content-Type"] = "application/json"
  }
  return headers
}

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }
  return response.json()
}

// Helper function to handle API errors
const handleError = (error, operation) => {
  console.error(`Error ${operation}:`, error)
  throw error
}

// Helper function for file downloads
export const downloadFile = (fileName, type = "task", action = "download") => {
  // Use the stored filename (which is URL-safe) for the API call
  const baseUrl = `${API_BASE_URL}/files/${action}/${type}/${encodeURIComponent(fileName)}`

  console.log("Downloading file from:", baseUrl)

  // Open in new tab for viewing or trigger download
  if (action === "view") {
    window.open(baseUrl, "_blank")
  } else {
    // Create temporary link and trigger download
    const link = document.createElement("a")
    link.href = baseUrl
    link.download = fileName
    link.target = "_blank" // Fallback to open in new tab
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "logging in")
    }
  },

  signup: async (userData) => {
    try {
      const formData = new FormData()

      // Add user data
      Object.keys(userData).forEach((key) => {
        if (key !== "cvFile" && key !== "motivationFile") {
          formData.append(key, userData[key])
        }
      })

      // Add files with correct parameter names that match backend
      if (userData.cvFile) {
        formData.append("cvFile", userData.cvFile)
      }
      if (userData.motivationFile) {
        formData.append("motivationFile", userData.motivationFile)
      }

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "signing up")
    }
  },
}

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching dashboard stats")
    }
  },

  getPendingStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/pending-students`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching pending students")
    }
  },

  getApprovedStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/approved-students`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching approved students")
    }
  },

  getDocumentsIncompleteStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/documents-incomplete-students`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching documents incomplete students")
    }
  },

  getReadyStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ready-students`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching ready students")
    }
  },

  approveStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/approve-student/${studentId}`, {
        method: "POST",
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "approving student")
    }
  },

  rejectStudent: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reject-student/${studentId}`, {
        method: "POST",
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "rejecting student")
    }
  },

  getSupervisors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/supervisors`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching supervisors")
    }
  },

  addSupervisor: async (supervisorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/add-supervisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supervisorData),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "adding supervisor")
    }
  },

  updateSupervisor: async (supervisorId, supervisorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/update-supervisor/${supervisorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supervisorData),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "updating supervisor")
    }
  },

  deleteSupervisor: async (supervisorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete-supervisor/${supervisorId}`, {
        method: "DELETE",
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "deleting supervisor")
    }
  },

  getStudentAssignments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/student-assignments`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching student assignments")
    }
  },

  assignStudent: async (studentId, supervisorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/assign-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, supervisorId }),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "assigning student")
    }
  },
}

// Student API
export const studentAPI = {
  getTasks: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/tasks/${studentId}`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching tasks")
    }
  },

  updateTaskResponse: async (taskId, response, file = null) => {
    const formData = new FormData()
    formData.append("response", response)
    if (file) {
      formData.append("file", file)
    }

    const fetchResponse = await fetch(`${API_BASE_URL}/student/tasks/${taskId}/response`, {
      method: "PUT",
      body: formData,
    })
    return fetchResponse.json()
  },

  completeTask: async (taskId, response, file = null) => {
    const formData = new FormData()
    formData.append("response", response)
    if (file) {
      formData.append("file", file)
    }

    const fetchResponse = await fetch(`${API_BASE_URL}/student/tasks/${taskId}/complete`, {
      method: "PUT",
      body: formData,
    })
    return fetchResponse.json()
  },

  getDashboardStats: async (studentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/dashboard-stats/${studentId}`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching dashboard stats")
    }
  },

  submitDocuments: async (studentId, files) => {
    try {
      const formData = new FormData()
      formData.append("transcript", files.transcript)
      formData.append("recommendation", files.recommendation)
      if (files.portfolio) {
        formData.append("portfolio", files.portfolio)
      }

      const response = await fetch(`${API_BASE_URL}/student/submit-documents/${studentId}`, {
        method: "POST",
        body: formData,
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "submitting documents")
    }
  },

  submitTask: async (taskId, file, description) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("description", description)

      const response = await fetch(`${API_BASE_URL}/student/submit-task/${taskId}`, {
        method: "POST",
        body: formData,
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "submitting task")
    }
  },
}

// Supervisor API
export const supervisorAPI = {
  getDashboardStats: async (supervisorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/dashboard-stats/${supervisorId}`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching supervisor dashboard stats")
    }
  },

  getStudents: async (supervisorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/students/${supervisorId}`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching students")
    }
  },

  getTasks: async (supervisorId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/tasks/${supervisorId}`)
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "fetching tasks")
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "creating task")
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/update-task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "updating task")
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/delete-task/${taskId}`, {
        method: "DELETE",
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "deleting task")
    }
  },

  gradeTask: async (taskId, grade, feedback) => {
    try {
      const response = await fetch(`${API_BASE_URL}/supervisor/grade-task/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade, feedback }),
      })
      return { data: await handleResponse(response) }
    } catch (error) {
      handleError(error, "grading task")
    }
  },
}

// File API
export const fileAPI = {
  downloadFile: async (filePath) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/download?filePath=${encodeURIComponent(filePath)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.blob()
    } catch (error) {
      handleError(error, "downloading file")
    }
  },

  viewDocument: async (filePath) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/view?filePath=${encodeURIComponent(filePath)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.blob()
    } catch (error) {
      handleError(error, "viewing document")
    }
  },
}
