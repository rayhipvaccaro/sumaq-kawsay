'use client';

import { useState } from 'react';
import { Send, CheckCircle, Mail, Phone, User, Calendar, Compass, MessageSquare } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface ContactSectionProps {
  lang: 'es' | 'en';
}

export function ContactSection({ lang }: ContactSectionProps) {
  const isEs = lang === 'es';
  const { tours, submitContactForm } = useCMS();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tourInterest, setTourInterest] = useState('etnobotanica-chillca');
  const [travelDate, setTravelDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedWaUrl, setSubmittedWaUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedTourObj = tours.find((t) => t.id === tourInterest);
    const tourTitle = selectedTourObj ? (isEs ? selectedTourObj.titleEs : selectedTourObj.titleEn) : 'Experiencia Personalizada';

    await submitContactForm({
      name,
      email,
      phone,
      message,
      tourInterest: tourTitle,
      travelDate,
    });

    const waText = encodeURIComponent(
      isEs
        ? `¡Hola Sumaq Kawsay! He enviado un mensaje desde el formulario web:
• Nombre: ${name}
• Email: ${email}
• Teléfono: ${phone}
• Interés: ${tourTitle}
• Fecha tentativa: ${travelDate || 'Por coordinar'}
• Mensaje: ${message}

Quedo a la espera de su respuesta. ¡Muchas gracias!`
        : `Hello Sumaq Kawsay! I sent a message from the website contact form:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}
• Interest: ${tourTitle}
• Tentative Date: ${travelDate || 'TBD'}
• Message: ${message}

Looking forward to your reply. Thank you!`
    );

    setSubmittedWaUrl(`https://wa.me/51912189856?text=${waText}`);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTravelDate('');
    setIsSuccess(false);
  };

  return (
    <section id="contacto" className="py-20 sm:py-28 bg-[#FDFBF7] border-b border-[#F6A935]/30 relative overflow-hidden">
      {/* Subtle Andean ambient background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#F6A935]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#2E5A36]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#D48B1E] block mb-2">
            {isEs ? 'Atención Personalizada en Cusco' : 'Personalized Advisory in Cusco'}
          </span>

          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#181513] tracking-normal leading-snug sm:leading-tight text-balance">
            {isEs ? 'Ponte en Contacto con Sumaq Kawsay' : 'Get in Touch with Sumaq Kawsay'}
          </h2>

          <p className="mt-4 sm:mt-5 text-base sm:text-xl md:text-2xl text-[#2C2623] leading-relaxed font-normal">
            {isEs
              ? '¿Deseas una propuesta a medida, coordinar fechas especiales o visitar nuestro santuario Inka Lab en el Km 84? Escríbenos y un asesor local te responderá formalmente.'
              : 'Looking for a custom expedition, private dates, or visiting our Inka Lab sanctuary at Km 84? Send us an inquiry and our native team will get in touch promptly.'}
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border-2 border-[#F6A935]/50 p-6 sm:p-10 md:p-12 shadow-2xl">
          {isSuccess ? (
            <div
              role="status"
              aria-live="polite"
              className="text-center py-8 space-y-5"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181513] leading-normal">
                {isEs ? '¡Mensaje Enviado con Éxito!' : 'Message Received Successfully!'}
              </h3>
              <p className="text-base sm:text-lg text-stone-700 max-w-lg mx-auto leading-relaxed">
                {isEs
                  ? 'Tu mensaje ha sido guardado en nuestro panel de atención. También puedes abrir WhatsApp para conectar inmediatamente con nuestro especialista en Cusco.'
                  : 'Your request has been stored in our customer center. You can also chat directly on WhatsApp to connect with our Cusco specialist.'}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <a
                  href={submittedWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isEs ? 'Abrir conversación en WhatsApp con +51 912 189 856 (se abre en nueva pestaña)' : 'Open WhatsApp chat with +51 912 189 856 (opens in new tab)'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>{isEs ? 'Abrir en WhatsApp (+51 912 189 856)' : 'Open in WhatsApp (+51 912 189 856)'}</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 sm:py-4 text-base font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all"
                >
                  {isEs ? 'Enviar otra consulta' : 'Send another inquiry'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate={false}>
              {/* Full Name */}
              <div>
                <label htmlFor="contact-full-name" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                  {isEs ? 'Nombres y Apellidos *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="contact-full-name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carmen Del Solar"
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label htmlFor="contact-email" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                    {isEs ? 'Correo Electrónico *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="viajero@ejemplo.com"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                    {isEs ? 'WhatsApp / Celular *' : 'WhatsApp / Mobile *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      aria-required="true"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 984 000 000"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Tour of Interest & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label htmlFor="contact-tour-interest" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                    {isEs ? 'Tour o Experiencia de Interés' : 'Experience of Interest'}
                  </label>
                  <div className="relative">
                    <Compass className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      id="contact-tour-interest"
                      name="tourInterest"
                      value={tourInterest}
                      onChange={(e) => setTourInterest(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium truncate"
                    >
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {isEs ? tour.titleEs : tour.titleEn}
                        </option>
                      ))}
                      <option value="custom">{isEs ? 'Itinerario a Medida (Cotización Libre)' : 'Custom Tailored Journey'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-travel-date" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                    {isEs ? 'Fecha Tentativa de Viaje' : 'Preferred Travel Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="contact-travel-date"
                      name="travelDate"
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-sm sm:text-base font-bold text-[#181513] mb-1.5 sm:mb-2">
                  {isEs ? 'Mensaje o Requerimientos Especiales *' : 'Message or Special Requirements *'}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  aria-required="true"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isEs ? 'Cuéntanos cuántas personas viajan, si tienen intereses botánicos, preferencias dietarias o dudas sobre la altura...' : 'Tell us your group size, dietary preferences, wellness goals...'}
                  className="w-full p-3.5 sm:p-4 text-base sm:text-lg rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513] focus:outline-hidden focus:ring-2 focus:ring-[#F6A935] focus:border-[#F6A935] font-medium"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label={isSubmitting ? (isEs ? 'Enviando mensaje...' : 'Sending message...') : (isEs ? 'Enviar consulta a Sumaq Kawsay' : 'Send inquiry to Sumaq Kawsay')}
                className="w-full inline-flex items-center justify-center gap-3 py-4 sm:py-4.5 px-8 text-base sm:text-lg font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] active:bg-[#99771A] rounded-xl shadow-xl transition-all border border-[#FDE8B5] transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? (isEs ? 'Enviando Mensaje...' : 'Sending Message...') : (isEs ? 'Enviar Consulta a Sumaq Kawsay' : 'Send Inquiry to Sumaq Kawsay')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
