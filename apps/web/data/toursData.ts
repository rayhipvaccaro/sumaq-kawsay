export interface Tour {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  subtitleEs: string;
  subtitleEn: string;
  category: 'etnobotanica' | 'cabalgata' | 'camino-inca' | 'cultura' | 'experiencias';
  locationEs: string;
  locationEn: string;
  durationEs: string;
  durationEn: string;
  pricePEN: number;
  priceUSD: number;
  image: string;
  difficultyEs: 'Fácil' | 'Moderado' | 'Desafiante';
  difficultyEn: 'Easy' | 'Moderate' | 'Challenging';
  maxAltitude: string;
  groupSize: string;
  descriptionEs: string;
  descriptionEn: string;
  highlightsEs: string[];
  highlightsEn: string[];
  itinerary: {
    time: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
  }[];
  includedEs: string[];
  includedEn: string[];
  notIncludedEs: string[];
  notIncludedEn: string[];
  whatToBringEs: string[];
  whatToBringEn: string[];
}

export const TOURS_DATA: Tour[] = [
  {
    id: 'etnobotanica-chillca',
    slug: 'tour-etnobotanica-medicina-natural',
    titleEs: 'Tour de Etnobotánica y Medicina Natural en Sumaq Kawsay',
    titleEn: 'Ethnobotany & Ancestral Natural Medicine Tour in Sumaq Kawsay',
    subtitleEs: 'Reconexión con las plantas sagradas y sabiduría herbolaria en Chillca, Ollantaytambo',
    subtitleEn: 'Reconnection with sacred plants and herbal wisdom in Chillca, Ollantaytambo',
    category: 'etnobotanica',
    locationEs: 'Chillca, Ollantaytambo · Valle Sagrado',
    locationEn: 'Chillca, Ollantaytambo · Sacred Valley',
    durationEs: 'Día Completo (8h)',
    durationEn: 'Full Day (8h)',
    pricePEN: 579.90,
    priceUSD: 155.00,
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
    difficultyEs: 'Fácil',
    difficultyEn: 'Easy',
    maxAltitude: '2,870 msnm',
    groupSize: 'Máx. 8 personas (Personalizado)',
    descriptionEs: 'Una inmersión vivencial en el laboratorio natural de Sumaq Kawsay. Aprenderás de abuelos herbolarios la identificación, propiedades curativas y preparación tradicional de plantas maestras andinas (Muña, Coca, Sasawi, Markhu). Incluye ceremonia de agradecimiento a la Pachamama y almuerzo andino orgánico con cosechas locales.',
    descriptionEn: 'A hands-on immersive journey into Sumaq Kawsay\'s natural living laboratory. Learn from ancestral herbal masters to identify, harvest, and prepare native Andean healing flora (Muña, Sacred Coca, Sasawi, Markhu). Includes an authentic Pachamama gratitude offering and organic farm-to-table lunch.',
    highlightsEs: [
      'Recorrido por el huerto etnobotánico experimental y recolección guiada',
      'Taller práctico de destilación de aceites esenciales y ungüentos naturales',
      'Ceremonia tradicional de Kintu (tres hojas de coca) con Paqo andino',
      'Almuerzo orgánico con superalimentos de los Andes (quinua, kiwicha, tubérculos nativos)',
      'Kit personal de botiquín natural andino elaborado por ti mismo'
    ],
    highlightsEn: [
      'Guided walk through experimental ethnobotanical gardens and wild harvesting',
      'Hands-on workshop crafting natural tinctures, ointments, and medicinal teas',
      'Traditional Kintu blessing ceremony led by an authentic Andean Paqo healer',
      'Organic feast prepared with native Andean superfoods and heritage grains',
      'Custom handcrafted natural medicine kit to take home'
    ],
    itinerary: [
      {
        time: '08:00 AM',
        titleEs: 'Recojo en Cusco u Ollantaytambo',
        titleEn: 'Pick-up in Cusco or Ollantaytambo',
        descEs: 'Traslado escénico privado a través del Valle Sagrado hasta la comunidad de Chillca.',
        descEn: 'Scenic private ride through the Sacred Valley to the peaceful community of Chillca.'
      },
      {
        time: '09:30 AM',
        titleEs: 'Bienvenida con infusión de bienvenida y Círculo de Palabra',
        titleEn: 'Welcome Herbal Tea & Circle of Intention',
        descEs: 'Presentación con los sabios locales, explicación del concepto Sumaq Kawsay (Buen Vivir).',
        descEn: 'Introduction with native elders, grounding in the ancestral philosophy of Sumaq Kawsay.'
      },
      {
        time: '10:30 AM',
        titleEs: 'Recorrido por el Sendero Etnobotánico',
        titleEn: 'Ethnobotanical Trail Expedition',
        descEs: 'Identificación botánica de más de 20 especies medicinales silvestres y cultivadas.',
        descEn: 'Field identification of over 20 wild and cultivated high-altitude medicinal species.'
      },
      {
        time: '01:00 PM',
        titleEs: 'Almuerzo Campestre de la Chacra a la Mesa',
        titleEn: 'Farm-to-Table Andean Lunch',
        descEs: 'Degustación de gastronomía sagrada preparada en horno de barro con insumos locales.',
        descEn: 'Organic wholesome meal cooked with native Andean tubers, fresh herbs, and heirloom grains.'
      },
      {
        time: '02:30 PM',
        titleEs: 'Taller de Alquimia Ancestral & Elaboración de Remedios',
        titleEn: 'Ancestral Alchemy & Natural Remedy Workshop',
        descEs: 'Preparación de tu propia tintura medicinal y bálsamo calmante.',
        descEn: 'Create your own medicinal tincture and muscle-soothing balm to take home.'
      },
      {
        time: '04:30 PM',
        titleEs: 'Ceremonia de Cierre y Retorno',
        titleEn: 'Closing Ceremony & Return Transfer',
        descEs: 'Agradecimiento a los Apus y regreso cómodo a tu hotel en Cusco o Valle Sagrado.',
        descEn: 'Gratitude circle to the sacred mountain peaks (Apus) and comfortable ride back.'
      }
    ],
    includedEs: [
      'Transporte turístico privado ida y vuelta',
      'Guía etnobotánico bilingüe especializado y maestro herbolario local',
      'Todos los materiales e insumos para el taller de medicina natural',
      'Kit de remedios naturales elaborados en la sesión',
      'Almuerzo campestre orgánico completo con bebidas de hierbas frescas',
      'Entradas y contribución directa a las familias de la comunidad de Chillca'
    ],
    includedEn: [
      'Private round-trip tourist transportation',
      'Specialized bilingual ethnobotanist guide & indigenous herbal master',
      'All workshop supplies, botanical extracts, and artisan containers',
      'Personal natural remedy kit crafted during the session',
      'Farm-to-table organic lunch and fresh botanical refreshments',
      'Admission fees and direct fair-trade contribution to the Chillca community'
    ],
    notIncludedEs: ['Propinas voluntarias', 'Bebidas alcohólicas', 'Gastos personales no especificados'],
    notIncludedEn: ['Voluntary gratuities', 'Alcoholic beverages', 'Unspecified personal expenses'],
    whatToBringEs: ['Ropa cómoda en capas', 'Zapatos de caminata ligeros', 'Sombrero y bloqueador solar', 'Botella de agua reutilizable', 'Cámara fotográfica'],
    whatToBringEn: ['Comfortable layered clothing', 'Light hiking shoes', 'Sun hat and eco-friendly sunscreen', 'Refillable water canteen', 'Camera']
  },
  {
    id: 'cabalgata-qhapaq-nan',
    slug: 'cabalgata-qhapaq-nan-y-valle-sagrado',
    titleEs: 'Cabalgata de Caballos de Paso en el Qhapaq Ñan',
    titleEn: 'Peruvian Paso Horse Expedition on the Qhapaq Ñan',
    subtitleEs: 'Elegancia ecuestre peruana por caminos sagrados incas con vista al Nevado Verónica',
    subtitleEn: 'Peruvian equestrian elegance through ancient Inca stone trails with Veronica peak vistas',
    category: 'cabalgata',
    locationEs: 'Valle Sagrado de los Incas · Ollantaytambo',
    locationEn: 'Sacred Valley of the Incas · Ollantaytambo',
    durationEs: 'Medio Día (3h a 6h)',
    durationEn: 'Half Day (3h to 6h)',
    pricePEN: 420.00,
    priceUSD: 115.00,
    image: '/images/cabalgata_caballos_paso_1791233048725.jpg',
    difficultyEs: 'Fácil',
    difficultyEn: 'Easy',
    maxAltitude: '2,900 msnm',
    groupSize: 'Grupos reducidos (2 a 6 jinetes)',
    descriptionEs: 'Siente la suavidad inigualable del Caballo Peruano de Paso, declarado Patrimonio Cultural de la Nación. Recorrerás secciones históricas del Qhapaq Ñan (Red Vial Incaica), cruzando terrazas agrícolas milenarias, riachuelos cristalinos y aldeas quechuas con el majestuoso nevado Verónica custodiando el horizonte.',
    descriptionEn: 'Experience the world-renowned smooth gait of the Peruvian Paso horse, designated Cultural Heritage of Peru. Trot effortlessly along original stone segments of the Qhapaq Ñan (Inca Trail network), traversing ancient agricultural terraces, pure Andean streams, and Quechua villages beneath Mount Veronica.',
    highlightsEs: [
      'Montura en ejemplares registrados de Caballo Peruano de Paso con paso llano ultra suave',
      'Ruta exclusiva por tramos vírgenes del Qhapaq Ñan alejados de las masas turísticas',
      'Acompañamiento de chalanes expertos y arrieros locales con indumentaria tradicional',
      'Parada panorámica con refrigerio andino gourmet y vistas al Nevado Verónica',
      'Apto para principiantes y jinetes experimentados'
    ],
    highlightsEn: [
      'Ride registered Peruvian Paso horses famed for their effortless four-beat gait',
      'Exclusive route through pristine stone trail sections untouched by mass tourism',
      'Accompanied by veteran Peruvian chalán equestrian guides in authentic attire',
      'Panoramic rest stop with artisanal Andean snacks and Mount Veronica view',
      'Beginner-friendly and tailored to experienced riders alike'
    ],
    itinerary: [
      {
        time: '08:30 AM',
        titleEs: 'Encuentro en el Rancho en el Valle Sagrado',
        titleEn: 'Ranch Gathering in the Sacred Valley',
        descEs: 'Charla de seguridad, presentación de los caballos y emparejamiento según nivel.',
        descEn: 'Safety briefing, meeting the horses, and personalized pairing according to experience.'
      },
      {
        time: '09:15 AM',
        titleEs: 'Inicio de la Cabalgata por el Qhapaq Ñan',
        titleEn: 'Ride Departure onto the Sacred Qhapaq Ñan',
        descEs: 'Ascenso suave por senderos empedrados prehispánicos bordeando el río Urubamba.',
        descEn: 'Gentle ascent on pre-Hispanic stone trails meandering alongside the Urubamba River.'
      },
      {
        time: '11:00 AM',
        titleEs: 'Mirador de los Apus y Refrigerio Campestre',
        titleEn: 'Sacred Mountain Viewpoint & Gourmet Snack',
        descEs: 'Descanso en mirador natural, hidratación, quesos artesanales, frutos secos y chicha morada.',
        descEn: 'Scenic pasture stop with artisan local cheeses, dried fruits, and organic Andean nectar.'
      },
      {
        time: '12:30 PM',
        titleEs: 'Retorno al rancho y demostración ecuestre',
        titleEn: 'Return to Ranch & Marinera Equestrian Showcase',
        descEs: 'Breve demostración del baile de marinera y despedida de los caballos.',
        descEn: 'Graceful demonstration of the Peruvian Marinera dance on horseback.'
      }
    ],
    includedEs: [
      'Caballos peruanos de paso seleccionados y domados para turismo seguro',
      'Casco de equitación certificado y polainas de cuero',
      'Chalán guía profesional bilingüe y asistente arriero',
      'Snack gourmet de productos locales orgánicos',
      'Botiquín de primeros auxilios y seguro contra accidentes'
    ],
    includedEn: [
      'Purebred Peruvian Paso horses trained for gentle trail riding',
      'Certified equestrian helmets and protective chaps',
      'Professional bilingual equestrian guide and local horse handler',
      'Artisanal farm snack featuring regional specialties',
      'First-aid equipment and adventure insurance coverage'
    ],
    notIncludedEs: ['Traslado interprovincial no coordinado', 'Propinas', 'Almuerzo completo de varios tiempos'],
    notIncludedEn: ['Unscheduled intercity transport', 'Gratuities', 'Full multi-course seated lunch'],
    whatToBringEs: ['Pantalón largo cómodo (jeans o de montar)', 'Calzado cerrado con suela firme', 'Gafas de sol y protector solar', 'Chaqueta cortavientos ligera'],
    whatToBringEn: ['Comfortable long trousers', 'Sturdy closed shoes or boots', 'Sunglasses and sun protection', 'Light windbreaker jacket']
  },
  {
    id: 'camino-inca-economico',
    slug: 'camino-inca-economico-sostenible',
    titleEs: 'Camino Inca Sostenible & Accesible (InkaLab)',
    titleEn: 'Sustainable & Accessible Inca Trail (InkaLab)',
    subtitleEs: 'Travesía legendaria con precios justos, sin intermediarios y cuidando a las comunidades',
    subtitleEn: 'Legendary trek with fair pricing, zero predatory middlemen, and deep community respect',
    category: 'camino-inca',
    locationEs: 'Km 82 / Km 104 a Machu Picchu · Cusco',
    locationEn: 'Km 82 / Km 104 to Machu Picchu · Cusco',
    durationEs: 'Opciones 2D/1N o 4D/3N',
    durationEn: 'Options: 2D/1N or 4D/3N',
    pricePEN: 1450.00,
    priceUSD: 395.00,
    image: '/images/camino_inca_hikers_1791233058867.jpg',
    difficultyEs: 'Moderado',
    difficultyEn: 'Moderate',
    maxAltitude: '4,215 msnm (Paso Warmiwañusqa)',
    groupSize: 'Grupos sostenibles (Máx. 10 trekkeros)',
    descriptionEs: 'En InkaLab creemos que la magia de los Andes debe ser accesible para todos. Diseñamos una experiencia que combina autenticidad, sostenibilidad y precios justos, ideal para mochileros y viajeros con propósito sin inflar costos innecesarios. Pagamos sueldos dignos a porteadores y cocineros andinos, usamos equipos ecológicos y garantizamos tu permiso oficial a Machu Picchu.',
    descriptionEn: 'At InkaLab, we believe Andean wonder belongs to conscious travelers of all backgrounds. We eliminate predatory middlemen to offer transparent, fair pricing while paying top-tier wages to local porters and mountain chefs. Includes guaranteed official government permits to Machu Picchu through the historic Sun Gate (Inti Punku).',
    highlightsEs: [
      'Permiso oficial garantizado del Ministerio de Cultura para el Camino Inca',
      'Entrada y tour guiado en la Ciudadela Sagrada de Machu Picchu',
      'Trato justo y salario digno certificado para porteadores y cocineros locales',
      'Menús nutritivos andinos preparados en montaña con ingredientes frescos',
      'Tren turístico de retorno desde Aguas Calientes hasta Ollantaytambo'
    ],
    highlightsEn: [
      'Guaranteed official government permit issued for the classic Inca Trail',
      'Entry and comprehensive guided tour of Machu Picchu Citadel',
      'Fair-wage certified expedition honoring native porters and mountain cooks',
      'Wholesome Andean mountain meals prepared fresh at daily camp stations',
      'Scenic expedition tourist train return ticket to the Sacred Valley'
    ],
    itinerary: [
      {
        time: 'Día 1',
        titleEs: 'Cusco - Km 82 - Ayapata',
        titleEn: 'Cusco - Km 82 - Ayapata Camp',
        descEs: 'Punto de control, inicio de la caminata bordeando el río Urubamba y vistas de ruinas de Patallacta.',
        descEn: 'Pass the official checkpoint, hike alongside the Urubamba river with views of Patallacta ruins.'
      },
      {
        time: 'Día 2',
        titleEs: 'Paso de la Mujer Muerta (4,215m) - Chaquicocha',
        titleEn: 'Dead Woman\'s Pass (4,215m) - Chaquicocha',
        descEs: 'Ascenso desafiante al punto más alto, descenso a valles nubosos y campamento bajo las estrellas.',
        descEn: 'Challenging ascent to the summit pass, descent into lush cloud forest camp beneath Andean constellations.'
      },
      {
        time: 'Día 3',
        titleEs: 'Phuyupatamarca - Wiñay Wayna',
        titleEn: 'Phuyupatamarca - Wiñay Wayna',
        descEs: 'Túneles incas tallados en roca, vistas de la ceja de selva y terrazas impresionantes de Wiñay Wayna.',
        descEn: 'Hand-carved Inca tunnels, panoramic mountain ridges, and the magnificent ruins of Wiñay Wayna.'
      },
      {
        time: 'Día 4',
        titleEs: 'Puerta del Sol (Inti Punku) - Machu Picchu - Retorno',
        titleEn: 'Sun Gate (Inti Punku) - Machu Picchu - Cusco Return',
        descEs: 'Llegada al amanecer por Inti Punku, tour guiado en Machu Picchu y tren panorámico de retorno.',
        descEn: 'Sunrise entry via the Sun Gate, guided exploration of the Citadel, and return scenic train.'
      }
    ],
    includedEs: [
      'Permisos oficiales de ingreso al Camino Inca y Machu Picchu',
      'Guía profesional de montaña certificado en turismo andino',
      'Porteadores para equipo colectivo y carpas de alta montaña',
      'Todas las comidas durante la caminata preparadas por chef andino',
      'Boleto de tren turístico Aguas Calientes - Ollantaytambo y bus a Cusco',
      'Botiquín de altura y tanque de oxígeno'
    ],
    includedEn: [
      'Official Inca Trail & Machu Picchu conservation entry permits',
      'Licensed professional wilderness guide fluent in English & Quechua',
      'Porters for collective equipment, dining tents, and alpine gear',
      'All mountain gourmet meals prepared with fresh local supplies',
      'Expedition train ticket from Aguas Calientes and private transfer to Cusco',
      'Medical oxygen and high-altitude emergency first aid'
    ],
    notIncludedEs: ['Bolsa de dormir (disponible en alquiler)', 'Bastones de trekking con puntas de goma', 'Propinas para porteadores y cocineros'],
    notIncludedEn: ['Sleeping bag (available for rent)', 'Trekking poles with rubber tips', 'Gratuities for porters and kitchen crew'],
    whatToBringEs: ['Pasaporte original vigente', 'Mochila de trekking 30-40L', 'Botas de montaña impermeables', 'Ropa térmica y poncho de lluvia', 'Pastillas purificadoras'],
    whatToBringEn: ['Original valid passport', '30-40L trekking backpack', 'Waterproof hiking boots', 'Thermal layers and rain poncho', 'Electrolytes and water purification']
  },
  {
    id: 'maras-moray-laboratorio',
    slug: 'laboratorio-agricola-moray-salineras-maras',
    titleEs: 'Moray: El Laboratorio Agrícola Inca & Salineras de Maras',
    titleEn: 'Moray: The Inca Agricultural Lab & Maras Salt Mines',
    subtitleEs: 'Ciencia andina, microclimas ancestrales y el legado biotecnológico del Tawantinsuyu',
    subtitleEn: 'Andean agronomy, ancestral microclimates, and the biotechnological genius of the Incas',
    category: 'experiencias',
    locationEs: 'Maras & Moray · Valle Sagrado',
    locationEn: 'Maras & Moray · Sacred Valley',
    durationEs: 'Medio Día (5h)',
    durationEn: 'Half Day (5h)',
    pricePEN: 280.00,
    priceUSD: 75.00,
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
    difficultyEs: 'Fácil',
    difficultyEn: 'Easy',
    maxAltitude: '3,500 msnm',
    groupSize: 'Grupos reducidos (Máx. 12 personas)',
    descriptionEs: 'Explora cómo los Incas dominaron la ingeniería climática hace más de 500 años en Moray, un verdadero laboratorio de aclimatación de cultivos con gradientes térmicos de hasta 15°C entre sus terrazas concéntricas. Continuamos hacia las Salineras de Maras, más de 3,000 pozas de sal rosada administradas comunitariamente desde tiempos preincaicos.',
    descriptionEn: 'Discover how the Incas mastered thermal agronomy over 500 years ago in Moray, an open-air bioengineering research facility featuring concentric circular terraces with up to 15°C temperature differentials. Continue to the pink salt pans of Maras, community-farmed sustainably since pre-Inca eras.',
    highlightsEs: [
      'Explicación científica y arqueológica del sistema de microclimas de Moray',
      'Visita a las Salineras milenarias de Maras y cata de sal rosada gourmet',
      'Visita al pueblo tradicional de Maras y sus portadas coloniales talladas en piedra',
      'Transporte de primera clase con vistas panorámicas a los glaciares andinos'
    ],
    highlightsEn: [
      'Archaeological and scientific breakdown of Moray\'s microclimatic terraces',
      'Walk along the ancient Maras salt terraces and artisanal pink salt tasting',
      'Stroll through the colonial stone-carved village of Maras',
      'First-class scenic transport overlooking the snow-draped Vilcanota range'
    ],
    itinerary: [
      {
        time: '08:00 AM',
        titleEs: 'Salida de Cusco o Valle Sagrado',
        titleEn: 'Departure from Cusco or Sacred Valley',
        descEs: 'Travesía por la meseta de Chinchero con vistas a los campos de cultivo.',
        descEn: 'Drive across the highland Chinchero plateau surrounded by potato and grain fields.'
      },
      {
        time: '09:15 AM',
        titleEs: 'Moray: El Laboratorio Agrícola',
        titleEn: 'Moray Agricultural Research Terraces',
        descEs: 'Recorrido guiado explorando la aerodinámica y termorregulación de los andenes.',
        descEn: 'Guided exploration uncovering the thermodynamics and hydraulic drainage of the amphitheaters.'
      },
      {
        time: '11:00 AM',
        titleEs: 'Salineras de Maras',
        titleEn: 'Maras Natural Salt Pans',
        descEs: 'Caminata junto al manantial hipersalino que alimenta las 3,000 pozas familiares.',
        descEn: 'Walk alongside the subterranean thermal spring feeding thousands of family-owned pans.'
      },
      {
        time: '01:30 PM',
        titleEs: 'Retorno o conexión a Ollantaytambo',
        titleEn: 'Return to Cusco or Connection to Ollantaytambo',
        descEs: 'Opción de finalizar en la estación de tren a Machu Picchu o regresar a Cusco.',
        descEn: 'Drop-off available at Ollantaytambo train station or direct return to Cusco.'
      }
    ],
    includedEs: [
      'Transporte turístico privado con aire acondicionado',
      'Guía oficial de turismo especializado en historia y agronomía andina',
      'Degustación de sales aromáticas y maíz tostado del valle',
      'Asistencia personalizada y recogida en tu hospedaje'
    ],
    includedEn: [
      'Private comfortable tourist vehicle',
      'Licensed professional tour guide specialized in Inca agrotechnology',
      'Tasting of artisanal herb-infused pink salt and roasted giant Sacred Valley corn',
      'Personal hotel pick-up and drop-off'
    ],
    notIncludedEs: ['Boleto Turístico del Cusco (BTC)', 'Entrada a Salineras de Maras (S/ 20)', 'Almuerzo'],
    notIncludedEn: ['Cusco Tourist Ticket (BTC)', 'Maras Salt Pans entry fee (approx S/ 20)', 'Lunch'],
    whatToBringEs: ['Gafas de sol polarizadas (reflejo de la sal)', 'Protector solar y sombrero', 'Efectivo en soles para compras locales', 'Zapatillas de suela antideslizante'],
    whatToBringEn: ['Polarized sunglasses (intense salt reflection)', 'Sunscreen and brimmed hat', 'Cash in Peruvian Soles for local salt purchases', 'Comfortable walking shoes']
  },
  {
    id: 'turismo-comunitario-textil',
    slug: 'turismo-comunitario-y-sabiduria-textil',
    titleEs: 'Inmersión Comunitaria: Arte Textil & Saberes Vivos',
    titleEn: 'Community Immersion: Living Textiles & Quechua Heritage',
    subtitleEs: 'Convivencia auténtica con familias tejedoras, tintes naturales y cosmovisión andina',
    subtitleEn: 'Authentic homestay and weaving guild immersion with natural botanical dyes and Andean worldview',
    category: 'cultura',
    locationEs: 'Chinchero & Patacancha · Cusco',
    locationEn: 'Chinchero & Patacancha · Cusco',
    durationEs: 'Día Completo (7h)',
    durationEn: 'Full Day (7h)',
    pricePEN: 380.00,
    priceUSD: 100.00,
    image: '/images/comunidad_tejedoras_cusco_1791233068174.jpg',
    difficultyEs: 'Fácil',
    difficultyEn: 'Easy',
    maxAltitude: '3,760 msnm',
    groupSize: 'Grupos reducidos (Máx. 8 participantes)',
    descriptionEs: 'Rompe con el turismo superficial y vive un intercambio cultural de corazón a corazón. En comunidades quechuahablantes altoandinas, las maestras del telar de cintura te enseñarán a lavar la lana con la raíz nativa Saqta, teñirla con cochinilla y hierbas silvestres, y descifrar la iconografía sagrada de los Tocapus que narran historias astronómicas y familiares.',
    descriptionEn: 'Step away from superficial staged tourism into a heartfelt reciprocal cultural exchange. In high-Andean Quechua-speaking hamlets, master backstrap weavers guide you through washing virgin alpaca wool with the wild Saqta root, boiling natural plant dyes, and reading ancestral geometric codices.',
    highlightsEs: [
      'Lavado de lana con Saqta orgánica (el champú natural de los incas)',
      'Taller interactivo de teñido natural con cochinilla, ch\'illca y kiku',
      'Descifrado de la simbología andina en fajas y mantas ceremoniales',
      'Compartir un almuerzo tradicional con las familias en sus hogares',
      'Compra directa y justa sin intermediarios a las artesanas'
    ],
    highlightsEn: [
      'Wool cleansing with wild organic Saqta root (nature\'s ancestral shampoo)',
      'Interactive natural dye vat crafting using cochinilla insects and high-altitude herbs',
      'Deciphering sacred astrological and genealogical iconography on handwoven shawls',
      'Sharing a heartfelt traditional lunch prepared by host families',
      'Direct fair-trade textile purchases supporting indigenous women cooperatives'
    ],
    itinerary: [
      {
        time: '09:00 AM',
        titleEs: 'Llegada a la comunidad y bienvenida con flores',
        titleEn: 'Arrival & Indigenous Flower Welcoming',
        descEs: 'Canciones en quechua y entrega de ponchos tradicionales para la jornada.',
        descEn: 'Quechua songs and donning traditional handspun ponchos for the day.'
      },
      {
        time: '10:00 AM',
        titleEs: 'Demostración y taller de hilado y teñido',
        titleEn: 'Spinning & Natural Dye Vat Workshop',
        descEs: 'Práctica con el huso (p\'ushka) y mezcla de pigmentos minerales y vegetales.',
        descEn: 'Hands-on practice using traditional drop spindles and mixing mineral and plant pigments.'
      },
      {
        time: '01:00 PM',
        titleEs: 'Almuerzo Comunitario Compartido',
        titleEn: 'Shared Family Feast',
        descEs: 'Sopa de quinua, papas nativas con salsa de uchucuta y té de hierbas de altura.',
        descEn: 'Quinoa soup, steaming native heirloom potatoes with stone-ground uchucuta salsa.'
      },
      {
        time: '03:00 PM',
        titleEs: 'Círculo de relatos andinos y despedida',
        titleEn: 'Storytelling Circle & Farewells',
        descEs: 'Mitos del origen de las estrellas y despedida comunitaria.',
        descEn: 'Traditional myths of the cosmic Andean constellations and warm farewell ceremony.'
      }
    ],
    includedEs: [
      'Transporte privado hacia y desde la comunidad',
      'Guía cultural bilingüe quechuahablante nativo',
      'Todos los materiales de hilado, teñido y tejido para la práctica',
      'Almuerzo casero orgánico preparado con la comunidad',
      'Donación directa al fondo de desarrollo comunitario'
    ],
    includedEn: [
      'Private round-trip transportation to rural highland communities',
      'Native Quechua and English speaking cultural interpreter',
      'All fiber, spindle, dye, and loom supplies for practice',
      'Homecooked organic lunch prepared alongside host families',
      'Direct fair-trade stipend paid directly to women weavers guild'
    ],
    notIncludedEs: ['Piezas textiles terminadas que desees comprar', 'Propinas', 'Gastos personales'],
    notIncludedEn: ['Finished textiles available for optional purchase', 'Gratuities', 'Personal souvenirs'],
    whatToBringEs: ['Ropa abrigada (en Chinchero la temperatura desciende con el viento)', 'Gorra o chullo', 'Cámara fotográfica con batería extra', 'Mochila de mano'],
    whatToBringEn: ['Warm layers (highland plateau gets breezy)', 'Beanie or sun hat', 'Camera with spare batteries', 'Small daypack']
  }
];
