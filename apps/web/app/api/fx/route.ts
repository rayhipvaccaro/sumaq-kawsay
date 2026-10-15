import { NextResponse } from 'next/server';
import { DEFAULT_RATES, DEFAULT_UPDATED } from '@/data/currencies';

// Tipos de cambio en vivo (sin clave). Si falla internet, se usan los de respaldo.
export async function GET() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/PEN', {
      next: { revalidate: 6 * 60 * 60 },
    });
    if (!r.ok) throw new Error(String(r.status));
    const j = (await r.json()) as {
      result?: string;
      time_last_update_utc?: string;
      rates?: Record<string, number>;
    };
    if (j.result !== 'success' || !j.rates || typeof j.rates.USD !== 'number') {
      throw new Error('respuesta invalida');
    }
    return NextResponse.json({
      source: 'live',
      updatedAt: j.time_last_update_utc ?? new Date().toISOString(),
      rates: { ...j.rates, PEN: 1 },
    });
  } catch (e) {
    console.warn('FX: usando tipos de cambio de respaldo:', e);
    return NextResponse.json({ source: 'default', updatedAt: DEFAULT_UPDATED, rates: DEFAULT_RATES });
  }
}
