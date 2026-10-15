'use client';

import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, BookOpen, MessageCircle, Heart, CreditCard, Lock, Briefcase, Clock, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '@/data/translations';
import { useCMS } from '@/lib/cmsContext';

interface FooterProps {
  lang: 'es' | 'en';
  onOpenClaimsBook: () => void;
  onOpenBooking: () => void;
}

export function Footer({ lang, onOpenClaimsBook, onOpenBooking }: FooterProps) {
  const t = TRANSLATIONS[lang];
  const isEs = lang === 'es';
  const { openAdminModal, openBusinessPortal, openOrderTracker, openManualModal, openBookingWizard } = useCMS();

  return (
    <footer className="bg-[#181513] text-stone-200 pt-20 pb-14 border-t-2 border-[#F6A935]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid with Large, Readable Fonts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-stone-800">
          {/* Col 1: Combined Brand Lockup & Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Sumaq Kawsay Official Logo */}
            <div className="flex flex-col gap-3">
              <div className="bg-[#FDFBF7] px-4 py-2 rounded-2xl border border-[#F6A935]/50 shadow-md inline-flex items-center shrink-0 w-fit">
                <div className="relative h-10 w-40 sm:h-12 sm:w-48 shrink-0">
                  <Image
                    src="/images/logo_sumaqkawsay.png"
                    alt="Sumaq Kawsay - Turismo Sostenible & Sabiduría Andina"
                    fill
                    className="object-contain object-left"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <span className="font-heading text-lg font-extrabold text-white block uppercase tracking-wider">
                  SUMAQ KAWSAY CUSCO
                </span>
                <span className="text-xs sm:text-sm text-[#F6A935] font-bold uppercase tracking-widest block mt-0.5">
                  Turismo Sostenible & Sabiduría Andina
                </span>
                <span className="text-xs sm:text-sm text-stone-300 block mt-1">
                  En alianza con Inka Lab Complejo Ecoturístico · Km 84 Ollantaytambo
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              {t.footer.about}
            </p>

            <div className="pt-2 text-sm sm:text-base text-stone-200 space-y-2 bg-[#221E1B] p-4 rounded-2xl border border-stone-800">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  <strong>Operador Formal:</strong> MINCETUR Cusco · Perú
                </span>
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-extrabold uppercase tracking-wider text-white border-b border-[#F6A935]/40 pb-2">
              {t.footer.links}
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone-300 font-medium">
              <li>
                <a href="/zonas" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Zonas Sagradas' : 'Sacred Zones'}</span>
                </a>
              </li>
              <li>
                <a href="/servicios" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Complejo & Spa' : 'Resort & Spa'}</span>
                </a>
              </li>
              <li>
                <a href="/experiencias" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{t.nav.experiences}</span>
                </a>
              </li>
              <li>
                <a href="/herbario" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{t.nav.etnobotany}</span>
                </a>
              </li>
              <li>
                <a href="/planificador" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{t.nav.planner}</span>
                </a>
              </li>
              <li>
                <a href="/estacionalidad" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Clima & Temporadas' : 'Climate & Seasons'}</span>
                </a>
              </li>
              <li>
                <a href="/como-llegar" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Cómo Llegar (Km 84)' : 'How to Reach (Km 84)'}</span>
                </a>
              </li>
              <li>
                <a href="/galeria" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Galería' : 'Gallery'}</span>
                </a>
              </li>
              <li>
                <a href="/prensa" className="hover:text-[#F6A935] transition-colors flex items-center gap-2">
                  <span className="text-[#F6A935]">•</span>
                  <span>{isEs ? 'Prensa' : 'Press'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact & Phones (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-extrabold uppercase tracking-wider text-white border-b border-[#F6A935]/40 pb-2">
              {isEs ? 'Sedes & Contacto' : 'Locations & Contact'}
            </h3>
            <ul className="space-y-3.5 text-sm sm:text-base text-stone-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F6A935] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong className="text-white">Inka Lab Complejo:</strong> Km 84, Ollantaytambo<br />
                  <strong className="text-white">Sumaq Kawsay:</strong> Pampa del Castillo 455, Cusco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex flex-col text-sm sm:text-base font-mono">
                  <a href="https://wa.me/51930924560" target="_blank" rel="noopener noreferrer" className="hover:text-white font-bold text-white">
                    +51 930 924 560 <span className="text-xs text-[#FDE8B5] font-sans font-semibold">(Inka Lab)</span>
                  </a>
                  <a href="https://wa.me/51912189856" target="_blank" rel="noopener noreferrer" className="hover:text-white font-bold text-white mt-0.5">
                    +51 912 189 856 <span className="text-xs text-[#FDE8B5] font-sans font-semibold">(Sumaq Kawsay)</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F6A935] shrink-0" />
                <a href="mailto:info@sumaqkawsay.com" className="hover:text-white font-medium text-sm sm:text-base">
                  info@sumaqkawsay.com
                </a>
              </li>
              <li className="pt-3">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-3.5 px-4 text-sm sm:text-base font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl transition-all shadow-md border border-[#FDE8B5]"
                >
                  {isEs ? 'Planificar Mi Viaje' : 'Plan My Trip'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Legal (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading text-sm sm:text-base font-extrabold uppercase tracking-wider text-white border-b border-[#F6A935]/40 pb-2">
              {t.footer.paymentMethods}
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              {t.footer.cardsAccepted}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 rounded-lg bg-[#221E1B] border border-[#F6A935]/40 text-[#FDE8B5] font-mono text-xs sm:text-sm font-bold">
                VISA
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#221E1B] border border-[#F6A935]/40 text-[#FDE8B5] font-mono text-xs sm:text-sm font-bold">
                MASTERCARD
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#221E1B] border border-[#F6A935]/40 text-[#FDE8B5] font-mono text-xs sm:text-sm font-bold">
                TRANSFERENCIA
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#221E1B] border border-[#F6A935]/40 text-[#FDE8B5] font-mono text-xs sm:text-sm font-bold">
                YAPE / PLIN
              </span>
            </div>

            {/* Official Indecopi Claims Book Trigger & Business Portals */}
            <div className="pt-4 space-y-2">
              <button
                onClick={() => openBusinessPortal('ventas')}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-400 text-blue-200 text-xs font-bold transition-all shadow-md"
              >
                <Briefcase className="w-4 h-4 text-blue-300" />
                <span>Portal Roles (Ventas · Contador · Admin)</span>
              </button>

              <button
                onClick={() => openManualModal('usuario')}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#221E1B] hover:bg-[#2C2623] border border-stone-700 text-stone-200 text-xs font-bold transition-all shadow-md"
              >
                <BookOpen className="w-4 h-4 text-[#F6A935]" />
                <span>Manual de Uso de la Web & Sistema</span>
              </button>

              <button
                onClick={onOpenClaimsBook}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#221E1B] hover:bg-[#2C2623] border border-[#F6A935]/50 text-[#FDE8B5] text-xs font-bold transition-all shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-[#F6A935]" />
                <span>{t.footer.claimsBook}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <div>
            © 2026 Sumaq Kawsay Expeditions & Inka Lab · {t.footer.rights}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <span>Políticas de Privacidad</span>
            <span>·</span>
            <span>Términos y Condiciones</span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-stone-300 font-semibold">
              Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> en Ollantaytambo y Cusco, Perú
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
