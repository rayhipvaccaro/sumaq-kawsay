import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const TZ = 'America/Lima';
const DAYS = 60;
const EXTRAS = [
  { key: 'extra-transporte-cusco', name: 'Traslado Privado Van Cusco - Km 84', trips: 8 },
  { key: 'extra-kit-hierbas', name: 'Botiquin y Kit de Hierbas Andinas', trips: 50 },
  { key: 'extra-astrofoto', name: 'Sesion Privada de Astrofotografia', trips: 4 },
];

const area = await prisma.area.upsert({
  where: { slug: 'extras' },
  update: {},
  create: { name: 'Extras y traslados', slug: 'extras' },
});

const today = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
const base = new Date(`${today}T09:00:00-05:00`).getTime();

const lines = [];
for (const ex of EXTRAS) {
  let act = await prisma.activity.findFirst({ where: { areaId: area.id, name: ex.name } });
  if (!act) {
    act = await prisma.activity.create({
      data: { name: ex.name, areaId: area.id, durationMin: 60 },
    });
  }
  if ((await prisma.resource.count({ where: { activityId: act.id } })) === 0) {
    await prisma.resource.create({
      data: { activityId: act.id, name: ex.name, seats: 1, tripsPerDay: ex.trips, kind: 'main' },
    });
  }
  const data = [];
  for (let i = 0; i < DAYS; i++) {
    const startsAt = new Date(base + i * 86_400_000);
    data.push({
      activityId: act.id,
      startsAt,
      endsAt: new Date(startsAt.getTime() + 3_600_000),
      capacity: ex.trips,
    });
  }
  const r = await prisma.slot.createMany({ data, skipDuplicates: true });
  console.log(`${ex.name}: actividad ${act.id}, horarios nuevos ${r.count}`);
  lines.push(`  '${ex.key}': ${act.id},`);
}

console.log('\nPega estas 3 lineas dentro de NEST_ACTIVITY (en los 2 archivos):\n');
console.log(lines.join('\n'));
await prisma.$disconnect();