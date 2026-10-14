'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Printer, ShieldCheck, Smartphone, Wallet, XCircle } from 'lucide-react';

type Method = 'tarjeta' | 'yape_plin' | 'transferencia_bcp' | 'interbank' | 'efectivo';

interface PublicOrder {
  id: string;
  customerName: string;
  travelDate: string;
  guestsCount: number;
  items: { name: string; quantity: number; subtotalPEN: number }[];
  totalPEN: number;
  totalUSD: number;
  amountPaidPEN: number;
  paymentStatus: 'pendiente' | 'adelanto_50' | 'pagado_100' | 'anulado';
  status: string;
  payments: { id: string; date: string; method: Method; amountPEN: number; status: string; txId: string; cardBrand?: string; cardLast4?: string }[];
}

interface PayResult {
  status: 'aprobado' | 'rechazado' | 'por_verificar';
  message: string;
  txId: string;
  amountPEN: number;
  cardBrand?: string;
  cardLast4?: string;
}

const money = (n: number) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function formatCard(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 19);
  return d.replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function PagoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = useCallback((es: string, en: string) => (lang === 'es' ? es : en), [lang]);

  const [token, setToken] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [plan, setPlan] = useState<'50' | '100'>('50');
  const [method, setMethod] = useState<Method>('tarjeta');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [phone, setPhone] = useState('');
  const [operationCode, setOperationCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PayResult | null>(null);

  // La llave de la orden llega por ?t= o, en el mismo equipo, desde el navegador.
  useEffect(() => {
    let tk = new URLSearchParams(window.location.search).get('t');
    if (!tk) {
      try {
        tk = localStorage.getItem(`sq_pay_${id}`);
      } catch {
        tk = null;
      }
    }
    setToken(tk);
    if (!tk) setLoadError('Falta la llave de la orden. Abre el enlace de pago que recibiste al reservar.');
  }, [id]);

  const load = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}?t=${encodeURIComponent(token)}`, { cache: 'no-store' });
    if (!res.ok) {
      setLoadError('No encontramos esta orden o la llave no es valida.');
      return;
    }
    const data: PublicOrder = await res.json();
    setOrder(data);
    setLoadError(null);
    if (data.amountPaidPEN > 0) setPlan('100');
  }, [id, token]);

  useEffect(() => {
    load();
  }, [load]);

  const remaining = order ? Math.round((order.totalPEN - order.amountPaidPEN) * 100) / 100 : 0;
  const amountNow = useMemo(() => {
    if (!order) return 0;
    if (order.amountPaidPEN > 0 || plan === '100') return remaining;
    return Math.min(remaining, Math.round(order.totalPEN * 50) / 100);
  }, [order, plan, remaining]);

  const paidFull = order?.paymentStatus === 'pagado_100';
  const locked = order?.paymentStatus === 'anulado' || order?.status === 'declinado';

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!order || !token) return;
    setError(null);
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 1200)); // efecto de "procesando"
      const res = await fetch(`/api/orders/${encodeURIComponent(order.id)}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ t: token, method, plan, card, phone, operationCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'No se pudo procesar el pago');
        return;
      }
      setResult(data.result as PayResult);
      setOrder(data.order as PublicOrder);
      setCard({ number: '', name: '', expiry: '', cvv: '' });
    } catch {
      setError('Sin conexion con el servidor.');
    } finally {
      setBusy(false);
    }
  }

  const input =
    'w-full px-4 py-3 rounded-xl border-2 border-stone-300 bg-white text-[#1C1917] focus:outline-hidden focus:border-[#F6A935] placeholder-stone-400';

  const methods: { key: Method; label: string; icon: React.ReactNode }[] = [
    { key: 'tarjeta', label: t('Tarjeta', 'Card'), icon: <CreditCard className="w-5 h-5" /> },
    { key: 'yape_plin', label: 'Yape / Plin', icon: <Smartphone className="w-5 h-5" /> },
    { key: 'transferencia_bcp', label: t('Transferencia BCP', 'BCP transfer'), icon: <Landmark className="w-5 h-5" /> },
    { key: 'interbank', label: 'Interbank', icon: <Landmark className="w-5 h-5" /> },
    { key: 'efectivo', label: t('En el lugar', 'On site'), icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917]">
      <div className="bg-[#181513] text-[#F6A935] text-center text-xs sm:text-sm font-bold py-2 px-4 print:hidden">
        {t(
          'MODO DEMOSTRACIÓN · Pasarela simulada: no se cobra dinero real. No uses tu tarjeta verdadera.',
          'DEMO MODE · Simulated gateway: no real money is charged. Do not use your real card.',
        )}
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#442A19] hover:text-black">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Volver al sitio', 'Back to site')}</span>
          </Link>
          <button
            onClick={() => setLang((l) => (l === 'es' ? 'en' : 'es'))}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>

        <div>
          <h1 className="font-heading text-2xl sm:text-4xl font-black text-[#181513]">
            {t('Pago de tu reserva', 'Pay for your booking')}
          </h1>
          <p className="text-stone-600 text-sm mt-1">Sumaq Kawsay · Inka Lab Km 84</p>
        </div>

        {loadError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">{loadError}</div>
        )}

        {!order && !loadError && <p className="text-stone-500 text-sm">{t('Cargando orden...', 'Loading order...')}</p>}

        {order && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Resumen */}
            <aside className="md:col-span-2 space-y-4 md:order-2">
              <div className="bg-white border-2 border-[#F6A935] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-500">{t('Orden', 'Order')}</span>
                  <span className="font-mono font-extrabold text-[#442A19]">{order.id}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>{order.customerName}</div>
                  <div className="text-stone-500">
                    {order.travelDate} · {order.guestsCount} {t('personas', 'guests')}
                  </div>
                </div>
                <ul className="border-t border-stone-100 pt-3 space-y-1.5 text-sm">
                  {order.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span>
                        {it.name} <span className="text-stone-400">×{it.quantity}</span>
                      </span>
                      <span className="font-semibold">{money(it.subtotalPEN)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-stone-200 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between font-extrabold text-base">
                    <span>Total</span>
                    <span>{money(order.totalPEN)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>USD</span>
                    <span>${order.totalUSD}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t('Pagado', 'Paid')}</span>
                    <span>{money(order.amountPaidPEN)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>{t('Saldo', 'Balance')}</span>
                    <span>{money(remaining)}</span>
                  </div>
                </div>
              </div>

              {order.payments.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
                  <div className="font-bold uppercase tracking-wider text-stone-500">{t('Movimientos', 'Transactions')}</div>
                  {order.payments.map((p) => (
                    <div key={p.id} className="flex justify-between gap-2">
                      <span className="text-stone-600">
                        {p.txId}
                        {p.cardLast4 ? ` · ${p.cardBrand} •••• ${p.cardLast4}` : ''}
                      </span>
                      <span
                        className={
                          p.status === 'aprobado' ? 'text-emerald-700 font-bold' : p.status === 'rechazado' ? 'text-red-600 font-bold' : 'text-amber-700 font-bold'
                        }
                      >
                        {money(p.amountPEN)} · {p.status === 'por_verificar' ? t('por verificar', 'pending check') : p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            {/* Formulario / resultado */}
            <main className="md:col-span-3 md:order-1">
              {result && result.status !== 'rechazado' ? (
                <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 space-y-4 text-center" id="constancia">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h2 className="font-heading text-2xl font-black">
                    {result.status === 'aprobado' ? t('¡Pago aprobado!', 'Payment approved!') : t('Pago registrado', 'Payment recorded')}
                  </h2>
                  <p className="text-sm text-stone-600">{result.message}</p>
                  <div className="text-sm bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-1 text-left">
                    <div className="flex justify-between"><span>{t('Operación', 'Transaction')}</span><strong className="font-mono">{result.txId}</strong></div>
                    <div className="flex justify-between"><span>{t('Monto', 'Amount')}</span><strong>{money(result.amountPEN)}</strong></div>
                    {result.cardLast4 && (
                      <div className="flex justify-between"><span>{t('Tarjeta', 'Card')}</span><strong>{result.cardBrand} •••• {result.cardLast4}</strong></div>
                    )}
                    <div className="flex justify-between"><span>{t('Orden', 'Order')}</span><strong className="font-mono">{order.id}</strong></div>
                  </div>
                  <p className="text-xs text-stone-500">
                    {t(
                      'Constancia de pago simulada. La boleta o factura la emite Contabilidad al confirmar tu reserva.',
                      'Simulated payment receipt. The invoice is issued by Accounting when your booking is confirmed.',
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                    <button onClick={() => window.print()} className="flex-1 py-3 rounded-xl border-2 border-stone-300 font-bold text-sm flex items-center justify-center gap-2">
                      <Printer className="w-4 h-4" /> {t('Imprimir constancia', 'Print receipt')}
                    </button>
                    <Link href="/" className="flex-1 py-3 rounded-xl bg-[#181513] text-[#F6A935] font-bold text-sm text-center">
                      {t('Volver al inicio', 'Back to home')}
                    </Link>
                  </div>
                  {remaining > 0.009 && result.status === 'aprobado' && (
                    <button
                      onClick={() => { setResult(null); setPlan('100'); }}
                      className="text-sm font-bold text-[#442A19] underline print:hidden"
                    >
                      {t(`Pagar el saldo (${money(remaining)})`, `Pay the balance (${money(remaining)})`)}
                    </button>
                  )}
                </div>
              ) : paidFull ? (
                <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 text-center space-y-3">
                  <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h2 className="font-heading text-xl font-black">{t('Esta orden ya está pagada al 100%', 'This order is fully paid')}</h2>
                  <Link href="/" className="inline-block px-5 py-3 rounded-xl bg-[#181513] text-[#F6A935] font-bold text-sm">
                    {t('Volver al inicio', 'Back to home')}
                  </Link>
                </div>
              ) : locked ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold">
                  {t('Esta orden ya no admite pagos. Contacta a Ventas.', 'This order no longer accepts payments. Contact Sales.')}
                </div>
              ) : (
                <form onSubmit={pay} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                  {order.amountPaidPEN === 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-500">{t('¿Cuánto pagas ahora?', 'How much now?')}</div>
                      <div className="grid grid-cols-2 gap-3">
                        {(['50', '100'] as const).map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => setPlan(p)}
                            className={`p-3 rounded-xl border-2 text-left ${plan === p ? 'border-[#F6A935] bg-[#FFF8EC]' : 'border-stone-200'}`}
                          >
                            <div className="font-extrabold">{p === '50' ? t('Adelanto 50%', '50% deposit') : t('Pago total', 'Full payment')}</div>
                            <div className="text-sm text-stone-600">
                              {money(p === '50' ? Math.round(order.totalPEN * 50) / 100 : order.totalPEN)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-500">{t('Método de pago', 'Payment method')}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {methods.map((m) => (
                        <button
                          type="button"
                          key={m.key}
                          onClick={() => { setMethod(m.key); setError(null); }}
                          className={`p-3 rounded-xl border-2 text-sm font-bold flex items-center gap-2 ${method === m.key ? 'border-[#F6A935] bg-[#FFF8EC]' : 'border-stone-200'}`}
                        >
                          {m.icon}
                          <span>{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {method === 'tarjeta' && (
                    <div className="space-y-3">
                      <input className={input} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} required />
                      <input className={input} autoComplete="cc-name" placeholder={t('Nombre del titular', 'Cardholder name')} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} required />
                      <div className="grid grid-cols-2 gap-3">
                        <input className={input} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} required />
                        <input className={input} inputMode="numeric" autoComplete="cc-csc" placeholder="CVV" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} required />
                      </div>
                      <p className="text-xs text-stone-500">
                        {t('Tarjetas de prueba: 4242 4242 4242 4242 (aprueba) · 4000 0000 0000 0002 (rechaza) · 4000 0000 0000 9995 (sin fondos). Vence en el futuro, CVV 123.',
                           'Test cards: 4242 4242 4242 4242 (approves) · 4000 0000 0000 0002 (declines) · 4000 0000 0000 9995 (no funds). Future expiry, CVV 123.')}
                      </p>
                    </div>
                  )}

                  {method === 'yape_plin' && (
                    <div className="space-y-3">
                      <input className={input} inputMode="numeric" placeholder={t('Celular de Yape / Plin (9 dígitos)', 'Yape / Plin phone (9 digits)')} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))} required />
                      <p className="text-xs text-stone-500">{t('Simulado: cualquier celular válido que empiece con 9 aprueba.', 'Simulated: any valid number starting with 9 approves.')}</p>
                    </div>
                  )}

                  {(method === 'transferencia_bcp' || method === 'interbank') && (
                    <div className="space-y-3">
                      <div className="text-sm bg-stone-50 border border-stone-200 rounded-xl p-4">
                        <div className="font-bold">{method === 'interbank' ? 'Interbank' : 'BCP'} · Sumaq Kawsay (datos de demostración)</div>
                        <div className="font-mono text-stone-600">000-0000000-0-00</div>
                      </div>
                      <input className={input} placeholder={t('Número de operación de tu transferencia', 'Transfer reference number')} value={operationCode} onChange={(e) => setOperationCode(e.target.value)} required />
                      <p className="text-xs text-stone-500">{t('Contabilidad verificará la transferencia y confirmará tu pago.', 'Accounting will verify the transfer and confirm.')}</p>
                    </div>
                  )}

                  {method === 'efectivo' && (
                    <p className="text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-xl p-4">
                      {t('Reservas ahora y pagas al llegar. Ventas confirmará tu reserva.', 'Book now and pay on arrival. Sales will confirm your booking.')}
                    </p>
                  )}

                  {result?.status === 'rechazado' && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
                      <XCircle className="w-5 h-5 shrink-0" /> <span>{result.message}</span>
                    </div>
                  )}
                  {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">{error}</div>}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full py-4 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] disabled:opacity-60 text-[#181513] font-black text-base shadow-md"
                  >
                    {busy
                      ? t('Procesando pago...', 'Processing payment...')
                      : method === 'efectivo'
                        ? t('Confirmar y pagar en el lugar', 'Confirm and pay on site')
                        : t(`Pagar ${money(amountNow)}`, `Pay ${money(amountNow)}`)}
                  </button>
                </form>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
