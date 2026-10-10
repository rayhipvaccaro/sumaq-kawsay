'use client';

import { useState } from 'react';
import { Sun, CloudRain, Sunrise, CheckCircle, ShieldCheck } from 'lucide-react';
import { SEASONS_DATA, SeasonInfo } from '@/data/inkaLabData';

interface SeasonalityGuideProps {
  lang: 'es' | 'en';
}

export function SeasonalityGuide({ lang }: SeasonalityGuideProps) {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('seca');
  const isEs = lang === 'es';

  const currentSeason: SeasonInfo =
    SEASONS_DATA.find((s) => s.id === selectedSeasonId) || SEASONS_DATA[0];

  return (
    <section id="estacionalidad" className="py-24 bg-white border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {isEs ? 'Clima & Calendario Andino' : 'Andean Climate & Calendar'}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {isEs ? 'Guía de Estacionalidad y Meses de Visita' : 'Seasonality & Travel Months Guide'}
          </h2>
          <p className="mt-4 text-lg sm:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {isEs
              ? 'Conoce el comportamiento estacional de Cusco y Ollantaytambo para planificar tu viaje según tus preferencias de caminata, fotografía o mística andina.'
              : 'Understand Cusco and Sacred Valley weather patterns to choose the ideal timing for high-altitude trekking, astronomy, or botanical retreats.'}
          </p>
        </div>

        {/* 3 Season Tabs with Large Text */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12 overflow-x-auto pb-3 scrollbar-none">
          {SEASONS_DATA.map((season) => {
            const isActive = season.id === selectedSeasonId;
            return (
              <button
                key={season.id}
                onClick={() => setSelectedSeasonId(season.id)}
                className={`px-6 py-3.5 rounded-2xl border-2 text-base sm:text-lg font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2.5 shadow-sm ${
                  isActive
                    ? 'bg-[#F6A935] text-[#181513] border-[#F6A935] shadow-lg ring-2 ring-[#442A19]/20 scale-105'
                    : 'bg-[#FDFBF7] border-stone-300 text-stone-800 hover:bg-[#F4EFE6] hover:text-stone-950'
                }`}
              >
                {season.id === 'seca' && <Sun className="w-5 h-5 text-amber-600" />}
                {season.id === 'media' && <Sunrise className="w-5 h-5 text-orange-600" />}
                {season.id === 'lluvias' && <CloudRain className="w-5 h-5 text-blue-600" />}
                <span>{isEs ? season.nameEs.split('(')[0].trim() : season.nameEn.split('(')[0].trim()}</span>
                <span className="text-sm font-semibold opacity-85">({isEs ? season.monthsEs : season.monthsEn})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Season Card with Rich Inka Lab Details */}
        <div className="bg-[#FDFBF7] rounded-3xl border-2 border-[#F6A935]/40 p-6 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left column: Overview & Weather (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-sm sm:text-base uppercase tracking-wider font-extrabold text-[#442A19] block mb-2">
                  {isEs ? currentSeason.monthsEs : currentSeason.monthsEn}
                </span>
                <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#181513]">
                  {isEs ? currentSeason.nameEs : currentSeason.nameEn}
                </h3>
                <p className="mt-4 text-base sm:text-lg text-[#2C2623] leading-relaxed font-normal">
                  {isEs ? currentSeason.verdictEs : currentSeason.verdictEn}
                </p>
              </div>

              {/* Weather & Landscape Box */}
              <div className="p-6 rounded-2xl bg-white border-2 border-[#F6A935]/30 space-y-4 shadow-sm">
                <div>
                  <span className="font-heading font-extrabold text-[#181513] block mb-1 text-base sm:text-lg">
                    {isEs ? 'Condiciones Climáticas:' : 'Weather Conditions:'}
                  </span>
                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                    {isEs ? currentSeason.weatherEs : currentSeason.weatherEn}
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-200">
                  <span className="font-heading font-extrabold text-[#181513] block mb-1 text-base sm:text-lg">
                    {isEs ? 'Paisaje & Visibilidad:' : 'Scenery & Visibility:'}
                  </span>
                  <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-normal">
                    {isEs ? currentSeason.sceneryEs : currentSeason.sceneryEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Practical Packing Advice (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 lg:border-l-2 lg:border-[#F6A935]/30 lg:pl-10">
              <h4 className="text-base sm:text-lg font-heading font-extrabold uppercase tracking-wider text-[#181513] flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#2E5A36]" />
                <span>{isEs ? 'Equipamiento & Vestimenta Recomendada' : 'Recommended Packing & Clothing'}</span>
              </h4>

              <ul className="space-y-3.5 text-base sm:text-lg text-stone-800">
                {(isEs ? currentSeason.clothingTipsEs : currentSeason.clothingTipsEn).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#F6A935]/40 shadow-xs">
                    <span className="text-[#F6A935] font-extrabold shrink-0 mt-0.5 text-lg">•</span>
                    <span className="leading-relaxed font-medium">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="p-5 rounded-2xl bg-[#F4EFE6] border-2 border-[#F6A935]/40 text-base text-[#181513] space-y-2">
                <span className="font-heading font-extrabold text-[#442A19] flex items-center gap-2 text-base sm:text-lg">
                  <ShieldCheck className="w-5 h-5 text-[#442A19]" />
                  <span>{isEs ? 'Consejo de los Guías de Inka Lab & Sumaq Kawsay' : 'Inka Lab & Sumaq Kawsay Guides\' Advice'}</span>
                </span>
                <p className="leading-relaxed font-normal text-stone-800">
                  {isEs
                    ? 'El clima en los Andes es dinámico. Recuerda aplicar el "sistema de tres capas": capa transpirable interior, capa térmica intermedia y chaqueta impermeable cortavientos exterior.'
                    : 'Andean weather changes rapidly. Always follow the 3-layer system: breathable base layer, insulating mid layer, and waterproof windbreaker shell.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
