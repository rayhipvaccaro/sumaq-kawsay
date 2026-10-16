'use client';

import { useEffect, useState } from 'react';
import { PageIntro } from '@/components/site/PageIntro';

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  doc?: string;
  travelDate: string;
  guestsCount: number;
  items: { name: string; quantity: number; subtotalPEN: number }[];
  totalPEN: number;
  amountPaidPEN: number;
  paymentStatus: string;
  status: string;
  accessToken?: string;
  passengers: { name: string; doc?: string }[];
  listTotalPEN?: number;
  agencyDiscountPct?: number;
}
interface Data {
  role: string;
  name: string;
  username: string;
  discountPct: number;
  orders: Order[];
}

const STATUS: Record<string, string> = {
  borrador: 'Borrador',
  cotizado: 'Cotizado',
  en_seguimiento: 'En seguimiento',
  concretado: 'Confirmado',
  declinado: 'Declinado',
  pendiente: 'Pago pendiente',
  adelanto_50: 'Adelanto pagado',
  pagado_100: 'Pagado',
  anulado: 'Anulado',
};
const label = (s: string) => STATUS[s] ?? s;
const soles = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function MisReservasView() {
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/mis-reservas', { cache: 'no-store' })
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          window.location.href = '/ingresar';
          return null;
        }
        if (!r.ok) throw new Error('No se pudieron cargar tus reservas');
        return (await r.json()) as Data;
      })
      .then((d) => d && setData(d))
      .catch((e) => setErr((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/';
  };

  const agency = data?.role === 'Agencia';
  const sold = (data?.orders ?? []).reduce((a, o) => a + o.totalPEN, 0);

  return (
    <>
      <PageIntro
        eyebrow={agency ? 'Mi agencia' : 'Mi cuenta'}
        title={agency ? 'Mis ventas' : 'Mis reservas'}
        subtitle={
          data
            ? agency
              ? `${data.name} · descuento fijo ${data.discountPct}%`
              : `Hola, ${data.name}. Aquí ves tus reservas y puedes pagarlas.`
            : undefined
        }
      />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {loading && <p className="text-stone-600">Cargando…</p>}
        {err && <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</p>}

        {data && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-stone-700">
                {data.orders.length} {agency ? 'venta(s)' : 'reserva(s)'}
                {agency && data.orders.length > 0 && <> · Total vendido <b>{soles(sold)}</b></>}
              </p>
              <button
                onClick={logout}
                className="rounded-lg border border-stone-400 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-100"
              >
                Cerrar sesión
              </button>
            </div>

            {data.orders.length === 0 && (
              <div className="rounded-2xl border border-stone-300 bg-white p-8 text-center text-stone-600">
                Aún no tienes {agency ? 'ventas' : 'reservas'} en esta cuenta.
              </div>
            )}

            {data.orders.map((o) => {
              const debt = Math.max(0, o.totalPEN - o.amountPaidPEN);
              return (
                <article key={o.id} className="space-y-3 rounded-2xl border-2 border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-lg font-extrabold text-[#442A19]">{o.id}</div>
                      <div className="text-sm text-stone-600">
                        {agency ? `Cliente: ${o.customerName}${o.doc ? ` · ${o.doc}` : ''}` : o.customerName} ·
                        Viaje: <b>{o.travelDate}</b> · {o.guestsCount} persona(s)
                      </div>
                    </div>
                    <div className="flex gap-1.5 text-xs font-bold">
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-800">{label(o.status)}</span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-900">{label(o.paymentStatus)}</span>
                    </div>
                  </div>

                  <ul className="divide-y divide-stone-100 text-sm">
                    {o.items.map((i, k) => (
                      <li key={k} className="flex justify-between py-1.5">
                        <span>{i.name} <span className="text-stone-500">× {i.quantity}</span></span>
                        <span className="font-mono">{soles(i.subtotalPEN)}</span>
                      </li>
                    ))}
                  </ul>

                  {agency && o.passengers.length > 0 && (
                    <div className="text-xs text-stone-600">
                      <b>Otros pasajeros:</b> {o.passengers.map((p) => (p.doc ? `${p.name} (${p.doc})` : p.name)).join(' · ')}
                    </div>
                  )}

                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-stone-200 pt-3">
                    <div className="text-sm">
                      {o.agencyDiscountPct ? (
                        <div className="text-xs text-stone-500">
                          Precio lista {soles(o.listTotalPEN ?? o.totalPEN)} · descuento {o.agencyDiscountPct}%
                        </div>
                      ) : null}
                      <div className="text-lg font-black text-[#442A19]">Total {soles(o.totalPEN)}</div>
                      <div className="text-xs text-stone-600">Pagado {soles(o.amountPaidPEN)}</div>
                    </div>
                    {debt > 0 && o.accessToken && (
                      <a
                        href={`/pago/${o.id}?t=${o.accessToken}`}
                        className="rounded-xl bg-[#F6A935] px-5 py-2.5 text-sm font-black text-[#181513] hover:bg-[#D48B1E]"
                      >
                        Pagar {soles(debt)}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
