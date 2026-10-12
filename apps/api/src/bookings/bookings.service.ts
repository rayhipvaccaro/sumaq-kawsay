import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReserveInput {
  slotId: number;
  quantity: number;
  customerName: string;
  customerContact: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(input: ReserveInput) {
    const { slotId, quantity, customerName, customerContact } = input;

    if (!Number.isInteger(slotId) || slotId <= 0) {
      throw new BadRequestException('slotId invalido');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity debe ser entero mayor a 0');
    }
    if (!customerName?.trim() || !customerContact?.trim()) {
      throw new BadRequestException('nombre y contacto son obligatorios');
    }

    return this.prisma.$transaction(async (tx) => {
      // Una sola instruccion: toma cupos solo si caben.
      const updated = await tx.$executeRaw`
        UPDATE "Slot"
        SET "booked" = "booked" + ${quantity}
        WHERE "id" = ${slotId}
          AND "booked" + ${quantity} <= "capacity"
      `;

      if (updated === 0) {
        const slot = await tx.slot.findUnique({
          where: { id: slotId },
          select: { id: true },
        });
        if (!slot) throw new NotFoundException('Horario no existe');
        throw new ConflictException('No hay cupos suficientes');
      }

      return tx.booking.create({
        data: {
          slotId,
          quantity,
          customerName: customerName.trim(),
          customerContact: customerContact.trim(),
        },
      });
    });
  }
}