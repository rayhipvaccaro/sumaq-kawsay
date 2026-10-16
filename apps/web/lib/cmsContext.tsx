'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DEFAULT_CMS_DATA,
  CMSData,
  GeneralContent,
  TestimonialItem,
  ContactLead,
} from '@/data/defaultCmsData';
import { Tour } from '@/data/toursData';
import {
  UserRole,
  StockItem,
  Provider,
  Reservation,
  ReservationStatus,
  PaymentStatus,
  PaymentMethod,
  InvoiceType,
  AccountingTransaction,
  EmailLog,
  INITIAL_STOCK_ITEMS,
  INITIAL_PROVIDERS,
  INITIAL_RESERVATIONS,
  INITIAL_ACCOUNTING_ENTRIES,
} from '@/data/businessData';
import { hasPerm, hasAny } from '@/lib/permissions';

export interface SessionInfo {
  id: number;
  username: string;
  fullName?: string;
  role: string;
  isAdmin: boolean;
  area: string | null;
  areaId?: number | null;
  permissions: string[];
  mustChangePassword?: boolean;
  discountPct?: number;
  docType?: string | null;
  docNumber?: string | null;
}

export interface BookingPreset {
  /** id del hospedaje o actividad elegida en el buscador del home */
  experienceId?: string;
  /** fecha de llegada en formato YYYY-MM-DD */
  date?: string;
  guests?: number;
}

interface CMSContextType {
  tours: Tour[];
  generalContent: GeneralContent;
  testimonials: TestimonialItem[];
  contacts: ContactLead[];
  stockItems: StockItem[];
  providers: Provider[];
  reservations: Reservation[];
  accountingEntries: AccountingTransaction[];
  cmsRawData: CMSData;
  isLoading: boolean;

  // Roles & Security
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  sessionUser: SessionInfo | null;
  can: (perm: string) => boolean;
  portalRoles: UserRole[];
  isAdminModalOpen: boolean;
  isAdminAuthenticated: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  logoutAdmin: () => void;

  // Business Portal Modal (for Roles: Ventas, Contador, Admin, etc.)
  isBusinessPortalOpen: boolean;
  openBusinessPortal: (targetRole?: UserRole) => void;
  closeBusinessPortal: () => void;

  // Booking Flow Wizard Modal (Flujo Integral Paso a Paso)
  isBookingWizardOpen: boolean;
  bookingPreset: BookingPreset | null;
  openBookingWizard: (preset?: BookingPreset) => void;
  closeBookingWizard: () => void;

  // Order Tracker Modal (Rastreo de Reserva para el Usuario)
  isOrderTrackerOpen: boolean;
  activeTrackingId: string | null;
  openOrderTracker: (id?: string) => void;
  closeOrderTracker: () => void;

  // Manual Modal (Manual de Uso Web & Manual de Sistema)
  isManualModalOpen: boolean;
  manualActiveTab: 'usuario' | 'sistema';
  openManualModal: (tab?: 'usuario' | 'sistema') => void;
  closeManualModal: () => void;
  setManualActiveTab: (tab: 'usuario' | 'sistema') => void;

