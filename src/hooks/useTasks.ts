// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/api';

export function useTasks(projectId?: number) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['tasks', projectId] : ['tasks'], // Use projectId in the query key if provided
    queryFn: () => {
      if (projectId) {
        return taskService.getByProject(projectId); // Fetch tasks for a specific project
      } else {
          console.log(`calling all tasks`)
        return taskService.getAll(); // Fetch all tasks for the user
      }
    },
  });

  const createTask = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      taskService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask,
    updateTask,
    deleteTask,
  };
}