-- AlterTable
ALTER TABLE "User" ADD COLUMN "docType" TEXT,
ADD COLUMN "docNumber" TEXT,
ADD COLUMN "discountPct" INTEGER NOT NULL DEFAULT 0;

-- Roles para clientes (no son personal: sin permisos de panel)
INSERT INTO "Role" ("name", "description", "isAdmin", "permissions")
VALUES ('Turista', 'Cliente que reserva en la web', false, ARRAY[]::TEXT[])
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Role" ("name", "description", "isAdmin", "permissions")
VALUES ('Agencia', 'Agencia que reserva para sus clientes con descuento', false, ARRAY['sales.own']::TEXT[])
ON CONFLICT ("name") DO NOTHING;
