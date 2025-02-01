// stores/modalStore.ts
import { create } from 'zustand';
import { Task, Project } from '@/types/types';

interface ModalStore {
  // Modal visibility states
  isCreateProjectOpen: boolean;
  isEditProjectOpen: boolean;
  isCreateTaskOpen: boolean;
  isEditTaskOpen: boolean;
  
  // Data for edit modals
  selectedTask: Task | null;
  selectedProject: Project | null;
  
  // Open actions
  openCreateProject: () => void;
  openEditProject: (project: Project) => void;
  openCreateTask: () => void;
  openEditTask: (task: Task) => void;
  
  // Close actions
  closeCreateProject: () => void;
  closeEditProject: () => void;
  closeCreateTask: () => void;
  closeEditTask: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Initial states
  isCreateProjectOpen: false,
  isEditProjectOpen: false,
  isCreateTaskOpen: false,
  isEditTaskOpen: false,
  selectedTask: null,
  selectedProject: null,
  
  // Open actions
  openCreateProject: () => set({ isCreateProjectOpen: true }),
  openEditProject: (project) => set({ 
    isEditProjectOpen: true,
    selectedProject: project
  }),
 openCreateTask: () => {
  console.log("Opening Create Task Modal"); // Debugging
  set({ isCreateTaskOpen: true });
},
  openEditTask: (task) => {
    console.log("opening edit odal")
    set({
      isEditTaskOpen: true,
      selectedTask: task
    })
},
  
  // Close actions
  closeCreateProject: () => set({ isCreateProjectOpen: false }),
  closeEditProject: () => set({ 
    isEditProjectOpen: false,
    selectedProject: null
  }),
  closeCreateTask: () => set({ isCreateTaskOpen: false }),
  closeEditTask: () => set({
    isEditTaskOpen: false,
    selectedTask: null
  })
}));