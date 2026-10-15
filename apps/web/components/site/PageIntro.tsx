import type { ReactNode } from 'react';

// Franja oscura que abre cada pagina interior (deja espacio para el menu fijo).
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
  return (
    <section className="border-b border-[#F6A935]/30 bg-[#181513] px-4 pb-12 pt-32 text-stone-100 sm:px-6 sm:pt-36 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#F6A935] sm:text-sm">{eyebrow}</p>
        )}
        <h1 className="font-editorial max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-stone-200">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
