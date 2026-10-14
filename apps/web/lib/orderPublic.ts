import { timingSafeEqual } from 'crypto';
import type { Reservation } from '@/data/businessData';

export function tokenOk(order: Reservation, token: string | null | undefined): boolean {
  if (!order.accessToken || !token) return false;
  const a = Buffer.from(order.accessToken);
  const b = Buffer.from(String(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Lo unico que ve el turista de su orden: sin costos internos, sin margen, sin token. */
export function publicOrder(o: Reservation) {
  const items = [
    ...(o.stayItem ? [o.stayItem] : []),
    ...o.activities,
    ...o.meals,
    ...o.extras,
  ].map((i) => ({ name: i.name, quantity: i.quantity, subtotalPEN: i.subtotalPEN }));
  return {
    id: o.id,
    customerName: o.customerName,
    travelDate: o.travelDate,
    guestsCount: o.guestsCount,
    items,
    totalPEN: o.totalPEN,
    totalUSD: o.totalUSD,
    amountPaidPEN: o.amountPaidPEN ?? 0,
    paymentStatus: o.paymentStatus,
    status: o.status,
    payments: (o.payments ?? []).map((p) => ({
      id: p.id,
      date: p.date,
      method: p.method,
      amountPEN: p.amountPEN,
      status: p.status,
      txId: p.txId,
      cardBrand: p.cardBrand,
      cardLast4: p.cardLast4,
    })),
  };
}
