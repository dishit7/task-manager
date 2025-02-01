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
import { useProjects } from "@/hooks/useProjects";
import { getUserId } from "@/lib/auth/authUtils";

export function ProjectModal() {
  const { 
    isCreateProjectOpen, 
    isEditProjectOpen,
    selectedProject,
    closeCreateProject,
    closeEditProject 
  } = useModalStore();

  const { createProject, updateProject } = useProjects(); // Use TanStack Query hooks

  const [projectName, setProjectName] = useState(
    selectedProject?.name || ""
  );
  const [projectDescription, setProjectDescription] = useState(
    selectedProject?.description || ""
  );

  const userId = getUserId();
  if (!userId) {
    console.error("User ID is required");
    return; // Stop execution if userId is null
  }
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      name: projectName,
      description: projectDescription,
      userId: userId // Replace with actual user ID
    };

    try {
      if (selectedProject) {
        // Update project
        await updateProject.mutateAsync({ id: String(selectedProject.id), data: projectData });
        closeEditProject();
      } else {
        // Create project
        await createProject.mutateAsync(projectData);
        closeCreateProject();
      }

      // Reset form
      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Error saving project:", error);
      // Optionally add error handling UI (e.g., toast notifications)
    }
  };

  const isOpen = isCreateProjectOpen || isEditProjectOpen;
  const onOpenChange = isEditProjectOpen 
    ? closeEditProject 
    : closeCreateProject;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedProject ? "Edit Project" : "Create Project"}
          </DialogTitle>
          <DialogDescription>
            {selectedProject 
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={createProject.isPending || updateProject.isPending} // Disable button during mutation
          >
            {selectedProject 
              ? (updateProject.isPending ? "Updating..." : "Update Project") 
              : (createProject.isPending ? "Creating..." : "Create Project")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}