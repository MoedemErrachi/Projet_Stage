import React from 'react';

const TaskList = ({ tasks, onDelete, onStatusUpdate, onModify, onAddSubtask, onSubtaskToggle, selectedTask, setSelectedTask }) => {
  const handleTaskClick = (task) => {
    if (selectedTask?._id === task._id) {
      // If re-clicking the same task, save changes and close
      setSelectedTask(null);
    } else {
      // Select new task for editing
      setSelectedTask(task);
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer"
            onClick={() => handleTaskClick(task)}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{task.title}</span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusUpdate(task._id); }}
                  className={`w-6 h-6 rounded-full ${task.status === 'completed' ? 'bg-gray-400' : 'bg-green-500'} text-white flex items-center justify-center`}
                >
                  ✓
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onModify(task._id); }}
                  className="w-6 h-6 text-gray-600 hover:text-gray-800"
                >
                  ⋮
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {task.subtasks.length > 0
                ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} subtasks completed`
                : 'No subtasks'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;