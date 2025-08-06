import { Routes, Route } from "react-router-dom"
import Sidebar from "./Sidebar"
import StudentHome from "./Student/StudentHome"
import StudentTasks from "./Student/StudentTasks"
import StudentDocuments from "./Student/StudentDocuments"
import StudentProgress from "./Student/StudentProgress"

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="tasks" element={<StudentTasks />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="progress" element={<StudentProgress />} />
        </Routes>
      </div>
    </div>
  )
}

export default StudentDashboard
