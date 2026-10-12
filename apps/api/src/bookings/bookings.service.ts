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

export interface BookingRow {
  id: number;
  slotId: number;
  quantity: number;
  customerName: string;
  customerContact: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async reserve(input: ReserveInput) {
    const { slotId, quantity } = input;
    const customerName = input.customerName?.trim();
    const customerContact = input.customerContact?.trim();

    if (!Number.isInteger(slotId) || slotId <= 0) {
      throw new BadRequestException('slotId invalido');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity debe ser entero mayor a 0');
    }
    if (!customerName || !customerContact) {
      throw new BadRequestException('nombre y contacto son obligatorios');
    }

    // Una sola instruccion: toma cupos Y crea la reserva.
    // Si no caben, no devuelve filas.
    const rows = await this.prisma.$queryRaw<BookingRow[]>`
      WITH taken AS (
        UPDATE "Slot"
        SET "booked" = "booked" + ${quantity}::int
        WHERE "id" = ${slotId}::int
          AND "booked" + ${quantity}::int <= "capacity"
        RETURNING "id"
      )
      INSERT INTO "Booking" ("slotId", "quantity", "customerName", "customerContact")
      SELECT "id", ${quantity}::int, ${customerName}::text, ${customerContact}::text
      FROM taken
      RETURNING *
    `;

    if (rows.length === 0) {
      const slot = await this.prisma.slot.findUnique({
        where: { id: slotId },
        select: { id: true },
      });
      if (!slot) throw new NotFoundException('Horario no existe');
      throw new ConflictException('No hay cupos suficientes');
    }

    return rows[0];
  }
}