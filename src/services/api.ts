// services/api.ts
import axios from 'axios';
import { Task, Project } from '@/types/types';

export const taskService = {
  create: async (taskData: Partial<Task>) => {
    const { data } = await axios.post<Task>('/api/tasks', taskData);
    return data;
  },

  getAll: async (userId: string) => {
    const response = await fetch(`/api/tasks?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  getByProject: async (projectId: number, userId: string) => {
    const response = await fetch(`/api/tasks?projectId=${projectId}&userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch project tasks');
    }
    return response.json();
  },
  
  update: async (taskId: number, updateData: Partial<Task>) => {
    const { data } = await axios.put<Task>(`/api/tasks/${taskId}`, updateData);
    return data;
  },
  
  delete: async (taskId: number) => {
    await axios.delete(`/api/tasks/${taskId}`);
    return taskId;
  }
};
// services/api.ts
export const projectService = {
  getAll: async (userId: string) => {
    const response = await fetch(`/api/projects?userId=${userId}`); // Pass userId as a query parameter
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return response.json();
  },
  create: async (data: Project) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return response.json();
  },
  update: async (id: string, data: Partial<Project>) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    return response.json();
  },
};