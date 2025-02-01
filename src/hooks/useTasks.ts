// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import { Task } from '@/types/types';
import { getUserId } from '@/lib/auth/authUtils';

export function useTasks(projectId?: number) {
  const queryClient = useQueryClient();
  const userId = getUserId();

  const tasksQuery = useQuery({
    queryKey: projectId ? ['tasks', projectId, userId] : ['tasks', userId],
    queryFn: () => {
      if (projectId) {
        return taskService.getByProject(projectId, String(userId));
      } else {
        return taskService.getAll(String(userId));
      }
    },
    enabled: !!userId, // Only run the query if we have a userId
  });

  const createTask = useMutation({
    mutationFn: (taskData: Partial<Task>) => 
      taskService.create({ ...taskData, userId: String(userId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId, userId] });
      }
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) =>
      taskService.update(id, { ...data, userId: String(userId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId, userId] });
      }
    },
  });

  const deleteTask = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId, userId] });
      }
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