import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

// Mock data for testing
const mockTasks = [
  { _id: '1', title: 'Complete Report', dueDate: '2025-07-24', status: 'todo' },
  { _id: '2', title: 'Review Code', dueDate: '2025-07-23', status: 'inprogress' },
  { _id: '3', title: 'Send Email', dueDate: null, status: 'completed' },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Simulate data load
  useEffect(() => {
    setTasks(mockTasks); // Load mock tasks on mount
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task._id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, { ...newTask, _id: Date.now().toString() }]);
    setShowForm(false);
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6">My Tasks</h2>
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <TaskList tasks={filteredTasks} onDelete={handleDelete} onStatusUpdate={handleStatusUpdate} />
      {showForm ? (
        <TaskForm onTaskAdded={handleTaskAdded} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add Task
        </button>
      )}
    </div>
  );
};

export default MyTasks;