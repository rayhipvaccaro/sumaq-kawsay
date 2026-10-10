'use client';

import { Star, MessageSquare, ShieldCheck, Award } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';

interface TestimonialsSectionProps {
  lang: 'es' | 'en';
}

export function TestimonialsSection({ lang }: TestimonialsSectionProps) {
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';
  const { testimonials, generalContent } = useCMS();
  const sponsors = generalContent?.sponsors || [];

  return (
    <section className="py-20 sm:py-28 bg-[#F4EFE6] border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Large Fonts */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {t.testimonials.kicker}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-base sm:text-xl md:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Dynamic Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border-2 border-[#F6A935]/40 p-6 sm:p-10 shadow-lg flex flex-col justify-between hover:border-[#F6A935] hover:shadow-2xl transition-all duration-300 group"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1.5 text-amber-500 mb-5 sm:mb-6" aria-label="Calificación 5 estrellas">
                  {Array.from({ length: item.rating || 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F6A935] text-[#F6A935]" />
                  ))}
                </div>

                {/* Quote with comfortable large text */}
                <blockquote className="font-editorial text-lg sm:text-2xl text-[#181513] leading-relaxed italic mb-6 sm:mb-8">
                  {isEs ? item.quoteEs : item.quoteEn || item.quoteEs}
                </blockquote>
              </div>

              {/* Author & Org */}
              <div className="pt-5 sm:pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base">
                <div>
                  <h3 className="font-heading font-extrabold text-[#181513] text-base sm:text-xl">{item.author}</h3>
                  <span className="text-stone-700 block mt-0.5 sm:mt-1 font-medium text-xs sm:text-sm">
                    {(isEs ? item.roleEs : item.roleEn) || item.roleEs} · {item.org}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-[#181513] bg-[#F4EFE6] px-3.5 py-1.5 rounded-xl border border-[#F6A935]/60 shadow-2xs">
                  {item.tagEs}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Auspiciadores & Aliados Estratégicos Section */}
        {sponsors.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t-2 border-[#F6A935]/30">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F6A935]/50 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#442A19] mb-3 shadow-xs">
                <Award className="w-4 h-4 text-[#F6A935]" />
                <span>{isEs ? 'Respaldo Institucional & Alianzas' : 'Institutional Alliances & Partners'}</span>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181513]">
                {isEs ? 'Auspiciadores & Sellos Oficiales' : 'Official Sponsors & Certifications'}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 mt-2">
                {isEs
                  ? 'Garantía formal, registro legal DIRCETUR y alianzas vivas en las comunidades del Cusco.'
                  : 'Formal licensing, DIRCETUR registry, and direct alliances with native Cusco communities.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {sponsors.map((sp) => (
                <div
                  key={sp.id}
                  className="bg-white rounded-2xl border-2 border-[#F6A935]/30 p-5 sm:p-6 text-center hover:border-[#F6A935] hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-xs uppercase font-bold text-[#F6A935] bg-[#221E1B] px-2.5 py-0.5 rounded-md mb-3">
                      {sp.badge || (isEs ? 'Socio Oficial' : 'Official Partner')}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#181513]">
                      {sp.name}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 font-medium mt-2 pt-2 border-t border-stone-100">
                    {sp.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
