-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('SSLCOMMERZ', 'STRIPE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "paymenets" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT,
    "requestId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "provider" "Providers" NOT NULL DEFAULT 'SSLCOMMERZ',
    "method" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paymenets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paymenets_transactionId_key" ON "paymenets"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "paymenets_requestId_key" ON "paymenets"("requestId");

-- AddForeignKey
ALTER TABLE "paymenets" ADD CONSTRAINT "paymenets_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
