import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectApi, type Project, type CreateProject } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState<CreateProject>({ title: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    fetchProjects();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await projectApi.getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await projectApi.createProject(newProject);
      setProjects([...projects, response.data]);
      setNewProject({ title: '', description: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectApi.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar username={username || undefined} />
      <div className="min-h-screen">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-blue"
            >
              + Create Project
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showCreateForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject}>
                <div className="mb-4">
                  <label className="form-label">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="form-input"
                    minLength={3}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="form-textarea"
                    maxLength={500}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-green"
                  >
                    ✨ Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-gray"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3 className="text-xl mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-600 mb-4">{project.description}</p>
                )}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span>📋 {project.tasks.length} tasks</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="btn btn-blue flex-1"
                  >
                    View Project
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="btn btn-red"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects yet. Create your first project!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
