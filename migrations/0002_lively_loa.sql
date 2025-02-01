CREATE TYPE "public"."priority" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "priority" "priority" DEFAULT 'Medium';