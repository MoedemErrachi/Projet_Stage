import { Routes, Route } from "react-router-dom"
import Sidebar from "./Sidebar"
import StudentHome from "./Student/StudentHome"
import StudentTasks from "./Student/StudentTasks"
import StudentProgress from "./Student/StudentProgress"
import { useUser } from "./UserContext"

const StudentDashboard = () => {
  const { user } = useUser()

  // For rejected and pending students, show full width content without sidebar
  const isRestrictedStudent = user?.status === "rejected" || user?.status === "pending"

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`flex-1 ${isRestrictedStudent ? 'ml-0' : 'ml-72'}`}>
        <Routes>
          <Route index element={<StudentHome />} />
          <Route path="tasks" element={<StudentTasks />} />
          <Route path="progress" element={<StudentProgress />} />
        </Routes>
      </div>
    </div>
  )
}

export default StudentDashboard
