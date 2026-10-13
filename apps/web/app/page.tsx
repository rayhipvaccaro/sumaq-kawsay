'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { PhilosophySection } from '@/components/PhilosophySection';
import { AncestralZones } from '@/components/AncestralZones';
import { EcotourismComplex } from '@/components/EcotourismComplex';
import { TourCatalog } from '@/components/TourCatalog';
import { TripPlanner, CustomQuoteSummary } from '@/components/TripPlanner';
import { EthnobotanyLab } from '@/components/EthnobotanyLab';
import { SeasonalityGuide } from '@/components/SeasonalityGuide';
import { RouteAccess } from '@/components/RouteAccess';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { AdminCMSModal } from '@/components/AdminCMSModal';
import { Footer } from '@/components/Footer';
import { TourDetailModal } from '@/components/TourDetailModal';
import { BookingModal } from '@/components/BookingModal';
import { ClaimsBookModal } from '@/components/ClaimsBookModal';
import { UserFlowSection } from '@/components/UserFlowSection';
import { BusinessPortalModal } from '@/components/BusinessPortalModal';
import { BookingFlowWizard } from '@/components/BookingFlowWizard';
import { OrderTrackerModal } from '@/components/OrderTrackerModal';
import { ManualModal } from '@/components/ManualModal';
import { QuickActionDock } from '@/components/QuickActionDock';
import { SystemGuideModal } from '@/components/SystemGuideModal';
import { useCMS } from '@/lib/cmsContext';
import { Tour, TOURS_DATA } from '@/data/toursData';
import { AncestralZone, EcotourismService } from '@/data/inkaLabData';

