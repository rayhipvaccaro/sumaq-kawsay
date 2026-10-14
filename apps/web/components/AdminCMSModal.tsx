'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  Eye,
  MessageSquare,
  Compass,
  FileText,
  Star,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Download,
  Upload,
  Database,
  Key,
  Sliders,
  Filter,
  Check,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { Tour } from '@/data/toursData';
import { Sponsor, TestimonialItem, ContactLead, CMSData } from '@/data/defaultCmsData';

const AVAILABLE_IMAGES = [
  { label: 'Etnobotánica & Hierbas', url: '/images/tour_etnobotanica_herbs_1791233038018.jpg' },
  { label: 'Cabalgata Caballos de Paso', url: '/images/cabalgata_caballos_paso_1791233048725.jpg' },
  { label: 'Camino Inca Sostenible', url: '/images/camino_inca_hikers_1791233058867.jpg' },
  { label: 'Comunidad de Tejedoras', url: '/images/comunidad_tejedoras_cusco_1791233068174.jpg' },
  { label: 'Hanan Pacha Astronomía', url: '/images/hanan_pacha_night_sky_1791233581943.jpg' },
  { label: 'Sauna Inca Willka Unu', url: '/images/willka_unu_inca_sauna_1791233592210.jpg' },
  { label: 'Bungalow Ecoturístico', url: '/images/bungalow_ecoturistico_1791233601485.jpg' },
  { label: 'Hero Valle Sagrado', url: '/images/hero_valle_sagrado_andes_1791233029285.jpg' },
  { label: 'Laguna Nevada Inka Lab', url: '/images/inkalab/laguna-nevada.png' },
  { label: 'Astronomía Andina Inka Lab', url: '/images/inkalab/astronomia.jpeg' },
];

export type CmsTab = 'tours' | 'content' | 'testimonials' | 'contacts' | 'settings';

