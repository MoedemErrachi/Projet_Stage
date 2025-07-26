import React, { useState, useEffect, useRef } from 'react';

const CompletedTaskList = ({ tasks, onUncomplete, onModify, onDelete, selectedCompletedTask, setSelectedCompletedTask, setTasks, className }) => {
  const [showMenu, setShowMenu] = useState(null);
  const menuRef = useRef(null);

  const handleTaskClick = (task) => {
    if (selectedCompletedTask?._id === task._id) {
      setSelectedCompletedTask(null); // Close panel if same task is clicked again
    } else {
      onModify(task._id); // Open new task panel
    }
  };

  const handleMenuClick = (e, taskId) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the task's onClick from firing
    setShowMenu(showMenu === taskId ? null : taskId);
  };

  const handleMenuOption = (taskId, action) => {
    setShowMenu(null);
    if (action === 'uncomplete') onUncomplete(taskId);
    else if (action === 'modify') onModify(taskId);
    else if (action === 'delete') onDelete(taskId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex-1 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">Completed Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{task.title}</span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => handleMenuClick(e, task._id)}
                  className="focus:outline-none"
                >
                  ⋮
                </button>
                {showMenu === task._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => handleMenuOption(task._id, 'modify')}
                      className="block w-full text-left p-2 hover:bg-gray-100"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleMenuOption(task._id, 'uncomplete')}
                      className="block w-full text-left p-2 hover:bg-gray-100"
                    >
                      Uncomplete
                    </button>
                    <button
                      onClick={() => handleMenuOption(task._id, 'delete')}
                      className="block w-full text-left p-2 hover:bg-gray-100 text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {task.subtasks.length > 0
                ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} subtasks completed`
                : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedTaskList;