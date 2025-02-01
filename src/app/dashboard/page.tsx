"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task, priorityMap } from "@/types/types";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { tasks, isLoading } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Completed" | "Incomplete">("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter tasks based on search query, priority, and status
  const filteredTasks = tasks.filter((task:Task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesStatus =
      filterStatus === "All" || (filterStatus === "Completed" ? task.completed : !task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate task statistics based on filtered tasks
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((task:Task) => task.completed).length;
  const overdueTasks = filteredTasks.filter(
    (task:Task) => task.dueDate && new Date(task.dueDate) < new Date()
  ).length;

  // Calculate task completion progress
  const completionProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by date for the calendar
  const tasksByDate = tasks.reduce((acc: { [key: string]: Task[] }, task:any) => {
    if (task.dueDate) {
      const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
    }
    return acc;
  }, {});

  // Get tasks for selected date
  const selectedDateTasks = selectedDate
    ? tasksByDate[selectedDate.toISOString().split('T')[0]] || []
    : [];

  const handleDateClick = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Function to get task count for a specific date
  const getTaskCountForDate = (date: Date): number => {
    const dateKey = date.toISOString().split('T')[0];
    return tasksByDate[dateKey]?.length || 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {/* Task Statistics */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalTasks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{completedTasks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overdue Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{overdueTasks}</p>
            </CardContent>
          </Card>
         
        </div>
      )}

      {/* Calendar */}
     {/* Calendar & Progress Cards in a Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Calendar */}
  {!isLoading && (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Task Calendar</CardTitle>
        <CardDescription>Click on a date to view tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateClick}
          modifiers={{
            hasTasks: (date) => getTaskCountForDate(date) > 0,
          }}
          modifiersStyles={{
            hasTasks: {
              fontWeight: "bold",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            },
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )}

  {/* Progress Bar */}
  <Card className="col-span-1">
    <CardHeader>
      <CardTitle>Progress</CardTitle>
    </CardHeader>
    <CardContent>
      <Progress value={completionProgress} className="h-3" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {completionProgress}% completed
      </p>
    </CardContent>
  </Card>
</div>


      {/* Tasks Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Tasks for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task:Task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                 <Badge variant={
  task.priority === "High" ? "destructive" :
  task.priority === "Medium" ? "secondary" : "secondary" // Adjust here
}>
  {task.priority}
</Badge>

                  <Badge variant={task.completed ? "secondary" : "outline"}>
  {task.completed ? "Completed" : "Pending"}
</Badge>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No tasks scheduled for this date</p>
            )}
          </div>
        </DialogContent>
          </Dialog>
          
    </div>
  );
}