export function AdminCMSModal({ embedded = false, initialTab }: { embedded?: boolean; initialTab?: CmsTab } = {}) {
  const {
    tours,
    generalContent,
    testimonials,
    contacts,
    cmsRawData,
    isAdminModalOpen,
    isAdminAuthenticated,
    closeAdminModal,
    logoutAdmin,
    importFullBackup,
    addTour,
    updateTour,
    deleteTour,
    updateGeneralContent,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateContactStatus,
    deleteContact,
    resetToDefaults,
  } = useCMS();

  // Navigation tab inside admin
  const [activeTab, setActiveTab] = useState<CmsTab>(initialTab ?? 'tours');
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [searchTour, setSearchTour] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Security brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Contacts filtering & search
  const [searchContact, setSearchContact] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState<'todos' | 'nuevo' | 'contactado' | 'en_proceso'>('todos');

  // Change PIN state
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');

  // Tour edit/add state
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tourForm, setTourForm] = useState<Partial<Tour>>({});

  // General content state
  const [contentForm, setContentForm] = useState(generalContent);
  const [prevGeneralContent, setPrevGeneralContent] = useState(generalContent);
  if (generalContent !== prevGeneralContent) {
    setPrevGeneralContent(generalContent);
    setContentForm(generalContent);
  }
  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorRole, setNewSponsorRole] = useState('');
  const [newSponsorBadge, setNewSponsorBadge] = useState('');

  // Testimonial edit/add state
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem>>({
    rating: 5,
    tagEs: 'Viajero Verificado',
  });

  // Countdown timer for security lockout
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => setLockoutSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Direct File Upload for Tour Photography
  const handleFileUploadForTour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setTourForm((prev) => ({ ...prev, image: result }));
        showNotification('Fotografía del tour cargada con éxito.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Direct File Upload for Hero Photography
  const handleFileUploadForHero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setContentForm((prev) => ({ ...prev, heroImage: result }));
        showNotification('Fotografía principal del Hero cargada. Haz clic en Guardar para aplicar.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };


  // CSV Export for Leads
  const handleExportCSV = () => {
    if (contacts.length === 0) {
      showNotification('No hay contactos para exportar.');
      return;
    }
    const headers = ['ID', 'Fecha', 'Nombre', 'Email', 'Telefono', 'Interes', 'Fecha_Viaje', 'Estado', 'Mensaje'];
    const rows = contacts.map((c) => [
      `"${c.id}"`,
      `"${c.createdAt}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.tourInterest || '').replace(/"/g, '""')}"`,
      `"${(c.travelDate || '').replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sumaq_kawsay_leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Base de contactos exportada a CSV exitosamente.');
  };

  // Full JSON Backup Export
  const handleExportJSON = () => {
    const jsonString = JSON.stringify(cmsRawData || { tours, generalContent, testimonials, contacts }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sumaq_kawsay_cms_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Copia de seguridad del sistema descargada.');
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.tours && parsed.generalContent) {
          await importFullBackup(parsed);
          showNotification('Copia de seguridad restaurada con éxito.');
        } else {
          alert('El archivo no tiene el formato válido de respaldo de Sumaq Kawsay.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: formato inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };


  // Open edit tour
  const handleOpenEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setTourForm({ ...tour });
    setIsTourModalOpen(true);
  };

  // Open add new tour
  const handleOpenAddTour = () => {
    setEditingTour(null);
    setTourForm({
      id: `tour-custom-${Date.now()}`,
      slug: `tour-custom-${Date.now()}`,
      titleEs: '',
      titleEn: '',
      subtitleEs: '',
      subtitleEn: '',
      category: 'experiencias',
      locationEs: 'Ollantaytambo · Valle Sagrado',
      locationEn: 'Ollantaytambo · Sacred Valley',
      durationEs: '1 Día',
      durationEn: '1 Day',
      pricePEN: 280,
      priceUSD: 75,
      image: AVAILABLE_IMAGES[0].url,
      difficultyEs: 'Fácil',
      difficultyEn: 'Easy',
      maxAltitude: '2,800 msnm',
      groupSize: 'Grupos pequeños',
      descriptionEs: '',
      descriptionEn: '',
      highlightsEs: ['Guía local certificado', 'Transporte incluido'],
      highlightsEn: ['Certified local guide', 'Transport included'],
      itinerary: [],
      includedEs: ['Guía oficial', 'Entradas'],
      includedEn: ['Official guide', 'Admission fees'],
      notIncludedEs: ['Gastos personales'],
      notIncludedEn: ['Personal expenses'],
      whatToBringEs: ['Ropa cómoda', 'Protector solar'],
      whatToBringEn: ['Comfortable clothing', 'Sunscreen'],
    });
    setIsTourModalOpen(true);
  };

  // Save tour form
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourForm.titleEs || !tourForm.pricePEN) return;

    if (editingTour) {
      await updateTour(tourForm as Tour);
      showNotification('Tour actualizado con éxito. El precio y detalles ya se reflejan en la web.');
    } else {
      await addTour(tourForm as Tour);
      showNotification('Nuevo tour publicado en la web.');
    }
    setIsTourModalOpen(false);
  };

  // Delete tour
  const handleDeleteTour = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este tour del catálogo?')) {
      await deleteTour(id);
      showNotification('Tour eliminado del catálogo.');
    }
  };

  // Save General Content
  const handleSaveGeneralContent = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGeneralContent(contentForm);
    showNotification('Contenido general actualizado con éxito en la web.');
  };

  // Add Sponsor
  const handleAddSponsor = () => {
    if (!newSponsorName) return;
    const newSp: Sponsor = {
      id: `sp-${Date.now()}`,
      name: newSponsorName,
      role: newSponsorRole || 'Aliado Estratégico',
      badge: newSponsorBadge || 'Socio Oficial',
    };
    const updatedSponsors = [...(contentForm.sponsors || []), newSp];
    setContentForm({ ...contentForm, sponsors: updatedSponsors });
    updateGeneralContent({ sponsors: updatedSponsors });
    setNewSponsorName('');
    setNewSponsorRole('');
    setNewSponsorBadge('');
    showNotification('Auspiciador añadido.');
  };

  const handleDeleteSponsor = (id: string) => {
    const updated = contentForm.sponsors.filter((s) => s.id !== id);
    setContentForm({ ...contentForm, sponsors: updated });
    updateGeneralContent({ sponsors: updated });
    showNotification('Auspiciador eliminado.');
  };

  // Testimonials
  const handleOpenAddTestimonial = () => {
    setTestimonialForm({
      id: `test-${Date.now()}`,
      author: '',
      roleEs: 'Viajero Verificado',
      roleEn: 'Verified Traveler',
      org: 'Turismo en Cusco',
      quoteEs: '',
      quoteEn: '',
      tagEs: 'Experiencia Verificada',
      rating: 5,
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.author || !testimonialForm.quoteEs) return;
    await addTestimonial(testimonialForm as TestimonialItem);
    setIsTestimonialModalOpen(false);
    showNotification('Testimonio añadido a la web.');
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('¿Eliminar este testimonio?')) {
      await deleteTestimonial(id);
      showNotification('Testimonio eliminado.');
    }
  };

  if (!isAdminModalOpen && !embedded) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-cms-title"
      className={embedded ? 'w-full' : 'fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6'}
    >
      <div className={embedded ? 'relative bg-[#181513] text-stone-100 w-full rounded-2xl shadow-md border border-stone-700 flex flex-col overflow-hidden' : 'relative bg-[#181513] text-stone-100 w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#F6A935] my-3 sm:my-6 max-h-[94vh] flex flex-col overflow-hidden'}>
{!embedded && (<>
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b-2 border-[#F6A935]/40 bg-[#221E1B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6A935] text-[#181513] flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181513] bg-[#F6A935] px-2 py-0.5 rounded-sm">
                  CMS PRIVADO
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  En Vivo
                </span>
              </div>
              <h2 id="admin-cms-title" className="font-heading text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Panel de Administración · Sumaq Kawsay
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-xs font-bold transition-colors"
                title="Cerrar Sesión de Administrador"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            )}
            <button
              onClick={closeAdminModal}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Cerrar panel de administración"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

</>)}

                {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-500/90 text-white px-6 py-2.5 text-center font-bold text-sm shadow-md flex items-center justify-center gap-2 border-b border-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAdminAuthenticated ? (
          /* Login Screen */
          <div className="p-8 sm:p-16 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#221E1B] border-2 border-[#F6A935] flex items-center justify-center text-[#F6A935] shadow-xl">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                Acceso al Panel de Control
              </h3>
              <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed">
                Inicia sesión con tu usuario para gestionar el sitio.
              </p>
            </div>
            <a
              href="/login?next=/admin"
              className="w-full py-3.5 px-6 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-base shadow-xl transition-all border border-[#FDE8B5]"
            >
              Iniciar sesión
            </a>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
{!initialTab && (<>
            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 px-4 sm:px-8 py-3 bg-[#221E1B] border-b border-stone-800 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveTab('tours')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'tours'
                    ? 'bg-[#F6A935] text-[#181513] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>1. Gestión de Tours / Paquetes ({tours.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'content'
                    ? 'bg-[#F6A935] text-[#181513] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>2. Contenido General & Auspiciadores</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'testimonials'
                    ? 'bg-[#F6A935] text-[#181513] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>3. Testimonios ({testimonials.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shrink-0 relative ${
                  activeTab === 'contacts'
                    ? 'bg-[#F6A935] text-[#181513] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>4. Bandeja de Contactos ({contacts.length})</span>
                {contacts.some((c) => c.status === 'nuevo') && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-[#F6A935] text-[#181513] shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>5. Seguridad & Respaldos</span>
              </button>
            </div>

</>)}

                    {/* Tab 1: Tours CRUD */}
            {activeTab === 'tours' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                      Paquetes Turísticos & Experiencias
                    </h3>
                    <p className="text-sm text-stone-400 mt-1">
                      Edita precios en tiempo real, descripciones, ubicaciones y añade nuevos tours al sitio web sin tocar código.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleOpenAddTour}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm shadow-md transition-all shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nuevo Tour</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 text-stone-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTour}
                    onChange={(e) => setSearchTour(e.target.value)}
                    placeholder="Buscar tour por título, categoría o ubicación..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-700 bg-[#221E1B] text-white focus:outline-hidden focus:border-[#F6A935] text-sm"
                  />
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {tours
                    .filter((t) => {
                      const q = searchTour.toLowerCase();
                      return (
                        !q ||
                        t.titleEs.toLowerCase().includes(q) ||
                        t.locationEs.toLowerCase().includes(q) ||
                        t.category.toLowerCase().includes(q)
                      );
                    })
                    .map((tour) => (
                      <div
                        key={tour.id}
                        className="bg-[#221E1B] rounded-2xl border border-stone-800 p-5 flex flex-col justify-between hover:border-[#F6A935]/50 transition-all shadow-md group"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-md bg-[#181513] text-[#F6A935] border border-[#F6A935]/30">
                              {tour.category}
                            </span>
                            <span className="text-xs text-stone-400 font-mono">
                              {tour.durationEs}
                            </span>
                          </div>

                          <h4 className="font-heading font-extrabold text-lg text-white leading-snug line-clamp-2">
                            {tour.titleEs}
                          </h4>

                          <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
                            {tour.descriptionEs}
                          </p>

                          <div className="text-xs text-stone-400 flex items-center gap-1">
                            <span>Ubicación:</span>
                            <strong className="text-stone-200">{tour.locationEs}</strong>
                          </div>

                          {/* Real-time Prices Highlight */}
                          <div className="p-3 rounded-xl bg-[#181513] border border-[#F6A935]/30 flex items-center justify-between">
                            <div>
                              <span className="text-xs text-stone-400 block uppercase font-bold">Precio Soles</span>
                              <span className="font-heading font-extrabold text-lg text-[#F6A935]">
                                S/ {tour.pricePEN.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-stone-400 block uppercase font-bold">Precio Dólares</span>
                              <span className="font-heading font-extrabold text-lg text-white">
                                ${tour.priceUSD.toFixed(2)} USD
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenEditTour(tour)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-stone-800 hover:bg-[#F6A935] text-white hover:text-[#181513] text-xs font-bold transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="p-2 rounded-lg bg-stone-900 hover:bg-red-900/60 text-stone-400 hover:text-red-300 transition-colors"
                            title="Eliminar tour"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tab 2: General Content & Sponsors */}
            {activeTab === 'content' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                    Textos Principales del Sitio Web
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Modifica el encabezado, subtítulos y la sección de Quiénes Somos. Los cambios se guardan al instante.
                  </p>
                </div>

                <form onSubmit={handleSaveGeneralContent} className="space-y-6">
                  {/* Hero texts */}
                  <div className="p-6 rounded-2xl bg-[#221E1B] border border-stone-800 space-y-4">
                    <h4 className="font-heading text-base font-bold text-[#F6A935] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>1. Sección Inicio (Hero)</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                        Cintillo / Badge Superior
                      </label>
                      <input
                        type="text"
                        value={contentForm.heroBadgeEs}
                        onChange={(e) => setContentForm({ ...contentForm, heroBadgeEs: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                          Título Principal de la Marca
                        </label>
                        <input
                          type="text"
                          value={contentForm.heroTitle}
                          onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                          Subtítulo / Lema
                        </label>
                        <input
                          type="text"
                          value={contentForm.heroSubtitleEs}
                          onChange={(e) => setContentForm({ ...contentForm, heroSubtitleEs: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                        Párrafo Descriptivo del Hero
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.heroDescriptionEs}
                        onChange={(e) => setContentForm({ ...contentForm, heroDescriptionEs: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                      />
                    </div>

                    {/* Hero Photography Selector & File Upload */}
                    <div className="pt-2 border-t border-stone-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold uppercase text-stone-300">
                          Fotografía de Fondo del Hero Principal
                        </label>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6A935]/20 hover:bg-[#F6A935] text-[#FDE8B5] hover:text-[#181513] text-xs font-bold border border-[#F6A935] transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Foto desde Dispositivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUploadForHero}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                        {AVAILABLE_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setContentForm({ ...contentForm, heroImage: img.url })}
                            className={`p-2 rounded-lg border text-xs text-left truncate transition-all ${
                              (contentForm.heroImage || '/images/hero_valle_sagrado_andes_1791233029285.jpg') === img.url
                                ? 'border-[#F6A935] bg-[#F6A935]/25 text-[#FDE8B5] font-bold ring-1 ring-[#F6A935]'
                                : 'border-stone-700 bg-[#181513] text-stone-400 hover:text-white'
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>

                      {/* URL input and preview */}
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="O ingresa una URL personalizada de imagen (https://...)"
                          value={contentForm.heroImage || ''}
                          onChange={(e) => setContentForm({ ...contentForm, heroImage: e.target.value })}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-xs"
                        />
                        {contentForm.heroImage && (
                          <div className="w-20 h-12 rounded-lg overflow-hidden border border-[#F6A935] relative shrink-0 bg-stone-900 shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={contentForm.heroImage}
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* About texts */}
                  <div className="p-6 rounded-2xl bg-[#221E1B] border border-stone-800 space-y-4">
                    <h4 className="font-heading text-base font-bold text-[#F6A935] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>2. Quiénes Somos & Filosofía (Sumaq Kawsay)</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                        Título de la Filosofía
                      </label>
                      <input
                        type="text"
                        value={contentForm.aboutTitleEs}
                        onChange={(e) => setContentForm({ ...contentForm, aboutTitleEs: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                        Descripción del Principio del Buen Vivir
                      </label>
                      <textarea
                        rows={3}
                        value={contentForm.aboutSubtitleEs}
                        onChange={(e) => setContentForm({ ...contentForm, aboutSubtitleEs: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm shadow-xl transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Todos los Textos</span>
                  </button>
                </form>

                {/* Sponsors & Partners Management */}
                <div className="p-6 rounded-2xl bg-[#221E1B] border border-stone-800 space-y-6">
                  <div>
                    <h4 className="font-heading text-base font-bold text-[#F6A935] uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>3. Auspiciadores & Aliados Estratégicos</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Gestiona las instituciones, sellos de calidad y auspiciadores mostrados en la web.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contentForm.sponsors.map((sp) => (
                      <div
                        key={sp.id}
                        className="p-4 rounded-xl bg-[#181513] border border-stone-700 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs uppercase font-bold text-[#F6A935] bg-[#221E1B] px-2 py-0.5 rounded-sm">
                            {sp.badge || 'Aliado'}
                          </span>
                          <strong className="block text-sm text-white font-heading font-extrabold mt-2">
                            {sp.name}
                          </strong>
                          <span className="text-xs text-stone-400 block mt-1">{sp.role}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSponsor(sp.id)}
                          className="mt-3 text-xs text-red-400 hover:text-red-300 self-end font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Sponsor Row */}
                  <div className="p-4 rounded-xl bg-[#181513] border border-stone-700 space-y-3">
                    <span className="text-xs font-bold text-stone-300 uppercase block">Añadir Nuevo Auspiciador / Aliado</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre (ej. PromPerú)"
                        value={newSponsorName}
                        onChange={(e) => setNewSponsorName(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Rol (ej. Sello Sostenible)"
                        value={newSponsorRole}
                        onChange={(e) => setNewSponsorRole(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Insignia (ej. Certificación 2026)"
                        value={newSponsorBadge}
                        onChange={(e) => setNewSponsorBadge(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSponsor}
                      className="px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-xs"
                    >
                      + Agregar Auspiciador
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Testimonials */}
            {activeTab === 'testimonials' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                      Testimonios de Clientes
                    </h3>
                    <p className="text-sm text-stone-400 mt-1">
                      Añade reseñas reales de viajeros o aliados para generar máxima confianza y prueba social.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddTestimonial}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Testimonio</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {testimonials.map((test) => (
                    <div
                      key={test.id}
                      className="p-5 rounded-2xl bg-[#221E1B] border border-stone-800 flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-[#F6A935]">
                            {Array.from({ length: test.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-xs text-[#F6A935] font-bold bg-[#181513] px-2 py-0.5 rounded-md">
                            {test.tagEs}
                          </span>
                        </div>

                        <blockquote className="text-sm sm:text-base italic text-stone-200 leading-relaxed font-editorial">
                          {test.quoteEs}
                        </blockquote>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                        <div>
                          <strong className="text-sm text-white block font-heading">{test.author}</strong>
                          <span className="text-xs text-stone-400">
                            {test.roleEs} · {test.org}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors"
                          title="Eliminar testimonio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Contacts & Leads */}
            {activeTab === 'contacts' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                      Bandeja de Contactos & Leads
                    </h3>
                    <p className="text-sm text-stone-400 mt-1">
                      Mensajes recibidos desde el formulario web, cotizaciones personalizadas y solicitudes de reserva.
                    </p>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar a CSV (Excel)</span>
                  </button>
                </div>

                {/* Filters & Search Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                      placeholder="Buscar por cliente, correo o tour de interés..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#F6A935]"
                    />
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-[#221E1B] rounded-xl border border-stone-800 shrink-0 overflow-x-auto">
                    {(['todos', 'nuevo', 'contactado', 'en_proceso'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setContactStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all shrink-0 ${
                          contactStatusFilter === st
                            ? 'bg-[#F6A935] text-[#181513] shadow-xs'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {st === 'todos' ? 'Todos' : st === 'nuevo' ? 'Nuevos' : st === 'contactado' ? 'Contactados' : 'En Seguimiento'}
                      </button>
                    ))}
                  </div>
                </div>

                {contacts.length === 0 ? (
                  <div className="p-12 text-center bg-[#221E1B] rounded-2xl border border-stone-800 text-stone-400">
                    No hay mensajes recibidos aún. Las consultas enviadas desde el formulario aparecerán aquí.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts
                      .filter((lead) => {
                        const q = searchContact.toLowerCase();
                        const matchesQuery =
                          !q ||
                          lead.name.toLowerCase().includes(q) ||
                          lead.email.toLowerCase().includes(q) ||
                          (lead.tourInterest || '').toLowerCase().includes(q);
                        const matchesStatus =
                          contactStatusFilter === 'todos' || lead.status === contactStatusFilter;
                        return matchesQuery && matchesStatus;
                      })
                      .map((lead) => {
                        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                        const waLink = `https://wa.me/${cleanPhone || '51912189856'}?text=${encodeURIComponent(
                          `Hola ${lead.name}, gracias por comunicarte con Sumaq Kawsay respecto a "${lead.tourInterest || 'su consulta'}". Te escribimos para atender los detalles de tu viaje.`
                        )}`;

                        return (
                          <div
                            key={lead.id}
                            className="p-5 sm:p-6 rounded-2xl bg-[#221E1B] border border-stone-800 hover:border-stone-700 transition-all space-y-4 shadow-md"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-xs uppercase font-extrabold px-3 py-1 rounded-md ${
                                    lead.status === 'nuevo'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                      : lead.status === 'contactado'
                                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                  }`}
                                >
                                  {lead.status === 'nuevo' ? '● Nuevo Lead' : lead.status === 'contactado' ? '✓ Contactado' : 'En Seguimiento'}
                                </span>
                                <h4 className="font-heading text-lg font-extrabold text-white">{lead.name}</h4>
                              </div>

                              <div className="text-xs text-stone-400 font-mono">
                                {new Date(lead.createdAt).toLocaleDateString('es-PE', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-stone-300">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#F6A935]" />
                                <a href={`mailto:${lead.email}`} className="hover:underline text-white font-medium truncate">
                                  {lead.email}
                                </a>
                              </div>

                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#F6A935]" />
                                <span className="text-white font-mono font-bold">{lead.phone || 'No especificado'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#F6A935]" />
                                <span className="truncate">Interés: <strong>{lead.tourInterest || 'General'}</strong></span>
                              </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#181513] border border-stone-800 text-sm text-stone-200 leading-relaxed">
                              {lead.message || 'Sin mensaje adicional.'}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-400">Estado:</span>
                                <select
                                  value={lead.status}
                                  onChange={(e) =>
                                    updateContactStatus(
                                      lead.id,
                                      e.target.value as 'nuevo' | 'contactado' | 'en_proceso'
                                    )
                                  }
                                  className="px-2.5 py-1 text-xs rounded-md bg-[#181513] border border-stone-700 text-white font-semibold"
                                >
                                  <option value="nuevo">Nuevo</option>
                                  <option value="en_proceso">En Seguimiento</option>
                                  <option value="contactado">Contactado</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Responder por WhatsApp</span>
                                </a>

                                <button
                                  onClick={() => deleteContact(lead.id)}
                                  className="p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors"
                                  title="Eliminar registro"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Settings, Security & Audit */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                    Seguridad, Respaldos & Conformidad para Producción
                  </h3>
                  <p className="text-sm text-stone-400 mt-1">
                    Herramientas profesionales para auditoría técnica, resguardo de datos y puesta en marcha en hosting comercial.
                  </p>
                </div>

                {/* Module 2: Backups and Migration to Hosting */}
                <div className="p-6 rounded-2xl bg-[#221E1B] border border-stone-800 space-y-4">
                  <h4 className="font-heading text-base font-bold text-[#F6A935] uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>2. Migración & Copia de Seguridad Completa (Disaster Recovery)</span>
                  </h4>
                  <p className="text-xs text-stone-400">
                    Exporta todos los tours, precios, fotos, textos y testimonios en un archivo JSON para migraciones a cualquier hosting o respaldo local.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm border border-stone-700 transition-all shadow-md"
                    >
                      <Download className="w-4 h-4 text-[#F6A935]" />
                      <span>Descargar Respaldo Total (.JSON)</span>
                    </button>

                    <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm border border-stone-700 cursor-pointer transition-all shadow-md">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Restaurar desde Respaldo (.JSON)</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      <span>Exportar Leads a Excel (.CSV)</span>
                    </button>
                  </div>
                </div>

                {/* Module 3: Legal & Technical Audit Sheet */}
                <div className="p-6 rounded-2xl bg-[#221E1B] border border-stone-800 space-y-4">
                  <h4 className="font-heading text-base font-bold text-[#F6A935] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>3. Ficha Técnica de Auditoría & Conformidad Legal</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#181513] border border-stone-800 space-y-1">
                      <strong className="text-white block font-heading">Operador Formal Registrado</strong>
                      <span className="text-stone-300">Sumaq Kawsay · Operador Turístico Autorizado</span>
                      <span className="text-emerald-400 block font-semibold">✓ Licencia DIRCETUR Formal Cusco</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#181513] border border-stone-800 space-y-1">
                      <strong className="text-white block font-heading">Libro de Reclamaciones Virtual</strong>
                      <span className="text-stone-300">Conforme a D.S. 011-2011-PCM (Indecopi)</span>
                      <span className="text-emerald-400 block font-semibold">✓ Códigos automáticos con plazo de 15 días</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#181513] border border-stone-800 space-y-1">
                      <strong className="text-white block font-heading">Accesibilidad & Tipografía</strong>
                      <span className="text-stone-300">Modo de lectura ampliada A+ (WCAG AAA)</span>
                      <span className="text-emerald-400 block font-semibold">✓ Contraste alto y sin traslape tipográfico</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#181513] border border-stone-800 space-y-1">
                      <strong className="text-white block font-heading">Seguridad Web & Datos</strong>
                      <span className="text-stone-300">Protección contra fuerza bruta y enlaces seguros</span>
                      <span className="text-emerald-400 block font-semibold">✓ rel=&quot;noopener noreferrer&quot; &amp; SSL ready</span>
                    </div>
                  </div>
                </div>

                {/* Module 4: Factory Reset */}
                <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                  <h4 className="font-heading text-base font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>4. Restablecimiento de Fábrica</span>
                  </h4>
                  <p className="text-xs text-stone-300">
                    Si deseas volver a los tours y datos originales de Sumaq Kawsay &amp; Inka Lab, pulsa el botón a continuación.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Estás seguro de restablecer todos los tours, textos y configuraciones a los valores de fábrica originales?')) {
                        resetToDefaults();
                        showNotification('Datos restablecidos a los valores originales de fábrica.');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restablecer Datos Originales</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add/Edit Tour Sub-modal */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#181513] text-white w-full max-w-3xl rounded-2xl border-2 border-[#F6A935] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="font-heading text-xl font-extrabold text-[#F6A935]">
                {editingTour ? 'Editar Tour / Paquete' : 'Crear Nuevo Tour'}
              </h3>
              <button
                onClick={() => setIsTourModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                    Título en Español *
                  </label>
                  <input
                    type="text"
                    required
                    value={tourForm.titleEs || ''}
                    onChange={(e) => setTourForm({ ...tourForm, titleEs: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                    Título en Inglés
                  </label>
                  <input
                    type="text"
                    value={tourForm.titleEn || ''}
                    onChange={(e) => setTourForm({ ...tourForm, titleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-sm"
                  />
                </div>
              </div>

              {/* Prices in PEN and USD */}
              <div className="p-4 rounded-xl bg-[#221E1B] border border-[#F6A935]/40 space-y-3">
                <span className="text-xs font-extrabold text-[#F6A935] uppercase tracking-wider block">
                  Configuración de Precios en Tiempo Real
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-200 mb-1">
                      Precio en Soles (PEN) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#F6A935]">S/</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={tourForm.pricePEN || 0}
                        onChange={(e) => setTourForm({ ...tourForm, pricePEN: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-base font-bold font-heading"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-200 mb-1">
                      Precio en Dólares (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-white">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={tourForm.priceUSD || 0}
                        onChange={(e) => setTourForm({ ...tourForm, priceUSD: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-700 bg-[#181513] text-white text-base font-bold font-heading"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                    Ubicación (ej. Chillca, Ollantaytambo)
                  </label>
                  <input
                    type="text"
                    value={tourForm.locationEs || ''}
                    onChange={(e) => setTourForm({ ...tourForm, locationEs: e.target.value, locationEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                    Duración (ej. 1 Día, 4D/3N)
                  </label>
                  <input
                    type="text"
                    value={tourForm.durationEs || ''}
                    onChange={(e) => setTourForm({ ...tourForm, durationEs: e.target.value, durationEn: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={tourForm.category || 'experiencias'}
                    onChange={(e) =>
                      setTourForm({
                        ...tourForm,
                        category: e.target.value as 'etnobotanica' | 'cabalgata' | 'camino-inca' | 'cultura' | 'experiencias',
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs"
                  >
                    <option value="etnobotanica">Etnobotánica & Salud</option>
                    <option value="cabalgata">Cabalgatas</option>
                    <option value="camino-inca">Camino Inca</option>
                    <option value="cultura">Cultura & Comunidad</option>
                    <option value="experiencias">Laboratorio Inka Lab</option>
                  </select>
                </div>
              </div>

              {/* Image Selector & Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-stone-300">
                    Fotografía Principal del Tour
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F6A935]/20 hover:bg-[#F6A935] text-[#FDE8B5] hover:text-[#181513] text-xs font-bold border border-[#F6A935] transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Subir desde mi dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadForTour}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                  {AVAILABLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTourForm({ ...tourForm, image: img.url })}
                      className={`p-1.5 rounded-lg border text-xs text-left truncate transition-all ${
                        tourForm.image === img.url
                          ? 'border-[#F6A935] bg-[#F6A935]/20 text-[#FDE8B5] font-bold ring-1 ring-[#F6A935]'
                          : 'border-stone-700 bg-[#221E1B] text-stone-400 hover:text-white'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="O ingresa una URL personalizada de imagen (https://...)"
                    value={tourForm.image || ''}
                    onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs"
                  />
                  {tourForm.image && (
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-[#F6A935] relative shrink-0 bg-stone-900 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tourForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={tourForm.descriptionEs || ''}
                  onChange={(e) => setTourForm({ ...tourForm, descriptionEs: e.target.value, descriptionEn: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-700 bg-[#221E1B] text-white text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsTourModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:text-white text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] text-xs font-bold shadow-md"
                >
                  Guardar Tour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Testimonial Sub-modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#181513] text-white w-full max-w-lg rounded-2xl border-2 border-[#F6A935] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-lg font-bold text-[#F6A935]">
                Añadir Testimonio de Cliente
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Sánchez (México)"
                  value={testimonialForm.author || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, author: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">Rol / Origen</label>
                  <input
                    type="text"
                    placeholder="Ej. Viajero Verificado"
                    value={testimonialForm.roleEs || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, roleEs: e.target.value, roleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-300 mb-1">Tour Realizado</label>
                  <input
                    type="text"
                    placeholder="Ej. Tour Etnobotánica"
                    value={testimonialForm.org || ''}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, org: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-300 mb-1">Opinión / Reseña *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comentario sobre su vivencia con Sumaq Kawsay..."
                  value={testimonialForm.quoteEs || ''}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteEs: e.target.value, quoteEn: e.target.value })}
                  className="w-full p-3 rounded-lg border border-stone-700 bg-[#221E1B] text-white text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-700 text-stone-300 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] text-xs font-bold"
                >
                  Publicar Testimonio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}