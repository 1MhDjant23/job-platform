/*
  Warnings:

  - You are about to drop the column `resumUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "resumUrl",
ADD COLUMN     "resumeUrl" TEXT;
