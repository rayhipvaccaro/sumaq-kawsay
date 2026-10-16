'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { ItemWhen } from './ItemWhen';
import {
  X,
  Bed,
  Compass,
  UtensilsCrossed,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  MessageCircle,
  Copy,
  Info,
  Flame,
  AlertCircle,
  Car,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';
import { docError, normDoc } from '@/lib/docs';
import { StockItem, ReservationItemSelection } from '@/data/businessData';

interface BookingFlowWizardProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'es' | 'en';
  currency?: string;
}

export function BookingFlowWizard({
  isOpen,
  onClose,
  lang = 'es',
  currency = 'PEN',
}: BookingFlowWizardProps) {
  const { stockItems, createReservation, openOrderTracker, bookingPreset, sessionUser } = useCMS();
  const isEs = lang === 'es';
  // Agencia con sesion: reserva para sus clientes y se le aplica su descuento fijo.
  const isAgency = sessionUser?.role === 'Agencia' && !sessionUser?.mustChangePassword;
  const tourist = sessionUser?.role === 'Turista' && !sessionUser?.mustChangePassword ? sessionUser : null;
  const agencyPct = isAgency ? Math.min(100, Math.max(0, Number(sessionUser?.discountPct ?? 0))) : 0;

  // Step state (1: Hospedaje, 2: Actividades, 3: Alimentación, 4: Extras, 5: Resumen & Confirmación)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State: Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDoc, setCustomerDoc] = useState('');
  const [customerDocType, setCustomerDocType] = useState<'DNI' | 'PASAPORTE'>('DNI');
  const [passengersText, setPassengersText] = useState('');

  // Turista con sesion: sus datos se autocompletan y la reserva queda en su cuenta.
  useEffect(() => {
    if (!tourist) return;
    setCustomerEmail((v) => v || tourist.username);
    setCustomerName((v) => v || tourist.fullName || '');
    if (tourist.docNumber) {
      setCustomerDoc((v) => v || tourist.docNumber || '');
      if (tourist.docType === 'DNI' || tourist.docType === 'PASAPORTE') setCustomerDocType(tourist.docType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourist?.id]);
  const [notes, setNotes] = useState('');

  // Trip Dates & Guests
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [nightsCount, setNightsCount] = useState<number>(2);
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const arrivalTime = '09:00'; // hora por defecto de cada tarjeta
  const [itemWhen, setItemWhen] = useState<Record<string, { date: string; time: string }>>({});
  const [itemFree, setItemFree] = useState<Record<string, number | null>>({});
  const whenOf = (id: string) => itemWhen[id] ?? { date: travelDate, time: arrivalTime };

  // Selections
  // Step 1: Hospedaje (1 item selected or null for only day activities)
  const [selectedStayId, setSelectedStayId] = useState<string>('');

  // Step 2: Actividades (array of selected activity IDs with guest counts)
  const [selectedActivities, setSelectedActivities] = useState<Record<string, number>>({});

  // Step 3: Alimentación (array of meal IDs with quantities)
  const [selectedMeals, setSelectedMeals] = useState<Record<string, number>>({});

  // Step 4: Extras & Traslados
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});

  // Post-submit state
  const [createdReservationId, setCreatedReservationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Aplica lo elegido en el buscador del home al abrir el asistente
  const [appliedPreset, setAppliedPreset] = useState<typeof bookingPreset>(null);
  if (isOpen && bookingPreset && bookingPreset !== appliedPreset) {
    setAppliedPreset(bookingPreset);
    if (bookingPreset.date) setTravelDate(bookingPreset.date);
    if (bookingPreset.guests) setGuestsCount(bookingPreset.guests);
    const presetId = bookingPreset.experienceId;
    if (presetId?.startsWith('hosp-')) {
      setSelectedStayId(presetId);
    } else if (presetId?.startsWith('act-')) {
      setSelectedActivities((prev) => ({
        ...prev,
        [presetId]: bookingPreset.guests ?? prev[presetId] ?? 2,
      }));
    }
  } else if (!isOpen && appliedPreset) {
    setAppliedPreset(null);
  }

  // Stock categories
  const stayStock = useMemo(
    () => stockItems.filter((s) => s.area === 'hospedaje'),
    [stockItems]
  );
  const activitiesStock = useMemo(
    () => stockItems.filter((s) => s.area === 'actividades'),
    [stockItems]
  );
  const mealsStock = useMemo(
    () => stockItems.filter((s) => s.area === 'alimentacion'),
    [stockItems]
  );
  const extrasStock = useMemo(
    () => stockItems.filter((s) => s.area === 'extras'),
    [stockItems]
  );

  // Calculations
  const calculation = useMemo(() => {
    let totalPEN = 0;
    let totalUSD = 0;
    let totalCostPEN = 0;

    // 1. Stay
    let staySelection: ReservationItemSelection | null = null;
    if (selectedStayId && selectedStayId !== 'none') {
      const stayItem = stayStock.find((s) => s.id === selectedStayId);
      if (stayItem) {
        const subPEN = stayItem.unitPricePEN * nightsCount;
        const subUSD = stayItem.unitPriceUSD * nightsCount;
        const subCost = stayItem.costPricePEN * nightsCount;
        totalPEN += subPEN;
        totalUSD += subUSD;
        totalCostPEN += subCost;
        staySelection = {
          itemId: stayItem.id,
          name: stayItem.name,
          area: 'hospedaje',
          quantity: nightsCount,
          unitPricePEN: stayItem.unitPricePEN,
          unitPriceUSD: stayItem.unitPriceUSD,
          unitCostPEN: stayItem.costPricePEN,
          subtotalPEN: subPEN,
          subtotalUSD: subUSD,
          subtotalCostPEN: subCost,
          details: `${nightsCount} noche(s) · ${guestsCount} huésped(es)`,
        };
      }
    }

    // 2. Activities
    const actSelections: ReservationItemSelection[] = [];
    Object.entries(selectedActivities).forEach(([actId, qty]) => {
      if (qty > 0) {
        const item = activitiesStock.find((s) => s.id === actId);
        if (item) {
          const subPEN = item.unitPricePEN * qty;
          const subUSD = item.unitPriceUSD * qty;
          const subCost = item.costPricePEN * qty;
          totalPEN += subPEN;
          totalUSD += subUSD;
          totalCostPEN += subCost;
          actSelections.push({
            itemId: item.id,
            name: item.name,
            area: 'actividades',
            quantity: qty,
            unitPricePEN: item.unitPricePEN,
            unitPriceUSD: item.unitPriceUSD,
            unitCostPEN: item.costPricePEN,
            subtotalPEN: subPEN,
            subtotalUSD: subUSD,
            subtotalCostPEN: subCost,
            details: `${qty} participante(s)`,
          });
        }
      }
    });

    // 3. Meals
    const mealSelections: ReservationItemSelection[] = [];
    Object.entries(selectedMeals).forEach(([mealId, qty]) => {
      if (qty > 0) {
        const item = mealsStock.find((s) => s.id === mealId);
        if (item) {
          const subPEN = item.unitPricePEN * qty;
          const subUSD = item.unitPriceUSD * qty;
          const subCost = item.costPricePEN * qty;
          totalPEN += subPEN;
          totalUSD += subUSD;
          totalCostPEN += subCost;
          mealSelections.push({
            itemId: item.id,
            name: item.name,
            area: 'alimentacion',
            quantity: qty,
            unitPricePEN: item.unitPricePEN,
            unitPriceUSD: item.unitPriceUSD,
            unitCostPEN: item.costPricePEN,
            subtotalPEN: subPEN,
            subtotalUSD: subUSD,
            subtotalCostPEN: subCost,
            details: `${qty} ración(es)`,
          });
        }
      }
    });

    // 4. Extras
    const extraSelections: ReservationItemSelection[] = [];
    Object.entries(selectedExtras).forEach(([extraId, qty]) => {
      if (qty > 0) {
        const item = extrasStock.find((s) => s.id === extraId);
        if (item) {
          const subPEN = item.unitPricePEN * qty;
          const subUSD = item.unitPriceUSD * qty;
          const subCost = item.costPricePEN * qty;
          totalPEN += subPEN;
          totalUSD += subUSD;
          totalCostPEN += subCost;
          extraSelections.push({
            itemId: item.id,
            name: item.name,
            area: 'extras',
            quantity: qty,
            unitPricePEN: item.unitPricePEN,
            unitPriceUSD: item.unitPriceUSD,
            unitCostPEN: item.costPricePEN,
            subtotalPEN: subPEN,
            subtotalUSD: subUSD,
            subtotalCostPEN: subCost,
            details: `${qty} unidad(es)`,
          });
        }
      }
    });

    const listTotalPEN = totalPEN;
    const listTotalUSD = totalUSD;
    if (agencyPct > 0) {
      totalPEN = Math.round(totalPEN * (1 - agencyPct / 100) * 100) / 100;
      totalUSD = Math.round(totalUSD * (1 - agencyPct / 100) * 100) / 100;
    }
    const grossMarginPEN = totalPEN - totalCostPEN;

    return {
      listTotalPEN,
      listTotalUSD,
      totalPEN,
      totalUSD,
      totalCostPEN,
      grossMarginPEN,
      staySelection,
      actSelections,
      mealSelections,
      extraSelections,
    };
  }, [
    selectedStayId,
    selectedActivities,
    selectedMeals,
    selectedExtras,
    agencyPct,
    nightsCount,
    guestsCount,
    stayStock,
    activitiesStock,
    mealsStock,
    extrasStock,
  ]);

  // Cupos reales de la fecha elegida (desde Nest)
  const [dayData, setDayData] = useState<
    { date: string; map: Record<string, number | null> } | 'error' | null
  >(null);

  useEffect(() => {
    if (!isOpen || !/^\d{4}-\d{2}-\d{2}$/.test(travelDate)) return;
    let cancelled = false;
    fetch(`/api/availability?from=${travelDate}&to=${travelDate}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (cancelled) return;
        const map: Record<string, number | null> = {};
        for (const [id, days] of Object.entries(
          d.activities as Record<string, { date: string; free: number }[]>,
        )) {
          const day = days.find((x) => x.date === travelDate);
          map[id] = day ? day.free : null; // null = sin horario ese dia
        }
        setDayData({ date: travelDate, map });
      })
      .catch(() => {
        if (!cancelled) setDayData('error');
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, travelDate]);

  const dayCupos: Record<string, number | null> | 'error' | null =
    dayData === 'error' ? 'error' : dayData && dayData.date === travelDate ? dayData.map : null;
  const dateOk =
    dayCupos === null || dayCupos === 'error'
      ? true
      : Object.values(dayCupos).some((v) => (v ?? 0) > 0);
    const actProblems = Object.entries(selectedActivities).filter(([id, qty]) => {
    if (dayCupos === null || dayCupos === 'error' || !(id in dayCupos)) return false;
    const free = id in itemFree ? itemFree[id] : dayCupos[id];
    return (free ?? 0) < qty;
  });
  const blocked = (step === 1 && !dateOk) || (step === 2 && actProblems.length > 0);

  if (!isOpen) return null;
  
  // Toggle helpers
  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: guestsCount };
    });
  };

  const updateActivityCount = (id: string, delta: number) => {
    setSelectedActivities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const updateMealCount = (id: string, delta: number) => {
    setSelectedMeals((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const updateExtraCount = (id: string, delta: number) => {
    setSelectedExtras((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert(isEs ? 'Por favor completa tu nombre, correo y teléfono.' : 'Please enter name, email and phone.');
      return;
    }
    const dErr = docError(customerDocType, customerDoc, isEs);
    if (dErr) {
      alert(dErr);
      return;
    }

    setIsSubmitting(true);
    try {
            const nest = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: travelDate, arrivalTime, customerDoc, customerName, customerContact: `${customerEmail} | ${customerPhone}`, items: [...calculation.actSelections, ...calculation.extraSelections].map((a) => ({ id: a.itemId, name: a.name, quantity: a.quantity, date: whenOf(a.itemId).date, arrivalTime: whenOf(a.itemId).time })) }) }).then((r) => r.json()).catch(() => ({ ok: false, message: isEs ? 'Sin conexion con el servidor de reservas.' : 'Cannot reach the booking server.' }));
      if (!nest.ok) { alert(nest.message); return; }
      const reservationId = await createReservation({
        customerName,
        customerEmail,
        customerPhone,
        customerDniOrPassport: normDoc(customerDoc),
        customerDocType,
        ...(isAgency
          ? {
              listTotalPEN: calculation.listTotalPEN,
              listTotalUSD: calculation.listTotalUSD,
              passengers: passengersText
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)
                .slice(0, 40)
                .map((l) => {
                  const [name, ...rest] = l.split(/[,;|]/);
                  return { name: name.trim(), doc: rest.join(' ').trim() || undefined };
                }),
            }
          : {}),
        travelDate,
        guestsCount,
        notes,
        stayItem: calculation.staySelection,
        activities: calculation.actSelections,
        meals: calculation.mealSelections,
        extras: calculation.extraSelections,
        totalPEN: calculation.totalPEN,
        totalUSD: calculation.totalUSD,
        totalCostPEN: calculation.totalCostPEN,
        grossMarginPEN: calculation.grossMarginPEN,
        status: 'cotizado',
        assignedAgent: 'Valeria Cruz (Ventas & Marketing)',
        paymentStatus: 'pendiente',
        paymentMethod: 'transferencia_bcp',
        invoiceType: 'boleta',
      });

      setCreatedReservationId(reservationId);
    } catch (err) {
      console.error('Error creating reservation:', err);
      alert(isEs ? 'No se pudo registrar tu orden. Intenta de nuevo.' : 'Could not register your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (createdReservationId) {
      navigator.clipboard.writeText(createdReservationId);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  // Ingreso de turistas/agencias: correo ya escrito y aviso segun la cuenta.
  const loginHref = (() => {
    if (!createdReservationId) return '/ingresar';
    let a = '';
    try {
      a = localStorage.getItem(`sq_acct_${createdReservationId}`) ?? '';
    } catch {
      a = '';
    }
    return (
      `/ingresar?email=${encodeURIComponent(customerEmail.trim().toLowerCase())}` +
      `&reserva=${encodeURIComponent(createdReservationId)}${a === 'new' ? '&nueva=1' : ''}`
    );
  })();

  const composeWhatsAppLink = () => {
    if (!createdReservationId) return '#';
    const text = encodeURIComponent(
      `¡Hola Sumaq Kawsay & Inka Lab! Acabo de registrar mi Solicitud de Reserva Integral:
- Código de Orden: ${createdReservationId}
- Titular: ${customerName}
- Fecha Tentativa: ${travelDate} (${nightsCount} noches, ${guestsCount} huéspedes)
- Total Estimado: S/ ${calculation.totalPEN} ($${calculation.totalUSD} USD)
- Resumen:
  * Hospedaje: ${calculation.staySelection?.name || 'Solo Actividades'}
  * Actividades: ${calculation.actSelections.map((a) => a.name).join(', ') || 'Ninguna'}
  * Alimentación: ${calculation.mealSelections.map((m) => m.name).join(', ') || 'Ninguna'}

Quedo atento/a para la confirmación de disponibilidad con el área de Ventas.`
    );
    return `https://wa.me/51912189856?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-[#FDFBF7] w-full max-w-4xl rounded-3xl shadow-2xl border-2 border-[#F6A935] my-4 max-h-[92vh] flex flex-col overflow-hidden text-[#1C1917]">
        {/* Header Ribbon */}
        <div className="bg-[#181513] text-stone-100 px-5 sm:px-8 py-4 border-b-2 border-[#F6A935]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#221E1B] border border-[#F6A935] flex items-center justify-center text-[#F6A935]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F6A935] block font-bold">
                {isEs ? 'Flujo de Reserva Integral · Km 84' : 'All-in-One Booking Wizard · Km 84'}
              </span>
              <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-white">
                {isEs ? 'Diseña tu Experiencia Andina' : 'Design Your Andean Experience'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        {!createdReservationId && (
          <div className="bg-[#F5EFE6] px-4 sm:px-8 py-3 border-b border-[#F6A935]/30 shrink-0">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-600">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 1 ? 'text-[#442A19] font-extrabold' : 'hover:text-stone-900'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 1 ? 'bg-[#F6A935] text-[#181513] font-bold' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  1
                </span>
                <span className="hidden sm:inline">1. {isEs ? 'Hospedaje' : 'Stay'}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-stone-400" />

              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 2 ? 'text-[#442A19] font-extrabold' : 'hover:text-stone-900'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 2 ? 'bg-[#F6A935] text-[#181513] font-bold' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  2
                </span>
                <span className="hidden sm:inline">2. {isEs ? 'Actividades' : 'Activities'}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-stone-400" />

              <button
                onClick={() => setStep(3)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 3 ? 'text-[#442A19] font-extrabold' : 'hover:text-stone-900'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 3 ? 'bg-[#F6A935] text-[#181513] font-bold' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  3
                </span>
                <span className="hidden sm:inline">3. {isEs ? 'Alimentación' : 'Meals'}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-stone-400" />

              <button
                onClick={() => setStep(4)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 4 ? 'text-[#442A19] font-extrabold' : 'hover:text-stone-900'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step >= 4 ? 'bg-[#F6A935] text-[#181513] font-bold' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  4
                </span>
                <span className="hidden sm:inline">4. {isEs ? 'Extras' : 'Extras'}</span>
              </button>

              <ChevronRight className="w-4 h-4 text-stone-400" />

              <button
                onClick={() => setStep(5)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === 5 ? 'text-[#442A19] font-extrabold' : 'hover:text-stone-900'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === 5 ? 'bg-[#2E5A36] text-white font-bold' : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  5
                </span>
                <span className="hidden sm:inline">5. {isEs ? 'Cierre & Datos' : 'Finish'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* SUCCESS SCREEN */}
          {createdReservationId ? (
            <div className="text-center py-8 px-4 max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center border-2 border-emerald-400 shadow-lg">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#F6A935] font-bold bg-[#181513] px-3 py-1 rounded-md inline-block mb-3">
                  {isEs ? 'SOLICITUD REGISTRADA EN EL SISTEMA' : 'RESERVATION LOGGED IN SYSTEM'}
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#181513]">
                  {isEs ? '¡Tu reserva ha sido recibida con éxito!' : 'Your reservation has been received!'}
                </h3>
                <p className="text-stone-600 mt-2 text-sm sm:text-base leading-relaxed">
                  {isEs
                    ? 'Nuestro equipo de Ventas y Operaciones ha bloqueado temporalmente tus fechas y stock en Inka Lab Km 84. Te contactaremos vía correo y WhatsApp para validar tu reserva formal.'
                    : 'Our Sales and Operations desk has put a provisional hold on your slots at Inka Lab Km 84. We will contact you shortly to confirm.'}
                </p>
              </div>

              {/* Code Box */}
              <div className="bg-white border-2 border-[#F6A935] rounded-2xl p-5 shadow-md space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {isEs ? 'Código Único de Seguimiento:' : 'Unique Tracking Code:'}
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#442A19] tracking-wider">
                    {createdReservationId}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors border border-stone-300"
                    title={isEs ? 'Copiar código' : 'Copy code'}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {copiedCode && (
                  <span className="text-xs text-emerald-600 font-bold block">
                    {isEs ? '¡Código copiado al portapapeles!' : 'Code copied to clipboard!'}
                  </span>
                )}
                <div className="text-xs text-stone-500 pt-2 border-t border-stone-100 flex justify-between">
                  <span>
                    Total: <strong>S/ {calculation.totalPEN}</strong> (${calculation.totalUSD} USD)
                  </span>
                  <span>
                    Huéspedes: <strong>{guestsCount}</strong>
                  </span>
                </div>
              </div>

              {/* Cuenta del turista / agencia */}
              {(() => {
                let a = '';
                try {
                  a = localStorage.getItem(`sq_acct_${createdReservationId}`) ?? '';
                } catch {
                  a = '';
                }
                const box = 'text-left text-sm rounded-2xl border-2 p-4 space-y-2 ';
                if (isAgency) {
                  return (
                    <div className={box + 'border-amber-300 bg-amber-50 text-amber-900'}>
                      <p>{isEs ? 'Esta venta quedó registrada en tu cuenta de agencia.' : 'This sale was saved in your agency account.'}</p>
                    </div>
                  );
                }
                if (a === 'new') {
                  return (
                    <div className={box + 'border-emerald-300 bg-emerald-50 text-emerald-900'}>
                      <p className="font-bold">{isEs ? 'Creamos tu cuenta' : 'We created your account'}</p>
                      <p>
                        {isEs
                          ? `Entra con tu correo (${customerEmail}). Tu clave inicial es tu número de documento y te pediremos cambiarla. Ahí verás esta reserva y las próximas.`
                          : `Sign in with your email (${customerEmail}). Your first password is your document number and you will be asked to change it. You will see this and future bookings there.`}
                      </p>
                    </div>
                  );
                }
                if (a === 'linked') {
                  return (
                    <div className={box + 'border-emerald-300 bg-emerald-50 text-emerald-900'}>
                      <p>
                        {tourist
                          ? isEs ? 'Esta reserva quedó en tu cuenta.' : 'This booking is now in your account.'
                          : isEs ? 'Esta reserva se agregó a tu cuenta. Entra con tu correo para verla.' : 'This booking was added to your account. Sign in with your email to see it.'}
                      </p>
                    </div>
                  );
                }
                if (a === 'conflict') {
                  return (
                    <div className={box + 'border-amber-300 bg-amber-50 text-amber-900'}>
                      <p>
                        {isEs
                          ? 'Ya existe una cuenta con ese correo y otro documento, así que esta reserva no se enlazó a ella. Escríbenos y Ventas te ayuda.'
                          : 'An account with that email and a different document already exists, so this booking was not linked. Contact us and Sales will help.'}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Action Buttons */}
              <a
                href={`/pago/${createdReservationId}?t=${(() => { try { return localStorage.getItem(`sq_pay_${createdReservationId}`) ?? ''; } catch { return ''; } })()}`}
                className="block w-full py-4 px-6 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-black text-base shadow-lg text-center border border-[#FDE8B5] transition-all"
              >
                {isEs ? 'Pagar ahora (adelanto 50% o total)' : 'Pay now (50% deposit or full)'}
              </a>
              <a
                href={isAgency || tourist ? '/mis-reservas' : loginHref}
                className="block w-full py-4 px-6 rounded-xl bg-[#181513] hover:bg-stone-800 text-[#F6A935] font-black text-base shadow-lg text-center border border-[#F6A935]/40 transition-all"
              >
                {isAgency
                  ? isEs ? 'Ir a mis ventas' : 'Go to my sales'
                  : tourist
                    ? isEs ? 'Ver mis reservas' : 'See my bookings'
                    : isEs ? 'Iniciar sesión para ver mi reserva' : 'Sign in to see my booking'}
              </a>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={composeWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isEs ? 'Conversar con Asesor por WhatsApp' : 'Chat on WhatsApp'}</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    openOrderTracker(createdReservationId);
                  }}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm shadow-md flex items-center justify-center gap-2 border border-stone-300 transition-all"
                >
                  <Clock className="w-5 h-5" />
                  <span>{isEs ? 'Seguir mi orden sin cuenta' : 'Track without account'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: HOSPEDAJE (DÓNDE QUEDARSE) */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-4">
                    <span className="text-xs font-mono font-bold text-[#F6A935] bg-[#181513] px-2.5 py-1 rounded-md uppercase">
                      {isEs ? 'Paso 1 de 5 · Hospedaje' : 'Step 1 of 5 · Stay'}
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mt-2">
                      {isEs ? '¿Dónde deseas hospedarte en Km 84?' : 'Where would you like to stay?'}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {isEs
                        ? 'Selecciona tu tipo de estancia bioclimática y define las noches y número de viajeros.'
                        : 'Select your bioclimatic accommodation, nights and traveler count.'}
                    </p>
                  </div>

                  {/* Date & Guest controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="sm:col-span-3">
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEs ? 'Fecha de Llegada' : 'Arrival Date'}
                        <span className="ml-2 font-mono font-normal text-stone-500">{travelDate}</span>
                      </label>
                      <AvailabilityCalendar
                        value={travelDate}
                        onChange={setTravelDate}
                        lang={lang}
                      />
                      {!dateOk && (
                        <p className="mt-2 text-xs font-semibold text-[#9E2021]">
                          {isEs
                            ? 'Elige un día en verde para continuar.'
                            : 'Pick a green day to continue.'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEs ? 'Noches de Estadía' : 'Nights of Stay'}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNightsCount((n) => Math.max(1, n - 1))}
                          className="w-9 h-9 rounded-lg border border-stone-300 bg-stone-100 text-stone-700 font-bold"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-base">{nightsCount} noche(s)</span>
                        <button
                          type="button"
                          onClick={() => setNightsCount((n) => n + 1)}
                          className="w-9 h-9 rounded-lg border border-stone-300 bg-stone-100 text-stone-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        {isEs ? 'Número de Huéspedes' : 'Guests Count'}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGuestsCount((g) => Math.max(1, g - 1))}
                          className="w-9 h-9 rounded-lg border border-stone-300 bg-stone-100 text-stone-700 font-bold"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-base">{guestsCount} persona(s)</span>
                        <button
                          type="button"
                          onClick={() => setGuestsCount((g) => g + 1)}
                          className="w-9 h-9 rounded-lg border border-stone-300 bg-stone-100 text-stone-700 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lodging cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stayStock.map((stay) => {
                      const isSelected = selectedStayId === stay.id;
                      const available = stay.capacityMax - stay.booked;
                      const isLowStock = available <= 2 && available > 0;
                      const isSoldOut = available <= 0;

                      return (
                        <div
                          key={stay.id}
                          onClick={() => !isSoldOut && setSelectedStayId(stay.id)}
                          className={`relative rounded-2xl border-2 overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#F6A935] ring-2 ring-[#F6A935]/50 bg-[#FFFDF9] shadow-md'
                              : isSoldOut
                              ? 'border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed'
                              : 'border-stone-200 bg-white hover:border-[#F6A935]/60 shadow-xs'
                          }`}
                        >
                          <div>
                            {stay.image && (
                              <div className="relative h-36 w-full">
                                <Image
                                  src={stay.image}
                                  alt={stay.name}
                                  fill
                                  className="object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 right-2">
                                  {isSoldOut ? (
                                    <span className="bg-red-600 text-white text-xs uppercase font-bold px-2 py-0.5 rounded-md shadow">
                                      {isEs ? 'Agotado' : 'Sold Out'}
                                    </span>
                                  ) : isLowStock ? (
                                    <span className="bg-amber-500 text-white text-xs uppercase font-bold px-2 py-0.5 rounded-md shadow flex items-center gap-1">
                                      <Flame className="w-3 h-3" />
                                      {isEs ? `¡Últimas ${available}!` : `Only ${available} left!`}
                                    </span>
                                  ) : (
                                    <span className="bg-emerald-600 text-white text-xs uppercase font-bold px-2 py-0.5 rounded-md shadow">
                                      {available} {isEs ? 'disponibles' : 'available'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="p-4">
                              <h4 className="font-heading font-extrabold text-stone-900 text-base leading-tight">
                                {isEs ? stay.name : stay.nameEn}
                              </h4>
                              <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                                {stay.description}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between">
                            <div>
                              <span className="text-xs text-stone-500 block uppercase font-bold">
                                {isEs ? 'Tarifa por Noche' : 'Nightly Rate'}
                              </span>
                              <span className="font-mono text-base font-extrabold text-[#442A19]">
                                S/ {stay.unitPricePEN}
                              </span>
                              <span className="text-xs text-stone-500 ml-1">
                                (${stay.unitPriceUSD} USD)
                              </span>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#F6A935] border-[#F6A935] text-[#181513]'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Option: Solo Actividades (Sin Hospedaje) */}
                  <div
                    onClick={() => setSelectedStayId('none')}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedStayId === 'none'
                        ? 'border-[#F6A935] bg-[#FFFDF9] ring-2 ring-[#F6A935]/40 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-heading font-bold text-stone-900 text-sm">
                        {isEs ? 'No requiero hospedaje (Solo Pasadía / Actividades)' : 'Day Pass Only (No lodging required)'}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {isEs
                          ? 'Si ya cuentas con hotel en Cusco u Ollantaytambo y solo deseas realizar actividades y gastronomía.'
                          : 'If you already have lodging and only want to experience activities and food.'}
                      </p>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        selectedStayId === 'none'
                          ? 'bg-[#F6A935] border-[#F6A935] text-[#181513]'
                          : 'border-stone-300'
                      }`}
                    >
                      {selectedStayId === 'none' && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: ACTIVIDADES & EXPEDICIONES */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-4">
                    <span className="text-xs font-mono font-bold text-[#F6A935] bg-[#181513] px-2.5 py-1 rounded-md uppercase">
                      {isEs ? 'Paso 2 de 5 · Actividades' : 'Step 2 of 5 · Activities'}
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mt-2">
                      {isEs ? 'Elige tus Expediciones y Zonas Sagradas' : 'Select Your Ancestral Expeditions'}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {isEs
                        ? 'Cupos limitados por grupo para garantizar una experiencia íntima y regenerativa.'
                        : 'Limited capacity per group to ensure high-vibrational and mindful experiences.'}
                    </p>
                  </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activitiesStock.map((act) => {
                      const count = selectedActivities[act.id] || 0;
                      const isSelected = count > 0;
                      const linked =
                        dayCupos !== null && dayCupos !== 'error' && act.id in dayCupos;
                      const realFree = linked
                        ? isSelected && act.id in itemFree
                          ? itemFree[act.id]
                          : (dayCupos as Record<string, number | null>)[act.id]
                        : undefined;
                      const available = linked ? (realFree ?? 0) : act.capacityMax - act.booked;
                      const isSoldOut = !linked && available <= 0;
                      const noSchedule = linked && realFree === null;
                      const overLimit = isSelected && linked && count > available;

                      return (
                        <div
                          key={act.id}
                          className={`rounded-2xl border-2 p-4 transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#F6A935] bg-[#FFFDF9] ring-2 ring-[#F6A935]/30 shadow-sm'
                              : isSoldOut
                              ? 'border-stone-200 bg-stone-100 opacity-60'
                              : 'border-stone-200 bg-white hover:border-[#F6A935]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-heading font-extrabold text-stone-900 text-base leading-tight">
                                  {isEs ? act.name : act.nameEn}
                                </h4>
                                <span className="text-xs font-bold text-[#442A19] mt-0.5 block">
                                  S/ {act.unitPricePEN} (${act.unitPriceUSD} USD) / persona
                                </span>
                              </div>

                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                  isSoldOut
                                    ? 'bg-red-100 text-red-700'
                                    : available <= 3
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {noSchedule ? 'Sin horario' : isSoldOut ? 'Agotado' : `${available} cupos`}
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                              {act.description}
                            </p>
                            {overLimit && (
                              <p className="mt-2 text-xs font-bold text-[#9E2021]">
                                {isEs
                                  ? `Solo quedan ${available} cupos ese día. Baja las personas o cambia la fecha.`
                                  : `Only ${available} spots left that day. Lower the guests or change the date.`}
                              </p>
                            )}
                            {isSelected && linked && (
                              <ItemWhen
                                id={act.id}
                                date={whenOf(act.id).date}
                                time={whenOf(act.id).time}
                                lang={lang}
                                onChange={(w) => setItemWhen((p) => ({ ...p, [act.id]: w }))}
                                onFree={(id, free) =>
                                  setItemFree((p) => (p[id] === free ? p : { ...p, [id]: free }))
                                }
                              />
                            )}
                          </div>

                          <div className="pt-4 border-t border-stone-100 mt-3 flex items-center justify-between">
                            <button
                              type="button"
                              disabled={isSoldOut}
                              onClick={() => toggleActivity(act.id)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-[#181513] text-[#F6A935]'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              {isSelected ? (isEs ? 'Incluido' : 'Included') : (isEs ? '+ Agregar' : '+ Add')}
                            </button>

                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateActivityCount(act.id, -1)}
                                  className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold w-12 text-center">
                                  {count} {isEs ? 'pers.' : 'pax'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateActivityCount(act.id, 1)}
                                  disabled={linked && count >= available}
                                  className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: ALIMENTACIÓN & GASTRONOMÍA */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-4">
                    <span className="text-xs font-mono font-bold text-[#F6A935] bg-[#181513] px-2.5 py-1 rounded-md uppercase">
                      {isEs ? 'Paso 3 de 5 · Alimentación' : 'Step 3 of 5 · Dining'}
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mt-2">
                      {isEs ? 'Nutrición Novoandina & Sabores Sagrados' : 'Novoandino Superfoods & Sacred Meals'}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {isEs
                        ? 'De la huerta orgánica de Inka Lab directo a tu mesa, preparado con ingredientes cosechados en el día.'
                        : 'From Inka Lab living garden to your plate, crafted with farm-fresh crops.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mealsStock.map((meal) => {
                      const count = selectedMeals[meal.id] || 0;
                      const isSelected = count > 0;
                      const available = meal.capacityMax - meal.booked;

                      return (
                        <div
                          key={meal.id}
                          className={`rounded-2xl border-2 p-4 transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#F6A935] bg-[#FFFDF9] ring-2 ring-[#F6A935]/30 shadow-sm'
                              : 'border-stone-200 bg-white hover:border-[#F6A935]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="font-heading font-extrabold text-stone-900 text-base leading-tight">
                                  {isEs ? meal.name : meal.nameEn}
                                </h4>
                                <span className="text-xs font-bold text-[#442A19] mt-0.5 block">
                                  S/ {meal.unitPricePEN} (${meal.unitPriceUSD} USD) / ración
                                </span>
                              </div>

                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                                {available} raciones hoy
                              </span>
                            </div>

                            <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                              {meal.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-stone-100 mt-3 flex items-center justify-between">
                            <span className="text-xs text-stone-500 font-semibold">
                              {isSelected ? `Subtotal: S/ ${meal.unitPricePEN * count}` : (isEs ? 'Sin seleccionar' : 'None')}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateMealCount(meal.id, -1)}
                                className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-10 text-center">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateMealCount(meal.id, 1)}
                                className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: EXTRAS, TRASLADOS & BIENESTAR */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-stone-200 pb-4">
                    <span className="text-xs font-mono font-bold text-[#F6A935] bg-[#181513] px-2.5 py-1 rounded-md uppercase">
                      {isEs ? 'Paso 4 de 5 · Extras & Movilidad' : 'Step 4 of 5 · Logistics & Extras'}
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mt-2">
                      {isEs ? 'Complementos para una Estadía Perfecta' : 'Add-ons for a Seamless Journey'}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {isEs
                        ? 'Movilidad privada puerta a puerta, recuerdos botánicos y servicios especiales.'
                        : 'Private door-to-door transport, botanical kits, and memories.'}
                    </p>
                  </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {extrasStock.map((extra) => {
                      const count = selectedExtras[extra.id] || 0;
                      const isSelected = count > 0;
                      const linked =
                        dayCupos !== null && dayCupos !== 'error' && extra.id in dayCupos;

                      return (
                        <div
                          key={extra.id}
                          className={`rounded-2xl border-2 p-4 transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#F6A935] bg-[#FFFDF9] ring-2 ring-[#F6A935]/30 shadow-sm'
                              : 'border-stone-200 bg-white hover:border-[#F6A935]/50'
                          }`}
                        >
                          <div>
                            <h4 className="font-heading font-extrabold text-stone-900 text-sm leading-tight">
                              {isEs ? extra.name : extra.nameEn}
                            </h4>
                            <span className="text-xs font-bold text-[#442A19] mt-1 block">
                              S/ {extra.unitPricePEN} (${extra.unitPriceUSD} USD)
                            </span>
                            <p className="text-xs text-stone-600 mt-2 line-clamp-3">
                              {extra.description}
                            </p>
                            {isSelected && linked && (
                              <ItemWhen
                                id={extra.id}
                                date={whenOf(extra.id).date}
                                time={whenOf(extra.id).time}
                                lang={lang}
                                onChange={(w) => setItemWhen((p) => ({ ...p, [extra.id]: w }))}
                                onFree={(id, free) =>
                                  setItemFree((p) => (p[id] === free ? p : { ...p, [id]: free }))
                                }
                              />
                            )}
                          </div>

                          <div className="pt-3 border-t border-stone-100 mt-3 flex items-center justify-between">
                            <span className="text-xs text-stone-500 font-semibold">
                              {isSelected ? `S/ ${extra.unitPricePEN * count}` : '0'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updateExtraCount(extra.id, -1)}
                                className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-8 text-center">{count}</span>
                              <button
                                type="button"
                                onClick={() => updateExtraCount(extra.id, 1)}
                                className="w-7 h-7 rounded-md border border-stone-300 bg-stone-50 text-stone-700 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: RESUMEN FINANCIERO & DATOS DEL CLIENTE */}
              {step === 5 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div className="border-b border-stone-200 pb-4">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md uppercase">
                      {isEs ? 'Paso 5 de 5 · Cierre de Venta' : 'Step 5 of 5 · Booking Summary'}
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#181513] mt-2">
                      {isEs ? 'Resumen de tu Cotización & Datos de Contacto' : 'Order Summary & Contact Information'}
                    </h3>
                    <p className="text-stone-600 text-sm mt-1">
                      {isEs
                        ? 'Al registrar tu solicitud, se generará una orden oficial para el seguimiento del área de Ventas y Contabilidad.'
                        : 'Submitting will generate an official booking order tracked by Sales and Accounting.'}
                    </p>
                  </div>

                  {/* Split: Order summary and Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Summary list */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border-2 border-stone-200 space-y-4">
                      <h4 className="font-heading font-extrabold text-stone-900 text-base border-b pb-2">
                        {isEs ? 'Desglose de Servicios' : 'Services Breakdown'}
                      </h4>

                      <div className="space-y-3 text-xs sm:text-sm">
                        {/* Stay */}
                        {calculation.staySelection ? (
                          <div className="flex justify-between items-start pb-2 border-b border-stone-100">
                            <div>
                              <strong className="text-stone-900 block">
                                🛏️ {calculation.staySelection.name}
                              </strong>
                              <span className="text-stone-500 text-xs">
                                {calculation.staySelection.details}
                              </span>
                            </div>
                            <span className="font-mono font-bold text-stone-800">
                              S/ {calculation.staySelection.subtotalPEN}
                            </span>
                          </div>
                        ) : (
                          <div className="text-stone-500 text-xs pb-2 border-b border-stone-100">
                            <em>{isEs ? 'Sin alojamiento nocturno (Pasadía)' : 'No overnight lodging (Day pass)'}</em>
                          </div>
                        )}

                        {/* Activities */}
                        {calculation.actSelections.map((a) => (
                          <div key={a.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                            <div>
                              <strong className="text-stone-900 block">
                                🧭 {a.name}
                              </strong>
                              <span className="text-stone-500 text-xs">{a.details}</span>
                            </div>
                            <span className="font-mono font-bold text-stone-800">
                              S/ {a.subtotalPEN}
                            </span>
                          </div>
                        ))}

                        {/* Meals */}
                        {calculation.mealSelections.map((m) => (
                          <div key={m.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                            <div>
                              <strong className="text-stone-900 block">
                                🍽️ {m.name}
                              </strong>
                              <span className="text-stone-500 text-xs">{m.details}</span>
                            </div>
                            <span className="font-mono font-bold text-stone-800">
                              S/ {m.subtotalPEN}
                            </span>
                          </div>
                        ))}

                        {/* Extras */}
                        {calculation.extraSelections.map((e) => (
                          <div key={e.itemId} className="flex justify-between items-start pb-2 border-b border-stone-100">
                            <div>
                              <strong className="text-stone-900 block">
                                ✨ {e.name}
                              </strong>
                              <span className="text-stone-500 text-xs">{e.details}</span>
                            </div>
                            <span className="font-mono font-bold text-stone-800">
                              S/ {e.subtotalPEN}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Grand Total */}
                      <div className="bg-[#FFFDF9] border border-[#F6A935]/50 rounded-xl p-3 pt-4 space-y-1">
                        <div className="flex justify-between text-xs text-stone-600">
                          <span>{isEs ? 'Fecha programada:' : 'Travel date:'}</span>
                          <span className="font-bold">{travelDate}</span>
                        </div>
                        <div className="flex justify-between text-xs text-stone-600">
                          <span>{isEs ? 'Huéspedes / Viajeros:' : 'Guests:'}</span>
                          <span className="font-bold">{guestsCount}</span>
                        </div>
                        {agencyPct > 0 && (
                          <div className="flex justify-between text-xs text-amber-800 pt-2 border-t border-stone-200">
                            <span>{isEs ? `Precio lista S/ ${calculation.listTotalPEN} · Dscto. agencia ${agencyPct}%` : `List price S/ ${calculation.listTotalPEN} · Agency discount ${agencyPct}%`}</span>
                            <span className="font-bold">- S/ {Math.round((calculation.listTotalPEN - calculation.totalPEN) * 100) / 100}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base sm:text-lg font-black text-[#442A19] pt-2 border-t border-stone-200">
                          <span>TOTAL ESTIMADO:</span>
                          <span className="font-mono">
                            S/ {calculation.totalPEN}{' '}
                            <span className="text-xs text-stone-500 font-normal">
                              (${calculation.totalUSD} USD)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer contact fields */}
                    <div className="lg:col-span-7 bg-white p-5 rounded-2xl border-2 border-stone-200 space-y-4">
                      <h4 className="font-heading font-extrabold text-stone-900 text-base border-b pb-2">
                        {isEs ? 'Datos del Titular de Reserva' : 'Primary Traveler Information'}
                      </h4>
                      {isAgency && (
                        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900">
                          {isEs
                            ? `Reservando como agencia ${sessionUser?.fullName || sessionUser?.username}. Registra los datos de tu cliente titular. Descuento aplicado: ${agencyPct}%.`
                            : `Booking as agency ${sessionUser?.fullName || sessionUser?.username}. Enter your client's details. Discount applied: ${agencyPct}%.`}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Nombres y Apellidos *' : 'Full Name *'}
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Ej. Juan Pérez Quispe"
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300 focus:ring-2 focus:ring-[#F6A935]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Correo Electrónico *' : 'Email Address *'}
                          </label>
                          <input
                            type="email"
                            required
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="juan@ejemplo.com"
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300 focus:ring-2 focus:ring-[#F6A935]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp *'}
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+51 984 000 000"
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300 focus:ring-2 focus:ring-[#F6A935]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Documento * (DNI nacionales · Pasaporte extranjeros)' : 'Document * (DNI for Peruvians · Passport for foreigners)'}
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={customerDocType}
                              onChange={(e) => setCustomerDocType(e.target.value as 'DNI' | 'PASAPORTE')}
                              className="px-2 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300"
                            >
                              <option value="DNI">DNI</option>
                              <option value="PASAPORTE">{isEs ? 'Pasaporte' : 'Passport'}</option>
                            </select>
                            <input
                              type="text"
                              required
                              value={customerDoc}
                              onChange={(e) => setCustomerDoc(e.target.value)}
                              placeholder={customerDocType === 'DNI' ? '45892100' : 'AB123456'}
                              className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300 focus:ring-2 focus:ring-[#F6A935]"
                            />
                          </div>
                          {!isAgency && (
                            <p className="text-[11px] text-stone-500 mt-1">
                              {isEs
                                ? 'Con tu correo y este número podrás entrar a tu cuenta y ver tus reservas.'
                                : 'With your email and this number you can sign in and see your bookings.'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Método Preferido de Pago' : 'Preferred Payment'}
                          </label>
                          <select className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300">
                            <option>Transferencia Bancaria BCP (Cuenta Empresa)</option>
                            <option>Yape / Plin Empresarial</option>
                            <option>Tarjeta de Crédito / Débito</option>
                            <option>Interbank / Transferencia del Exterior</option>
                          </select>
                        </div>

                        {isAgency && (
                          <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-stone-700 block mb-1">
                              {isEs ? 'Otros pasajeros (uno por línea: nombre, documento)' : 'Other travelers (one per line: name, document)'}
                            </label>
                            <textarea
                              rows={3}
                              value={passengersText}
                              onChange={(e) => setPassengersText(e.target.value)}
                              placeholder={'María López, 45892100\nJohn Smith, AB123456'}
                              className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300"
                            />
                          </div>
                        )}

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-stone-700 block mb-1">
                            {isEs ? 'Notas Especiales, Alergias o Restricciones Dietéticas' : 'Special Notes or Allergies'}
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={isEs ? 'Ej. Dieta vegana, celebración de cumpleaños, llegada en tren de las 3pm...' : 'Dietary notes, train time...'}
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-stone-50 border-stone-300"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 px-6 rounded-xl bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                          {isSubmitting ? (
                            <span>{isEs ? 'Guardando Reserva...' : 'Saving Booking...'}</span>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>{isEs ? 'Confirmar & Guardar Orden de Reserva' : 'Confirm & Save Booking Order'}</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-xs text-stone-500 mt-2">
                          {isEs
                            ? 'Operador Turístico Autorizado · Sumaq Kawsay & Inka Lab · Cusco'
                            : 'Authorized Tour Operator · Sumaq Kawsay & Inka Lab · Cusco'}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Controls */}
        {!createdReservationId && (
          <div className="bg-[#F5EFE6] px-5 sm:px-8 py-3.5 border-t border-[#F6A935]/30 flex items-center justify-between shrink-0">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs sm:text-sm hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEs ? 'Anterior' : 'Back'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs sm:text-sm font-semibold"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <span className="text-xs text-stone-600 block uppercase font-bold">
                  {isEs ? 'Total referencial:' : 'Estimated total:'}
                </span>
                <span className="font-mono text-base font-extrabold text-[#442A19]">
                  S/ {calculation.totalPEN}{' '}
                  <span className="text-xs font-normal text-stone-600">
                    (${calculation.totalUSD} USD)
                  </span>
                </span>
              </div>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as any)}
                  disabled={blocked}
                  className="px-6 py-2.5 rounded-xl bg-[#F6A935] hover:bg-[#9E2021] text-[#442A19] hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F6A935] disabled:hover:text-[#442A19]"
                >
                  <span>{isEs ? 'Siguiente Paso' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}