import { create } from 'zustand';
import axios from 'axios';

interface Project {
  id: number; // Changed to match Drizzle schema
  name: string;
  description?: string;
  createdAt: Date;
  userId: string;
}

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Async Actions with API Integration
  fetchProjects: (userId: string) => Promise<void>;
  createProject: (projectData: Partial<Project>) => Promise<void>;
  updateProject: (projectId: number, updateData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  selectProject: (projectId: number) => void;
  clearSelectedProject: () => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  
  fetchProjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/projects?userId=${userId}`);
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch projects', 
        loading: false 
      });
    }
  },
  
  createProject: async (projectData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/projects', projectData);
      set((state) => ({
        projects: [...state.projects, response.data],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project', 
        loading: false 
      });
    }
  },
  
  updateProject: async (projectId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/projects/${projectId}`, updateData);
      set((state) => ({
        projects: state.projects.map(project => 
          project.id === projectId ? response.data : project
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update project', 
        loading: false 
      });
    }
  },
  
  deleteProject: async (projectId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter(project => project.id !== projectId),
        selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete project', 
        loading: false 
      });
    }
  },
  
  selectProject: (projectId) => set((state) => ({
    selectedProject: state.projects.find(project => project.id === projectId) || null
  })),
  
  clearSelectedProject: () => set({ selectedProject: null })
}));