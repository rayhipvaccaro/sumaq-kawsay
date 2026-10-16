export type UserRole = 'usuario' | 'ventas' | 'contador' | 'admin';

export type AreaType = 'hospedaje' | 'actividades' | 'alimentacion' | 'extras';

export interface StockItem {
  id: string;
  area: AreaType;
  name: string;
  nameEn: string;
  capacityMax: number; // Aforo o cupo total disponible
  booked: number;      // Cantidad reservada/ocupada
  unitPricePEN: number;
  unitPriceUSD: number;
  costPricePEN: number; // Costo unitario de operación/proveedor
  providerId: string;   // Proveedor que lo abastece
  unitLabel: string;    // ej: 'habitaciones / noche', 'cupos / día', 'platos / día'
  description: string;
  image?: string;
}

export interface Provider {
  id: string;
  name: string;
  businessName: string;
  rucOrDni: string;
  category: 'Alojamiento & Mantenimiento' | 'Guías & Arrieros Comunales' | 'Alimentos & Huerto Orgánico' | 'Transporte Turístico';
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  pendingBalancePEN: number; // Monto por liquidar
  totalPaidPEN: number;      // Total histórico pagado
}

export type ReservationStatus = 'borrador' | 'cotizado' | 'en_seguimiento' | 'concretado' | 'declinado';
export type PaymentStatus = 'pendiente' | 'adelanto_50' | 'pagado_100' | 'anulado';
export type PaymentMethod = 'yape_plin' | 'transferencia_bcp' | 'interbank' | 'tarjeta' | 'efectivo';
export type InvoiceType = 'boleta' | 'factura' | 'nota_venta';

export interface PaymentRecord {
  id: string;
  date: string;
  method: PaymentMethod;
  plan: 'adelanto_50' | 'pagado_100';
  amountPEN: number;
  status: 'aprobado' | 'rechazado' | 'por_verificar';
  provider: 'simulado';
  txId: string;
  cardBrand?: string;
  cardLast4?: string;
  operationCode?: string;
  message?: string;
}

export interface EmailLog {
  id: string;
  date: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  type: 'cotizacion' | 'seguimiento' | 'confirmacion_voucher' | 'declinacion' | 'recordatorio';
}

export interface ReservationItemSelection {
  itemId: string;
  name: string;
  area: AreaType;
  quantity: number; // noches, cupos, platos o unidades
  unitPricePEN: number;
  unitPriceUSD: number;
  unitCostPEN: number;
  subtotalPEN: number;
  subtotalUSD: number;
  subtotalCostPEN: number;
  details?: string;
}

export interface Reservation {
  id: string; // ej. SQ-2026-0104
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDniOrPassport?: string;
  customerDocType?: 'DNI' | 'PASAPORTE';
  customerUserId?: number; // cuenta del turista
  agencyUserId?: number; // agencia que vendio
  agencyName?: string;
  agencyDiscountPct?: number;
  listTotalPEN?: number; // total sin descuento de agencia
  listTotalUSD?: number;
  passengers?: { name: string; doc?: string }[];
  travelDate: string;
  endDate?: string;
  guestsCount: number;
  notes?: string;

  // Desglose del flujo de reserva de negocio
  stayItem?: ReservationItemSelection | null; // Dónde quedarse
  activities: ReservationItemSelection[];     // Actividades
  meals: ReservationItemSelection[];          // Alimentación
  extras: ReservationItemSelection[];         // Extras / Traslados

  // Totales financieros
  totalPEN: number;
  totalUSD: number;
  totalCostPEN: number;
  grossMarginPEN: number; // totalPEN - totalCostPEN

  // Estado del flujo comercial (Ventas)
  status: ReservationStatus;
  declineReason?: string;
  assignedAgent: string;

  // Estado de Contabilidad & Facturación (Contador)
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceType: InvoiceType;
  invoiceNumber?: string; // ej. B001-00045 o F001-00012
  invoiceIssuedAt?: string;

  // Pasarela de pagos (simulada)
  accessToken?: string; // llave privada del turista para ver/pagar su orden
  amountPaidPEN?: number;
  payments?: PaymentRecord[];

