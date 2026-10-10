'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Briefcase,
  BookOpen,
  MessageCircle,
  ArrowUp,
  HelpCircle,
  X,
  Compass,
  ChevronUp,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface QuickActionDockProps {
  lang: 'es' | 'en';
  onOpenSystemGuide: () => void;
}

export function QuickActionDock({ lang, onOpenSystemGuide }: QuickActionDockProps) {
  const isEs = lang === 'es';
  const { openBookingWizard, openOrderTracker, openBusinessPortal, openManualModal } = useCMS();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      isEs
        ? '¡Hola Sumaq Kawsay & Inka Lab! Deseo consultar disponibilidad para una experiencia y estadía en Ollantaytambo Km 84.'
        : 'Hello Sumaq Kawsay & Inka Lab! I would like to check availability for an experience and stay at Ollantaytambo Km 84.'
    );
    window.open(`https://wa.me/51912189856?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  if (isMinimized) {
    return (
      <aside aria-label={isEs ? 'Acceso rápido minimizado' : 'Minimized quick access'} className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#181513] text-[#F6A935] border-2 border-[#F6A935] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm font-bold tracking-wide"
          title={isEs ? 'Abrir barra de accesos rápidos' : 'Open quick action dock'}
        >
          <Compass className="w-4 h-4 text-[#F6A935]" />
          <span>{isEs ? 'Accesos Rápidos' : 'Quick Actions'}</span>
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Drawer (Expanded tools when user taps 'Más opciones' on mobile) */}
      {isMobileExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-4 pb-20 animate-fade-in"
          onClick={() => setIsMobileExpanded(false)}
        >
          <div
            className="bg-[#181513] border-2 border-[#F6A935] rounded-3xl p-5 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="text-xs uppercase tracking-widest font-bold text-[#F6A935]">
                {isEs ? 'Servicios & Herramientas' : 'Services & Tools'}
              </span>
              <button
                onClick={() => setIsMobileExpanded(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  setIsMobileExpanded(false);
                  openOrderTracker();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#221E1B] border border-stone-700 text-stone-200 text-xs sm:text-sm font-semibold hover:border-[#F6A935]"
              >
                <Clock className="w-4 h-4 text-[#F6A935] shrink-0" />
                <span>{isEs ? 'Rastrear Reserva' : 'Track Booking'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileExpanded(false);
                  openBusinessPortal('ventas');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#221E1B] border border-stone-700 text-stone-200 text-xs sm:text-sm font-semibold hover:border-blue-400"
              >
                <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{isEs ? 'Portal Roles' : 'Roles Portal'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileExpanded(false);
                  onOpenSystemGuide();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#221E1B] border border-stone-700 text-stone-200 text-xs sm:text-sm font-semibold hover:border-emerald-400"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isEs ? '¿Cómo Funciona?' : 'How it Works'}</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileExpanded(false);
                  openManualModal('usuario');
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[#221E1B] border border-stone-700 text-stone-200 text-xs sm:text-sm font-semibold hover:border-amber-400"
              >
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isEs ? 'Manuales' : 'Manuals'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Smart Action Dock */}
      <aside
        aria-label={isEs ? 'Barra de acciones y reservas' : 'Actions and booking bar'}
        className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl transition-all duration-300"
      >
        <div className="bg-[#181513]/95 backdrop-blur-xl border border-[#F6A935]/80 rounded-2xl sm:rounded-full px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2 text-white">
          
          {/* Brand mark on tablet/desktop */}
          <div className="hidden md:flex items-center gap-2 pl-2 shrink-0">
            <span className="text-xs uppercase tracking-wider text-[#F6A935] font-bold">
              Sumaq Kawsay
            </span>
          </div>

          {/* Core Action Suite */}
          <div className="flex items-center gap-2 flex-1 justify-between sm:justify-center">
            {/* Primary Booking Wizard CTA */}
            <button
              onClick={openBookingWizard}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-full bg-[#F6A935] hover:bg-[#9E2021] hover:text-white active:bg-[#7D1718] text-[#442A19] font-bold text-xs sm:text-sm shadow-md transition-all whitespace-nowrap min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-[#181513] shrink-0" />
              <span>{isEs ? 'Reservar Estadía' : 'Book Experience'}</span>
            </button>

            {/* Desktop Quick Actions */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => openOrderTracker()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 hover:border-[#F6A935]/60 text-stone-200 hover:text-white text-xs font-semibold transition-all whitespace-nowrap min-h-[40px]"
                title={isEs ? 'Rastrear reserva con código SQ-XXXX' : 'Track booking with SQ-XXXX code'}
              >
                <Clock className="w-3.5 h-3.5 text-[#F6A935]" />
                <span>{isEs ? 'Rastrear' : 'Track'}</span>
              </button>

              <button
                onClick={() => openBusinessPortal('ventas')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 hover:border-blue-400/60 text-stone-200 hover:text-white text-xs font-semibold transition-all whitespace-nowrap min-h-[40px]"
                title={isEs ? 'Portal de Gestión: Ventas, Contador, Admin' : 'Business Roles Portal'}
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>{isEs ? 'Portal Roles' : 'Roles'}</span>
              </button>

              <button
                onClick={onOpenSystemGuide}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 hover:border-emerald-500/60 text-stone-200 hover:text-white text-xs font-semibold transition-all whitespace-nowrap min-h-[40px]"
                title={isEs ? 'Guía Rápida: ¿Cómo funciona la página?' : 'Quick Guide: How it works'}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEs ? '¿Cómo funciona?' : 'Guide'}</span>
              </button>

              <button
                onClick={() => openManualModal('usuario')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 hover:border-amber-400/60 text-stone-200 hover:text-white text-xs font-semibold transition-all whitespace-nowrap min-h-[40px]"
                title={isEs ? 'Manual de Usuario y Sistema' : 'User and System Manuals'}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEs ? 'Manuales' : 'Manuals'}</span>
              </button>
            </div>

            {/* Mobile "Más Opciones" button */}
            <button
              onClick={() => setIsMobileExpanded(!isMobileExpanded)}
              className="sm:hidden flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#221E1B] border border-stone-700 text-stone-200 text-xs font-bold min-h-[44px]"
              aria-label={isEs ? 'Más opciones de gestión' : 'More options'}
            >
              <span>{isEs ? 'Opciones' : 'Options'}</span>
              <ChevronUp className="w-3.5 h-3.5 text-[#F6A935]" />
            </button>
          </div>

          {/* Right: WhatsApp + Minimize/Scroll */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleWhatsAppContact}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all whitespace-nowrap min-h-[44px]"
              title={isEs ? 'Contactar con Asesor por WhatsApp Oficial' : 'Chat with official concierge on WhatsApp'}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xs:inline">WhatsApp</span>
            </button>

            {showScrollTop ? (
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-[#F6A935] hover:text-white transition-all border border-stone-700 shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
                title={isEs ? 'Subir al inicio' : 'Scroll to top'}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsMinimized(true)}
                className="hidden sm:flex p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
                title={isEs ? 'Minimizar barra' : 'Minimize dock'}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}
