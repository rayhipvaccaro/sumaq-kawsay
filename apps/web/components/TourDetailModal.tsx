'use client';

import { fmt } from '@/lib/money';

import Image from 'next/image';
import { X, Clock, Mountain, Users, Check, AlertCircle, Backpack, MessageCircle, Calendar } from 'lucide-react';
import { Tour } from '@/data/toursData';

interface TourDetailModalProps {
  tour: Tour | null;
  lang: 'es' | 'en';
  currency: string;
  onClose: () => void;
  onBookTour: (tour: Tour) => void;
}

export function TourDetailModal({
  tour,
  lang,
  currency,
  onClose,
  onBookTour,
}: TourDetailModalProps) {
  if (!tour) return null;

  const isEs = lang === 'es';
  const price = fmt(tour.pricePEN, currency, tour.priceUSD);

  const waMessage = encodeURIComponent(
    isEs
      ? `¡Hola Sumaq Kawsay & Inka Lab! Deseo consultar detalles y disponibilidad para el tour "${tour.titleEs}".`
      : `Hello Sumaq Kawsay & Inka Lab! I'd like to check details and availability for "${tour.titleEn}".`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-detail-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-[#F6A935] my-4 sm:my-8 max-h-[94vh] sm:max-h-[92vh] flex flex-col">
        {/* Sticky Modal Top Bar with Close button */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b-2 border-[#F6A935]/30 bg-[#FDFBF7] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#F6A935] bg-[#181513] px-2.5 sm:px-3.5 py-1 rounded-md sm:rounded-lg shadow-xs shrink-0">
              {tour.category.toUpperCase()}
            </span>
            <span className="text-[#442A19] font-bold">·</span>
            <span className="text-xs sm:text-base text-[#181513] font-bold truncate">
              {isEs ? tour.locationEs : tour.locationEn}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content Body with Responsive Spacing */}
        <div className="overflow-y-auto p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 text-[#1C1917]">
          {/* Header & Hero Image */}
          <div>
            <h2 id="tour-detail-title" className="font-heading text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#181513] mb-2 sm:mb-3 leading-tight">
              {isEs ? tour.titleEs : tour.titleEn}
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-[#2C2623] font-medium leading-relaxed">
              {isEs ? tour.subtitleEs : tour.subtitleEn}
            </p>
          </div>

          <div className="relative h-48 sm:h-72 md:h-80 lg:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#F6A935]/40 shadow-md">
            <Image
              src={tour.image}
              alt={isEs ? tour.titleEs : tour.titleEn}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Key Facts / Metadata Grid Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F4EFE6] border-2 border-[#F6A935]/40 text-xs sm:text-sm md:text-base">
            <div>
              <span className="text-stone-700 block mb-0.5 flex items-center gap-1 font-bold text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#442A19]" /> {isEs ? 'Duración' : 'Duration'}
              </span>
              <strong className="text-[#181513] font-extrabold text-sm sm:text-base md:text-lg block">
                {isEs ? tour.durationEs : tour.durationEn}
              </strong>
            </div>
            <div>
              <span className="text-stone-700 block mb-0.5 flex items-center gap-1 font-bold text-xs sm:text-sm">
                <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#442A19]" /> {isEs ? 'Altitud' : 'Altitude'}
              </span>
              <strong className="text-[#181513] font-extrabold text-sm sm:text-base md:text-lg block">
                {tour.maxAltitude}
              </strong>
            </div>
            <div>
              <span className="text-stone-700 block mb-0.5 flex items-center gap-1 font-bold text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#442A19]" /> {isEs ? 'Grupo' : 'Group Size'}
              </span>
              <strong className="text-[#181513] font-extrabold text-sm sm:text-base md:text-lg block truncate">
                {tour.groupSize}
              </strong>
            </div>
            <div>
              <span className="text-stone-700 block mb-0.5 font-bold text-xs sm:text-sm">
                {isEs ? 'Inversión' : 'Price'}
              </span>
              <strong className="text-[#181513] font-heading font-extrabold text-base sm:text-xl md:text-2xl tabular-nums block">
                {price}
              </strong>
            </div>
          </div>

          {/* Overview Prose */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-heading font-extrabold text-[#181513] mb-2 sm:mb-3">
              {isEs ? 'Descripción de la Experiencia' : 'Experience Overview'}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-[#2C2623] leading-relaxed font-normal">
              {isEs ? tour.descriptionEs : tour.descriptionEn}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-heading font-extrabold text-[#181513] mb-3 sm:mb-4">
              {isEs ? 'Puntos Destacados' : 'Key Highlights'}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-sm sm:text-base md:text-lg text-[#181513]">
              {(isEs ? tour.highlightsEs : tour.highlightsEn).map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E5A36] shrink-0 mt-0.5" />
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day-by-Day or Hour-by-Hour Itinerary */}
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-heading font-extrabold text-[#181513] mb-4 sm:mb-5">
              {isEs ? 'Itinerario Detallado' : 'Detailed Itinerary'}
            </h3>
            <div className="relative pl-6 sm:pl-7 space-y-5 sm:space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#F6A935]/50">
              {tour.itinerary.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] sm:-left-[30px] top-1 sm:top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F6A935] border-2 border-[#181513]" />
                  <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#442A19] block tabular-nums">
                    {step.time}
                  </span>
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-[#181513] mt-0.5 sm:mt-1">
                    {isEs ? step.titleEs : step.titleEn}
                  </h4>
                  <p className="text-xs sm:text-base text-[#2C2623] mt-1 leading-relaxed">
                    {isEs ? step.descEs : step.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 sm:pt-5 border-t border-stone-200">
            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-emerald-950 mb-2.5 sm:mb-3 flex items-center gap-2">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                <span>{isEs ? 'Qué Incluye' : 'What is Included'}</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm md:text-base text-stone-800">
                {(isEs ? tour.includedEs : tour.includedEn).map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-extrabold">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200">
              <h4 className="text-sm sm:text-base md:text-lg font-bold text-amber-950 mb-2.5 sm:mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                <span>{isEs ? 'No Incluye' : 'Not Included'}</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm md:text-base text-stone-800">
                {(isEs ? tour.notIncludedEs : tour.notIncludedEn).map((notInc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-extrabold">✕</span>
                    <span>{notInc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What to Bring */}
          <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F4EFE6] border-2 border-[#F6A935]/40 text-xs sm:text-sm md:text-base">
            <h4 className="font-heading font-extrabold text-[#181513] mb-2.5 sm:mb-3 flex items-center gap-2 text-sm sm:text-base md:text-lg">
              <Backpack className="w-4 h-4 sm:w-5 sm:h-5 text-[#442A19]" />
              <span>{isEs ? 'Qué Llevar Recomendado' : 'Packing Recommendations'}</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-stone-900">
              {(isEs ? tour.whatToBringEs : tour.whatToBringEn).map((item, i) => (
                <span key={i} className="bg-white border border-[#F6A935]/60 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-2xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions Responsive */}
        <div className="px-4 sm:px-8 py-3.5 sm:py-5 bg-[#FDFBF7] border-t-2 border-[#F6A935]/30 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 shrink-0">
          <div className="w-full sm:w-auto flex items-baseline justify-between sm:block">
            <span className="text-xs sm:text-sm text-stone-600 font-bold block uppercase tracking-wider">
              {isEs ? 'Precio por viajero:' : 'Price per traveler:'}
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-[#181513] tabular-nums">
              {price}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/51912189856?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-emerald-950 bg-emerald-200 hover:bg-emerald-300 rounded-xl transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onBookTour(tour);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl shadow-lg transition-all border border-[#FDE8B5]"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{isEs ? 'Reservar Fecha' : 'Book Date'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
