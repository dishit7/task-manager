"use client";

import { useModalStore } from "@/stores/modalStore";
import { ProjectModal } from "@/components/modals/CreateProjectModal";
 import { CreateTaskModal } from "@/components/modals/CreateTaskModal";
import { EditTaskModal } from "@/components/modals/EditTaskModal";

export function ModalProvider() {
  const {
    isCreateProjectOpen,
    isEditProjectOpen,
    isCreateTaskOpen,
    isEditTaskOpen,
    selectedProject,
    selectedTask,
  } = useModalStore();

  return (
    <>
      {isCreateProjectOpen && <ProjectModal />}
       {isCreateTaskOpen && <CreateTaskModal />}
      {isEditTaskOpen && selectedTask && <EditTaskModal task={selectedTask} />}
    </>
  );
}
