import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateActivityInput {
  name: string;
  area: string;
  description?: string;
  priceCents?: number;
  durationMin?: number;
}

export interface CreateResourcesInput {
  name: string;
  count?: number;
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
    if (!input.name?.trim() || !input.area?.trim()) {
      throw new BadRequestException('name y area son obligatorios');
    }
    return this.prisma.activity.create({
      data: {
        name: input.name.trim(),
        area: input.area.trim(),
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
        _count: { select: { resources: { where: { active: true } } } },
      },
    });
  }

  private async requireActivity(id: number) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Actividad no existe');
    return activity;
  }

  async addResources(activityId: number, input: CreateResourcesInput) {
    await this.requireActivity(activityId);
    const count = input.count ?? 1;
    if (!input.name?.trim()) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!Number.isInteger(count) || count < 1 || count > 200) {
      throw new BadRequestException('count debe ser entero entre 1 y 200');
    }
    const base = input.name.trim();
    const data = Array.from({ length: count }, (_, i) => ({
      activityId,
      name: count === 1 ? base : `${base} ${i + 1}`,
    }));
    await this.prisma.resource.createMany({ data });
    return this.prisma.resource.findMany({
      where: { activityId, active: true },
      orderBy: { id: 'asc' },
    });
  }

  async removeResource(id: number) {
    const resource = await this.prisma.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Recurso no existe');
    return this.prisma.resource.update({
      where: { id },
      data: { active: false },
    });
  }

  async createSlot(activityId: number, input: CreateSlotInput) {
    const activity = await this.requireActivity(activityId);

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

  async removeSlot(id: number) {
    const slot = await this.prisma.slot.findUnique({ where: { id } });
    if (!slot) throw new NotFoundException('Horario no existe');
    if (slot.booked > 0) {
      throw new ConflictException('Horario tiene reservas, no se puede quitar');
    }
    await this.prisma.slot.delete({ where: { id } });
    return { deleted: id };
  }
}