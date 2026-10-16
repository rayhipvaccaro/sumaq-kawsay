import { NextRequest, NextResponse } from 'next/server';
import { readCms } from '@/lib/orderStore';
import { getSession } from '@/lib/serverAuth';
import { publicOrder } from '@/lib/orderPublic';

// Lo que ve el turista (sus reservas) o la agencia (solo sus ventas).
export async function GET(req: NextRequest) {
  const user = await getSession(req);
  if (!user) return NextResponse.json({ error: 'Sin sesion' }, { status: 401 });
  if (user.mustChangePassword) {
    return NextResponse.json({ error: 'Debes cambiar tu clave' }, { status: 403 });
  }
  const agency = user.role === 'Agencia';
  const mine = readCms().reservations.filter((r) =>
    agency ? r.agencyUserId === user.id : r.customerUserId === user.id,
  );
  return NextResponse.json({
    role: user.role,
    name: user.fullName || user.username,
    username: user.username,
    discountPct: user.discountPct ?? 0,
    orders: mine.map((o) => ({
      ...publicOrder(o),
      createdAt: o.createdAt,
      accessToken: o.accessToken,
      doc: o.customerDniOrPassport,
      passengers: o.passengers ?? [],
      listTotalPEN: o.listTotalPEN,
      agencyDiscountPct: o.agencyDiscountPct,
    })),
  });
}
