'use client';

import { useEffect, useRef, useState } from 'react';
import { api, Board, dayKey, BPending, BRes, BRun, BTN, BTN2, CARD, Field, Help, INPUT, Run, timeLabel } from './ui';

function beep() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; g.gain.value = 0.2;
    o.start(); o.stop(ctx.currentTime + 0.7);
  } catch { /* sin audio */ }
}
const mmss = (s: number) => {
  const a = Math.abs(s);
  return `${s < 0 ? '+' : ''}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
};

function resState(r: BRes) {
  if (!r.active) return { t: 'Inhabilitado', c: 'bg-stone-200 text-stone-700' };
  if (r.status === 'REST') return { t: 'Descanso', c: 'bg-stone-200 text-stone-700' };
  if (r.status === 'MAINTENANCE') return { t: 'Mantenimiento', c: 'bg-stone-200 text-stone-700' };
  if (r.unassigned) return { t: 'Sin encargado hoy', c: 'bg-amber-100 text-amber-900' };
  if (r.busy) return { t: 'En recorrido', c: 'bg-blue-100 text-blue-900' };
  if (r.left <= 0) return { t: 'Sin vueltas', c: 'bg-stone-200 text-stone-700' };
  return { t: 'Libre', c: 'bg-green-100 text-green-900' };
}

function ResCard({ r, date, board, run }: { r: BRes; date: string; board: Board; run: Run }) {
  const [trips, setTrips] = useState('');
  const st = resState(r);
  const val = trips === '' ? r.trips : Number(trips);
  return (
    <div className="p-3 rounded-lg border border-stone-300 bg-white space-y-2">
      <div className="flex items-center justify-between gap-2">
        <b className="text-stone-900">{r.name}</b>
        <span className={`text-xs px-2 py-0.5 rounded-full ${st.c}`}>{st.t}</span>
      </div>
      <div className="text-xs text-stone-600">
        Encargado: {r.ownerId ? board.names[r.ownerId] ?? `#${r.ownerId}` : 'sin dueño'}
        {r.coverId ? ` · hoy lo cubre ${board.names[r.coverId] ?? `#${r.coverId}`}` : ''}
      </div>
      <div className="text-sm text-stone-800">Vueltas hoy: <b>{r.used}</b> de <b>{r.trips}</b></div>
      {r.takeable ? (
        <button className={BTN} onClick={() => run(async () => { await api(`resources/${r.id}/take`, 'POST', { date }); return `Tomaste a ${r.name}`; })}>
          Tomar a cargo hoy
        </button>
      ) : (
        <div className="flex items-end gap-2">
          <Field label="Vueltas de hoy">
            <input type="number" min={0} max={6} className={`${INPUT} w-20`} value={val} onChange={(e) => setTrips(e.target.value)} />
          </Field>
          <button
            className={BTN2}
            disabled={trips === '' || Number(trips) === r.trips}
            onClick={() => run(async () => {
              await api(`resources/${r.id}/day`, 'PUT', { date, trips: Number(trips) });
              setTrips('');
              return `${r.name}: ${trips} vueltas hoy`;
            })}
          >Guardar</button>
        </div>
      )}
    </div>
  );
}

function PendingRow({ p, board, run, locked }: { p: BPending; board: Board; run: Run; locked: boolean }) {
  const [routeId, setRouteId] = useState('');
  const [resId, setResId] = useState('');
  const [min, setMin] = useState('');
  const route = board.routes.find((r) => r.id === Number(routeId));
  const free = board.resources.filter((r) => r.mine && r.working && !r.busy && r.left > 0);
  return (
    <div className="p-3 rounded-lg border border-stone-300 bg-white space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <b className="text-stone-900">{p.customerName}</b>
          <span className="text-sm text-stone-600"> · {p.customerDoc ? `DNI/Pas. ${p.customerDoc}` : p.customerContact}</span>
          {p.arrivalTime && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">Llega {p.arrivalTime}</span>}
        </div>
        <span className="text-sm text-stone-800">Faltan <b>{p.pending}</b> de {p.quantity}</span>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Ruta">
          <select className={INPUT} value={routeId} onChange={(e) => { setRouteId(e.target.value); setMin(''); }}>
            <option value="">Elige…</option>
            {board.routes.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.minMin}-{r.maxMin} min)</option>)}
          </select>
        </Field>
        <Field label="Recurso">
          <select className={INPUT} value={resId} onChange={(e) => setResId(e.target.value)}>
            <option value="">Elige…</option>
            {free.map((r) => <option key={r.id} value={r.id}>{r.name} ({r.left} vueltas)</option>)}
          </select>
        </Field>
        <Field label="Minutos">
          <input type="number" min={1} className={`${INPUT} w-20`} placeholder={route ? String(route.maxMin) : ''} value={min} onChange={(e) => setMin(e.target.value)} />
        </Field>
        <button
          className={BTN}
          disabled={locked || !routeId || !resId}
          onClick={() => run(async () => {
            await api('runs/start', 'POST', {
              bookingId: p.bookingId, routeId: Number(routeId), resourceId: Number(resId), ...(min ? { minutes: Number(min) } : {}),
            });
            setRouteId(''); setResId(''); setMin('');
            return `Iniciado: ${p.customerName}`;
          })}
        >Iniciar</button>
        <button
          className={BTN2}
          disabled={locked}
          onClick={() => run(async () => {
            const reason = window.prompt('Motivo (no llegó, canceló, otro)');
            if (!reason) return;
            await api('runs/skip', 'POST', { bookingId: p.bookingId, reason });
            return 'Marcado como no realizado';
          })}
        >No lo hizo</button>
      </div>
      {locked && <p className="text-xs text-amber-800">Aún no es su día. Puedes elegir ruta y recurso, pero no iniciar.</p>}
    </div>
  );
}

