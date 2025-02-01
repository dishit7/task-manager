import { create } from 'zustand';
import { Task } from '@/types';

interface TaskStore {
  selectedTask: Task | null;
  sortBy: 'dueDate' | 'priority' | 'title' | 'created';
  sortDirection: 'asc' | 'desc';
  
  // Actions
  setSelectedTask: (task: Task | null) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'title' | 'created') => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTask: null,
  sortBy: 'dueDate',
  sortDirection: 'asc',
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortDirection: (direction) => set({ sortDirection }),
}));