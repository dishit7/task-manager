"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useModalStore } from "@/stores/modalStore";
import { useTasks } from "@/hooks/useTasks";

export function CreateTaskModal() {
  const { projectId } = useParams();
  const { closeCreateTask } = useModalStore();
  const { createTask } = useTasks(Number(projectId)); // Use TanStack Query hook

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTask.mutateAsync({
        ...formData,
        projectId: Number(projectId),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      });
      closeCreateTask();

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      // Optionally add error handling UI (e.g., toast notifications)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as "Low" | "Medium" | "High" })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeCreateTask}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200"
              disabled={createTask.isPending} // Disable button during mutation
            >
              {createTask.isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}