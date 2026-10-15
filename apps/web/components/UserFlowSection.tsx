'use client';

import { fmt } from '@/lib/money';

import {
  Bed,
  Compass,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  Calendar,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface UserFlowSectionProps {
  lang: 'es' | 'en';
  currency: string;
}

export function UserFlowSection({ lang, currency }: UserFlowSectionProps) {
  const isEs = lang === 'es';
  const { openBookingWizard, stockItems, openOrderTracker } = useCMS();

  // Quick stats from stock
  const stayAvailable = stockItems
    .filter((s) => s.area === 'hospedaje')
    .reduce((acc, s) => acc + (s.capacityMax - s.booked), 0);

  const activitiesAvailable = stockItems
    .filter((s) => s.area === 'actividades')
    .reduce((acc, s) => acc + (s.capacityMax - s.booked), 0);

  const mealsAvailable = stockItems
    .filter((s) => s.area === 'alimentacion')
    .reduce((acc, s) => acc + (s.capacityMax - s.booked), 0);

  return (
    <section id="flujo-integral" className="py-20 sm:py-24 bg-[#181513] text-stone-100 border-b border-[#F6A935]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#F6A935] block">
            {isEs ? 'Experiencia del Huésped · Sede Inka Lab Km 84' : 'Guest Experience · Inka Lab Hub Km 84'}
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isEs ? 'Cómo Diseñar Tu Experiencia a Medida' : 'How to Design Your Custom Stay'}
          </h2>

          <p className="text-stone-200 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {isEs
              ? 'Primero eliges tu estancia, luego sumas actividades y rutas ancestrales, agregas gastronomía orgánica de nuestra huerta y coordinas traslados privados.'
              : 'First select your sanctuary lodging, then add sacred trails and steam baths, choose organic Novoandino dining, and arrange private transfers.'}
          </p>
        </div>

        {/* 4 Interactive Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Hospedaje */}
          <div className="bg-[#221E1B] rounded-2xl sm:rounded-3xl p-6 border border-stone-800 hover:border-[#F6A935] transition-all duration-300 group shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181513] border border-[#F6A935]/50 flex items-center justify-center text-[#F6A935] shadow-sm">
                  <Bed className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/80">
                  {stayAvailable} {isEs ? 'plazas' : 'slots'}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#F6A935] font-bold block mb-1">
                  {isEs ? 'Paso 1' : 'Step 1'}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {isEs ? 'Dónde Quedarse' : 'Where to Stay'}
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed font-normal">
                  {isEs
                    ? 'Bungalows rústicos con chimenea, Domos Glamping con vista a glaciares o la opción de Pasadía (Day Pass).'
                    : 'Stone rustic bungalows with fireplaces, glamping domes with glacier views, or Day Pass.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 mt-4 text-xs sm:text-sm text-stone-300 flex items-center justify-between">
              <span>{isEs ? 'Desde' : 'From'} {fmt(290, currency, 78)}{isEs ? ' / noche' : ' / night'}</span>
              <span className="text-[#F6A935] font-bold">1 / 4</span>
            </div>
          </div>

          {/* Card 2: Actividades */}
          <div className="bg-[#221E1B] rounded-2xl sm:rounded-3xl p-6 border border-stone-800 hover:border-[#F6A935] transition-all duration-300 group shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181513] border border-[#F6A935]/50 flex items-center justify-center text-[#F6A935] shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/80">
                  {activitiesAvailable} {isEs ? 'cupos' : 'spots'}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#F6A935] font-bold block mb-1">
                  {isEs ? 'Paso 2' : 'Step 2'}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {isEs ? 'Actividades & Rutas' : 'Experiences & Trails'}
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed font-normal">
                  {isEs
                    ? 'Hanan Pacha (Astronomía), Willka Unu (Sauna Inca), Cabalgata de Paso o Etnobotánica de Chillca.'
                    : 'Hanan Pacha astronomy, Willka Unu steam sauna, paso horse rides, or ethnobotany in Chillca.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 mt-4 text-xs sm:text-sm text-stone-300 flex items-center justify-between">
              <span>{isEs ? 'Desde' : 'From'} {fmt(150, currency, 40)}{isEs ? ' / pers.' : ' / guest'}</span>
              <span className="text-[#F6A935] font-bold">2 / 4</span>
            </div>
          </div>

          {/* Card 3: Alimentación */}
          <div className="bg-[#221E1B] rounded-2xl sm:rounded-3xl p-6 border border-stone-800 hover:border-[#F6A935] transition-all duration-300 group shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181513] border border-[#F6A935]/50 flex items-center justify-center text-[#F6A935] shadow-sm">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/80">
                  {mealsAvailable} {isEs ? 'platos' : 'dishes'}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#F6A935] font-bold block mb-1">
                  {isEs ? 'Paso 3' : 'Step 3'}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {isEs ? 'Cocina Orgánica' : 'Organic Dining'}
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed font-normal">
                  {isEs
                    ? 'Desayunos andinos con kiwicha y quinua real, Almuerzo Novoandino de temporada o Pachamanca en tierra.'
                    : 'Andean breakfasts with native grains, seasonal Novoandino lunch, or ancestral underground Pachamanca.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 mt-4 text-xs sm:text-sm text-stone-300 flex items-center justify-between">
              <span>{isEs ? 'Desde' : 'From'} {fmt(38, currency, 10)}{isEs ? ' / plato' : ' / dish'}</span>
              <span className="text-[#F6A935] font-bold">3 / 4</span>
            </div>
          </div>

          {/* Card 4: Traslados y Confirmación */}
          <div className="bg-[#221E1B] rounded-2xl sm:rounded-3xl p-6 border border-stone-800 hover:border-[#F6A935] transition-all duration-300 group shadow-lg flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#181513] border border-[#F6A935]/50 flex items-center justify-center text-[#F6A935] shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/80">
                  {isEs ? 'Directo' : 'Direct'}
                </span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#F6A935] font-bold block mb-1">
                  {isEs ? 'Paso 4' : 'Step 4'}
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {isEs ? 'Reserva & Código' : 'Hold & Code'}
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed font-normal">
                  {isEs
                    ? 'Se genera tu código oficial de seguimiento (SQ-XXXX) y recibes asistencia directa de nuestro equipo local.'
                    : 'Generates your official tracking code (SQ-XXXX) with direct concierge coordination from our local team.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800/80 mt-4 text-xs sm:text-sm text-stone-300 flex items-center justify-between">
              <span className="text-emerald-400 font-bold">{isEs ? 'Garantía 100%' : '100% Guaranteed'}</span>
              <span className="text-[#F6A935] font-bold">4 / 4</span>
            </div>
          </div>
        </div>

        {/* Bottom Booking Trigger */}
        <div className="bg-[#221E1B] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#F6A935]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
              {isEs ? '¿Listo para armar tu expedición a medida?' : 'Ready to build your bespoke journey?'}
            </h4>
            <p className="text-sm sm:text-base text-stone-300 max-w-xl font-normal">
              {isEs
                ? 'El asistente te permite seleccionar fechas, servicios y obtener una cotización transparente al instante.'
                : 'Select your dates, tailor your sanctuary services, and receive an instant clear quote.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => openBookingWizard()}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl sm:rounded-2xl bg-[#F6A935] hover:bg-[#9E2021] hover:text-white active:bg-[#7D1718] text-[#442A19] font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>{isEs ? 'Diseñar Mi Estadía' : 'Start Booking'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => openOrderTracker()}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl sm:rounded-2xl bg-[#181513] hover:bg-stone-900 text-stone-200 hover:text-white border border-stone-700 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#F6A935]" />
              <span>{isEs ? 'Rastrear Reserva' : 'Track Booking'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
