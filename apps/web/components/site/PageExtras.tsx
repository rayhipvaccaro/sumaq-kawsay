'use client';

import { usePathname } from 'next/navigation';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';

// Bloques de texto (y foto) que el administrador agrega a cada página desde /admin/paginas.
export function PageExtras() {
  const pathname = usePathname();
  const { cmsRawData } = useCMS();
  const { lang } = useSitePrefs();
  const key = pathname.replace(/^\//, '');
  if (!key || key.includes('/')) return null;
  const blocks = cmsRawData.pages?.[key]?.blocks ?? [];
  if (blocks.length === 0) return null;
  const en = lang === 'en';

  return (
    <section className="bg-[#FDFBF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {blocks.map((b) => {
          const title = (en ? b.titleEn : b.titleEs) || b.titleEs;
          const body = (en ? b.bodyEn : b.bodyEs) || b.bodyEs;
          return (
            <article key={b.id} className="space-y-4">
              {b.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.image} alt="" className="max-h-96 w-full rounded-2xl object-cover" />
              )}
              {title && <h2 className="font-editorial text-3xl font-semibold text-[#181513]">{title}</h2>}
              {body && <p className="whitespace-pre-line text-lg leading-relaxed text-stone-800">{body}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}