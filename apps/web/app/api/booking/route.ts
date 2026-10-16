import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/session';

// id del asistente -> id de la actividad en Nest
const NEST_ACTIVITY: Record<string, number> = {
  'act-cabalgata': 2,
  'act-hanan-pacha': 5,
  'act-willka-unu': 6,
  'act-etnobotanica': 7,
  'act-inti-punku': 8,
  'extra-transporte-cusco': 9,
  'extra-astrofoto': 11,
};

type Slot = { id: number; startsAt: string; capacity: number; booked: number };
type Item = {
  id: string;
  name?: string;
  quantity: number;
  date?: string;
  arrivalTime?: string;
};

const limaDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Lima' });

const bad = (message: string, status = 400) =>
  NextResponse.json({ ok: false, message }, { status });

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad('Datos invalidos');
  }

  const date = String(body.date ?? '');
  const customerName = String(body.customerName ?? '').trim();
  const customerContact = String(body.customerContact ?? '').trim();
  const customerDoc = String(body.customerDoc ?? '').trim();
  const arrivalTime = String(body.arrivalTime ?? '').trim();
  const items: Item[] = Array.isArray(body.items) ? (body.items as Item[]) : [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !customerName || !customerContact) {
    return bad('Faltan fecha, nombre o contacto');
  }

  // 1) Revisar cupo de todo ANTES de reservar nada
  const plan: {
    name: string;
    slotId: number;
    quantity: number;
    arrivalTime: string;
  }[] = [];
  for (const it of items) {
    const activityId = NEST_ACTIVITY[it.id];
    if (!activityId) continue; // sin enlace en Nest: queda solo como cotizacion
    const quantity = Number(it.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return bad('Cantidad invalida');
    }
    let slots: Slot[];
    try {
      const r = await fetch(`${API_URL}/activities/${activityId}/slots`, {
        cache: 'no-store',
      });
      if (!r.ok) throw new Error(String(r.status));
      slots = await r.json();
    } catch (e) {
      console.error('BOOKING: fallo al leer horarios de Nest:', e);
      return bad('Servidor de reservas no disponible', 502);
    }
    const label = it.name ?? it.id;
    const day = /^\d{4}-\d{2}-\d{2}$/.test(String(it.date ?? ''))
      ? String(it.date)
      : date;
    const slot = slots.find(
      (s) => limaDay(s.startsAt) === day && s.capacity - s.booked >= quantity,
    );
    if (!slot) {
      return bad(
        `Sin cupo para "${label}" el ${day}. Elige otra fecha o menos personas.`,
        409,
      );
    }
    plan.push({
      name: label,
      slotId: slot.id,
      quantity,
      arrivalTime: String(it.arrivalTime ?? '').trim() || arrivalTime,
    });
  }

  // 2) Reservar todo junto: o entra todo, o no entra nada
  if (plan.length === 0) {
    return NextResponse.json({ ok: true, bookings: [] });
  }
  try {
    const r = await fetch(`${API_URL}/bookings/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        customerContact,
        customerDoc: customerDoc || undefined,
        arrivalTime: arrivalTime || undefined,
        items: plan.map((p) => ({
          slotId: p.slotId,
          quantity: p.quantity,
          arrivalTime: p.arrivalTime || undefined,
        })),
      }),
      cache: 'no-store',
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const full = r.status === 409;
      return NextResponse.json(
        {
          ok: false,
          message: full
            ? 'Se acabaron los cupos mientras reservabas. No se reservo nada. Elige otra fecha.'
            : `No se pudo reservar: ${data?.message ?? r.status}`,
          done: [],
        },
        { status: full ? 409 : 502 },
      );
    }
    const nameBySlot = new Map(plan.map((p) => [p.slotId, p.name]));
    const done = (data.bookings as { id: number; slotId: number }[]).map(
      (b) => ({ activity: nameBySlot.get(b.slotId) ?? '', bookingId: b.id }),
    );
    return NextResponse.json({ ok: true, bookings: done });
  } catch (e) {
    console.error('BOOKING: fallo al reservar en Nest:', e);
    return bad('Servidor de reservas no disponible', 502);
  }
}