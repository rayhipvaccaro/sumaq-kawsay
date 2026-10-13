'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, Globe, DollarSign, ZoomIn, ZoomOut, Compass, ShieldCheck, Briefcase, Clock, BookOpen, Calendar, HelpCircle } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';

interface NavbarProps {
  lang: 'es' | 'en';
  currency: 'PEN' | 'USD';
  onToggleLang: () => void;
  onToggleCurrency: () => void;
  onOpenBooking: () => void;
  onOpenSystemGuide?: () => void;
}

export function Navbar({
  lang,
  currency,
  onToggleLang,
  onToggleCurrency,
  onOpenBooking,
  onOpenSystemGuide,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const {
    openAdminModal,
    openBusinessPortal,
    openBookingWizard,
    openOrderTracker,
    openManualModal,
  } = useCMS();
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFontSize = () => {
    setIsLargeText((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('text-lg-mode');
      } else {
        document.documentElement.classList.remove('text-lg-mode');
      }
      return next;
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Signature Andean Ribbon from Inka Lab */}
      <div className="andean-border-top w-full" />

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#181513]/95 backdrop-blur-md shadow-xl border-b border-[#F6A935]/40 py-2 sm:py-2.5'
            : 'bg-gradient-to-b from-[#181513]/90 via-[#181513]/70 to-transparent py-2.5 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 lg:gap-6 flex-nowrap">
            {/* Zone 1: Main Brand - Sumaq Kawsay Official Logo */}
            <a
              href="#"
              className="flex items-center gap-3 shrink-0 group focus:outline-hidden"
              title="Sumaq Kawsay · Turismo Sostenible & Sabiduría Andina en Cusco"
            >
              {/* Sumaq Kawsay Official Primary Logo */}
              <div className="bg-[#FDFBF7] px-3 sm:px-4 py-1.5 rounded-2xl border border-[#F6A935]/50 shadow-md flex items-center shrink-0">
                <div className="relative h-8 w-32 sm:h-9 sm:w-40 md:w-44 shrink-0">
                  <Image
                    src="/images/logo_sumaqkawsay.png"
                    alt="Sumaq Kawsay Logo Oficial"
                    fill
                    priority
                    className="object-contain object-left group-hover:scale-[1.02] transition-transform duration-200"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Discreet subtitle badge on wide screens only */}
              <div className="hidden 2xl:flex flex-col border-l border-[#F6A935]/40 pl-3">
                <span className="text-xs tracking-widest text-[#F6A935] font-bold uppercase leading-tight">
                  CUSCO · TURISMO SOSTENIBLE
                </span>
                <span className="text-xs tracking-wider text-stone-200 uppercase leading-tight mt-0.5">
                  INKA LAB KM 84
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links (Refined, guaranteed non-colliding typography) */}
            <nav
              aria-label={isEs ? 'Navegación principal' : 'Main navigation'}
              className="hidden xl:flex items-center gap-5 text-sm font-semibold text-stone-100 shrink-0 flex-nowrap"
            >
              <a
                href="#experiencias"
                className="hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap"
              >
                {t.nav.experiences}
              </a>
              <a
                href="#complejo"
                className="hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap"
              >
                {isEs ? 'Inka Lab & Spa' : 'Inka Lab & Spa'}
              </a>
              <a
                href="#zonas-ancestrales"
                className="hidden 2xl:inline hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap"
              >
                {isEs ? 'Zonas Sagradas' : 'Sacred Zones'}
              </a>
              <a
                href="#herbario"
                className="hidden 2xl:inline hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap"
              >
                {t.nav.etnobotany}
              </a>
              <a
                href="#cotizador"
                className="hidden 2xl:inline hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap"
              >
                {t.nav.planner}
              </a>
              <a
                href="#contacto"
                className="hover:text-[#F6A935] transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#F6A935] decoration-2 whitespace-nowrap text-[#FDE8B5] font-bold"
              >
                {isEs ? 'Contacto' : 'Contact'}
              </a>
            </nav>

            {/* Zone 3: Portal Negocio + Rastrear + Reserva Integral + Moneda/Idioma */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap">

              {/* Rastrear Reserva */}
              <button
                onClick={() => openOrderTracker()}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-xl border border-stone-700 bg-[#221E1B] text-stone-300 hover:text-white hover:border-stone-500 transition-colors shrink-0"
                title="Rastrear Reserva con Código SQ-XXXX"
              >
                <Clock className="w-3.5 h-3.5 text-[#F6A935]" />
                <span className="hidden xl:inline">Rastrear</span>
              </button>



              {/* Currency selector */}
              <button
                onClick={onToggleCurrency}
                aria-label={isEs ? `Cambiar moneda (actual: ${currency})` : `Toggle currency (current: ${currency})`}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs font-bold rounded-xl border border-stone-700 bg-[#221E1B] text-white hover:bg-[#F6A935] hover:text-[#181513] transition-colors shadow-sm shrink-0"
                title="Alternar entre Soles (PEN) y Dólares (USD)"
              >
                <DollarSign className="w-3.5 h-3.5 text-[#F6A935] shrink-0" />
                <span className="tabular-nums font-mono">{currency}</span>
              </button>

              {/* Language toggle */}
              <button
                onClick={onToggleLang}
                aria-label={isEs ? 'Cambiar a idioma inglés (English)' : 'Switch to Spanish language (Español)'}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs font-bold rounded-xl border border-stone-700 bg-[#221E1B] text-white hover:bg-[#F6A935] hover:text-[#181513] transition-colors shadow-sm shrink-0"
                title="Switch language (ES / EN)"
              >
                <Globe className="w-3.5 h-3.5 text-[#F6A935] shrink-0" />
                <span className="uppercase text-xs">{lang}</span>
              </button>

              {/* Primary Booking CTA: Flujo de Reserva Integral (Hospedaje -> Actividades -> Comida) */}
              <button
                onClick={() => openBookingWizard()}
                aria-label={isEs ? 'Iniciar flujo de reserva integral paso a paso' : 'Start all-in-one booking wizard'}
                className="hidden md:inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] active:bg-[#99771A] rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 whitespace-nowrap border border-[#FDE8B5]/40 shrink-0 min-h-[40px]"
              >
                <Calendar className="w-4 h-4 text-[#181513]" />
                <span>{isEs ? 'Reservar Experiencia' : 'Book Experience'}</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className="2xl:hidden p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 focus:outline-hidden shrink-0"
                aria-label={mobileMenuOpen ? (isEs ? 'Cerrar menú principal' : 'Close main menu') : (isEs ? 'Abrir menú principal' : 'Open main menu')}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-[#F6A935]" /> : <Menu className="w-6 h-6 text-[#F6A935]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer with full responsive layout */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="region"
          aria-label={isEs ? 'Menú de navegación móvil' : 'Mobile navigation menu'}
          className="2xl:hidden bg-[#181513] border-b-2 border-[#F6A935] px-5 sm:px-8 py-6 shadow-2xl text-white max-h-[85vh] overflow-y-auto"
        >
          {/* Mobile Sumaq Kawsay Brand Header */}
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-stone-800">
            <div className="bg-[#FDFBF7] px-3 py-1.5 rounded-xl border border-[#F6A935]/40 shadow-sm flex items-center">
              <div className="relative h-8 w-32">
                <Image
                  src="/images/logo_sumaqkawsay.png"
                  alt="Sumaq Kawsay Logo"
                  fill
                  className="object-contain object-left"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-xs font-bold text-[#F6A935] bg-[#2B231D] px-3 py-1.5 rounded-lg border border-[#F6A935]/40 uppercase tracking-wider">
              Cusco · Perú
            </span>
          </div>

          <nav className="flex flex-col gap-3 text-base sm:text-lg font-semibold">
            <a
              href="#zonas-ancestrales"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{isEs ? 'Zonas Sagradas (Hanan Pacha, Willka Unu, Inti Punku)' : 'Sacred Zones'}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#complejo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{isEs ? 'Complejo Turístico & Sauna Inca' : 'Resort & Inca Sauna'}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#experiencias"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{t.nav.experiences}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#herbario"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{t.nav.etnobotany}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#cotizador"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{t.nav.planner}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#estacionalidad"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{isEs ? 'Guía de Clima & Temporadas' : 'Climate & Seasons'}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#como-llegar"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between"
            >
              <span>{isEs ? 'Cómo Llegar (Km 84 Ollantaytambo)' : 'How to Reach (Km 84)'}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-stone-800 hover:text-[#F6A935] flex items-center justify-between text-[#FDE8B5]"
            >
              <span>{isEs ? 'Formulario de Contacto' : 'Contact Form'}</span>
              <span className="text-[#F6A935]">❖</span>
            </a>

            {/* Mobile Action Controls */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingWizard();
                }}
                className="w-full py-3.5 sm:py-4 text-center text-base sm:text-lg font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl shadow-lg border border-[#FDE8B5] flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Calendar className="w-5 h-5 text-[#181513]" />
                <span>{isEs ? 'Reservar Experiencia' : 'Book Experience'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBusinessPortal('ventas');
                }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span>Portal Roles (Ventas, Contador, Admin)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openOrderTracker();
                  }}
                  className="py-2.5 text-center text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-1.5 border border-stone-700"
                >
                  <Clock className="w-3.5 h-3.5 text-[#F6A935]" />
                  <span>Rastrear Reserva</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openManualModal('usuario');
                  }}
                  className="py-2.5 text-center text-xs font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 rounded-xl flex items-center justify-center gap-1.5 border border-stone-700"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#F6A935]" />
                  <span>Manuales</span>
                </button>
              </div>

              {onOpenSystemGuide && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSystemGuide();
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/80 rounded-xl flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>¿Cómo Funciona la Web? (Guía Rápida)</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAdminModal();
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-300 bg-[#221E1B] hover:bg-stone-800 rounded-xl flex items-center justify-center gap-2 border border-stone-800"
              >
                <ShieldCheck className="w-4 h-4 text-[#F6A935]" />
                <span>Panel CMS Visual</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
