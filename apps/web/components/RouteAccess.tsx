'use client';

import { MapPin, Navigation, ExternalLink, Train, Car } from 'lucide-react';
import { useSiteData } from '@/lib/siteData';

interface RouteAccessProps {
  lang: 'es' | 'en';
}

export function RouteAccess({ lang }: RouteAccessProps) { const { reach: HOW_TO_REACH } = useSiteData();
  const isEs = lang === 'es';

  return (
    <section id="como-llegar" className="py-24 bg-[#F4EFE6] border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {isEs ? 'Ubicación Estratégica' : 'Strategic Location'}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {isEs ? 'Cómo Llegar a Inka Lab · Km 84' : 'How to Reach Inka Lab · Km 84'}
          </h2>
          <p className="mt-4 text-lg sm:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {isEs
              ? 'Situados en el corazón del Valle Sagrado, a solo 15 minutos de la estación de tren de Ollantaytambo con conexión directa hacia Machu Picchu.'
              : 'Located in the heart of the Sacred Valley, only 15 minutes from the Ollantaytambo train hub connecting directly to Machu Picchu.'}
          </p>
        </div>

        {/* 2 Routes Cards with Large, Legible Typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-12">
          {HOW_TO_REACH.map((route, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border-2 border-[#F6A935]/40 p-7 sm:p-9 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-stone-200 mb-5">
                  <div className="flex items-center gap-2.5 text-[#442A19] font-extrabold text-lg sm:text-xl">
                    {idx === 0 ? <Car className="w-6 h-6 text-[#F6A935]" /> : <Train className="w-6 h-6 text-[#F6A935]" />}
                    <span>{route.from}</span>
                  </div>
                  <span className="text-sm sm:text-base text-stone-700 font-mono font-bold bg-[#F4EFE6] px-3 py-1 rounded-lg">
                    {route.distance} · {route.time}
                  </span>
                </div>

                <div className="mb-5">
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#442A19] block mb-2">
                    {isEs ? 'Trayecto:' : 'Transit:'}
                  </span>
                  <p className="text-sm sm:text-base font-extrabold text-[#181513] bg-[#FDFBF7] p-3.5 rounded-xl border border-stone-300 font-mono break-words">
                    {route.route}
                  </p>
                </div>

                <div>
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#442A19] block mb-2">
                    {isEs ? 'Recomendación de Viaje:' : 'Travel Tips:'}
                  </span>
                  <p className="text-base sm:text-lg text-[#2C2623] leading-relaxed font-normal">
                    {isEs ? route.recommendationsEs : route.recommendationsEn}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between text-sm sm:text-base">
                <span className="text-stone-700 font-semibold">
                  {idx === 0
                    ? (isEs ? 'Ruta panorámica asfaltada' : 'Paved scenic highway')
                    : (isEs ? 'Servicio de recojo de cortesía' : 'Complimentary pickup available')}
                </span>
                <span className="text-[#442A19] font-extrabold">Ollantaytambo</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with GPS & Satellite Maps launch */}
        <div className="bg-[#181513] text-stone-100 rounded-3xl p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border-2 border-[#F6A935]">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-sm font-extrabold text-[#FDE8B5] uppercase tracking-wider block">
              {isEs ? 'Coordenadas Satelitales Oficiales' : 'Official Satellite Coordinates'}
            </span>
            <h4 className="font-heading text-xl sm:text-3xl font-extrabold text-white">
              {isEs ? 'Inka Lab Complejo Turístico · Km 84, Ollantaytambo' : 'Inka Lab Sanctuary · Km 84, Ollantaytambo'}
            </h4>
            <p className="text-sm sm:text-base text-stone-300 font-mono">
              GPS: -13.2584° S, -72.2632° W · Altitud 2,792 msnm · Valle Sagrado, Cusco
            </p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Ollantaytambo+Km+84+Cusco+Peru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white transition-all whitespace-nowrap shadow-xl shrink-0 border border-[#FDE8B5] transform hover:-translate-y-0.5"
          >
            <Navigation className="w-5 h-5" />
            <span>{isEs ? 'Abrir Navegación Satelital GPS' : 'Open GPS Satellite Navigation'}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
