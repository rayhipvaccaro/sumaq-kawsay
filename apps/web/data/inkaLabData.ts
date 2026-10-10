export interface AncestralZone {
  id: string;
  pacha: string;
  nameEs: string;
  nameEn: string;
  symbolismEs: string;
  symbolismEn: string;
  altitude: string;
  difficultyEs: string;
  difficultyEn: string;
  durationEs: string;
  durationEn: string;
  pricePEN: number;
  priceUSD: number;
  image: string;
  descriptionEs: string;
  descriptionEn: string;
  highlightsEs: string[];
  highlightsEn: string[];
  cosmovisionEs: string;
  cosmovisionEn: string;
}

export const ANCESTRAL_ZONES: AncestralZone[] = [
  {
    id: 'hanan-pacha',
    pacha: 'Hanan Pacha (El Mundo de Arriba)',
    nameEs: 'Zona 1: Hanan Pacha · Cumbres Sagradas & Astronomía Andina',
    nameEn: 'Zone 1: Hanan Pacha · Sacred Peaks & Andean Astronomy',
    symbolismEs: 'Conexión con los Apus tutelares y el firmamento cósmico',
    symbolismEn: 'Connection with guardian mountain spirits (Apus) and the celestial cosmos',
    altitude: '3,850 msnm',
    difficultyEs: 'Moderado',
    difficultyEn: 'Moderate',
    durationEs: 'Medio Día o Nocturno (4h)',
    durationEn: 'Half Day or Night (4h)',
    pricePEN: 290,
    priceUSD: 78,
    image: '/images/hanan_pacha_night_sky_1791233581943.jpg',
    descriptionEs: 'Un viaje a las cumbres que dominan el Valle de Ollantaytambo en el Km 84. Durante el día, contemplarás el cañón del Urubamba y los glaciares Verónica y Chicón. Al caer la noche, realizamos sesiones de astronomía incaica guiadas con telescopio e interpretación de las "Constelaciones Oscuras" (Yacana la llama cósmica, Mach\'acuay la serpiente y la Chacana estelar).',
    descriptionEn: 'A high-altitude ascent overlooking the Ollantaytambo canyon at Km 84. By day, witness panoramic sweeps of the Urubamba valley and glaciers Veronica and Chicon. At nightfall, join ancestral astronomy sessions with field telescopes interpreting Inca Dark Cloud Constellations (Yacana the cosmic llama, Mach\'acuay the serpent, and the sacred Southern Cross).',
    highlightsEs: [
      'Mirador astronómico con vista 360° al Nevado Verónica (Wakaywillque)',
      'Interpretación de la Vía Láctea (Mayu) según la cosmovisión inca',
      'Fogata andina con infusión caliente de muña y narración de mitos quechuas',
      'Astrofotografía guiada para capturar el cielo nocturno más nítido de los Andes'
    ],
    highlightsEn: [
      'Astronomical stone viewpoint with 360° views of Mount Veronica',
      'Interpretation of the celestial River/Milky Way (Mayu) in Inca cosmology',
      'Andean bonfire with steaming native muña tea and Quechua oral myths',
      'Guided night astrophotography capturing the clearest high-altitude skies'
    ],
    cosmovisionEs: 'En el pensamiento andino, el Hanan Pacha representa la dimensión espiritual y divina donde habitan el Sol (Inti), la Luna (Killa) y los astros que ordenan el ciclo agrícola.',
    cosmovisionEn: 'In Andean ontology, Hanan Pacha represents the celestial realm inhabited by the Sun (Inti), the Moon (Killa), and cosmic entities governing agricultural cycles.'
  },
  {
    id: 'willka-unu',
    pacha: 'Kay Pacha (El Mundo del Agua y la Tierra)',
    nameEs: 'Zona 2: Willka Unu · Acueductos Ancestrales & Fuentes Sagradas',
    nameEn: 'Zone 2: Willka Unu · Ancient Aqueducts & Sacred Water Springs',
    symbolismEs: 'Purificación energética y sabiduría hidráulica incaica',
    symbolismEn: 'Energy purification and ancestral Inca hydraulic wisdom',
    altitude: '2,820 msnm',
    difficultyEs: 'Fácil',
    difficultyEn: 'Easy',
    durationEs: '3 horas a Medio Día',
    durationEn: '3 hours to Half Day',
    pricePEN: 240,
    priceUSD: 65,
    image: '/images/willka_unu_inca_sauna_1791233592210.jpg',
    descriptionEs: 'Willka Unu (Agua Sagrada) celebra la genialidad hidráulica andina. Recorremos canales prehispánicos tallados en roca viva que aún canalizan aguas cristalinas de deshielo. La experiencia culmina en nuestro tradicional Sauna Inca a vapor con piedras volcánicas, eucalipto y muña silvestre, seguido de baños de florecimiento.',
    descriptionEn: 'Willka Unu (Sacred Water) honors Andean hydraulic mastery. Meander alongside pre-Hispanic stone channels still carrying pure glacial meltwater. Concludes inside our authentic Inca stone steam sauna heated with volcanic stones and mountain herbs, accompanied by ancestral floral cleansing baths.',
    highlightsEs: [
      'Recorrido por acueductos y fuentes ceremoniales incaicas en funcionamiento',
      'Sesión de Sauna Inca a vapor con hierbas aromáticas de la huerta de Inka Lab',
      'Ritual de purificación con aguas florales preparadas por curanderos locales',
      'Degustación de elixires hidratantes de hierbas andinas'
    ],
    highlightsEn: [
      'Walking route along ancient functioning Inca irrigation aqueducts',
      'Inca stone steam sauna session infused with fresh herbs from Inka Lab garden',
      'Purification floral rinse ritual performed by native healers',
      'Tasting of restorative botanical elixirs and mineral tonics'
    ],
    cosmovisionEs: 'El agua (Unu) es considerada por los quechuas como un ser vivo (Kawsay) que transporta memoria, fertilidad y salud desde los glaciares hasta la tierra fértil.',
    cosmovisionEn: 'Water (Unu) is revered by the Quechua as a living entity (Kawsay) carrying vitality, ancestral memory, and fertility from snowcapped peaks to fertile soil.'
  },
  {
    id: 'inti-punku',
    pacha: 'Uku Pacha & Kay Pacha (Aventura & Memoria en Piedra)',
    nameEs: 'Zona 3: Inti Punku · Canteras de Kachiqhata & Puerta del Sol',
    nameEn: 'Zone 3: Inti Punku · Kachiqhata Megalithic Quarries & Sun Gate',
    symbolismEs: 'La proeza constructiva y el portal solar de Ollantaytambo',
    symbolismEn: 'Megalithic stone engineering and the sacred solar portal of Ollantaytambo',
    altitude: '3,890 msnm',
    difficultyEs: 'Desafiante (Trekking)',
    difficultyEn: 'Challenging (Trek)',
    durationEs: 'Día Completo (7h)',
    durationEn: 'Full Day (7h)',
    pricePEN: 340,
    priceUSD: 92,
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
    descriptionEs: 'Una de las caminatas más espectaculares y menos masificadas de todo el Valle Sagrado. Ascendemos hacia las canteras incas de Kachiqhata, donde gigantescos bloques de granito rosa quedaron a medio tallar (“piedras cansadas”), continuando hasta el imponente portal lítico de Inti Punku, que enmarca de forma perfecta el Nevado Verónica.',
    descriptionEn: 'One of the most awe-inspiring, uncrowded day treks in the entire Sacred Valley. Climb to the ancient Inca quarries of Kachiqhata, where cyclopean pink granite blocks ("tired stones") lie frozen in time, continuing to the legendary stone archway of Inti Punku framing Mount Veronica.',
    highlightsEs: [
      'Ascenso panorámico por senderos preincaicos con vistas al río Vilcanota',
      'Visita a las "Piedras Cansadas" y canteras que dieron origen a la Fortaleza',
      'Fotografía icónica en el portal lítico sagrado de Inti Punku',
      'Almuerzo campestre andino energizante en la cumbre'
    ],
    highlightsEn: [
      'Panoramic ascent on pre-Inca trails overlooking the roaring Vilcanota River',
      'Explore the ancient masonry quarry grounds of Kachiqhata',
      'Iconic framed photograph through the stone gateway of Inti Punku',
      'High-altitude gourmet picnic lunch prepared with local superfoods'
    ],
    cosmovisionEs: 'Inti Punku servía como puesto de control militar y adoratorio solar astronómico que alineaba los solsticios con las cumbres de los Apus protectores.',
    cosmovisionEn: 'Inti Punku served as a strategic military sentinel post and solar observatory aligning solstices with the sacred protector peaks.'
  }
];

