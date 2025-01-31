import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';  // Add this import

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Check if the user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
        .limit(1)
  
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email is already taken' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await db.insert(users).values({
      email,
      passwordHash: hashedPassword,
      name,
    }).returning();

    return NextResponse.json({ message: 'User created successfully', newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong during sign-up' },
      { status: 500 }
    );
  }
}