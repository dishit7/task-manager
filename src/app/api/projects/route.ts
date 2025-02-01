// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    //Simple query without relations
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));

    //  const userProjects = await db
    //   .select({
    //     id: projects.id,
    //     name: projects.name,
    //     description: projects.description,
    //     createdAt: projects.createdAt,
    //     tasks: tasks
    //   })
    //   .from(projects)
    //   .leftJoin(tasks, eq(tasks.projectId, projects.id))
    //   .where(eq(projects.userId, userId));

    return NextResponse.json(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// Create Project
export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();

    const newProject = await db.insert(projects).values({
      name: projectData.name,
      userId: projectData.userId,
      description: projectData.description
    }).returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}