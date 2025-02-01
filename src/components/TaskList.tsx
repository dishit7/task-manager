import { Task } from '@/types';
import { useModalStore } from '@/stores/modalStore';
import { useTasks } from '@/hooks/useTasks';
import { useTaskStore } from '@/stores/taskStore';
import { useMemo } from 'react';

export function TaskList({ projectId }: { projectId: string }) {
  const { openEditTask } = useModalStore(); // Corrected method name
  const { sortBy, sortDirection } = useTaskStore();
  const { tasks, isLoading, updateTask, deleteTask } = useTasks(parseInt(projectId));

  const sortedTasks = useMemo(() => {
    if (!tasks) return [];
    
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate || !b.dueDate) return 0;
          return sortDirection === 'asc' 
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priority':
          const priorityMap = { Low: 1, Medium: 2, High: 3 };
          return sortDirection === 'asc'
            ? priorityMap[a.priority] - priorityMap[b.priority]
            : priorityMap[b.priority] - priorityMap[a.priority];
        case 'title':
          return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [tasks, sortBy, sortDirection]);

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (!sortedTasks.length) {
    return <div className="text-center py-8">No tasks found</div>;
  }

  const handleUpdateTask = async (taskId: number, data: Partial<Task>) => {
    try {
      await updateTask.mutateAsync({ id: taskId, data });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };
  
  return (
    <div className="grid gap-4">
      {sortedTasks.map((task) => (
        <div 
          key={task.id}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleUpdateTask(task.id, { completed: !task.completed })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-sm rounded ${
                task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {task.priority}
              </span>
              <button
                onClick={() => openEditTask(task)} // Corrected method name
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">{task.description}</p>
          )}
          
          {task.dueDate && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}