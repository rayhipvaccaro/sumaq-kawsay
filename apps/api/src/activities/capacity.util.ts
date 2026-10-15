import { PrismaService } from '../prisma/prisma.service';

export const DAY_TIME = '09:00'; // hora del "cupo del dia" en el calendario
const TZ = 'America/Lima';

export const dayKey = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });
export const dayStart = (date: string) => new Date(`${date}T00:00:00-05:00`);
export const dayEnd = (date: string) => new Date(dayStart(date).getTime() + 86_400_000);
export const daySlotTime = (date: string) => new Date(`${date}T${DAY_TIME}:00-05:00`);

export interface ResIn {
  id: number;
  kind: string;
  seats: number;
  tripsPerDay: number;
  status: string;
  active: boolean;
}
export interface DayIn {
  resourceId: number;
  trips: number | null;
  unassigned: boolean;
  coverId: number | null;
}

export const effTrips = (r: ResIn, d?: DayIn | null) => d?.trips ?? r.tripsPerDay;
export const works = (r: ResIn, d?: DayIn | null) =>
  r.active && r.status === 'ACTIVE' && !(d?.unassigned && d.coverId == null);

// Cupo del dia: por tipo suma personas x vueltas; si hay varios tipos (guia/espacio) toma el menor.
export function capFor(res: ResIn[], days: Map<number, DayIn>) {
  const kinds = new Map<string, number>();
  for (const r of res) {
    if (!r.active) continue;
    const d = days.get(r.id);
    kinds.set(r.kind, (kinds.get(r.kind) ?? 0) + (works(r, d) ? r.seats * effTrips(r, d) : 0));
  }
  return kinds.size === 0 ? 0 : Math.min(...kinds.values());
}

export async function capacityByDate(prisma: PrismaService, activityId: number, dates: string[]) {
  const out: Record<string, number> = {};
  if (dates.length === 0) return out;
  const [res, rows] = await Promise.all([
    prisma.resource.findMany({ where: { activityId } }),
    prisma.resourceDay.findMany({ where: { date: { in: dates }, resource: { activityId } } }),
  ]);
  for (const date of dates) {
    const m = new Map<number, DayIn>(rows.filter((r) => r.date === date).map((r) => [r.resourceId, r]));
    out[date] = capFor(res, m);
  }
  return out;
}

// Recalcula el cupo de los dias abiertos. Nunca baja de lo ya reservado (GREATEST).
// Si la actividad no tiene recursos, no toca nada.
export async function syncDays(prisma: PrismaService, activityId: number) {
  if ((await prisma.resource.count({ where: { activityId } })) === 0) return;
  const slots = await prisma.slot.findMany({
    where: { activityId, startsAt: { gte: dayStart(dayKey(new Date())) } },
    select: { id: true, startsAt: true },
  });
  const dates = [...new Set(slots.map((s) => dayKey(s.startsAt)))];
  const caps = await capacityByDate(prisma, activityId, dates);
  for (const s of slots) {
    const cap = caps[dayKey(s.startsAt)] ?? 0;
    await prisma.$executeRaw`
      UPDATE "Slot" SET "capacity" = GREATEST("booked", ${cap}::int) WHERE "id" = ${s.id}::int
    `;
  }
}
export const recalcCapacity = syncDays; // lo usa activities.service.ts

// Abre en el calendario un cupo por dia (si no existe y hay cupo > 0).
export async function ensureDays(prisma: PrismaService, activityId: number, dates: string[]) {
  const caps = await capacityByDate(prisma, activityId, dates);
  const act = await prisma.activity.findUnique({ where: { id: activityId } });
  const now = new Date();
  let created = 0;
  for (const date of dates) {
    const startsAt = daySlotTime(date);
    if (startsAt <= now) continue;
    const cap = caps[date] ?? 0;
    if (cap <= 0) continue;
    const exist = await prisma.slot.findUnique({
      where: { activityId_startsAt: { activityId, startsAt } },
    });
    if (exist) continue;
    await prisma.slot.create({
      data: {
        activityId,
        startsAt,
        endsAt: new Date(startsAt.getTime() + (act?.durationMin ?? 60) * 60_000),
        capacity: cap,
      },
    });
    created++;
  }
  await syncDays(prisma, activityId);
  return created;
}