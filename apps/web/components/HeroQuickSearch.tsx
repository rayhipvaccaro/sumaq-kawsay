'use client';

import { useState } from 'react';
import {
  Calendar,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface HeroQuickSearchProps {
  lang: 'es' | 'en';
  currency: string;
}

export function HeroQuickSearch({ lang, currency }: HeroQuickSearchProps) {
  const isEs = lang === 'es';
  const { openBookingWizard } = useCMS();

  // State for search selections
  const [selectedExperience, setSelectedExperience] = useState('hosp-bungalow');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState('2');

  const experienceOptions = [
    { id: 'hosp-bungalow', labelEs: 'Bungalow Rústico de Piedra con Chimenea', labelEn: 'Stone Rustic Bungalow with Fireplace', type: 'hospedaje' },
    { id: 'hosp-glamping', labelEs: 'Domo Glamping con Vista a Glaciares', labelEn: 'Panoramic Glamping Dome', type: 'hospedaje' },
    { id: 'day-pass-inkalab', labelEs: 'Pasadía Inka Lab Km 84 (Day Pass)', labelEn: 'Inka Lab Day Pass Km 84', type: 'hospedaje' },
    { id: 'act-hanan-pacha', labelEs: 'Ruta Hanan Pacha (Alturas & Astronomía)', labelEn: 'Hanan Pacha Sacred Trail', type: 'actividad' },
    { id: 'act-willka-unu', labelEs: 'Ruta Willka Unu & Baño de Vapor Ancestral', labelEn: 'Willka Unu Sacred Waters', type: 'actividad' },
    { id: 'act-inti-punku', labelEs: 'Inti Punku & Mirador Solar', labelEn: 'Inti Punku Sun Gate Trek', type: 'actividad' },
    { id: 'camino-inca-2d', labelEs: 'Camino Inca Exclusivo 2D/1N', labelEn: 'Inca Trail Exclusive 2D/1N', type: 'tour' },
    { id: 'etnobotanica-chillca', labelEs: 'Etnobotánica & Herbario Vivo Chillca', labelEn: 'Living Ethnobotany Lab', type: 'tour' },
  ];

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    openBookingWizard();
  };

  const handleQuickSelection = (expId: string) => {
    setSelectedExperience(expId);
    openBookingWizard();
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 sm:my-8 text-left">
      {/* Luxury Booking Engine Container */}
      <div className="bg-[#181513]/95 backdrop-blur-md border border-[#F6A935]/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0_16px_48px_rgba(0,0,0,0.7)] relative">
        
        {/* Header Ribbon of the Search Engine */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#F6A935]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F6A935]">
              {isEs ? 'Buscador y Cotizador Oficial' : 'Official Booking & Availability'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isEs ? 'Tarifas Directas · Sin Intermediarios' : 'Direct Rates · No Middlemen'}</span>
          </div>
        </div>

        {/* 4-Column Search Form */}
        <form onSubmit={handleStartSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Field 1: Experiencia / Alojamiento */}
          <div className="lg:col-span-5 space-y-1.5">
            <label htmlFor="hero-experience-select" className="block text-xs sm:text-sm font-bold text-stone-200 uppercase tracking-wide">
              {isEs ? '1. Experiencia o Estancia' : '1. Experience or Stay'}
            </label>
            <div className="relative">
              <select
                id="hero-experience-select"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full min-h-[48px] bg-[#221E1B] border border-stone-700 focus:border-[#F6A935] rounded-xl sm:rounded-2xl px-3.5 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {experienceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#181513] text-stone-100">
                    {isEs ? opt.labelEs : opt.labelEn}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#F6A935] text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Field 2: Fecha de Llegada */}
          <div className="lg:col-span-3 space-y-1.5">
            <label htmlFor="hero-date-input" className="block text-xs sm:text-sm font-bold text-stone-200 uppercase tracking-wide">
              {isEs ? '2. Fecha Estimada' : '2. Estimated Date'}
            </label>
            <input
              id="hero-date-input"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full min-h-[48px] bg-[#221E1B] border border-stone-700 focus:border-[#F6A935] rounded-xl sm:rounded-2xl px-3.5 py-2.5 text-sm sm:text-base font-semibold text-white focus:outline-none transition-colors cursor-pointer"
            />
          </div>

          {/* Field 3: Huéspedes */}
          <div className="lg:col-span-2 space-y-1.5">
            <label htmlFor="hero-guests-select" className="block text-xs sm:text-sm font-bold text-stone-200 uppercase tracking-wide">
              {isEs ? '3. Viajeros' : '3. Guests'}
            </label>
            <select
              id="hero-guests-select"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full min-h-[48px] bg-[#221E1B] border border-stone-700 focus:border-[#F6A935] rounded-xl sm:rounded-2xl px-3.5 py-3 text-sm sm:text-base font-semibold text-white focus:outline-none transition-colors cursor-pointer"
            >
              <option value="1">1 {isEs ? 'Viajero' : 'Guest'}</option>
              <option value="2">2 {isEs ? 'Viajeros (Pareja)' : 'Guests (Couple)'}</option>
              <option value="3">3 {isEs ? 'Viajeros' : 'Guests'}</option>
              <option value="4">4 {isEs ? 'Viajeros (Familia)' : 'Guests'}</option>
              <option value="6">5+ {isEs ? 'Grupo Privado' : 'Private Group'}</option>
            </select>
          </div>

          {/* Field 4: Action Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#F6A935] hover:bg-[#9E2021] active:bg-[#7D1718] text-[#442A19] hover:text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-[#181513] shrink-0" />
              <span>{isEs ? 'Verificar Cupos' : 'Check Dates'}</span>
            </button>
          </div>
        </form>

        {/* Clean Editorial Recommendations Row (No pill candy tags) */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-stone-300">
          <span className="text-stone-400 font-semibold">{isEs ? 'Frecuentes:' : 'Popular:'}</span>
          <button
            type="button"
            onClick={() => handleQuickSelection('hosp-glamping')}
            className="text-stone-200 hover:text-[#F6A935] font-medium transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {isEs ? 'Domo Glamping' : 'Glamping Dome'}
          </button>
          <span className="text-stone-600" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => handleQuickSelection('day-pass-inkalab')}
            className="text-stone-200 hover:text-[#F6A935] font-medium transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {isEs ? 'Pasadía Inka Lab' : 'Inka Lab Day Pass'}
          </button>
          <span className="text-stone-600" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => handleQuickSelection('act-willka-unu')}
            className="text-stone-200 hover:text-[#F6A935] font-medium transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {isEs ? 'Cascada Willka Unu' : 'Willka Unu Waterfalls'}
          </button>
          <span className="text-stone-600" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => handleQuickSelection('camino-inca-2d')}
            className="text-stone-200 hover:text-[#F6A935] font-medium transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {isEs ? 'Camino Inca 2D' : 'Inca Trail 2D'}
          </button>
        </div>
      </div>
    </div>
  );
}
