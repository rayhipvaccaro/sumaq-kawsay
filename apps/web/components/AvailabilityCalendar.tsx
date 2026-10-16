'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Day = { date: string; free: number; capacity: number; status: 'open' | 'full' };
type Avail = Record<string, Day[]>;
type State = 'loading' | 'unknown' | 'past' | 'open' | 'full' | 'none';

type Props = {
  value: string;
  onChange: (date: string) => void;
  lang?: 'es' | 'en';
  only?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayLima = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });

export function AvailabilityCalendar({ value, onChange, lang = 'es', only }: Props) {
  const isEs = lang === 'es';
  const today = todayLima();
  const start = value && value >= today ? value : today;

  const [cursor, setCursor] = useState(() => ({
    y: Number(start.slice(0, 4)),
    m: Number(start.slice(5, 7)) - 1,
  }));
  const [cache, setCache] = useState<Record<string, Avail | 'error'>>({});

  const key = `${cursor.y}-${pad(cursor.m + 1)}`;
  const lastDay = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const first = ymd(cursor.y, cursor.m, 1);
  const last = ymd(cursor.y, cursor.m, lastDay);
  const hasData = cache[key] !== undefined;

  useEffect(() => {
    if (hasData) return;
    let cancelled = false;
    const from = first > today ? first : today;
    fetch(`/api/availability?from=${from}&to=${last}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (!cancelled) setCache((c) => ({ ...c, [key]: d.activities as Avail }));
      })
      .catch(() => {
        if (!cancelled) setCache((c) => ({ ...c, [key]: 'error' }));
      });
    return () => {
      cancelled = true;
    };
  }, [hasData, key, first, last, today]);

  const data = cache[key];

  const infoOf = (date: string): { s: State; n: number } => {
    if (date < today) return { s: 'past', n: 0 };
    if (data === undefined) return { s: 'loading', n: 0 };
    if (data === 'error') return { s: 'unknown', n: 0 };
    let open = 0;
    let full = 0;
      for (const [k, days] of Object.entries(data)) {
      if (only && k !== only) continue;
      const d = days.find((x) => x.date === date);
      if (!d) continue;
      if (d.status === 'open') open++;
      else full++;
    }
    if (open > 0) return { s: 'open', n: open };
    if (full > 0) return { s: 'full', n: 0 };
    return { s: 'none', n: 0 };
  };

  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleDateString(
    isEs ? 'es-PE' : 'en-US',
    { month: 'long', year: 'numeric' },
  );
  const weekdays = isEs
    ? ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const blanks = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7;

  const currentMonth = `${today.slice(0, 7)}`;
  const canGoBack = key > currentMonth;
  const go = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const titleOf = (s: State, n: number) => {
    if (s === 'open') return isEs ? `${n} experiencia(s) con cupo` : `${n} experience(s) available`;
    if (s === 'full') return isEs ? 'Agotado' : 'Sold out';
    if (s === 'none') return isEs ? 'Sin horarios' : 'No schedule';
    if (s === 'past') return isEs ? 'Fecha pasada' : 'Past date';
    return '';
  };

  const cells = [];
  for (let i = 0; i < blanks; i++) cells.push(<div key={`b${i}`} />);
  for (let d = 1; d <= lastDay; d++) {
    const date = ymd(cursor.y, cursor.m, d);
    const { s, n } = infoOf(date);
    const selectable = s === 'open' || s === 'unknown';
    const selected = date === value;
    let cls = 'bg-stone-100 text-stone-400 cursor-not-allowed';
    if (s === 'open') cls = 'bg-[#2E5A36]/15 text-[#1F3D25] border border-[#2E5A36]/60 hover:bg-[#2E5A36] hover:text-white';
    if (s === 'unknown') cls = 'bg-white text-stone-800 border border-stone-300 hover:bg-[#FDE8B5]';
    if (s === 'full') cls = 'bg-[#9E2021]/10 text-[#9E2021] border border-[#9E2021]/40 cursor-not-allowed';
    if (s === 'loading') cls = 'bg-stone-100 text-stone-300 animate-pulse cursor-wait';
    if (selected && selectable) cls = 'bg-[#442A19] text-white border border-[#442A19]';
    cells.push(
      <button
        key={date}
        type="button"
        disabled={!selectable}
        title={titleOf(s, n)}
        aria-label={`${date} ${titleOf(s, n)}`}
        onClick={() => onChange(date)}
        className={`h-9 rounded-lg text-sm font-semibold transition-colors ${cls}`}
      >
        {d}
      </button>,
    );
  }

  return (
    <div className="max-w-sm rounded-2xl border border-[#E4D5B7] bg-[#FBF6EC] p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!canGoBack}
          aria-label={isEs ? 'Mes anterior' : 'Previous month'}
          className="rounded-lg p-1.5 text-[#442A19] hover:bg-[#FDE8B5] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold capitalize text-[#442A19]">{monthLabel}</span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={isEs ? 'Mes siguiente' : 'Next month'}
          className="rounded-lg p-1.5 text-[#442A19] hover:bg-[#FDE8B5]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#66422B]">
        {weekdays.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{cells}</div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-600">
        <span className="flex items-center gap-1">
          <i className="h-2.5 w-2.5 rounded-sm border border-[#2E5A36]/60 bg-[#2E5A36]/30" />
          {isEs ? 'Con cupo' : 'Available'}
        </span>
        <span className="flex items-center gap-1">
          <i className="h-2.5 w-2.5 rounded-sm border border-[#9E2021]/40 bg-[#9E2021]/20" />
          {isEs ? 'Agotado' : 'Sold out'}
        </span>
        <span className="flex items-center gap-1">
          <i className="h-2.5 w-2.5 rounded-sm bg-stone-200" />
          {isEs ? 'Sin horarios' : 'No schedule'}
        </span>
      </div>
      {data === 'error' && (
        <p className="mt-2 text-[11px] text-[#9E2021]">
          {isEs
            ? 'No pude leer los cupos. Puedes elegir fecha, pero se confirmará al reservar.'
            : 'Could not load availability. You can pick a date; it will be confirmed on booking.'}
        </p>
      )}
    </div>
  );
}