  // Tour & CMS operations
  importFullBackup: (backup: CMSData) => Promise<boolean>;
  addTour: (tour: Tour) => Promise<boolean>;
  updateTour: (tour: Tour) => Promise<boolean>;
  deleteTour: (id: string) => Promise<boolean>;
  updateGeneralContent: (content: Partial<GeneralContent>) => Promise<boolean>; 
  updatePages: (pages: Record<string, import('@/data/pagesContent').PageContent>) => Promise<boolean>; 
  updateSiteData: (siteData: import('@/lib/siteData').SiteData) => Promise<boolean>;
  addTestimonial: (item: TestimonialItem) => Promise<boolean>;
  updateTestimonial: (item: TestimonialItem) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  submitContactForm: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    tourInterest?: string;
    travelDate?: string;
  }) => Promise<boolean>;
  updateContactStatus: (id: string, status: 'nuevo' | 'contactado' | 'en_proceso') => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;

  // Business: Reservations Flow
  createReservation: (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'emailLogs'>) => Promise<string>;
  updateReservationStatus: (id: string, status: ReservationStatus, declineReason?: string) => Promise<boolean>;
  updateReservationPayment: (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod: PaymentMethod,
    invoiceType: InvoiceType,
    invoiceNumber?: string
  ) => Promise<boolean>;
  sendReservationEmail: (
    reservationId: string,
    emailData: Omit<EmailLog, 'id' | 'date'>
  ) => Promise<boolean>;

  // Business: Stock / Capacity Management
  updateStockItem: (item: StockItem) => Promise<boolean>;
  addStockItem: (item: StockItem) => Promise<boolean>;
  deleteStockItem: (id: string) => Promise<boolean>;

  // Business: Providers Management
  updateProvider: (provider: Provider) => Promise<boolean>;
  addProvider: (provider: Provider) => Promise<boolean>;
  payProvider: (providerId: string, amountPEN: number, concept: string, method: PaymentMethod) => Promise<boolean>;

  // Business: Accounting Entries
  addAccountingTransaction: (tx: Omit<AccountingTransaction, 'id' | 'date'>) => Promise<boolean>;
}

const CMSContext = createContext<CMSContextType | null>(null);

