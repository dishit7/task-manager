// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Get Tasks
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");

    const projectTasks = projectId
      ? await db.query.tasks.findMany({
          where: eq(tasks.projectId, parseInt(projectId)),
        })
      : await db.query.tasks.findMany(); // Fetch all tasks if projectId is not provided

    return NextResponse.json(projectTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}


// Create Task
export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();

    const newTask = await db.insert(tasks).values({
      title: taskData.title,
      description: taskData.description,
      projectId: taskData.projectId,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      priority: taskData.priority || 'Medium',
      completed: false
    }).returning();

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}