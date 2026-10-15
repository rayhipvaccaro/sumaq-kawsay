'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Briefcase, BookOpen, HelpCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { Footer } from '@/components/Footer';
import { AdminCMSModal } from '@/components/AdminCMSModal';
import { TourDetailModal } from '@/components/TourDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { ClaimsBookModal } from '@/components/ClaimsBookModal';
import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { BookingFlowWizard } from '@/components/BookingFlowWizard';
import { OrderTrackerModal } from '@/components/OrderTrackerModal';
import { ManualModal } from '@/components/ManualModal';
import { QuickActionDock } from '@/components/QuickActionDock';
import { SystemGuideModal } from '@/components/SystemGuideModal';
import type { CustomQuoteSummary } from '@/components/TripPlanner';
import { useCMS } from '@/lib/cmsContext';
import { useSitePrefs } from '@/lib/sitePrefs';
import type { Tour } from '@/data/toursData';
import type { AncestralZone, EcotourismService } from '@/data/inkaLabData';

interface SiteActions {
  openTourDetail: (tour: Tour) => void;
  bookTour: (tour: Tour) => void;
  bookZone: (zone: AncestralZone) => void;
  bookService: (srv: EcotourismService) => void;
  bookCustom: (summary: CustomQuoteSummary) => void;
  openGeneralBooking: () => void;
  openSystemGuide: () => void;
}

const ActionsCtx = createContext<SiteActions | null>(null);

