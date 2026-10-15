'use client';

import { useState } from 'react';
import { BTN2, Booking, CARD, dayLabel, Help, INPUT, timeLabel } from './ui';

const PAGE = 15;
const BADGE: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-800 border-green-600',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-600',
  CANCELLED: 'bg-red-100 text-red-800 border-red-600',
};
const NAME: Record<string, string> = { CONFIRMED: 'Confirmada', PENDING: 'Pendiente', CANCELLED: 'Cancelada' };

export function BookingsTab({ books }: { books: Booking[] }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const term = q.trim().toLowerCase();
  const list = term ? books.filter((b) => `${b.customerName} ${b.customerContact}`.toLowerCase().includes(term)) : books;
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const view = list.slice(cur * PAGE, cur * PAGE + PAGE);
  const people = list.filter((b) => b.status !== 'CANCELLED').reduce((s, b) => s + b.quantity, 0);

  return (
    <div className={CARD}>
      <h3 className="font-bold text-stone-900">Reservas de este servicio</h3>
      <Help>Las más recientes primero. Busca por nombre, correo o teléfono. Se cargan las últimas 500.</Help>
      <div className="flex flex-wrap items-center gap-3">
        <input className={`${INPUT} w-64`} placeholder="Buscar cliente o contacto…" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        <span className="text-sm text-stone-700">{list.length} reservas · {people} personas</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-stone-600 text-xs">
            <tr><th className="p-2">Horario</th><th>Cliente</th><th>Contacto</th><th>Pers.</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {view.map((b) => (
              <tr key={b.id} className="border-t border-stone-200">
                <td className="p-2 whitespace-nowrap capitalize">{dayLabel(b.slot.startsAt)} · {timeLabel(b.slot.startsAt)}</td>
                <td>{b.customerName}</td>
                <td>{b.customerContact}</td>
                <td>{b.quantity}</td>
                <td><span className={`text-xs px-2 py-0.5 rounded-full border ${BADGE[b.status] ?? ''}`}>{NAME[b.status] ?? b.status}</span></td>
              </tr>
            ))}
            {view.length === 0 && <tr><td colSpan={5} className="p-3 text-stone-600">Sin reservas.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <button className={BTN2} disabled={cur === 0} onClick={() => setPage(cur - 1)}>← Anterior</button>
        <span>Página {cur + 1} de {pages}</span>
        <button className={BTN2} disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Siguiente →</button>
      </div>
    </div>
  );
}