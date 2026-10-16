'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { METHOD_LABEL, soles } from '@/lib/finance';

const INPUT =
  'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';

export default function Movimientos() {
  const { accountingEntries } = useCMS();
  const [q, setQ] = useState('');
  const [type, setType] = useState('todos');
  const [cat, setCat] = useState('todas');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const cats = useMemo(
    () => [...new Set(accountingEntries.map((e) => e.category))],
    [accountingEntries],
  );

  const rows = useMemo(
    () =>
      accountingEntries
        .filter((e) => (type === 'todos' ? true : e.type === type))
        .filter((e) => (cat === 'todas' ? true : e.category === cat))
        .filter((e) => (from ? e.date.slice(0, 10) >= from : true))
        .filter((e) => (to ? e.date.slice(0, 10) <= to : true))
        .filter((e) => {
          const t = q.trim().toLowerCase();
          if (!t) return true;
          return [e.concept, e.reservationId, e.invoiceNumber, e.registeredBy]
            .filter(Boolean)
            .some((x) => String(x).toLowerCase().includes(t));
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [accountingEntries, q, type, cat, from, to],
  );

  const ingresos = rows.filter((e) => e.type === 'ingreso').reduce((a, e) => a + e.amountPEN, 0);
  const egresos = rows.filter((e) => e.type === 'egreso').reduce((a, e) => a + e.amountPEN, 0);

  const exportCsv = () => {
    const head = ['Fecha', 'Tipo', 'Concepto', 'Categoría', 'Reserva', 'Comprobante', 'Método', 'Registró', 'Monto PEN'];
    const lines = rows.map((e) =>
      [
        e.date.slice(0, 10),
        e.type,
        e.concept,
        e.category,
        e.reservationId ?? '',
        e.invoiceNumber ?? '',
        METHOD_LABEL[e.paymentMethod] ?? e.paymentMethod,
        e.registeredBy,
        (e.type === 'egreso' ? -e.amountPEN : e.amountPEN).toFixed(2),
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(','),
    );
    const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'libro-de-movimientos.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Libro de movimientos"
        help="Todo lo que entra y sale de dinero, en orden de fecha. Las ventas cobradas entran solas. Los gastos los registras en Egresos."
      />

      <div className="bg-white border border-stone-300 rounded-xl p-4 mb-4 flex flex-wrap gap-2 items-end">
        <input className={`${INPUT} w-56`} placeholder="Buscar concepto, reserva…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={INPUT} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="todos">Ingresos y egresos</option>
          <option value="ingreso">Solo ingresos</option>
          <option value="egreso">Solo egresos</option>
        </select>
        <select className={INPUT} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="todas">Todas las categorías</option>
          {cats.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="text-xs text-stone-600">Desde<input type="date" className={`${INPUT} block`} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-xs text-stone-600">Hasta<input type="date" className={`${INPUT} block`} value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button onClick={exportCsv} className="ml-auto px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm">
          Exportar a Excel (CSV)
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-stone-300 rounded-xl p-4">
          <div className="text-xs font-bold uppercase text-stone-600">Ingresos</div>
          <div className="text-2xl font-black text-emerald-700">{soles(ingresos)}</div>
        </div>
        <div className="bg-white border border-stone-300 rounded-xl p-4">
          <div className="text-xs font-bold uppercase text-stone-600">Egresos</div>
          <div className="text-2xl font-black text-red-700">{soles(egresos)}</div>
        </div>
        <div className="bg-white border border-stone-300 rounded-xl p-4">
          <div className="text-xs font-bold uppercase text-stone-600">Saldo</div>
          <div className={`text-2xl font-black ${ingresos - egresos < 0 ? 'text-red-700' : 'text-stone-900'}`}>{soles(ingresos - egresos)}</div>
        </div>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-stone-600 bg-stone-50">
            <tr>
              <th className="p-3">Fecha</th><th>Tipo</th><th>Concepto</th><th>Categoría</th><th>Método</th>
              <th className="text-right pr-3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-stone-200 hover:bg-amber-50">
                <td className="p-3 whitespace-nowrap">{e.date.slice(0, 10)}</td>
                <td>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.type === 'ingreso' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {e.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                  </span>
                </td>
                <td>
                  {e.concept}
                  {e.reservationId && (
                    <Link
                      href={`/admin/finanzas/comprobante/${encodeURIComponent(e.reservationId)}`}
                      className="ml-2 text-xs font-mono text-[#8A5A00] underline"
                    >
                      {e.invoiceNumber ?? e.reservationId}
                    </Link>
                  )}
                </td>
                <td>{e.category}</td>
                <td>{METHOD_LABEL[e.paymentMethod] ?? e.paymentMethod}</td>
                <td className={`text-right font-mono pr-3 ${e.type === 'egreso' ? 'text-red-700' : 'text-emerald-700'}`}>
                  {e.type === 'egreso' ? '-' : ''}{soles(e.amountPEN)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-stone-600">No hay movimientos con esos filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}