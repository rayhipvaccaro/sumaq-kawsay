import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const rows = await this.prisma.$queryRaw<
      { db: string }[]
    >`SELECT current_database() AS db`;
    return { status: 'ok', database: rows[0].db };
  }
}