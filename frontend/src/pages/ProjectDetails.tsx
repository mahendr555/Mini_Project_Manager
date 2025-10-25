import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  taskApi,
  type Task,
  type CreateTask,
  type UpdateTask,
  type ScheduleRequest,
  type ScheduleResponse
} from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<CreateTask>({ title: '', dueDate: '' });
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getTasks(Number(projectId));
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await taskApi.createTask(Number(projectId), newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', dueDate: '' });
      setShowCreateForm(false);
    } catch {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const updateData: UpdateTask = {
        title: editingTask.title,
        dueDate: editingTask.dueDate,
        isCompleted: editingTask.isCompleted
      };
      const response = await taskApi.updateTask(Number(projectId), editingTask.id, updateData);
      setTasks(tasks.map(t => (t.id === editingTask.id ? response.data : t)));
      setEditingTask(null);
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.deleteTask(Number(projectId), taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updateData: UpdateTask = {
        title: task.title,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted
      };
      const response = await taskApi.updateTask(Number(projectId), task.id, updateData);
      setTasks(tasks.map(t => (t.id === task.id ? response.data : t)));
    } catch {
      setError('Failed to update task');
    }
  };

  const handleScheduleTasks = async () => {
    try {
      const request: ScheduleRequest = {
        tasks: tasks.map(task => ({
          taskId: task.id,
          title: task.title,
          dueDate: task.dueDate,
          priority: task.dueDate ? 3 : 1
        }))
      };
      const response = await taskApi.scheduleTasks(Number(projectId), request);
      setSchedule(response.data);
    } catch {
      setError('Failed to generate schedule');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar username={username || undefined} />
      <div className="min-h-screen">
        <div className="container p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-purple"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold">Project Tasks</h1>
            </div>

            <div className="flex gap-2">
              <button onClick={handleScheduleTasks} className="btn btn-purple">
                Auto Task Scheduler
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-blue"
              >
                + Add Task
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {schedule && (
            <div className="schedule-container mb-6">
              <h3 className="font-bold mb-2">🎯 Generated Schedule:</h3>
              <p className="mb-2">{schedule.message}</p>
              <div className="space-y-2">
                {schedule.schedule.map(item => (
                  <div key={item.taskId} className="schedule-item">
                    <strong>📋 {item.title}</strong>
                    <br />
                    <small>
                      📅 {new Date(item.suggestedStartDate).toLocaleDateString()} -{' '}
                      {new Date(item.suggestedEndDate).toLocaleDateString()}
                      <br />
                      💡 {item.reason}
                    </small>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSchedule(null)}
                className="btn btn-red"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '9999px'
                }}
              >
                ✕ Close
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Create New Task</h2>
              <form onSubmit={handleCreateTask}>
                <div className="mb-4">
                  <label className="form-label">Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-green">
                    ✨ Create Task
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

          {editingTask && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <form onSubmit={handleUpdateTask}>
                <div className="mb-4">
                  <label className="form-label">Task Title *</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ''}
                    onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingTask.isCompleted}
                      onChange={e =>
                        setEditingTask({ ...editingTask, isCompleted: e.target.checked })
                      }
                      className="form-checkbox"
                    />
                    Completed
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-green">
                    💾 Update Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="btn btn-gray"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`task-item ${task.isCompleted ? 'task-completed' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        task.isCompleted ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {task.isCompleted ? '✅' : '📋'} {task.title}
                    </h3>
                    {task.dueDate && (
                      <p className="text-sm text-gray-600">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`btn ${task.isCompleted ? 'btn-yellow' : 'btn-green'}`}
                    >
                      {task.isCompleted ? '↩️' : '✅'}
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="btn btn-blue"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-red"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
