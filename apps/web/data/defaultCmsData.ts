import { Tour, TOURS_DATA } from './toursData';
import {
  StockItem,
  Provider,
  Reservation,
  AccountingTransaction,
  INITIAL_STOCK_ITEMS,
  INITIAL_PROVIDERS,
  INITIAL_RESERVATIONS,
  INITIAL_ACCOUNTING_ENTRIES,
} from './businessData';

export interface Sponsor {
  id: string;
  name: string;
  role: string;
  logoText?: string;
  badge?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  roleEs: string;
  roleEn: string;
  org: string;
  quoteEs: string;
  quoteEn: string;
  tagEs: string;
  rating: number;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  tourInterest?: string;
  travelDate?: string;
  createdAt: string;
  status: 'nuevo' | 'contactado' | 'en_proceso';
}

export interface GeneralContent {
  heroBadgeEs: string;
  heroBadgeEn: string;
  heroTitle: string;
  heroSubtitleEs: string;
  heroSubtitleEn: string;
  heroDescriptionEs: string;
  heroDescriptionEn: string;
  heroImage?: string;
  aboutKickerEs: string;
  aboutKickerEn: string;
  aboutTitleEs: string;
  aboutTitleEn: string;
  aboutSubtitleEs: string;
  aboutSubtitleEn: string;
  sponsors: Sponsor[];
}

export interface CMSData {
  tours: Tour[];
  generalContent: GeneralContent;
  testimonials: TestimonialItem[];
  contacts: ContactLead[];
  stockItems: StockItem[];
  providers: Provider[];
  reservations: Reservation[];
  accountingEntries: AccountingTransaction[];
}

