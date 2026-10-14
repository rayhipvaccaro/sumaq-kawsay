'use client';

import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';

interface Slot { id: number; startsAt: string; endsAt: string; capacity: number; booked: number }
interface Activity { id: number; name: string; area: { id: number; name: string }; slots: Slot[] }
interface Booking {
  id: number; quantity: number; customerName: string; customerContact: string; status: string; createdAt: string;
  slot: { id: number; startsAt: string; activity: { id: number; name: string } };
}

const INPUT = 'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm placeholder-stone-500 focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';
const BTN = 'px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm disabled:opacity-60';
const BTN2 = 'px-2.5 py-1.5 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-400';

async function api(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`/api/nest/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const m = Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? data?.error;
    throw new Error(m || 'Error');
  }
  return data;
}

const fmt = (d: string) =>
  new Date(d).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });

export default function MiAreaPage() {
  const [acts, setActs] = useState<Activity[]>([]);
  const [books, setBooks] = useState<Booking[]>([]);
  const [msg, setMsg] = useState('');
  const [when, setWhen] = useState<Record<number, string>>({});
  const [cap, setCap] = useState<Record<number, string>>({});

  const load = useCallback(async () => {
    try {
      const [a, b] = await Promise.all([api('me/activities'), api('me/bookings?limit=100')]);
      setActs(a); setBooks(b);
    } catch (e) { setMsg((e as Error).message); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<void>) => {
    setMsg('');
    try { await fn(); await load(); } catch (e) { setMsg((e as Error).message); }
  };

  return (
    <div>
      <div className="max-w-5xl space-y-8">
        <PageHeader title="Mi área" help="Agrega los horarios de tu servicio y mira quién reservó. Solo ves y editas lo de tu área." />
        {msg && <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-sm">{msg}</div>}

        {acts.length === 0 && <p className="text-stone-600 text-sm">No hay actividades en tu área.</p>}
        {acts.map((a) => (
          <section key={a.id} className="p-4 rounded-xl border border-stone-300 bg-white space-y-3">
            <h2 className="font-bold text-lg text-stone-900">{a.name} <span className="text-xs text-stone-600">· {a.area.name}</span></h2>
            <div className="flex flex-wrap gap-2 items-center">
              <input type="datetime-local" className={INPUT} value={when[a.id] ?? ''} onChange={(e) => setWhen({ ...when, [a.id]: e.target.value })} />
              <input type="number" min={1} className={`${INPUT} w-24`} placeholder="Cupos" value={cap[a.id] ?? ''} onChange={(e) => setCap({ ...cap, [a.id]: e.target.value })} />
              <button
                className={BTN}
                onClick={() => run(async () => {
                  if (!when[a.id]) throw new Error('Elige fecha y hora');
                  await api(`activities/${a.id}/slots`, 'POST', {
                    startsAt: new Date(when[a.id]).toISOString(),
                    ...(cap[a.id] ? { capacity: Number(cap[a.id]) } : {}),
                  });
                })}
              >Agregar horario</button>
            </div>
            <ul className="text-sm divide-y divide-stone-200">
              {a.slots.map((s) => (
                <li key={s.id} className="py-1.5 flex items-center justify-between gap-2">
                  <span>{fmt(s.startsAt)} · {s.booked}/{s.capacity} cupos</span>
                  <button className={BTN2} onClick={() => run(async () => { await api(`slots/${s.id}`, 'DELETE'); })}>Quitar</button>
                </li>
              ))}
              {a.slots.length === 0 && <li className="py-1.5 text-stone-600">Sin horarios próximos.</li>}
            </ul>
          </section>
        ))}

        <section className="space-y-2 bg-white border border-stone-300 rounded-xl p-4">
          <h2 className="font-bold text-lg text-stone-900">Reservas de mi área</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-stone-600">
                <tr><th className="p-2">Actividad</th><th>Horario</th><th>Cliente</th><th>Contacto</th><th>Pers.</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id} className="border-t border-stone-300">
                    <td className="p-2">{b.slot.activity.name}</td>
                    <td>{fmt(b.slot.startsAt)}</td>
                    <td>{b.customerName}</td>
                    <td>{b.customerContact}</td>
                    <td>{b.quantity}</td>
                    <td>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
