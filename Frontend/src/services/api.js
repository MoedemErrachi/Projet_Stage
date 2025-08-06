import axios from "axios"

const API_BASE_URL = "http://localhost:8081"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/signin", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
}

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard-stats"),
  getPendingStudents: () => api.get("/admin/pending-students"),
  getApprovedStudents: () => api.get("/admin/approved-students"),
  approveStudent: (id) => api.post(`/admin/approve-student/${id}`),
  rejectStudent: (id) => api.post(`/admin/reject-student/${id}`),
  getSupervisors: () => api.get("/admin/supervisors"),
  addSupervisor: (data) => api.post("/admin/add-supervisor", data),
  updateSupervisor: (id, data) => api.put(`/admin/update-supervisor/${id}`, data),
  deleteSupervisor: (id) => api.delete(`/admin/delete-supervisor/${id}`),
  // NEW: Student-supervisor assignment
  getStudentAssignments: () => api.get("/admin/student-assignments"),
  assignStudentToSupervisor: (data) => api.post("/admin/assign-student", data),
}

// Student API
export const studentAPI = {
  getDashboardStats: (studentId) => api.get(`/student/dashboard-stats/${studentId}`),
  getTasks: (studentId) => api.get(`/student/tasks/${studentId}`),
  updateTaskResponse: (taskId, response) => api.put(`/student/tasks/${taskId}/response`, { response }),
  completeTask: (taskId) => api.put(`/student/tasks/${taskId}/complete`),
}

// Supervisor API
export const supervisorAPI = {
  getDashboardStats: (supervisorId) => api.get(`/supervisor/dashboard-stats/${supervisorId}`),
  getStudents: (supervisorId) => api.get(`/supervisor/students/${supervisorId}`),
  getTasks: (supervisorId) => api.get(`/supervisor/tasks/${supervisorId}`),
  createTask: (taskData) => api.post("/supervisor/tasks", taskData),
  gradeTask: (taskId, gradeData) => api.put(`/supervisor/tasks/${taskId}/grade`, gradeData),
}

export default api
