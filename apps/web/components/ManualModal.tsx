'use client';

import { useState } from 'react';
import {
  X,
  BookOpen,
  FileText,
  User,
  Users,
  Briefcase,
  Calculator,
  Shield,
  Layers,
  CheckCircle2,
  HelpCircle,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  Mail,
  Box,
  Truck,
  Building2,
  DollarSign,
  Share2,
} from 'lucide-react';
import { useCMS } from '@/lib/cmsContext';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'usuario' | 'sistema';
}

export function ManualModal({
  isOpen,
  onClose,
  initialTab = 'usuario',
}: ManualModalProps) {
  const { manualActiveTab, setManualActiveTab } = useCMS();
  const [activeTab, setActiveTab] = useState<'usuario' | 'sistema'>(
    initialTab || manualActiveTab || 'usuario'
  );
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-[#FDFBF7] w-full max-w-5xl rounded-3xl shadow-2xl border-2 border-[#F6A935] my-4 max-h-[94vh] flex flex-col overflow-hidden text-[#1C1917]">
        {/* Header Ribbon */}
        <div className="bg-[#181513] text-stone-100 px-5 sm:px-8 py-4 border-b-2 border-[#F6A935]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#221E1B] border border-[#F6A935] flex items-center justify-center text-[#F6A935]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#F6A935] block font-bold">
                DOCUMENTACIÓN OFICIAL · SUMAQ KAWSAY & INKA LAB
              </span>
              <h2 className="font-heading text-lg sm:text-2xl font-extrabold text-white">
                Centro de Manuales y Guías Operativas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl transition-colors border border-stone-700 hidden sm:flex items-center gap-1.5 text-xs"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-[#F4EFE6] px-4 sm:px-8 py-3 border-b border-[#F6A935]/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('usuario');
                setManualActiveTab('usuario');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'usuario'
                  ? 'bg-[#181513] text-[#F6A935] shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Manual de Uso de la Web (Clientes)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('sistema');
                setManualActiveTab('sistema');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'sistema'
                  ? 'bg-[#181513] text-[#F6A935] shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Manual de Sistema (Roles & Negocio)</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Operador Turístico Autorizado · Sumaq Kawsay & Inka Lab
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-8">
          {/* ============================================================== */}
          {/* TAB 1: MANUAL DE USO DE LA WEB (PARA CLIENTES Y VIAJEROS) */}
          {/* ============================================================== */}
          {activeTab === 'usuario' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F6A935]/50 shadow-sm space-y-4">
                <span className="text-xs uppercase font-mono tracking-widest text-[#F6A935] font-extrabold bg-[#181513] px-3 py-1 rounded-md inline-block">
                  GUÍA OFICIAL DEL VIAJERO · VERSIÓN 2.4
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#181513]">
                  Manual de Uso de la Plataforma Web Sumaq Kawsay
                </h3>
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  Bienvenido al portal oficial de turismo regenerativo y ancestral en Ollantaytambo y Cusco. Este manual te guiará paso a paso para explorar nuestros santuarios, armar tu viaje personalizado y reservar con total transparencia y seguridad.
                </p>
              </div>

              {/* 1. Navegación e Idioma/Moneda */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Navegación, Idioma y Moneda
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-stone-700 pl-11">
                  <p>
                    • <strong>Selector de Moneda:</strong> En la barra superior puedes alternar entre Soles peruanos (PEN) y Dólares americanos (USD). Todas las tarifas se recalcularán automáticamente en tiempo real.
                  </p>
                  <p>
                    • <strong>Selector de Idioma:</strong> Cambia con un solo clic entre Español (ES) e Inglés (EN) para visualizar descripciones, nombres botánicos y cartas novoandinas.
                  </p>
                  <p>
                    • <strong>Modo Accesibilidad Visual:</strong> Utiliza el botón de zoom tipográfico (A+) para ampliar el texto si requieres mayor comodidad de lectura.
                  </p>
                </div>
              </section>

              {/* 2. Flujo de Reserva Integral (Paso a Paso) */}
              <section className="bg-white rounded-2xl p-6 border-2 border-[#F6A935]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F6A935] text-[#181513] flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    El Flujo de Reserva Integral (Paso a Paso)
                  </h4>
                </div>
                <p className="text-sm text-stone-700 pl-11">
                  Nuestra plataforma no te obliga a comprar paquetes rígidos. Puedes construir tu experiencia a medida siguiendo nuestro circuito ordenado de 4 etapas:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11 pt-2">
                  <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#F6A935]/30">
                    <strong className="text-[#442A19] block text-sm mb-1">
                      Paso 1: ¿Dónde Quedarse? (Hospedaje)
                    </strong>
                    <p className="text-xs text-stone-600">
                      Elige entre Bungalows de Piedra con chimenea, Domos Glamping con vista a glaciares, Suites Imperiales o la modalidad de Pasadía (Day Pass sin pernocte). Selecciona tus noches y número de huéspedes; verás el aforo disponible al instante.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#F6A935]/30">
                    <strong className="text-[#442A19] block text-sm mb-1">
                      Paso 2: Actividades & Zonas Sagradas
                    </strong>
                    <p className="text-xs text-stone-600">
                      Suma experiencias ancestrales: Hanan Pacha (Astronomía y Astrofotografía), Willka Unu (Sauna Inca con vapor de hierbas), Cabalgata de Caballos de Paso por el Qhapaq Ñan o la Ruta Etnobotánica de Chillca. Cada una indica los cupos diarios restantes.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#F6A935]/30">
                    <strong className="text-[#442A19] block text-sm mb-1">
                      Paso 3: Alimentación Novoandina
                    </strong>
                    <p className="text-xs text-stone-600">
                      Incluye la mística Pachamanca tradicional de 3 carnes cocida bajo tierra, Menú Degustación 5 Tiempos, Desayuno buffet andino o Picnics campestres con trucha asalmonada del Vilcanota.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#F6A935]/30">
                    <strong className="text-[#442A19] block text-sm mb-1">
                      Paso 4: Extras & Logística Puerta a Puerta
                    </strong>
                    <p className="text-xs text-stone-600">
                      Añade movilidad privada (Cusco Aeropuerto - Km 84 Ollantaytambo), Botiquines de hierbas medicinales andinas o guías privados especializados.
                    </p>
                  </div>
                </div>

                <div className="bg-[#FFFDF9] border border-[#F6A935] rounded-xl p-3.5 ml-11 text-xs text-stone-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Paso 5 (Cierre):</strong> Revisa tu presupuesto total consolidado, ingresa tus datos de contacto y genera tu <strong>Código Único de Reserva (SQ-2026-XXXX)</strong>. Tu solicitud ingresará de inmediato a la bandeja de Ventas y se reservará temporalmente tu cupo.
                  </span>
                </div>
              </section>

              {/* 3. Rastreo de Pedido y Contacto */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Cómo Rastrear tu Reserva y Validar tu Voucher
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-stone-700 pl-11">
                  <p>
                    • Haz clic en <strong>“Rastrear Reserva”</strong> en el menú superior e ingresa tu código (ej. <code>SQ-2026-0104</code>).
                  </p>
                  <p>
                    • Verás en vivo la línea de progreso: <em>Solicitud Recibida → Cotizado → En Negociación / Pago → Concretado & Voucher Emitido</em>.
                  </p>
                  <p>
                    • Cuando el área de Ventas y Contabilidad concrete tu reserva, tendrás disponible para imprimir tu <strong>Voucher Oficial</strong> y tu <strong>Boleta/Factura Electrónica</strong> emitida oficialmente por la empresa y el área contable.
                  </p>
                </div>
              </section>

              {/* 4. Canales de Pago y Soporte */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Medios de Pago y Garantías Legales
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-stone-700 pl-11">
                  <p>
                    • <strong>Cuentas Bancarias Oficiales:</strong> Banco de Crédito del Perú (BCP Cta Corriente Soles y Dólares), Interbank y BBVA.
                  </p>
                  <p>
                    • <strong>Billeteras Digitales:</strong> Yape y Plin Empresarial autorizados.
                  </p>
                  <p>
                    • <strong>Políticas de Sostenibilidad y Cancelación:</strong> Se permite reprogramación con hasta 48 horas de anticipación sin penalidad sujeta a disponibilidad de aforo.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: MANUAL DE SISTEMA (OPERACIONES, ROLES Y NEGOCIO) */}
          {/* ============================================================== */}
          {activeTab === 'sistema' && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Banner */}
              <div className="bg-[#181513] text-stone-100 rounded-3xl p-6 sm:p-8 border-2 border-[#F6A935] shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#F6A935] font-extrabold bg-[#221E1B] px-3 py-1 rounded-md border border-[#F6A935]/50">
                    MANUAL TÉCNICO & OPERATIVO DEL SISTEMA
                  </span>
                  <span className="text-xs text-stone-400 font-mono">ERP · SUMAQ KAWSAY v3.0</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
                  Manual de Sistema, Roles, Stock y Contabilidad
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Este documento describe la arquitectura de procesos, responsabilidades por rol, flujo de ventas interconectado, control de inventario por área y liquidación contable de proveedores para Sumaq Kawsay & Inka Lab.
                </p>
              </div>

              {/* 1. Matriz de Roles y Responsabilidades */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Matriz de Roles y Atribuciones (RBAC)
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pl-11">
                  {/* Ventas y Marketing */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                    <strong className="text-blue-900 flex items-center gap-1.5 font-bold">
                      <Briefcase className="w-4 h-4 text-blue-700" />
                      Rol: Ventas & Marketing
                    </strong>
                    <ul className="space-y-1 text-stone-700 text-xs">
                      <li>• Gestionar el embudo/pipeline comercial de cotizaciones y solicitudes.</li>
                      <li>• Enviar propuestas económicas y correos comerciales estandarizados.</li>
                      <li>• Conectar con el cliente vía WhatsApp oficial de la empresa.</li>
                      <li>• <strong>Concretar Venta:</strong> Activa el descuento automático de stock, genera el asiento de ingresos y crea la cuenta por cobrar.</li>
                      <li>• <strong>Declinar Venta:</strong> Registra el motivo comercial y libera de inmediato el stock retenido.</li>
                    </ul>
                  </div>

                  {/* Contador */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <strong className="text-emerald-900 flex items-center gap-1.5 font-bold">
                      <Calculator className="w-4 h-4 text-emerald-700" />
                      Rol: Contador (Finanzas & Facturación)
                    </strong>
                    <ul className="space-y-1 text-stone-700 text-xs">
                      <li>• Supervisar el Libro Diario de Ingresos y Egresos en PEN y USD.</li>
                      <li>• Controlar comprobantes electrónicos (Boletas B001 / Facturas F001 autorizadas).</li>
                      <li>• Calcular el Margen Bruto (Ventas - Costos de Proveedores) y base imponible IGV (18%).</li>
                      <li>• Gestionar <strong>Cuentas por Pagar a Proveedores</strong> y ejecutar liquidaciones oficiales.</li>
                    </ul>
                  </div>

                  {/* Administrador */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <strong className="text-amber-900 flex items-center gap-1.5 font-bold">
                      <Shield className="w-4 h-4 text-amber-700" />
                      Rol: Administrador General
                    </strong>
                    <ul className="space-y-1 text-stone-700 text-xs">
                      <li>• Control total de inventario y aforos máximos por área en Km 84.</li>
                      <li>• Alta, baja y modificación de proveedores locales y tarifas de costo.</li>
                      <li>• Gestión de usuarios, claves de acceso y asignación de roles.</li>
                      <li>• Supervisión de métricas ejecutivas de rentabilidad y sostenibilidad.</li>
                    </ul>
                  </div>

                  {/* Usuario */}
                  <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                    <strong className="text-purple-900 flex items-center gap-1.5 font-bold">
                      <User className="w-4 h-4 text-purple-700" />
                      Rol: Usuario / Cliente
                    </strong>
                    <ul className="space-y-1 text-stone-700 text-xs">
                      <li>• Diseñar itinerario integral (Hospedaje + Actividades + Comida + Extras).</li>
                      <li>• Generar cotización con código único de rastreo (SQ-2026-XXXX).</li>
                      <li>• Consultar estado de su orden en tiempo real y descargar vouchers.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 2. Protocolo de Concreción y Declinación (Interconexión Total) */}
              <section className="bg-white rounded-2xl p-6 border-2 border-[#F6A935]/40 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F6A935] text-[#181513] flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Protocolo de Concreción y Declinación de Ventas
                  </h4>
                </div>
                <div className="space-y-3 text-sm text-stone-700 pl-11">
                  <p>
                    El núcleo del sistema está diseñado para que <strong>ningún departamento trabaje aislado</strong>. Toda acción en el embudo comercial dispara reacciones automáticas en cadena:
                  </p>

                  <div className="bg-[#FFFDF9] border border-[#F6A935] rounded-xl p-4 space-y-2">
                    <strong className="text-[#442A19] block text-sm">
                      A. Cuando Ventas marca una reserva como &ldquo;CONCRETADO&rdquo;:
                    </strong>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700">
                      <li>
                        <strong>Descuento Inmediato de Stock:</strong> Se incrementa el contador de unidades ocupadas (<code>booked</code>) en Hospedaje (noches), Actividades (cupos), Alimentación (raciones) y Extras.
                      </li>
                      <li>
                        <strong>Registro Contable de Ingreso:</strong> Se genera automáticamente un asiento de ingreso en la contabilidad con el monto total pagado en Soles y Dólares.
                      </li>
                      <li>
                        <strong>Emisión de Comprobante:</strong> Se asigna un número correlativo de Boleta o Factura Electrónica (ej. <code>B001-00045</code>).
                      </li>
                      <li>
                        <strong>Acreditación de Deuda a Proveedores:</strong> Se calcula el costo de cada servicio de la reserva y se añade al saldo por liquidar (<code>pendingBalancePEN</code>) del proveedor correspondiente (Comunidad de Chillca, Huerto Inka Lab, etc.).
                      </li>
                      <li>
                        <strong>Notificación al Cliente:</strong> Se habilita el Voucher oficial en el portal de rastreo del usuario y se envía confirmación por email y WhatsApp.
                      </li>
                    </ol>
                  </div>

                  <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 space-y-2">
                    <strong className="text-red-900 block text-sm">
                      B. Cuando Ventas marca una reserva como &ldquo;DECLINADO&rdquo;:
                    </strong>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700">
                      <li>
                        <strong>Liberación Inmediata de Stock:</strong> El cupo que estaba retenido temporalmente regresa a la disponibilidad general para que otros turistas puedan adquirirlo.
                      </li>
                      <li>
                        <strong>Registro de Motivo:</strong> Ventas documenta la razón de declinación (ej. Presupuesto, Cambio de ruta de viaje, Falta de respuesta) para retroalimentación comercial de Marketing.
                      </li>
                      <li>
                        <strong>Anulación Contable:</strong> La orden se archiva sin generar deudas a proveedores ni comprobantes tributarios.
                      </li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* 3. Control de Stock y Aforos por Área */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Control de Stock y Aforos por Área (Capacidad Operativa)
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-stone-700 pl-11">
                  <p>
                    Para proteger la experiencia del visitante y el ecosistema del Km 84, cada servicio posee un límite estricto de capacidad:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <strong className="block text-stone-900">Área Hospedaje</strong>
                      <span>Aforo: 6 Bungalows rústicos, 4 Domos Glamping y 2 Suites Imperiales. Al llegar a 0 unidades disponibles, el sistema bloquea nuevas reservas para esas fechas.</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <strong className="block text-stone-900">Área Actividades</strong>
                      <span>Aforo: 15 cupos en Astronomía Hanan Pacha, 12 turnos en Sauna Inca Willka Unu, 8 caballos peruanos de paso y 18 cupos en Etnobotánica Chillca.</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <strong className="block text-stone-900">Área Alimentación</strong>
                      <span>Aforo: 30 raciones diarias de Pachamanca y 25 cubiertos en menú novoandino de 5 tiempos para preservar la calidad gastronómica y la frescura de la huerta orgánica.</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <strong className="block text-stone-900">Área Logística & Extras</strong>
                      <span>Aforo: 8 traslados privados diarios en van y 50 botiquines de hierbas medicinales andinas disponibles por lote.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Sector Contable y Proveedores */}
              <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3 text-[#442A19]">
                  <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-900">
                    Procedimientos Contables, Facturación y Proveedores
                  </h4>
                </div>
                <div className="space-y-2 text-sm text-stone-700 pl-11">
                  <p>
                    • <strong>Marco Legal y Tributario:</strong> Toda operación legal se respalda con comprobantes electrónicos autorizados, con domicilio fiscal en Cusco y operaciones en Ollantaytambo.
                  </p>
                  <p>
                    • <strong>Cálculo de Márgenes:</strong> El Contador visualiza en el panel:
                    <br />
                    <code>Margen Bruto = Total Venta (S/) - Costo Acumulado de Proveedores (S/)</code>
                  </p>
                  <p>
                    • <strong>Liquidación a Proveedores Comunales:</strong> Los pagos a la Comunidad de Chillca (guías y arrieros), agricultores de la cooperativa de Inka Lab y transportistas se auditan en la pestaña &ldquo;Proveedores&rdquo;. Al realizar una liquidación, el contador ingresa el monto pagado, lo cual disminuye la deuda y genera el respectivo asiento de egreso en el libro diario.
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
