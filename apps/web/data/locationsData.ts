export interface LocationSpot {
  id: string;
  nameEs: string;
  nameEn: string;
  roleEs: string;
  roleEn: string;
  altitude: string;
  travelTimeFromCusco: string;
  descriptionEs: string;
  descriptionEn: string;
  coordinates: { lat: number; lng: number };
  image: string;
  highlightsEs: string[];
  highlightsEn: string[];
}

export const LOCATIONS_DATA: LocationSpot[] = [
  {
    id: 'chillca-sede',
    nameEs: 'Chillca · Sede Etnobotánica & Retiros',
    nameEn: 'Chillca · Ethnobotanical Hub & Retreats',
    roleEs: 'Corazón de Sumaq Kawsay & Huerto Vivo',
    roleEn: 'Heart of Sumaq Kawsay & Living Garden',
    altitude: '2,870 msnm',
    travelTimeFromCusco: '1h 45min (Cerca a Ollantaytambo)',
    descriptionEs: 'Nuestro santuario vivo en el Valle Sagrado. Aquí cultivamos más de 40 especies de flora medicinal andina, realizamos las ceremonias de agradecimiento a la tierra y albergamos nuestro rancho de caballos de paso.',
    descriptionEn: 'Our living sanctuary in the Sacred Valley. Here we cultivate over 40 species of Andean medicinal flora, hold traditional Pachamama gratitude rituals, and base our Paso horse stables.',
    coordinates: { lat: -13.2584, lng: -72.2632 },
    image: '/images/tour_etnobotanica_herbs_1791233038018.jpg',
    highlightsEs: ['Huerto orgánico experimental', 'Rancho de Caballos Peruanos de Paso', 'Horno de barro andino', 'Vista al Nevado Verónica'],
    highlightsEn: ['Experimental organic garden', 'Peruvian Paso horse stables', 'Traditional earthen adobe oven', 'Mount Veronica alpine vista']
  },
  {
    id: 'cusco-oficina',
    nameEs: 'Oficina Central Cusco · InkaLab',
    nameEn: 'Cusco Central Office · InkaLab',
    roleEs: 'Atención personalizada & Briefing',
    roleEn: 'Guest Welcome & Expedition Briefings',
    altitude: '3,399 msnm',
    travelTimeFromCusco: 'Pampa del Castillo 455 (Centro Histórico)',
    descriptionEs: 'Ubicada a solo 3 cuadras de la Plaza de Armas de Cusco. Es nuestro centro de diseño de itinerarios, asesoría médica de aclimatación y entrega de equipos.',
    descriptionEn: 'Located just three blocks from Cusco\'s historic Plaza de Armas. Our center for custom itinerary planning, altitude acclimatization guidance, and expedition briefings.',
    coordinates: { lat: -13.5183, lng: -71.9774 },
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
    highlightsEs: ['Pampa del Castillo 455, Cusco', 'Té de muña y hojas de coca de cortesía', 'Aclimatación y chequeo de oximetría', 'Atención directa por Lisbeth Chahua y equipo'],
    highlightsEn: ['Pampa del Castillo 455, Cusco', 'Complimentary fresh coca and muña tea', 'Oximetry checks and altitude coaching', 'Direct guidance from Lisbeth Chahua and team']
  },
  {
    id: 'moray-lab',
    nameEs: 'Moray · El Laboratorio Inca',
    nameEn: 'Moray · The Inca Bio-Lab',
    roleEs: 'Inspiración agronómica y científica',
    roleEn: 'Agronomic & Scientific Inspiration',
    altitude: '3,500 msnm',
    travelTimeFromCusco: '1h 15min',
    descriptionEs: 'El complejo de terrazas elípticas donde los sabios incas experimentaron con semillas de la Amazonía, costa y puna. La inspiración detrás de "InkaLab".',
    descriptionEn: 'The awe-inspiring concentric amphitheaters where Inca agronomists acclimatized seeds from the Amazon, coast, and high puna. The true inspiration for "InkaLab".',
    coordinates: { lat: -13.3298, lng: -72.1969 },
    image: '/images/hero_valle_sagrado_andes_1791233029285.jpg',
    highlightsEs: ['Microclimas con variación de 15°C', 'Drenaje subterráneo milenario', 'Acústica ceremonial sagrada'],
    highlightsEn: ['Microclimates with 15°C temperature differentials', 'Ingenious subterranean drainage', 'Acoustic amphitheater resonance']
  },
  {
    id: 'machu-picchu',
    nameEs: 'Machu Picchu · Santuario Sagrado',
    nameEn: 'Machu Picchu · Sacred Sanctuary',
    roleEs: 'Destino final del Camino Inca',
    roleEn: 'Pinnacle of the Inca Trail',
    altitude: '2,430 msnm',
    travelTimeFromCusco: 'Tren escénico + bus o 4D caminata',
    descriptionEs: 'La joya arquitectónica del Tawantinsuyu suspendida entre montañas nubosas. Nuestras visitas son guiadas con respeto espiritual, en grupos pequeños y respetando las normas de preservación.',
    descriptionEn: 'The architectural crown jewel of the Inca Empire nestled between dramatic misty cloud-forest peaks. Explored with spiritual reverence, small groups, and strict conservation ethics.',
    coordinates: { lat: -13.1631, lng: -72.5450 },
    image: '/images/camino_inca_hikers_1791233058867.jpg',
    highlightsEs: ['Ingreso garantizado con guía oficial', 'Entrada por la mística Puerta del Sol', 'Conservación y cero plástico'],
    highlightsEn: ['Guaranteed entry with licensed native guides', 'Sunrise entry via the sacred Sun Gate', 'Leave-no-trace zero-plastic policy']
  }
];
