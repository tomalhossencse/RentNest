-- DropIndex
DROP INDEX "rentals_requestId_idx";

-- CreateIndex
CREATE INDEX "requests_tenantId_idx" ON "requests"("tenantId");

-- CreateIndex
CREATE INDEX "requests_propertyId_idx" ON "requests"("propertyId");
