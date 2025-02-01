// stores/projectStore.ts
import { create } from 'zustand';
import { Project } from '@/types';

interface ProjectStore {
  selectedProjectId: string | null;
  viewMode: 'list' | 'board' | 'calendar';
  filterStatus: 'all' | 'active' | 'completed';
  searchQuery: string;
  
  // Actions
  setSelectedProject: (projectId: string | null) => void;
  setViewMode: (mode: 'list' | 'board' | 'calendar') => void;
  setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
  setSearchQuery: (query: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  selectedProjectId: null,
  viewMode: 'list',
  filterStatus: 'all',
  searchQuery: '',
  
  setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
