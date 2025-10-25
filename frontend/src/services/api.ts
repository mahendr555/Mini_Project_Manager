import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

// Types defined inline to avoid import issues
interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

interface CreateProject {
  title: string;
  description?: string;
}

interface CreateTask {
  title: string;
  dueDate?: string;
}

interface UpdateTask {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

interface ScheduleRequest {
  tasks: TaskScheduleItem[];
}

interface TaskScheduleItem {
  taskId: number;
  title: string;
  dueDate?: string;
  priority: number;
}

interface ScheduleResponse {
  schedule: ScheduledTask[];
  message: string;
}

interface ScheduledTask {
  taskId: number;
  title: string;
  suggestedStartDate: string;
  suggestedEndDate: string;
  reason: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (username: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, email, password }),
  
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
};

export const projectApi = {
  getProjects: () => api.get<Project[]>('/projects'),
  createProject: (project: CreateProject) => api.post<Project>('/projects', project),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),
};

export const taskApi = {
  getTasks: (projectId: number) => api.get<Task[]>(`/projects/${projectId}/tasks`),
  createTask: (projectId: number, task: CreateTask) => api.post<Task>(`/projects/${projectId}/tasks`, task),
  updateTask: (projectId: number, taskId: number, task: UpdateTask) => api.put<Task>(`/projects/${projectId}/tasks/${taskId}`, task),
  deleteTask: (projectId: number, taskId: number) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
  scheduleTasks: (projectId: number, request: ScheduleRequest) => api.post<ScheduleResponse>(`/projects/${projectId}/schedule`, request),
};

// Export types for use in components
export type { AuthResponse, Project, Task, CreateProject, CreateTask, UpdateTask, ScheduleRequest, ScheduleResponse, ScheduledTask };
