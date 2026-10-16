'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Download } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';
import { useSiteActions } from '@/components/site/SiteShell';
import { PageIntro } from '@/components/site/PageIntro';
import { GalleryView } from '@/components/site/GalleryView';
import { Hero } from '@/components/Hero';
import { PhilosophySection } from '@/components/PhilosophySection';
import { SpaceExplorer } from '@/components/SpaceExplorer';
import { AncestralZones } from '@/components/AncestralZones';
import { EcotourismComplex } from '@/components/EcotourismComplex';
import { TourCatalog } from '@/components/TourCatalog';
import { UserFlowSection } from '@/components/UserFlowSection';
import { TripPlanner } from '@/components/TripPlanner';
import { EthnobotanyLab } from '@/components/EthnobotanyLab';
import { SeasonalityGuide } from '@/components/SeasonalityGuide';
import { RouteAccess } from '@/components/RouteAccess';
import { QRAudioGuides } from '@/components/QRAudioGuides';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { TOURS_DATA } from '@/data/toursData';
import { PRESS_ARTICLES } from '@/data/press';

const t = (isEs: boolean, es: string, en: string) => (isEs ? es : en);

export function HomeView() {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const router = useRouter();
  const { openSystemGuide } = useSiteActions();

  const cards = [
    { href: '/servicios', img: '/images/bungalow_ecoturistico_1791233601485.jpg', es: 'Dormir en Inka Lab', en: 'Stay at Inka Lab', tes: 'Bungalows de piedra, domos y pasadía en el Km 84.', ten: 'Stone bungalows, domes and day passes at Km 84.' },
    { href: '/experiencias', img: '/images/camino_inca_hikers_1791233058867.jpg', es: 'Tours y actividades', en: 'Tours & activities', tes: 'Caminatas, cabalgata, canotaje y experiencias con guías locales.', ten: 'Hikes, horseback riding, canoeing and guided experiences.' },
    { href: '/zonas', img: '/images/hanan_pacha_night_sky_1791233581943.jpg', es: 'Zonas sagradas', en: 'Sacred zones', tes: 'Hanan Pacha, Willka Unu e Inti Punku: tres mundos andinos.', ten: 'Hanan Pacha, Willka Unu and Inti Punku: three Andean worlds.' },
    { href: '/herbario', img: '/images/tour_etnobotanica_herbs_1791233038018.jpg', es: 'Herbario vivo', en: 'Living herbarium', tes: 'Plantas medicinales y la sabiduría de quienes las cuidan.', ten: 'Medicinal plants and the wisdom of those who tend them.' },
    { href: '/galeria', img: '/images/inkalab/laguna-nevada.png', es: 'Galería', en: 'Gallery', tes: 'Mira el lugar antes de llegar.', ten: 'See the place before you arrive.' },
    { href: '/planificador', img: '/images/hero_valle_sagrado_andes_1791233029285.jpg', es: 'Planifica tu viaje', en: 'Plan your trip', tes: 'Arma tu ruta y mira el precio estimado al instante.', ten: 'Build your route and see an instant price estimate.' },
  ];

  return (
    <>
      <Hero
        lang={lang}
        currency={currency}
        onExploreTours={() => router.push('/experiencias')}
        onOpenPlanner={() => router.push('/planificador')}
        onOpenSystemGuide={openSystemGuide}
      />
      <section className="bg-[#FDFBF7] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-editorial max-w-2xl text-balance text-3xl font-semibold text-[#181513] sm:text-4xl">
            {t(isEs, 'Qué puedes vivir en el Km 84', 'What you can experience at Km 84')}
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden">
                    <Image
                      src={c.img}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-[#181513]">{t(isEs, c.es, c.en)}</h3>
                    <p className="mt-1 text-base text-stone-600">{t(isEs, c.tes, c.ten)}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#9E2021]">
                      {t(isEs, 'Ver más', 'Learn more')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TestimonialsSection lang={lang} />
      <section className="bg-[#181513] px-4 py-14 text-center text-stone-100 sm:px-6">
        <h2 className="font-editorial text-3xl font-semibold text-white sm:text-4xl">
          {t(isEs, '¿Listo para tu estadía?', 'Ready for your stay?')}
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/reservar" className="inline-flex items-center gap-2 rounded-xl bg-[#F6A935] px-6 py-3.5 text-base font-bold text-[#181513] hover:bg-[#D48B1E]">
            <Calendar className="h-5 w-5" aria-hidden="true" />
            {t(isEs, 'Reservar ahora', 'Book now')}
          </Link>
          <Link href="/contacto" className="inline-flex items-center rounded-xl border border-stone-600 px-6 py-3.5 text-base font-bold text-white hover:border-[#F6A935]">
            {t(isEs, 'Escribirnos', 'Contact us')}
          </Link>
        </div>
      </section>
    </>
  );
}

export function NosotrosView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro
        eyebrow="Sumaq Kawsay · Inka Lab"
        title={t(isEs, 'Sobre nosotros', 'About us')}
        subtitle={t(isEs, 'Turismo sostenible y sabiduría andina en el Km 84 de Ollantaytambo.', 'Sustainable tourism and Andean wisdom at Km 84, Ollantaytambo.')}
      />
      <PhilosophySection lang={lang} />
      <SpaceExplorer lang={lang} />
      <TestimonialsSection lang={lang} />
    </>
  );
}

export function ZonasView() {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const { bookZone } = useSiteActions();
  return (
    <>
      <PageIntro eyebrow="Inka Lab" title={t(isEs, 'Zonas sagradas', 'Sacred zones')} subtitle={t(isEs, 'Hanan Pacha, Willka Unu e Inti Punku: tres recorridos, tres formas de entender los Andes.', 'Hanan Pacha, Willka Unu and Inti Punku: three routes, three ways to understand the Andes.')} />
      <AncestralZones lang={lang} currency={currency} onBookZone={bookZone} />
    </>
  );
}

export function ExperienciasView() {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const { openTourDetail, bookTour } = useSiteActions();
  return (
    <>
      <PageIntro eyebrow="Sumaq Kawsay" title={t(isEs, 'Tours y actividades', 'Tours & activities')} subtitle={t(isEs, 'Elige una experiencia, mira su detalle y reserva con cupos reales.', 'Choose an experience, see the details and book with real availability.')} />
      <TourCatalog lang={lang} currency={currency} onSelectTour={openTourDetail} onQuickBook={bookTour} />
      <UserFlowSection lang={lang} currency={currency} />
    </>
  );
}

export function ServiciosView() {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const { bookService } = useSiteActions();
  return (
    <>
      <PageIntro eyebrow="Inka Lab" title={t(isEs, 'Servicios y tarifas', 'Services & rates')} subtitle={t(isEs, 'Dormir, comer, relajarte y pasar el día en el complejo.', 'Sleep, dine, unwind and spend the day at the complex.')}><a href="/triptico?auto=1" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F6A935] px-5 py-3 text-sm font-extrabold text-[#181513] hover:bg-[#D48B1E]"><Download className="h-4 w-4" aria-hidden="true" />{t(isEs, 'Descargar tríptico (PDF)', 'Download brochure (PDF)')}</a></PageIntro>
      <EcotourismComplex lang={lang} currency={currency} onBookService={bookService} />
    </>
  );
}

export function HerbarioView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  const { openTourDetail } = useSiteActions();
  return (
    <>
      <PageIntro eyebrow="Chillca" title={t(isEs, 'Herbario vivo', 'Living herbarium')} subtitle={t(isEs, 'Plantas medicinales y saberes que se aprenden caminando.', 'Medicinal plants and knowledge learned on foot.')} />
      <EthnobotanyLab
        lang={lang}
        onBookEthnobotany={() => {
          const tour = TOURS_DATA.find((x) => x.id === 'etnobotanica-chillca');
          if (tour) openTourDetail(tour);
        }}
      />
    </>
  );
}

