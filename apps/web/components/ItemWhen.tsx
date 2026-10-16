'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { AvailabilityCalendar } from './AvailabilityCalendar';

const HOURS = Array.from({ length: 21 }, (_, i) => {
  const m = 7 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
});

type Props = {
  id: string;
  date: string;
  time: string;
  lang: 'es' | 'en';
  onChange: (w: { date: string; time: string }) => void;
  onFree: (id: string, free: number | null) => void;
};

export function ItemWhen({ id, date, time, lang, onChange, onFree }: Props) {
  const isEs = lang === 'es';
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?from=${date}&to=${date}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (cancelled) return;
        const days = (d.activities?.[id] ?? []) as { date: string; free: number }[];
        const day = days.find((x) => x.date === date);
        onFree(id, day ? day.free : null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, date]);

  return (
    <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left text-xs font-bold text-stone-800"
      >
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {date} · {time}
        </span>
        <span className="text-[#442A19]">
          {open ? (isEs ? 'Cerrar' : 'Close') : isEs ? 'Cambiar' : 'Change'}
        </span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <AvailabilityCalendar
            value={date}
            onChange={(d) => onChange({ date: d, time })}
            lang={lang}
            only={id}
          />
          <label className="block text-xs font-bold text-stone-800">
            {isEs ? 'Hora de llegada' : 'Arrival time'}
            <select
              value={time}
              onChange={(e) => onChange({ date, time: e.target.value })}
              className="block mt-1 px-3 py-2 rounded-lg border border-stone-400 bg-white text-sm"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}