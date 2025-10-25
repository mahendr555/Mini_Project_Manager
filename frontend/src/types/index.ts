export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
  projectId: number;
}

export interface CreateProject {
  title: string;
  description?: string;
}

export interface CreateTask {
  title: string;
  dueDate?: string;
}

export interface UpdateTask {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface ScheduleRequest {
  tasks: TaskScheduleItem[];
}

export interface TaskScheduleItem {
  taskId: number;
  title: string;
  dueDate?: string;
  priority: number;
}

export interface ScheduleResponse {
  schedule: ScheduledTask[];
  message: string;
}

export interface ScheduledTask {
  taskId: number;
  title: string;
  suggestedStartDate: string;
  suggestedEndDate: string;
  reason: string;
}
