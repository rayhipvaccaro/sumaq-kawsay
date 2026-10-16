export interface PageBlock {
  id: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  image?: string;
}

export interface PageContent {
  eyebrowEs?: string;
  eyebrowEn?: string;
  titleEs?: string;
  titleEn?: string;
  subtitleEs?: string;
  subtitleEn?: string;
  blocks?: PageBlock[];
}

export interface PageDefault {
  key: string; // es la ruta: /servicios -> servicios
  label: string;
  eyebrow: [string, string];
  title: [string, string];
  subtitle: [string, string];
}

// Textos actuales de cada página (sirven de guía en el editor).
export const PAGE_LIST: PageDefault[] = [
  { key: 'nosotros', label: 'Nosotros', eyebrow: ['Sumaq Kawsay · Inka Lab', 'Sumaq Kawsay · Inka Lab'], title: ['Sobre nosotros', 'About us'], subtitle: ['Turismo sostenible y sabiduría andina en el Km 84 de Ollantaytambo.', 'Sustainable tourism and Andean wisdom at Km 84, Ollantaytambo.'] },
  { key: 'zonas', label: 'Zonas sagradas', eyebrow: ['Inka Lab', 'Inka Lab'], title: ['Zonas sagradas', 'Sacred zones'], subtitle: ['Hanan Pacha, Willka Unu e Inti Punku: tres recorridos, tres formas de entender los Andes.', 'Hanan Pacha, Willka Unu and Inti Punku: three routes, three ways to understand the Andes.'] },
  { key: 'experiencias', label: 'Tours y actividades', eyebrow: ['Sumaq Kawsay', 'Sumaq Kawsay'], title: ['Tours y actividades', 'Tours & activities'], subtitle: ['Elige una experiencia, mira su detalle y reserva con cupos reales.', 'Choose an experience, see the details and book with real availability.'] },
  { key: 'servicios', label: 'Servicios y tarifas', eyebrow: ['Inka Lab', 'Inka Lab'], title: ['Servicios y tarifas', 'Services & rates'], subtitle: ['Dormir, comer, relajarte y pasar el día en el complejo.', 'Sleep, dine, unwind and spend the day at the complex.'] },
  { key: 'herbario', label: 'Herbario vivo', eyebrow: ['Chillca', 'Chillca'], title: ['Herbario vivo', 'Living herbarium'], subtitle: ['Plantas medicinales y saberes que se aprenden caminando.', 'Medicinal plants and knowledge learned on foot.'] },
  { key: 'planificador', label: 'Planifica tu viaje', eyebrow: ['Sumaq Kawsay', 'Sumaq Kawsay'], title: ['Planifica tu viaje', 'Plan your trip'], subtitle: ['Arma tu ruta y mira el precio estimado en la moneda que prefieras.', 'Build your route and see the estimated price in your preferred currency.'] },
  { key: 'estacionalidad', label: 'Clima y temporadas', eyebrow: ['Km 84', 'Km 84'], title: ['Clima y temporadas', 'Climate & seasons'], subtitle: ['Cuándo ir según lo que quieras vivir.', 'When to go, depending on what you want to experience.'] },
  { key: 'como-llegar', label: 'Cómo llegar', eyebrow: ['Ollantaytambo', 'Ollantaytambo'], title: ['Cómo llegar', 'How to get here'], subtitle: ['Desde Cusco son unos 80 minutos hasta el Km 84.', 'It is about 80 minutes from Cusco to Km 84.'] },
  { key: 'audioguias', label: 'QR y audioguías', eyebrow: ['Inka Lab', 'Inka Lab'], title: ['QR y audioguías', 'QR & audio guides'], subtitle: ['Escanea el código en cada zona y escucha su historia.', 'Scan the code in each zone and listen to its story.'] },
  { key: 'galeria', label: 'Galería', eyebrow: ['Inka Lab', 'Inka Lab'], title: ['Galería', 'Gallery'], subtitle: ['Paisajes, cultura, aventura y descanso en el Valle Sagrado.', 'Landscapes, culture, adventure and rest in the Sacred Valley.'] },
  { key: 'prensa', label: 'Prensa y cultura', eyebrow: ['Inka Lab', 'Inka Lab'], title: ['Prensa y cultura', 'Press & culture'], subtitle: ['Artículos sobre arqueología, cosmovisión y vida en Ollantaytambo.', 'Articles on archaeology, cosmovision and life in Ollantaytambo.'] },
  { key: 'contacto', label: 'Contacto', eyebrow: ['Sumaq Kawsay', 'Sumaq Kawsay'], title: ['Contacto', 'Contact'], subtitle: ['Cuéntanos qué quieres vivir y te respondemos.', 'Tell us what you want to experience and we will reply.'] },
  { key: 'reservar', label: 'Reservar', eyebrow: ['Sumaq Kawsay', 'Sumaq Kawsay'], title: ['Reservar', 'Book'], subtitle: ['Elige fecha, hospedaje, actividades y comidas en un solo recorrido.', 'Pick your date, stay, activities and meals in a single flow.'] },
];