'use client';

import { useState } from 'react';
import {
  X,
  Shield,
  Briefcase,
  Calculator,
  User,
  Users,
  Box,
  Truck,
  DollarSign,
  TrendingUp,
  FileText,
  Mail,
  Send,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Printer,
  Search,
  Filter,
  Check,
  Building2,
  Phone,
  Calendar,
  RefreshCw,
  Sliders,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import {
  UserRole,
  Reservation,
  ReservationStatus,
  StockItem,
  Provider,
  PaymentStatus,
  PaymentMethod,
  InvoiceType,
} from '@/data/businessData';

interface BusinessPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  lang?: 'es' | 'en';
}

export function BusinessPortalModal({
  isOpen,
  onClose,
  initialRole,
  lang = 'es',
}: BusinessPortalModalProps) {
  const {
    currentRole,
    setCurrentRole,
    reservations,
    stockItems,
    providers,
    accountingEntries,
    updateReservationStatus,
    updateReservationPayment,
    sendReservationEmail,
    updateStockItem,
    addStockItem,
    updateProvider,
    addProvider,
    payProvider,
    openBookingWizard,
    openOrderTracker,
    openManualModal,
  } = useCMS();

  const isEs = lang === 'es';

  // Active Role tab inside the portal
  const activeRole: UserRole = currentRole || initialRole || 'ventas';

  // Sub-tabs for Admin view
  const [adminSubTab, setAdminSubTab] = useState<'stock' | 'providers' | 'roles' | 'stats'>('stock');

  // Sales Pipeline state
  const [salesStatusFilter, setSalesStatusFilter] = useState<string>('todos');
  const [searchReservation, setSearchReservation] = useState('');
  const [selectedResForDetail, setSelectedResForDetail] = useState<Reservation | null>(null);

  // Email composer modal for Sales
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailType, setEmailType] = useState<'cotizacion' | 'seguimiento' | 'confirmacion_voucher' | 'declinacion'>('cotizacion');

  // Conclude sale modal state
  const [closingSaleModalOpen, setClosingSaleModalOpen] = useState(false);
  const [closingMethod, setClosingMethod] = useState<PaymentMethod>('transferencia_bcp');
  const [closingInvoiceType, setClosingInvoiceType] = useState<InvoiceType>('boleta');
  const [closingInvoiceNum, setClosingInvoiceNum] = useState('');

  // Decline sale modal state
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReasonInput, setDeclineReasonInput] = useState('Presupuesto fuera del alcance del cliente');

  // Accounting module state
  const [accountingFilter, setAccountingFilter] = useState<'todos' | 'ingreso' | 'egreso'>('todos');
  const [payProviderModalOpen, setPayProviderModalOpen] = useState(false);
  const [selectedProviderToPay, setSelectedProviderToPay] = useState<Provider | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<number>(0);
  const [payConceptInput, setPayConceptInput] = useState('Liquidación de servicios de guiado y raciones');
  const [payMethodInput, setPayMethodInput] = useState<PaymentMethod>('transferencia_bcp');

  // Stock edit modal
  const [editingStockItem, setEditingStockItem] = useState<StockItem | null>(null);
  const [stockEditCapacity, setStockEditCapacity] = useState<number>(10);
  const [stockEditPricePEN, setStockEditPricePEN] = useState<number>(100);

  // Provider edit modal
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [isNewProviderModal, setIsNewProviderModal] = useState(false);
  const [newProvName, setNewProvName] = useState('');
  const [newProvRuc, setNewProvRuc] = useState('');
  const [newProvCategory, setNewProvCategory] = useState<Provider['category']>('Guías & Arrieros Comunales');
  const [newProvContact, setNewProvContact] = useState('');
  const [newProvPhone, setNewProvPhone] = useState('');

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter reservations for Sales
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = salesStatusFilter === 'todos' || r.status === salesStatusFilter;
    const matchesSearch =
      r.id.toLowerCase().includes(searchReservation.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchReservation.toLowerCase()) ||
      r.customerEmail.toLowerCase().includes(searchReservation.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Open email composer with predefined templates
  const openEmailComposer = (res: Reservation, type: 'cotizacion' | 'seguimiento' | 'confirmacion_voucher' | 'declinacion') => {
    setSelectedResForDetail(res);
    setEmailType(type);

    if (type === 'cotizacion') {
      setEmailSubject(`Propuesta Económica & Itinerario Sumaq Kawsay · Código ${res.id}`);
      setEmailBody(
        `Estimado(a) ${res.customerName},

Es un placer saludarle de parte de Sumaq Kawsay e Inka Lab Km 84.
Hemos revisado su solicitud para viajar el ${res.travelDate} con ${res.guestsCount} personas.

Su propuesta incluye:
- Hospedaje: ${res.stayItem?.name || 'Pasadía sin pernocte'}
- Actividades: ${res.activities.map((a) => a.name).join(', ') || 'A definir'}
- Alimentación: ${res.meals.map((m) => m.name).join(', ') || 'A definir'}

TOTAL ESTIMADO: S/ ${res.totalPEN} ($${res.totalUSD} USD)

Para asegurar su lugar en el aforo limitado de Km 84, le invitamos a abonar un anticipo del 50% vía BCP, Interbank o Yape.

Atentamente,
${res.assignedAgent}
Sumaq Kawsay · Inka Lab Km 84`
      );
    } else if (type === 'confirmacion_voucher') {
      setEmailSubject(`¡Venta Concretada y Voucher Emitido! · Código ${res.id}`);
      setEmailBody(
        `Estimado(a) ${res.customerName},

¡Confirmamos con alegría que su reserva ha sido CONCRETADA y su pago verificado!
Adjuntamos su Comprobante Oficial (${res.invoiceType === 'factura' ? 'Factura' : 'Boleta'} ${res.invoiceNumber || 'B001-XXXX'}) y su Pase de Ingreso para el Km 84 de Ollantaytambo.

Fecha de inicio: ${res.travelDate}
Huéspedes: ${res.guestsCount}

Puede revisar su itinerario y descargar su voucher en cualquier momento desde nuestro portal con su código ${res.id}.

¡Bienvenido(a) al Buen Vivir de los Andes!
Sumaq Kawsay · Operador Turístico Oficial`
      );
    } else if (type === 'declinacion') {
      setEmailSubject(`Notificación sobre su Solicitud de Reserva ${res.id} · Sumaq Kawsay`);
      setEmailBody(
        `Estimado(a) ${res.customerName},

Le informamos que su solicitud ${res.id} ha sido marcada como declinada en nuestro sistema debido a:
"${res.declineReason || 'Cambio en las fechas o presupuesto'}".

Los cupos han sido liberados. Si en el futuro desea reprogramar su experiencia en los Andes, estaremos gustosos de recibirle.

Atentamente,
Área Comercial · Sumaq Kawsay`
      );
    } else {
      setEmailSubject(`Recordatorio Amistoso de Disponibilidad · Reserva ${res.id}`);
      setEmailBody(
        `Hola ${res.customerName}, le escribimos para recordarle que tenemos retenido temporalmente su aforo para el ${res.travelDate}. Por favor indíquenos si desea proceder con la confirmación.

Saludos cordiales,
${res.assignedAgent}`
      );
    }

    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedResForDetail) return;
    await sendReservationEmail(selectedResForDetail.id, {
      sender: 'ventas@sumaqkawsay.pe',
      recipient: selectedResForDetail.customerEmail,
      subject: emailSubject,
      body: emailBody,
      type: emailType,
    });
    showNotification(`Correo electrónico comercial enviado a ${selectedResForDetail.customerEmail}`);
    setEmailModalOpen(false);
  };

  // Conclude Sale
  const handleConfirmConcludeSale = async () => {
    if (!selectedResForDetail) return;
    const invNum = closingInvoiceNum.trim() || `B001-000${100 + reservations.length}`;
    await updateReservationPayment(
      selectedResForDetail.id,
      'pagado_100',
      closingMethod,
      closingInvoiceType,
      invNum
    );
    await updateReservationStatus(selectedResForDetail.id, 'concretado');
    showNotification(`¡Venta Concretada! Se descontó el stock de las áreas y se registró el ingreso en Contabilidad.`);
    setClosingSaleModalOpen(false);
  };

  // Decline Sale
  const handleConfirmDeclineSale = async () => {
    if (!selectedResForDetail) return;
    await updateReservationStatus(selectedResForDetail.id, 'declinado', declineReasonInput);
    showNotification(`Venta declinada. El stock retenido se ha liberado nuevamente.`);
    setDeclineModalOpen(false);
  };

  // Accounting calculations
  const totalSalesConcretedPEN = reservations
    .filter((r) => r.status === 'concretado')
    .reduce((acc, r) => acc + r.totalPEN, 0);

  const totalSalesConcretedUSD = reservations
    .filter((r) => r.status === 'concretado')
    .reduce((acc, r) => acc + r.totalUSD, 0);

  const totalCostPEN = reservations
    .filter((r) => r.status === 'concretado')
    .reduce((acc, r) => acc + r.totalCostPEN, 0);

  const grossMarginPEN = totalSalesConcretedPEN - totalCostPEN;
  const grossMarginPercent =
    totalSalesConcretedPEN > 0
      ? ((grossMarginPEN / totalSalesConcretedPEN) * 100).toFixed(1)
      : '0';

  const estimatedIGVPEN = (totalSalesConcretedPEN * 0.18).toFixed(2);

  const totalPendingProvidersDebt = providers.reduce(
    (acc, p) => acc + p.pendingBalancePEN,
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-[#FDFBF7] w-full max-w-6xl rounded-3xl shadow-2xl border-2 border-[#F6A935] my-4 max-h-[95vh] flex flex-col overflow-hidden text-[#1C1917]">
        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-4 right-1/2 translate-x-1/2 z-50 bg-[#181513] text-[#F6A935] px-6 py-2.5 rounded-full border border-[#F6A935] shadow-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Header Ribbon */}
        <div className="bg-[#181513] text-stone-100 px-5 sm:px-8 py-3.5 border-b-2 border-[#F6A935]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#221E1B] border border-[#F6A935] flex items-center justify-center text-[#F6A935]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-xs font-mono uppercase tracking-widest text-[#F6A935] block font-bold">
                PORTAL EMPRESARIAL & SISTEMA DE ROLES INTERCONECTADO
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-black text-white">
                Sumaq Kawsay ERP · Sistema Integrado
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-stone-400 hidden md:inline">
              Gestión Multi-Rol
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Switcher Toolbar (Crucial for testing & operational flow) */}
        <div className="bg-[#241F1C] px-4 sm:px-8 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-mono uppercase text-stone-400 mr-1 hidden sm:inline">
              Rol Activo:
            </span>

            {/* Role 1: Ventas y Marketing */}
            <button
              onClick={() => setCurrentRole('ventas')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeRole === 'ventas'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Ventas & Marketing</span>
            </button>

            {/* Role 2: Contador */}
            <button
              onClick={() => setCurrentRole('contador')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeRole === 'contador'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Contador (Finanzas)</span>
            </button>

            {/* Role 3: Administrador */}
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#F6A935] text-[#181513] shadow-md ring-2 ring-[#FDE8B5]'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrador General</span>
            </button>

            {/* Role 4: Usuario / Cliente */}
            <button
              onClick={() => setCurrentRole('usuario')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                activeRole === 'usuario'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-300'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Vista Turista / Cliente</span>
            </button>
          </div>

          {/* Quick Manuals button */}
          <button
            onClick={() => openManualModal('sistema')}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#F6A935] text-xs font-bold flex items-center gap-1.5 border border-[#F6A935]/40 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ver Manuales</span>
          </button>
        </div>

        {/* Dynamic Role Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* 1. VENTAS Y MARKETING */}
          {/* ========================================================================= */}
          {activeRole === 'ventas' && (
            <div className="space-y-6">
              {/* Sales Header & KPIs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-blue-200 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded-md mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>EMBUDO COMERCIAL & SEGUIMIENTO DE CLIENTES</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-stone-900">
                    Bandeja de Ventas y Pipeline de Reservas
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    Gestiona cotizaciones, envía correos preformateados por email o WhatsApp, concreta ventas o declínalas liberando stock.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs uppercase font-bold text-stone-500 block">Total en Seguimiento:</span>
                    <span className="font-mono text-lg font-black text-blue-700">
                      {reservations.filter((r) => r.status !== 'concretado' && r.status !== 'declinado').length} activas
                    </span>
                  </div>
                  <div className="text-right pl-3 border-l border-stone-200">
                    <span className="text-xs uppercase font-bold text-stone-500 block">Concretadas:</span>
                    <span className="font-mono text-lg font-black text-emerald-700">
                      {reservations.filter((r) => r.status === 'concretado').length} ventas
                    </span>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-100 p-3 rounded-2xl">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-xs font-bold text-stone-600 mr-1">Estado:</span>
                  {(['todos', 'cotizado', 'en_seguimiento', 'concretado', 'declinado'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSalesStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                        salesStatusFilter === st
                          ? 'bg-[#181513] text-[#F6A935]'
                          : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchReservation}
                    onChange={(e) => setSearchReservation(e.target.value)}
                    placeholder="Buscar cliente o código..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Reservations Table / Cards */}
              <div className="space-y-4">
                {filteredReservations.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
                    No se encontraron reservas con los filtros seleccionados.
                  </div>
                ) : (
                  filteredReservations.map((res) => {
                    const isConcreted = res.status === 'concretado';
                    const isDeclined = res.status === 'declinado';

                    return (
                      <div
                        key={res.id}
                        className={`bg-white rounded-2xl p-5 border-2 transition-all shadow-xs space-y-4 ${
                          isConcreted
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : isDeclined
                            ? 'border-red-200 bg-red-50/20 opacity-75'
                            : 'border-stone-200 hover:border-blue-400'
                        }`}
                      >
                        {/* Card top */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-base font-black text-[#442A19] bg-stone-100 px-2.5 py-1 rounded-lg">
                              {res.id}
                            </span>
                            <div>
                              <h4 className="font-heading font-extrabold text-stone-900 text-base">
                                {res.customerName}
                              </h4>
                              <span className="text-xs text-stone-500">
                                {res.customerEmail} · {res.customerPhone}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs uppercase font-extrabold px-3 py-1 rounded-xl border ${
                                isConcreted
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : isDeclined
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : res.status === 'en_seguimiento'
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {res.status.replace('_', ' ')}
                            </span>

                            <div className="text-right pl-3 border-l">
                              <span className="font-mono font-black text-base text-[#442A19]">
                                S/ {res.totalPEN}
                              </span>
                              <span className="text-xs text-stone-500 block">
                                (${res.totalUSD} USD)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200">
                          <div>
                            <span className="text-stone-500 block font-semibold">Fecha de Viaje:</span>
                            <strong className="text-stone-800">{res.travelDate}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 block font-semibold">Huéspedes:</span>
                            <strong className="text-stone-800">{res.guestsCount} personas</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 block font-semibold">Hospedaje:</span>
                            <span className="text-stone-800 truncate block">
                              {res.stayItem?.name || 'Pasadía sin pernocte'}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-500 block font-semibold">Margen Estimado:</span>
                            <strong className="text-emerald-700 font-mono">
                              S/ {res.grossMarginPEN} ({((res.grossMarginPEN / res.totalPEN) * 100).toFixed(0)}%)
                            </strong>
                          </div>
                        </div>

                        {/* Decline reason if any */}
                        {isDeclined && res.declineReason && (
                          <div className="text-xs text-red-700 bg-red-100/50 p-2.5 rounded-lg border border-red-200">
                            <strong>Motivo de declinación:</strong> {res.declineReason}
                          </div>
                        )}

                        {/* Action Buttons for Sales Agent */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          {/* Left: Communications */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEmailComposer(res, 'cotizacion')}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors border"
                            >
                              <Mail className="w-3.5 h-3.5 text-blue-600" />
                              <span>Enviar Email Comercial</span>
                            </button>

                            <a
                              href={`https://wa.me/${res.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hola ${res.customerName}, te escribo de Sumaq Kawsay & Inka Lab respecto a tu reserva ${res.id}. ¿Te gustaría confirmar los detalles del viaje?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-300"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>

                            {res.emailLogs?.length > 0 && (
                              <span className="text-xs text-stone-500">
                                ({res.emailLogs.length} emails registrados)
                              </span>
                            )}
                          </div>

                          {/* Right: Pipeline Decisions */}
                          <div className="flex items-center gap-2">
                            {!isConcreted && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedResForDetail(res);
                                    setClosingInvoiceNum(`B001-000${100 + reservations.length}`);
                                    setClosingSaleModalOpen(true);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Concretar Venta</span>
                                </button>

                                {!isDeclined && (
                                  <button
                                    onClick={() => {
                                      setSelectedResForDetail(res);
                                      setDeclineModalOpen(true);
                                    }}
                                    className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all border border-red-200"
                                  >
                                    <span>Declinar</span>
                                  </button>
                                )}
                              </>
                            )}

                            {isConcreted && (
                              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>Venta Cerrada · Comprobante {res.invoiceNumber}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CONTADOR & FINANZAS */}
          {/* ========================================================================= */}
          {activeRole === 'contador' && (
            <div className="space-y-6">
              {/* Accounting Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-md mb-1">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>MÓDULO CONTABLE, TRIBUTARIO & PROVEEDORES</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-stone-900">
                    Control Financiero & Facturación
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    Libro diario de ventas, conciliación de comprobantes, márgenes de utilidad y liquidación a proveedores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 border"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Exportar / Imprimir Libro</span>
                  </button>
                </div>
              </div>

              {/* Financial Dashboard KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-xs space-y-1">
                  <span className="text-xs font-bold uppercase text-stone-500 block">
                    Ventas Brutas Concretadas
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-emerald-700">
                    S/ {totalSalesConcretedPEN.toLocaleString()}
                  </div>
                  <span className="text-xs text-stone-500 block">
                    ${totalSalesConcretedUSD.toLocaleString()} USD
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs space-y-1">
                  <span className="text-xs font-bold uppercase text-stone-500 block">
                    Costos de Operación / Proveedor
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-stone-800">
                    S/ {totalCostPEN.toLocaleString()}
                  </div>
                  <span className="text-xs text-stone-500 block">
                    Guías, insumos, traslados
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-[#F6A935] shadow-xs space-y-1">
                  <span className="text-xs font-bold uppercase text-stone-500 block">
                    Margen de Ganancia Neta
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-[#442A19]">
                    S/ {grossMarginPEN.toLocaleString()}
                  </div>
                  <span className="text-xs font-bold text-emerald-600 block">
                    {grossMarginPercent}% de rentabilidad
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-1">
                  <span className="text-xs font-bold uppercase text-stone-500 block">
                    Deuda por Liquidar a Proveedores
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-700">
                    S/ {totalPendingProvidersDebt.toLocaleString()}
                  </div>
                  <span className="text-xs text-stone-500 block">
                    {providers.filter((p) => p.pendingBalancePEN > 0).length} proveedores pendientes
                  </span>
                </div>
              </div>

              {/* Providers Liquidation Table */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h4 className="font-heading font-extrabold text-stone-900 text-base">
                      Cuentas por Pagar & Liquidación a Proveedores Comunales
                    </h4>
                    <p className="text-xs text-stone-500">
                      Costos devengados por ventas concretadas hacia la comunidad de Chillca y cooperativas aliadas.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-600 font-bold uppercase border-b">
                      <tr>
                        <th className="py-2.5 px-3">Proveedor</th>
                        <th className="py-2.5 px-3">Categoría</th>
                        <th className="py-2.5 px-3">RUC / DNI</th>
                        <th className="py-2.5 px-3">Saldo Pendiente</th>
                        <th className="py-2.5 px-3">Total Liquidado</th>
                        <th className="py-2.5 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {providers.map((prov) => (
                        <tr key={prov.id} className="hover:bg-stone-50/60">
                          <td className="py-3 px-3 font-bold text-stone-900">
                            {prov.name}
                            <span className="block text-xs text-stone-500 font-normal">
                              Contacto: {prov.contactPerson} ({prov.phone})
                            </span>
                          </td>
                          <td className="py-3 px-3 text-stone-700">{prov.category}</td>
                          <td className="py-3 px-3 font-mono text-stone-600">{prov.rucOrDni}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-mono font-bold ${
                                prov.pendingBalancePEN > 0 ? 'text-amber-700' : 'text-stone-400'
                              }`}
                            >
                              S/ {prov.pendingBalancePEN.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-700">
                            S/ {prov.totalPaidPEN.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {prov.pendingBalancePEN > 0 ? (
                              <button
                                onClick={() => {
                                  setSelectedProviderToPay(prov);
                                  setPayAmountInput(prov.pendingBalancePEN);
                                  setPayProviderModalOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                              >
                                Liquidar Pago
                              </button>
                            ) : (
                              <span className="text-xs text-stone-400 font-semibold">Al día</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transactions Ledger (Libro Diario) */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-heading font-extrabold text-stone-900 text-base">
                    Libro Diario de Ingresos y Egresos
                  </h4>

                  <div className="flex items-center gap-1.5">
                    {(['todos', 'ingreso', 'egreso'] as const).map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setAccountingFilter(tp)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                          accountingFilter === tp
                            ? 'bg-[#181513] text-[#F6A935]'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {accountingEntries
                    .filter((tx) => accountingFilter === 'todos' || tx.type === accountingFilter)
                    .map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              tx.type === 'ingreso'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tx.type === 'ingreso' ? '+' : '-'}
                          </span>
                          <div>
                            <strong className="text-stone-900 block">{tx.concept}</strong>
                            <span className="text-xs text-stone-500">
                              {new Date(tx.date).toLocaleDateString()} · {tx.category} · Registrado por {tx.registeredBy}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-mono text-sm font-black ${
                              tx.type === 'ingreso' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {tx.type === 'ingreso' ? '+' : '-'} S/ {tx.amountPEN}
                          </span>
                          <span className="text-xs text-stone-400 block font-mono">
                            ${tx.amountUSD} USD
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. ADMINISTRADOR GENERAL */}
          {/* ========================================================================= */}
          {activeRole === 'admin' && (
            <div className="space-y-6">
              {/* Admin Header & Sub-nav */}
              <div className="bg-[#181513] text-stone-100 p-5 rounded-2xl border-2 border-[#F6A935] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#F6A935] uppercase bg-[#221E1B] px-2.5 py-1 rounded-md mb-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>PANEL DE CONTROL TOTAL & AUDITORÍA</span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
                    Administración de Capacidad, Stock & Proveedores
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm mt-0.5">
                    Ajuste de aforos por área, catálogo de proveedores y configuración de la empresa.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminSubTab('stock')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      adminSubTab === 'stock'
                        ? 'bg-[#F6A935] text-[#181513]'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Control de Stock por Área
                  </button>
                  <button
                    onClick={() => setAdminSubTab('providers')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      adminSubTab === 'providers'
                        ? 'bg-[#F6A935] text-[#181513]'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    Proveedores
                  </button>
                </div>
              </div>

              {/* Sub-tab: Stock Control por Área */}
              {adminSubTab === 'stock' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-extrabold text-stone-900 text-base">
                      Inventario & Aforos en Tiempo Real por Área
                    </h4>
                    <span className="text-xs text-stone-500">
                      Total items monitoreados: {stockItems.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stockItems.map((item) => {
                      const available = item.capacityMax - item.booked;
                      const isLow = available <= 2;
                      const isZero = available <= 0;

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 border-2 border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs uppercase font-bold text-stone-400 block">
                                  Área: {item.area}
                                </span>
                                <h5 className="font-heading font-extrabold text-stone-900 text-sm leading-tight">
                                  {item.name}
                                </h5>
                              </div>

                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  isZero
                                    ? 'bg-red-100 text-red-700'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {available} disponibles
                              </span>
                            </div>

                            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          {/* Stock bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-stone-600 font-semibold">
                              <span>Ocupado: {item.booked}</span>
                              <span>Capacidad Máx: {item.capacityMax}</span>
                            </div>
                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  isZero ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                  width: `${Math.min(100, (item.booked / item.capacityMax) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Prices & Actions */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <div>
                              <span className="font-mono text-sm font-black text-[#442A19] block">
                                S/ {item.unitPricePEN}
                              </span>
                              <span className="text-xs text-stone-500">
                                Costo: S/ {item.costPricePEN}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setEditingStockItem(item);
                                setStockEditCapacity(item.capacityMax);
                                setStockEditPricePEN(item.unitPricePEN);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 border"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Editar Cupos</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-tab: Providers */}
              {adminSubTab === 'providers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-extrabold text-stone-900 text-base">
                        Directorio de Proveedores y Aliados Comunales
                      </h4>
                      <p className="text-xs text-stone-500">
                        Convenios con la comunidad de Chillca, arrieros y transporte.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsNewProviderModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nuevo Proveedor</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providers.map((prov) => (
                      <div
                        key={prov.id}
                        className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-stone-400 uppercase block">
                              {prov.category}
                            </span>
                            <h5 className="font-heading font-extrabold text-stone-900 text-base">
                              {prov.name}
                            </h5>
                            <span className="text-xs text-stone-500 font-mono">
                              RUC / DNI: {prov.rucOrDni}
                            </span>
                          </div>

                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                            Deuda: S/ {prov.pendingBalancePEN}
                          </span>
                        </div>

                        <div className="text-xs text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          <div>
                            <strong>Contacto:</strong> {prov.contactPerson} ({prov.phone})
                          </div>
                          <div>
                            <strong>Ubicación:</strong> {prov.location}
                          </div>
                          <div>
                            <strong>Total Histórico Pagado:</strong> S/ {prov.totalPaidPEN.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. VISTA TURISTA / CLIENTE */}
          {/* ========================================================================= */}
          {activeRole === 'usuario' && (
            <div className="text-center py-10 px-4 max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center border-2 border-purple-300">
                <User className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#F6A935] font-bold bg-[#181513] px-3 py-1 rounded-md inline-block mb-2">
                  MODO DE VISITA Y CLIENTE
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-stone-900">
                  Experiencia del Huésped y Turista
                </h3>
                <p className="text-stone-600 text-sm mt-1 leading-relaxed">
                  Desde aquí el viajero diseña su itinerario completo en Inka Lab Km 84 (Hospedaje, Actividades, Alimentación) y consulta en tiempo real el estado de su orden.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    openBookingWizard();
                  }}
                  className="p-5 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#F6A935] shadow-md text-left space-y-2 group transition-all"
                >
                  <Calendar className="w-6 h-6 text-[#F6A935]" />
                  <strong className="block text-stone-900 text-base font-extrabold group-hover:text-[#442A19]">
                    Flujo de Reserva Integral (4 Pasos)
                  </strong>
                  <p className="text-xs text-stone-600">
                    Abre el cotizador interactivo: Hospedaje → Actividades → Alimentación → Extras.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    openOrderTracker();
                  }}
                  className="p-5 rounded-2xl bg-white hover:bg-stone-50 border-2 border-purple-300 shadow-md text-left space-y-2 group transition-all"
                >
                  <Clock className="w-6 h-6 text-purple-600" />
                  <strong className="block text-stone-900 text-base font-extrabold group-hover:text-purple-800">
                    Rastrear mi Reserva Activa
                  </strong>
                  <p className="text-xs text-stone-600">
                    Ingresa con tu código SQ-2026-XXXX para ver estado de confirmación y vouchers.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-MODAL: EMAIL COMPOSER (VENTAS) */}
        {/* ========================================================================= */}
        {emailModalOpen && selectedResForDetail && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border-2 border-blue-400 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-heading font-extrabold text-stone-900 text-base">
                    Enviar Correo Corporativo de Ventas
                  </h4>
                </div>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-600 block font-semibold mb-1">Para (Destinatario):</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedResForDetail.customerName} <${selectedResForDetail.customerEmail}>`}
                    className="w-full px-3 py-1.5 bg-stone-100 rounded-lg border text-stone-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-600 block font-semibold mb-1">Asunto:</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-stone-600 block font-semibold mb-1">Cuerpo del Correo:</label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-sans text-xs text-stone-800 leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Correo y Registrar en Historial</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: CONCLUIR VENTA (VENTAS) */}
        {/* ========================================================================= */}
        {closingSaleModalOpen && selectedResForDetail && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-emerald-400 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-heading font-extrabold text-stone-900 text-base">
                    Concretar Venta & Emitir Comprobante
                  </h4>
                </div>
                <button
                  onClick={() => setClosingSaleModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Al confirmar, se descontará automáticamente el stock reservado en Km 84, se emitirá el comprobante electrónico oficial y se registrará la deuda de costos hacia los proveedores.
              </p>

              <div className="space-y-3 text-xs bg-stone-50 p-4 rounded-xl border">
                <div>
                  <span className="text-stone-500 block">Total a Concretar:</span>
                  <strong className="font-mono text-base text-emerald-700 font-black">
                    S/ {selectedResForDetail.totalPEN} (${selectedResForDetail.totalUSD} USD)
                  </strong>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Método de Pago Verificado:</label>
                  <select
                    value={closingMethod}
                    onChange={(e) => setClosingMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white"
                  >
                    <option value="transferencia_bcp">Transferencia BCP</option>
                    <option value="yape_plin">Yape / Plin Empresarial</option>
                    <option value="interbank">Interbank</option>
                    <option value="tarjeta">Tarjeta Débito / Crédito</option>
                    <option value="efectivo">Efectivo en Recepción</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Tipo de Comprobante:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={closingInvoiceType === 'boleta'}
                        onChange={() => setClosingInvoiceType('boleta')}
                      />
                      <span>Boleta de Venta</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={closingInvoiceType === 'factura'}
                        onChange={() => setClosingInvoiceType('factura')}
                      />
                      <span>Factura con RUC</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Número Correlativo:</label>
                  <input
                    type="text"
                    value={closingInvoiceNum}
                    onChange={(e) => setClosingInvoiceNum(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setClosingSaleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmConcludeSale}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  Confirmar Venta y Descontar Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: DECLINAR VENTA (VENTAS) */}
        {/* ========================================================================= */}
        {declineModalOpen && selectedResForDetail && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-red-300 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-heading font-extrabold text-stone-900 text-base">
                    Declinar Solicitud de Reserva
                  </h4>
                </div>
                <button
                  onClick={() => setDeclineModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Al declinar, el cupo retenido de hospedaje, actividades y cocina volverá a estar disponible para el público general.
              </p>

              <div className="space-y-2 text-xs">
                <label className="text-stone-700 block font-bold">Motivo de Declinación:</label>
                <textarea
                  rows={3}
                  value={declineReasonInput}
                  onChange={(e) => setDeclineReasonInput(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Ej. Fuera de presupuesto, cambio de planes de viaje, sin respuesta..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setDeclineModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeclineSale}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md"
                >
                  Declinar y Liberar Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: LIQUIDAR PROVEEDOR (CONTADOR) */}
        {/* ========================================================================= */}
        {payProviderModalOpen && selectedProviderToPay && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-emerald-400 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-heading font-extrabold text-stone-900 text-base">
                    Liquidar Pago a Proveedor Comunal
                  </h4>
                </div>
                <button
                  onClick={() => setPayProviderModalOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs bg-stone-50 p-4 rounded-xl border">
                <div>
                  <span className="text-stone-500 block">Proveedor:</span>
                  <strong className="text-stone-900 text-sm">{selectedProviderToPay.name}</strong>
                  <span className="text-xs text-stone-500 block">
                    {selectedProviderToPay.category} · RUC/DNI: {selectedProviderToPay.rucOrDni}
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block">Saldo Pendiente Actual:</span>
                  <span className="font-mono text-base font-black text-amber-700">
                    S/ {selectedProviderToPay.pendingBalancePEN}
                  </span>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Monto a Liquidar (PEN):</label>
                  <input
                    type="number"
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Concepto de Pago:</label>
                  <input
                    type="text"
                    value={payConceptInput}
                    onChange={(e) => setPayConceptInput(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Medio de Liquidación:</label>
                  <select
                    value={payMethodInput}
                    onChange={(e) => setPayMethodInput(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-1.5 border rounded-lg bg-white"
                  >
                    <option value="transferencia_bcp">Transferencia BCP</option>
                    <option value="yape_plin">Yape / Plin</option>
                    <option value="efectivo">Efectivo con Recibo de Egresos</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setPayProviderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await payProvider(
                      selectedProviderToPay.id,
                      payAmountInput,
                      payConceptInput,
                      payMethodInput
                    );
                    showNotification(`Liquidación de S/ ${payAmountInput} efectuada exitosamente.`);
                    setPayProviderModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Registrar Pago y Descontar Deuda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: EDITAR STOCK / AFORO (ADMIN) */}
        {/* ========================================================================= */}
        {editingStockItem && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border-2 border-[#F6A935] shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-heading font-extrabold text-stone-900 text-base">
                  Ajustar Capacidad / Aforo
                </h4>
                <button
                  onClick={() => setEditingStockItem(null)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-stone-500 block font-semibold">Elemento:</span>
                  <strong className="text-stone-900 text-sm">{editingStockItem.name}</strong>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">
                    Aforo / Capacidad Máxima ({editingStockItem.unitLabel}):
                  </label>
                  <input
                    type="number"
                    value={stockEditCapacity}
                    onChange={(e) => setStockEditCapacity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">
                    Precio Unitario PEN:
                  </label>
                  <input
                    type="number"
                    value={stockEditPricePEN}
                    onChange={(e) => setStockEditPricePEN(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setEditingStockItem(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    await updateStockItem({
                      ...editingStockItem,
                      capacityMax: stockEditCapacity,
                      unitPricePEN: stockEditPricePEN,
                      unitPriceUSD: Number((stockEditPricePEN / 3.75).toFixed(0)),
                    });
                    showNotification('Aforo e inventario actualizado.');
                    setEditingStockItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] text-xs font-bold shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODAL: NUEVO PROVEEDOR (ADMIN) */}
        {/* ========================================================================= */}
        {isNewProviderModal && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border-2 border-stone-300 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-heading font-extrabold text-stone-900 text-base">
                  Registrar Nuevo Proveedor / Aliado
                </h4>
                <button
                  onClick={() => setIsNewProviderModal(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-700 block font-bold mb-1">Nombre Comercial / Organización:</label>
                  <input
                    type="text"
                    value={newProvName}
                    onChange={(e) => setNewProvName(e.target.value)}
                    placeholder="Ej. Asociación de Arrieros de Chillca"
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">RUC o DNI:</label>
                  <input
                    type="text"
                    value={newProvRuc}
                    onChange={(e) => setNewProvRuc(e.target.value)}
                    placeholder="20600000000"
                    className="w-full px-3 py-1.5 border rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Categoría:</label>
                  <select
                    value={newProvCategory}
                    onChange={(e) => setNewProvCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border rounded-lg"
                  >
                    <option value="Guías & Arrieros Comunales">Guías & Arrieros Comunales</option>
                    <option value="Alimentos & Huerto Orgánico">Alimentos & Huerto Orgánico</option>
                    <option value="Transporte Turístico">Transporte Turístico</option>
                    <option value="Alojamiento & Mantenimiento">Alojamiento & Mantenimiento</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Persona de Contacto:</label>
                  <input
                    type="text"
                    value={newProvContact}
                    onChange={(e) => setNewProvContact(e.target.value)}
                    placeholder="Ej. Don Cipriano Quispe"
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-stone-700 block font-bold mb-1">Teléfono:</label>
                  <input
                    type="text"
                    value={newProvPhone}
                    onChange={(e) => setNewProvPhone(e.target.value)}
                    placeholder="+51 984 000 000"
                    className="w-full px-3 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setIsNewProviderModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!newProvName) return;
                    await addProvider({
                      id: `prov-${Date.now()}`,
                      name: newProvName,
                      businessName: newProvName,
                      rucOrDni: newProvRuc || 'S/N',
                      category: newProvCategory,
                      contactPerson: newProvContact || 'Representante Legal',
                      phone: newProvPhone || '+51 984 000 000',
                      email: 'contacto@proveedor.pe',
                      location: 'Valle Sagrado, Urubamba',
                      pendingBalancePEN: 0,
                      totalPaidPEN: 0,
                    });
                    showNotification('Proveedor registrado con éxito.');
                    setIsNewProviderModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] text-xs font-bold shadow-md"
                >
                  Registrar Proveedor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
