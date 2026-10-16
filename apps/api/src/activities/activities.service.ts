import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { assertAreaAccess } from '../auth/area.util';
import type { TokenUser } from '../auth/area.util';
import { PrismaService } from '../prisma/prisma.service';
import { recalcCapacity } from './capacity.util';

export interface CreateActivityInput {
  name: string;
  areaId: number;
  description?: string;
  priceCents?: number;
  durationMin?: number;
}

export interface CreateResourcesInput {
  name: string;
  count?: number;
  seats?: number;
  tripsPerDay?: number;
}

export interface CreateSlotInput {
  startsAt: string;
  endsAt?: string;
  capacity?: number;
}

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(input: CreateActivityInput) {
        if (!input.name?.trim()) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!Number.isInteger(input.areaId) || input.areaId <= 0) {
      throw new BadRequestException('areaId es obligatorio (elige una area de la lista)');
    }
    const area = await this.prisma.area.findUnique({
      where: { id: input.areaId },
    });
    if (!area) throw new NotFoundException('Area no existe');
    return this.prisma.activity.create({
      data: {
        name: input.name.trim(),
        areaId: area.id,
        description: input.description?.trim() || null,
        priceCents: input.priceCents ?? 0,
        durationMin: input.durationMin ?? 60,
      },
    });
  }

  listActivities() {
    return this.prisma.activity.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
      include: {
        area: { select: { id: true, name: true } },
        _count: { select: { resources: { where: { active: true } } } },
      },
    });
  }
  
  async listMine(user: TokenUser) {
    if (!user.isAdmin && user.areaId === null) return [];
    return this.prisma.activity.findMany({
      where: {
        active: true,
        ...(user.isAdmin ? {} : { areaId: user.areaId as number }),
      },
      orderBy: { id: 'asc' },
      include: {
        area: { select: { id: true, name: true } },
        resources: {
          where: { active: true },
          orderBy: { id: 'asc' },
          select: { id: true, name: true },
        },
        slots: {
          where: { startsAt: { gte: new Date() } },
          orderBy: { startsAt: 'asc' },
          take: 50,
        },
      },
    });
  }

  async listMyBookings(user: TokenUser, activityId?: number, limit = 100) {
    if (!user.isAdmin && user.areaId === null) return [];
    const take = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 500) : 100;
    return this.prisma.booking.findMany({
      where: {
        slot: {
          ...(activityId ? { activityId } : {}),
          activity: user.isAdmin ? {} : { areaId: user.areaId as number },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        slot: {
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            activity: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  private async requireActivity(id: number) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Actividad no existe');
    return activity;
  }

  async addResources(
    activityId: number,
    input: CreateResourcesInput,
    user: TokenUser,
  ) {
    const activity = await this.requireActivity(activityId);
    assertAreaAccess(user, activity.areaId);
    const count = input.count ?? 1;
    if (!input.name?.trim()) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!Number.isInteger(count) || count < 1 || count > 200) {
      throw new BadRequestException('count debe ser entero entre 1 y 200');
    }
    const base = input.name.trim();
        const seats = input.seats ?? 1;
    const tripsPerDay = input.tripsPerDay ?? 1;
    if (!Number.isInteger(seats) || seats < 1 || seats > 20) {
      throw new BadRequestException('seats entre 1 y 20');
    }
    if (!Number.isInteger(tripsPerDay) || tripsPerDay < 1 || tripsPerDay > 6) {
      throw new BadRequestException('tripsPerDay entre 1 y 6');
    }
    const data = Array.from({ length: count }, (_, i) => ({
      activityId,
      name: count === 1 ? base : `${base} ${i + 1}`,
      seats,
      tripsPerDay,
    }));
    await this.prisma.resource.createMany({ data });
    await recalcCapacity(this.prisma, activityId);
    return this.prisma.resource.findMany({
      where: { activityId, active: true },
      orderBy: { id: 'asc' },
    });
  }

  async removeResource(id: number, user: TokenUser) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: { activity: true },
    });
    if (!resource) throw new NotFoundException('Recurso no existe');
    assertAreaAccess(user, resource.activity.areaId);
        const updated = await this.prisma.resource.update({
      where: { id },
      data: { active: false },
    });
    await recalcCapacity(this.prisma, resource.activityId);
    return updated;
  }

  async createSlot(activityId: number, input: CreateSlotInput, user: TokenUser) {
    const activity = await this.requireActivity(activityId);
    assertAreaAccess(user, activity.areaId);

    const startsAt = new Date(input.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException('startsAt invalido');
    }
    const endsAt = input.endsAt
      ? new Date(input.endsAt)
      : new Date(startsAt.getTime() + activity.durationMin * 60_000);
    if (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException('endsAt debe ser despues de startsAt');
    }

    const capacity =
      input.capacity ??
      (await this.prisma.resource.count({
        where: { activityId, active: true },
      }));
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new BadRequestException(
        'capacity debe ser entero mayor a 0 (o crea recursos primero)',
      );
    }

    try {
      return await this.prisma.slot.create({
        data: { activityId, startsAt, endsAt, capacity },
      });
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Ya existe un horario a esa hora');
      }
      throw e;
    }
  }

  listSlots(activityId: number) {
    return this.prisma.slot.findMany({
      where: { activityId },
      orderBy: { startsAt: 'asc' },
    });
  }
    async availability(activityId: number, from: string, to: string) {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(from) || !re.test(to)) {
      throw new BadRequestException('from y to deben ser YYYY-MM-DD');
    }
    const start = new Date(`${from}T00:00:00-05:00`);
    const end = new Date(`${to}T23:59:59.999-05:00`);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      throw new BadRequestException('rango de fechas invalido');
    }
    if (end.getTime() - start.getTime() > 92 * 86_400_000) {
      throw new BadRequestException('maximo 92 dias por consulta');
    }
    await this.requireActivity(activityId);

    const now = new Date();
    const slots = await this.prisma.slot.findMany({
      where: {
        activityId,
        startsAt: { gte: start > now ? start : now, lte: end },
      },
      orderBy: { startsAt: 'asc' },
      select: { startsAt: true, capacity: true, booked: true },
    });

    const byDay = new Map<
      string,
      { date: string; slots: number; capacity: number; free: number }
    >();
    for (const s of slots) {
      const date = s.startsAt.toLocaleDateString('en-CA', {
        timeZone: 'America/Lima',
      });
      const d = byDay.get(date) ?? { date, slots: 0, capacity: 0, free: 0 };
      d.slots += 1;
      d.capacity += s.capacity;
      d.free += Math.max(0, s.capacity - s.booked);
      byDay.set(date, d);
    }

    return {
      activityId,
      from,
      to,
      days: [...byDay.values()].map((d) => ({
        ...d,
        status: d.free > 0 ? 'open' : 'full',
      })),
    };
  }
  async removeSlot(id: number, user: TokenUser) {
    const slot = await this.prisma.slot.findUnique({
      where: { id },
      include: { activity: true },
    });
    if (!slot) throw new NotFoundException('Horario no existe');
    assertAreaAccess(user, slot.activity.areaId);
    if (slot.booked > 0) {
      throw new ConflictException('Horario tiene reservas, no se puede quitar');
    }
    await this.prisma.slot.delete({ where: { id } });
    return { deleted: id };
  }
}