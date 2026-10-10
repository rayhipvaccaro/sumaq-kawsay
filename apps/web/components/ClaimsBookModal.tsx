'use client';

import { useState } from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert } from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface ClaimsBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
}

export function ClaimsBookModal({ isOpen, onClose, lang }: ClaimsBookModalProps) {
  const isEs = lang === 'es';
  const { submitContactForm } = useCMS();
  const [submitted, setSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const [claimType, setClaimType] = useState<'queja' | 'reclamo'>('reclamo');
  const [fullName, setFullName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [consumerRequest, setConsumerRequest] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedCode = `LR-${Math.floor(100000 + Math.random() * 900000)}`;
    setClaimCode(generatedCode);

    // Formally log to CMS Leads
    submitContactForm({
      name: fullName,
      email,
      phone,
      message: `[Libro de Reclamaciones Indecopi · Código: ${generatedCode}] Tipo: ${claimType.toUpperCase()} | Doc: ${docNumber} | Detalle: ${description} | Pedido del Consumidor: ${consumerRequest}`,
      tourInterest: `Reclamo Indecopi (${generatedCode})`,
    }).catch((err) => console.warn('Could not store claim in background', err));

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setClaimCode('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="claims-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border-2 border-[#F6A935] my-3 sm:my-6 max-h-[94vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b-2 border-[#F6A935]/30 bg-[#FDFBF7] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#F6A935] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-[#F6A935] bg-[#181513] px-2.5 sm:px-3 py-1 rounded-md inline-block truncate">
                {isEs ? 'Indecopi D.S. 011-2011-PCM' : 'Consumer Protection'}
              </span>
              <h3 id="claims-modal-title" className="font-heading text-base sm:text-xl font-extrabold text-[#181513] mt-1 truncate">
                {isEs ? 'Libro de Reclamaciones' : 'Complaints Book'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-200 transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content with comfortable reading sizes */}
        <div className="p-4 sm:p-7 md:p-9 overflow-y-auto text-[#181513]">
          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-2xl font-extrabold text-[#181513]">
                {isEs ? 'Hoja de Reclamación Registrada' : 'Complaint Successfully Registered'}
              </h4>
              <p className="text-base text-stone-700 max-w-md mx-auto leading-relaxed">
                {isEs
                  ? `Se ha generado la constancia con código ${claimCode}. Sumaq Kawsay dará respuesta en un plazo no mayor a 15 días hábiles conforme a la normativa de Indecopi.`
                  : `Complaint reference ${claimCode} recorded. We will formally respond within 15 business days as stipulated by Peruvian consumer law.`}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-8 py-3.5 text-base font-bold text-[#181513] bg-[#F6A935] rounded-xl shadow-md hover:bg-[#D48B1E]"
              >
                {isEs ? 'Finalizar' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-base">
              {/* Official legal notice */}
              <div className="p-4 rounded-2xl bg-[#F4EFE6] border-2 border-[#F6A935]/40 text-stone-800 space-y-1.5 text-sm sm:text-base">
                <p>
                  <strong>Operador:</strong> Sumaq Kawsay Expeditions & Inka Lab Complejo Ecoturístico
                </p>
                <p>
                  <strong>Sede Legal:</strong> Pampa del Castillo 455, Cusco – Perú · <strong>Sede Vivencial:</strong> Km 84 Ollantaytambo
                </p>
              </div>

              {/* Claim or complaint type */}
              <div>
                <label className="block font-bold text-[#181513] mb-2 text-sm sm:text-base">
                  {isEs ? 'Tipo de Registro *' : 'Record Type *'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setClaimType('reclamo')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      claimType === 'reclamo'
                        ? 'border-[#F6A935] bg-[#F4EFE6] font-extrabold text-[#181513] shadow-sm'
                        : 'border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="text-base sm:text-lg block font-bold">{isEs ? 'Reclamo' : 'Claim'}</span>
                    <span className="block text-xs sm:text-sm text-stone-600 font-normal mt-1 leading-snug">
                      {isEs ? 'Disconformidad sobre el servicio brindado' : 'Disagreement regarding the service delivered'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setClaimType('queja')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      claimType === 'queja'
                        ? 'border-[#F6A935] bg-[#F4EFE6] font-extrabold text-[#181513] shadow-sm'
                        : 'border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="text-base sm:text-lg block font-bold">{isEs ? 'Queja' : 'Complaint'}</span>
                    <span className="block text-xs sm:text-sm text-stone-600 font-normal mt-1 leading-snug">
                      {isEs ? 'Malestar respecto a la atención o trato' : 'Discontent regarding personnel or attention'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Consumer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                    {isEs ? 'Nombres y Apellidos *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez Quispe"
                    className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                    {isEs ? 'Documento (DNI / Pasaporte) *' : 'ID / Passport *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej. 45892314"
                    className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                    {isEs ? 'Correo Electrónico *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                    {isEs ? 'Teléfono / Móvil *' : 'Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                  {isEs ? 'Detalle de la Reclamación o Queja *' : 'Detailed Description *'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isEs ? 'Describe claramente lo sucedido...' : 'Describe clearly what occurred...'}
                  className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                />
              </div>

              {/* Request */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-[#181513] mb-1">
                  {isEs ? 'Pedido Concreto del Consumidor *' : 'Consumer Concrete Request *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={consumerRequest}
                  onChange={(e) => setConsumerRequest(e.target.value)}
                  placeholder={isEs ? 'Indica qué solución solicitas...' : 'State your requested resolution...'}
                  className="w-full px-4 py-3 text-base rounded-xl border-2 border-stone-300 bg-[#FDFBF7] text-[#181513]"
                />
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-600">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {isEs
                    ? 'La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante INDECOPI.'
                    : 'Filing this complaint does not preclude legal recourse or filing before INDECOPI.'}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 text-base font-bold text-stone-700 hover:text-stone-950"
                >
                  {isEs ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-[#181513] bg-[#F6A935] hover:bg-[#D48B1E] rounded-xl shadow-lg border border-[#FDE8B5]"
                >
                  {isEs ? 'Registrar Hoja de Reclamación' : 'Submit Formal Complaint'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
