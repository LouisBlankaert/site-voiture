-- AlterTable
ALTER TABLE "User" ADD COLUMN "temp_role" TEXT;
UPDATE "User" SET "temp_role" = "role";
ALTER TABLE "User" DROP COLUMN "role";
ALTER TABLE "User" RENAME COLUMN "temp_role" TO "role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- Custom SQL to ensure SUPER_ADMIN is recognized
-- This is a workaround since SQLite doesn't support ALTER TYPE
-- The client will handle the enum validation
