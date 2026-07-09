/*
  Warnings:

  - You are about to drop the column `landlordId` on the `rentals` table. All the data in the column will be lost.
  - You are about to drop the column `propertyId` on the `rentals` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_landlordId_fkey";

-- DropForeignKey
ALTER TABLE "rentals" DROP CONSTRAINT "rentals_propertyId_fkey";

-- DropIndex
DROP INDEX "rentals_landlordId_idx";

-- DropIndex
DROP INDEX "rentals_propertyId_idx";

-- AlterTable
ALTER TABLE "rentals" DROP COLUMN "landlordId",
DROP COLUMN "propertyId";

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
