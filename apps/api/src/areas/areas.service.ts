import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAreaInput {
  name: string;
}

@Injectable()
export class AreasService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.area.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }

  async create(input: CreateAreaInput, actorId: number, ip?: string) {
    const name = (input.name ?? '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 40) {
      throw new BadRequestException('name: entre 2 y 40 caracteres');
    }
    try {
      const area = await this.prisma.area.create({
        data: { name, slug: name.toLowerCase() },
        select: { id: true, name: true },
      });
      await this.prisma.auditLog.create({
        data: { userId: actorId, action: 'AREA_CREATED', ip: ip ?? null, detail: `area: ${name}` },
      });
      return area;
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        throw new ConflictException('Esa area ya existe');
      }
      throw e;
    }
  }
}