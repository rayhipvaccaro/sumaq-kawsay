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

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const from = req.nextUrl.searchParams.get('from') ?? '';
  const to = req.nextUrl.searchParams.get('to') ?? '';
  if (!DATE.test(from) || !DATE.test(to)) {
    return NextResponse.json(
      { ok: false, message: 'from y to deben ser YYYY-MM-DD' },
      { status: 400 },
    );
  }
  try {
    const entries = await Promise.all(
      Object.entries(NEST_ACTIVITY).map(async ([key, id]) => {
        const r = await fetch(
          `${API_URL}/activities/${id}/availability?from=${from}&to=${to}`,
          { cache: 'no-store' },
        );
        if (!r.ok) throw new Error(String(r.status));
        const data = await r.json();
        return [key, data.days] as const;
      }),
    );
    return NextResponse.json({ ok: true, activities: Object.fromEntries(entries) });
  } catch (e) {
    console.error('AVAILABILITY: fallo al leer Nest:', e);
    return NextResponse.json(
      { ok: false, message: 'Servidor de reservas no disponible' },
      { status: 502 },
    );
  }
}