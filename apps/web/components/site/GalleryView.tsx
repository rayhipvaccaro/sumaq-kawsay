'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS, type GalleryCategory } from '@/data/gallery';

export function GalleryView({ lang }: { lang: 'es' | 'en' }) {
  const isEs = lang === 'es';
  const [cat, setCat] = useState<GalleryCategory | 'all'>('all');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const photos = useMemo(
    () => (cat === 'all' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((p) => p.category === cat)),
    [cat],
  );

  const go = useCallback(
    (d: number) => setOpenIdx((i) => (i === null ? null : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx, go]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
      active
        ? 'border-[#442A19] bg-[#442A19] text-white'
        : 'border-stone-300 bg-white text-stone-700 hover:border-[#F6A935]'
    }`;

  const current = openIdx === null ? null : photos[openIdx];

  return (
    <section className="bg-[#FDFBF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={isEs ? 'Filtrar fotos' : 'Filter photos'}>
          <button type="button" onClick={() => setCat('all')} aria-pressed={cat === 'all'} className={chip(cat === 'all')}>
            {isEs ? 'Todas' : 'All'}
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
              className={chip(cat === c.id)}
            >
              {isEs ? c.es : c.en}
            </button>
          ))}
        </div>

        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((p, i) => (
            <li key={p.src} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenIdx(i)}
                className="group block w-full overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={p.src}
                    alt={isEs ? p.captionEs : p.captionEn}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="px-4 py-3 text-sm font-semibold text-stone-800">{isEs ? p.captionEs : p.captionEn}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEs ? current.captionEs : current.captionEn}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 p-4"
          onClick={() => setOpenIdx(null)}
        >
          <div className="flex justify-end">
            <button
              type="button"
              aria-label={isEs ? 'Cerrar' : 'Close'}
              onClick={() => setOpenIdx(null)}
              className="rounded-full p-2 text-white hover:bg-white/10"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={isEs ? current.captionEs : current.captionEn}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-3 pt-3 text-white" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => go(-1)} aria-label={isEs ? 'Anterior' : 'Previous'} className="rounded-full p-2 hover:bg-white/10">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <p className="text-center text-base font-semibold">{isEs ? current.captionEs : current.captionEn}</p>
            <button type="button" onClick={() => go(1)} aria-label={isEs ? 'Siguiente' : 'Next'} className="rounded-full p-2 hover:bg-white/10">
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
