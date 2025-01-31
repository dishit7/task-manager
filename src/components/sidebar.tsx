'use client'
import { useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, LayoutDashboard, Calendar1 } from "lucide-react";

const projects = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
];

export default function Sidebar() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 border-r border-gray-700">
      {/* Dashboard Link */}
      <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold mb-4">
        <LayoutDashboard className="w-5 h-5" /> Dashboard
      </Link>

      {/* Create Project Button */}
      <Button className="w-full mb-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
        <Plus className="w-4 h-4" /> Create Project
      </Button>

      {/* Project List */}
      <div className="flex-1 overflow-auto">
        <h3 className="text-sm uppercase text-gray-400 mb-2">Projects</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <button
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md hover:bg-gray-800",
                  selectedProject === project.id ? "bg-gray-700" : ""
                )}
                onClick={() => setSelectedProject(project.id)}
              >
                {project.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Widget */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <h3 className="text-sm uppercase text-gray-400 mb-2">Calendar<Calendar1/></h3>
          </div>
    </aside>
  );
}