export interface EcotourismService {
  id: string;
  titleEs: string;
  titleEn: string;
  taglineEs: string;
  taglineEn: string;
  descriptionEs: string;
  descriptionEn: string;
  image: string;
  featuresEs: string[];
  featuresEn: string[];
  priceNotePEN: string;
  priceNoteUSD: string;
}

export const ECOTOURISM_SERVICES: EcotourismService[] = [
  {
    id: 'hospedaje-bungalows',
    titleEs: 'Hospedaje Ecoturístico & Bungalows',
    titleEn: 'Ecotourism Lodging & Stone Bungalows',
    taglineEs: 'Refugio bioclimático con chimenea y vista al cañón de Ollantaytambo',
    taglineEn: 'Bioclimatic haven with stone fireplace and canyon panorama',
    descriptionEs: 'Bungalows construidos en piedra granítica, adobe y madera de eucalipto local. Equipados con chimeneas de leña, mantas de alpaca, baño privado con agua caliente solar y amplias terrazas para contemplar el amanecer en los Andes.',
    descriptionEn: 'Private bungalows built with local granite stone, sun-dried adobe, and fragrant eucalyptus timber. Equipped with wood-burning fireplaces, plush alpaca wool blankets, solar hot water, and private terraces.',
    image: '/images/bungalow_ecoturistico_1791233601485.jpg',
    featuresEs: [
      'Construcción bioclimática 100% sostenible',
      'Chimenea de leña y servicio nocturno de encendido',
      'Desayuno novoandino orgánico incluido',
      'A solo 15 min de la estación de tren a Machu Picchu'
    ],
    featuresEn: [
      '100% sustainable bioclimatic construction',
      'Wood fireplace with evening lighting service',
      'Organic farm-fresh Novoandino breakfast included',
      'Only 15 mins from the Machu Picchu train station'
    ],
    priceNotePEN: 'Desde S/ 380 / noche',
    priceNoteUSD: 'From $ 102 USD / night'
  },
  {
    id: 'restaurante-novoandino',
    titleEs: 'Restaurante & Bar Novoandino',
    titleEn: 'Novoandino Restaurant & Herbal Lounge',
    taglineEs: 'De la huerta orgánica de Inka Lab directo a tu mesa',
    taglineEn: 'From Inka Lab\'s living organic garden straight to your table',
    descriptionEs: 'Nuestra propuesta gastronómica revaloriza los ingredientes milenarios del Cusco: trucha asalmonada de manantiales de altura, quinua tricolor, tubérculos andinos rescatados, hongos silvestres y macerados artesanales de pisco con hierbas del herbario.',
    descriptionEn: 'Our culinary vision celebrates ancestral crops of Cusco: high-altitude spring-fed trout, heirloom tricolor quinoa, native purple potatoes, wild forest mushrooms, and botanical piscos macerated with garden herbs.',
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
    featuresEs: [
      'Menú degustación de 5 tiempos con maridaje local',
      'Opciones vegetarianas y veganas de alta cocina',
      'Coctelería de autor con muña, coca y frutos del valle',
      'Horno de barro tradicional y preparación de Pachamanca'
    ],
    featuresEn: [
      '5-course tasting menu with regional pairings',
      'Gourmet vegetarian and plant-based selections',
      'Artisan cocktails infused with muña, coca, and valley fruits',
      'Traditional wood oven and Pachamanca earth cooking'
    ],
    priceNotePEN: 'Platos a la carta desde S/ 45',
    priceNoteUSD: 'À la carte from $ 12 USD'
  },
  {
    id: 'sauna-inca-spa',
    titleEs: 'Sauna Inca & Terapias Ancestrales',
    titleEn: 'Inca Steam Sauna & Ancestral Bodywork',
    taglineEs: 'Desintoxicación profunda con vapor de hierbas y baños florales',
    taglineEn: 'Deep herbal steam detox and restorative floral baths',
    descriptionEs: 'Inspirado en los baños de vapor prehispánicos. El calor de piedras volcánicas libera la esencia de hojas frescas de muña, eucalipto y markhu para relajar los músculos tras caminatas intensas y descongestionar las vías respiratorias en la altura.',
    descriptionEn: 'Inspired by pre-Hispanic steam bath traditions. Heated volcanic stones release pure aromas of fresh muña, eucalyptus, and wild markhu to melt away muscular tension after trekking and hydrate breathing passages.',
    image: '/images/willka_unu_inca_sauna_1791233592210.jpg',
    featuresEs: [
      'Baño de vapor andino con hierbas medicinales nativas',
      'Masajes descontracturantes con aceite esencial de muña',
      'Piscina de inmersión en agua fresca de manantial',
      'Té caliente de hojas de coca y muña en sala de reposo'
    ],
    featuresEn: [
      'Andean stone steam bath infused with native healing flora',
      'Deep-tissue massage with cold-pressed muña essential oil',
      'Cold mineral spring immersion plunge pool',
      'Relaxation lounge with warm herbal infusions'
    ],
    priceNotePEN: 'Sesión privada S/ 160 / pers.',
    priceNoteUSD: 'Private session $ 44 USD / pers.'
  },
  {
    id: 'day-pass-inkalab',
    titleEs: 'Inka Lab Day Pass Completo',
    titleEn: 'Inka Lab All-Inclusive Day Pass',
    taglineEs: 'Spa + Almuerzo Novoandino + Cabalgata o Senderismo',
    taglineEn: 'Spa + Novoandino Lunch + Paso Horse Ride or Trek',
    descriptionEs: 'La experiencia de día completo definitiva para quienes desean recargar energías en Ollantaytambo. Incluye acceso ilimitado a las áreas verdes, circuito hidrotermal en el Sauna Inca, almuerzo de 3 tiempos y cabalgata guiada de caballos de paso.',
    descriptionEn: 'The definitive full-day rejuvenating escape in Ollantaytambo. Includes full grounds access, hydrothermal circuit in the Inca Sauna, a 3-course organic lunch, and a guided Peruvian Paso horse ride.',
    image: '/images/cabalgata_caballos_paso_1791233048725.jpg',
    featuresEs: [
      'Circuito termal y Sauna Inca de 2 horas',
      'Almuerzo novoandino completo con bebida natural',
      'Cabalgata de 1h 30m por caminos incas del Km 84',
      'Acceso a huertos y mirador panorámico'
    ],
    featuresEn: [
      '2-hour hydrothermal circuit & Inca Sauna access',
      'Full 3-course Novoandino lunch with fresh nectar',
      '1.5-hour Peruvian Paso horse trail ride on Inca paths',
      'Access to botanical garden trails and scenic lookout'
    ],
    priceNotePEN: 'Pase completo S/ 390 / pers.',
    priceNoteUSD: 'Full pass $ 105 USD / pers.'
  }
];

