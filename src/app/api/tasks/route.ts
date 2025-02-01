// app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const taskData = await request.json();

    if (!taskData.userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // Convert dueDate string to Date object if it exists
    const dueDate = taskData.dueDate ? new Date(taskData.dueDate) : null;

    // Insert the task and return the inserted row
    const [newTask] = await db.insert(tasks)
      .values({
        title: taskData.title,
        description: taskData.description,
        dueDate: dueDate,
        priority: taskData.priority,
        projectId: taskData.projectId,
        userId: taskData.userId,
        completed: false,
      })
      .returning();

    return NextResponse.json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
// app/api/tasks/route.ts le-orm";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const projectId = request.nextUrl.searchParams.get("projectId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    let userTasks;

    if (projectId) {
      // Get tasks for specific project
      userTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, parseInt(projectId)),
            eq(tasks.userId, userId)
          )
        );
    } else {
      // Get all tasks for user
      userTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId));
    }

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}