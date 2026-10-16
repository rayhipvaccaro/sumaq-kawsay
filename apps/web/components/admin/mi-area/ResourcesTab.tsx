'use client';

import { useState } from 'react';
import { Activity, api, Board, BRes, BTN, BTN2, CARD, dayKey, Field, Help, INPUT, KIND_LABEL, Run, STATUS_LABEL } from './ui';

type Edit = Partial<Pick<BRes, 'name' | 'kind' | 'seats' | 'tripsPerDay' | 'status' | 'active' | 'ownerId'>>;

export function ResourcesTab({ act, label, board, run }: { act: Activity; label: string; board: Board | null; run: Run }) {
  const [edits, setEdits] = useState<Record<number, Edit>>({});
  const [nw, setNw] = useState({ name: '', kind: 'main', seats: '1', tripsPerDay: '1', ownerId: '' });
  if (!board) return <Help>Cargando…</Help>;

  const rows = board.resources.map((r) => ({ ...r, ...edits[r.id] }));
  const set = (id: number, p: Edit) => setEdits((e) => ({ ...e, [id]: { ...e[id], ...p } }));
  const who = (id: number | null) => (id ? board.names[id] ?? `#${id}` : 'Sin dueño');
  const KindSel = ({ v, on }: { v: string; on: (k: string) => void }) => (
    <select className={INPUT} value={v} onChange={(e) => on(e.target.value)}>
      {Object.entries(KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );

  return (
    <div className="space-y-4">
      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Mis {label.toLowerCase()}s</h3>
        <Help>
          Aquí defines cada {label.toLowerCase()}: cuántas personas lleva y cuántas vueltas hace por día de fábrica.
          Lo de hoy (lesión, 2 vueltas, etc.) se cambia en la pestaña Hoy. Tipo <b>Guía</b> y <b>Espacio</b> es para terapia:
          el cupo es el menor de los dos.
        </Help>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-stone-600 text-xs">
              <tr><th className="p-1">Nombre</th><th>Tipo</th><th>Encargado</th><th>Personas</th><th>Vueltas de fábrica</th><th>Estado</th><th>Activo</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const dirty = !!edits[r.id];
                return (
                  <tr key={r.id} className={`border-t border-stone-200 ${r.active ? '' : 'opacity-50'}`}>
                    <td className="p-1"><input className={`${INPUT} w-32`} value={r.name} onChange={(e) => set(r.id, { name: e.target.value })} /></td>
                    <td><KindSel v={r.kind} on={(k) => set(r.id, { kind: k })} /></td>
                    <td>
                      {board.isAdmin ? (
                        <select className={INPUT} value={r.ownerId ?? ''} onChange={(e) => set(r.id, { ownerId: e.target.value ? Number(e.target.value) : null })}>
                          <option value="">Sin dueño</option>
                          {board.staff.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
                        </select>
                      ) : <span>{who(r.ownerId)}</span>}
                    </td>
                    <td><input type="number" min={1} className={`${INPUT} w-16`} value={r.seats} onChange={(e) => set(r.id, { seats: Number(e.target.value) })} /></td>
                    <td><input type="number" min={1} max={6} className={`${INPUT} w-16`} value={r.tripsPerDay} onChange={(e) => set(r.id, { tripsPerDay: Number(e.target.value) })} /></td>
                    <td>
                      <select className={INPUT} value={r.status} onChange={(e) => set(r.id, { status: e.target.value as BRes['status'] })}>
                        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td className="text-center"><input type="checkbox" checked={r.active} onChange={(e) => set(r.id, { active: e.target.checked })} /></td>
                    <td>
                      <button
                        className={dirty ? BTN : BTN2}
                        disabled={!dirty}
                        onClick={() => run(async () => {
                          await api(`resources/${r.id}`, 'PATCH', {
                            name: r.name, kind: r.kind, seats: r.seats, tripsPerDay: r.tripsPerDay, status: r.status, active: r.active,
                            ...(board.isAdmin ? { ownerId: r.ownerId } : {}),
                          });
                          setEdits((e) => { const n = { ...e }; delete n[r.id]; return n; });
                          return `${r.name} guardado`;
                        })}
                      >Guardar</button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={8} className="p-3 text-stone-600">Aún no hay recursos. Crea el primero abajo.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Agregar {label.toLowerCase()}</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <Field label="Nombre"><input className={`${INPUT} w-36`} placeholder="Ej. Trueno" value={nw.name} onChange={(e) => setNw({ ...nw, name: e.target.value })} /></Field>
          <Field label="Tipo"><KindSel v={nw.kind} on={(k) => setNw({ ...nw, kind: k })} /></Field>
          {board.isAdmin && (
            <Field label="Encargado">
              <select className={INPUT} value={nw.ownerId} onChange={(e) => setNw({ ...nw, ownerId: e.target.value })}>
                <option value="">Sin dueño</option>
                {board.staff.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </Field>
          )}
          <Field label="Personas"><input type="number" min={1} className={`${INPUT} w-20`} value={nw.seats} onChange={(e) => setNw({ ...nw, seats: e.target.value })} /></Field>
          <Field label="Vueltas de fábrica"><input type="number" min={1} max={6} className={`${INPUT} w-24`} value={nw.tripsPerDay} onChange={(e) => setNw({ ...nw, tripsPerDay: e.target.value })} /></Field>
          <button
            className={BTN}
            onClick={() => run(async () => {
              if (!nw.name.trim()) throw new Error('Pon un nombre');
              await api(`activities/${act.id}/assets`, 'POST', {
                name: nw.name, kind: nw.kind, seats: Number(nw.seats), tripsPerDay: Number(nw.tripsPerDay),
                ...(board.isAdmin && nw.ownerId ? { ownerId: Number(nw.ownerId) } : {}),
              });
              setNw({ name: '', kind: 'main', seats: '1', tripsPerDay: '1', ownerId: '' });
              return 'Creado';
            })}
          >Crear</button>
        </div>
      </div>

      <div className={CARD}>
        <h3 className="font-bold text-stone-900">Abrir días en el calendario del sitio</h3>
        <Help>Crea el cupo del día (9:00) con lo que calculan tus recursos. Si ya existe, solo se actualiza el cupo. Nunca baja de lo ya reservado.</Help>
        <div className="flex gap-2">
          {[7, 30, 60].map((n) => (
            <button key={n} className={BTN2} onClick={() => run(async () => {
              const r = await api(`activities/${act.id}/days`, 'POST', {
                from: dayKey(new Date()), to: dayKey(new Date(Date.now() + n * 86_400_000)),
              });
              return `Listo: ${r.created} días nuevos (${r.days} revisados)`;
            })}>Próx. {n} días</button>
          ))}
        </div>
      </div>
    </div>
  );
}