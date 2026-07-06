/*
  Warnings:

  - The values [DELETED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RENTED');

-- CreateEnum
CREATE TYPE "District" AS ENUM ('DHAKA', 'GAZIPUR', 'NARAYANGANJ', 'NARSINGDI', 'MUNSHIGANJ', 'MANIKGANJ', 'TANGAIL', 'KISHOREGANJ', 'FARIDPUR', 'GOPALGANJ', 'MADARIPUR', 'RAJBARI', 'SHARIATPUR', 'CHATTOGRAM', 'CUMILLA', 'BRAHMANBARIA', 'CHANDPUR', 'FENI', 'LAKSHMIPUR', 'NOAKHALI', 'COXS_BAZAR', 'KHAGRACHHARI', 'RANGAMATI', 'BANDARBAN', 'RAJSHAHI', 'BOGURA', 'JOYPURHAT', 'NAOGAON', 'NATORE', 'CHAPAINAWABGANJ', 'PABNA', 'SIRAJGANJ', 'KHULNA', 'JASHORE', 'SATKHIRA', 'BAGERHAT', 'NARAIL', 'MAGURA', 'JHENAIDAH', 'KUSHTIA', 'CHUADANGA', 'MEHERPUR', 'BARISHAL', 'BHOLA', 'JHALOKATHI', 'PATUAKHALI', 'PIROJPUR', 'BARGUNA', 'SYLHET', 'HABIGANJ', 'MOULVIBAZAR', 'SUNAMGANJ', 'RANGPUR', 'DINAJPUR', 'THAKURGAON', 'PANCHAGARH', 'NILPHAMARI', 'LALMONIRHAT', 'KURIGRAM', 'GAIBANDHA', 'MYMENSINGH', 'JAMALPUR', 'SHERPUR', 'NETROKONA');

-- CreateEnum
CREATE TYPE "Division" AS ENUM ('DHAKA', 'CHATTOGRAM', 'RAJSHAHI', 'KHULNA', 'BARISHAL', 'SYLHET', 'RANGPUR', 'MYMENSINGH');

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'BLOCKED');
ALTER TABLE "public"."users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "division" "Division" NOT NULL,
    "district" "District" NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "landlordId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL,
    "floor" INTEGER NOT NULL,
    "image" TEXT,
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "properties_landlordId_idx" ON "properties"("landlordId");

-- CreateIndex
CREATE INDEX "properties_categoryId_idx" ON "properties"("categoryId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
