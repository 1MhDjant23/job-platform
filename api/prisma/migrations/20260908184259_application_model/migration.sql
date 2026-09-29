/*
  Warnings:

  - Added the required column `applicantId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Applied', 'Reviewd', 'Accepted', 'Rejected');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "applicantId" TEXT NOT NULL,
ADD COLUMN     "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "coverLeter" TEXT,
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resumUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
