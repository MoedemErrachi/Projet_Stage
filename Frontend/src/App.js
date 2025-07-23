import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

export default App;