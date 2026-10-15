'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Clock, Compass, Users } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { AvailabilityCalendar } from './AvailabilityCalendar';

interface HeroProps {
  lang: 'es' | 'en';
  currency?: string;
  onExploreTours: () => void;
  onOpenPlanner: () => void;
  onOpenSystemGuide?: () => void;
}

/** Ids = los mismos del stock que usa el asistente de reserva. */
const STAY_OPTIONS = [
  { id: 'hosp-bungalow', es: 'Bungalow de piedra con chimenea', en: 'Stone bungalow with fireplace' },
  { id: 'hosp-glamping', es: 'Domo glamping andino', en: 'Andean glamping dome' },
  { id: 'hosp-suite', es: 'Suite Imperial Inka Lab', en: 'Inka Lab Imperial Suite' },
];

const DO_OPTIONS = [
  { id: 'act-hanan-pacha', es: 'Hanan Pacha: astronomía y cumbres', en: 'Hanan Pacha: astronomy and peaks' },
  { id: 'act-willka-unu', es: 'Willka Unu: sauna inca a vapor', en: 'Willka Unu: Inca steam sauna' },
  { id: 'act-etnobotanica', es: 'Ruta etnobotánica en Chillca', en: 'Ethnobotany route in Chillca' },
  { id: 'act-cabalgata', es: 'Cabalgata por el Qhapaq Ñan', en: 'Horseback ride on the Qhapaq Ñan' },
  { id: 'act-inti-punku', es: 'Trek Inti Punku', en: 'Inti Punku trek' },
];

const FIELD =
  'w-full min-h-12 rounded-lg border border-[#442A19]/25 bg-white px-3.5 text-base text-[#2A1A10] ' +
  'focus-visible:border-[#9E2021] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2021]';

export function Hero({ lang, onExploreTours }: HeroProps) {
  const isEs = lang === 'es';
  const { generalContent, openBookingWizard, openOrderTracker } = useCMS();

  const [experienceId, setExperienceId] = useState('hosp-bungalow');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [calOpen, setCalOpen] = useState(false);

  const headline = isEs
    ? generalContent.heroSubtitleEs || 'Donde la sabiduría de los Andes sigue viva.'
    : generalContent.heroSubtitleEn || 'Where the living wisdom of the Andes endures.';

  const description = isEs
    ? generalContent.heroDescriptionEs ||
      'Duerme en un bungalow de piedra, camina con guías de Chillca y cena con lo que crece en nuestro huerto. Estás a 80 minutos de Cusco, en el Km 84 de Ollantaytambo.'
    : generalContent.heroDescriptionEn ||
      'Sleep in a stone bungalow, hike with guides from Chillca and dine on what grows in our garden. You are 80 minutes from Cusco, at Km 84 in Ollantaytambo.';

  const heroImageSrc = generalContent.heroImage || '/images/hero_valle_sagrado_andes_1791233029285.jpg';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setCalOpen(true);
      return;
    }
    openBookingWizard({ experienceId, date, guests: Number(guests) });
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#1F1A17] pt-28"
    >
      <Image
        src={heroImageSrc}
        alt={isEs ? 'Valle Sagrado de los Incas visto desde Ollantaytambo' : 'Sacred Valley of the Incas seen from Ollantaytambo'}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A17] via-[#1F1A17]/55 to-[#1F1A17]/15" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <h1
          id="hero-title"
          className="font-editorial max-w-3xl text-balance text-5xl font-semibold leading-[1.05] tracking-normal text-white sm:text-6xl lg:text-7xl"
        >
          {headline}
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-stone-100 sm:text-xl">{description}</p>

        <form
          onSubmit={handleSubmit}
          aria-label={isEs ? 'Buscar disponibilidad' : 'Check availability'}
          className="mt-8 grid grid-cols-1 gap-3 rounded-2xl bg-[#FDFBF7] p-4 shadow-2xl sm:grid-cols-2 sm:p-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
        >
          <div className="min-w-0">
            <label htmlFor="hero-experience" className="mb-1.5 block text-sm font-semibold text-[#442A19]">
              {isEs ? 'Qué quieres vivir' : 'What you want to do'}
            </label>
            <select
              id="hero-experience"
              name="experience"
              autoComplete="off"
              value={experienceId}
              onChange={(e) => setExperienceId(e.target.value)}
              className={FIELD}
            >
              <optgroup label={isEs ? 'Dormir en Inka Lab' : 'Stay at Inka Lab'}>
                {STAY_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {isEs ? o.es : o.en}
                  </option>
                ))}
              </optgroup>
              <optgroup label={isEs ? 'Actividades' : 'Activities'}>
                {DO_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {isEs ? o.es : o.en}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="relative min-w-0">
            <label htmlFor="hero-date" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#442A19]">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {isEs ? 'Llegada' : 'Arrival'}
            </label>
            <button
              id="hero-date"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={calOpen}
              onClick={() => setCalOpen((v) => !v)}
              className={`${FIELD} flex items-center justify-between text-left`}
            >
              <span className={date ? 'font-semibold' : 'text-stone-500'}>
                {date || (isEs ? 'Elige un día' : 'Pick a day')}
              </span>
              <CalendarDays className="h-4 w-4 text-[#442A19]" aria-hidden="true" />
            </button>
            {calOpen && (
              <div className="absolute bottom-full left-0 right-0 z-30 mb-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl sm:left-auto sm:w-[22rem]">
                <AvailabilityCalendar
                  value={date}
                  onChange={(d) => {
                    setDate(d);
                    setCalOpen(false);
                  }}
                  lang={lang}
                />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <label htmlFor="hero-guests" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#442A19]">
              <Users className="h-4 w-4" aria-hidden="true" />
              {isEs ? 'Viajeros' : 'Guests'}
            </label>
            <select
              id="hero-guests"
              name="guests"
              autoComplete="off"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={FIELD}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="min-h-12 touch-manipulation rounded-lg bg-[#9E2021] px-6 text-base font-bold text-white transition-colors hover:bg-[#7D1718] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#442A19] sm:col-span-2 lg:col-span-1"
          >
            {isEs ? 'Ver disponibilidad' : 'Check availability'}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-stone-100">
          <button
            type="button"
            onClick={onExploreTours}
            className="inline-flex min-h-11 touch-manipulation items-center gap-2 font-semibold underline decoration-[#F6A935] decoration-2 underline-offset-4 hover:text-[#FDE8B5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6A935]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            {isEs ? 'Ver todas las experiencias' : 'Browse all experiences'}
          </button>
          <button
            type="button"
            onClick={() => openOrderTracker()}
            className="inline-flex min-h-11 touch-manipulation items-center gap-2 hover:text-[#FDE8B5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6A935]"
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            {isEs ? 'Ya reservé: buscar mi código' : 'Already booked: find my code'}
          </button>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-white/25 pt-5 text-stone-100 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-stone-300">{isEs ? 'Dónde' : 'Where'}</dt>
            <dd className="text-lg font-semibold" translate="no">
              Km&nbsp;84, Ollantaytambo
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-300">{isEs ? 'Altitud' : 'Altitude'}</dt>
            <dd className="text-lg font-semibold tabular-nums">2,792&nbsp;msnm</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-300">{isEs ? 'Cómo viajas' : 'How you travel'}</dt>
            <dd className="text-lg font-semibold">
              {isEs ? 'Grupos reducidos, guías locales' : 'Small groups, local guides'}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
