'use client';

import { useState } from 'react';
import { X, Calendar, User, Mail, Phone, Users, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { Tour } from '@/data/toursData';
import { CustomQuoteSummary } from './TripPlanner';
import { useCMS } from '@/lib/cmsContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTour: Tour | null;
  customSummary: CustomQuoteSummary | null;
  lang: 'es' | 'en';
  currency: 'PEN' | 'USD';
}

export function BookingModal({
  isOpen,
  onClose,
  selectedTour,
  customSummary,
  lang,
  currency,
}: BookingModalProps) {
  const isEs = lang === 'es';
  const { submitContactForm } = useCMS();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(
    customSummary ? customSummary.travelers : 2
  );
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');

  if (!isOpen) return null;

  // Title of what's being booked
  const bookingTitle = selectedTour
    ? (isEs ? selectedTour.titleEs : selectedTour.titleEn)
    : customSummary
    ? (isEs ? `Itinerario Inka Lab (${customSummary.durationLabel})` : `Inka Lab Custom (${customSummary.durationLabel})`)
    : (isEs ? 'Expedición a Medida en Cusco & Ollantaytambo' : 'Tailored Cusco Expedition');

  // Estimated price
  let estimatedPriceDisplay = '';
  if (selectedTour) {
    const single = currency === 'PEN' ? selectedTour.pricePEN : selectedTour.priceUSD;
    const total = single * travelersCount;
    estimatedPriceDisplay = currency === 'PEN' ? `S/ ${total.toFixed(2)}` : `$ ${total.toFixed(2)} USD`;
  } else if (customSummary) {
    estimatedPriceDisplay = currency === 'PEN' ? `S/ ${customSummary.totalPEN}` : `$ ${customSummary.totalUSD} USD`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist booking request into CMS leads inbox
    submitContactForm({
      name: fullName,
      email,
      phone,
      message: `[Solicitud de Reserva] Paquete: ${bookingTitle} | Viajeros: ${travelersCount} | Presupuesto referencial: ${estimatedPriceDisplay} | Requerimientos: ${notes || 'Ninguno'}`,
      tourInterest: bookingTitle,
      travelDate,
    }).catch((err) => console.warn('Could not store lead in background', err));

    // Pre-compose WhatsApp message
    const waText = encodeURIComponent(
      isEs
        ? `¡Hola Inka Lab & Sumaq Kawsay! Deseo coordinar una reserva formal:
- Paquete: ${bookingTitle}
- Nombre: ${fullName}
- Email: ${email}
- Teléfono: ${phone}
- Fecha tentativa: ${travelDate || 'Por coordinar'}
- Viajeros: ${travelersCount}
- Presupuesto referencial: ${estimatedPriceDisplay || 'A cotizar'}
- Requerimientos: ${notes || 'Ninguno'}

Quedo atento a la confirmación de fechas y disponibilidad. ¡Muchas gracias!`
        : `Hello Inka Lab & Sumaq Kawsay! I would like to coordinate a booking request:
- Package: ${bookingTitle}
- Name: ${fullName}
- Email: ${email}
- Phone: ${phone}
- Tentative Date: ${travelDate || 'TBD'}
- Travelers: ${travelersCount}
- Estimated Total: ${estimatedPriceDisplay || 'Quote'}
- Notes: ${notes || 'None'}

Looking forward to your prompt confirmation. Thank you!`
    );

    setSubmittedWaUrl(`https://wa.me/51912189856?text=${waText}`);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedWaUrl('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-[#F6A935] my-4 sm:my-8 max-h-[94vh] sm:max-h-[90vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b-2 border-[#F6A935]/30 bg-[#FDFBF7] shrink-0">
          <div className="min-w-0 pr-2">
            <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#F6A935] bg-[#181513] px-2.5 sm:px-3.5 py-1 rounded-md inline-block truncate">
              {isEs ? 'Reserva Segura · Inka Lab & Sumaq Kawsay' : 'Secure Booking · Inka Lab & Sumaq Kawsay'}
            </span>
            <h3 id="booking-modal-title" className="font-heading text-lg sm:text-2xl font-extrabold text-[#181513] mt-1 truncate">
              {isEs ? 'Solicitud de Reserva' : 'Booking Request'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body with Comfortable Font Sizes and Responsive Spacing */}
        <div className="overflow-y-auto p-4 sm:p-7 md:p-9 text-[#181513]">
          {isSubmitted ? (
            <div className="text-center py-6 sm:py-8 space-y-4 sm:space-y-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h4 className="font-heading text-xl sm:text-3xl font-extrabold text-[#181513]">
                {isEs ? '¡Solicitud Lista para Confirmar!' : 'Booking Request Ready!'}
              </h4>
              <p className="text-sm sm:text-lg text-stone-700 max-w-lg mx-auto leading-relaxed">
                {isEs
                  ? 'Hemos preparado tu resumen de reserva formal. Haz clic en el botón a continuación para enviar los detalles directamente a nuestro equipo en Ollantaytambo y Cusco (+51 912 189 856).'
                  : 'Your booking summary is prepared. Click below to send your details directly to our Cusco specialist (+51 912 189 856).'}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={submittedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isEs ? 'Enviar por WhatsApp (+51 912 189 856)' : 'Send via WhatsApp (+51 912 189 856)'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-base font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
                >
                  {isEs ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Target Experience Summary Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F4EFE6] border-2 border-[#F6A935]/40 text-xs sm:text-sm md:text-base flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shadow-inner">
                <div>
                  <span className="text-stone-700 block font-bold text-xs sm:text-sm uppercase tracking-wider">
                    {isEs ? 'Experiencia / Itinerario:' : 'Experience / Itinerary:'}
                  </span>
                  <strong className="text-[#181513] font-extrabold block text-sm sm:text-base md:text-lg mt-0.5">
                    {bookingTitle}
                  </strong>
                </div>
                {estimatedPriceDisplay && (
                  <div className="sm:text-right">
                    <span className="text-stone-700 block font-bold text-xs sm:text-sm uppercase tracking-wider">
                      {isEs ? 'Inversión Estimada:' : 'Est. Total:'}
                    </span>
                    <strong className="text-[#181513] font-heading font-extrabold text-base sm:text-xl md:text-2xl tabular-nums">
                      {estimatedPriceDisplay}
                    </strong>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                  {isEs ? 'Nombre Completo *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Roberto Sánchez Quispe"
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                    {isEs ? 'Correo Electrónico *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="viajero@ejemplo.com"
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                    {isEs ? 'WhatsApp / Teléfono *' : 'WhatsApp / Mobile *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 912 189 856"
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Travelers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                    {isEs ? 'Fecha de Viaje Deseada' : 'Preferred Travel Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                    {isEs ? 'Número de Pasajeros' : 'Number of Guests'}
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base md:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Special Notes / Requests */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-bold text-[#181513] mb-1 sm:mb-1.5">
                  {isEs ? 'Requerimientos Especiales o Consultas' : 'Special Dietary or Health Notes'}
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute left-3 sm:left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isEs
                        ? 'Ej. Alimentación vegetariana, aclimatación de altura, recojo en estación...'
                        : 'E.g. Vegetarian diet, altitude concerns, train station pickup...'
                    }
                    className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                  />
                </div>
              </div>

              {/* Legal & Security Trust notice */}
              <div className="flex items-center gap-2 pt-1 text-xs sm:text-sm text-stone-600">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <span className="leading-snug">
                  {isEs
                    ? ''
                    : ''}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-end gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3.5 text-sm sm:text-base font-bold text-stone-700 hover:text-stone-950 transition-colors"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl shadow-xl transition-all border border-[#FDE8B5] transform hover:-translate-y-0.5"
                >
                  {isEs ? 'Confirmar vía WhatsApp' : 'Submit via WhatsApp'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