export interface SeasonInfo {
  id: string;
  nameEs: string;
  nameEn: string;
  monthsEs: string;
  monthsEn: string;
  verdictEs: string;
  verdictEn: string;
  weatherEs: string;
  weatherEn: string;
  sceneryEs: string;
  sceneryEn: string;
  clothingTipsEs: string[];
  clothingTipsEn: string[];
}

export const SEASONS_DATA: SeasonInfo[] = [
  {
    id: 'seca',
    nameEs: 'Temporada Seca (Óptima para Trekking)',
    nameEn: 'Dry Season (Prime Trekking & Astronomy)',
    monthsEs: 'Mayo a Octubre',
    monthsEn: 'May to October',
    verdictEs: 'Recomendada para caminatas de alta montaña, fotografía y noches estrelladas en Hanan Pacha.',
    verdictEn: 'Recommended for alpine treks, clear mountain views, and celestial stargazing in Hanan Pacha.',
    weatherEs: 'Días soleados con temperaturas diurnas de 20°C a 23°C. Noches muy frías (0°C a 4°C). Cero precipitaciones.',
    weatherEn: 'Bright sunny days (20°C - 23°C). Very cold, crisp nights (0°C - 4°C). Virtually zero rain.',
    sceneryEs: 'Montañas nítidas con nieve perpetua visible, cielos azul zafiro y constelaciones brillantes.',
    sceneryEn: 'Razor-sharp snowcapped peaks, cobalt-blue skies, and luminous Milky Way night views.',
    clothingTipsEs: [
      'Vestimenta en capas (térmica para la noche, polo ligero para el día)',
      'Gafas con filtro UV400 y sombrero de ala ancha',
      'Chaqueta de plumas o polar abrigador para el atardecer',
      'Bálsamo labial y crema hidratante (clima seco)'
    ],
    clothingTipsEn: [
      'Layered system (thermal base for night, breathable top for daytime)',
      'UV400 sunglasses and wide-brim sun hat',
      'Insulated down or heavy fleece jacket for evening drops',
      'Lip balm and skin moisturizer for dry mountain air'
    ]
  },
  {
    id: 'media',
    nameEs: 'Temporada Media (Equilibrio Perfecto)',
    nameEn: 'Shoulder Season (Balance & Serenity)',
    monthsEs: 'Abril y Noviembre',
    monthsEn: 'April & November',
    verdictEs: 'Meses favoritos para quienes buscan evitar multitudes, con clima templado y valles verdes.',
    verdictEn: 'Favorite months for conscious travelers seeking peaceful trails, mild weather, and emerald valleys.',
    weatherEs: 'Temperaturas agradables tanto de día (21°C) como de noche (7°C). Lluvias esporádicas y breves.',
    weatherEn: 'Pleasant temperatures day (21°C) and night (7°C). Occasional brief, refreshing mountain showers.',
    sceneryEs: 'El Valle Sagrado luce exuberante, con campos agrícolas en cosecha y flores silvestres.',
    sceneryEn: 'The Sacred Valley is lush and vibrant, with active agricultural harvests and blooming fields.',
    clothingTipsEs: [
      'Chaqueta cortavientos impermeable ligera',
      'Pantalones de trekking desmontables',
      'Calzado con buen agarre para terreno mixto'
    ],
    clothingTipsEn: [
      'Lightweight waterproof windbreaker',
      'Versatile zip-off trekking trousers',
      'Sturdy hiking shoes with solid traction'
    ]
  },
  {
    id: 'lluvias',
    nameEs: 'Temporada de Lluvias (Sumaq Pachamama)',
    nameEn: 'Green & Rainy Season (Awakening Nature)',
    monthsEs: 'Diciembre a Marzo',
    monthsEn: 'December to March',
    verdictEs: 'La época más fértil del año: cascadas rugientes, huertos en su esplendor y mística andina.',
    verdictEn: 'The most fertile time: roaring waterfalls, peak herbal bloom in Chillca, and magical cloudscapes.',
    weatherEs: 'Mañanas soleadas con lluvias intermitentes por la tarde. Noches templadas (8°C a 10°C).',
    weatherEn: 'Sunny mornings followed by afternoon showers. Mild nights (8°C to 10°C).',
    sceneryEs: 'Verde esmeralda intenso en todas las terrazas agrícolas, nieblas misteriosas sobre las ruinas incas.',
    sceneryEn: 'Intense emerald-green terraces, dramatic low-drifting mists wrapping around Inca stone ruins.',
    clothingTipsEs: [
      'Poncho o chaqueta impermeable de 10,000 mm+',
      'Botas de montaña impermeables (Gore-Tex o similar)',
      'Fundas impermeables para mochilas y teléfonos'
    ],
    clothingTipsEn: [
      'High-grade waterproof jacket or heavy poncho',
      'Waterproof hiking boots with rugged grip',
      'Waterproof dry bags for phones and electronics'
    ]
  }
];