  // Historial de correos y notas
  emailLogs: EmailLog[];
}

export interface AccountingTransaction {
  id: string;
  date: string;
  type: 'ingreso' | 'egreso';
  concept: string;
  category: 'Venta de Reserva' | 'Pago a Proveedor' | 'Costo Operativo' | 'Impuestos';
  amountPEN: number;
  amountUSD: number;
  reservationId?: string;
  providerId?: string;
  invoiceNumber?: string;
  paymentMethod: PaymentMethod;
  registeredBy: string;
}

// Semilla inicial de Proveedores Locales
export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'Comunidad Campesina de Chillca',
    businessName: 'Asociación de Turismo Comunal Chillca',
    rucOrDni: '20564982141',
    category: 'Guías & Arrieros Comunales',
    contactPerson: 'Don Eloy Huamán (Apu Mayor)',
    phone: '+51 984 112 344',
    email: 'comunidadchillca@gmail.com',
    location: 'Km 82 - Km 84 Chillca, Urubamba',
    pendingBalancePEN: 480,
    totalPaidPEN: 12450,
  },
  {
    id: 'prov-2',
    name: 'Huerto Agroecológico Inka Lab Km 84',
    businessName: 'Cooperativa Agrícola Valle Sagrado SRL',
    rucOrDni: '20608933211',
    category: 'Alimentos & Huerto Orgánico',
    contactPerson: 'Ing. Bertha Huamán Quispe',
    phone: '+51 984 778 901',
    email: 'huerto.inkalab@gmail.com',
    location: 'Km 84 Vía Férrea Ollantaytambo',
    pendingBalancePEN: 320,
    totalPaidPEN: 9800,
  },
  {
    id: 'prov-3',
    name: 'Transportes Turísticos Chaski Express',
    businessName: 'Inversiones Chaski SAC',
    rucOrDni: '20498711200',
    category: 'Transporte Turístico',
    contactPerson: 'Marco Vinicio Tupac',
    phone: '+51 974 665 432',
    email: 'chaskiexpress.cusco@gmail.com',
    location: 'Av. Sol 420, Cusco',
    pendingBalancePEN: 540,
    totalPaidPEN: 15300,
  },
  {
    id: 'prov-4',
    name: 'Bungalows & Bioarquitectura Andina',
    businessName: 'Construcciones Sostenibles Urubamba EIRL',
    rucOrDni: '20610099882',
    category: 'Alojamiento & Mantenimiento',
    contactPerson: 'Arq. Dante Choque',
    phone: '+51 987 334 112',
    email: 'mantenimiento.bungalows@gmail.com',
    location: 'Ollantaytambo Pueblo',
    pendingBalancePEN: 760,
    totalPaidPEN: 18900,
  },
];