export const DEFAULT_CMS_DATA: CMSData = {
  tours: TOURS_DATA,
  stockItems: INITIAL_STOCK_ITEMS,
  providers: INITIAL_PROVIDERS,
  reservations: INITIAL_RESERVATIONS,
  accountingEntries: INITIAL_ACCOUNTING_ENTRIES,
  generalContent: {
    heroBadgeEs: 'Sumaq Kawsay · Turismo Sostenible & Sabiduría Andina · Cusco',
    heroBadgeEn: 'Sumaq Kawsay · Sustainable Tourism & Andean Wisdom · Cusco',
    heroTitle: 'SUMAQ KAWSAY',
    heroSubtitleEs: 'Donde la sabiduría de los Andes sigue viva.',
    heroSubtitleEn: 'Where the living soul of the Andes breathes.',
    heroDescriptionEs: 'Plataforma oficial de turismo consciente, expediciones personalizadas, etnobotánica viva y experiencias vivenciales en nuestro santuario ecológico Inka Lab (Km 84 Ollantaytambo).',
    heroDescriptionEn: 'Official platform for mindful travel, tailored expeditions, living ethnobotany, and immersive stays at our Inka Lab ecotourism sanctuary (Km 84 Ollantaytambo).',
    heroImage: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
    aboutKickerEs: 'Nuestra Esencia Ancestral',
    aboutKickerEn: 'Our Ancestral Essence',
    aboutTitleEs: 'El principio sagrado del Sumaq Kawsay',
    aboutTitleEn: 'The Sacred Principle of Sumaq Kawsay',
    aboutSubtitleEs: 'En quechua, "Sumaq Kawsay" significa el Buen Vivir: habitar el mundo en profunda reciprocidad con la Pachamama (Madre Tierra), la comunidad y uno mismo.',
    aboutSubtitleEn: 'In Quechua, "Sumaq Kawsay" means Good Living: walking in deep reciprocity with Pachamama (Mother Earth), the community, and oneself.',
    sponsors: [
      { id: 'sp-1', name: 'MINCETUR Cusco', role: 'Operador Formal Registrado', badge: 'Licencia DIRCETUR' },
      { id: 'sp-2', name: 'Comunidad de Chillca', role: 'Alianza de Turismo Comunitario', badge: 'Socio Local' },
      { id: 'sp-3', name: 'Inka Lab Km 84', role: 'Santuario Ecoturístico y Laboratorio', badge: 'Sede Vivencial' },
      { id: 'sp-4', name: 'DIRCETUR Cusco', role: 'Registro Nacional de Turismo', badge: 'Garantía Formal' },
    ],
  },
  testimonials: [
    {
      id: 'test-1',
      author: 'Rosario Quispe',
      roleEs: 'Operadora de Turismo Comunitario',
      roleEn: 'Community Tourism Operator',
      org: 'Chillca, Valle Sagrado',
      quoteEs: '“Gracias a Sumaq Kawsay e Inka Lab, nuestro emprendimiento local logró mejorar la experiencia del visitante y aplicar estrategias sostenibles que nos posicionaron como referentes en el Valle Sagrado.”',
      quoteEn: '“Thanks to Sumaq Kawsay and Inka Lab, our local community enterprise elevated the guest experience and applied sustainable strategies in the Sacred Valley.”',
      tagEs: 'Socio Comunitario',
      rating: 5,
    },
    {
      id: 'test-2',
      author: 'Javier Mamani',
      roleEs: 'Gerente de Operaciones',
      roleEn: 'Operations Manager',
      org: 'Cusco Travel Lab',
      quoteEs: '“El acompañamiento técnico y la visión innovadora de Sumaq Kawsay nos permitieron transformar procesos clave y fortalecer nuestro compromiso con el turismo responsable y precios justos.”',
      quoteEn: '“The technical support and vision of Sumaq Kawsay enabled us to transform key operations and solidify fair pricing.”',
      tagEs: 'Alianza Estratégica',
      rating: 5,
    },
    {
      id: 'test-3',
      author: 'Elena & David Ramos',
      roleEs: 'Viajeros de España',
      roleEn: 'Travelers from Spain',
      org: 'Tour Etnobotánica & Cabalgata',
      quoteEs: '“La experiencia en el huerto medicinal de Chillca nos cambió la perspectiva. Los saberes herbolarios y el respeto de la gente local no tienen comparación con ninguna agencia masiva.”',
      quoteEn: '“Our day in Chillca’s botanical sanctuary transformed our perspective. Learning ancestral plant medicine directly from elders felt deeply authentic.”',
      tagEs: 'Viajeros Verificados',
      rating: 5,
    },
    {
      id: 'test-4',
      author: 'Sophie Miller',
      roleEs: 'Mochilera & Botánica (Canadá)',
      roleEn: 'Backpacker & Botanist (Canada)',
      org: 'Camino Inca Sostenible 4D/3N',
      quoteEs: '“El Camino Inca con Sumaq Kawsay fue impecable: trato digno y transparente a los porteadores, comida de montaña deliciosa y una energía mística única. Recomendadísimo.”',
      quoteEn: '“The Inca Trail with Sumaq Kawsay was extraordinary: dignified wages for porters, nutritious Andean food, and zero tourist fluff.”',
      tagEs: 'Viajera Verificada',
      rating: 5,
    },
  ],
  contacts: [
    {
      id: 'lead-1',
      name: 'Carlos Mendoza Silva',
      email: 'carlos.mendoza@gmail.com',
      phone: '+51 984 552 110',
      message: 'Buenas tardes, estamos interesados en el tour de Etnobotánica en Chillca para un grupo de 4 personas para la primera semana de noviembre.',
      tourInterest: 'Tour de Etnobotánica y Medicina Natural',
      travelDate: '2026-11-05',
      createdAt: '2026-10-04T16:30:00Z',
      status: 'nuevo',
    },
    {
      id: 'lead-2',
      name: 'Maria Fernandez (Buenos Aires)',
      email: 'mfernandez_travel@outlook.com',
      phone: '+54 9 11 4589 1234',
      message: 'Hola! Queremos coordinar una visita al complejo Inka Lab y contratar el Day Pass con Sauna Inca para dos personas.',
      tourInterest: 'Inka Lab Day Pass & Sauna Inca',
      travelDate: '2026-10-22',
      createdAt: '2026-10-05T10:15:00Z',
      status: 'contactado',
    },
  ],
};
