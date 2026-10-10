'use client';

import Image from 'next/image';
import { ArrowRight, Compass, ShieldCheck, Clock, Briefcase, HelpCircle, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';
import { HeroQuickSearch } from '@/components/HeroQuickSearch';

interface HeroProps {
  lang: 'es' | 'en';
  currency?: 'PEN' | 'USD';
  onExploreTours: () => void;
  onOpenPlanner: () => void;
  onOpenSystemGuide?: () => void;
}

export function Hero({ lang, currency = 'PEN', onExploreTours, onOpenPlanner, onOpenSystemGuide }: HeroProps) {
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';
  const { generalContent, openBookingWizard, openBusinessPortal, openOrderTracker } = useCMS();

  const heroBadge = isEs
    ? generalContent.heroBadgeEs || 'Sumaq Kawsay · Turismo Consciente & Sabiduría Andina · Cusco'
    : generalContent.heroBadgeEn || 'Sumaq Kawsay · Sustainable Tourism & Andean Wisdom · Cusco';

  const heroTitle = generalContent.heroTitle || 'SUMAQ KAWSAY';

  const heroSubtitle = isEs
    ? generalContent.heroSubtitleEs || 'Donde la sabiduría de los Andes sigue viva.'
    : generalContent.heroSubtitleEn || 'Where the living soul of the Andes breathes.';

  const heroDesc = isEs
    ? generalContent.heroDescriptionEs || 'Operador turístico oficial y complejo ecoturístico Inka Lab en el Km 84 de Ollantaytambo. Expediciones personalizadas, etnobotánica viva y hospitalidad auténtica en el Valle Sagrado de los Incas.'
    : generalContent.heroDescriptionEn || 'Official tour operator and Inka Lab ecotourism complex at Km 84, Ollantaytambo. Tailored expeditions, living ethnobotany, and authentic Andean hospitality in the Sacred Valley.';

  const heroImageSrc = generalContent.heroImage || '/images/hero_valle_sagrado_andes_1791233029285.jpg';

  return (
    <section className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center justify-center pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-[#181513]">
      {/* Background Photography with optimized Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImageSrc}
          alt="Valle Sagrado de los Incas en Cusco, Perú - Inka Lab & Sumaq Kawsay"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* High-contrast scrim for WCAG AAA compliance */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#181513]/90 via-[#181513]/70 to-[#181513]/95" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-2 sm:mt-4 w-full">
        {/* Clean Editorial Kicker (No generic AI pill box) */}
        <div className="inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#F6A935] mb-5 sm:mb-7">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#F6A935] shrink-0" />
          <span>{heroBadge}</span>
        </div>

        {/* Display Headline with balanced typography */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-normal leading-[1.12] text-balance drop-shadow-lg text-white">
            {heroTitle}
          </h1>
          <p className="mt-4 sm:mt-6 font-normal text-[#FDE8B5] font-editorial italic text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.25] text-balance drop-shadow-md">
            {heroSubtitle}
          </p>
        </div>

        {/* Subhead with optimal legibility and contrast */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl md:text-2xl text-stone-100 leading-relaxed font-normal mb-8 sm:mb-10 text-balance drop-shadow-sm px-2">
          {heroDesc}
        </p>

        {/* Primary CTAs - Direct, clear, touch-friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-6 sm:mb-8 w-full max-w-xl mx-auto">
          {/* Main Booking Wizard Button */}
          <button
            onClick={openBookingWizard}
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white active:bg-[#7D1718] rounded-xl sm:rounded-2xl shadow-xl transition-all duration-200 group border border-[#FDE8B5]/60 cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-[#181513] shrink-0" />
            <span>{isEs ? 'Reservar Experiencia' : 'Book Experience'}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onExploreTours}
            className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-bold text-white bg-[#221E1B]/90 hover:bg-[#221E1B] backdrop-blur-md border border-[#F6A935]/50 rounded-xl sm:rounded-2xl transition-all shadow-lg cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#F6A935]" />
            <span>{isEs ? 'Ver Catálogo' : 'Explore Tours'}</span>
          </button>

          {onOpenSystemGuide && (
            <button
              onClick={onOpenSystemGuide}
              className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs sm:text-sm font-bold text-stone-200 bg-[#221E1B]/70 hover:bg-[#221E1B] backdrop-blur-md border border-stone-700 rounded-xl sm:rounded-2xl transition-all shadow-md cursor-pointer"
              title={isEs ? '¿Cómo funciona la web?' : 'How does the platform work?'}
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{isEs ? '¿Cómo Funciona?' : 'How it Works'}</span>
            </button>
          )}
        </div>

        {/* Search Engine Bar */}
        <HeroQuickSearch lang={lang} currency={currency} />

        {/* Quick Utilities: Tracking & Business Roles */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-12 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => openOrderTracker()}
            className="min-h-[42px] px-4 py-2 rounded-full bg-[#181513]/90 hover:bg-[#181513] border border-stone-600 hover:border-[#F6A935] text-stone-200 hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Clock className="w-4 h-4 text-[#F6A935]" />
            <span>{isEs ? 'Rastrear Mi Reserva (Código SQ)' : 'Track My Reservation'}</span>
          </button>

          <button
            onClick={() => openBusinessPortal('ventas')}
            className="min-h-[42px] px-4 py-2 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-500/80 text-blue-200 hover:text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>{isEs ? 'Portal de Gestión (Roles)' : 'Business Roles Portal'}</span>
          </button>
        </div>

        {/* Responsive Verified Stats Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#F6A935]/30 max-w-4xl mx-auto bg-[#221E1B]/85 rounded-2xl sm:rounded-3xl p-5 sm:p-7 backdrop-blur-md border border-[#F6A935]/40 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F6A935] font-heading tabular-nums">
                100%
              </span>
              <span className="text-xs sm:text-sm md:text-base text-stone-200 mt-1 font-medium">
                {isEs ? 'Guías Quechuas Oficiales' : 'Certified Quechua Guides'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F6A935] font-heading tabular-nums">
                Km 84
              </span>
              <span className="text-xs sm:text-sm md:text-base text-stone-200 mt-1 font-medium">
                {isEs ? 'Sede Inka Lab Ollantaytambo' : 'Inka Lab Hub Km 84'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F6A935] font-heading tabular-nums">
                40+
              </span>
              <span className="text-xs sm:text-sm md:text-base text-stone-200 mt-1 font-medium">
                {isEs ? 'Plantas Medicinales Chillca' : 'Medicinal Plants'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F6A935] font-heading tabular-nums">
                Ayni
              </span>
              <span className="text-xs sm:text-sm md:text-base text-stone-200 mt-1 font-medium">
                {isEs ? 'Filosofía del Buen Vivir' : 'Good Living Philosophy'}
              </span>
            </div>
          </div>

          {/* Official Agency Credentials */}
          <div className="mt-5 pt-4 sm:pt-5 border-t border-stone-700/80 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm md:text-base text-stone-200">
            <ShieldCheck className="w-5 h-5 text-[#F6A935] shrink-0" />
            <span className="leading-snug">
              {isEs ? 'Operador Turístico y Ecolodge Oficial:' : 'Official Tour Operator & Ecolodge:'}{' '}
              <strong className="font-bold text-white">Sumaq Kawsay Expeditions & Inka Lab Complejo Ecoturístico</strong> · {isEs ? 'Cusco & Ollantaytambo · Autorizado DIRCETUR & SERNANP' : 'Cusco & Ollantaytambo · Licensed DIRCETUR & SERNANP'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
