'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { INVOICE_LABEL, METHOD_LABEL, PAY_LABEL, isSale, paidAmount, soles } from '@/lib/finance';

const INPUT =
  'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';

export default function LibroVentas() {
  const { reservations } = useCMS();
  const [q, setQ] = useState('');
  const [method, setMethod] = useState('todos');
  const [pay, setPay] = useState('todos');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const rows = useMemo(
    () =>
      reservations
        .filter(isSale)
        .filter((r) => (method === 'todos' ? true : r.paymentMethod === method))
        .filter((r) => (pay === 'todos' ? true : r.paymentStatus === pay))
        .filter((r) => (from ? (r.invoiceIssuedAt ?? r.createdAt).slice(0, 10) >= from : true))
        .filter((r) => (to ? (r.invoiceIssuedAt ?? r.createdAt).slice(0, 10) <= to : true))
        .filter((r) => {
          const t = q.trim().toLowerCase();
          if (!t) return true;
          return [r.id, r.customerName, r.invoiceNumber, r.customerDniOrPassport]
            .filter(Boolean)
            .some((x) => String(x).toLowerCase().includes(t));
        })
        .sort((a, b) => (b.invoiceIssuedAt ?? b.createdAt).localeCompare(a.invoiceIssuedAt ?? a.createdAt)),
    [reservations, q, method, pay, from, to],
  );

  const total = rows.reduce((a, r) => a + r.totalPEN, 0);
  const cobrado = rows.reduce((a, r) => a + paidAmount(r), 0);

  const exportCsv = () => {
    const head = ['Comprobante', 'Tipo', 'Fecha', 'Reserva', 'Cliente', 'Documento', 'Método', 'Estado de pago', 'Total PEN', 'Cobrado PEN'];
    const lines = rows.map((r) =>
      [
        r.invoiceNumber ?? '',
        INVOICE_LABEL[r.invoiceType] ?? r.invoiceType,
        (r.invoiceIssuedAt ?? r.createdAt).slice(0, 10),
        r.id,
        r.customerName,
        r.customerDniOrPassport ?? '',
        METHOD_LABEL[r.paymentMethod] ?? r.paymentMethod,
        PAY_LABEL[r.paymentStatus] ?? r.paymentStatus,
        r.totalPEN.toFixed(2),
        paidAmount(r).toFixed(2),
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(','),
    );
    const blob = new Blob(['﻿' + [head.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'libro-de-ventas.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <PageHeader
        title="Libro de ventas"
        help="Una fila por comprobante. Haz clic en una venta para ver el documento con todo el detalle: cliente, servicios, IGV, pagos recibidos."
      />
      <div className="bg-white border border-stone-300 rounded-xl p-4 mb-4 flex flex-wrap gap-2 items-end">
        <input className={`${INPUT} w-56`} placeholder="Buscar cliente, DNI, código…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={INPUT} value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="todos">Todos los métodos</option>
          {Object.entries(METHOD_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={INPUT} value={pay} onChange={(e) => setPay(e.target.value)}>
          <option value="todos">Todos los estados</option>
          {Object.entries(PAY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="text-xs text-stone-600">Desde<input type="date" className={`${INPUT} block`} value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="text-xs text-stone-600">Hasta<input type="date" className={`${INPUT} block`} value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button onClick={exportCsv} className="ml-auto px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm">Exportar a Excel (CSV)</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-stone-300 rounded-xl p-4"><div className="text-xs font-bold uppercase text-stone-600">Comprobantes</div><div className="text-2xl font-black">{rows.length}</div></div>
        <div className="bg-white border border-stone-300 rounded-xl p-4"><div className="text-xs font-bold uppercase text-stone-600">Total facturado</div><div className="text-2xl font-black">{soles(total)}</div></div>
        <div className="bg-white border border-stone-300 rounded-xl p-4"><div className="text-xs font-bold uppercase text-stone-600">Cobrado</div><div className="text-2xl font-black text-emerald-700">{soles(cobrado)}</div></div>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-stone-600 bg-stone-50">
            <tr>
              <th className="p-3">Comprobante</th><th>Fecha</th><th>Cliente</th><th>Método</th><th>Pago</th><th className="text-right">Total</th><th className="text-right pr-3">Cobrado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-stone-200 hover:bg-amber-50">
                <td className="p-3">
                  <Link href={`/admin/finanzas/comprobante/${encodeURIComponent(r.id)}`} className="font-mono font-bold text-[#8A5A00] underline">
                    {r.invoiceNumber ?? 'Sin emitir'}
                  </Link>
                  <div className="text-xs text-stone-600">{INVOICE_LABEL[r.invoiceType] ?? r.invoiceType} · {r.id}</div>
                </td>
                <td>{(r.invoiceIssuedAt ?? r.createdAt).slice(0, 10)}</td>
                <td>{r.customerName}<div className="text-xs text-stone-600">{r.customerDniOrPassport ?? ''}</div></td>
                <td>{METHOD_LABEL[r.paymentMethod] ?? r.paymentMethod}</td>
                <td>{PAY_LABEL[r.paymentStatus] ?? r.paymentStatus}</td>
                <td className="text-right font-mono">{soles(r.totalPEN)}</td>
                <td className="text-right font-mono pr-3">{soles(paidAmount(r))}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-stone-600">No hay ventas con esos filtros. Las ventas aparecen cuando Ventas concreta una reserva.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