export function useSiteActions(): SiteActions {
  const v = useContext(ActionsCtx);
  if (!v) throw new Error('useSiteActions debe usarse dentro de SiteShell');
  return v;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { lang, currency } = useSitePrefs();
  const isEs = lang === 'es';
  const {
    isBusinessPortalOpen,
    closeBusinessPortal,
    openBusinessPortal,
    isBookingWizardOpen,
    closeBookingWizard,
    isOrderTrackerOpen,
    closeOrderTracker,
    activeTrackingId,
    isManualModalOpen,
    closeManualModal,
    manualActiveTab,
    openManualModal,
    openAdminModal,
  } = useCMS();

  const [selectedTourForDetail, setSelectedTourForDetail] = useState<Tour | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<Tour | null>(null);
  const [customSummaryForBooking, setCustomSummaryForBooking] = useState<CustomQuoteSummary | null>(null);
  const [isClaimsBookOpen, setIsClaimsBookOpen] = useState(false);
  const [isSystemGuideOpen, setIsSystemGuideOpen] = useState(false);

  const openBookingWith = (tour: Tour | null, summary: CustomQuoteSummary | null) => {
    setSelectedTourForBooking(tour);
    setCustomSummaryForBooking(summary);
    setIsBookingOpen(true);
  };

  const actions: SiteActions = {
    openTourDetail: (tour) => setSelectedTourForDetail(tour),
    bookTour: (tour) => openBookingWith(tour, null),
    bookZone: (zone) =>
      openBookingWith(
        {
          id: zone.id,
          slug: zone.id,
          titleEs: zone.nameEs,
          titleEn: zone.nameEn,
          subtitleEs: zone.symbolismEs,
          subtitleEn: zone.symbolismEn,
          category: 'experiencias',
          locationEs: 'Inka Lab Km 84 · Ollantaytambo',
          locationEn: 'Inka Lab Km 84 · Ollantaytambo',
          durationEs: zone.durationEs,
          durationEn: zone.durationEn,
          pricePEN: zone.pricePEN,
          priceUSD: zone.priceUSD,
          image: zone.image,
          difficultyEs: 'Moderado',
          difficultyEn: 'Moderate',
          maxAltitude: zone.altitude,
          groupSize: 'Grupos reducidos',
          descriptionEs: zone.descriptionEs,
          descriptionEn: zone.descriptionEn,
          highlightsEs: zone.highlightsEs,
          highlightsEn: zone.highlightsEn,
          itinerary: [],
          includedEs: ['Guía oficial local', 'Acceso a la zona', 'Degustación de infusión andina'],
          includedEn: ['Official local guide', 'Zone access pass', 'Andean herbal infusion'],
          notIncludedEs: ['Gastos personales'],
          notIncludedEn: ['Personal expenses'],
          whatToBringEs: ['Ropa abrigada', 'Calzado firme', 'Cámara fotográfica'],
          whatToBringEn: ['Warm layers', 'Sturdy footwear', 'Camera'],
        },
        null,
      ),
    bookService: (srv) =>
      openBookingWith(
        {
          id: srv.id,
          slug: srv.id,
          titleEs: srv.titleEs,
          titleEn: srv.titleEn,
          subtitleEs: srv.taglineEs,
          subtitleEn: srv.taglineEn,
          category: 'experiencias',
          locationEs: 'Inka Lab Km 84 · Ollantaytambo',
          locationEn: 'Inka Lab Km 84 · Ollantaytambo',
          durationEs: 'Estadía / Pase de Día',
          durationEn: 'Stay / Day Pass',
          pricePEN: srv.id === 'day-pass-inkalab' ? 390 : 380,
          priceUSD: srv.id === 'day-pass-inkalab' ? 105 : 102,
          image: srv.image,
          difficultyEs: 'Fácil',
          difficultyEn: 'Easy',
          maxAltitude: '2,792 msnm',
          groupSize: 'Servicio exclusivo',
          descriptionEs: srv.descriptionEs,
          descriptionEn: srv.descriptionEn,
          highlightsEs: srv.featuresEs,
          highlightsEn: srv.featuresEn,
          itinerary: [],
          includedEs: srv.featuresEs,
          includedEn: srv.featuresEn,
          notIncludedEs: ['Servicios adicionales no especificados'],
          notIncludedEn: ['Unspecified extra services'],
          whatToBringEs: ['Prendas cómodas de descanso'],
          whatToBringEn: ['Comfortable resort wear'],
        },
        null,
      ),
    bookCustom: (summary) => openBookingWith(null, summary),
    openGeneralBooking: () => openBookingWith(null, null),
    openSystemGuide: () => setIsSystemGuideOpen(true),
  };

  return (
    <ActionsCtx.Provider value={actions}>
      <div className="flex min-h-screen flex-col bg-[#FDFBF7] font-sans text-[#1C1917] selection:bg-[#D4AF37]/30 selection:text-[#4A2E1B]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-[#D4AF37] focus:px-5 focus:py-2.5 focus:font-extrabold focus:text-[#181513]"
        >
          {isEs ? 'Saltar al contenido principal' : 'Skip to main content'}
        </a>

        <SiteHeader />

        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <Footer
          lang={lang}
          onOpenClaimsBook={() => setIsClaimsBookOpen(true)}
          onOpenBooking={actions.openGeneralBooking}
        />

        {/* Accesos del personal, discretos, al pie del sitio */}
        <div className="border-t border-stone-800 bg-[#100E0C] px-4 py-3 text-xs text-stone-400">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-500">{isEs ? 'Personal' : 'Staff'}</span>
            <button type="button" onClick={() => openBusinessPortal('ventas')} className="flex items-center gap-1.5 hover:text-[#F6A935]">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              {isEs ? 'Portal de roles' : 'Roles portal'}
            </button>
            <button type="button" onClick={() => openAdminModal()} className="flex items-center gap-1.5 hover:text-[#F6A935]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {isEs ? 'Panel de contenido' : 'Content panel'}
            </button>
            <button type="button" onClick={() => openManualModal('usuario')} className="flex items-center gap-1.5 hover:text-[#F6A935]">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {isEs ? 'Manuales' : 'Manuals'}
            </button>
            <button type="button" onClick={actions.openSystemGuide} className="flex items-center gap-1.5 hover:text-[#F6A935]">
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {isEs ? '¿Cómo funciona?' : 'How it works'}
            </button>
            <Link href="/login" className="hover:text-[#F6A935]">
              {isEs ? 'Iniciar sesión' : 'Sign in'}
            </Link>
          </div>
        </div>

        <TourDetailModal
          tour={selectedTourForDetail}
          lang={lang}
          currency={currency}
          onClose={() => setSelectedTourForDetail(null)}
          onBookTour={actions.bookTour}
        />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          selectedTour={selectedTourForBooking}
          customSummary={customSummaryForBooking}
          lang={lang}
          currency={currency}
        />
        <ClaimsBookModal isOpen={isClaimsBookOpen} onClose={() => setIsClaimsBookOpen(false)} lang={lang} />
        <AdminCMSModal />
        <BusinessPortalModal isOpen={isBusinessPortalOpen} onClose={closeBusinessPortal} lang={lang} />
        <BookingFlowWizard isOpen={isBookingWizardOpen} onClose={closeBookingWizard} lang={lang} currency={currency} />
        <OrderTrackerModal
          isOpen={isOrderTrackerOpen}
          onClose={closeOrderTracker}
          initialCode={activeTrackingId}
          lang={lang}
        />
        <ManualModal isOpen={isManualModalOpen} onClose={closeManualModal} initialTab={manualActiveTab} />
        <QuickActionDock lang={lang} onOpenSystemGuide={actions.openSystemGuide} />
        <SystemGuideModal isOpen={isSystemGuideOpen} onClose={() => setIsSystemGuideOpen(false)} lang={lang} />
      </div>
    </ActionsCtx.Provider>
  );
}
