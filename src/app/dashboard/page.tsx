"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"


export default function DashboardPage() {
  const { tasks, isLoading } = useTasks(); // Fetch all tasks
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [filterStatus, setFilterStatus] = useState<"All" | "Completed" | "Incomplete">("All");

  // Filter tasks based on search query, priority, and status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesStatus =
      filterStatus === "All" || (filterStatus === "Completed" ? task.completed : !task.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date()).length;

  // Calculate task completion progress
  const completionProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get upcoming deadlines (tasks due in the next 7 days)
  const upcomingDeadlines = tasks
    .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5); // Show only the top 5 upcoming tasks

  // Format tasks for the calendar widget
  const calendarEvents = tasks
    .filter((task) => task.dueDate) // Only include tasks with due dates
    .map((task) => ({
      title: task.title,
      date: new Date(task.dueDate!), // Ensure date is in the correct format
    }));

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Task Completion Progress */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionProgress} className="h-3" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {completionProgress}% of tasks completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Deadlines */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <ul className="space-y-2">
                {upcomingDeadlines.map((task) => (
                  <li key={task.id} className="flex justify-between items-center">
                    <span>{task.title}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Due: {new Date(task.dueDate!).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No upcoming deadlines</p>
            )}
          </CardContent>
        </Card>
      )}

 
 {/* Calendar Widget */}
{!isLoading && (
  <Card>
    <CardHeader>
      <CardTitle>Task Calendar</CardTitle>
      <CardDescription>View tasks in a calendar</CardDescription>
    </CardHeader>
    <CardContent>
      <CalendarComponent 
        mode="single"
        selected={new Date()}
        modifiers={{
          task: calendarEvents.map(event => event.date)
        }}
        modifiersStyles={{
          task: {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '0',
            color: 'rgb(59, 130, 246)',
          }
        }}
      />
      <div className="mt-4">
        {calendarEvents
          .filter(event => 
            event.date.toDateString() === new Date().toDateString()
          )
          .map((event, index) => (
            <div key={index} className="text-sm p-2 bg-blue-50 rounded mt-1">
              {event.title}
            </div>
          ))}
      </div>
    </CardContent>
  </Card>
)}
      {/* No Tasks Found */}
 {/* Filtered Tasks List */}

      {/* Filtered Tasks List */}
      {!isLoading && filteredTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Filtered results ({filteredTasks.length} tasks)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="h-4 w-4"
                    />
                    <span className={task.completed ? "line-through text-gray-500" : ""}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.priority === "High" 
                        ? "bg-red-100 text-red-800" 
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-sm text-gray-600">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}