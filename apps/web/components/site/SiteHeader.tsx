'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ChevronDown, Clock, DollarSign, Menu, User, X } from 'lucide-react';
import { homeFor, isStaff } from '@/lib/permissions';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';
import { DEFAULT_RATES, POPULAR_CURRENCIES, currencyName } from '@/data/currencies';

interface Item {
  href: string;
  es: string;
  en: string;
}
interface Group {
  key: string;
  es: string;
  en: string;
  items: Item[];
}

export const MENU: Group[] = [
  {
    key: 'nosotros',
    es: 'Nosotros',
    en: 'About',
    items: [
      { href: '/nosotros', es: 'Sobre nosotros', en: 'About us' },
      { href: '/estacionalidad', es: 'Clima y temporadas', en: 'Climate & seasons' },
    ],
  },
  {
    key: 'experiencias',
    es: 'Experiencias',
    en: 'Experiences',
    items: [
      { href: '/zonas', es: 'Zonas sagradas', en: 'Sacred zones' },
      { href: '/experiencias', es: 'Tours y actividades', en: 'Tours & activities' },
      { href: '/herbario', es: 'Herbario vivo', en: 'Living herbarium' },
      { href: '/planificador', es: 'Planificador de viaje', en: 'Trip planner' },
    ],
  },
  {
    key: 'info',
    es: 'Información',
    en: 'Information',
    items: [
      { href: '/servicios', es: 'Servicios y tarifas', en: 'Services & rates' },
      { href: '/como-llegar', es: 'Cómo llegar', en: 'How to get here' },
      { href: '/audioguias', es: 'QR y audioguías', en: 'QR & audio guides' },
      { href: '/galeria', es: 'Galería', en: 'Gallery' },
      { href: '/prensa', es: 'Prensa', en: 'Press' },
    ],
  },
];

const noopSubscribe = () => () => {};

const ALL_CURRENCIES = Object.keys(DEFAULT_RATES).sort();
const OTHER_CURRENCIES = ALL_CURRENCIES.filter((c) => !POPULAR_CURRENCIES.includes(c));

