import React, { useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import CompletedTaskList from './CompletedTaskList';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // For non-completed tasks
  const [selectedCompletedTask, setSelectedCompletedTask] = useState(null); // For completed tasks

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; // Include both completed and non-completed tasks
  });

  const handleDelete = async (taskId) => {
    try {
      await fetch(`http://localhost:8081/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setSelectedTask(null);
      setSelectedCompletedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusUpdate = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      const newStatus = task.status === 'todo' ? 'completed' : 'todo';
      await fetch(`http://localhost:8081/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
      );
      setSelectedTask(null);
      setSelectedCompletedTask(null);
      console.log(selectedTask || selectedCompletedTask);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleModify = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setSelectedTask(null);
    setSelectedCompletedTask(null);
    if (task.status === 'completed') {
      setSelectedCompletedTask(JSON.parse(JSON.stringify(task))); // Open completed task panel
    } else {
      setSelectedTask(JSON.parse(JSON.stringify(task))); // Open non-completed task panel
      console.log(taskId);
    }
  };

  const handleAddSubtask = (taskId, subtaskTitle) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, { id: Date.now().toString(), title: subtaskTitle, completed: false }],
      }));
    }
  };

  const handleTaskAdded = async (newTask) => {
    try {
      const response = await fetch('http://localhost:8081/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const savedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, savedTask]);
      setShowForm(false);
      setSelectedTask(null);
      setSelectedCompletedTask(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSubtaskToggle = (taskId, subtaskId) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        ),
      }));
    } else if (selectedCompletedTask && selectedCompletedTask.id === taskId) {
      setSelectedCompletedTask((prevTask) => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        ),
      }));
    }
  };

  const handleUpdateSubtask = (taskId, subtaskId, updatedSubtask) => {
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prevTask) => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map((sub) => (sub.id === subtaskId ? { ...updatedSubtask } : sub)),
      }));
    } else if (selectedCompletedTask && selectedCompletedTask.id === taskId) {
      setSelectedCompletedTask((prevTask) => ({
        ...prevTask,
        subtasks: prevTask.subtasks.map((sub) => (sub.id === subtaskId ? { ...updatedSubtask } : sub)),
      }));
    }
  };

  const handleSaveChanges = async () => {
    if (selectedTask) {
      try {
        await fetch(`http://localhost:8081/api/tasks/${selectedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedTask),
        });
        console.log('Saving changes - selectedTask:', selectedTask); // Debug log
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...selectedTask } : task
          );
          console.log('Updated tasks:', updatedTasks); // Debug log to verify update
          return [...updatedTasks]; // Ensure new array reference
        });
        setSelectedTask(null);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    }
    if (selectedCompletedTask) {
      try {
        await fetch(`http://localhost:8081/api/tasks/${selectedCompletedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedCompletedTask),
        });
        console.log('Saving changes - selectedCompletedTask:', selectedCompletedTask); // Debug log
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === selectedCompletedTask.id ? { ...selectedCompletedTask } : task
          );
          console.log('Updated tasks:', updatedTasks); // Debug log to verify update
          return [...updatedTasks]; // Ensure new array reference
        });
        setSelectedCompletedTask(null);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    }
  };

  const handleMarkAsCompleted = async() => {
    if (selectedTask) {
      try {
        const task={ ...selectedTask, status: 'completed' }
        console.log(task)
        await fetch(`http://localhost:8081/api/tasks/${selectedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        console.log('Saving changes - selectedTask:', selectedTask); // Debug log
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === selectedTask.id ? { ...selectedTask, status: 'completed'} : task
          );
          console.log('Updated tasks:', updatedTasks); // Debug log to verify update
          return [...updatedTasks]; // Ensure new array reference
        });
        setSelectedTask(null);
      } catch (error) {
        console.error('Error saving task:', error);
      }
    
    }
  };

  const handleMarkAsUncompleted = async() => {
      if (selectedCompletedTask) {
      try {
        const task={ ...selectedCompletedTask, status: 'todo' }
        await fetch(`http://localhost:8081/api/tasks/${selectedCompletedTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
        console.log('Saving changes - selectedCompletedTask:', selectedCompletedTask); // Debug log
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) =>
            task.id === selectedCompletedTask.id ? { ...selectedCompletedTask,status: 'todo' } : task
          );
          console.log('Updated tasks:', updatedTasks); // Debug log to verify update
          return [...updatedTasks]; // Ensure new array reference
        });
        setSelectedCompletedTask(null);
      } catch (error) {
        console.error('Error saving task:', error);
 
    }
  }};

  
  return (
    <div className="flex-1 p-6 ml-64 relative">
      <h2 className="text-3xl font-bold mb-6">My Tasks</h2>
      <div className="mb-6 flex justify-around">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-2 border rounded"
        />
      </div>
      <div className="flex">
       
          <TaskList
            tasks={filteredTasks.filter((task) => task.status !== 'completed')}
            onDelete={handleDelete}
            onStatusUpdate={handleStatusUpdate}
            onModify={handleModify}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            showForm={showForm}
            setShowForm={setShowForm}
            key={tasks.length}
            className="w-1/3 bg-white shadow-md"
          />
       
        {(selectedTask || selectedCompletedTask) && (
          <div className="fixed top-0 right-0 w-1/3 h-screen p-6 bg-white ml-1/3 rounded-l-lg shadow-md z-50 overflow-y-auto" style={{ marginLeft: 'calc(33.33% + 256px)' }}>
            <button onClick={handleSaveChanges} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">Edit Task</h3>
            {selectedTask && (
              <>
                <div className="mb-2">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={selectedTask.title}
                    onChange={(e) => setSelectedTask((prevTask) => ({ ...prevTask, title: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={selectedTask.dueDate || ''}
                    onChange={(e) => setSelectedTask((prevTask) => ({ ...prevTask, dueDate: e.target.value || null }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={selectedTask.description || ''}
                    onChange={(e) => setSelectedTask((prevTask) => ({ ...prevTask, description: e.target.value }))}
                    className="w-full p-2 border rounded"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {selectedTask.subtasks.length > 0
                    ? `${selectedTask.subtasks.filter((s) => s.completed).length}/${selectedTask.subtasks.length} subtasks completed`
                    : ''}
                </div>
                {selectedTask.subtasks.length > 0 && (
                  <ul className="mt-2 pl-4 list-disc">
                    {selectedTask.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleSubtaskToggle(selectedTask.id, subtask.id)}
                          className="mr-2"
                        />
                        <input
                          type="text"
                          value={subtask.title}
                          onChange={(e) =>
                            handleUpdateSubtask(selectedTask.id, subtask.id, { ...subtask, title: e.target.value })
                          }
                          className="flex-1 p-1 border rounded"
                        />
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => {
                    const subtaskTitle = prompt('Enter subtask title:');
                    if (subtaskTitle) handleAddSubtask(selectedTask.id, subtaskTitle);
                  }}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Subtask
                </button>
                <button onClick={handleMarkAsCompleted} className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Mark as Completed
                </button>
              </>
            )}
            {selectedCompletedTask && (
              <>
                <div className="mb-2">
                  <label className="block text-gray-700">Title</label>
                  <input
                    type="text"
                    value={selectedCompletedTask.title}
                    onChange={(e) => setSelectedCompletedTask((prevTask) => ({ ...prevTask, title: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={selectedCompletedTask.dueDate || ''}
                    onChange={(e) =>
                      setSelectedCompletedTask((prevTask) => ({ ...prevTask, dueDate: e.target.value || null }))
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={selectedCompletedTask.description || ''}
                    onChange={(e) =>
                      setSelectedCompletedTask((prevTask) => ({ ...prevTask, description: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter task description"
                  />
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {selectedCompletedTask.subtasks.length > 0
                    ? `${selectedCompletedTask.subtasks.filter((s) => s.completed).length}/${selectedCompletedTask.subtasks.length} subtasks completed`
                    : ''}
                </div>
                {selectedCompletedTask.subtasks.length > 0 && (
                  <ul className="mt-2 pl-4 list-disc">
                    {selectedCompletedTask.subtasks.map((subtask) => (
                      <li key={subtask.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleSubtaskToggle(selectedCompletedTask.id, subtask.id)}
                          className="mr-2"
                          disabled
                        />
                        <span className="flex-1 p-1">{subtask.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={handleMarkAsUncompleted}
                  className="mt-4 w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                >
                  Mark as Uncompleted
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {filteredTasks.some((task) => task.status === 'completed') && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
          <CompletedTaskList
            tasks={filteredTasks.filter((task) => task.status === 'completed')}
            onUncomplete={handleStatusUpdate}
            onModify={handleModify}
            onDelete={handleDelete}
            selectedCompletedTask={selectedCompletedTask}
            setSelectedCompletedTask={setSelectedCompletedTask}
            setTasks={setTasks}
          />
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TaskForm onTaskAdded={handleTaskAdded} initialTask={selectedTask} onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
};

export default MyTasks;