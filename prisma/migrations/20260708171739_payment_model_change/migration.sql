/*
  Warnings:

  - Added the required column `userId` to the `paymenets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "paymenets" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "paymenets" ADD CONSTRAINT "paymenets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
