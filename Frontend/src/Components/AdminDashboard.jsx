import { Routes, Route } from "react-router-dom"
import Sidebar from "./Sidebar"
import AdminHome from "./Admin/AdminHome"
import UserManagement from "./Admin/UserManagement"
import EncadreurManagement from "./Admin/EncadreurManagement"
import StudentAssignments from "./Admin/StudentAssignments"
import SystemReports from "./Admin/SystemReports"

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="encadreurs" element={<EncadreurManagement />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="reports" element={<SystemReports />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard
