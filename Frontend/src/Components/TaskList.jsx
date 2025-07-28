import React, { useState, useEffect, useRef } from 'react';

const TaskList = ({ tasks, onDelete, onStatusUpdate, onModify, selectedTask, setSelectedTask, className, showForm, setShowForm }) => {
  const [showMenu, setShowMenu] = useState(null);
  const menuRefs = useRef(new Map());

  const handleTaskClick = (task) => {
    if (selectedTask?.id === task.id) {
      setSelectedTask(null); // Close panel if same task is clicked again
    } else {
      onModify(task.id); // Open new task panel
    }
  };

  const handleMenuClick = (e, taskId) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent the task's onClick from firing
    setShowMenu(showMenu === taskId ? null : taskId);
  };

  const handleMenuOption = (taskId, action) => {
    setShowMenu(null);
    if (action === 'delete') onDelete(taskId);
    else if (action === 'complete') {
      onStatusUpdate(taskId); // Update status without opening panel
      console.log(taskId);
    } else if (action === 'modify') onModify(taskId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      let clickedInside = false;
      for (const ref of menuRefs.current.values()) {
        if (ref && ref.contains(event.target)) {
          clickedInside = true;
          break;
        }
      }
      if (!clickedInside) {
        setShowMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex-1 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{task.title}</span>
              <div className="relative" ref={(el) => menuRefs.current.set(task.id, el)}>
                <button onClick={(e) => handleMenuClick(e, task.id)} className="focus:outline-none">
                  ⋮
                </button>
                {showMenu === task.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button onClick={() => handleMenuOption(task.id, 'modify')} className="block w-full text-left p-2 hover:bg-gray-100">
                      Modify
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOption(task.id, 'complete');
                      }}
                      className="block w-full text-left p-2 hover:bg-gray-100"
                    >
                      Complete
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOption(task.id, 'delete');
                      }}
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
                ? `${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length} subtasks completed`
                : ''}
            </div>
          </li>
        ))}
      </ul>
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
          Add Task
        </button>
      )}
    </div>
  );
};

export default TaskList;