export default function HomePage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [currency, setCurrency] = useState<'PEN' | 'USD'>('PEN');
  const {
    isBusinessPortalOpen,
    closeBusinessPortal,
    isBookingWizardOpen,
    closeBookingWizard,
    isOrderTrackerOpen,
    closeOrderTracker,
    activeTrackingId,
    isManualModalOpen,
    closeManualModal,
    manualActiveTab,
  } = useCMS();

  // Modals state
  const [selectedTourForDetail, setSelectedTourForDetail] = useState<Tour | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<Tour | null>(null);
  const [customSummaryForBooking, setCustomSummaryForBooking] = useState<CustomQuoteSummary | null>(null);
  const [isClaimsBookOpen, setIsClaimsBookOpen] = useState<boolean>(false);
  const [isSystemGuideOpen, setIsSystemGuideOpen] = useState<boolean>(false);

  // Toggle handlers
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'PEN' ? 'USD' : 'PEN'));
  };

  // Open booking with a specific tour
  const handleBookTour = (tour: Tour) => {
    setSelectedTourForBooking(tour);
    setCustomSummaryForBooking(null);
    setIsBookingOpen(true);
  };

  // Open booking with an Ancestral Zone
  const handleBookAncestralZone = (zone: AncestralZone) => {
    const pseudoTour: Tour = {
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
    };
    setSelectedTourForBooking(pseudoTour);
    setCustomSummaryForBooking(null);
    setIsBookingOpen(true);
  };

  // Open booking with an Ecotourism service
  const handleBookEcotourismService = (srv: EcotourismService) => {
    const pseudoTour: Tour = {
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
    };
    setSelectedTourForBooking(pseudoTour);
    setCustomSummaryForBooking(null);
    setIsBookingOpen(true);
  };

  // Open booking with custom InkaLab summary
  const handleBookCustomSummary = (summary: CustomQuoteSummary) => {
    setSelectedTourForBooking(null);
    setCustomSummaryForBooking(summary);
    setIsBookingOpen(true);
  };

  // General booking button
  const handleOpenGeneralBooking = () => {
    setSelectedTourForBooking(null);
    setCustomSummaryForBooking(null);
    setIsBookingOpen(true);
  };

  // Quick navigation helpers
  const handleExploreTours = () => {
    const el = document.getElementById('experiencias');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenPlanner = () => {
    const el = document.getElementById('cotizador');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#4A2E1B]">
      {/* Skip to Content Link for WCAG 2.4.1 compliance */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-5 focus:py-2.5 focus:bg-[#D4AF37] focus:text-[#181513] focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:ring-2 focus:ring-[#181513] transition-all"
      >
        {lang === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
      </a>

      {/* Top Bar Navigation */}
      <Navbar
        lang={lang}
        currency={currency}
        onToggleLang={handleToggleLang}
        onToggleCurrency={handleToggleCurrency}
        onOpenBooking={handleOpenGeneralBooking}
        onOpenSystemGuide={() => setIsSystemGuideOpen(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 1. Hero Section */}
        <Hero
          lang={lang}
          currency={currency}
          onExploreTours={handleExploreTours}
          onOpenPlanner={handleOpenPlanner}
          onOpenSystemGuide={() => setIsSystemGuideOpen(true)}
        />

        {/* 2. Dormir: bungalows, glamping, suite y pasadia */}
        <EcotourismComplex
          lang={lang}
          currency={currency}
          onBookService={handleBookEcotourismService}
        />

        {/* 3. Hacer: catalogo de experiencias con filtros */}
        <TourCatalog
          lang={lang}
          currency={currency}
          onSelectTour={(tour) => setSelectedTourForDetail(tour)}
          onQuickBook={handleBookTour}
        />

        {/* 4. Como reservar: flujo real de 5 pasos */}
        <UserFlowSection lang={lang} currency={currency} />

        {/* 5. Las tres zonas ancestrales de Inka Lab */}
        <AncestralZones
          lang={lang}
          currency={currency}
          onBookZone={handleBookAncestralZone}
        />

        {/* 6. Planificador con precio estimado */}
        <TripPlanner
          lang={lang}
          currency={currency}
          onBookCustom={handleBookCustomSummary}
        />

        {/* 7. Filosofia y etnobotanica (contexto cultural) */}
        <PhilosophySection lang={lang} />
        <EthnobotanyLab
          lang={lang}
          onBookEthnobotany={() => {
            const etnoTour = TOURS_DATA.find((t) => t.id === 'etnobotanica-chillca');
            if (etnoTour) {
              setSelectedTourForDetail(etnoTour);
            }
          }}
        />

        {/* 8. Cuando ir y como llegar */}
        <SeasonalityGuide lang={lang} />
        <RouteAccess lang={lang} />

        {/* 9. Opiniones y contacto */}
        <TestimonialsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>

      {/* Comprehensive Official Footer */}
      <Footer
        lang={lang}
        onOpenClaimsBook={() => setIsClaimsBookOpen(true)}
        onOpenBooking={handleOpenGeneralBooking}
      />

      {/* Full Tour Detail Modal */}
      <TourDetailModal
        tour={selectedTourForDetail}
        lang={lang}
        currency={currency}
        onClose={() => setSelectedTourForDetail(null)}
        onBookTour={handleBookTour}
      />

      {/* Interactive Booking & Inquiry Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedTour={selectedTourForBooking}
        customSummary={customSummaryForBooking}
        lang={lang}
        currency={currency}
      />

      {/* Official Peruvian Indecopi Virtual Claims Book */}
      <ClaimsBookModal
        isOpen={isClaimsBookOpen}
        onClose={() => setIsClaimsBookOpen(false)}
        lang={lang}
      />

      {/* Visual Dynamic Admin CMS Modal (PIN: sumaq2026) */}
      <AdminCMSModal />

      {/* Enterprise Multi-Role Business Portal (Ventas & Marketing, Contador, Admin, Usuario) */}
      <BusinessPortalModal
        isOpen={isBusinessPortalOpen}
        onClose={closeBusinessPortal}
        lang={lang}
      />

      {/* 5-Step All-In-One Booking Flow Wizard (Hospedaje -> Actividades -> Alimentación -> Extras -> Orden) */}
      <BookingFlowWizard
        isOpen={isBookingWizardOpen}
        onClose={closeBookingWizard}
        lang={lang}
        currency={currency}
      />

      {/* Live Order Tracker Modal for Guests & Customers */}
      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={closeOrderTracker}
        initialCode={activeTrackingId}
        lang={lang}
      />

      {/* Official User and System Operations Manuals */}
      <ManualModal
        isOpen={isManualModalOpen}
        onClose={closeManualModal}
        initialTab={manualActiveTab}
      />

      {/* Floating Smart Action Dock */}
      <QuickActionDock
        lang={lang}
        onOpenSystemGuide={() => setIsSystemGuideOpen(true)}
      />

      {/* Interactive System & User Guide Modal ("¿Cómo funciona?") */}
      <SystemGuideModal
        isOpen={isSystemGuideOpen}
        onClose={() => setIsSystemGuideOpen(false)}
        lang={lang}
      />
    </div>
  );
}