// Semilla inicial de Stock e Inventario por Área
export const INITIAL_STOCK_ITEMS: StockItem[] = [
  // 1. ÁREA HOSPEDAJE
  {
    id: 'hosp-bungalow',
    area: 'hospedaje',
    name: 'Bungalow Rústico de Piedra & Chimenea',
    nameEn: 'Stone Rustic Bungalow & Wood Fireplace',
    capacityMax: 6,
    booked: 2,
    unitPricePEN: 380,
    unitPriceUSD: 102,
    costPricePEN: 140,
    providerId: 'prov-4',
    unitLabel: 'bungalows / noche',
    description: 'Bungalow bioclimático en piedra y madera con chimenea privada y vista panorámica al río Vilcanota.',
    image: '/images/bungalow_ecoturistico_1791233601485.jpg',
  },
  {
    id: 'hosp-glamping',
    area: 'hospedaje',
    name: 'Domo Glamping Ancestral Andino',
    nameEn: 'Ancestral Andean Glamping Dome',
    capacityMax: 4,
    booked: 1,
    unitPricePEN: 290,
    unitPriceUSD: 78,
    costPricePEN: 100,
    providerId: 'prov-4',
    unitLabel: 'domos / noche',
    description: 'Domo geodésico con techo transparente para observación estelar nocturna y calefacción ecológica.',
    image: '/images/hanan_pacha_night_sky_1791233581943.jpg',
  },
  {
    id: 'hosp-suite',
    area: 'hospedaje',
    name: 'Suite Imperial Inka Lab Km 84',
    nameEn: 'Inka Lab Imperial Suite Km 84',
    capacityMax: 2,
    booked: 0,
    unitPricePEN: 540,
    unitPriceUSD: 145,
    costPricePEN: 190,
    providerId: 'prov-4',
    unitLabel: 'suites / noche',
    description: 'Suite exclusiva con tina de piedra hidrotermal, terraza privada al Apu Verónica y servicio de té.',
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
  },

  // 2. ÁREA ACTIVIDADES
  {
    id: 'act-hanan-pacha',
    area: 'actividades',
    name: 'Hanan Pacha: Astronomía Inca & Cumbres Sagradas',
    nameEn: 'Hanan Pacha: Sacred Peaks & Andean Astronomy',
    capacityMax: 15,
    booked: 4,
    unitPricePEN: 290,
    unitPriceUSD: 78,
    costPricePEN: 95,
    providerId: 'prov-1',
    unitLabel: 'cupos / día',
    description: 'Telescopio de campo, astrofotografía y cosmovisión de las constelaciones oscuras quechuas.',
    image: '/images/hanan_pacha_night_sky_1791233581943.jpg',
  },
  {
    id: 'act-willka-unu',
    area: 'actividades',
    name: 'Willka Unu: Acueductos & Sauna Inca a Vapor',
    nameEn: 'Willka Unu: Sacred Water & Inca Steam Sauna',
    capacityMax: 12,
    booked: 3,
    unitPricePEN: 240,
    unitPriceUSD: 65,
    costPricePEN: 80,
    providerId: 'prov-2',
    unitLabel: 'turnos / día',
    description: 'Purificación en sauna de piedras volcánicas con hierbas aromáticas de la huerta y baños de florecimiento.',
    image: '/images/willka_unu_inca_sauna_1791233592210.jpg',
  },
  {
    id: 'act-etnobotanica',
    area: 'actividades',
    name: 'Ruta Etnobotánica & Huerto Medicinal Chillca',
    nameEn: 'Ethnobotany & Medicinal Herb Tour Chillca',
    capacityMax: 18,
    booked: 5,
    unitPricePEN: 280,
    unitPriceUSD: 75,
    costPricePEN: 85,
    providerId: 'prov-1',
    unitLabel: 'cupos / día',
    description: 'Recolección guiada con sabios de la comunidad de Chillca y preparación de tinturas medicinales.',
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
  },
  {
    id: 'act-cabalgata',
    area: 'actividades',
    name: 'Cabalgata en Caballos de Paso por el Qhapaq Ñan',
    nameEn: 'Peruvian Paso Horse Riding on the Qhapaq Ñan',
    capacityMax: 8,
    booked: 2,
    unitPricePEN: 380,
    unitPriceUSD: 102,
    costPricePEN: 130,
    providerId: 'prov-1',
    unitLabel: 'caballos / día',
    description: 'Paseo suave y elegante a lomo de caballo peruano de paso recorriendo terrazas incaicas.',
    image: '/images/cabalgata_caballos_paso_1791233048725.jpg',
  },
  {
    id: 'act-inti-punku',
    area: 'actividades',
    name: 'Trek Inti Punku: Canteras de Kachiqhata',
    nameEn: 'Inti Punku Trek & Megalithic Quarries',
    capacityMax: 10,
    booked: 2,
    unitPricePEN: 340,
    unitPriceUSD: 92,
    costPricePEN: 110,
    providerId: 'prov-1',
    unitLabel: 'cupos / día',
    description: 'Trekking desafiante hacia el portal solar con vista majestuosa al nevado Verónica.',
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
  },

  // 3. ÁREA ALIMENTACIÓN
  {
    id: 'food-pachamanca',
    area: 'alimentacion',
    name: 'Pachamanca Andina Tradicional Ceremonial',
    nameEn: 'Ceremonial Andean Earth-Oven Pachamanca',
    capacityMax: 30,
    booked: 8,
    unitPricePEN: 85,
    unitPriceUSD: 23,
    costPricePEN: 32,
    providerId: 'prov-2',
    unitLabel: 'raciones / día',
    description: 'Cocción bajo tierra con piedras ardientes, carnes maceradas, papas nativas, camotes, habas y humitas.',
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
  },
  {
    id: 'food-novoandino',
    area: 'alimentacion',
    name: 'Menú Degustación Novoandino 5 Tiempos',
    nameEn: '5-Course Novoandino Tasting Menu',
    capacityMax: 25,
    booked: 6,
    unitPricePEN: 95,
    unitPriceUSD: 26,
    costPricePEN: 38,
    providerId: 'prov-2',
    unitLabel: 'cubiertos / día',
    description: 'Trucha asalmonada en costra de quinua, carpaccio de hongos silvestres y postre de lúcuma.',
    image: '/images/bungalow_ecoturistico_1791233601485.jpg',
  },
  {
    id: 'food-desayuno-organico',
    area: 'alimentacion',
    name: 'Buffet Desayuno Energético Andino',
    nameEn: 'Highland Andean Organic Breakfast Buffet',
    capacityMax: 40,
    booked: 12,
    unitPricePEN: 40,
    unitPriceUSD: 11,
    costPricePEN: 15,
    providerId: 'prov-2',
    unitLabel: 'desayunos / día',
    description: 'Pan artesanal de trigo serrano, miel de flores silvestres, queso andino madurado y jugos de aguaymanto.',
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
  },
  {
    id: 'food-picnic',
    area: 'alimentacion',
    name: 'Picnic Gourmet Campestre con Trucha de Altura',
    nameEn: 'Gourmet Mountain Picnic with Fresh Glacial Trout',
    capacityMax: 20,
    booked: 4,
    unitPricePEN: 65,
    unitPriceUSD: 18,
    costPricePEN: 24,
    providerId: 'prov-2',
    unitLabel: 'canastas / día',
    description: 'Almuerzo empacado en canasta de totora para disfrutar a la orilla del río Vilcanota o en miradores.',
    image: '/images/comunidad_tejedoras_cusco_1791233068174.jpg',
  },

  // 4. ÁREA EXTRAS & TRASLADOS
  {
    id: 'extra-transporte-cusco',
    area: 'extras',
    name: 'Traslado Privado Van Cusco <-> Km 84 Ollantaytambo',
    nameEn: 'Private Minivan Transfer Cusco <-> Km 84',
    capacityMax: 8,
    booked: 2,
    unitPricePEN: 180,
    unitPriceUSD: 49,
    costPricePEN: 90,
    providerId: 'prov-3',
    unitLabel: 'servicios / día',
    description: 'Movilidad privada y cómoda con chofer profesional y parada fotográfica en miradores del Valle.',
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
  },
  {
    id: 'extra-kit-hierbas',
    area: 'extras',
    name: 'Botiquín & Kit de Hierbas Medicinales Andinas',
    nameEn: 'Andean Medicinal Botanical Kit',
    capacityMax: 50,
    booked: 14,
    unitPricePEN: 55,
    unitPriceUSD: 15,
    costPricePEN: 18,
    providerId: 'prov-2',
    unitLabel: 'kits',
    description: 'Bolsa de lienzo artesanal con muña, hoja de coca seleccionada, llantén seco y aceite esencial puro.',
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
  },
  {
    id: 'extra-astrofoto',
    area: 'extras',
    name: 'Sesión Privada de Astrofotografía Nocturna',
    nameEn: 'Private High-Altitude Astrophotography Session',
    capacityMax: 4,
    booked: 1,
    unitPricePEN: 140,
    unitPriceUSD: 38,
    costPricePEN: 45,
    providerId: 'prov-1',
    unitLabel: 'sesiones / noche',
    description: 'Fotógrafo profesional capturando tu retrato bajo la Vía Láctea y entrega digital en alta resolución.',
    image: '/images/hanan_pacha_night_sky_1791233581943.jpg',
  },
];

