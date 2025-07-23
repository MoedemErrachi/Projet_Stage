import React, { useState } from 'react';
import loginanimation from '../Images/Signup.json'; // Ensure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import { IoIosLogIn } from 'react-icons/io';
import Lottie from 'lottie-react';
//import api from '../service/api';
import { useUser } from './UserContext'; // Import UserContext hook
import toast from 'react-hot-toast'; // For toast notifications

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  //const { setCurrentUser } = useUser(); // Access setCurrentUser from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
   /* e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      setCurrentUser(response.data.user); // Update user context
      localStorage.setItem('token', response.data.token); // Store token if backend provides it
      toast.success('Login successful!');
      navigate('/tasks'); // Redirect to tasks page after login
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    }*/
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-blue-100">
      <div className="bg-white p-5 rounded-2xl shadow-lg w-5/6 max-w-full space-y-6 h-5/6 flex items-center justify-around">
        <div className="flex flex-col justify-around h-5/6 w-96">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-800">Log in to your account</h2>
            <h2 className="text-base font-thin text-center text-gray-800">Welcome back! Please enter your details</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col justify-around gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="block text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="block text-gray-700">
                Password:
              </label>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4zm0-6a4 4 0 110 8 4 4 0 010-8zm0-2a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 rounded-md hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <IoIosLogIn className="h-8 w-6" />
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gray-500 hover:underline hover:text-gray-700">
              Sign up
            </Link>
          </p>
        </div>

        <Lottie animationData={loginanimation} loop={true} className="hidden lg:block lg:w-1/2" />
      </div>
    </div>
  );
};

export default Login;