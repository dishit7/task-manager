import { Task } from '@/types';
import { useModalStore } from '@/stores/modalStore';
import { useTaskStore } from '@/stores/taskStore';

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { openTaskEditModal } = useModalStore();
  const { deleteTask, updateTask } = useTaskStore(); // Import updateTask
  
  if (!tasks || tasks.length === 0) {
    return <div className="text-center py-8">No tasks found</div>;
  }
  
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => updateTask(task.id, { completed: !task.completed })} // Toggle completed
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
                onClick={() => openTaskEditModal(task)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
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
