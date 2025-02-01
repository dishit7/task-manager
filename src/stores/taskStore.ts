import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios'; // For API calls

interface Task {
  id: number; // Changed to match Drizzle schema
  projectId: number; // Changed to match Drizzle schema
  title: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Async Actions with API Integration
  fetchTasksByProject: (projectId: number) => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<void>;
  updateTask: (taskId: number, updateData: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  
  fetchTasksByProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/tasks?projectId=${projectId}`);
      set({ tasks: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks', 
        loading: false 
      });
    }
  },
  
  createTask: async (taskData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/tasks', taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create task', 
        loading: false 
      });
    }
  },
  
  // stores/taskStore.ts - Update the updateTask function

updateTask: async (taskId: number, updateData: Partial<Task>) => {
  set({ loading: true, error: null });
  try {
    const response = await axios.put(`/api/tasks/${taskId}`, updateData);
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === taskId ? { ...task, ...response.data } : task
      ),
      loading: false
    }));
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Failed to update task', 
      loading: false 
    });
  }
},
  
  deleteTask: async (taskId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete task', 
        loading: false 
      });
    }
  }
}));