export function PlanificadorView() {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const { bookCustom } = useSiteActions();
  return (
    <>
      <PageIntro eyebrow="Sumaq Kawsay" title={t(isEs, 'Planifica tu viaje', 'Plan your trip')} subtitle={t(isEs, 'Arma tu ruta y mira el precio estimado en la moneda que prefieras.', 'Build your route and see the estimated price in your preferred currency.')} />
      <TripPlanner lang={lang} currency={currency} onBookCustom={bookCustom} />
    </>
  );
}

export function EstacionalidadView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Km 84" title={t(isEs, 'Clima y temporadas', 'Climate & seasons')} subtitle={t(isEs, 'Cuándo ir según lo que quieras vivir.', 'When to go, depending on what you want to experience.')} />
      <SeasonalityGuide lang={lang} />
    </>
  );
}

export function ComoLlegarView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Ollantaytambo" title={t(isEs, 'Cómo llegar', 'How to get here')} subtitle={t(isEs, 'Desde Cusco son unos 80 minutos hasta el Km 84.', 'It is about 80 minutes from Cusco to Km 84.')} />
      <RouteAccess lang={lang} />
    </>
  );
}

export function AudioguiasView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Inka Lab" title={t(isEs, 'QR y audioguías', 'QR & audio guides')} subtitle={t(isEs, 'Escanea el código en cada zona y escucha su historia.', 'Scan the code in each zone and listen to its story.')} />
      <QRAudioGuides lang={lang} />
    </>
  );
}

