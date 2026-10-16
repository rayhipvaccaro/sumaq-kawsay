import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import type { Reservation, ReservationItemSelection } from '@/data/businessData';
import { mutateCms, nextOrderId } from '@/lib/orderStore';
import { API_URL } from '@/lib/session';
import { getSession } from '@/lib/serverAuth';
import { docError, normDoc } from '@/lib/docs';

// Crea la orden del turista (publico). El servidor pone id, token, estado y pago:
// el cliente no puede mandarlos. PENDIENTE antes de cobrar de verdad: recalcular
// los totales aqui con los precios del CMS, hoy se confia en el total que manda el asistente.

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 15;
}

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const num = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);

function cleanItem(raw: unknown): ReservationItemSelection | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  return {
    itemId: str(r.itemId, 80),
    name: str(r.name, 160),
    area: str(r.area, 40) as ReservationItemSelection['area'],
    quantity: Math.max(0, Math.floor(num(r.quantity))),
    unitPricePEN: num(r.unitPricePEN),
    unitPriceUSD: num(r.unitPriceUSD),
    unitCostPEN: num(r.unitCostPEN),
    subtotalPEN: num(r.subtotalPEN),
    subtotalUSD: num(r.subtotalUSD),
    subtotalCostPEN: num(r.subtotalCostPEN),
    details: r.details ? str(r.details, 300) : undefined,
  };
}

