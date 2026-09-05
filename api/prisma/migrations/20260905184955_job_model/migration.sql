/*
  Warnings:

  - You are about to drop the column `name` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `title` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('CLOSED', 'OPEN', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE');

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "name",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