// Semilla inicial de Reservas con Flujo Completo
export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'SQ-2026-0104',
    createdAt: '2026-10-05T14:30:00Z',
    customerName: 'Santiago Delgado Valdivia',
    customerEmail: 'santiago.delgado@gmail.com',
    customerPhone: '+51 984 662 109',
    customerDniOrPassport: '45892147',
    travelDate: '2026-10-24',
    endDate: '2026-10-26',
    guestsCount: 2,
    notes: 'Aniversario de matrimonio. Solicita habitación con chimenea encendida y menú sin gluten.',
    stayItem: {
      itemId: 'hosp-bungalow',
      name: 'Bungalow Rústico de Piedra & Chimenea',
      area: 'hospedaje',
      quantity: 2, // 2 noches
      unitPricePEN: 380,
      unitPriceUSD: 102,
      unitCostPEN: 140,
      subtotalPEN: 760,
      subtotalUSD: 204,
      subtotalCostPEN: 280,
      details: '2 noches (24 al 26 Oct)',
    },
    activities: [
      {
        itemId: 'act-hanan-pacha',
        name: 'Hanan Pacha: Astronomía Inca & Cumbres Sagradas',
        area: 'actividades',
        quantity: 2, // 2 personas
        unitPricePEN: 290,
        unitPriceUSD: 78,
        unitCostPEN: 95,
        subtotalPEN: 580,
        subtotalUSD: 156,
        subtotalCostPEN: 190,
      },
      {
        itemId: 'act-willka-unu',
        name: 'Willka Unu: Acueductos & Sauna Inca a Vapor',
        area: 'actividades',
        quantity: 2,
        unitPricePEN: 240,
        unitPriceUSD: 65,
        unitCostPEN: 80,
        subtotalPEN: 480,
        subtotalUSD: 130,
        subtotalCostPEN: 160,
      },
    ],
    meals: [
      {
        itemId: 'food-pachamanca',
        name: 'Pachamanca Andina Tradicional Ceremonial',
        area: 'alimentacion',
        quantity: 2,
        unitPricePEN: 85,
        unitPriceUSD: 23,
        unitCostPEN: 32,
        subtotalPEN: 170,
        subtotalUSD: 46,
        subtotalCostPEN: 64,
      },
      {
        itemId: 'food-novoandino',
        name: 'Menú Degustación Novoandino 5 Tiempos',
        area: 'alimentacion',
        quantity: 2,
        unitPricePEN: 95,
        unitPriceUSD: 26,
        unitCostPEN: 38,
        subtotalPEN: 190,
        subtotalUSD: 52,
        subtotalCostPEN: 76,
      },
    ],
    extras: [
      {
        itemId: 'extra-transporte-cusco',
        name: 'Traslado Privado Van Cusco <-> Km 84 Ollantaytambo',
        area: 'extras',
        quantity: 1,
        unitPricePEN: 180,
        unitPriceUSD: 49,
        unitCostPEN: 90,
        subtotalPEN: 180,
        subtotalUSD: 49,
        subtotalCostPEN: 90,
      },
      {
        itemId: 'extra-kit-hierbas',
        name: 'Botiquín & Kit de Hierbas Medicinales Andinas',
        area: 'extras',
        quantity: 2,
        unitPricePEN: 55,
        unitPriceUSD: 15,
        unitCostPEN: 18,
        subtotalPEN: 110,
        subtotalUSD: 30,
        subtotalCostPEN: 36,
      },
    ],
    totalPEN: 2470,
    totalUSD: 667,
    totalCostPEN: 896,
    grossMarginPEN: 1574,
    status: 'concretado',
    assignedAgent: 'Valeria Cruz (Ventas & Marketing)',
    paymentStatus: 'pagado_100',
    paymentMethod: 'transferencia_bcp',
    invoiceType: 'boleta',
    invoiceNumber: 'B001-00042',
    invoiceIssuedAt: '2026-10-06T11:00:00Z',
    emailLogs: [
      {
        id: 'mail-1',
        date: '2026-10-05T15:00:00Z',
        sender: 'ventas@sumaqkawsay.pe',
        recipient: 'santiago.delgado@gmail.com',
        subject: 'Tu Propuesta de Itinerario Sumaq Kawsay · Código SQ-2026-0104',
        body: 'Estimado Santiago, te enviamos el desglose de tu experiencia en Inka Lab con disponibilidad confirmada en Bungalow y Hanan Pacha.',
        type: 'cotizacion',
      },
      {
        id: 'mail-2',
        date: '2026-10-06T11:05:00Z',
        sender: 'ventas@sumaqkawsay.pe',
        recipient: 'santiago.delgado@gmail.com',
        subject: '¡Venta Concretada y Voucher Emitido! · Boleta B001-00042',
        body: 'Estimado Santiago, hemos recibido tu transferencia BCP exitosamente. Adjuntamos tu Voucher oficial y Boleta Electrónica autorizada.',
        type: 'confirmacion_voucher',
      },
    ],
  },
  {
    id: 'SQ-2026-0105',
    createdAt: '2026-10-06T09:15:00Z',
    customerName: 'Claire & Julien Dupont',
    customerEmail: 'claire.dupont@voyage.fr',
    customerPhone: '+33 6 45 88 12 30',
    customerDniOrPassport: 'FRA88712904',
    travelDate: '2026-11-02',
    endDate: '2026-11-03',
    guestsCount: 2,
    notes: 'Interesados en etnobotánica y cabalgata de caballos de paso.',
    stayItem: {
      itemId: 'hosp-glamping',
      name: 'Domo Glamping Ancestral Andino',
      area: 'hospedaje',
      quantity: 1,
      unitPricePEN: 290,
      unitPriceUSD: 78,
      unitCostPEN: 100,
      subtotalPEN: 290,
      subtotalUSD: 78,
      subtotalCostPEN: 100,
    },
    activities: [
      {
        itemId: 'act-etnobotanica',
        name: 'Ruta Etnobotánica & Huerto Medicinal Chillca',
        area: 'actividades',
        quantity: 2,
        unitPricePEN: 280,
        unitPriceUSD: 75,
        unitCostPEN: 85,
        subtotalPEN: 560,
        subtotalUSD: 150,
        subtotalCostPEN: 170,
      },
      {
        itemId: 'act-cabalgata',
        name: 'Cabalgata en Caballos de Paso por el Qhapaq Ñan',
        area: 'actividades',
        quantity: 2,
        unitPricePEN: 380,
        unitPriceUSD: 102,
        unitCostPEN: 130,
        subtotalPEN: 760,
        subtotalUSD: 204,
        subtotalCostPEN: 260,
      },
    ],
    meals: [
      {
        itemId: 'food-pachamanca',
        name: 'Pachamanca Andina Tradicional Ceremonial',
        area: 'alimentacion',
        quantity: 2,
        unitPricePEN: 85,
        unitPriceUSD: 23,
        unitCostPEN: 32,
        subtotalPEN: 170,
        subtotalUSD: 46,
        subtotalCostPEN: 64,
      },
    ],
    extras: [
      {
        itemId: 'extra-transporte-cusco',
        name: 'Traslado Privado Van Cusco <-> Km 84 Ollantaytambo',
        area: 'extras',
        quantity: 1,
        unitPricePEN: 180,
        unitPriceUSD: 49,
        unitCostPEN: 90,
        subtotalPEN: 180,
        subtotalUSD: 49,
        subtotalCostPEN: 90,
      },
    ],
    totalPEN: 1960,
    totalUSD: 527,
    totalCostPEN: 684,
    grossMarginPEN: 1276,
    status: 'en_seguimiento',
    assignedAgent: 'Renato Paredes (Ventas & Marketing)',
    paymentStatus: 'adelanto_50',
    paymentMethod: 'tarjeta',
    invoiceType: 'boleta',
    emailLogs: [
      {
        id: 'mail-3',
        date: '2026-10-06T10:00:00Z',
        sender: 'ventas@sumaqkawsay.pe',
        recipient: 'claire.dupont@voyage.fr',
        subject: 'Cotización Oficial Inka Lab · Código SQ-2026-0105',
        body: 'Chère Claire, nous avons pré-réservé votre dôme de glamping et la randonnée équestre. Il reste 50% à solder.',
        type: 'cotizacion',
      },
    ],
  },
  {
    id: 'SQ-2026-0106',
    createdAt: '2026-10-07T08:20:00Z',
    customerName: 'Gabriela Rosas Ortiz',
    customerEmail: 'gabriela.rosas@pucp.edu.pe',
    customerPhone: '+51 993 118 450',
    customerDniOrPassport: '70231948',
    travelDate: '2026-10-18',
    endDate: '2026-10-19',
    guestsCount: 4,
    notes: 'Grupo universitario de investigación etnobotánica.',
    stayItem: null, // Solo pasa el día
    activities: [
      {
        itemId: 'act-etnobotanica',
        name: 'Ruta Etnobotánica & Huerto Medicinal Chillca',
        area: 'actividades',
        quantity: 4,
        unitPricePEN: 280,
        unitPriceUSD: 75,
        unitCostPEN: 85,
        subtotalPEN: 1120,
        subtotalUSD: 300,
        subtotalCostPEN: 340,
      },
    ],
    meals: [
      {
        itemId: 'food-picnic',
        name: 'Picnic Gourmet Campestre con Trucha de Altura',
        area: 'alimentacion',
        quantity: 4,
        unitPricePEN: 65,
        unitPriceUSD: 18,
        unitCostPEN: 24,
        subtotalPEN: 260,
        subtotalUSD: 72,
        subtotalCostPEN: 96,
      },
    ],
    extras: [
      {
        itemId: 'extra-kit-hierbas',
        name: 'Botiquín & Kit de Hierbas Medicinales Andinas',
        area: 'extras',
        quantity: 4,
        unitPricePEN: 55,
        unitPriceUSD: 15,
        unitCostPEN: 18,
        subtotalPEN: 220,
        subtotalUSD: 60,
        subtotalCostPEN: 72,
      },
    ],
    totalPEN: 1600,
    totalUSD: 432,
    totalCostPEN: 508,
    grossMarginPEN: 1092,
    status: 'cotizado',
    assignedAgent: 'Valeria Cruz (Ventas & Marketing)',
    paymentStatus: 'pendiente',
    paymentMethod: 'yape_plin',
    invoiceType: 'boleta',
    emailLogs: [],
  },
];