export interface HowToReachStep {
  from: string;
  distance: string;
  time: string;
  route: string;
  recommendationsEs: string;
  recommendationsEn: string;
}

export const HOW_TO_REACH: HowToReachStep[] = [
  {
    from: 'Desde la Ciudad del Cusco',
    distance: '75 km',
    time: '1h 45min',
    route: 'Cusco → Chinchero → Urubamba → Ollantaytambo → Km 84',
    recommendationsEs: 'Transporte privado puerta a puerta coordinado con Inka Lab o colectivos desde la calle Pavitos en Cusco hasta Ollantaytambo, donde nuestro vehículo te recibe.',
    recommendationsEn: 'Door-to-door private shuttle arranged directly through Inka Lab, or shared tourist vans from Pavitos Street in Cusco to Ollantaytambo town.'
  },
  {
    from: 'Desde el Pueblo de Ollantaytambo',
    distance: '12 km',
    time: '20 minutos',
    route: 'Plaza de Ollantaytambo → Carretera hacia Km 84 / Chillca',
    recommendationsEs: 'Ofrecemos traslados gratuitos de cortesía desde la Estación de Tren de Ollantaytambo o la Plaza Principal para huéspedes con reserva confirmada.',
    recommendationsEn: 'We provide complimentary pickup service from the Ollantaytambo Train Station or Main Plaza for all guests with confirmed bookings.'
  }
];