export function GaleriaView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Inka Lab" title={t(isEs, 'Galería', 'Gallery')} subtitle={t(isEs, 'Paisajes, cultura, aventura y descanso en el Valle Sagrado.', 'Landscapes, culture, adventure and rest in the Sacred Valley.')} />
      <GalleryView lang={lang} />
    </>
  );
}

export function PrensaView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Inka Lab" title={t(isEs, 'Prensa y cultura', 'Press & culture')} subtitle={t(isEs, 'Artículos sobre arqueología, cosmovisión y vida en Ollantaytambo.', 'Articles on archaeology, cosmovision and life in Ollantaytambo.')} />
      <section className="bg-[#FDFBF7] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {!isEs && (
            <p className="mb-6 rounded-xl border border-[#F6A935]/50 bg-[#FFF8EC] px-4 py-3 text-sm font-semibold text-[#442A19]">
              These articles are available in Spanish only.
            </p>
          )}
          <ul className="grid gap-6 md:grid-cols-2">
            {PRESS_ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link href={`/prensa/${a.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <div className="relative aspect-16/9 w-full overflow-hidden">
                    <Image src={a.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9E2021]">{a.category} · {a.date} · {a.readTime}</p>
                    <h2 className="mt-2 text-xl font-extrabold leading-snug text-[#181513]">{a.title}</h2>
                    <p className="mt-2 text-base text-stone-600">{a.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#9E2021]">
                      {t(isEs, 'Leer artículo', 'Read article')}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function ArticuloView({ slug }: { slug: string }) {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  const a = PRESS_ARTICLES.find((x) => x.slug === slug);
  if (!a) return null;
  return (
    <>
      <PageIntro eyebrow={`${a.category} · ${a.date} · ${a.readTime}`} title={a.title} subtitle={a.subtitle || a.summary} />
      <article className="bg-[#FDFBF7] px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-8 aspect-16/9 w-full overflow-hidden rounded-2xl">
            <Image src={a.image} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
          </div>
          <p className="mb-6 text-sm font-semibold text-stone-600">{a.author}{a.role ? ` · ${a.role}` : ''}</p>
          <div className="space-y-5 text-lg leading-relaxed text-stone-800">
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link href="/prensa" className="mt-10 inline-flex items-center gap-2 font-bold text-[#9E2021] underline">
            {t(isEs, '← Más artículos', '← More articles')}
          </Link>
        </div>
      </article>
    </>
  );
}

export function ContactoView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  return (
    <>
      <PageIntro eyebrow="Sumaq Kawsay" title={t(isEs, 'Contacto', 'Contact')} subtitle={t(isEs, 'Cuéntanos qué quieres vivir y te respondemos.', 'Tell us what you want to experience and we will reply.')} />
      <ContactSection lang={lang} />
    </>
  );
}

export function ReservarView() {
  const { lang } = useSitePrefs();
  const isEs = lang === 'es';
  const { openBookingWizard } = useCMS();
  // Abre el asistente de reserva al entrar a esta pagina.
  useEffect(() => {
    openBookingWizard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <PageIntro eyebrow="Sumaq Kawsay" title={t(isEs, 'Reservar', 'Book')} subtitle={t(isEs, 'Elige fecha, hospedaje, actividades y comidas en un solo recorrido.', 'Pick your date, stay, activities and meals in a single flow.')}>
      <button
        type="button"
        onClick={() => openBookingWizard()}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F6A935] px-6 py-3.5 text-base font-bold text-[#181513] hover:bg-[#D48B1E]"
      >
        <Calendar className="h-5 w-5" aria-hidden="true" />
        {t(isEs, 'Abrir el asistente de reserva', 'Open the booking assistant')}
      </button>
    </PageIntro>
  );
}
