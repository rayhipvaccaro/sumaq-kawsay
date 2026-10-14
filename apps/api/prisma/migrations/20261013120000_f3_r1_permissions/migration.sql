ALTER TABLE "Role" ADD COLUMN "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

INSERT INTO "Role" ("name","description","isAdmin","permissions") VALUES
 ('Contador','Contabilidad y pagos',false,ARRAY['orders.view','payments.manage','fx.edit']),
 ('Ventas y Marketing','Contenido, contactos y agencias',false,ARRAY['cms.edit','leads.view','orders.view','agencies.manage']),
 ('Agencia','Agencia de viajes',false,ARRAY['sales.own'])
ON CONFLICT ("name") DO NOTHING;

UPDATE "Role" SET "permissions" = ARRAY['area.manage']
 WHERE "isAdmin" = false AND cardinality("permissions") = 0
   AND "name" NOT IN ('Contador','Ventas y Marketing','Agencia');
