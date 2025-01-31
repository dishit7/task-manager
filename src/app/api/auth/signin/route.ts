import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find the user by email
    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user[0].passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // If valid, return success
    return NextResponse.json({ message: 'Login successful', user: user[0] });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong during login' },
      { status: 500 }
    );
  }
}
