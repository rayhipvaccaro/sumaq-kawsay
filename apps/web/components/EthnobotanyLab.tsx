'use client';

import { useState } from 'react';
import { Leaf, Droplets, Flame, Heart } from 'lucide-react';
import { HERBS_DATA, Herb } from '@/data/herbsData';
import { TRANSLATIONS } from '@/data/translations';

interface EthnobotanyLabProps {
  lang: 'es' | 'en';
  onBookEthnobotany: () => void;
}

export function EthnobotanyLab({ lang, onBookEthnobotany }: EthnobotanyLabProps) {
  const [selectedHerbId, setSelectedHerbId] = useState<string>('muna');
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';

  const currentHerb = HERBS_DATA.find((h) => h.id === selectedHerbId) || HERBS_DATA[0];

  return (
    <section id="herbario" className="py-24 bg-[#181513] text-stone-100 border-b border-[#F6A935]/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-[#2E5A36]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 w-80 h-80 bg-[#F6A935]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#F6A935] block mb-2">
            {t.herbs.kicker}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
            {t.herbs.title}
          </h2>
          <p className="mt-4 text-lg sm:text-2xl text-stone-200 leading-relaxed font-normal">
            {t.herbs.subtitle}
          </p>
        </div>

        {/* Botanical Plant Selector Strip with Large, Clear Labels */}
        <div className="mb-12">
          <span className="block text-sm sm:text-base uppercase tracking-wider text-[#FDE8B5] font-bold mb-4 text-center sm:text-left">
            {t.herbs.selectHerb}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {HERBS_DATA.map((herb) => {
              const isActive = herb.id === selectedHerbId;
              return (
                <button
                  key={herb.id}
                  onClick={() => setSelectedHerbId(herb.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between shadow-md ${
                    isActive
                      ? 'bg-[#221E1B] border-[#F6A935] shadow-xl ring-2 ring-[#F6A935]/60 scale-105'
                      : 'bg-[#221E1B]/60 border-stone-700 hover:bg-[#221E1B] hover:border-[#F6A935]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                      style={{ backgroundColor: herb.tagColor }}
                    />
                    <span className="text-xs sm:text-sm text-stone-300 font-bold uppercase">
                      {isEs ? herb.categoryLabelEs.split(' ')[0] : herb.categoryLabelEn.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <span className="block font-heading text-lg sm:text-xl font-extrabold text-white">
                      {herb.name}
                    </span>
                    <span className="text-xs sm:text-sm text-[#FDE8B5] italic block truncate font-mono mt-0.5">
                      {herb.scientificName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Botanical Detail Card */}
        <div className="bg-[#221E1B] border-2 border-[#F6A935] rounded-3xl p-6 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Botanical Profile (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-sm sm:text-base font-bold px-4 py-1.5 rounded-xl bg-[#181513] border border-[#F6A935] text-[#FDE8B5]">
                <Leaf className="w-4 h-4 text-[#F6A935]" />
                <span>{isEs ? currentHerb.categoryLabelEs : currentHerb.categoryLabelEn}</span>
              </div>

              <div>
                <h3 className="font-heading text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                  {currentHerb.name}
                </h3>
                <p className="text-base sm:text-lg font-mono text-[#F6A935] font-bold mt-1">
                  {currentHerb.quechuaName}
                </p>
              </div>

              <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-normal">
                {isEs ? currentHerb.descriptionEs : currentHerb.descriptionEn}
              </p>

              {/* Properties list */}
              <div className="pt-2">
                <span className="text-sm uppercase tracking-wider text-[#FDE8B5] font-bold block mb-3">
                  {t.herbs.properties}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {(isEs ? currentHerb.propertiesEs : currentHerb.propertiesEn).map((prop, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 text-sm sm:text-base font-bold rounded-xl bg-[#181513] border border-[#F6A935]/50 text-white shadow-2xs"
                    >
                      {prop}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Ancestral Uses & Lab Practice (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 lg:border-l-2 lg:border-[#F6A935]/30 lg:pl-10">
              {/* Traditional Use */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg uppercase tracking-wider font-extrabold text-[#FDE8B5] flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#F6A935]" />
                  <span>{t.herbs.traditionalUse}</span>
                </h4>
                <p className="text-base sm:text-lg text-stone-200 leading-relaxed">
                  {isEs ? currentHerb.traditionalUseEs : currentHerb.traditionalUseEn}
                </p>
              </div>

              {/* Preparation */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-emerald-400" />
                  <span>{t.herbs.preparation}</span>
                </h4>
                <p className="text-base sm:text-lg text-stone-200 leading-relaxed">
                  {isEs ? currentHerb.preparationEs : currentHerb.preparationEn}
                </p>
              </div>

              {/* Sumaq Kawsay Practice in Chillca */}
              <div className="p-5 rounded-2xl bg-[#181513] border border-[#F6A935]/50 space-y-2">
                <h4 className="text-base uppercase tracking-wider font-extrabold text-[#F6A935] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#F6A935]" />
                  <span>{t.herbs.sumaqApplication}</span>
                </h4>
                <p className="text-base sm:text-lg text-stone-200 leading-relaxed">
                  {isEs ? currentHerb.sumaqPracticeEs : currentHerb.sumaqPracticeEn}
                </p>
              </div>

              {/* Action: Book Ethnobotany Tour */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm sm:text-base text-stone-300 font-medium">
                  {isEs
                    ? '¿Deseas vivir la recolección y alquimia de esta planta en persona?'
                    : 'Would you like to harvest and prepare this plant with indigenous elders?'}
                </div>
                <button
                  onClick={onBookEthnobotany}
                  className="w-full sm:w-auto px-7 py-3.5 text-base sm:text-lg font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl transition-all shadow-lg whitespace-nowrap border border-[#FDE8B5] transform hover:-translate-y-0.5"
                >
                  {isEs ? 'Ver Tour de Etnobotánica' : 'View Ethnobotany Tour'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
