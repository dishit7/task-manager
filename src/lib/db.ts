// lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users, projects, tasks } from '@/db/schema'; // Import your schema here

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Make sure this is set in your .env file
});

// Initialize Drizzle ORM with the PostgreSQL connection
export const db = drizzle(pool, {
  schema: {
    users,
    projects,
    tasks,
  },
});
