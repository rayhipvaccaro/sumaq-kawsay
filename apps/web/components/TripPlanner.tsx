'use client';

import { useState, useMemo } from 'react';
import { Compass, MessageCircle, Send, Plus, Minus, Check, Calendar, Users } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';

interface TripPlannerProps {
  lang: 'es' | 'en';
  currency: 'PEN' | 'USD';
  onBookCustom: (summary: CustomQuoteSummary) => void;
}

export interface CustomQuoteSummary {
  durationId: string;
  durationLabel: string;
  styleId: string;
  styleLabel: string;
  travelers: number;
  selectedExperienceIds: string[];
  selectedExperienceTitles: string[];
  selectedAddonIds: string[];
  selectedAddonTitles: string[];
  totalPEN: number;
  totalUSD: number;
}

// Helper to format numbers deterministically across server and client
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function TripPlanner({ lang, currency, onBookCustom }: TripPlannerProps) {
  const { tours } = useCMS();
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';

  // Planner state
  const [duration, setDuration] = useState<string>('2-3d');
  const [style, setStyle] = useState<string>('confort');
  const [travelers, setTravelers] = useState<number>(2);
  const [selectedTours, setSelectedTours] = useState<string[]>([
    'etnobotanica-chillca',
    'cabalgata-qhapaq-nan',
  ]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'pachamanca',
    'kitHierbas',
  ]);

  // Toggle experiences
  const toggleTour = (id: string) => {
    setSelectedTours((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle addons
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculations
  const quote = useMemo(() => {
    const styleObj = t.planner.styleOptions.find((s) => s.id === style) || t.planner.styleOptions[1];
    const multiplier = styleObj.multiplier;

    // Sum base price of selected tours
    let baseToursPEN = 0;
    let baseToursUSD = 0;

    selectedTours.forEach((tourId) => {
      const tour = tours.find((item) => item.id === tourId);
      if (tour) {
        baseToursPEN += tour.pricePEN;
        baseToursUSD += tour.priceUSD;
      }
    });

    // If no tour selected, baseline minimum
    if (selectedTours.length === 0) {
      baseToursPEN = 350;
      baseToursUSD = 95;
    }

    // Apply style multiplier
    const adjustedPerPersonPEN = baseToursPEN * multiplier;
    const adjustedPerPersonUSD = baseToursUSD * multiplier;

    // Addons cost
    let addonsPEN = 0;
    let addonsUSD = 0;

    selectedAddons.forEach((addonId) => {
      const addon = t.planner.extraOptions.find((a) => a.id === addonId);
      if (addon) {
        addonsPEN += addon.pricePEN * travelers;
        addonsUSD += addon.priceUSD * travelers;
      }
    });

    // Group discount
    let groupDiscount = 1;
    if (travelers >= 5) groupDiscount = 0.90;
    else if (travelers >= 3) groupDiscount = 0.95;

    const totalPEN = Math.round((adjustedPerPersonPEN * travelers * groupDiscount) + addonsPEN);
    const totalUSD = Math.round((adjustedPerPersonUSD * travelers * groupDiscount) + addonsUSD);
    const perPersonPEN = Math.round(totalPEN / travelers);
    const perPersonUSD = Math.round(totalUSD / travelers);

    return {
      totalPEN,
      totalUSD,
      perPersonPEN,
      perPersonUSD,
      discountPercent: groupDiscount < 1 ? Math.round((1 - groupDiscount) * 100) : 0,
    };
  }, [style, selectedTours, selectedAddons, travelers, t, tours]);

  const currentDurationObj = t.planner.durationOptions.find((d) => d.id === duration);
  const currentStyleObj = t.planner.styleOptions.find((s) => s.id === style);

  // Generate WhatsApp message URL without window.open
  const whatsAppUrl = useMemo(() => {
    const selectedTourTitles = selectedTours
      .map((id) => (isEs ? tours.find((t) => t.id === id)?.titleEs : tours.find((t) => t.id === id)?.titleEn) || id)
      .join(', ');

    const selectedAddonTitles = selectedAddons
      .map((id) => t.planner.extraOptions.find((a) => a.id === id)?.label || id)
      .join(', ');

    const msg = isEs
      ? `¡Hola Sumaq Kawsay & Inka Lab! He diseñado un itinerario personalizado en el Cotizador Inteligente:
• Duración: ${currentDurationObj?.label} (${currentDurationObj?.desc})
• Estilo: ${currentStyleObj?.label}
• Viajeros: ${travelers} persona(s)
• Experiencias: ${selectedTourTitles || 'A definir'}
• Adicionales: ${selectedAddonTitles || 'Ninguno'}
• Estimado: ${currency === 'PEN' ? `S/ ${formatNumber(quote.totalPEN)}` : `$ ${formatNumber(quote.totalUSD)} USD`}
¿Podrían confirmarme disponibilidad y afinar los detalles? ¡Gracias!`
      : `Hello Sumaq Kawsay & Inka Lab! I customized a trip using your Smart Trip Planner:
• Duration: ${currentDurationObj?.label} (${currentDurationObj?.desc})
• Style: ${currentStyleObj?.label}
• Travelers: ${travelers} guest(s)
• Experiences: ${selectedTourTitles || 'To be decided'}
• Add-ons: ${selectedAddonTitles || 'None'}
• Estimated Total: ${currency === 'PEN' ? `S/ ${formatNumber(quote.totalPEN)}` : `$ ${formatNumber(quote.totalUSD)} USD`}
Could you please confirm dates and availability? Thank you!`;

    return `https://wa.me/51912189856?text=${encodeURIComponent(msg)}`;
  }, [selectedTours, selectedAddons, isEs, currentDurationObj, currentStyleObj, travelers, currency, quote.totalPEN, quote.totalUSD, t.planner.extraOptions, tours]);

  const handleBookSummary = () => {
    const selectedTourTitles = selectedTours
      .map((id) => (isEs ? tours.find((t) => t.id === id)?.titleEs : tours.find((t) => t.id === id)?.titleEn) || id);

    const selectedAddonTitles = selectedAddons
      .map((id) => t.planner.extraOptions.find((a) => a.id === id)?.label || id);

    const summary: CustomQuoteSummary = {
      durationId: duration,
      durationLabel: currentDurationObj?.label || '',
      styleId: style,
      styleLabel: currentStyleObj?.label || '',
      travelers,
      selectedExperienceIds: selectedTours,
      selectedExperienceTitles: selectedTourTitles,
      selectedAddonIds: selectedAddons,
      selectedAddonTitles: selectedAddonTitles,
      totalPEN: quote.totalPEN,
      totalUSD: quote.totalUSD,
    };

    onBookCustom(summary);
  };

  return (
    <section id="cotizador" className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Responsive Typography */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {t.planner.kicker}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {t.planner.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {t.planner.subtitle}
          </p>
        </div>

        {/* 2-Column Interactive Planner Layout (Responsive Stacking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Column: Interactive Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 bg-white p-4 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl border-2 border-[#F6A935]/40 shadow-xl">
            {/* Step 1: Duration */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
                <h3 className="font-heading text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wider text-[#181513]">
                  {t.planner.step1}
                </h3>
                <span className="text-xs sm:text-sm text-stone-700 font-bold">
                  {isEs ? 'Elige tus días en Cusco' : 'Choose trip duration'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {t.planner.durationOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDuration(opt.id)}
                    className={`p-3 sm:p-4 text-left rounded-xl sm:rounded-2xl border-2 transition-all ${
                      duration === opt.id
                        ? 'border-[#F6A935] bg-[#F4EFE6] text-[#181513] shadow-md ring-2 ring-[#F6A935]'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <span className="block text-sm sm:text-base md:text-lg font-extrabold text-[#181513]">
                      {opt.label}
                    </span>
                    <span className="block text-xs sm:text-sm text-stone-700 mt-1 leading-snug">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Travel Style */}
            <div className="pt-6 sm:pt-8 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
                <h3 className="font-heading text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wider text-[#181513]">
                  {t.planner.step2}
                </h3>
                <span className="text-xs sm:text-sm text-stone-700 font-bold">
                  {isEs ? 'Ritmo y nivel de confort' : 'Pace & comfort level'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {t.planner.styleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStyle(opt.id)}
                    className={`p-3.5 sm:p-5 text-left rounded-xl sm:rounded-2xl border-2 transition-all ${
                      style === opt.id
                        ? 'border-[#F6A935] bg-[#F4EFE6] text-[#181513] ring-2 ring-[#F6A935] shadow-md'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                    }`}
                  >
                    <span className="block text-base sm:text-lg font-extrabold text-[#181513]">
                      {opt.label}
                    </span>
                    <span className="block text-xs sm:text-sm text-stone-700 mt-1.5 leading-relaxed">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Desired Experiences */}
            <div className="pt-6 sm:pt-8 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3 sm:mb-4">
                <h3 className="font-heading text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wider text-[#181513]">
                  {t.planner.step3}
                </h3>
                <span className="text-xs sm:text-sm text-stone-700 font-bold">
                  {isEs ? 'Selecciona las que desees incluir' : 'Select tours to combine'}
                </span>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                {tours.map((tour) => {
                  const isSelected = selectedTours.includes(tour.id);
                  const priceStr =
                    currency === 'PEN'
                      ? `+ S/ ${tour.pricePEN.toFixed(0)}`
                      : `+ $ ${tour.priceUSD.toFixed(0)} USD`;

                  return (
                    <div
                      key={tour.id}
                      onClick={() => toggleTour(tour.id)}
                      className={`p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 ${
                        isSelected
                          ? 'border-[#F6A935] bg-[#F4EFE6] text-[#181513] shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#F6A935] border-[#F6A935] text-[#181513]'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-[#181513]">
                            {isEs ? tour.titleEs : tour.titleEn}
                          </h4>
                          <span className="text-xs sm:text-sm text-stone-700 font-medium">
                            {isEs ? tour.durationEs : tour.durationEn} · {isEs ? tour.locationEs : tour.locationEn}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm sm:text-base md:text-lg font-extrabold text-[#181513] tabular-nums shrink-0 font-mono self-end sm:self-center">
                        {priceStr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Travelers & Optional Add-ons */}
            <div className="pt-6 sm:pt-8 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className="font-heading text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-wider text-[#181513]">
                  {t.planner.step4}
                </h3>
                {/* Travelers counter */}
                <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#F4EFE6] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 border-[#F6A935]/50 shadow-inner">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#442A19]" />
                    <span className="text-sm sm:text-base font-extrabold text-[#181513]">
                      {isEs ? 'Viajeros:' : 'Guests:'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-1">
                    <button
                      onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-stone-200 border border-stone-400 flex items-center justify-center text-stone-900 font-bold"
                      aria-label="Menos viajeros"
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-base sm:text-lg font-extrabold text-[#181513] w-6 text-center tabular-nums">
                      {travelers}
                    </span>
                    <button
                      onClick={() => setTravelers((prev) => Math.min(12, prev + 1))}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white hover:bg-stone-200 border border-stone-400 flex items-center justify-center text-stone-900 font-bold"
                      aria-label="Más viajeros"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Addons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {t.planner.extraOptions.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  const priceStr =
                    currency === 'PEN'
                      ? `+ S/ ${addon.pricePEN}`
                      : `+ $ ${addon.priceUSD} USD`;

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 sm:p-4 text-left rounded-xl sm:rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#F6A935] bg-[#F4EFE6] text-[#181513] shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                      }`}
                    >
                      <span className="flex items-start gap-2.5 sm:gap-3">
                        <span
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 inline-flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#F6A935] border-[#F6A935] text-[#181513]'
                              : 'border-stone-400 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-[#181513] leading-snug">
                          {addon.label}
                        </span>
                      </span>
                      <span className="text-xs sm:text-sm md:text-base font-extrabold text-[#181513] tabular-nums shrink-0 font-mono">
                        {priceStr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Live Estimate Card (5 Cols) with Responsive Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 w-full">
            <div className="bg-[#181513] text-stone-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl border-2 border-[#F6A935]">
              <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-stone-700">
                <span className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-[#FDE8B5] font-extrabold">
                  {t.planner.summaryTitle}
                </span>
                <span className="text-xs sm:text-sm text-stone-300 font-mono font-bold bg-[#221E1B] px-2.5 py-1 rounded-md border border-stone-700">
                  INKALAB · SUMAQ KAWSAY
                </span>
              </div>

              {/* Itinerary Specs with High Legibility */}
              <div className="py-4 sm:py-6 space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg border-b border-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">{isEs ? 'Duración:' : 'Duration:'}</span>
                  <span className="font-extrabold text-white text-right">
                    {currentDurationObj?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">{isEs ? 'Estilo de Viaje:' : 'Travel Style:'}</span>
                  <span className="font-extrabold text-white text-right">
                    {currentStyleObj?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">{isEs ? 'Pasajeros:' : 'Travelers:'}</span>
                  <span className="font-extrabold text-white tabular-nums">
                    {travelers} {travelers === 1 ? (isEs ? 'persona' : 'guest') : (isEs ? 'personas' : 'guests')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300 font-medium">{isEs ? 'Experiencias Seleccionadas:' : 'Experiences:'}</span>
                  <span className="font-extrabold text-[#FDE8B5] tabular-nums">
                    {selectedTours.length} {isEs ? 'rutas' : 'tours'}
                  </span>
                </div>
                {quote.discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-extrabold text-sm sm:text-base md:text-lg">
                    <span>{isEs ? 'Descuento grupal aplicado:' : 'Group discount:'}</span>
                    <span>-{quote.discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Price Calculation Display with Responsive Size */}
              <div className="py-5 sm:py-7" suppressHydrationWarning>
                <span className="text-xs sm:text-sm md:text-base text-stone-300 block mb-1.5 font-bold uppercase tracking-wider">
                  {t.planner.totalEstimated}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#F6A935] tabular-nums tracking-tight">
                    {currency === 'PEN'
                      ? `S/ ${formatNumber(quote.totalPEN)}`
                      : `$ ${formatNumber(quote.totalUSD)} USD`}
                  </span>
                </div>
                <span className="text-sm sm:text-base md:text-lg text-stone-200 block mt-2 font-semibold">
                  ~ {currency === 'PEN' ? `S/ ${formatNumber(quote.perPersonPEN)}` : `$ ${formatNumber(quote.perPersonUSD)} USD`} {t.planner.perPerson}
                </span>
              </div>

              {/* Guarantee / Transparency Note */}
              <p className="text-xs sm:text-sm md:text-base text-stone-300 leading-relaxed mb-6 sm:mb-8 font-normal">
                {t.planner.currencyNote}
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xl transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-stone-950 shrink-0" />
                  <span>{t.planner.sendWhatsApp}</span>
                </a>

                <button
                  onClick={handleBookSummary}
                  className="w-full inline-flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl transition-all shadow-xl border border-[#FDE8B5] transform hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span>{t.planner.requestCustom}</span>
                </button>
              </div>

              {/* Contact hint */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-stone-800 text-center">
                <span className="text-xs sm:text-sm md:text-base text-stone-300">
                  {isEs ? 'Asesoría directa en Cusco:' : 'Direct advisory in Cusco:'}{' '}
                  <a
                    href="tel:+51912189856"
                    className="text-[#FDE8B5] hover:text-white font-bold underline ml-1"
                  >
                    +51 912 189 856
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
