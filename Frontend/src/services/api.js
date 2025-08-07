import axios from "axios"
const API_BASE_URL = 'http://localhost:8081';

// Helper function to create headers
const getHeaders = (includeContentType = true) => {
const headers = {};
if (includeContentType) {
  headers['Content-Type'] = 'application/json';
}
return headers;
};

// Helper function for file downloads
export const downloadFile = (fileName, type = 'task', action = 'download') => {
// Use the stored filename (which is URL-safe) for the API call
const baseUrl = `${API_BASE_URL}/files/${action}/${type}/${encodeURIComponent(fileName)}`;

console.log('Downloading file from:', baseUrl);

// Open in new tab for viewing or trigger download
if (action === 'view') {
  window.open(baseUrl, '_blank');
} else {
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = baseUrl;
  link.download = fileName;
  link.target = '_blank'; // Fallback to open in new tab
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
};

// Auth API
const api = axios.create({
baseURL: API_BASE_URL,
headers: {
  "Content-Type": "application/json",
},
})

// Auth API
export const authAPI = {
login: (credentials) => api.post("/auth/signin", credentials),
signup: async (userData, cvFile, motivationFile) => {
  const formData = new FormData();
  
  // Append all user data
  Object.keys(userData).forEach(key => {
    formData.append(key, userData[key]);
  });
  
  // Append files
  formData.append('cvFile', cvFile);
  formData.append('motivationFile', motivationFile);

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
},
}

// Admin API
export const adminAPI = {
getDashboardStats: () => api.get("/admin/dashboard-stats"),
getPendingStudents: () => api.get("/admin/pending-students"),
getApprovedStudents: () => api.get("/admin/approved-students"),
getDocumentsIncompleteStudents: () => api.get("/admin/documents-incomplete-students"),
getReadyStudents: () => api.get("/admin/ready-students"),
approveStudent: (id) => api.post(`/admin/approve-student/${id}`),
rejectStudent: (id) => api.post(`/admin/reject-student/${id}`),
getSupervisors: () => api.get("/admin/supervisors"),
addSupervisor: (data) => api.post("/admin/add-supervisor", data),
updateSupervisor: (id, data) => api.put(`/admin/update-supervisor/${id}`, data),
deleteSupervisor: (id) => api.delete(`/admin/delete-supervisor/${id}`),
// Student-supervisor assignment
getStudentAssignments: () => api.get("/admin/student-assignments"),
assignStudentToSupervisor: (data) => api.post("/admin/assign-student", data),
}

// Student API
export const studentAPI = {
getTasks: async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/tasks/${studentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { data: [] };
  }
},

updateTaskResponse: async (taskId, response, file = null) => {
  const formData = new FormData();
  formData.append('response', response);
  if (file) {
    formData.append('file', file);
  }

  const fetchResponse = await fetch(`${API_BASE_URL}/student/tasks/${taskId}/response`, {
    method: 'PUT',
    body: formData,
  });
  return fetchResponse.json();
},

completeTask: async (taskId, response, file = null) => {
  const formData = new FormData();
  formData.append('response', response);
  if (file) {
    formData.append('file', file);
  }

  const fetchResponse = await fetch(`${API_BASE_URL}/student/tasks/${taskId}/complete`, {
    method: 'PUT',
    body: formData,
  });
  return fetchResponse.json();
},

getDashboardStats: async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/dashboard-stats/${studentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { data: { activeTasks: 0, completedTasks: 0, totalTasks: 0 } };
  }
},

submitDocuments: async (studentId, files) => {
  const formData = new FormData();
  
  if (files.transcript) {
    formData.append('transcriptFile', files.transcript);
  }
  if (files.recommendation) {
    formData.append('recommendationFile', files.recommendation);
  }
  if (files.portfolio) {
    formData.append('portfolioFile', files.portfolio);
  }

  const response = await fetch(`${API_BASE_URL}/student/submit-documents/${studentId}`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
},
};

// Supervisor API
export const supervisorAPI = {
getTasks: async (supervisorId) => {
  const response = await fetch(`${API_BASE_URL}/supervisor/tasks/${supervisorId}`);
  return { data: await response.json() };
},

getStudents: async (supervisorId) => {
  const response = await fetch(`${API_BASE_URL}/supervisor/students/${supervisorId}`);
  return { data: await response.json() };
},



createTask: async (taskData, file = null) => {
  const formData = new FormData();
  
  // Append all task data
  Object.keys(taskData).forEach(key => {
    formData.append(key, taskData[key]);
  });
  
  // Append file if present
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(`${API_BASE_URL}/supervisor/tasks`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
},

gradeTask: async (taskId, gradeData) => {
  const response = await fetch(`${API_BASE_URL}/supervisor/tasks/${taskId}/grade`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(gradeData),
  });
  return response.json();
},

getDashboardStats: async (supervisorId) => {
  const response = await fetch(`${API_BASE_URL}/supervisor/dashboard-stats/${supervisorId}`);
  return { data: await response.json() };
},
};

// Debug API for testing
export const debugAPI = {
listFiles: async (type) => {
  const response = await fetch(`${API_BASE_URL}/files/debug/list/${type}`);
  return response.json();
},
};