export function SiteHeader() {
  const { lang, setLang, currency, setCurrency } = useSitePrefs();
  const { openBookingWizard, openOrderTracker, sessionUser } = useCMS();
  const isEs = lang === 'es';
  // Cuenta: sin sesion -> Ingresar; turista/agencia -> Mis reservas; personal -> Panel.
  const acct = sessionUser && !sessionUser.mustChangePassword ? sessionUser : null;
  const acctStaff = Boolean(acct && (acct.isAdmin || isStaff(acct)));
  const acctHref = acct ? (acctStaff ? homeFor(acct) : '/mis-reservas') : '/ingresar';
  const acctLabel = acct
    ? acctStaff
      ? isEs ? 'Panel' : 'Panel'
      : acct.role === 'Agencia'
        ? isEs ? 'Mis ventas' : 'My sales'
        : isEs ? 'Mis reservas' : 'My bookings'
    : isEs ? 'Ingresar' : 'Sign in';
  const pathname = usePathname() ?? '/';

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const hoverOpened = useRef<string | null>(null);
  // Los nombres de moneda los escribe distinto el servidor y el navegador: se muestran despues de cargar.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menus al cambiar de pagina, con Escape o al hacer clic fuera.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpenMenu(null);
    setDrawer(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setDrawer(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const groupActive = (g: Group) => g.items.some((i) => isActive(i.href));
  const linkCls = (active: boolean) =>
    `whitespace-nowrap py-1 text-sm font-semibold transition-colors hover:text-[#F6A935] ${
      active ? 'text-[#F6A935]' : 'text-stone-100'
    }`;

  const currencySelect = (
    <label className="relative flex items-center gap-1 rounded-xl border border-stone-700 bg-[#221E1B] px-2 py-2 text-xs font-bold text-white focus-within:border-[#F6A935]">
      <DollarSign className="h-3.5 w-3.5 shrink-0 text-[#F6A935]" aria-hidden="true" />
      <span className="font-mono text-xs" aria-hidden="true">
        {currency}
      </span>
      <ChevronDown className="h-3 w-3 text-stone-400" aria-hidden="true" />
      <select
        aria-label={isEs ? 'Moneda' : 'Currency'}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <optgroup label={isEs ? 'Más usadas' : 'Popular'}>
          {POPULAR_CURRENCIES.map((c) => (
            <option key={c} value={c} className="bg-[#181513] text-white">
              {mounted ? `${c} · ${currencyName(c, lang)}` : c}
            </option>
          ))}
        </optgroup>
        <optgroup label={isEs ? 'Otras monedas' : 'Other currencies'}>
          {OTHER_CURRENCIES.map((c) => (
            <option key={c} value={c} className="bg-[#181513] text-white">
              {mounted ? `${c} · ${currencyName(c, lang)}` : c}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );

  const langToggle = (
    <div
      role="group"
      aria-label={isEs ? 'Idioma' : 'Language'}
      className="flex overflow-hidden rounded-xl border border-stone-700 bg-[#221E1B] text-xs font-bold"
    >
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-2 uppercase transition-colors ${
            lang === l ? 'bg-[#F6A935] text-[#181513]' : 'text-stone-200 hover:text-[#F6A935]'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="andean-border-top w-full" />
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#F6A935]/40 bg-[#181513]/95 py-1.5 shadow-xl backdrop-blur-md'
            : 'bg-gradient-to-b from-[#181513]/90 via-[#181513]/70 to-transparent py-2.5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link
              href="/"
              className="flex shrink-0 items-center rounded-2xl border border-[#F6A935]/50 bg-[#FDFBF7] px-3 py-1.5 shadow-md sm:px-4"
              aria-label="Sumaq Kawsay · Inicio"
            >
              <div className="relative h-8 w-32 sm:h-9 sm:w-40">
                <Image
                  src="/images/logo_sumaqkawsay.png"
                  alt="Sumaq Kawsay"
                  fill
                  priority
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <nav
              ref={navRef}
              aria-label={isEs ? 'Navegación principal' : 'Main navigation'}
              className="hidden items-center gap-6 xl:flex"
            >
              <Link href="/" className={linkCls(pathname === '/')}>
                {isEs ? 'Inicio' : 'Home'}
              </Link>
              {MENU.map((g) => (
                <div
                  key={g.key}
                  className="relative"
                  onMouseEnter={() => {
                    hoverOpened.current = g.key;
                    setOpenMenu(g.key);
                  }}
                  onMouseLeave={() => {
                    hoverOpened.current = null;
                    setOpenMenu((m) => (m === g.key ? null : m));
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === g.key}
                    aria-haspopup="true"
                    onClick={() => {
                      // Si el menu ya se abrio con el mouse, el clic lo deja abierto en vez de cerrarlo.
                      if (hoverOpened.current === g.key) {
                        hoverOpened.current = null;
                        setOpenMenu(g.key);
                      } else {
                        setOpenMenu((m) => (m === g.key ? null : g.key));
                      }
                    }}
                    className={`flex items-center gap-1 ${linkCls(groupActive(g))}`}
                  >
                    {isEs ? g.es : g.en}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openMenu === g.key ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {openMenu === g.key && (
                    <div className="absolute left-0 top-full z-10 w-60 pt-2">
                      <ul className="overflow-hidden rounded-xl border border-[#F6A935]/40 bg-[#181513] py-2 shadow-2xl">
                        {g.items.map((i) => (
                          <li key={i.href}>
                            <Link
                              href={i.href}
                              className={`block px-4 py-2.5 text-sm font-semibold hover:bg-[#2B231D] hover:text-[#F6A935] ${
                                isActive(i.href) ? 'text-[#F6A935]' : 'text-stone-100'
                              }`}
                            >
                              {isEs ? i.es : i.en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              <Link href="/contacto" className={linkCls(isActive('/contacto'))}>
                {isEs ? 'Contacto' : 'Contact'}
              </Link>
            </nav>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Link
                href={acctHref}
                className="hidden items-center gap-1.5 rounded-xl border border-stone-700 bg-[#221E1B] px-2.5 py-2 text-xs font-bold text-stone-200 hover:text-[#F6A935] md:flex"
              >
                <User className="h-3.5 w-3.5 text-[#F6A935]" aria-hidden="true" />
                <span>{acctLabel}</span>
              </Link>
              <button
                type="button"
                onClick={() => openOrderTracker()}
                className="hidden items-center gap-1 rounded-xl border border-stone-700 bg-[#221E1B] px-2.5 py-2 text-xs font-bold text-stone-200 hover:text-[#F6A935] lg:flex"
              >
                <Clock className="h-3.5 w-3.5 text-[#F6A935]" aria-hidden="true" />
                <span className="hidden 2xl:inline">{isEs ? 'Rastrear' : 'Track'}</span>
              </button>
              {currencySelect}
              {langToggle}
              <button
                type="button"
                onClick={() => openBookingWizard()}
                className="hidden items-center gap-1.5 rounded-xl bg-[#F6A935] px-4 py-2 text-sm font-bold text-[#181513] shadow-md hover:bg-[#D48B1E] md:inline-flex"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {isEs ? 'Reservar' : 'Book'}
              </button>
              <button
                type="button"
                onClick={() => setDrawer((v) => !v)}
                aria-expanded={drawer}
                aria-controls="site-drawer"
                aria-label={drawer ? (isEs ? 'Cerrar menú' : 'Close menu') : isEs ? 'Abrir menú' : 'Open menu'}
                className="rounded-lg p-2 text-[#F6A935] hover:bg-white/10 xl:hidden"
              >
                {drawer ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {drawer && (
        <div
          id="site-drawer"
          className="max-h-[82vh] overflow-y-auto border-b-2 border-[#F6A935] bg-[#181513] px-5 py-5 text-white shadow-2xl xl:hidden"
        >
          <nav aria-label={isEs ? 'Menú móvil' : 'Mobile menu'} className="flex flex-col text-base font-semibold">
            <Link href="/" className="border-b border-stone-800 py-3 hover:text-[#F6A935]">
              {isEs ? 'Inicio' : 'Home'}
            </Link>
            {MENU.map((g) => (
              <div key={g.key} className="border-b border-stone-800">
                <button
                  type="button"
                  onClick={() => setDrawerGroup((k) => (k === g.key ? null : g.key))}
                  aria-expanded={drawerGroup === g.key}
                  className="flex w-full items-center justify-between py-3 text-left hover:text-[#F6A935]"
                >
                  {isEs ? g.es : g.en}
                  <ChevronDown
                    className={`h-4 w-4 text-[#F6A935] transition-transform ${drawerGroup === g.key ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {drawerGroup === g.key && (
                  <ul className="pb-2 pl-3">
                    {g.items.map((i) => (
                      <li key={i.href}>
                        <Link
                          href={i.href}
                          className={`block py-2.5 text-sm hover:text-[#F6A935] ${
                            isActive(i.href) ? 'text-[#F6A935]' : 'text-stone-200'
                          }`}
                        >
                          {isEs ? i.es : i.en}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link href="/contacto" className="border-b border-stone-800 py-3 hover:text-[#F6A935]">
              {isEs ? 'Contacto' : 'Contact'}
            </Link>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Link
                href={acctHref}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 py-3 text-sm font-bold text-stone-100"
              >
                <User className="h-4 w-4 text-[#F6A935]" aria-hidden="true" />
                {acctLabel}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  openBookingWizard();
                }}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#F6A935] py-3.5 text-base font-bold text-[#181513]"
              >
                <Calendar className="h-5 w-5" aria-hidden="true" />
                {isEs ? 'Reservar experiencia' : 'Book an experience'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  openOrderTracker();
                }}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 py-3 text-sm font-bold text-stone-100"
              >
                <Clock className="h-4 w-4 text-[#F6A935]" aria-hidden="true" />
                {isEs ? 'Rastrear mi reserva' : 'Track my booking'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
