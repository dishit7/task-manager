"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/modalStore";
import { useProjectStore } from "@/stores/projectStore";
import { getUserId } from "@/lib/auth/authUtils";

export function ProjectModal() {
  const { 
    isProjectCreateModalOpen, 
    isProjectEditModalOpen,
    selectedProjectToEdit,
    closeProjectCreateModal,
    closeProjectEditModal 
  } = useModalStore();

  const { createProject, updateProject } = useProjectStore(); // Changed method name
  
  const [projectName, setProjectName] = useState(
    selectedProjectToEdit?.name || ""
  );
  const [projectDescription, setProjectDescription] = useState(
    selectedProjectToEdit?.description || ""
    );
    
    
  const userId = getUserId();
  console.log(`userid is ${userId}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      name: projectName,
      description: projectDescription,
      userId: userId // Replace with actual user ID
    };

    try {
      if (selectedProjectToEdit) {
        await updateProject(selectedProjectToEdit.id, projectData);
        closeProjectEditModal();
      } else {
        await createProject(projectData); // Changed method name
        closeProjectCreateModal();
      }

      // Reset form
      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Error saving project:", error);
      // Optionally add error handling UI
    }
  };

  const isOpen = isProjectCreateModalOpen || isProjectEditModalOpen;
  const onOpenChange = isProjectEditModalOpen 
    ? closeProjectEditModal 
    : closeProjectCreateModal;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedProjectToEdit ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {selectedProjectToEdit 
              ? "Update your project details" 
              : "Create a new project to organize your tasks"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Project Name" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <Input 
            placeholder="Project Description (Optional)" 
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <Button type="submit" className="w-full">
            {selectedProjectToEdit ? "Update Project" : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}