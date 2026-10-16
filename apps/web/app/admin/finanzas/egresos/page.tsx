'use client';

import { useMemo, useState } from 'react';
import { useCMS } from '@/lib/cmsContext';
import { PageHeader } from '@/components/admin/PageHeader';
import { METHOD_LABEL, soles } from '@/lib/finance';
import type { AccountingTransaction } from '@/data/businessData';

const INPUT =
  'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';

type Cat = Exclude<AccountingTransaction['category'], 'Venta de Reserva'>;
const CATS: Cat[] = ['Costo Operativo', 'Pago a Proveedor', 'Impuestos'];

export default function Egresos() {
  const { accountingEntries, addAccountingTransaction, sessionUser } = useCMS();
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState<Cat>('Costo Operativo');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<AccountingTransaction['paymentMethod']>('efectivo');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const su = sessionUser as unknown as { fullName?: string; username?: string } | null;
  const who = su?.fullName ?? su?.username ?? 'Contabilidad';

  const rows = useMemo(
    () =>
      accountingEntries
        .filter((e) => e.type === 'egreso')
        .sort((a, b) => b.date.localeCompare(a.date)),
    [accountingEntries],
  );
  const total = rows.reduce((a, e) => a + e.amountPEN, 0);

  const save = async () => {
    const n = Number(amount.replace(',', '.'));
    if (!concept.trim()) {
      setMsg('Escribe el concepto.');
      return;
    }
    if (!Number.isFinite(n) || n <= 0) {
      setMsg('El monto debe ser mayor a 0.');
      return;
    }
    setSaving(true);
    const ok = await addAccountingTransaction({
      type: 'egreso',
      concept: concept.trim(),
      category,
      amountPEN: Number(n.toFixed(2)),
      amountUSD: Number((n / 3.75).toFixed(2)),
      paymentMethod: method,
      registeredBy: who,
    });
    setSaving(false);
    if (ok) {
      setConcept('');
      setAmount('');
      setMsg('Egreso registrado.');
    } else {
      setMsg('No se pudo guardar. Intenta de nuevo.');
    }
  };

  return (
    <>
      <PageHeader
        title="Egresos"
        help="Registra cada gasto: sueldos, compras, pagos a proveedores, impuestos. Todo queda en el Libro de movimientos."
      />

      <div className="bg-white border border-stone-300 rounded-xl p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <label className="text-xs font-semibold text-stone-700 lg:col-span-2">
          Concepto
          <input
            className={`${INPUT} w-full mt-1`}
            placeholder="Ej. Compra de forraje, pago a guía…"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </label>
        <label className="text-xs font-semibold text-stone-700">
          Categoría
          <select className={`${INPUT} w-full mt-1`} value={category} onChange={(e) => setCategory(e.target.value as Cat)}>
            {CATS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-stone-700">
          Monto (S/)
          <input
            className={`${INPUT} w-full mt-1`}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label className="text-xs font-semibold text-stone-700">
          Pagado con
          <select
            className={`${INPUT} w-full mt-1`}
            value={method}
            onChange={(e) => setMethod(e.target.value as AccountingTransaction['paymentMethod'])}
          >
            {Object.entries(METHOD_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-5 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Registrar egreso'}
          </button>
          {msg && <span className="text-sm text-stone-700">{msg}</span>}
        </div>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl p-4 mb-4">
        <div className="text-xs font-bold uppercase text-stone-600">Total egresos</div>
        <div className="text-2xl font-black text-red-700">{soles(total)}</div>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-stone-600 bg-stone-50">
            <tr>
              <th className="p-3">Fecha</th><th>Concepto</th><th>Categoría</th><th>Método</th><th>Registró</th>
              <th className="text-right pr-3">Monto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-t border-stone-200">
                <td className="p-3 whitespace-nowrap">{e.date.slice(0, 10)}</td>
                <td>{e.concept}</td>
                <td>{e.category}</td>
                <td>{METHOD_LABEL[e.paymentMethod] ?? e.paymentMethod}</td>
                <td className="text-xs text-stone-600">{e.registeredBy}</td>
                <td className="text-right font-mono pr-3">{soles(e.amountPEN)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-stone-600">Aún no hay egresos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}