'use client';

import { fmt } from '@/lib/money';

import { useState } from 'react';
import Image from 'next/image';
import { Mountain, Clock, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import type { AncestralZone } from '@/data/inkaLabData'; import { useSiteData } from '@/lib/siteData';

interface AncestralZonesProps {
  lang: 'es' | 'en';
  currency: string;
  onBookZone: (zone: AncestralZone) => void;
}

export function AncestralZones({ lang, currency, onBookZone }: AncestralZonesProps) { const { zones: ANCESTRAL_ZONES } = useSiteData();
  const [activeZoneId, setActiveZoneId] = useState<string>('hanan-pacha');
  const isEs = lang === 'es';

  // Customize zone images with the real downloaded assets from inka-lab
  const zonesWithRealPhotos = ANCESTRAL_ZONES.map((zone) => {
    if (zone.id === 'hanan-pacha') {
      return { ...zone, image: '/images/inkalab/astronomia.jpeg' };
    }
    if (zone.id === 'willka-unu') {
      return { ...zone, image: '/images/inkalab/laguna-nevada.png' };
    }
    return zone;
  });

  const currentZone = zonesWithRealPhotos.find((z) => z.id === activeZoneId) || zonesWithRealPhotos[0];

  const priceDisplay = fmt(currentZone.pricePEN, currency, currentZone.priceUSD);

  return (
    <section id="zonas-ancestrales" className="py-16 sm:py-24 bg-[#181513] text-stone-100 border-b border-[#F6A935]/30 relative overflow-hidden">
      {/* Background ambient gold gradient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F6A935]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#442A19]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Responsive Typography */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#F6A935] block mb-2">
            {isEs ? 'Sede Sumaq Kawsay · Km 84 Ollantaytambo' : 'Sumaq Kawsay Sanctuary · Km 84 Ollantaytambo'}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            {isEs ? 'Las 3 Zonas Sagradas en Inka Lab' : 'The 3 Sacred Zones at Inka Lab'}
          </h2>
          <p className="mt-3 sm:mt-5 text-base sm:text-xl md:text-2xl text-stone-200 leading-relaxed font-normal">
            {isEs
              ? 'Sumaq Kawsay te invita a experimentar sus espacios concebidos según la cosmovisión incaica: Hanan Pacha (las alturas y la astronomía cósmica), Willka Unu (las aguas sagradas y el baño de vapor) e Inti Punku (la ingeniería lítica de los portales).'
              : 'Sumaq Kawsay invites you to experience our sanctuary spaces: Hanan Pacha (high peaks and cosmic astronomy), Willka Unu (sacred waters and herbal vapor), and Inti Punku (megalithic stone mastery).'}
          </p>
        </div>

        {/* Segmented Zone Selector with Smooth Horizontal Touch Scroll */}
        <div
          role="tablist"
          aria-label={isEs ? 'Zonas Sagradas de Inka Lab' : 'Sacred Zones of Inka Lab'}
          className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12 overflow-x-auto pb-3 scrollbar-none px-1"
        >
          {zonesWithRealPhotos.map((zone) => {
            const isActive = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                role="tab"
                id={`zone-tab-${zone.id}`}
                aria-selected={isActive}
                aria-controls={`zone-panel-${zone.id}`}
                onClick={() => setActiveZoneId(zone.id)}
                className={`px-4 sm:px-7 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-sm sm:text-base md:text-lg font-bold transition-all whitespace-nowrap shrink-0 shadow-md ${
                  isActive
                    ? 'bg-[#F6A935] text-[#442A19] border-[#FDE8B5] shadow-xl ring-2 ring-[#F6A935]/50 scale-[1.02] sm:scale-105'
                    : 'bg-[#221E1B] border-stone-700 text-stone-200 hover:bg-[#2C2623] hover:text-white hover:border-[#F6A935]/50'
                }`}
              >
                <span>
                  {zone.id === 'hanan-pacha'
                    ? 'Zona 1: Hanan Pacha'
                    : zone.id === 'willka-unu'
                    ? 'Zona 2: Willka Unu'
                    : 'Zona 3: Inti Punku'}
                </span>
                <span className="hidden sm:inline text-xs opacity-80 ml-1">
                  {zone.id === 'hanan-pacha' ? ' (Apus)' : zone.id === 'willka-unu' ? ' (Aguas)' : ' (Sol)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Showcase Box */}
        <div
          role="tabpanel"
          id={`zone-panel-${activeZoneId}`}
          aria-labelledby={`zone-tab-${activeZoneId}`}
          className="bg-[#221E1B] border-2 border-[#F6A935]/60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Photo (6 Cols) */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto min-h-[260px] sm:min-h-[340px] lg:min-h-[460px] bg-stone-950">
              <Image
                src={currentZone.image}
                alt={isEs ? currentZone.nameEs : currentZone.nameEn}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/95 via-[#181513]/30 to-transparent" />

              {/* Pacha Pill */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 bg-[#181513]/90 backdrop-blur-md border border-[#F6A935] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm md:text-base font-bold text-[#FDE8B5]">
                {currentZone.pacha}
              </div>

              {/* Price watermark */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between text-xs sm:text-base text-stone-200 bg-[#181513]/85 p-2.5 sm:p-4 rounded-xl border border-stone-700">
                <span className="text-stone-300 font-semibold text-xs sm:text-base md:text-lg">
                  {isEs ? 'Tarifa por viajero:' : 'Rate per traveler:'}
                </span>
                <span className="font-heading text-lg sm:text-2xl md:text-3xl font-extrabold text-[#F6A935] tabular-nums">
                  {priceDisplay}
                </span>
              </div>
            </div>

            {/* Content & Details (6 Cols) */}
            <div className="lg:col-span-6 p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs sm:text-sm md:text-base uppercase tracking-wider font-bold text-[#F6A935] block">
                  {isEs ? currentZone.symbolismEs : currentZone.symbolismEn}
                </span>

                <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-2 mb-3 sm:mb-4 leading-tight">
                  {isEs ? currentZone.nameEs : currentZone.nameEn}
                </h3>

                <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-normal mb-5 sm:mb-6">
                  {isEs ? currentZone.descriptionEs : currentZone.descriptionEn}
                </p>

                {/* Key Technical Specs Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-xl bg-[#181513] border border-[#F6A935]/30 text-sm sm:text-base mb-5 sm:mb-6">
                  <div>
                    <span className="text-stone-300 block mb-0.5 flex items-center gap-1 font-semibold text-xs sm:text-sm">
                      <Mountain className="w-4 h-4 text-[#F6A935]" /> {isEs ? 'Altitud' : 'Altitude'}
                    </span>
                    <strong className="text-white font-bold text-base sm:text-lg block">
                      {currentZone.altitude}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-300 block mb-0.5 flex items-center gap-1 font-semibold text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-[#F6A935]" /> {isEs ? 'Duración' : 'Duration'}
                    </span>
                    <strong className="text-white font-bold text-base sm:text-lg block">
                      {isEs ? currentZone.durationEs : currentZone.durationEn}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-300 block mb-0.5 font-semibold text-xs sm:text-sm">
                      {isEs ? 'Dificultad' : 'Difficulty'}
                    </span>
                    <strong className="text-[#FDE8B5] font-bold text-base sm:text-lg block">
                      {isEs ? currentZone.difficultyEs : currentZone.difficultyEn}
                    </strong>
                  </div>
                </div>

                {/* Highlights List */}
                <div>
                  <h4 className="text-sm sm:text-base uppercase tracking-wider font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#F6A935]">✦</span>
                    <span>{isEs ? 'Experiencias Clave Incluidas' : 'Key Included Experiences'}</span>
                  </h4>
                  <ul className="space-y-2.5 sm:space-y-3 text-sm sm:text-base md:text-lg text-stone-200">
                    {(isEs ? currentZone.highlightsEs : currentZone.highlightsEn).map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#F6A935] font-bold shrink-0 text-lg sm:text-xl leading-none mt-0.5">•</span>
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Philosophical note & CTA Button */}
              <div className="pt-5 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
                <div className="text-sm sm:text-base text-stone-300 italic font-editorial leading-relaxed text-center sm:text-left">
                  {isEs ? currentZone.cosmovisionEs : currentZone.cosmovisionEn}
                </div>
                <button
                  onClick={() => onBookZone(currentZone)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl shadow-xl transition-all whitespace-nowrap shrink-0 border border-[#FDE8B5] transform hover:-translate-y-0.5"
                >
                  <span>{isEs ? 'Reservar Esta Zona' : 'Book This Zone'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Tours in Ollantaytambo notice */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-[#221E1B] border border-[#F6A935]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base text-stone-200 shadow-md">
          <div className="flex items-start sm:items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#F6A935] shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              {isEs
                ? 'Complementa tu visita con los atractivos de Ollantaytambo: Fortaleza Monumental, Pinkuylluna, Baño de la Ñusta y el templo secreto de Ñaupa Iglesia.'
                : 'Complement your journey with Ollantaytambo highlights: Monumental Fortress, Pinkuylluna cliffside granaries, Ñusta bath, and mystical Ñaupa Iglesia.'}
            </span>
          </div>
          <span className="text-[#FDE8B5] font-bold whitespace-nowrap text-xs sm:text-sm border-l-2 border-[#F6A935] pl-3 self-end sm:self-auto">
            Inka Lab Km 84 · Ollantaytambo
          </span>
        </div>
      </div>
    </section>
  );
}
