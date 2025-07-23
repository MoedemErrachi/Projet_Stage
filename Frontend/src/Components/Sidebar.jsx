import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout by redirecting to login
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 p-2 rounded"
          >
            <IoLogOut className="w-5 h-5" />
            Logout
          </button>
        </li>
        <li>
          <a
            href="/tasks"
            className="block p-2 hover:bg-gray-700 rounded"
          >
            My Tasks
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;