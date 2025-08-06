import { Routes, Route } from "react-router-dom"
import Sidebar from "./Sidebar"
import EncadreurHome from "./Encadreur/EncadreurHome"
import StudentManagement from "./Encadreur/StudentManagement"
import TaskManagement from "./Encadreur/TaskManagement"
import TaskCreation from "./Encadreur/TaskCreation"

const EncadreurDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Routes>
          <Route index element={<EncadreurHome />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="tasks" element={<TaskManagement />} />
          <Route path="create-task" element={<TaskCreation />} />
        </Routes>
      </div>
    </div>
  )
}

export default EncadreurDashboard
