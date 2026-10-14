import { NextRequest, NextResponse } from 'next/server';
import { readCms } from '@/lib/orderStore';
import { getSession } from '@/lib/serverAuth';
import { hasAny } from '@/lib/permissions';
import { publicOrder, tokenOk } from '@/lib/orderPublic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = readCms().reservations.find((r) => r.id === id);
  const token = new URL(req.url).searchParams.get('t');
  let allowed = Boolean(order) && tokenOk(order!, token);
  if (order && !allowed) {
    const user = await getSession(req);
    allowed = hasAny(user, ['orders.view', 'payments.manage']);
  }
  if (!order || !allowed) {
    return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
  }
  return NextResponse.json(publicOrder(order));
}
