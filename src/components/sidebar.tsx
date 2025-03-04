"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, LayoutDashboardIcon, FolderIcon, SunIcon, MoonIcon } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";
import { getUserId } from "@/lib/auth/authUtils";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useTheme } from "next-themes";
import { Project } from "@/types/types";

export function Sidebar() {
  const { openCreateProject } = useModalStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
 const { projects, isLoading } = useProjects(userId || ''); // Pass userId to useProjects
  const { theme, setTheme } = useTheme(); // Theme toggle logic


  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    if (!id) {
      router.push("/signin");
    }
  }, [router]);

  if (isLoading) {
    return <div className="w-64 p-4 border-r h-screen bg-sidebar dark:bg-sidebar-dark">Loading projects...</div>;
  }

  return (
    <aside className="w-64 p-4 border-r h-screen flex flex-col bg-sidebar dark:bg-sidebar-dark">
      <div className="mb-6">
        {/* Dashboard Link */}
        <Link 
          href="/dashboard" 
          className="flex items-center mb-4 hover:bg-sidebarHover dark:hover:bg-sidebarHover-dark p-2 rounded"
        >
          <LayoutDashboardIcon className="mr-2" />
          Dashboard
        </Link>

        {/* Projects Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-200">Projects</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openCreateProject}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Project List */}
          {projects.map((project:Project) => (
            <Link 
              key={project.id} 
              href={`/project/${project.id}`}
              className="flex items-center mb-2 hover:bg-sidebarHover dark:hover:bg-sidebarHover-dark p-2 rounded"
            >
              <FolderIcon className="mr-2 h-4 w-4" />
              {project.name}
            </Link>
          ))}
        </div>
          </div>
        
      {/* Theme Toggle Button */}
      <div className="mt-auto flex flex-col items-center">
        <Button 
          variant="outline" 
          size="lg"  
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-center p-4 rounded-lg bg-sidebarHover dark:bg-sidebarHover-dark hover:bg-sidebarHover dark:hover:bg-sidebarHover-dark focus:outline-none border border-gray-300 dark:border-gray-600 my-7"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
          <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-200">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </Button>
      </div>

    </aside>
  );
}