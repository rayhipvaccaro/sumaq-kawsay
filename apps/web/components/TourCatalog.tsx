'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Clock, Mountain, ArrowUpRight, Compass, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Tour } from '@/data/toursData';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';

interface TourCatalogProps {
  lang: 'es' | 'en';
  currency: 'PEN' | 'USD';
  onSelectTour: (tour: Tour) => void;
  onQuickBook: (tour: Tour) => void;
}

export function TourCatalog({
  lang,
  currency,
  onSelectTour,
  onQuickBook,
}: TourCatalogProps) {
  const { tours } = useCMS();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';

  const categories = [
    { id: 'all', label: t.catalog.all },
    { id: 'etnobotanica', label: t.catalog.etnobotanica },
    { id: 'cabalgata', label: t.catalog.cabalgata },
    { id: 'camino-inca', label: t.catalog.caminoInca },
    { id: 'cultura', label: t.catalog.cultura },
    { id: 'experiencias', label: t.catalog.experiencias },
  ];

  const filteredTours = useMemo(() => {
    let list = tours.filter((tour) => {
      const matchesCategory =
        activeCategory === 'all' || tour.category === activeCategory;

      const diff = (isEs ? tour.difficultyEs : tour.difficultyEn).toLowerCase();
      const matchesDifficulty =
        activeDifficulty === 'all' || diff.includes(activeDifficulty.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory && matchesDifficulty;

      const title = (isEs ? tour.titleEs : tour.titleEn).toLowerCase();
      const desc = (isEs ? tour.descriptionEs : tour.descriptionEn).toLowerCase();
      const loc = (isEs ? tour.locationEs : tour.locationEn).toLowerCase();
      return (
        matchesCategory &&
        matchesDifficulty &&
        (title.includes(q) || desc.includes(q) || loc.includes(q))
      );
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => (currency === 'PEN' ? a.pricePEN - b.pricePEN : a.priceUSD - b.priceUSD));
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => (currency === 'PEN' ? b.pricePEN - a.pricePEN : b.priceUSD - a.priceUSD));
    }

    return list;
  }, [tours, activeCategory, activeDifficulty, searchQuery, sortBy, currency, isEs]);

  return (
    <section id="experiencias" className="py-16 sm:py-24 bg-white border-b border-[#F6A935]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Responsive Typography */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {t.catalog.kicker}
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-tight text-balance leading-tight">
            {t.catalog.title}
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-xl md:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {t.catalog.subtitle}
          </p>
        </div>

        {/* Filter Bar & Search Row (Responsive Stacking) */}
        <div className="space-y-4 mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-5">
            {/* Segmented Filter Control with Horizontal Touch Scrolling */}
            <div
              role="tablist"
              aria-label={isEs ? 'Filtrar experiencias por categoría' : 'Filter experiences by category'}
              className="flex items-center gap-2 p-1.5 sm:p-2 bg-[#F4EFE6] rounded-2xl overflow-x-auto scrollbar-none border border-[#F6A935]/40 shadow-inner px-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  aria-controls="tours-catalog-grid"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 sm:px-5 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#F6A935] text-[#181513] shadow-md ring-2 ring-[#442A19]/20'
                      : 'text-stone-800 hover:text-stone-950 hover:bg-white/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Box with Clear Button */}
            <div className="relative w-full lg:w-80 xl:w-96 shrink-0">
              <label htmlFor="tour-search-query" className="sr-only">
                {t.catalog.searchPlaceholder}
              </label>
              <Search className="w-5 h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="tour-search-query"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                aria-label={t.catalog.searchPlaceholder}
                className="w-full pl-12 pr-10 py-3 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] placeholder-stone-500 focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] shadow-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                  title={isEs ? 'Limpiar búsqueda' : 'Clear search'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter Row: Difficulty, Sort & Results Counter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 text-xs sm:text-sm">
            {/* Difficulty Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-stone-500 font-bold mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F6A935]" />
                <span>{isEs ? 'Dificultad:' : 'Difficulty:'}</span>
              </span>
              {[
                { id: 'all', label: isEs ? 'Todas' : 'All' },
                { id: 'fácil', label: isEs ? 'Fácil' : 'Easy' },
                { id: 'moderado', label: isEs ? 'Moderado' : 'Moderate' },
                { id: 'exigente', label: isEs ? 'Exigente' : 'Challenging' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setActiveDifficulty(diff.id)}
                  className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    activeDifficulty === diff.id
                      ? 'bg-[#181513] text-[#F6A935] shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>

            {/* Sort & Counter */}
            <div className="flex items-center gap-3">
              <span className="text-stone-500 font-semibold hidden md:inline">
                {isEs
                  ? `${filteredTours.length} expediciones encontradas`
                  : `${filteredTours.length} expeditions found`}
              </span>

              <div className="flex items-center gap-1.5 bg-[#F4EFE6] px-3 py-1.5 rounded-xl border border-stone-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#F6A935]" />
                <label htmlFor="sort-tours-select" className="sr-only">
                  {isEs ? 'Ordenar por' : 'Sort by'}
                </label>
                <select
                  id="sort-tours-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-[#181513] focus:outline-none cursor-pointer"
                >
                  <option value="featured">{isEs ? 'Destacados' : 'Featured'}</option>
                  <option value="price-asc">{isEs ? 'Precio: Menor a Mayor' : 'Price: Low to High'}</option>
                  <option value="price-desc">{isEs ? 'Precio: Mayor a Menor' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid with Rich Responsive Card Architecture */}
        {filteredTours.length > 0 ? (
          <div
            id="tours-catalog-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          >
            {filteredTours.map((tour) => {
              const priceDisplay =
                currency === 'PEN'
                  ? `S/ ${tour.pricePEN.toFixed(2)}`
                  : `$ ${tour.priceUSD.toFixed(2)} USD`;

              const tourTitle = isEs ? tour.titleEs : tour.titleEn;

              return (
                <article
                  key={tour.id}
                  aria-labelledby={`tour-title-${tour.id}`}
                  className="bg-white rounded-2xl sm:rounded-3xl border-2 border-[#F6A935]/40 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#F6A935] transition-all duration-300 flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={tour.image}
                      alt={tourTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181513]/85 via-transparent to-transparent opacity-90" />

                    {/* Location watermark */}
                    <div className="absolute bottom-3 left-4 text-xs sm:text-sm md:text-base text-white font-semibold drop-shadow-md flex items-center gap-1.5 sm:gap-2">
                      <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#F6A935]" />
                      <span className="truncate">{isEs ? tour.locationEs : tour.locationEn}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-7 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#442A19] mb-2.5 sm:mb-3 font-bold">
                        <span className="text-white bg-[#9E2021] px-2.5 sm:px-3 py-1 rounded-md sm:rounded-lg uppercase tracking-wider text-xs sm:text-sm font-extrabold border border-[#F6A935]/50 shadow-xs">
                          {tour.category}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-stone-700">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6A935]" />
                          <span>{isEs ? tour.durationEs : tour.durationEn}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-stone-700">
                          <Mountain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F6A935]" />
                          <span>{tour.maxAltitude}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        id={`tour-title-${tour.id}`}
                        className="font-heading text-xl sm:text-2xl md:text-3xl font-extrabold text-[#181513] group-hover:text-[#442A19] transition-colors leading-snug"
                      >
                        {tourTitle}
                      </h3>

                      {/* Brief description */}
                      <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-[#2C2623] line-clamp-3 leading-relaxed font-normal">
                        {isEs ? tour.subtitleEs : tour.subtitleEn}
                      </p>
                    </div>

                    {/* Card Footer: Responsive Price & Actions */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <span className="text-xs sm:text-sm text-stone-600 block uppercase tracking-wider font-bold">
                          {t.catalog.priceFrom}
                        </span>
                        <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#181513] tabular-nums font-heading">
                          {priceDisplay}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onSelectTour(tour)}
                          aria-label={`${isEs ? 'Ver detalles de' : 'View details of'} ${tourTitle}`}
                          className="flex-1 sm:flex-none justify-center px-4 py-2.5 text-xs sm:text-sm md:text-base font-bold text-stone-800 hover:text-stone-950 border-2 border-stone-300 rounded-xl hover:bg-stone-100 transition-colors inline-flex items-center gap-1 shadow-xs min-h-[44px]"
                        >
                          <span>{isEs ? 'Detalles' : 'Details'}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onQuickBook(tour)}
                          aria-label={`${isEs ? 'Reservar experiencia' : 'Book experience'} ${tourTitle}`}
                          className="flex-1 sm:flex-none justify-center px-5 py-2.5 text-xs sm:text-sm md:text-base font-bold text-[#442A19] bg-[#F6A935] hover:bg-[#9E2021] hover:text-white rounded-xl transition-all shadow-md border border-[#FDE8B5] min-h-[44px]"
                        >
                          {t.catalog.bookDirect}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-10 sm:p-16 text-center bg-[#FDFBF7] rounded-3xl border-2 border-[#F6A935]/30">
            <p className="text-base sm:text-lg text-stone-800 font-semibold">
              {isEs
                ? 'No se encontraron tours con los criterios seleccionados.'
                : 'No tours found matching your search criteria.'}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#F6A935] text-[#181513] font-bold text-sm sm:text-base shadow-sm"
            >
              {isEs ? 'Restablecer filtros' : 'Reset filters'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
