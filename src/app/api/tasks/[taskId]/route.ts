import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET: Fetch a single task
export async function GET(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId =  parseInt(params.taskId);
  console.log(`taskid is ${taskId} `)
  try {
    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .execute()
      .then((rows) => rows[0]);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT: Update a task
export async function PUT(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = parseInt(params.taskId);
  const { title, description, completed, priority, dueDate } = await req.json();

  try {
    // Ensure dueDate is a valid Date object or set to null
    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    await db
      .update(tasks)
      .set({ 
        title, 
        description, 
        completed, 
        priority, 
        dueDate: parsedDueDate 
      })
      .where(eq(tasks.id, taskId))
      .execute();

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = parseInt(params.taskId);

  try {
    // Fetch the current task state
    const task = await db
      .select({ completed: tasks.completed })
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .execute()
      .then((rows) => rows[0]);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Toggle the `completed` status
    const newStatus = !task.completed;

    await db
      .update(tasks)
      .set({ completed: newStatus })
      .where(eq(tasks.id, taskId))
      .execute();

    return NextResponse.json({ message: 'Task status updated', completed: newStatus });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task status' }, { status: 500 });
  }
}

// DELETE: Remove a task
export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const taskId = parseInt(params.taskId);

  try {
    await db.delete(tasks).where(eq(tasks.id, taskId)).execute();
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
