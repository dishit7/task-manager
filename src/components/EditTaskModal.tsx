// components/EditTaskModal.tsx
import { useState, useEffect } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { useModalStore } from '@/stores/modalStore';

export function EditTaskModal() {
  const { updateTask,fetchTasksByProject } = useTaskStore();
  const { closeTaskEditModal, selectedTaskToEdit } = useModalStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    dueDate: '',
    completed: false
  });
useEffect(() => {
  if (!selectedTaskToEdit) return;

  setFormData({
    title: selectedTaskToEdit.title || '',
    description: selectedTaskToEdit.description || '',
    priority: selectedTaskToEdit.priority || 'Medium',
    dueDate: selectedTaskToEdit.dueDate
      ? new Date(selectedTaskToEdit.dueDate).toISOString().split('T')[0]
      : '',
    completed: selectedTaskToEdit.completed || false,
  });
}, [selectedTaskToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToEdit) return;

    await updateTask(Number(selectedTaskToEdit.id), {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
    });
      
      if (selectedTaskToEdit.projectId) {
                   await fetchTasksByProject(selectedTaskToEdit.projectId);

       
       }
 
    closeTaskEditModal();
  };

  if (!selectedTaskToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Task</h2>
          <button
            onClick={closeTaskEditModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
              id="completed"
            />
            <label htmlFor="completed" className="text-sm font-medium">
              Mark as completed
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={closeTaskEditModal}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
