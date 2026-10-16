'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';

// Franja oscura que abre cada pagina interior (deja espacio para el menu fijo).
// Si el administrador cambió los textos en /admin/paginas, se usan esos.
export function PageIntro({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const { cmsRawData } = useCMS();
  const { lang } = useSitePrefs();
  const key = pathname.replace(/^\//, '');
  const o = key && !key.includes('/') ? cmsRawData.pages?.[key] : undefined;
  const en = lang === 'en';
  const eyebrowT = (en ? o?.eyebrowEn : o?.eyebrowEs) || eyebrow;
  const titleT = (en ? o?.titleEn : o?.titleEs) || title;
  const subtitleT = (en ? o?.subtitleEn : o?.subtitleEs) || subtitle;

  return (
    <section className="border-b border-[#F6A935]/30 bg-[#181513] px-4 pb-12 pt-32 text-stone-100 sm:px-6 sm:pt-36 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {eyebrowT && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#F6A935] sm:text-sm">{eyebrowT}</p>
        )}
        <h1 className="font-editorial max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {titleT}
        </h1>
        {subtitleT && <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-stone-200">{subtitleT}</p>}
        {children}
      </div>
    </section>
  );
}