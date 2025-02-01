// app/projects/[projectId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useProjects } from '@/hooks/useProjects';
import { TaskList } from '@/components/TaskList';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';
import { getUserId } from '@/lib/auth/authUtils';
import { useEffect, useState } from 'react';
import { Project } from '@/types/types';

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [userId, setUserId] = useState<string | null>(null);
  const { projects, isLoading: projectsLoading } = useProjects(userId || ''); // Pass userId to useProjects
  const { openCreateTask } = useModalStore();
  const { sortBy, sortDirection, setSortBy, setSortDirection } = useTaskStore();

  useEffect(() => {
    const id = getUserId();
    setUserId(id);
  }, []);

  console.log(`prijects are ${JSON.stringify(projects)}`)
 
  const project = projects?.find((p:Project) => p.id == projectId);

  if (projectsLoading) {
    return <div className="p-4">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-4">Project not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>
          )}
        </div>
        <button
          onClick={() => openCreateTask()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="p-2 border rounded"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="p-2 border rounded"
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      <TaskList projectId={projectId} />
    </div>
  );
}