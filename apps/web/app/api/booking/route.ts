import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/lib/session';

// id del asistente -> id de la actividad en Nest
const NEST_ACTIVITY: Record<string, number> = {
  'act-cabalgata': 2,
  'act-hanan-pacha': 5,
  'act-willka-unu': 6,
  'act-etnobotanica': 7,
  'act-inti-punku': 8,
};

type Slot = { id: number; startsAt: string; capacity: number; booked: number };
type Item = { id: string; name?: string; quantity: number };

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
  const items: Item[] = Array.isArray(body.items) ? (body.items as Item[]) : [];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !customerName || !customerContact) {
    return bad('Faltan fecha, nombre o contacto');
  }

  // 1) Revisar cupo de todo ANTES de reservar nada
  const plan: { name: string; slotId: number; quantity: number }[] = [];
  for (const it of items) {
    const activityId = NEST_ACTIVITY[it.id];
    if (!activityId) continue; // sin enlace en Nest: queda solo como cotizacion
    const quantity = Number(it.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return bad('Cantidad invalida');
    }
    let slots: Slot[];
    try {
      const r = await fetch(`${API_URL}/activities/${activityId}/slots`, { cache: 'no-store' });
      if (!r.ok) throw new Error(String(r.status));
      slots = await r.json();
    } catch (e) {
      console.error('BOOKING: fallo al leer horarios de Nest:', e);
      return bad('Servidor de reservas no disponible', 502);
    }
    const label = it.name ?? it.id;
    const slot = slots.find(
      (s) => limaDay(s.startsAt) === date && s.capacity - s.booked >= quantity,
    );
    if (!slot) {
      return bad(`Sin cupo para "${label}" el ${date}. Elige otra fecha o menos personas.`, 409);
    }
    plan.push({ name: label, slotId: slot.id, quantity });
  }

  // 2) Reservar
  const done: { activity: string; bookingId: number }[] = [];
  for (const p of plan) {
    try {
      const r = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: p.slotId,
          quantity: p.quantity,
          customerName,
          customerContact,
        }),
        cache: 'no-store',
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        return NextResponse.json(
          {
            ok: false,
            message: `No se pudo reservar "${p.name}": ${data?.message ?? r.status}`,
            done,
          },
          { status: r.status === 409 ? 409 : 502 },
        );
      }
      done.push({ activity: p.name, bookingId: data.id });
    } catch (e) {
      console.error('BOOKING: fallo al reservar en Nest:', e);
      return bad('Servidor de reservas no disponible', 502);
    }
  }

  return NextResponse.json({ ok: true, bookings: done });
}