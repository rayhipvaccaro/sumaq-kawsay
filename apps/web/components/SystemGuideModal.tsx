'use client';

import { useState } from 'react';
import {
  X,
  Compass,
  Calendar,
  Bed,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  ChevronRight,
  ArrowRight,
  Calculator,
  Layers,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface SystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en';
}

export function SystemGuideModal({ isOpen, onClose, lang = 'es' }: SystemGuideModalProps) {
  const isEs = lang === 'es';
  const { openBookingWizard, openOrderTracker, openBusinessPortal, openManualModal } = useCMS();
  const [activeAudience, setActiveAudience] = useState<'tourist' | 'business'>('tourist');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
    >
      <div className="relative bg-[#181513] text-stone-100 w-full max-w-4xl rounded-3xl shadow-2xl border-2 border-[#F6A935] my-4 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#221E1B] px-5 sm:px-8 py-5 border-b-2 border-[#F6A935]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#181513] border border-[#F6A935] flex items-center justify-center text-[#F6A935]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F6A935] block font-bold">
                {isEs ? 'GUÍA RÁPIDA DE USO · SUMAQ KAWSAY & INKA LAB' : 'QUICK START GUIDE · SYSTEM OVERVIEW'}
              </span>
              <h2 className="font-heading text-lg sm:text-2xl font-black text-white">
                {isEs ? '¿Cómo Funciona el Sistema?' : 'How Does the Platform Work?'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audience Selector (Viajero vs Personal/Negocio) */}
        <div className="bg-[#181513] px-5 sm:px-8 py-3 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveAudience('tourist')}
              className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
                activeAudience === 'tourist'
                  ? 'bg-[#F6A935] text-[#181513] shadow-md'
                  : 'bg-[#221E1B] text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              🧭 {isEs ? 'Soy Viajero / Turista' : 'I am a Traveler / Guest'}
            </button>
            <button
              onClick={() => setActiveAudience('business')}
              className={`px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
                activeAudience === 'business'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#221E1B] text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              💼 {isEs ? 'Soy Operador / Personal (Roles)' : 'I am Staff / Business User'}
            </button>
          </div>
          <span className="text-xs text-stone-400 font-mono hidden sm:inline">
            {activeAudience === 'tourist' ? 'Guía para clientes' : 'Manual operativo'}
          </span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {activeAudience === 'tourist' ? (
            <div className="space-y-6">
              <div className="text-sm sm:text-base text-stone-300 leading-relaxed">
                {isEs
                  ? 'Diseñar y reservar tu experiencia consciente en Inka Lab Km 84 y Cusco es un proceso fluido en solo 3 sencillos pasos:'
                  : 'Designing and booking your mindful experience at Inka Lab Km 84 & Cusco is quick and straightforward in 3 steps:'}
              </div>

              {/* Step 1 */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F6A935]/20 border border-[#F6A935] text-[#F6A935] font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                    <Bed className="w-4 h-4 text-[#F6A935]" />
                    <span>{isEs ? 'Elige tu Estadía o Pasadía (Day Pass)' : 'Choose your Stay or Day Pass'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {isEs
                      ? 'Selecciona entre Bungalows rústicos con chimenea, Domos Glamping con vista a glaciares, o simplemente un Pasadía de un día en Inka Lab Km 84 Ollantaytambo. Define tus fechas y cantidad de viajeros.'
                      : 'Select from stone bungalows with fireplaces, panoramic glamping domes, or a full Day Pass at Inka Lab Km 84 Ollantaytambo. Pick your dates and group size.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F6A935]/20 border border-[#F6A935] text-[#F6A935] font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-[#F6A935]" />
                    <span>{isEs ? 'Suma Actividades Sagradas, Comida Orgánica y Traslados' : 'Add Sacred Journeys, Organic Dining & Transfers'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {isEs
                      ? 'Personaliza tu estadía con expediciones a Hanan Pacha, cascadas Willka Unu, Inti Punku, o nuestro laboratorio de etnobotánica Chillca. Agrega almuerzo Novoandino, Pachamanca tradicional y traslados privados desde Cusco.'
                      : 'Customize your stay with sacred hikes to Hanan Pacha, Willka Unu waterfalls, Inti Punku, or Chillca ethnobotany lab. Add traditional Pachamanca and private transfers.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F6A935]/20 border border-[#F6A935] text-[#F6A935] font-black flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{isEs ? 'Confirmación Instantánea con Código SQ-XXXX y Rastreo' : 'Instant Confirmation with SQ-XXXX Code & Tracking'}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {isEs
                      ? 'Al enviar tu reserva recibirás un código único (ejemplo: SQ-1042). Puedes rastrear el estado en tiempo real, coordinar por WhatsApp oficial y descargar tu itinerario detallado.'
                      : 'Upon submission you receive a unique code (e.g., SQ-1042). Track status in real-time, coordinate via WhatsApp, and access your itinerary.'}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    openBookingWizard();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg min-h-[44px]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isEs ? 'Iniciar Reserva Paso a Paso' : 'Start 4-Step Booking'}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openOrderTracker();
                  }}
                  className="px-5 py-3 rounded-xl bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 text-stone-200 text-sm font-bold flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-[#F6A935]" />
                  <span>{isEs ? 'Rastrear Reserva Existente' : 'Track Existing Booking'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm sm:text-base text-stone-300 leading-relaxed">
                {isEs
                  ? 'El sistema cuenta con un Portal de Roles integral con perfiles diseñados para la gestión operativa y comercial de Sumaq Kawsay & Inka Lab:'
                  : 'The platform features a multi-role business management portal tailored for Sumaq Kawsay & Inka Lab operations:'}
              </div>

              {/* Role 1: Ventas */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-base text-emerald-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{isEs ? 'Rol: Ventas & Marketing' : 'Role: Sales & Marketing'}</span>
                  </h3>
                  <span className="text-xs bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800">
                    Comercial
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isEs
                    ? 'Revisión y confirmación de reservas entrantes (SQ-XXXX), envío de cotizaciones en PDF/WhatsApp, control de leads del formulario de contacto y seguimiento de clientes.'
                    : 'Process incoming bookings, dispatch quotes via WhatsApp/Email, track CRM leads, and coordinate guest details.'}
                </p>
              </div>

              {/* Role 2: Contador */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-base text-amber-400 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span>{isEs ? 'Rol: Contador & Finanzas' : 'Role: Accounting & Finance'}</span>
                  </h3>
                  <span className="text-xs bg-amber-950 text-amber-400 px-2 py-0.5 rounded-md border border-amber-800">
                    Financiero
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isEs
                    ? 'Arqueo de caja diario, emisión de comprobantes (Boletas y Facturas electrónicas), desglose del IGV (18%), registro de egresos y liquidación a guías y proveedores locales.'
                    : 'Daily cash reconciliation, SUNAT electronic invoices and receipts, 18% VAT breakdowns, expense ledger, and provider payouts.'}
                </p>
              </div>

              {/* Role 3: Administrador */}
              <div className="bg-[#221E1B] rounded-2xl p-5 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-base text-blue-400 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{isEs ? 'Rol: Administrador General' : 'Role: General Manager'}</span>
                  </h3>
                  <span className="text-xs bg-blue-950 text-blue-400 px-2 py-0.5 rounded-md border border-blue-800">
                    Total
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isEs
                    ? 'Control de inventario y aforo de bungalows, domos y tours en tiempo real, gestión de catálogo, tarifas en Soles y Dólares, y resguardos de base de datos.'
                    : 'Manage room & tour live stock capacities, catalog pricing in PEN & USD, and full CMS backup.'}
                </p>
              </div>

              {/* Action */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    openBusinessPortal('ventas');
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{isEs ? 'Acceder al Portal de Roles' : 'Enter Roles Portal'}</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openManualModal('sistema');
                  }}
                  className="px-5 py-3 rounded-xl bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 text-stone-200 text-sm font-bold flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#F6A935]" />
                  <span>{isEs ? 'Ver Manual Completo de Sistema' : 'View Full System Manual'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#221E1B] px-5 sm:px-8 py-3.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F6A935]" />
            <span>Sumaq Kawsay & Inka Lab · Cusco, Perú</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold"
          >
            {isEs ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
