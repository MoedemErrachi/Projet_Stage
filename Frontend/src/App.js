/*import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Sidebar from './Components/Sidebar';
import MyTasks from './Components/MyTasks';
import { Toaster } from 'react-hot-toast';

// Placeholder components
const Home = () => <h1 className="text-2xl font-bold text-center mt-8">Home Page</h1>;
const Contact = () => <h1 className="text-2xl font-bold text-center mt-8">Contact Page</h1>;
const Error = () => <h1 className="text-2xl font-bold text-center mt-8">404 - Page Not Found</h1>;

const TasksLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <MyTasks />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/tasks',
    element: <TasksLayout />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '*',
    element: <Error />,
  },
]);

function App() {
  return (
    <div>
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;*/
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { UserProvider } from "./Components/UserContext"
import Login from "./Components/Login"
import Signup from "./Components/Signup"
import AdminDashboard from "./Components/AdminDashboard"
import StudentDashboard from "./Components/StudentDashboard"
import EncadreurDashboard from "./Components/EncadreurDashboard"
import ProtectedRoute from "./Components/ProtectedRoute"

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/encadreur/*"
              element={
                <ProtectedRoute allowedRoles={["encadreur"]}>
                  <EncadreurDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
