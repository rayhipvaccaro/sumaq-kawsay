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

export interface ReserveBatchInput {
  customerName: string;
  customerContact: string;
  customerDoc?: string;
  arrivalTime?: string;
  items: { slotId: number; quantity: number; arrivalTime?: string }[];
}

export interface BookingRow {
  id: number;
  slotId: number;
  quantity: number;
  customerName: string;
  customerContact: string;
  customerDoc: string | null;
  arrivalTime: string | null;
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

  async reserveBatch(input: ReserveBatchInput) {
    const customerName = input.customerName?.trim();
    const customerContact = input.customerContact?.trim();
    if (!customerName || !customerContact) {
      throw new BadRequestException('nombre y contacto son obligatorios');
    }
    const customerDoc = input.customerDoc?.trim().slice(0, 20) || null;
    const arrivalTime = input.arrivalTime?.trim() || null;
    if (arrivalTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime)) {
      throw new BadRequestException('hora invalida');
    }
    if (
      !Array.isArray(input.items) ||
      input.items.length === 0 ||
      input.items.length > 10
    ) {
      throw new BadRequestException('items debe tener de 1 a 10 elementos');
    }

    const merged = new Map<number, number>();
    const times = new Map<number, string | null>();
    for (const it of input.items) {
      if (!Number.isInteger(it?.slotId) || it.slotId <= 0) {
        throw new BadRequestException('slotId invalido');
      }
      if (!Number.isInteger(it?.quantity) || it.quantity <= 0) {
        throw new BadRequestException('quantity debe ser entero mayor a 0');
      }
      const t = it.arrivalTime?.trim() || arrivalTime;
      if (t && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) {
        throw new BadRequestException('hora invalida');
      }
      if (!times.has(it.slotId)) times.set(it.slotId, t);
      merged.set(it.slotId, (merged.get(it.slotId) ?? 0) + it.quantity);
    }
    // Orden fijo por id: evita bloqueos cruzados entre reservas simultaneas
    const ordered = [...merged.entries()].sort((a, b) => a[0] - b[0]);

    return this.prisma.$transaction(
      async (tx) => {
        const out: BookingRow[] = [];
        for (const [slotId, quantity] of ordered) {
          const itemTime = times.get(slotId) ?? null;
          const taken = await tx.$queryRaw<{ id: number }[]>`
            UPDATE "Slot"
            SET "booked" = "booked" + ${quantity}::int
            WHERE "id" = ${slotId}::int
              AND "booked" + ${quantity}::int <= "capacity"
            RETURNING "id"
          `;
          if (taken.length === 0) {
            const slot = await tx.slot.findUnique({
              where: { id: slotId },
              select: { id: true },
            });
            if (!slot) {
              throw new NotFoundException(`Horario ${slotId} no existe`);
            }
            throw new ConflictException(
              `No hay cupos suficientes en el horario ${slotId}`,
            );
          }
          const rows = await tx.$queryRaw<BookingRow[]>`
            INSERT INTO "Booking" ("slotId", "quantity", "customerName", "customerContact", "customerDoc", "arrivalTime")
            VALUES (${slotId}::int, ${quantity}::int, ${customerName}::text, ${customerContact}::text, ${customerDoc}::text, ${itemTime}::text)
            RETURNING *
          `;
          out.push(rows[0]);
        }
        return { bookings: out };
      },
      { maxWait: 10_000, timeout: 20_000 },
    );
  }
}