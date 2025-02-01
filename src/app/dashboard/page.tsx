// app/dashboard/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectStore } from "@/stores/projectStore";
import { useModalStore } from "@/stores/modalStore";
import { PlusIcon } from "lucide-react";

export default function DashboardPage() {
  const { projects } = useProjectStore();
  const { openProjectCreateModal } = useModalStore();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={openProjectCreateModal}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyDashboardState />
      ) : (
        <DashboardContent projects={projects} />
      )}
    </div>
  );
}

function EmptyDashboardState() {
  const { openProjectCreateModal } = useModalStore();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <img 
        src="/empty-dashboard.svg" 
        alt="No projects" 
        className="mb-6 w-64 h-64"
      />
      <h2 className="text-xl font-semibold mb-4">
        No Projects Yet
      </h2>
      <p className="text-gray-600 mb-6">
        Get started by creating your first project
      </p>
      <Button onClick={openProjectCreateModal}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create First Project
      </Button>
    </div>
  );
}

function DashboardContent({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span>Tasks</span>
              {/* Add task count or quick stats */}
              <span>0/5</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}