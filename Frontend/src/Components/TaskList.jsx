import React from 'react';

const TaskList = ({ tasks, onDelete, onStatusUpdate }) => {
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
                onClick={() => onDelete(task._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => onStatusUpdate(task._id, task.status === 'todo' ? 'inprogress' : 'completed')}
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