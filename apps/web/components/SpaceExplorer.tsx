'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Mountain, Clock, ExternalLink, Check, Compass } from 'lucide-react';
import { LOCATIONS_DATA, LocationSpot } from '@/data/locationsData';
import { TRANSLATIONS } from '@/data/translations';

interface SpaceExplorerProps {
  lang: 'es' | 'en';
}

export function SpaceExplorer({ lang }: SpaceExplorerProps) {
  const [activeSpotId, setActiveSpotId] = useState<string>('chillca-sede');
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';

  const currentSpot: LocationSpot =
    LOCATIONS_DATA.find((s) => s.id === activeSpotId) || LOCATIONS_DATA[0];

  const mapsQuery = encodeURIComponent(
    currentSpot.id === 'cusco-oficina'
      ? 'Pampa del Castillo 455 Cusco Peru'
      : currentSpot.id === 'chillca-sede'
      ? 'Chillca Ollantaytambo Cusco Peru'
      : currentSpot.id === 'moray-lab'
      ? 'Moray Archaeological Complex Cusco Peru'
      : 'Machu Picchu Peru'
  );

  return (
    <section id="espacio" className="py-24 bg-white border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#F4EFE6] border border-[#F6A935]/50 text-sm sm:text-base font-bold uppercase tracking-widest text-[#442A19] mb-4 shadow-sm">
            <MapPin className="w-5 h-5 text-[#F6A935]" />
            <span>{t.space.kicker}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {t.space.title}
          </h2>
          <p className="mt-4 text-lg sm:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {t.space.subtitle}
          </p>
        </div>

        {/* Spot Navigation Tabs with Large Font */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {LOCATIONS_DATA.map((spot) => {
            const isActive = spot.id === activeSpotId;
            return (
              <button
                key={spot.id}
                onClick={() => setActiveSpotId(spot.id)}
                className={`px-6 py-3 text-base sm:text-lg font-bold rounded-2xl transition-all whitespace-nowrap shrink-0 shadow-sm ${
                  isActive
                    ? 'bg-[#F6A935] text-[#181513] border-2 border-[#F6A935] shadow-md ring-2 ring-[#442A19]/20 scale-105'
                    : 'bg-[#FDFBF7] border-2 border-stone-300 text-stone-800 hover:text-stone-950 hover:bg-[#F4EFE6]'
                }`}
              >
                {isEs ? spot.nameEs.split('·')[0].trim() : spot.nameEn.split('·')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Interactive Spatial Frame */}
        <div className="bg-[#FDFBF7] rounded-3xl border-2 border-[#F6A935]/40 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Media Showcase (7 Cols) */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[500px] bg-stone-900">
              <Image
                src={currentSpot.image}
                alt={isEs ? currentSpot.nameEs : currentSpot.nameEn}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/90 via-[#181513]/30 to-transparent" />

              {/* 360 & Location badge */}
              <div className="absolute top-5 left-5 bg-[#181513]/85 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-xl border border-[#F6A935]/50 flex items-center gap-2 shadow-md">
                <Compass className="w-4 h-4 text-[#F6A935]" />
                <span>{isEs ? 'Espacio Abierto en el Valle Sagrado' : 'Sacred Valley Sanctuary'}</span>
              </div>

              {/* Bottom coordinates bar with Large Font */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-stone-100 bg-[#181513]/85 p-2.5 sm:p-3.5 rounded-xl border border-stone-700">
                <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-[#FDE8B5]">
                  GPS: {currentSpot.coordinates.lat.toFixed(4)}, {currentSpot.coordinates.lng.toFixed(4)}
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#F6A935] hover:bg-[#9E2021] text-[#442A19] hover:text-white font-bold transition-all shadow-sm text-xs sm:text-sm"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{isEs ? 'Abrir Mapa' : 'View Map'}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Information & Highlights Panel (5 Cols) with Large Fonts */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-sm sm:text-base uppercase tracking-wider font-extrabold text-[#442A19] block mb-1">
                  {isEs ? currentSpot.roleEs : currentSpot.roleEn}
                </span>

                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#181513] mb-4 leading-tight">
                  {isEs ? currentSpot.nameEs : currentSpot.nameEn}
                </h3>

                <p className="text-base sm:text-lg text-[#2C2623] leading-relaxed font-normal mb-6">
                  {isEs ? currentSpot.descriptionEs : currentSpot.descriptionEn}
                </p>

                {/* Metrics with Large Text */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white border-2 border-[#F6A935]/30 text-sm sm:text-base mb-6 shadow-sm">
                  <div>
                    <span className="text-stone-700 flex items-center gap-1.5 mb-1 font-bold">
                      <Mountain className="w-4 h-4 text-[#442A19]" /> {t.space.altitude}
                    </span>
                    <strong className="text-[#181513] font-extrabold text-base sm:text-lg block">
                      {currentSpot.altitude}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-700 flex items-center gap-1.5 mb-1 font-bold">
                      <Clock className="w-4 h-4 text-[#442A19]" /> {t.space.distance}
                    </span>
                    <strong className="text-[#181513] font-extrabold text-base sm:text-lg block">
                      {currentSpot.travelTimeFromCusco}
                    </strong>
                  </div>
                </div>

                {/* Highlights with Large Text */}
                <div>
                  <h4 className="text-sm sm:text-base uppercase tracking-wider font-extrabold text-[#181513] mb-3">
                    {t.space.features}
                  </h4>
                  <ul className="space-y-3 text-base sm:text-lg text-stone-900">
                    {(isEs ? currentSpot.highlightsEs : currentSpot.highlightsEn).map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-5 h-5 text-[#2E5A36] shrink-0 mt-0.5" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Address / Official Notice */}
              <div className="pt-5 border-t border-stone-300 flex items-center justify-between text-sm sm:text-base text-stone-700">
                <span className="font-bold text-[#181513]">Inka Lab Santuario Ecoturístico</span>
                <span className="font-mono font-bold text-[#442A19]">Km 84 Ollantaytambo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
