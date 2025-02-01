import { create } from 'zustand'; // Zustand for state management
import { immer } from 'zustand/middleware/immer'; // Optional for immutability

// Define the Project and Task interfaces

interface Project {
  id: string;
  name: string;
  // Add other properties as per your project structure
}

interface Task {
  id: string;
  name: string;
  projectId: string; // Add other properties as needed
}


interface ModalStore {
  // Project Modals
  isProjectCreateModalOpen: boolean;
  isProjectEditModalOpen: boolean;
  
  // Task Modals
  isTaskCreateModalOpen: boolean;
  isTaskEditModalOpen: boolean;
  
  // Selected Item for Edit Modals
  selectedProjectToEdit: Project | null;
  selectedTaskToEdit: Task | null;
  
  // Modal Control Actions
  openProjectCreateModal: () => void;
  closeProjectCreateModal: () => void;
  
  openProjectEditModal: (project: Project) => void;
  closeProjectEditModal: () => void;
  
  openTaskCreateModal: (projectId?: string) => void;
  closeTaskCreateModal: () => void;
  
  openTaskEditModal: (task: Task) => void;
  closeTaskEditModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Project Modal States
  isProjectCreateModalOpen: false,
  isProjectEditModalOpen: false,
  selectedProjectToEdit: null,
  
  // Task Modal States
  isTaskCreateModalOpen: false,
  isTaskEditModalOpen: false,
  selectedTaskToEdit: null,
  
  // Project Modal Actions
  openProjectCreateModal: () => set({ 
    isProjectCreateModalOpen: true 
  }),
  closeProjectCreateModal: () => set({ 
    isProjectCreateModalOpen: false 
  }),
  
  openProjectEditModal: (project) => set({ 
    isProjectEditModalOpen: true,
    selectedProjectToEdit: project 
  }),
  closeProjectEditModal: () => set({ 
    isProjectEditModalOpen: false,
    selectedProjectToEdit: null 
  }),
  
  // Task Modal Actions
  openTaskCreateModal: (projectId) => set({ 
    isTaskCreateModalOpen: true,
    // Optionally set a default project context
    selectedProjectToEdit: projectId 
      ? { id: projectId } as Project 
      : null
  }),
  closeTaskCreateModal: () => set({ 
    isTaskCreateModalOpen: false 
  }),
  
  openTaskEditModal: (task) => set({ 
    isTaskEditModalOpen: true,
    selectedTaskToEdit: task 
  }),
  closeTaskEditModal: () => set({ 
    isTaskEditModalOpen: false,
    selectedTaskToEdit: null 
  }),
}));