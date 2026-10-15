// Fotos de la galeria. Para agregar una: copiar el archivo a public/images y sumar una linea aqui.
// (Cuando el panel de contenido este listo, se podran subir desde el panel.)

export type GalleryCategory = 'paisajes' | 'cultura' | 'aventura' | 'alojamiento' | 'bienestar';

export interface GalleryPhoto {
  src: string;
  category: GalleryCategory;
  captionEs: string;
  captionEn: string;
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; es: string; en: string }[] = [
  { id: 'paisajes', es: 'Paisajes', en: 'Landscapes' },
  { id: 'cultura', es: 'Cultura', en: 'Culture' },
  { id: 'aventura', es: 'Aventura', en: 'Adventure' },
  { id: 'alojamiento', es: 'Alojamiento', en: 'Stay' },
  { id: 'bienestar', es: 'Bienestar', en: 'Wellness' },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { src: '/images/bungalow_ecoturistico_1791233601485.jpg', category: 'alojamiento', captionEs: "Bungalow de piedra entre andenes", captionEn: "Stone bungalow among the terraces" },
  { src: '/images/cabalgata_caballos_paso_1791233048725.jpg', category: 'aventura', captionEs: "Cabalgata por un camino empedrado", captionEn: "Horseback ride on a stone path" },
  { src: '/images/camino_inca_hikers_1791233058867.jpg', category: 'aventura', captionEs: "Caminantes en un sendero inca entre la niebla", captionEn: "Hikers on an Inca trail in the mist" },
  { src: '/images/comunidad_tejedoras_cusco_1791233068174.jpg', category: 'cultura', captionEs: "Tejedoras y mercado de textiles", captionEn: "Weavers and textile market" },
  { src: '/images/hanan_pacha_night_sky_1791233581943.jpg', category: 'cultura', captionEs: "Cielo nocturno sobre las ruinas de Hanan Pacha", captionEn: "Night sky over the Hanan Pacha ruins" },
  { src: '/images/hero_valle_sagrado_andes_1791233029285.jpg', category: 'paisajes', captionEs: "Andenes y montañas del Valle Sagrado", captionEn: "Terraces and mountains of the Sacred Valley" },
  { src: '/images/inkalab/astronomia.jpeg', category: 'alojamiento', captionEs: "Sala con claraboya para mirar las estrellas", captionEn: "Room with a skylight for stargazing" },
  { src: '/images/inkalab/canotaje.jpeg', category: 'aventura', captionEs: "Canotaje", captionEn: "Canoeing" },
  { src: '/images/inkalab/laguna-nevada.png', category: 'paisajes', captionEs: "Laguna glaciar y nevados", captionEn: "Glacial lake and snow peaks" },
  { src: '/images/tour_etnobotanica_herbs_1791233038018.jpg', category: 'cultura', captionEs: "Mujer andina con hierbas medicinales", captionEn: "Andean woman with medicinal herbs" },
  { src: '/images/willka_unu_inca_sauna_1791233592210.jpg', category: 'bienestar', captionEs: "Sauna de vapor con hierbas en Willka Unu", captionEn: "Herbal steam sauna at Willka Unu" },
];
