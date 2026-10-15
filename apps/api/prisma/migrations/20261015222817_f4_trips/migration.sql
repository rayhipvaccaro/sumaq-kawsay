-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('ACTIVE', 'REST', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "seats" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "status" "ResourceStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tripsPerDay" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "tripId" INTEGER;

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 60,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_activityId_number_key" ON "Trip"("activityId", "number");

-- CreateIndex
CREATE INDEX "Slot_tripId_idx" ON "Slot"("tripId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
