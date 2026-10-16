'use client';

import { useState } from 'react';
import { Activity, api, Board, BRoute, BTN, BTN2, CARD, Help, INPUT, Run } from './ui';

type Row = { name: string; minMin: number; maxMin: number };
const pick = (r: BRoute[]): Row[] => r.map(({ name, minMin, maxMin }) => ({ name, minMin, maxMin }));

export function RoutesTab({ act, board, run }: { act: Activity; board: Board | null; run: Run }) {
  const [edit, setEdit] = useState<Row[] | null>(null);
  if (!board) return <Help>Cargando…</Help>;
  const base = pick(board.routes);
  const rows = edit ?? base;
  const dirty = edit !== null && JSON.stringify(edit) !== JSON.stringify(base);
  const set = (i: number, p: Partial<Row>) => setEdit(rows.map((r, k) => (k === i ? { ...r, ...p } : r)));

  return (
    <div className={CARD}>
      <h3 className="font-bold text-stone-900">Rutas</h3>
      <Help>
        Cada ruta tiene un tiempo mínimo y máximo. Al iniciar un recorrido, el cronómetro parte con el máximo,
        y puedes ajustarlo en ese momento. Cuando se cumple el tiempo, te avisa, pero no se cierra hasta que pulses Terminó actividad.
      </Help>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <input className={`${INPUT} w-44`} placeholder="Nombre (ej. A)" value={r.name} onChange={(e) => set(i, { name: e.target.value })} />
            <input type="number" min={1} className={`${INPUT} w-20`} value={r.minMin} onChange={(e) => set(i, { minMin: Number(e.target.value) })} />
            <span className="text-sm text-stone-600">a</span>
            <input type="number" min={1} className={`${INPUT} w-20`} value={r.maxMin} onChange={(e) => set(i, { maxMin: Number(e.target.value) })} />
            <span className="text-sm text-stone-600">minutos</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-stone-600">Aún no hay rutas. Agrega la primera.</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={BTN2} disabled={rows.length >= 10} onClick={() => setEdit([...rows, { name: '', minMin: 30, maxMin: 40 }])}>+ Agregar ruta</button>
        <button className={BTN2} disabled={rows.length === 0} onClick={() => setEdit(rows.slice(0, -1))}>Quitar la última</button>
        <button
          className={BTN}
          disabled={!dirty || rows.length === 0}
          onClick={() => run(async () => {
            await api(`activities/${act.id}/routes`, 'PUT', { routes: rows });
            setEdit(null);
            return 'Rutas guardadas';
          })}
        >Guardar rutas</button>
      </div>
    </div>
  );
}