const STORAGE_KEY = 'sumaq_kawsay_cms_v2';
const CURRENT_ROLE_KEY = 'sumaq_current_role_v1';

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            ...DEFAULT_CMS_DATA,
            ...parsed,
            stockItems: parsed.stockItems || INITIAL_STOCK_ITEMS,
            providers: parsed.providers || INITIAL_PROVIDERS,
            reservations: parsed.reservations || INITIAL_RESERVATIONS,
            accountingEntries: parsed.accountingEntries || INITIAL_ACCOUNTING_ENTRIES,
          };
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_CMS_DATA;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [sessionUser, setSessionUser] = useState<SessionInfo | null>(null);

  // La sesion de admin viene de la cookie real (Nest), no de un PIN local.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const u = (j?.user ?? j) as SessionInfo | null;
        if (cancelled) return;
        if (u && u.username) {
          setSessionUser(u);
          setIsAdminAuthenticated(hasAny(u, ['cms.edit', 'payments.manage', 'orders.view', 'leads.view']));
        } else {
          setSessionUser(null);
          setIsAdminAuthenticated(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSessionUser(null);
          setIsAdminAuthenticated(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Role Switcher State (Defaults to 'usuario' on initial visit, can switch anytime)
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CURRENT_ROLE_KEY) as UserRole;
        if (saved && ['usuario', 'ventas', 'contador', 'admin'].includes(saved)) {
          return saved;
        }
      } catch {
        // fallback
      }
    }
    return 'usuario';
  });

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    try {
      localStorage.setItem(CURRENT_ROLE_KEY, role);
    } catch {
      // ignore
    }
  };

  const can = (perm: string) => hasPerm(sessionUser, perm);
  const portalRoles: UserRole[] = [];
  if (hasAny(sessionUser, ['cms.edit', 'leads.view', 'agencies.manage'])) portalRoles.push('ventas');
  if (hasAny(sessionUser, ['payments.manage', 'orders.view'])) portalRoles.push('contador');
  if (sessionUser?.isAdmin && !sessionUser.mustChangePassword) portalRoles.push('admin', 'usuario');

  // Business Modals
  const [isBusinessPortalOpen, setIsBusinessPortalOpen] = useState<boolean>(false);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState<boolean>(false);
  const [bookingPreset, setBookingPreset] = useState<BookingPreset | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState<boolean>(false);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Manual Modals
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualActiveTab, setManualActiveTab] = useState<'usuario' | 'sistema'>('usuario');

  // Sync from server API on mount
  useEffect(() => {
    fetch('/api/cms')
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && serverData.tours) {
          setData((prev) => {
            const merged: CMSData = {
              ...prev,
              ...serverData,
              stockItems: serverData.stockItems || prev.stockItems || INITIAL_STOCK_ITEMS,
              providers: serverData.providers || prev.providers || INITIAL_PROVIDERS,
              reservations: serverData.reservations || prev.reservations || INITIAL_RESERVATIONS,
              accountingEntries: serverData.accountingEntries || prev.accountingEntries || INITIAL_ACCOUNTING_ENTRIES,
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('Could not sync with server CMS, utilizing local cache', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Save changes to state, localStorage and server
  const persistChanges = async (updatedData: CMSData): Promise<boolean> => {
    setData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      return res.ok;
    } catch (error) {
      console.error('Error persisting CMS data to server:', error);
      return true;
    }
  };

  const logoutAdmin = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
    window.location.href = '/login';
  };

  const openAdminModal = () => setIsAdminModalOpen(true);
  const closeAdminModal = () => setIsAdminModalOpen(false);

  // Business Portal Open
  const openBusinessPortal = (targetRole?: UserRole) => {
    if (targetRole) {
      setCurrentRole(targetRole);
    }
    setIsBusinessPortalOpen(true);
  };
  const closeBusinessPortal = () => setIsBusinessPortalOpen(false);

  // Booking Flow Wizard
  const openBookingWizard = (preset?: BookingPreset) => {
    setBookingPreset(preset ?? null);
    setIsBookingWizardOpen(true);
  };
  const closeBookingWizard = () => setIsBookingWizardOpen(false);

  // Order Tracker
  const openOrderTracker = (id?: string) => {
    if (id) setActiveTrackingId(id);
    setIsOrderTrackerOpen(true);
  };
  const closeOrderTracker = () => {
    setIsOrderTrackerOpen(false);
    setActiveTrackingId(null);
  };

  // Manual Modal
  const openManualModal = (tab?: 'usuario' | 'sistema') => {
    if (tab) setManualActiveTab(tab);
    setIsManualModalOpen(true);
  };
  const closeManualModal = () => setIsManualModalOpen(false);

  const importFullBackup = async (backup: CMSData): Promise<boolean> => {
    if (!backup || !backup.tours || !backup.generalContent) return false;
    return persistChanges(backup);
  };

  // Tours CRUD
  const addTour = async (newTour: Tour): Promise<boolean> => {
    const updatedTours = [newTour, ...data.tours];
    return persistChanges({ ...data, tours: updatedTours });
  };

  const updateTour = async (updatedTour: Tour): Promise<boolean> => {
    const updatedTours = data.tours.map((t) => (t.id === updatedTour.id ? updatedTour : t));
    return persistChanges({ ...data, tours: updatedTours });
  };

  const deleteTour = async (id: string): Promise<boolean> => {
    const updatedTours = data.tours.filter((t) => t.id !== id);
    return persistChanges({ ...data, tours: updatedTours });
  };

  // General Content Update
  const updateSiteData = async (siteData: import('@/lib/siteData').SiteData): Promise<boolean> => persistChanges({ ...data, siteData }); const updatePages = async (pages: Record<string, import('@/data/pagesContent').PageContent>): Promise<boolean> => persistChanges({ ...data, pages }); const updateGeneralContent = async (content: Partial<GeneralContent>): Promise<boolean> => {
    const updatedGeneral = { ...data.generalContent, ...content };
    return persistChanges({ ...data, generalContent: updatedGeneral });
  };

  // Testimonials CRUD
  const addTestimonial = async (item: TestimonialItem): Promise<boolean> => {
    const updated = [item, ...data.testimonials];
    return persistChanges({ ...data, testimonials: updated });
  };

  const updateTestimonial = async (item: TestimonialItem): Promise<boolean> => {
    const updated = data.testimonials.map((t) => (t.id === item.id ? item : t));
    return persistChanges({ ...data, testimonials: updated });
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    const updated = data.testimonials.filter((t) => t.id !== id);
    return persistChanges({ ...data, testimonials: updated });
  };

  // Contacts
  const submitContactForm = async (contactInput: {
    name: string;
    email: string;
    phone: string;
    message: string;
    tourInterest?: string;
    travelDate?: string;
  }): Promise<boolean> => {
    const newLead: ContactLead = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...contactInput,
      createdAt: new Date().toISOString(),
      status: 'nuevo',
    };

    const updatedContacts = [newLead, ...(data.contacts || [])];
    return persistChanges({ ...data, contacts: updatedContacts });
  };

  const updateContactStatus = async (
    id: string,
    status: 'nuevo' | 'contactado' | 'en_proceso'
  ): Promise<boolean> => {
    const updatedContacts = data.contacts.map((c) => (c.id === id ? { ...c, status } : c));
    return persistChanges({ ...data, contacts: updatedContacts });
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    const updatedContacts = data.contacts.filter((c) => c.id !== id);
    return persistChanges({ ...data, contacts: updatedContacts });
  };

  // =========================================================================
  // BUSINESS LOGIC: RESERVATIONS & SALES FLOW (ALL ROLES CONNECTED)
  // =========================================================================

  const createReservation = async (
    reservationData: Omit<Reservation, 'id' | 'createdAt' | 'emailLogs'>
  ): Promise<string> => {
    // El servidor crea la orden (id, llave de pago, estado). Asi la ve el admin aunque
    // el turista no haya iniciado sesion.
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    });
    const created = await res.json().catch(() => ({}));
    if (!res.ok || !created?.id) {
      throw new Error(created?.error ?? 'No se pudo registrar la orden');
    }
    const reservationId: string = created.id;
    const accessToken: string = created.accessToken;

    try {
      localStorage.setItem(`sq_pay_${reservationId}`, accessToken);
      localStorage.setItem(`sq_acct_${reservationId}`, String(created.account ?? ''));
    } catch {
      // ignore
    }

    // Copia local para que el turista siga su orden en este equipo.
    const newReservation: Reservation = {
      ...reservationData,
      id: reservationId,
      createdAt: new Date().toISOString(),
      accessToken,
      amountPaidPEN: 0,
      payments: [],
      emailLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString(),
          sender: 'sistema@sumaqkawsay.pe',
          recipient: reservationData.customerEmail,
          subject: `Confirmación de Solicitud de Reserva ${reservationId} · Sumaq Kawsay`,
          body: `Hola ${reservationData.customerName}, hemos recibido tu solicitud de experiencia integral.`,
          type: 'cotizacion',
        },
      ],
    };
    setData((prev) => {
      const next = { ...prev, reservations: [newReservation, ...(prev.reservations || [])] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    return reservationId;
  };

  // Update reservation status (Pipeline: borrador -> cotizado -> en_seguimiento -> concretado -> declinado)
  const updateReservationStatus = async (
    id: string,
    status: ReservationStatus,
    declineReason?: string
  ): Promise<boolean> => {
    const existing = data.reservations.find((r) => r.id === id);
    if (!existing) return false;

    const prevStatus = existing.status;
    let updatedStock = [...(data.stockItems || [])];
    let updatedAccounting = [...(data.accountingEntries || [])];
    let updatedProviders = [...(data.providers || [])];

    // If changing to 'concretado':
    // 1. DEDUCT STOCK (increase booked count)
    // 2. CREATE ACCOUNTING TRANSACTION (Ingreso de venta para el Contador)
    // 3. CREATE COMISSIONS/ACCOUNTS PAYABLE to Providers
    if (status === 'concretado' && prevStatus !== 'concretado') {
      const itemsToBook = [
        ...(existing.stayItem ? [existing.stayItem] : []),
        ...existing.activities,
        ...existing.meals,
        ...existing.extras,
      ];

      // Update stock booked count
      updatedStock = updatedStock.map((stockItem) => {
        const found = itemsToBook.find((it) => it.itemId === stockItem.id);
        if (found) {
          const newBooked = Math.min(stockItem.capacityMax, stockItem.booked + found.quantity);
          return { ...stockItem, booked: newBooked };
        }
        return stockItem;
      });

      // Generate invoice number if not already present
      const invoiceNum = existing.invoiceNumber || `B001-000${100 + data.reservations.length}`;

      // Create Accounting Entry (Ingreso)
      const newTransaction: AccountingTransaction = {
        id: `tx-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'ingreso',
        concept: `Venta Concretada de Reserva ${existing.id} (${existing.customerName})`,
        category: 'Venta de Reserva',
        amountPEN: existing.totalPEN,
        amountUSD: existing.totalUSD,
        reservationId: existing.id,
        invoiceNumber: invoiceNum,
        paymentMethod: existing.paymentMethod,
        registeredBy: 'Sistema Integrado de Ventas & Facturación',
      };
      updatedAccounting.unshift(newTransaction);

      // Record accounts owed to providers
      itemsToBook.forEach((item) => {
        const stockItem = data.stockItems.find((s) => s.id === item.itemId);
        if (stockItem && stockItem.providerId) {
          const provCost = item.subtotalCostPEN;
          updatedProviders = updatedProviders.map((p) => {
            if (p.id === stockItem.providerId) {
              return {
                ...p,
                pendingBalancePEN: p.pendingBalancePEN + provCost,
              };
            }
            return p;
          });
        }
      });
    }

    // If changing from 'concretado' to 'declinado' or other:
    // RESTORE STOCK (reduce booked count)
    if (prevStatus === 'concretado' && status !== 'concretado') {
      const itemsToBook = [
        ...(existing.stayItem ? [existing.stayItem] : []),
        ...existing.activities,
        ...existing.meals,
        ...existing.extras,
      ];

      updatedStock = updatedStock.map((stockItem) => {
        const found = itemsToBook.find((it) => it.itemId === stockItem.id);
        if (found) {
          const newBooked = Math.max(0, stockItem.booked - found.quantity);
          return { ...stockItem, booked: newBooked };
        }
        return stockItem;
      });
    }

    // Update reservation in list
    const updatedReservations = data.reservations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status,
          declineReason: declineReason || r.declineReason,
          invoiceNumber:
            status === 'concretado' && !r.invoiceNumber
              ? `B001-000${100 + data.reservations.length}`
              : r.invoiceNumber,
          invoiceIssuedAt:
            status === 'concretado' && !r.invoiceIssuedAt
              ? new Date().toISOString()
              : r.invoiceIssuedAt,
          paymentStatus:
            status === 'concretado' && r.paymentStatus === 'pendiente'
              ? ('pagado_100' as PaymentStatus)
              : status === 'declinado'
              ? ('anulado' as PaymentStatus)
              : r.paymentStatus,
        };
      }
      return r;
    });

    return persistChanges({
      ...data,
      stockItems: updatedStock,
      reservations: updatedReservations,
      accountingEntries: updatedAccounting,
      providers: updatedProviders,
    });
  };

  // Update payment status from Accounting
  const updateReservationPayment = async (
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod: PaymentMethod,
    invoiceType: InvoiceType,
    invoiceNumber?: string
  ): Promise<boolean> => {
    const updatedReservations = data.reservations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          paymentStatus,
          paymentMethod,
          invoiceType,
          invoiceNumber: invoiceNumber || r.invoiceNumber,
          invoiceIssuedAt: invoiceNumber ? new Date().toISOString() : r.invoiceIssuedAt,
        };
      }
      return r;
    });

    return persistChanges({ ...data, reservations: updatedReservations });
  };

  // Send communication email to client
  const sendReservationEmail = async (
    reservationId: string,
    emailData: Omit<EmailLog, 'id' | 'date'>
  ): Promise<boolean> => {
    const newLog: EmailLog = {
      ...emailData,
      id: `mail-${Date.now()}`,
      date: new Date().toISOString(),
    };

    const updatedReservations = data.reservations.map((r) => {
      if (r.id === reservationId) {
        return {
          ...r,
          emailLogs: [newLog, ...(r.emailLogs || [])],
        };
      }
      return r;
    });

    return persistChanges({ ...data, reservations: updatedReservations });
  };

  // Stock CRUD
  const updateStockItem = async (item: StockItem): Promise<boolean> => {
    const updated = data.stockItems.map((s) => (s.id === item.id ? item : s));
    return persistChanges({ ...data, stockItems: updated });
  };

  const addStockItem = async (item: StockItem): Promise<boolean> => {
    const updated = [item, ...data.stockItems];
    return persistChanges({ ...data, stockItems: updated });
  };

  const deleteStockItem = async (id: string): Promise<boolean> => {
    const updated = data.stockItems.filter((s) => s.id !== id);
    return persistChanges({ ...data, stockItems: updated });
  };

  // Provider CRUD & Liquidation
  const updateProvider = async (provider: Provider): Promise<boolean> => {
    const updated = data.providers.map((p) => (p.id === provider.id ? provider : p));
    return persistChanges({ ...data, providers: updated });
  };

  const addProvider = async (provider: Provider): Promise<boolean> => {
    const updated = [provider, ...data.providers];
    return persistChanges({ ...data, providers: updated });
  };

  const payProvider = async (
    providerId: string,
    amountPEN: number,
    concept: string,
    method: PaymentMethod
  ): Promise<boolean> => {
    const provider = data.providers.find((p) => p.id === providerId);
    if (!provider) return false;

    // Deduct pending balance and increase total paid
    const updatedProviders = data.providers.map((p) => {
      if (p.id === providerId) {
        return {
          ...p,
          pendingBalancePEN: Math.max(0, p.pendingBalancePEN - amountPEN),
          totalPaidPEN: p.totalPaidPEN + amountPEN,
        };
      }
      return p;
    });

    // Create Accounting Entry (Egreso)
    const newTx: AccountingTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'egreso',
      concept: `Liquidación a Proveedor: ${provider.name} - ${concept}`,
      category: 'Pago a Proveedor',
      amountPEN: amountPEN,
      amountUSD: Number((amountPEN / 3.75).toFixed(2)),
      providerId: provider.id,
      paymentMethod: method,
      registeredBy: 'CPC Alberto Carrillo (Contador Principal)',
    };

    const updatedAccounting = [newTx, ...data.accountingEntries];

    return persistChanges({
      ...data,
      providers: updatedProviders,
      accountingEntries: updatedAccounting,
    });
  };

  // Accounting Transaction CRUD
  const addAccountingTransaction = async (
    tx: Omit<AccountingTransaction, 'id' | 'date'>
  ): Promise<boolean> => {
    const newTx: AccountingTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
    };
    const updated = [newTx, ...data.accountingEntries];
    return persistChanges({ ...data, accountingEntries: updated });
  };

  const resetToDefaults = async (): Promise<void> => {
    await persistChanges(DEFAULT_CMS_DATA);
  };

  return (
    <CMSContext.Provider
      value={{
        tours: data.tours,
        generalContent: data.generalContent,
        testimonials: data.testimonials,
        contacts: data.contacts,
        stockItems: data.stockItems || INITIAL_STOCK_ITEMS,
        providers: data.providers || INITIAL_PROVIDERS,
        reservations: data.reservations || INITIAL_RESERVATIONS,
        accountingEntries: data.accountingEntries || INITIAL_ACCOUNTING_ENTRIES,
        cmsRawData: data,
        isLoading,

        // Roles & Auth
        currentRole,
        setCurrentRole,
        sessionUser,
        can,
        portalRoles,
        isAdminModalOpen,
        isAdminAuthenticated,
        openAdminModal,
        closeAdminModal,
        logoutAdmin,

        // Portals & Flow
        isBusinessPortalOpen,
        openBusinessPortal,
        closeBusinessPortal,
        isBookingWizardOpen,
        bookingPreset,
        openBookingWizard,
        closeBookingWizard,
        isOrderTrackerOpen,
        activeTrackingId,
        openOrderTracker,
        closeOrderTracker,

        // Manuals
        isManualModalOpen,
        manualActiveTab,
        openManualModal,
        closeManualModal,
        setManualActiveTab,

        // Operations
        importFullBackup,
        addTour,
        updateTour,
        deleteTour,
        updateGeneralContent, 
        updatePages, 
        updateSiteData,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        submitContactForm,
        updateContactStatus,
        deleteContact,
        resetToDefaults,

        // Business Logic
        createReservation,
        updateReservationStatus,
        updateReservationPayment,
        sendReservationEmail,
        updateStockItem,
        addStockItem,
        deleteStockItem,
        updateProvider,
        addProvider,
        payProvider,
        addAccountingTransaction,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}