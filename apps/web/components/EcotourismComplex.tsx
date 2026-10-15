'use client';

import { fmtNote } from '@/lib/money';

import Image from 'next/image';
import { Home, Compass, Check, ArrowRight } from 'lucide-react';
import { ECOTOURISM_SERVICES, EcotourismService } from '@/data/inkaLabData';

interface EcotourismComplexProps {
  lang: 'es' | 'en';
  currency: string;
  onBookService: (service: EcotourismService) => void;
}

export function EcotourismComplex({ lang, currency, onBookService }: EcotourismComplexProps) {
  const isEs = lang === 'es';

  return (
    <section id="complejo" className="py-24 bg-[#FDFBF7] border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large, Legible Typography */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#9E2021] block mb-2">
            {isEs ? 'Sumaq Kawsay Hospitalidad · Km 84' : 'Sumaq Kawsay Hospitality · Km 84'}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {isEs ? 'Servicios Ecoturísticos en Inka Lab' : 'Ecotourism Services at Inka Lab'}
          </h2>
          <p className="mt-5 text-lg sm:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {isEs
              ? 'Sumaq Kawsay opera su refugio ecológico y cultural en el Km 84 de Ollantaytambo, diseñado para descansar, nutrirse con superalimentos andinos y sanar el cuerpo en armonía con los Apus.'
              : 'Sumaq Kawsay operates our ecological and cultural haven at Km 84 in Ollantaytambo, crafted for rest, nourishing Novoandino superfoods, and authentic Andean steam healing.'}
          </p>
        </div>

        {/* 2x2 Services Grid with Inka Lab Aesthetics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {ECOTOURISM_SERVICES.map((srv) => {
            const priceNote = fmtNote(srv.priceNotePEN, srv.priceNoteUSD, currency);
            const serviceTitle = isEs ? srv.titleEs : srv.titleEn;

            return (
              <article
                key={srv.id}
                aria-labelledby={`service-title-${srv.id}`}
                className="bg-white rounded-3xl border-2 border-[#F6A935]/40 overflow-hidden shadow-lg hover:border-[#F6A935] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with subtle zoom */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={srv.image}
                      alt={serviceTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-base text-white">
                      <span className="font-bold text-[#181513] bg-[#F6A935] px-4 py-2 rounded-xl shadow-md border border-[#FDE8B5]">
                        {priceNote}
                      </span>
                    </div>
                  </div>

                  {/* Body Content with Large Fonts */}
                  <div className="p-7 sm:p-9">
                    <span className="text-sm sm:text-base uppercase tracking-wider font-bold text-[#442A19] block mb-2">
                      {isEs ? srv.taglineEs : srv.taglineEn}
                    </span>
                    <h3
                      id={`service-title-${srv.id}`}
                      className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181513] mb-4 group-hover:text-[#442A19] transition-colors leading-tight"
                    >
                      {serviceTitle}
                    </h3>
                    <p className="text-base sm:text-lg text-[#2C2623] leading-relaxed font-normal mb-6">
                      {isEs ? srv.descriptionEs : srv.descriptionEn}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-3.5 text-base sm:text-lg text-[#1C1917]">
                      {(isEs ? srv.featuresEs : srv.featuresEn).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#2E5A36] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="px-7 sm:px-9 pb-8 pt-3">
                  <button
                    onClick={() => onBookService(srv)}
                    aria-label={`${isEs ? 'Consultar disponibilidad para' : 'Check availability for'} ${serviceTitle}`}
                    className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl transition-all shadow-md transform hover:-translate-y-0.5 border border-[#FDE8B5]"
                  >
                    <span>{isEs ? 'Consultar Disponibilidad' : 'Check Availability'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Day Pass Highlight Banner */}
        <div className="mt-16 bg-[#221E1B] text-white rounded-3xl p-8 sm:p-12 border-2 border-[#F6A935] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-[#FDE8B5]">
              <Compass className="w-5 h-5 text-[#F6A935]" />
              <span>{isEs ? 'Experiencia Destacada Inka Lab' : 'Inka Lab Signature Experience'}</span>
            </span>
            <h4 className="font-heading text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {isEs ? 'Inka Lab Day Pass: Spa, Almuerzo & Cabalgata' : 'Inka Lab Day Pass: Spa, Lunch & Horseback Ride'}
            </h4>
            <p className="text-base sm:text-xl text-stone-200 font-normal max-w-2xl leading-relaxed">
              {isEs
                ? 'El plan ideal para quienes visitan Ollantaytambo por el día o antes de tomar el tren a Machu Picchu. Recojo en la estación o pueblo de cortesía.'
                : 'The perfect day retreat before boarding your train to Machu Picchu. Complimentary pickup from Ollantaytambo station included.'}
            </p>
          </div>
          <button
            onClick={() => onBookService(ECOTOURISM_SERVICES[3])}
            className="shrink-0 px-9 py-4 text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl shadow-xl transition-all border border-[#FDE8B5] transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            {isEs ? 'Reservar Day Pass' : 'Book Day Pass'}
          </button>
        </div>
      </div>
    </section>
  );
}
