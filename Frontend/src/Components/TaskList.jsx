import React, { useState, useEffect } from 'react';
import api from '../service/api';

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks?projectId=${projectId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [projectId]);

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center p-2 border-b">
            <span>
              {task.title} - <span className="text-gray-600">{task.dueDate || 'N/A'} - {task.status}</span>
            </span>
            <div>
              <button
                onClick={() => handleDelete(task._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => handleStatusUpdate(task._id, task.status === 'todo' ? 'inprogress' : 'completed')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              >
                {task.status === 'todo' ? 'Start' : 'Complete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;