const list = (v: unknown) =>
  (Array.isArray(v) ? v.slice(0, 30) : [])
    .map(cleanItem)
    .filter((x): x is ReservationItemSelection => x !== null);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Demasiadas ordenes. Intenta en unos minutos.' }, { status: 429 });
  }

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
  }

  const customerName = str(b.customerName, 120);
  const customerEmail = str(b.customerEmail, 160);
  const customerPhone = str(b.customerPhone, 40);
  const travelDate = str(b.travelDate, 10);
  const guestsCount = Math.floor(num(b.guestsCount));
  const totalPEN = Math.round(num(b.totalPEN) * 100) / 100;
  const totalUSD = Math.round(num(b.totalUSD) * 100) / 100;

  if (customerName.length < 2 || !/^\S+@\S+\.\S+$/.test(customerEmail) || customerPhone.length < 6) {
    return NextResponse.json({ error: 'Faltan nombre, correo o telefono validos' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) {
    return NextResponse.json({ error: 'Fecha invalida' }, { status: 400 });
  }
  if (guestsCount < 1 || guestsCount > 200) {
    return NextResponse.json({ error: 'Cantidad de personas invalida' }, { status: 400 });
  }
  if (!(totalPEN > 0) || totalPEN > 1_000_000) {
    return NextResponse.json({ error: 'Total invalido' }, { status: 400 });
  }

  // Documento obligatorio: DNI (nacionales) o pasaporte (extranjeros)
  const docType = str(b.customerDocType, 12).toUpperCase() as 'DNI' | 'PASAPORTE';
  const docNumber = normDoc(str(b.customerDniOrPassport, 30));
  const dErr = docError(docType, docNumber);
  if (dErr) return NextResponse.json({ error: dErr }, { status: 400 });

  // Agencia: el descuento lo pone el servidor, el cliente no puede mandarlo.
  const user = await getSession(req);
  const agency = user && !user.mustChangePassword && user.role === 'Agencia' ? user : null;
  const tourist = user && !user.mustChangePassword && user.role === 'Turista' ? user : null;
  const pct = agency ? Math.min(100, Math.max(0, Number(agency.discountPct ?? 0))) : 0;
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const listPEN = agency ? r2(num(b.listTotalPEN)) : totalPEN;
  const listUSD = agency ? r2(num(b.listTotalUSD)) : totalUSD;
  if (agency && !(listPEN > 0)) {
    return NextResponse.json({ error: 'Total invalido' }, { status: 400 });
  }
  const finalPEN = agency ? r2(listPEN * (1 - pct / 100)) : totalPEN;
  const finalUSD = agency ? r2(listUSD * (1 - pct / 100)) : totalUSD;
  const passengers = (Array.isArray(b.passengers) ? b.passengers.slice(0, 40) : [])
    .map((p) => {
      const o = (p && typeof p === 'object' ? p : {}) as Record<string, unknown>;
      return { name: str(o.name, 120), doc: str(o.doc, 30) || undefined };
    })
    .filter((p) => p.name);

  // Cuenta del turista: se crea sola con su correo (clave inicial = su documento).
  // Si Nest falla, la orden igual se guarda.
  let customerUserId: number | undefined;
  let account: 'new' | 'linked' | 'conflict' | '' = '';
  if (tourist) {
    // Ya inicio sesion: la reserva va directo a su cuenta.
    customerUserId = tourist.id;
    account = 'linked';
  } else if (!agency) {
    try {
      const r = await fetch(`${API_URL}/customers/ensure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.INTERNAL_API_KEY ? { 'x-internal-key': process.env.INTERNAL_API_KEY } : {}),
        },
        body: JSON.stringify({ email: customerEmail, fullName: customerName, docType, docNumber }),
        cache: 'no-store',
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        if (j.userId) {
          customerUserId = j.userId as number;
          account = j.created ? 'new' : 'linked';
        } else {
          account = 'conflict';
        }
      } else {
        console.error('ORDERS: ensure cuenta fallo:', r.status, j?.message);
      }
    } catch (e) {
      console.error('ORDERS: no se pudo crear la cuenta del turista:', e);
    }
  }

  const stay = b.stayItem ? cleanItem(b.stayItem) : null;
  const activities = list(b.activities);
  const meals = list(b.meals);
  const extras = list(b.extras);
  const now = new Date().toISOString();
  const accessToken = randomBytes(16).toString('hex');

  try {
    const id = await mutateCms((data) => {
      const id = nextOrderId(data.reservations ?? []);
      const order: Reservation = {
        id,
        createdAt: now,
        customerName,
        customerEmail,
        customerPhone,
        customerDniOrPassport: docNumber,
        customerDocType: docType,
        customerUserId,
        ...(agency
          ? {
              agencyUserId: agency.id,
              agencyName: agency.fullName || agency.username,
              agencyDiscountPct: pct,
              listTotalPEN: listPEN,
              listTotalUSD: listUSD,
              passengers,
            }
          : {}),
        travelDate,
        endDate: str(b.endDate, 10) || undefined,
        guestsCount,
        notes: str(b.notes, 600) || undefined,
        stayItem: stay,
        activities,
        meals,
        extras,
        totalPEN: finalPEN,
        totalUSD: finalUSD,
        totalCostPEN: num(b.totalCostPEN),
        grossMarginPEN: agency ? r2(finalPEN - num(b.totalCostPEN)) : num(b.grossMarginPEN),
        status: 'cotizado',
        assignedAgent: 'Valeria Cruz (Ventas & Marketing)',
        paymentStatus: 'pendiente',
        paymentMethod: 'transferencia_bcp',
        invoiceType: 'boleta',
        accessToken,
        amountPaidPEN: 0,
        payments: [],
        emailLogs: [
          {
            id: `log-${Date.now()}`,
            date: now,
            sender: 'sistema@sumaqkawsay.pe',
            recipient: customerEmail,
            subject: `Confirmación de Solicitud de Reserva ${id} · Sumaq Kawsay`,
            body: `Hola ${customerName}, hemos recibido tu solicitud de experiencia integral. Puedes pagar ahora o esperar el contacto de Ventas.`,
            type: 'cotizacion',
          },
        ],
      };
      data.reservations = [order, ...(data.reservations ?? [])];
      return id;
    });
    return NextResponse.json({ id, accessToken, account });
  } catch (e) {
    console.error('ORDERS: no se pudo guardar:', e);
    return NextResponse.json({ error: 'No se pudo guardar la orden' }, { status: 500 });
  }
}
