import React, { useState, useEffect, useRef } from 'react';

const TaskForm = ({ onTaskAdded, initialTask, onClose }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [description, setDescription] = useState(initialTask?.description || ''); // New description state
  const formRef = useRef(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDueDate(initialTask.dueDate || '');
      setDescription(initialTask.description || ''); // Set description if editing
    }
  }, [initialTask]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose(); // Close form and discard changes
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      dueDate: dueDate || null,
      description, // Include description
      status: 'todo', // Default status to 'todo'
      subtasks: initialTask?.subtasks || [],
    };
    onTaskAdded(newTask);
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" ref={formRef}>
      <h2 className="text-xl font-bold mb-4">{initialTask ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter task description"
          />
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {initialTask ? 'Update Task' : 'Save Task'}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;