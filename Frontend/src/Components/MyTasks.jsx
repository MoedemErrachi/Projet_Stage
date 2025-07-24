import React, { useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

// Mock data for testing
const mockTasks = [
  { _id: '1', title: 'Complete Report', dueDate: '2025-07-25', status: 'todo', subtasks: [{ id: 's1', title: 'Draft', completed: false }, { id: 's2', title: 'Review', completed: true }] },
  { _id: '2', title: 'Review Code', dueDate: '2025-07-24', status: 'inprogress', subtasks: [{ id: 's3', title: 'Check Syntax', completed: true }, { id: 's4', title: 'Test', completed: false }] },
  { _id: '3', title: 'Send Email', dueDate: null, status: 'completed', subtasks: [] },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const menuRef = useRef(null);
useEffect(() => {setTasks(mockTasks)},[])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && selectedTask) {
        handleSaveChanges();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedTask]);

  useEffect(() => {
    console.log('Tasks updated:', tasks); // Log tasks to verify state change
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
    setSelectedTask(null);
  };

  const handleStatusUpdate = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task =>
      task._id === taskId ? { ...task, status: task.status === 'todo' ? 'completed' : 'todo' } : task
    ));
    setSelectedTask(null);
  };

  const handleModify = (taskId) => {
    if (!selectedTask) { // Only modify if not already editing
      const task = tasks.find(t => t._id === taskId);
      setSelectedTask(JSON.parse(JSON.stringify(task))); // Deep copy for editing
    }
  };

  const handleAddSubtask = (taskId, subtaskTitle) => {
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(prevTask => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, { id: Date.now().toString(), title: subtaskTitle, completed: false }]
      }));
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [...prevTasks, { ...newTask, _id: Date.now().toString(), subtasks: [] }]);
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(prevTask => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map(sub => sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub)
      }));
    }
  };

  const handleUpdateSubtask = (taskId, subtaskId, updatedSubtask) => {
    if (selectedTask && selectedTask._id === taskId) {
      setSelectedTask(prevTask => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map(sub => sub.id === subtaskId ? { ...updatedSubtask } : sub)
      }));
    }
  };

  const handleSaveChanges = () => {
    if (selectedTask) {
      console.log('Saving changes - selectedTask:', selectedTask); // Debug log
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task._id === selectedTask._id ? { ...selectedTask } : task
        );
        console.log('Updated tasks:', updatedTasks); // Debug log to verify update
        return [...updatedTasks]; // Ensure new array reference
      });
      setSelectedTask(null);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6">My Tasks</h2>
      <div className="mb-6 flex justify-around">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-1/2 p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex">
        <TaskList
          tasks={filteredTasks}
          onDelete={handleDelete}
          onStatusUpdate={handleStatusUpdate}
          onModify={handleModify}
          onAddSubtask={handleAddSubtask}
          onSubtaskToggle={handleSubtaskToggle}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          key={tasks.length} // Force re-render on tasks change
        />
        {selectedTask && (
          <div ref={menuRef} className="w-1/3 p-6 bg-white ml-6 rounded-lg shadow-md relative">
            <button
              onClick={handleSaveChanges}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">Edit Task</h3>
            <div className="mb-2">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => setSelectedTask(prevTask => ({ ...prevTask, title: e.target.value }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Due Date</label>
              <input
                type="date"
                value={selectedTask.dueDate || ''}
                onChange={(e) => setSelectedTask(prevTask => ({ ...prevTask, dueDate: e.target.value || null }))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Status</label>
              <select
                value={selectedTask.status}
                onChange={(e) => setSelectedTask(prevTask => ({ ...prevTask, status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {selectedTask.subtasks.length > 0
                ? `${selectedTask.subtasks.filter(s => s.completed).length}/${selectedTask.subtasks.length} subtasks completed`
                : 'No subtasks'}
            </div>
            {selectedTask.subtasks.length > 0 && (
              <ul className="mt-2 pl-4 list-disc">
                {selectedTask.subtasks.map(subtask => (
                  <li key={subtask.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskToggle(selectedTask._id, subtask.id)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) => handleUpdateSubtask(selectedTask._id, subtask.id, { ...subtask, title: e.target.value })}
                      className="flex-1 p-1 border rounded"
                    />
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => {
                const subtaskTitle = prompt('Enter subtask title:');
                if (subtaskTitle) handleAddSubtask(selectedTask._id, subtaskTitle);
              }}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Subtask
            </button>
          </div>
        )}
      </div>
      {showForm && (
        <TaskForm
          onTaskAdded={handleTaskAdded}
          initialTask={selectedTask}
        />
      )}
      {!showForm && !selectedTask && (
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