// Semilla inicial de Transacciones Contables
export const INITIAL_ACCOUNTING_ENTRIES: AccountingTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-10-06T11:00:00Z',
    type: 'ingreso',
    concept: 'Pago total de Reserva SQ-2026-0104 (Bungalow + Hanan Pacha + Sauna)',
    category: 'Venta de Reserva',
    amountPEN: 2470,
    amountUSD: 667,
    reservationId: 'SQ-2026-0104',
    invoiceNumber: 'B001-00042',
    paymentMethod: 'transferencia_bcp',
    registeredBy: 'CPC Alberto Carrillo (Contador Principal)',
  },
  {
    id: 'tx-2',
    date: '2026-10-06T11:30:00Z',
    type: 'egreso',
    concept: 'Liquidación a Comunidad de Chillca por guías de Hanan Pacha (SQ-2026-0104)',
    category: 'Pago a Proveedor',
    amountPEN: 190,
    amountUSD: 51,
    reservationId: 'SQ-2026-0104',
    providerId: 'prov-1',
    paymentMethod: 'transferencia_bcp',
    registeredBy: 'CPC Alberto Carrillo (Contador Principal)',
  },
  {
    id: 'tx-3',
    date: '2026-10-06T12:00:00Z',
    type: 'egreso',
    concept: 'Pago insumos de cocina y huerto a Huerto Agroecológico (SQ-2026-0104)',
    category: 'Pago a Proveedor',
    amountPEN: 300,
    amountUSD: 81,
    reservationId: 'SQ-2026-0104',
    providerId: 'prov-2',
    paymentMethod: 'yape_plin',
    registeredBy: 'CPC Alberto Carrillo (Contador Principal)',
  },
  {
    id: 'tx-4',
    date: '2026-10-06T10:15:00Z',
    type: 'ingreso',
    concept: 'Adelanto 50% Reserva SQ-2026-0105 (Glamping + Etnobotánica)',
    category: 'Venta de Reserva',
    amountPEN: 980,
    amountUSD: 263.5,
    reservationId: 'SQ-2026-0105',
    paymentMethod: 'tarjeta',
    registeredBy: 'CPC Alberto Carrillo (Contador Principal)',
  },
];
