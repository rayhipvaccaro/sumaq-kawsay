'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  User,
  Briefcase,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Home,
} from 'lucide-react';
import { ManualModal } from '@/components/ManualModal';

export default function ManualPage() {
  const [activeTab, setActiveTab] = useState<'usuario' | 'sistema'>('usuario');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#181513] text-stone-100 border-b-2 border-[#D4AF37]/50 py-4 px-6 sm:px-12 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio (Sumaq Kawsay)</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono tracking-widest text-stone-400 hidden sm:inline">
              Sumaq Kawsay · Operador Turístico Registrado
            </span>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex-1 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4EFE6] border border-[#D4AF37]/40 text-xs font-mono font-bold uppercase tracking-wider text-[#4A2E1B]">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>DOCUMENTACIÓN CENTRALIZADA DEL NEGOCIO</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#181513]">
            Manual de Uso de la Web & Manual de Sistema
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Consulte las guías completas para turistas, clientes y el manual operativo de procesos internos para las áreas de Ventas & Marketing, Contabilidad y Administración General.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-center gap-3 border-b border-stone-200 pb-4">
          <button
            onClick={() => setActiveTab('usuario')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'usuario'
                ? 'bg-[#181513] text-[#D4AF37] shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Manual de Uso de la Web (Clientes)</span>
          </button>

          <button
            onClick={() => setActiveTab('sistema')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              activeTab === 'sistema'
                ? 'bg-[#181513] text-[#D4AF37] shadow-md'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>2. Manual de Sistema (Roles & Negocio)</span>
          </button>
        </div>

        {/* Content sections */}
        {activeTab === 'usuario' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37]/40 shadow-sm space-y-4">
              <h2 className="font-heading text-2xl font-bold text-[#181513]">
                Guía del Usuario: Cómo Disfrutar de Sumaq Kawsay & Inka Lab
              </h2>
              <p className="text-stone-700 text-sm leading-relaxed">
                Nuestra plataforma te permite planificar viajes auténticos respetando la Pachamama. A continuación encontrarás las instrucciones para cotizar, reservar y validar tus comprobantes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-lg flex items-center gap-2">
                  <span>1. Exploración & Moneda</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Puedes cambiar entre Soles (PEN) y Dólares (USD) desde el selector superior, así como alternar el idioma (Español e Inglés). Toda la plataforma y el catálogo de paquetes actualizarán sus valores referenciales.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-lg flex items-center gap-2">
                  <span>2. El Flujo de Reserva Integral</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Sigue el circuito en 4 pasos: primero selecciona <strong>Dónde Quedarte</strong> (Bungalows de piedra o domos glamping con aforo disponible en tiempo real), añade <strong>Actividades Ancestrales</strong> (astronomía, sauna inca, cabalgatas), incorpora <strong>Alimentación Novoandina</strong> (Pachamanca o menús de huerta) y <strong>Extras</strong> (movilidad privada o kits medicinales).
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-lg flex items-center gap-2">
                  <span>3. Código de Seguimiento SQ-2026-XXXX</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Al completar tu solicitud se emite un código identificador. Con él puedes consultar en el portal de rastreo en qué etapa se encuentra tu reserva (Solicitado, Cotizado, En Negociación, Concretado con Voucher).
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-lg flex items-center gap-2">
                  <span>4. Comprobante Tributario y Garantía</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Una vez confirmada la venta, se emite tu Boleta o Factura Electrónica oficial y tu voucher digital con código QR de acceso al Km 84.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#181513] text-stone-100 rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-xl space-y-3">
              <h2 className="font-heading text-2xl font-bold text-white">
                Manual de Sistema: Roles, Control de Stock, Ventas y Contabilidad
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Procedimientos operativos para garantizar la rentabilidad, el control de capacidad de carga y la trazabilidad financiera entre áreas.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-base">
                  • Conexión de Roles: Ventas, Contador y Administrador
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Cuando un cliente envía una reserva, entra como <em>Cotizado</em> en el pipeline de Ventas. El ejecutivo comercial se comunica por email preformateado y WhatsApp. Cuando el cliente realiza el abono, Ventas marca la reserva como <strong>Concretado</strong>. De inmediato, el sistema ejecuta tres acciones automáticas:
                </p>
                <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 pl-3">
                  <li>Descuenta el aforo ocupado en el inventario por área (noches, cupos de guía, raciones de cocina).</li>
                  <li>Genera un asiento de ingreso en la contabilidad y emite la Boleta/Factura electrónica correlativa.</li>
                  <li>Registra el saldo pendiente por pagar a cada proveedor comunal o cooperativa asociada.</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-base">
                  • Declinación de Ventas y Retorno de Stock
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Si un cliente decide no viajar, el ejecutivo marca <strong>Declinado</strong> y registra la razón (precio, cambio de fecha, etc.). El sistema libera inmediatamente el cupo reservado para que vuelva a estar disponible al público general.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                <h3 className="font-heading font-extrabold text-[#4A2E1B] text-base">
                  • Liquidación a Proveedores y Márgenes Contables
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  En el módulo contable, el Contador supervisa el Margen Bruto (Ingresos menos Costos de Proveedor) y ejecuta las liquidaciones bancarias hacia la Comunidad de Chillca, transportistas y agricultores, reflejando el egreso y reduciendo la deuda en tiempo real.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
