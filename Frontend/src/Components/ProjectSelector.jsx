import React, { useState, useEffect } from 'react';
//import api from '../service/api';

const ProjectSelector = ({ userId, onProjectSelect, currentProject }) => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    /*const fetchProjects = async () => {
      try {
        const response = await api.get(`/projects?userId=${userId}`);
        setProjects(response.data);
        if (!currentProject && response.data.length > 0) {
          onProjectSelect(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();*/
  }, [userId, currentProject, onProjectSelect]);

  const handleCreateProject = async (e) => {
   /*e.preventDefault();
    try {
      const response = await api.post('/projects', { name: newProjectName, owner: userId });
      setProjects([...projects, response.data]);
      setNewProjectName('');
      onProjectSelect(response.data);
    } catch (error) {
      console.error('Error creating project:', error);
    }*/
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Select or Create Project</h2>
      <form onSubmit={handleCreateProject} className="space-y-4 mb-4">
        <div>
          <label className="block text-gray-700">New Project Name</label>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Project
        </button>
      </form>
      <div>
        <label className="block text-gray-700">Select Project</label>
        <select
          value={currentProject?._id || ''}
          onChange={(e) => {
            const project = projects.find((p) => p._id === e.target.value);
            onProjectSelect(project);
          }}
          className="w-full p-2 border rounded"
        >
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectSelector;