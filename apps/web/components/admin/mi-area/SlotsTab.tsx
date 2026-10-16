'use client';

import { useState } from 'react';
import { Activity, api, BTN, BTN2, CARD, dayKey, dayLabel, Field, Help, INPUT, Run, timeLabel, Slot } from './ui';

export function SlotsTab({ act, run }: { act: Activity; run: Run }) {
  const [when, setWhen] = useState('');
  const [cap, setCap] = useState('');

  const groups: { key: string; items: Slot[] }[] = [];
  for (const s of act.slots) {
    const k = dayKey(s.startsAt);
    const g = groups[groups.length - 1];
    if (g && g.key === k) g.items.push(s);
    else groups.push({ key: k, items: [s] });
  }

  return (
    <div className="space-y-4">
      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Horarios próximos</h3>
        <Help>
          Verde: hay cupos. Ámbar: quedan pocos. Rojo: lleno. <b>auto</b> = viene de un recorrido y su cupo se calcula solo.
          <b> manual</b> = lo escribiste a mano. Un horario con reservas no se puede quitar. Se muestran los próximos 50.
        </Help>
        {groups.length === 0 && <p className="text-sm text-stone-600">Sin horarios próximos.</p>}
        {groups.map((g) => (
          <div key={g.key} className="border border-stone-200 rounded-lg overflow-hidden">
            <div className="px-3 py-1.5 bg-stone-100 text-sm font-semibold text-stone-800 capitalize">{dayLabel(g.items[0].startsAt)}</div>
            <ul className="divide-y divide-stone-200">
              {g.items.map((s) => {
                const free = s.capacity - s.booked;
                const pct = s.capacity > 0 ? Math.min(100, (s.booked / s.capacity) * 100) : 100;
                const tone = free <= 0 ? 'bg-red-500' : s.capacity > 0 && free / s.capacity <= 0.3 ? 'bg-amber-500' : 'bg-green-600';
                return (
                  <li key={s.id} className="px-3 py-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="w-14 font-semibold text-stone-900">{timeLabel(s.startsAt)}</span>
                    <div className="flex-1 min-w-[120px] h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-40 text-stone-700">{s.booked}/{s.capacity} · {free <= 0 ? 'Lleno' : `quedan ${free}`}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${s.tripId ? 'border-green-600 text-green-800' : 'border-stone-400 text-stone-600'}`}>{s.tripId ? 'auto' : 'manual'}</span>
                    <button
                      className={BTN2}
                      disabled={s.booked > 0}
                      title={s.booked > 0 ? 'Tiene reservas' : ''}
                      onClick={() => run(async () => { await api(`slots/${s.id}`, 'DELETE'); return 'Horario quitado'; })}
                    >Quitar</button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <details className={CARD}>
        <summary className="cursor-pointer font-bold text-stone-900">Agregar un horario suelto (avanzado)</summary>
        <div className="mt-3 space-y-3">
          <Help>Úsalo solo si no trabajas con recorridos. El cupo lo escribes tú y no se recalcula.</Help>
          <div className="flex flex-wrap gap-3 items-end">
            <Field label="Fecha y hora"><input type="datetime-local" className={INPUT} value={when} onChange={(e) => setWhen(e.target.value)} /></Field>
            <Field label="Cupos"><input type="number" min={1} className={`${INPUT} w-24`} value={cap} onChange={(e) => setCap(e.target.value)} /></Field>
            <button
              className={BTN}
              onClick={() => run(async () => {
                if (!when) throw new Error('Elige fecha y hora');
                await api(`activities/${act.id}/slots`, 'POST', {
                  startsAt: new Date(when).toISOString(),
                  ...(cap ? { capacity: Number(cap) } : {}),
                });
                setWhen(''); setCap('');
                return 'Horario agregado';
              })}
            >Agregar</button>
          </div>
        </div>
      </details>
    </div>
  );
}