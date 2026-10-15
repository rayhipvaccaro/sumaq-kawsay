// Articulos de prensa y cultura (tomados de Inka Lab). Solo en espanol.
// Cuando el panel de contenido de prensa este listo, esta lista saldra de la base de datos.

export interface PressArticle {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  role: string;
  category: string;
  summary: string;
  body: string[];
  readTime: string;
  date: string;
  image: string;
}

export const PRESS_ARTICLES: PressArticle[] = [
  {
    "slug": "enigma-inti-punku-ollantaytambo",
    "title": "El Enigma de Inti Punku: La Puerta Solar que Vigila el Nevado Verónica",
    "subtitle": "Investigación arqueoastronómica sobre la alineación solar de las cumbres de Ollantaytambo",
    "author": "Lic. Mario Quispe Condori",
    "role": "Arqueólogo Investigador & Especialista en Cosmovisión Andina",
    "category": "Arqueología",
    "summary": "A casi 4,000 metros de altitud, la estructura lítica de Inti Punku sigue marcando con exactitud matemática los solsticios y las rutas de peregrinación hacia la Ciudad Sagrada de Machu Picchu.",
    "body": [
      "A lo largo del Valle Sagrado de los Incas, pocos monumentos sintetizan de forma tan sublime la arquitectura militar, el culto astral y la ingeniería lítica como Inti Punku (la Puerta del Sol de Ollantaytambo).",
      "Situada en la cima del cerro sobre las canteras de Cachiccata, esta ventana ceremonial de roca andesita se erige frente al imponente Nevado Wakaywillque (La Verónica). Diversas investigaciones contemporáneas confirman que la orientación de la ventana solar coincide con el amanecer durante el solsticio de invierno, momento en el cual el Sol (Inti) renace para fertilizar los campos del Urubamba.",
      "Para el visitante moderno que parte desde el Km 84 de Inka Lab, el ascenso representa más que una exigente caminata deportiva: es un viaje por la misma senda por donde los canteros inkas movilizaron bloques de más de 40 toneladas sin el uso de la rueda, utilizando la física de planos inclinados, rodillos de madera y cantos rodados del río."
    ],
    "readTime": "6 min",
    "date": "15 Sep 2026",
    "image": "/images/hero_valle_sagrado_andes_1791233029285.jpg"
  },
  {
    "slug": "wilcauno-sabiduria-hidraulica-sagrada",
    "title": "Wilcauno: La Ciencia Hidráulica Inca que Aún Purifica las Tierras del Km 84",
    "subtitle": "Cómo los ingenieros prehispánicos domesticaron los manantiales glaciares para la vida ceremonial y agrícola",
    "author": "Ing. Elena Valenzuela Vega",
    "role": "Especialista en Hidráulica Ancestral y Ecoturismo Sostenible",
    "category": "Investigación Cultural",
    "summary": "El complejo de Wilcauno demuestra la reverencia andina hacia el agua (Unu): canales tallados en roca viva que regulan el caudal sin erosionar el suelo andino.",
    "body": [
      "El agua en el mundo andino no era concebida como un recurso inerte, sino como un ser vivo (Yakumama o Unu) dotado de voluntad, memoria y poder curativo. En la zona de Wilcauno (Willka Unu), los canales de irrigación construidos hace más de seis siglos continúan abasteciendo los andenes agrícolas con la misma pureza cristalina de su inauguración.",
      "Los maestros canteros incas calcularon pendientes hidráulicas exactas de 1.5% a 2%, evitando turbulencias y oxigenando el agua de manera natural. En Inka Lab, la restauración y puesta en valor de estas fuentes permite a los viajeros experimentar baños de purificación y comprender la sustentabilidad real que inspiró a la civilización andina."
    ],
    "readTime": "5 min",
    "date": "18 Sep 2026",
    "image": "/images/inkalab/laguna-nevada.png"
  },
  {
    "slug": "hanan-pacha-mundo-superior-constelaciones",
    "title": "Hanan Pacha: La Cartografía de las Sombras y las Constelaciones Negras Andinas",
    "subtitle": "Las estrellas oscuras de la Vía Láctea (Mayu) según los sabios astrónomos del Valle Sagrado",
    "author": "Dr. Carlos Tupac Yupanqui",
    "role": "Antropólogo Cultural & Guía Mayor de Inka Lab",
    "category": "Cosmovisión",
    "summary": "A diferencia de la astronomía occidental basada en unir puntos de luz, los incas cartografiaron las nubes oscuras de polvo interestelar: la Llama Celestial (Yacana), el Sapo (Hanp’atu) y la Serpiente (Amaru).",
    "body": [
      "Desde la privilegiada altitud y la atmósfera límpida de la Zona 1 (Hanan Pacha) en Inka Lab Km 84, el cielo nocturno no es solo un espectáculo visual, sino un libro abierto de navegación y agricultura.",
      "Durante las noches despejadas de la temporada seca (mayo a octubre), los guías astronómicos de Inka Lab revelan a los visitantes la silueta de Yacana, la gran llama celestial que camina por el río estelar (la Vía Láctea), bebiendo sus aguas para evitar que inunde la tierra. Este saber cosmológico, transmitido por generaciones, forma el núcleo de las veladas astronómicas y el turismo vivencial que ofrecemos."
    ],
    "readTime": "7 min",
    "date": "22 Sep 2026",
    "image": "/images/hanan_pacha_night_sky_1791233581943.jpg"
  },
  {
    "slug": "ollantaytambo-bastion-inca-viviente",
    "title": "Ollantaytambo: Por Qué es el Último Pueblo Inca Viviente que Asombra al Mundo",
    "subtitle": "Reportaje especial sobre las familias que aún habitan las kanchas originales y el modelo de turismo comunitario",
    "author": "Redacción Periodística Inka Lab",
    "role": "Prensa & Turismo Responsable",
    "category": "Prensa & Reportajes",
    "summary": "Sus callejuelas de piedra, canales de agua cristalina y portales trapezoidales conservan el trazado urbano original proyectado por el emperador Pachacútec en el siglo XV.",
    "body": [
      "Caminar por Ollantaytambo no es visitar un museo de ruinas extintas; es entrar en un organismo vivo donde las familias quechua-hablantes cocinan, descansan y celebran dentro de las mismas kanchas (manzanas amuralladas) que sus antepasados levantaron hace más de 500 años.",
      "Nuestro reportaje profundiza en los desafíos del turismo moderno frente a la preservación del patrimonio lúdico e hidráulico. A través de convenios con los artesanos y arrieros locales, Inka Lab promueve un flujo turístico de bajo impacto y alto beneficio económico directo para las familias comuneras de Ollantaytambo y el Km 84."
    ],
    "readTime": "4 min",
    "date": "25 Sep 2026",
    "image": "/images/camino_inca_hikers_1791233058867.jpg"
  }
];
