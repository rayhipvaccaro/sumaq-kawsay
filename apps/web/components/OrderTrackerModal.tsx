'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  Printer,
  Copy,
  MessageCircle,
  ShieldCheck,
  Building2,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { Reservation } from '@/data/businessData';

function PaymentStrip({ id, isEs }: { id: string; isEs: boolean }) {
  const [info, setInfo] = useState<{ totalPEN: number; amountPaidPEN: number; paymentStatus: string } | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    let tk = '';
    try {
      tk = localStorage.getItem(`sq_pay_${id}`) ?? '';
    } catch {
      tk = '';
    }
    setToken(tk);
    fetch(`/api/orders/${encodeURIComponent(id)}?t=${encodeURIComponent(tk)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [id]);

  if (!info) return null;
  const label =
    info.paymentStatus === 'pagado_100'
      ? isEs ? 'Pagado al 100%' : 'Paid in full'
      : info.paymentStatus === 'adelanto_50'
        ? isEs ? 'Adelanto recibido' : 'Deposit received'
        : info.paymentStatus === 'anulado'
          ? isEs ? 'Pago anulado' : 'Payment voided'
          : isEs ? 'Pago pendiente' : 'Payment pending';
  const canPay = info.paymentStatus === 'pendiente' || info.paymentStatus === 'adelanto_50';
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-4 border border-stone-200">
      <div className="text-sm">
        <div className="font-extrabold text-stone-900">{label}</div>
        <div className="text-stone-500">
          S/ {info.amountPaidPEN.toFixed(2)} / S/ {info.totalPEN.toFixed(2)}
        </div>
      </div>
      {canPay && (
        <a
          href={`/pago/${id}?t=${token}`}
          className="px-4 py-2.5 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm"
        >
          {isEs ? 'Pagar ahora' : 'Pay now'}
        </a>
      )}
    </div>
  );
}

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string | null;
  lang?: 'es' | 'en';
}

export function OrderTrackerModal({
  isOpen,
  onClose,
  initialCode,
  lang = 'es',
}: OrderTrackerModalProps) {
  const { reservations } = useCMS();
  const isEs = lang === 'es';

  const [searchCode, setSearchCode] = useState(initialCode || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Find target reservation
  const targetReservation: Reservation | undefined = reservations.find(
    (r) => r.id.toLowerCase() === (searchCode.trim() || initialCode || '').toLowerCase()
  ) || (initialCode ? reservations.find((r) => r.id === initialCode) : reservations[0]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Status mapping
  const getStatusBadge = (res: Reservation) => {
    switch (res.status) {
      case 'concretado':
        return {
          label: isEs ? 'Venta Concretada · Confirmada' : 'Confirmed & Completed',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          stepIndex: 3,
        };
      case 'en_seguimiento':
        return {
          label: isEs ? 'En Negociación / Pago' : 'In Progress / Payment',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          stepIndex: 2,
        };
      case 'cotizado':
        return {
          label: isEs ? 'Cotización Enviada al Cliente' : 'Quotation Issued',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          stepIndex: 1,
        };
      case 'declinado':
        return {
          label: isEs ? 'Venta Declinada' : 'Declined',
          color: 'bg-red-100 text-red-800 border-red-300',
          stepIndex: -1,
        };
      default:
        return {
          label: isEs ? 'Solicitud Recibida (Nueva)' : 'New Request',
          color: 'bg-stone-100 text-stone-800 border-stone-300',
          stepIndex: 0,
        };
    }
  };

  const badge = targetReservation ? getStatusBadge(targetReservation) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-[#FDFBF7] w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-[#F6A935] my-4 max-h-[92vh] flex flex-col overflow-hidden text-[#1C1917]">
        {/* Top Header */}
        <div className="bg-[#181513] text-stone-100 px-5 sm:px-8 py-4 border-b-2 border-[#F6A935]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#221E1B] border border-[#F6A935] flex items-center justify-center text-[#F6A935]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F6A935] block font-bold">
                {isEs ? 'Portal de Seguimiento de Huéspedes' : 'Guest Tracking Portal'}
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-extrabold text-white">
                {isEs ? 'Rastreo de Reserva en Tiempo Real' : 'Real-Time Order Tracking'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:px-8 bg-[#F4EFE6] border-b border-[#F6A935]/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder={isEs ? 'Ingresa tu código (Ej: SQ-2026-0104)...' : 'Enter tracking code (e.g. SQ-2026-0104)...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-[#F6A935] text-stone-900"
              />
            </div>

            {/* Quick selectors for demo */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
              <span>{isEs ? 'Ejemplos:' : 'Examples:'}</span>
              {reservations.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSearchCode(r.id)}
                  className="px-2 py-1 bg-white hover:bg-stone-100 rounded-md border border-stone-300 font-mono text-xs font-semibold"
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {!targetReservation ? (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="font-heading text-lg font-bold text-stone-800">
                {isEs ? 'No encontramos ninguna reserva con ese código' : 'No reservation found'}
              </h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto">
                {isEs
                  ? 'Verifica que el código coincida con el formato SQ-2026-XXXX proporcionado en tu comprobante o correo.'
                  : 'Check that your code matches the SQ-2026-XXXX format.'}
              </p>
            </div>
          ) : (
            <>
              {/* Order header card */}
              <div className="bg-white rounded-2xl p-5 border-2 border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#442A19]">
                      {targetReservation.id}
                    </span>
                    <button
                      onClick={() => handleCopyCode(targetReservation.id)}
                      className="p-1 hover:bg-stone-100 rounded text-stone-500"
                      title={isEs ? 'Copiar código' : 'Copy'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copied && <span className="text-xs text-emerald-600 font-bold">¡Copiado!</span>}
                  </div>

                  <span className="text-xs text-stone-500 block mt-0.5">
                    {isEs ? 'Registrado el:' : 'Created on:'}{' '}
                    {new Date(targetReservation.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {badge && (
                    <span
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  )}

                  <button
                    onClick={handlePrint}
                    className="p-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 transition-colors border border-stone-300"
                    title={isEs ? 'Imprimir comprobante' : 'Print'}
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <PaymentStrip id={targetReservation.id} isEs={isEs} />

              {/* Real-time Timeline */}
              {targetReservation.status !== 'declinado' && (
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                    {isEs ? 'Línea de Vida de la Reserva' : 'Reservation Progress'}
                  </h4>

                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 w-full z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-500"
                      style={{
                        width:
                          badge?.stepIndex === 3
                            ? '100%'
                            : badge?.stepIndex === 2
                            ? '66%'
                            : badge?.stepIndex === 1
                            ? '33%'
                            : '0%',
                      }}
                    />

                    {/* Step 1: Recibido */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 text-center">
                        {isEs ? '1. Solicitud' : '1. Requested'}
                      </span>
                    </div>

                    {/* Step 2: Cotizado */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                          (badge?.stepIndex ?? 0) >= 1
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {(badge?.stepIndex ?? 0) >= 1 ? '✓' : '2'}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 text-center">
                        {isEs ? '2. Cotizado' : '2. Quoted'}
                      </span>
                    </div>

                    {/* Step 3: Seguimiento / Pago */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                          (badge?.stepIndex ?? 0) >= 2
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {(badge?.stepIndex ?? 0) >= 2 ? '✓' : '3'}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 text-center">
                        {isEs ? '3. En Gestión' : '3. Processing'}
                      </span>
                    </div>

                    {/* Step 4: Concretado */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow ${
                          (badge?.stepIndex ?? 0) >= 3
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {(badge?.stepIndex ?? 0) >= 3 ? '✓' : '4'}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 mt-1.5 text-center">
                        {isEs ? '4. Concretado' : '4. Completed'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* If declined, show reason banner */}
              {targetReservation.status === 'declinado' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{isEs ? 'Esta solicitud ha sido declinada o cancelada' : 'Booking declined'}</span>
                  </div>
                  <p className="text-xs text-red-700 ml-7">
                    Motivo registrado: {targetReservation.declineReason || 'Sin motivo especificado'}. El stock ha sido liberado en el sistema.
                  </p>
                </div>
              )}

              {/* Voucher / Tax Invoice banner if concretado */}
              {targetReservation.status === 'concretado' && (
                <div className="bg-[#FFFDF9] border-2 border-[#F6A935] rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F6A935]/30 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-[#2E5A36]" />
                      <div>
                        <h4 className="font-heading font-extrabold text-[#181513] text-sm sm:text-base">
                          {isEs ? 'Voucher Oficial & Comprobante Tributario' : 'Official Tax Voucher & Access Pass'}
                        </h4>
                        <span className="text-xs text-stone-600 font-medium">
                          Sumaq Kawsay · Operador Turístico Oficial · Cusco
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs uppercase font-bold text-stone-600 block">
                        {targetReservation.invoiceType === 'factura' ? 'Factura Electrónica' : 'Boleta Electrónica'}
                      </span>
                      <span className="font-mono font-black text-sm text-[#442A19]">
                        {targetReservation.invoiceNumber || 'B001-00042'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500 block">Titular:</span>
                      <strong className="text-stone-900">{targetReservation.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Documento:</span>
                      <strong className="text-stone-900">
                        {targetReservation.customerDniOrPassport || 'No especificado'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Fecha Servicio:</span>
                      <strong className="text-stone-900">{targetReservation.travelDate}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Estado de Pago:</span>
                      <strong className="text-emerald-700">100% Pagado & Verificado</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown of services */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <h4 className="font-heading font-extrabold text-stone-900 text-sm border-b pb-2">
                  {isEs ? 'Detalle de los Servicios Reservados' : 'Reserved Services Breakdown'}
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  {targetReservation.stayItem && (
                    <div className="flex justify-between items-start pb-2 border-b border-stone-100">
                      <div>
                        <strong className="text-stone-900 block">
                          🛏️ {targetReservation.stayItem.name}
                        </strong>
                        <span className="text-stone-500 text-xs">
                          {targetReservation.stayItem.details || `${targetReservation.stayItem.quantity} noches`}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        S/ {targetReservation.stayItem.subtotalPEN}
                      </span>
                    </div>
                  )}

                  {targetReservation.activities.map((act) => (
                    <div key={act.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                      <div>
                        <strong className="text-stone-900 block">
                          🧭 {act.name}
                        </strong>
                        <span className="text-stone-500 text-xs">
                          {act.quantity} {isEs ? 'participantes' : 'guests'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        S/ {act.subtotalPEN}
                      </span>
                    </div>
                  ))}

                  {targetReservation.meals.map((meal) => (
                    <div key={meal.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                      <div>
                        <strong className="text-stone-900 block">
                          🍽️ {meal.name}
                        </strong>
                        <span className="text-stone-500 text-xs">
                          {meal.quantity} {isEs ? 'raciones' : 'meals'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        S/ {meal.subtotalPEN}
                      </span>
                    </div>
                  ))}

                  {targetReservation.extras.map((extra) => (
                    <div key={extra.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                      <div>
                        <strong className="text-stone-900 block">
                          ✨ {extra.name}
                        </strong>
                        <span className="text-stone-500 text-xs">
                          {extra.quantity} {isEs ? 'unidades' : 'units'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        S/ {extra.subtotalPEN}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-stone-200">
                  <span className="font-extrabold text-stone-800 text-sm">TOTAL:</span>
                  <div className="text-right">
                    <span className="font-mono text-xl font-black text-[#442A19]">
                      S/ {targetReservation.totalPEN}
                    </span>
                    <span className="text-xs text-stone-500 ml-2">
                      (${targetReservation.totalUSD} USD)
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Agent Card */}
              <div className="bg-[#F8F6F0] rounded-2xl p-4 border border-[#F6A935]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#181513] text-[#F6A935] flex items-center justify-center font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-stone-600 block">
                      {isEs ? 'Asesor Comercial Asignado' : 'Assigned Sales Agent'}
                    </span>
                    <strong className="text-stone-900 text-sm sm:text-base font-bold">{targetReservation.assignedAgent}</strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/51912189856?text=${encodeURIComponent(
                    `Hola ${targetReservation.assignedAgent}, te escribo respecto a mi reserva ${targetReservation.id} (${targetReservation.customerName}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEs ? 'Escribir por WhatsApp' : 'Contact on WhatsApp'}</span>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
