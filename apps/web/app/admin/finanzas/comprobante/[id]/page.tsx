'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { INVOICE_LABEL, METHOD_LABEL, PAY_LABEL, igvSplit, paidAmount, reservationLines, soles } from '@/lib/finance';

// Datos del emisor: completar con los reales antes de emitir documentos oficiales.
const EMISOR = {
  razonSocial: 'Sumaq Kawsay',
  ruc: 'RUC por configurar',
  direccion: 'Valle Sagrado, Cusco, Perú',
};

export default function ComprobanteDetalle() {
  const { id } = useParams<{ id: string }>();
  const { reservations, accountingEntries } = useCMS();
  const r = reservations.find((x) => x.id === decodeURIComponent(id));

  if (!r) {
    return (
      <div>
        <Link href="/admin/finanzas/ventas" className="text-sm font-bold text-[#8A5A00]">← Volver al libro de ventas</Link>
        <p className="mt-4 text-stone-700">No se encontró esa venta.</p>
      </div>
    );
  }

  const { base, igv } = igvSplit(r.totalPEN);
  const paid = paidAmount(r);
  const saldo = Math.max(0, r.totalPEN - paid);
  const asientos = accountingEntries.filter((e) => e.reservationId === r.id);
  const th = 'text-left p-2 text-xs uppercase text-stone-600';

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4 print:hidden">
        <Link href="/admin/finanzas/ventas" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8A5A00]">
          <ArrowLeft className="w-4 h-4" /> Volver al libro de ventas
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm">
          <Printer className="w-4 h-4" /> Imprimir / guardar PDF
        </button>
      </div>

      <article className="bg-white border border-stone-300 rounded-xl p-6 sm:p-8 space-y-6 text-stone-900 print:border-0 print:p-0">
        <header className="flex flex-wrap justify-between gap-4 border-b border-stone-300 pb-4">
          <div>
            <div className="text-xl font-extrabold">{EMISOR.razonSocial}</div>
            <div className="text-sm text-stone-600">{EMISOR.ruc}</div>
            <div className="text-sm text-stone-600">{EMISOR.direccion}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase font-bold text-stone-600">{INVOICE_LABEL[r.invoiceType] ?? r.invoiceType}</div>
            <div className="font-mono text-2xl font-black">{r.invoiceNumber ?? 'SIN EMITIR'}</div>
            <div className="text-sm text-stone-600">Emitido: {(r.invoiceIssuedAt ?? r.createdAt).slice(0, 10)}</div>
          </div>
        </header>

        <section className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs uppercase font-bold text-stone-600 mb-1">Cliente</div>
            <div className="font-bold">{r.customerName}</div>
            <div>Doc.: {r.customerDniOrPassport ?? '—'}</div>
            <div>{r.customerEmail}</div>
            <div>{r.customerPhone}</div>
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-stone-600 mb-1">Reserva</div>
            <div className="font-mono font-bold">{r.id}</div>
            <div>Viaje: {r.travelDate}{r.endDate ? ` al ${r.endDate}` : ''}</div>
            <div>Huéspedes: {r.guestsCount}</div>
            <div>Atendió: {r.assignedAgent}</div>
          </div>
        </section>

        <section>
          <div className="text-xs uppercase font-bold text-stone-600 mb-1">Detalle de servicios</div>
          <table className="w-full text-sm">
            <thead className="bg-stone-50"><tr><th className={th}>Servicio</th><th className={th}>Cant.</th><th className={`${th} text-right`}>P. unit.</th><th className={`${th} text-right`}>Subtotal</th></tr></thead>
            <tbody>
              {reservationLines(r).map(([group, items]) => (
                <Fragment key={group}>
                  <tr className="bg-amber-50"><td colSpan={4} className="p-2 text-xs font-bold uppercase text-stone-700">{group}</td></tr>
                  {items.map((it, i) => (
                    <tr key={group + i} className="border-t border-stone-200">
                      <td className="p-2">{it.name}{it.details ? <div className="text-xs text-stone-600">{it.details}</div> : null}</td>
                      <td className="p-2">{it.quantity}</td>
                      <td className="p-2 text-right font-mono">{soles(it.unitPricePEN)}</td>
                      <td className="p-2 text-right font-mono">{soles(it.subtotalPEN)}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
          <div className="mt-3 ml-auto w-full sm:w-72 text-sm space-y-1">
            <div className="flex justify-between"><span>Base imponible</span><span className="font-mono">{soles(base)}</span></div>
            <div className="flex justify-between"><span>IGV (18%)</span><span className="font-mono">{soles(igv)}</span></div>
            <div className="flex justify-between border-t border-stone-300 pt-1 text-base font-black"><span>Total</span><span className="font-mono">{soles(r.totalPEN)}</span></div>
            <div className="flex justify-between text-emerald-800"><span>Cobrado</span><span className="font-mono">{soles(paid)}</span></div>
            <div className="flex justify-between font-bold"><span>Saldo</span><span className="font-mono">{soles(saldo)}</span></div>
          </div>
        </section>

        <section>
          <div className="text-xs uppercase font-bold text-stone-600 mb-1">Pagos recibidos · {PAY_LABEL[r.paymentStatus] ?? r.paymentStatus} · {METHOD_LABEL[r.paymentMethod] ?? r.paymentMethod}</div>
          {(r.payments ?? []).length === 0 ? (
            <p className="text-sm text-stone-600">Sin pagos registrados por la pasarela. {paid > 0 ? 'El cobro fue registrado manualmente por contabilidad.' : ''}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-50"><tr><th className={th}>Fecha</th><th className={th}>Método</th><th className={th}>Operación</th><th className={th}>Estado</th><th className={`${th} text-right`}>Monto</th></tr></thead>
              <tbody>
                {(r.payments ?? []).map((p) => (
                  <tr key={p.id} className="border-t border-stone-200">
                    <td className="p-2">{p.date.slice(0, 16).replace('T', ' ')}</td>
                    <td className="p-2">{METHOD_LABEL[p.method] ?? p.method}{p.cardLast4 ? ` ····${p.cardLast4}` : ''}</td>
                    <td className="p-2 font-mono text-xs">{p.operationCode ?? p.txId}</td>
                    <td className="p-2">{p.status}</td>
                    <td className="p-2 text-right font-mono">{soles(p.amountPEN)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {asientos.length > 0 && (
          <section>
            <div className="text-xs uppercase font-bold text-stone-600 mb-1">Asientos contables vinculados</div>
            <ul className="text-sm divide-y divide-stone-200">
              {asientos.map((e) => (
                <li key={e.id} className="py-1.5 flex justify-between gap-3">
                  <span>{e.date.slice(0, 10)} · {e.concept} <span className="text-xs text-stone-600">({e.registeredBy})</span></span>
                  <span className="font-mono">{e.type === 'egreso' ? '−' : '+'}{soles(e.amountPEN)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
