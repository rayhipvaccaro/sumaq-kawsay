'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Activity, api, Board, Booking, dayKey, Run } from '@/components/admin/mi-area/ui';
import { HoyTab } from '@/components/admin/mi-area/HoyTab';
import { ResourcesTab } from '@/components/admin/mi-area/ResourcesTab';
import { RoutesTab } from '@/components/admin/mi-area/RoutesTab';
import { SlotsTab } from '@/components/admin/mi-area/SlotsTab';
import { BookingsTab } from '@/components/admin/mi-area/BookingsTab';
import { SettingsTab } from '@/components/admin/mi-area/SettingsTab';

type Tab = 'hoy' | 'recursos' | 'rutas' | 'slots' | 'bookings' | 'settings';
type Msg = { ok: boolean; text: string };

export default function MiAreaPage() {
  const [acts, setActs] = useState<Activity[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>('hoy');
  const [date, setDate] = useState(() => dayKey(new Date()));
  const [board, setBoard] = useState<Board | null>(null);
  const [books, setBooks] = useState<Booking[]>([]);
  const [msg, setMsg] = useState<Msg | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  const act = acts.find((a) => a.id === sel) ?? acts[0] ?? null;
  const actId = act?.id;
  const label = act?.resourceLabel ?? null;

  const allowed: Tab[] = label ? ['hoy', 'recursos', 'rutas', 'bookings', 'settings'] : ['slots', 'bookings', 'settings'];
  const activeTab: Tab = allowed.includes(tab) ? tab : allowed[0];

  useEffect(() => {
    let off = false;
    api('me/activities')
      .then((a: Activity[]) => { if (!off) setActs(a); })
      .catch((e: Error) => { if (!off) setMsg({ ok: false, text: e.message }); })
      .finally(() => { if (!off) setLoaded(true); });
    return () => { off = true; };
  }, [tick]);

  useEffect(() => {
    if (!actId) return;
    let off = false;
    const bk = api(`me/bookings?activityId=${actId}&limit=500`) as Promise<Booking[]>;
    const bd = label ? (api(`activities/${actId}/board?date=${date}`) as Promise<Board>) : Promise.resolve(null);
    Promise.all([bk, bd])
      .then(([b, d]) => { if (!off) { setBooks(b); setBoard(d); } })
      .catch((e: Error) => { if (!off) setMsg({ ok: false, text: e.message }); });
    return () => { off = true; };
  }, [actId, label, date, tick]);

  const run: Run = async (fn) => {
    setMsg(null);
    try {
      const t = await fn();
      setTick((n) => n + 1);
      if (t) setMsg({ ok: true, text: t });
    } catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
  };

  const tabs: { k: Tab; t: string }[] = label
    ? [{ k: 'hoy', t: 'Hoy' }, { k: 'recursos', t: `${label}s` }, { k: 'rutas', t: 'Rutas' }, { k: 'bookings', t: 'Reservas' }, { k: 'settings', t: 'Ajustes' }]
    : [{ k: 'slots', t: 'Horarios' }, { k: 'bookings', t: 'Reservas' }, { k: 'settings', t: 'Ajustes' }];

  return (
    <div className="max-w-5xl space-y-5">
      <PageHeader title="Mi área" help="Cada día: revisa tus recursos, atiende a los turistas y marca cuando terminan. El cupo se calcula solo y la web lo usa para reservar." />
      {msg && (
        <div className={`p-3 rounded-lg border text-sm ${msg.ok ? 'bg-green-50 border-green-400 text-green-900' : 'bg-red-50 border-red-300 text-red-800'}`}>{msg.text}</div>
      )}
      {loaded && acts.length === 0 && <p className="text-stone-600 text-sm">No hay servicios en tu área.</p>}

      {acts.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {acts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSel(a.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${a.id === act?.id ? 'bg-[#F6A935] border-[#B7791F] text-[#181513]' : 'bg-white border-stone-400 text-stone-800 hover:bg-stone-100'}`}
            >
              {a.name} <span className="text-xs font-normal">· {a.area.name}</span>
            </button>
          ))}
        </div>
      )}

      {act && (
        <>
          <div className="flex flex-wrap gap-1 border-b border-stone-300">
            {tabs.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg ${activeTab === t.k ? 'bg-white border border-b-white border-stone-300 -mb-px text-stone-900' : 'text-stone-600 hover:text-stone-900'}`}
              >{t.t}</button>
            ))}
          </div>

          {activeTab === 'hoy' && label && <HoyTab key={act.id} label={label} board={board} date={date} setDate={setDate} actId={act.id} run={run} />}
          {activeTab === 'recursos' && label && <ResourcesTab key={act.id} act={act} label={label} board={board} run={run} />}
          {activeTab === 'rutas' && label && <RoutesTab key={act.id} act={act} board={board} run={run} />}
          {activeTab === 'slots' && <SlotsTab key={act.id} act={act} run={run} />}
          {activeTab === 'bookings' && <BookingsTab key={act.id} books={books} />}
          {activeTab === 'settings' && <SettingsTab key={act.id} act={act} run={run} />}
        </>
      )}
    </div>
  );
}