CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Area_name_key" ON "Area"("name");
CREATE UNIQUE INDEX "Area_slug_key" ON "Area"("slug");

INSERT INTO "Area" ("name", "slug")
SELECT DISTINCT ON (lower(btrim(a))) btrim(a), lower(btrim(a))
FROM (
    SELECT "area" AS a FROM "Activity"
    UNION ALL
    SELECT "area" FROM "User" WHERE "area" IS NOT NULL
) t
WHERE btrim(a) <> ''
ORDER BY lower(btrim(a)), btrim(a);

ALTER TABLE "Activity" ADD COLUMN "areaId" INTEGER;
UPDATE "Activity" SET "areaId" = ar."id"
FROM "Area" ar WHERE lower(btrim("Activity"."area")) = ar."slug";
ALTER TABLE "Activity" ALTER COLUMN "areaId" SET NOT NULL;
ALTER TABLE "Activity" DROP COLUMN "area";

ALTER TABLE "User" ADD COLUMN "areaId" INTEGER;
UPDATE "User" SET "areaId" = ar."id"
FROM "Area" ar WHERE lower(btrim("User"."area")) = ar."slug";
ALTER TABLE "User" DROP COLUMN "area";
ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Activity_areaId_idx" ON "Activity"("areaId");
CREATE INDEX "User_areaId_idx" ON "User"("areaId");

ALTER TABLE "Activity" ADD CONSTRAINT "Activity_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;