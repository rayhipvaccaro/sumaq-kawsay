-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('IN_PROGRESS', 'DONE', 'NOT_DONE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "customerDoc" TEXT;

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "ownerId" INTEGER;

-- CreateTable
CREATE TABLE "ResourceDay" (
    "id" SERIAL NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "trips" INTEGER,
    "unassigned" BOOLEAN NOT NULL DEFAULT false,
    "coverId" INTEGER,

    CONSTRAINT "ResourceDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "minMin" INTEGER NOT NULL,
    "maxMin" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRun" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "resourceId" INTEGER,
    "routeId" INTEGER,
    "routeName" TEXT,
    "status" "RunStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3),
    "plannedEndAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "startedById" INTEGER,
    "ownerId" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResourceDay_resourceId_date_key" ON "ResourceDay"("resourceId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Route_activityId_name_key" ON "Route"("activityId", "name");

-- CreateIndex
CREATE INDEX "ServiceRun_bookingId_idx" ON "ServiceRun"("bookingId");

-- CreateIndex
CREATE INDEX "ServiceRun_activityId_status_idx" ON "ServiceRun"("activityId", "status");

-- CreateIndex
CREATE INDEX "ServiceRun_resourceId_idx" ON "ServiceRun"("resourceId");

-- AddForeignKey
ALTER TABLE "ResourceDay" ADD CONSTRAINT "ResourceDay_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRun" ADD CONSTRAINT "ServiceRun_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRun" ADD CONSTRAINT "ServiceRun_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
