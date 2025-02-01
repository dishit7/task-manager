// app/projects/[projectId]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTaskStore } from '@/stores/taskStore';
import { useModalStore } from '@/stores/modalStore';

// Components we'll create below
import {TaskList} from '@/components/TaskList';
import {CreateTaskModal} from '@/components/CreateTaskModal';
 import { Button } from '@/components/ui/button'; // Assuming you have this
import { EditTaskModal } from '@/components/EditTaskModal';

export default function ProjectPage() {
  const { projectId } = useParams();
  const { tasks, loading, fetchTasksByProject } = useTaskStore();
  const { openTaskCreateModal, isTaskCreateModalOpen, isTaskEditModalOpen } = useModalStore();

  useEffect(() => {
    if (projectId) {
      fetchTasksByProject(Number(projectId));
    }
  }, [projectId, fetchTasksByProject]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Project Tasks</h1>
        <Button 
          onClick={() => openTaskCreateModal(projectId as string)}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          Add New Task
        </Button>
      </div>

      <TaskList tasks={tasks} />
      
          {isTaskCreateModalOpen && <CreateTaskModal />}
          
      {isTaskCreateModalOpen && <CreateTaskModal />}
      {isTaskEditModalOpen && <EditTaskModal />}

     </div>
  );
}

