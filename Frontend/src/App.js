
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { UserProvider } from './Components/UserContext'; 
import ProtectedRoute from './Components/ProtectedRoute';
import  { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  /*{
    path:"/",
    element:<Home/>
  },
  {
    path:"/contact",
    element:<Contact/>
  },
  {
    path:"/profile",
    element:<ProtectedRoute><Profile/></ProtectedRoute>
  },
  {
    path:"/docs",
    element:<Docs/>
  },*/
  {
  path:"/login",
    element:<Login/>
  },
  {
  path:"/signup",
    element:<Signup/>
  },
 /* {
    path:"/income",
      element:<ProtectedRoute><Income/></ProtectedRoute>
    },
  {
    path:"/dashboard",
      element:<ProtectedRoute><Dashboard/></ProtectedRoute>
    } ,
  {
    path:"/budgets",
      element:<ProtectedRoute><Budgets/></ProtectedRoute>
    },
    {path:"/transactions",
      element:<ProtectedRoute><Transactions/></ProtectedRoute>
    }
    ,
    {path:"/categories",
      element:<ProtectedRoute><Categories/></ProtectedRoute>
    },
    {path:"*",
      element:<ProtectedRoute><Error/></ProtectedRoute>
    }*/
])
function App() {
  return (
    <UserProvider> 
      <Toaster/>
      <RouterProvider router={router} ></RouterProvider>
    </UserProvider>
  );
}

export default App;