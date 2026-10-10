'use client';

import { Sun, HeartHandshake, Compass, Leaf } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { ChacanaDivider } from './ChacanaDivider';
import { useCMS } from '@/lib/cmsContext';

interface PhilosophySectionProps {
  lang: 'es' | 'en';
}

export function PhilosophySection({ lang }: PhilosophySectionProps) {
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';
  const { generalContent } = useCMS();

  const kicker = isEs
    ? generalContent?.aboutKickerEs || t.philosophy.kicker
    : generalContent?.aboutKickerEn || t.philosophy.kicker;

  const title = isEs
    ? generalContent?.aboutTitleEs || t.philosophy.title
    : generalContent?.aboutTitleEn || t.philosophy.title;

  const subtitle = isEs
    ? generalContent?.aboutSubtitleEs || t.philosophy.subtitle
    : generalContent?.aboutSubtitleEn || t.philosophy.subtitle;

  const icons = [
    <HeartHandshake key="1" className="w-7 h-7 text-[#F6A935]" />,
    <Compass key="2" className="w-7 h-7 text-[#F6A935]" />,
    <Leaf key="3" className="w-7 h-7 text-[#F6A935]" />,
    <Sun key="4" className="w-7 h-7 text-[#F6A935]" />,
  ];

  return (
    <section id="filosofia" className="py-24 bg-[#FDFBF7] border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#9E2021] block mb-2">
            {kicker}
          </span>
          <h2 className="mt-3 font-heading text-3xl sm:text-5xl font-extrabold text-[#181513] tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-[#2C2623] leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* 4 Pillars Grid with Generous Typography & Inka Lab Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {t.philosophy.pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border-2 border-[#F6A935]/30 shadow-md hover:border-[#F6A935] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#221E1B] border border-[#F6A935] flex items-center justify-center mb-6 shadow-sm">
                  {icons[idx]}
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-base sm:text-lg text-[#2C2623] leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-sm sm:text-base text-stone-600">
                <span className="font-mono font-bold text-stone-500 text-base">0{idx + 1}</span>
                <span className="text-[#442A19] font-bold">Sumaq Kawsay · El Buen Vivir</span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Quote Box */}
        <div className="mt-16 max-w-4xl mx-auto bg-[#181513] text-stone-100 rounded-2xl p-8 sm:p-12 relative overflow-hidden border-2 border-[#F6A935] shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#F6A935]/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-left">
              <span className="text-sm sm:text-base uppercase tracking-widest text-[#FDE8B5] font-bold block">
                {isEs ? 'Compromiso Ético & Ayni Ancestral' : 'Ethical Commitment & Ancestral Ayni'}
              </span>
              <p className="font-editorial text-2xl sm:text-3xl italic leading-relaxed text-white">
                {isEs
                  ? '“Viajar con nosotros no es solo recorrer caminos antiguos — es conectar con la memoria viva y el alma del Perú.”'
                  : '“Traveling with us is not merely walking ancient paths — it is connecting with the living soul of Peru.”'}
              </p>
              <p className="text-base text-[#FDE8B5] font-semibold">
                Sumaq Kawsay Cusco · En alianza con Inka Lab Km 84
              </p>
            </div>
            <a
              href="#cotizador"
              className="shrink-0 px-8 py-4 text-base font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl transition-all shadow-xl whitespace-nowrap transform hover:-translate-y-0.5 border border-[#FDE8B5]"
            >
              {isEs ? 'Cotizar Mi Viaje' : 'Quote My Journey'}
            </a>
          </div>
        </div>

        {/* Andean Greca Divider */}
        <ChacanaDivider className="mt-12 opacity-80" repeat={12} />
      </div>
    </section>
  );
}
