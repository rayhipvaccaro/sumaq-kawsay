import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResourceStatus } from '@prisma/client';
import { assertAreaAccess } from '../auth/area.util';
import type { TokenUser } from '../auth/area.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  capFor, dayEnd, dayKey, dayStart, effTrips, ensureDays, syncDays, works,
} from './capacity.util';
import type { DayIn } from './capacity.util';

export interface AssetInput {
  name?: string;
  kind?: string;
  seats?: number;
  tripsPerDay?: number;
  status?: string;
  active?: boolean;
  ownerId?: number | null;
}
export interface RouteInput { name: string; minMin: number; maxMin: number }
export interface StartInput { bookingId: number; routeId: number; resourceId: number; minutes?: number }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const KIND_RE = /^[a-z]{1,20}$/;

interface RunRow {
  id: number; bookingId: number; resourceId: number | null; routeName: string | null;
  status: string; startedAt: Date | null; plannedEndAt: Date | null; endedAt: Date | null;
  startedById: number | null; ownerId: number | null; reason: string | null;
  customerName: string; customerDoc: string | null;
}

@Injectable()
export class OpsService {
  constructor(private readonly prisma: PrismaService) {}

  private async mine(activityId: number, user: TokenUser) {
    const a = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!a) throw new NotFoundException('Actividad no existe');
    assertAreaAccess(user, a.areaId);
    return a;
  }

  private async resourceOf(id: number, user: TokenUser) {
    const r = await this.prisma.resource.findUnique({ where: { id }, include: { activity: true } });
    if (!r) throw new NotFoundException('Recurso no existe');
    assertAreaAccess(user, r.activity.areaId);
    return r;
  }

  private okDate(d: string) {
    if (!DATE_RE.test(d ?? '')) throw new BadRequestException('date debe ser YYYY-MM-DD');
    return d;
  }

  private canTouch(r: { ownerId: number | null }, d: DayIn | null | undefined, user: TokenUser) {
    return user.isAdmin || r.ownerId == null || r.ownerId === user.sub || d?.coverId === user.sub;
  }

  private async checkOwner(areaId: number, ownerId: number | null | undefined) {
    if (ownerId == null) return null;
    const u = await this.prisma.user.findUnique({ where: { id: ownerId } });
    if (!u || !u.active || u.areaId !== areaId) {
      throw new BadRequestException('Ese encargado no es de esta zona');
    }
    return u.id;
  }

  // ---------- Tablero del dia ----------
  async board(activityId: number, dateIn: string | undefined, user: TokenUser) {
    const act = await this.mine(activityId, user);
    const date = dateIn && DATE_RE.test(dateIn) ? dateIn : dayKey(new Date());
    const ds = dayStart(date);
    const de = dayEnd(date);

    const [resAll, days, routes, bookings, runsAll, slots, staff, later] = await Promise.all([
      this.prisma.resource.findMany({ where: { activityId }, orderBy: { id: 'asc' } }),
      this.prisma.resourceDay.findMany({ where: { date, resource: { activityId } } }),
      this.prisma.route.findMany({ where: { activityId, active: true }, orderBy: { id: 'asc' } }),
      this.prisma.booking.findMany({
        where: { status: { not: 'CANCELLED' }, slot: { activityId, startsAt: { gte: ds, lt: de } } },
        orderBy: [{ arrivalTime: 'asc' }, { createdAt: 'asc' }],
        include: { runs: { orderBy: { id: 'asc' } } },
      }),
      this.prisma.serviceRun.findMany({
        where: { activityId, OR: [{ status: 'IN_PROGRESS' }, { startedAt: { gte: ds, lt: de } }] },
        include: { booking: { select: { customerName: true, customerDoc: true } } },
      }),
      this.prisma.slot.findMany({ where: { activityId, startsAt: { gte: ds, lt: de } } }),
      this.prisma.user.findMany({
        where: { areaId: act.areaId, active: true },
        select: { id: true, fullName: true },
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.booking.findMany({
        where: {
          status: { not: 'CANCELLED' },
          slot: { activityId, startsAt: { gte: de, lt: new Date(de.getTime() + 14 * 86_400_000) } },
        },
        orderBy: { slot: { startsAt: 'asc' } },
        include: { runs: true, slot: { select: { startsAt: true } } },
      }),
    ]);

    const dayMap = new Map<number, DayIn>(days.map((d) => [d.resourceId, d]));
    const resources = resAll
      .map((r) => {
        const d = dayMap.get(r.id);
        const trips = effTrips(r, d);
        const used = runsAll.filter(
          (x) => x.resourceId === r.id && x.status !== 'NOT_DONE' && x.startedAt && x.startedAt >= ds && x.startedAt < de,
        ).length;
        const busy = runsAll.some((x) => x.resourceId === r.id && x.status === 'IN_PROGRESS');
        const unassigned = !!d?.unassigned && d.coverId == null;
        const working = works(r, d);
        const mine = this.canTouch(r, d, user);
        return {
          id: r.id, name: r.name, kind: r.kind, seats: r.seats, status: r.status, active: r.active,
          ownerId: r.ownerId, tripsPerDay: r.tripsPerDay, trips, used,
          left: working ? Math.max(0, trips - used) : 0,
          busy, unassigned, coverId: d?.coverId ?? null, working, mine,
          takeable: !mine && unassigned && r.active,
        };
      })
      .filter((r) => user.isAdmin || r.mine || r.takeable);

    const nameOf = new Map(resAll.map((r) => [r.id, r.name]));
    const rows = new Map<number, RunRow>();
    for (const r of runsAll) {
      rows.set(r.id, { ...r, customerName: r.booking.customerName, customerDoc: r.booking.customerDoc });
    }
    for (const b of bookings) {
      for (const r of b.runs) {
        if (!rows.has(r.id)) rows.set(r.id, { ...r, customerName: b.customerName, customerDoc: b.customerDoc });
      }
    }
    const t = (x: Date | null) => x?.getTime() ?? 0;
    const runs = [...rows.values()]
      .filter((r) => user.isAdmin || r.startedById === user.sub || r.ownerId === user.sub)
      .sort((a, b) => t(a.startedAt ?? a.endedAt) - t(b.startedAt ?? b.endedAt))
      .map((r) => ({
        id: r.id, bookingId: r.bookingId, customerName: r.customerName, customerDoc: r.customerDoc,
        resourceId: r.resourceId, resourceName: r.resourceId ? nameOf.get(r.resourceId) ?? null : null,
        routeName: r.routeName, status: r.status, startedAt: r.startedAt, plannedEndAt: r.plannedEndAt,
        endedAt: r.endedAt, startedById: r.startedById, ownerId: r.ownerId, reason: r.reason,
        mine: user.isAdmin || r.startedById === user.sub,
      }));

    const ids = new Set<number>(staff.map((s) => s.id));
    for (const r of runs) { if (r.startedById) ids.add(r.startedById); if (r.ownerId) ids.add(r.ownerId); }
    for (const r of resources) { if (r.ownerId) ids.add(r.ownerId); if (r.coverId) ids.add(r.coverId); }
    const users = await this.prisma.user.findMany({
      where: { id: { in: [...ids] } },
      select: { id: true, fullName: true },
    });

    return {
      date,
      me: user.sub,
      isAdmin: user.isAdmin,
      capacity: capFor(resAll, dayMap),
      slotCapacity: slots.reduce((s, x) => s + x.capacity, 0),
      booked: slots.reduce((s, x) => s + x.booked, 0),
      resources,
      routes: routes.map((r) => ({ id: r.id, name: r.name, minMin: r.minMin, maxMin: r.maxMin })),
      pending: bookings
        .map((b) => ({
          bookingId: b.id, customerName: b.customerName, customerContact: b.customerContact,
          customerDoc: b.customerDoc, arrivalTime: b.arrivalTime, quantity: b.quantity, pending: b.quantity - b.runs.length,
        }))
        .filter((p) => p.pending > 0),
      runs,
      upcoming: later
        .filter((b) => b.runs.length < b.quantity)
        .map((b) => ({
          bookingId: b.id, date: dayKey(b.slot.startsAt), customerName: b.customerName,
          customerContact: b.customerContact, customerDoc: b.customerDoc,
          quantity: b.quantity, arrivalTime: b.arrivalTime,
        })),
      names: Object.fromEntries(users.map((u) => [u.id, u.fullName])),
      staff,
    };
  }

  // ---------- Recursos ----------
  async createAsset(activityId: number, input: AssetInput, user: TokenUser) {
    const act = await this.mine(activityId, user);
    const name = input.name?.trim();
    if (!name) throw new BadRequestException('name es obligatorio');
    const kind = input.kind ?? 'main';
    if (!KIND_RE.test(kind)) throw new BadRequestException('kind invalido');
    const seats = input.seats ?? 1;
    const tripsPerDay = input.tripsPerDay ?? 1;
    if (!Number.isInteger(seats) || seats < 1 || seats > 20) throw new BadRequestException('seats entre 1 y 20');
    if (!Number.isInteger(tripsPerDay) || tripsPerDay < 1 || tripsPerDay > 6) {
      throw new BadRequestException('tripsPerDay entre 1 y 6');
    }
    const ownerId = user.isAdmin ? await this.checkOwner(act.areaId, input.ownerId) : user.sub;
    const r = await this.prisma.resource.create({
      data: { activityId, name, kind, seats, tripsPerDay, ownerId },
    });
    await syncDays(this.prisma, activityId);
    return r;
  }

  async updateAsset(id: number, input: AssetInput, user: TokenUser) {
    const r = await this.resourceOf(id, user);
    if (!user.isAdmin && r.ownerId != null && r.ownerId !== user.sub) {
      throw new ForbiddenException('Este recurso es de otro encargado');
    }
    const data: {
      name?: string; kind?: string; seats?: number; tripsPerDay?: number;
      status?: ResourceStatus; active?: boolean; ownerId?: number | null;
    } = {};
    if (input.name !== undefined) {
      if (!input.name.trim()) throw new BadRequestException('name vacio');
      data.name = input.name.trim();
    }
    if (input.kind !== undefined) {
      if (!KIND_RE.test(input.kind)) throw new BadRequestException('kind invalido');
      data.kind = input.kind;
    }
    if (input.seats !== undefined) {
      if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > 20) {
        throw new BadRequestException('seats entre 1 y 20');
      }
      data.seats = input.seats;
    }
    if (input.tripsPerDay !== undefined) {
      if (!Number.isInteger(input.tripsPerDay) || input.tripsPerDay < 1 || input.tripsPerDay > 6) {
        throw new BadRequestException('tripsPerDay entre 1 y 6');
      }
      data.tripsPerDay = input.tripsPerDay;
    }
    if (input.status !== undefined) {
      if (!Object.values(ResourceStatus).includes(input.status as ResourceStatus)) {
        throw new BadRequestException('status invalido');
      }
      data.status = input.status as ResourceStatus;
    }
    if (input.active !== undefined) data.active = !!input.active;
    if (input.ownerId !== undefined && user.isAdmin) {
      data.ownerId = await this.checkOwner(r.activity.areaId, input.ownerId);
    }
    const updated = await this.prisma.resource.update({ where: { id }, data });
    await syncDays(this.prisma, r.activityId);
    return updated;
  }

  // ---------- Parte del dia ----------
  async setDay(id: number, input: { date: string; trips?: number | null }, user: TokenUser) {
    const r = await this.resourceOf(id, user);
    const date = this.okDate(input.date);
    const d = await this.prisma.resourceDay.findUnique({ where: { resourceId_date: { resourceId: id, date } } });
    if (!this.canTouch(r, d, user)) throw new ForbiddenException('Este recurso no es tuyo hoy');
    const trips = input.trips ?? null;
    if (trips !== null && (!Number.isInteger(trips) || trips < 0 || trips > 6)) {
      throw new BadRequestException('trips entre 0 y 6');
    }
    await this.prisma.resourceDay.upsert({
      where: { resourceId_date: { resourceId: id, date } },
      create: { resourceId: id, date, trips },
      update: { trips },
    });
    await syncDays(this.prisma, r.activityId);
    return { ok: true };
  }

  async take(id: number, input: { date: string }, user: TokenUser) {
    const r = await this.resourceOf(id, user);
    const date = this.okDate(input.date);
    const d = await this.prisma.resourceDay.findUnique({ where: { resourceId_date: { resourceId: id, date } } });
    if (!user.isAdmin && !(d?.unassigned && d.coverId == null)) {
      throw new ConflictException('Este recurso no esta libre para tomar');
    }
    await this.prisma.resourceDay.upsert({
      where: { resourceId_date: { resourceId: id, date } },
      create: { resourceId: id, date, coverId: user.sub },
      update: { coverId: user.sub, unassigned: false },
    });
    await syncDays(this.prisma, r.activityId);
    return { ok: true };
  }

  async absent(activityId: number, input: { date: string; userId?: number; absent: boolean }, user: TokenUser) {
    await this.mine(activityId, user);
    const date = this.okDate(input.date);
    const target = input.userId ?? user.sub;
    if (target !== user.sub && !user.isAdmin) throw new ForbiddenException('Solo el admin marca a otros');
    const list = await this.prisma.resource.findMany({ where: { activityId, ownerId: target, active: true } });
    for (const r of list) {
      await this.prisma.resourceDay.upsert({
        where: { resourceId_date: { resourceId: r.id, date } },
        create: { resourceId: r.id, date, unassigned: !!input.absent },
        update: { unassigned: !!input.absent, coverId: null },
      });
    }
    await syncDays(this.prisma, activityId);
    return { changed: list.length };
  }

  // ---------- Rutas y calendario ----------
  async setRoutes(activityId: number, input: RouteInput[], user: TokenUser) {
    await this.mine(activityId, user);
    if (!Array.isArray(input) || input.length < 1 || input.length > 10) {
      throw new BadRequestException('Manda entre 1 y 10 rutas');
    }
    const names = new Set<string>();
    for (const r of input) {
      const n = r.name?.trim();
      if (!n || names.has(n.toLowerCase())) throw new BadRequestException('Nombre vacio o repetido');
      names.add(n.toLowerCase());
      if (!Number.isInteger(r.minMin) || !Number.isInteger(r.maxMin) || r.minMin < 1 || r.maxMin < r.minMin || r.maxMin > 600) {
        throw new BadRequestException('Minutos: minimo 1, maximo mayor o igual al minimo, hasta 600');
      }
    }
    await this.prisma.route.updateMany({ where: { activityId }, data: { active: false } });
    for (const r of input) {
      const name = r.name.trim();
      await this.prisma.route.upsert({
        where: { activityId_name: { activityId, name } },
        create: { activityId, name, minMin: r.minMin, maxMin: r.maxMin },
        update: { minMin: r.minMin, maxMin: r.maxMin, active: true },
      });
    }
    return { ok: true };
  }

  async openDays(activityId: number, from: string, to: string, user: TokenUser) {
    await this.mine(activityId, user);
    this.okDate(from); this.okDate(to);
    const t0 = new Date(`${from}T12:00:00-05:00`).getTime();
    const t1 = new Date(`${to}T12:00:00-05:00`).getTime();
    if (Number.isNaN(t0) || Number.isNaN(t1) || t1 < t0) throw new BadRequestException('rango invalido');
    const dates: string[] = [];
    for (let t = t0; t <= t1; t += 86_400_000) dates.push(dayKey(new Date(t)));
    if (dates.length > 92) throw new BadRequestException('maximo 92 dias');
    const created = await ensureDays(this.prisma, activityId, dates);
    return { created, days: dates.length };
  }

  // ---------- Recorridos con turistas ----------
  private async bookingOf(bookingId: number, user: TokenUser) {
    if (!Number.isInteger(bookingId)) throw new BadRequestException('bookingId invalido');
    const b = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { slot: { include: { activity: true } }, runs: true },
    });
    if (!b) throw new NotFoundException('Reserva no existe');
    assertAreaAccess(user, b.slot.activity.areaId);
    if (b.status === 'CANCELLED') throw new ConflictException('Reserva cancelada');
    if (dayKey(b.slot.startsAt) > dayKey(new Date())) {
      throw new ConflictException('Aun no es el dia de esta reserva');
    }
    if (b.runs.length >= b.quantity) throw new ConflictException('Ya atendieron a todos de esta reserva');
    return b;
  }

  async start(input: StartInput, user: TokenUser) {
    const { bookingId, routeId, resourceId } = input;
    if (!Number.isInteger(routeId) || !Number.isInteger(resourceId)) throw new BadRequestException('Faltan datos');
    const b = await this.bookingOf(bookingId, user);
    const act = b.slot.activity;
    const route = await this.prisma.route.findFirst({ where: { id: routeId, activityId: act.id, active: true } });
    if (!route) throw new BadRequestException('Ruta no valida');
    const res = await this.prisma.resource.findFirst({
      where: { id: resourceId, activityId: act.id, active: true, status: 'ACTIVE' },
    });
    if (!res) throw new BadRequestException('Recurso no disponible');
    const minutes = input.minutes ?? route.maxMin;
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) {
      throw new BadRequestException('minutes entre 1 y 600');
    }
    const today = dayKey(new Date());
    const d = await this.prisma.resourceDay.findUnique({
      where: { resourceId_date: { resourceId, date: today } },
    });
    if (!works(res, d)) throw new ConflictException('Sin encargado hoy: alguien debe tomarlo a cargo');
    if (!this.canTouch(res, d, user)) throw new ForbiddenException('Este recurso no es tuyo hoy');
    const now = new Date();
    return this.prisma.$transaction(async (tx) => {
      if ((await tx.serviceRun.count({ where: { bookingId } })) >= b.quantity) {
        throw new ConflictException('Ya atendieron a todos de esta reserva');
      }
      if (await tx.serviceRun.count({ where: { resourceId, status: 'IN_PROGRESS' } })) {
        throw new ConflictException('Ocupado: sigue en un recorrido');
      }
      const used = await tx.serviceRun.count({
        where: { resourceId, status: { not: 'NOT_DONE' }, startedAt: { gte: dayStart(today), lt: dayEnd(today) } },
      });
      if (used >= effTrips(res, d)) throw new ConflictException('Ya hizo todas sus vueltas de hoy');
      return tx.serviceRun.create({
        data: {
          bookingId, activityId: act.id, resourceId, routeId, routeName: route.name,
          status: 'IN_PROGRESS', startedAt: now,
          plannedEndAt: new Date(now.getTime() + minutes * 60_000),
          startedById: user.sub, ownerId: res.ownerId,
        },
      });
    });
  }

  async skip(input: { bookingId: number; reason: string }, user: TokenUser) {
    const b = await this.bookingOf(input.bookingId, user);
    const reason = input.reason?.trim();
    if (!reason || reason.length < 2) throw new BadRequestException('Escribe el motivo');
    return this.prisma.serviceRun.create({
      data: {
        bookingId: b.id, activityId: b.slot.activityId, status: 'NOT_DONE',
        endedAt: new Date(), startedById: user.sub, reason,
      },
    });
  }

  async finish(id: number, input: { notDone?: boolean; reason?: string }, user: TokenUser) {
    const run = await this.prisma.serviceRun.findUnique({ where: { id } });
    if (!run) throw new NotFoundException('Recorrido no existe');
    await this.mine(run.activityId, user);
    if (run.status !== 'IN_PROGRESS') throw new ConflictException('Ese recorrido ya estaba cerrado');
    if (!user.isAdmin && run.startedById !== user.sub) {
      throw new ForbiddenException('Solo quien lo inicio puede terminarlo');
    }
    const notDone = !!input.notDone;
    const reason = input.reason?.trim() || null;
    if (notDone && (!reason || reason.length < 2)) throw new BadRequestException('Escribe el motivo');
    return this.prisma.serviceRun.update({
      where: { id },
      data: { status: notDone ? 'NOT_DONE' : 'DONE', endedAt: new Date(), reason: notDone ? reason : run.reason },
    });
  }

  async setConfig(activityId: number, input: { resourceLabel?: string | null }, user: TokenUser) {
    await this.mine(activityId, user);
    const raw = input?.resourceLabel;
    const label = typeof raw === 'string' ? raw.trim() : '';
    if (label.length > 30) throw new BadRequestException('Maximo 30 letras');
    return this.prisma.activity.update({ where: { id: activityId }, data: { resourceLabel: label || null } });
  }
}