function RunCard({ r, now, board, run }: { r: BRun; now: number; board: Board; run: Run }) {
  const left = r.plannedEndAt ? Math.round((new Date(r.plannedEndAt).getTime() - now) / 1000) : 0;
  const over = left <= 0;
  const covered = r.ownerId != null && r.startedById !== r.ownerId;
  return (
    <div className={`p-3 rounded-lg border space-y-2 ${over ? 'border-red-500 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <b className="text-stone-900">{r.customerName}</b>
          <span className="text-sm text-stone-600"> · {r.routeName} · {r.resourceName}</span>
          {covered && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Cubierto</span>}
        </div>
        <div className={`text-2xl font-extrabold tabular-nums ${over ? 'text-red-700' : 'text-blue-900'}`}>{mmss(left)}</div>
      </div>
      <div className="text-xs text-stone-700">
        Inició {r.startedAt ? timeLabel(r.startedAt) : ''} · fin estimado {r.plannedEndAt ? timeLabel(r.plannedEndAt) : ''}
        {r.startedById ? ` · lo inició ${board.names[r.startedById] ?? `#${r.startedById}`}` : ''}
      </div>
      {over && <div className="text-sm font-bold text-red-700">Tiempo cumplido. Pulsa Terminó actividad cuando llegue.</div>}
      {r.mine && (
        <div className="flex gap-2">
          <button className={BTN} onClick={() => run(async () => { await api(`runs/${r.id}/finish`, 'POST', {}); return `Terminó: ${r.customerName}`; })}>
            Terminó actividad
          </button>
          <button
            className={BTN2}
            onClick={() => run(async () => {
              const reason = window.prompt('Motivo por el que no se completó');
              if (!reason) return;
              await api(`runs/${r.id}/finish`, 'POST', { notDone: true, reason });
              return 'Marcado como no realizado';
            })}
          >No se completó</button>
        </div>
      )}
    </div>
  );
}

export function HoyTab({ label, board, date, setDate, actId, run }: {
  label: string; board: Board | null; date: string; setDate: (d: string) => void; actId: number; run: Run;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [alarm, setAlarm] = useState<string | null>(null);
  const runsRef = useRef<BRun[]>([]);
  const seen = useRef<Set<number>>(new Set());

  useEffect(() => { runsRef.current = board?.runs ?? []; }, [board]);
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      for (const r of runsRef.current) {
        if (r.status === 'IN_PROGRESS' && r.mine && r.plannedEndAt && new Date(r.plannedEndAt).getTime() <= t && !seen.current.has(r.id)) {
          seen.current.add(r.id);
          beep();
          setAlarm(`Tiempo cumplido: ${r.customerName} (${r.resourceName ?? ''})`);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!board) return <Help>Cargando…</Help>;
  const inProgress = board.runs.filter((r) => r.status === 'IN_PROGRESS');
  const closed = board.runs.filter((r) => r.status !== 'IN_PROGRESS');
  const free = Math.max(0, board.slotCapacity - board.booked);

  return (
    <div className="space-y-4">
      {alarm && (
        <div className="p-3 rounded-lg bg-red-600 text-white font-bold flex items-center justify-between">
          <span>{alarm}</span>
          <button className="px-2 py-1 rounded bg-white text-red-700 text-xs" onClick={() => setAlarm(null)}>Entendido</button>
        </div>
      )}

      <div className={CARD}>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Día"><input type="date" className={INPUT} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} /></Field>
          <div className="px-3 py-2 rounded-lg bg-stone-100"><div className="text-xl font-extrabold">{board.capacity}</div><div className="text-xs text-stone-600">Cupo del día (calculado)</div></div>
          <div className="px-3 py-2 rounded-lg bg-stone-100"><div className="text-xl font-extrabold">{board.booked}</div><div className="text-xs text-stone-600">Reservados</div></div>
          <div className="px-3 py-2 rounded-lg bg-stone-100"><div className="text-xl font-extrabold">{free}</div><div className="text-xs text-stone-600">Libres en el sitio</div></div>
          {!board.isAdmin && (
            <>
              <button className={BTN2} onClick={() => run(async () => { await api(`activities/${actId}/absent`, 'PUT', { date, absent: true }); return 'Tus recursos quedan sin encargado hoy'; })}>Hoy no vengo</button>
              <button className={BTN2} onClick={() => run(async () => { await api(`activities/${actId}/absent`, 'PUT', { date, absent: false }); return 'Listo, ya estás de vuelta'; })}>Ya llegué</button>
            </>
          )}
        </div>
        {board.capacity > 0 && board.slotCapacity === 0 && (
          <p className="text-xs text-amber-800">Este día aún no está abierto en el calendario. Ábrelo en la pestaña Recursos.</p>
        )}
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Mis {label.toLowerCase()}s hoy</h3>
        <Help>Cada tarjeta es tuya hoy. Si un compañero faltó, sus recursos salen aquí con el botón Tomar a cargo.</Help>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {board.resources.map((r) => <ResCard key={r.id} r={r} date={date} board={board} run={run} />)}
          {board.resources.length === 0 && <p className="text-sm text-stone-600">No tienes recursos asignados. Pídele al admin que te asigne.</p>}
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">En curso ({inProgress.length})</h3>
        <div className="space-y-2">
          {inProgress.map((r) => <RunCard key={r.id} r={r} now={now} board={board} run={run} />)}
          {inProgress.length === 0 && <p className="text-sm text-stone-600">Nadie en recorrido ahora.</p>}
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Turistas por atender ({board.pending.reduce((s, p) => s + p.pending, 0)})</h3>
        <Help>Elige ruta y recurso, y pulsa Iniciar. Si el turista no llegó, pulsa No lo hizo y escribe el motivo.</Help>
        {board.routes.length === 0 && <p className="text-sm text-amber-800">Falta crear las rutas (pestaña Rutas).</p>}
        <div className="space-y-2">
          {board.pending.map((p) => <PendingRow key={p.bookingId} p={p} board={board} run={run} locked={date !== dayKey(new Date())} />)}
          {board.pending.length === 0 && <p className="text-sm text-stone-600">No hay turistas pendientes este día.</p>}
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Próximas reservas ({board.upcoming.length})</h3>
        <Help>Reservas de los próximos 14 días. Pulsa Ver día para preparar su recorrido.</Help>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {board.upcoming.map((u) => (
            <div key={u.bookingId} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border border-stone-300 bg-white text-sm">
              <span>
                <b>{u.customerName}</b> · {u.quantity} pers. · {u.date}
                {u.arrivalTime ? ` · llega ${u.arrivalTime}` : ''}
                {u.customerDoc ? ` · ${u.customerDoc}` : ''}
              </span>
              <button className={BTN2} onClick={() => setDate(u.date)}>Ver día</button>
            </div>
          ))}
          {board.upcoming.length === 0 && <p className="text-sm text-stone-600">No hay reservas próximas.</p>}
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Cerrados hoy ({closed.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-stone-600 text-xs">
              <tr><th className="p-1">Turista</th><th>Ruta</th><th>Recurso</th><th>Inicio</th><th>Fin</th><th>Resultado</th></tr>
            </thead>
            <tbody>
              {closed.map((r) => (
                <tr key={r.id} className="border-t border-stone-200">
                  <td className="p-1">{r.customerName}{r.customerDoc ? ` · ${r.customerDoc}` : ''}</td>
                  <td>{r.routeName ?? '—'}</td>
                  <td>{r.resourceName ?? '—'}</td>
                  <td>{r.startedAt ? timeLabel(r.startedAt) : '—'}</td>
                  <td>{r.endedAt ? timeLabel(r.endedAt) : '—'}</td>
                  <td>{r.status === 'DONE' ? <span className="text-green-800 font-semibold">Realizada</span> : <span className="text-red-800 font-semibold">No realizada{r.reason ? `: ${r.reason}` : ''}</span>}</td>
                </tr>
              ))}
              {closed.length === 0 && <tr><td colSpan={6} className="p-2 text-stone-600">Aún no hay cerrados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}