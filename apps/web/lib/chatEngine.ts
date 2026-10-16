import type { Tour } from '@/data/toursData'; import type { SiteDataLists } from '@/lib/siteData';
import {
  ANCESTRAL_ZONES,
  ECOTOURISM_SERVICES,
  HOW_TO_REACH,
  SEASONS_DATA,
  type AncestralZone,
  type EcotourismService,
} from '@/data/inkaLabData';

export type BotAction = 'reservar' | 'seguimiento' | 'whatsapp' | 'triptico';
export interface BotReply {
  text: string;
  actions: BotAction[];
}

interface Entry {
  kind: 'tour' | 'zone' | 'service';
  titleN: string;
  blobN: string;
  tour?: Tour;
  zone?: AncestralZone;
  service?: EcotourismService;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOP = new Set([
  'tour', 'tours', 'experiencia', 'experiencias', 'paquete', 'paquetes', 'precio', 'precios', 'costo', 'cuesta',
  'cuanto', 'tarifa', 'informacion', 'quiero', 'quisiera', 'saber', 'sobre', 'tienen', 'ofrecen', 'hacer', 'para',
  'como', 'donde', 'cual', 'cuales', 'esta', 'este', 'estas', 'estos', 'dura', 'duracion', 'incluye', 'incluido',
  'itinerario', 'horario', 'dime', 'dame', 'favor', 'puedo', 'puede', 'pueden', 'hola', 'buenas', 'ustedes', 'mucho',
  'muy', 'mas', 'con', 'sin', 'por', 'que', 'una', 'uno', 'los', 'las', 'del', 'mis', 'tus', 'inca', 'inka', 'lab',
  'sumaq', 'kawsay', 'servicio', 'servicios', 'tipo', 'ofrece', 'detalle', 'detalles', 'cosas',
]);

// Palabras de la gente -> palabras que aparecen en los nombres de tus servicios.
const SYN: Record<string, string[]> = {
  caballo: ['cabalgata'], caballos: ['cabalgata'], montar: ['cabalgata'], jinete: ['cabalgata'],
  hospedaje: ['bungalow'], alojamiento: ['bungalow'], dormir: ['bungalow'], hotel: ['bungalow'], habitacion: ['bungalow'],
  trekking: ['camino'], caminata: ['camino'], senderismo: ['camino'],
  estrellas: ['astronomia'], telescopio: ['astronomia'], cielo: ['astronomia'],
  plantas: ['etnobotanica'], hierbas: ['etnobotanica'], medicina: ['etnobotanica'], herbolaria: ['etnobotanica'],
  telar: ['tejedoras'], textil: ['tejedoras'], tejido: ['tejedoras'],
  vapor: ['sauna'], bano: ['sauna'],
};

function buildEntries(tours: Tour[], D: SiteDataLists): Entry[] {
  const out: Entry[] = [];
  for (const t of tours) {
    out.push({
      kind: 'tour',
      tour: t,
      titleN: norm(t.titleEs || ''),
      blobN: norm([t.subtitleEs, t.slug, t.category, t.descriptionEs, ...(t.highlightsEs ?? [])].join(' ')),
    });
  }
  for (const z of D.zones) {
    out.push({
      kind: 'zone',
      zone: z,
      titleN: norm(z.nameEs),
      blobN: norm([z.pacha, z.symbolismEs, z.descriptionEs, ...z.highlightsEs].join(' ')),
    });
  }
  for (const s of D.services) {
    out.push({
      kind: 'service',
      service: s,
      titleN: norm(s.titleEs),
      blobN: norm([s.taglineEs, s.descriptionEs, ...s.featuresEs].join(' ')),
    });
  }
  return out;
}

function pick(q: string, ents: Entry[]): Entry | null {
  const toks = new Set<string>();
  for (const w of q.split(' ')) {
    if (w.length < 4 || STOP.has(w)) continue;
    toks.add(w);
    if (w.length > 4 && w.endsWith('s')) toks.add(w.slice(0, -1));
    (SYN[w] ?? []).forEach((s) => toks.add(s));
  }
  if (!toks.size) return null;
  let best: Entry | null = null;
  let bs = 0;
  let second = 0;
  for (const e of ents) {
    let s = 0;
    toks.forEach((t) => {
      if (e.titleN.includes(t)) s += 3;
      else if (e.blobN.includes(t)) s += 1;
    });
    if (s > bs) {
      second = bs;
      bs = s;
      best = e;
    } else if (s > second) second = s;
  }
  return best && bs >= 1 && (bs >= 3 || bs > second) ? best : null;
}

const cut = (s: string, n: number) => {
  const t = (s || '').trim();
  if (t.length <= n) return t;
  const c = t.slice(0, n);
  return c.slice(0, Math.max(c.lastIndexOf(' '), 40)) + '…';
};
const money = (pen?: number, usd?: number) =>
  `S/ ${Number(pen || 0).toFixed(2)}` + (usd ? ` (US$ ${Number(usd).toFixed(2)})` : '');
const lines = (...l: (string | false | undefined)[]) => l.filter((x): x is string => !!x).slice(0, 48).join('\n');

function titleOf(e: Entry): string {
  return e.tour?.titleEs ?? e.zone?.nameEs ?? e.service?.titleEs ?? '';
}

function describe(e: Entry, q: string): string {
  const wantPrice = /precio|costo|cuesta|cuanto|tarifa|valor/.test(q);
  const wantItin = /itinerario|horario|agenda|programa|recorrido|que hacemos|que se hace/.test(q);
  const wantIncl = /incluye|incluido|incluida|ofrece|llevar|traer|equipaje|mochila|necesito/.test(q);
  const wantFacts = /duracion|cuanto dura|dificultad|altura|altitud|grupo|personas|edad|ninos|nivel/.test(q);

  if (e.tour) {
    const t = e.tour;
    const price = `Precio: ${money(t.pricePEN, t.priceUSD)}.`;
    if (wantPrice) return lines(t.titleEs, price);
    if (wantItin && t.itinerary?.length) {
      return lines(
        `Itinerario de ${t.titleEs}:`,
        ...t.itinerary.slice(0, 12).map((i) => `• ${i.time} — ${i.titleEs}: ${cut(i.descEs, 130)}`),
      );
    }
    if (wantIncl) {
      return lines(
        t.titleEs,
        t.includedEs?.length ? `Incluye: ${t.includedEs.join('; ')}.` : undefined,
        t.notIncludedEs?.length ? `No incluye: ${t.notIncludedEs.join('; ')}.` : undefined,
        t.whatToBringEs?.length ? `Qué llevar: ${t.whatToBringEs.join('; ')}.` : undefined,
      );
    }
    if (wantFacts) {
      return lines(
        t.titleEs,
        `Duración: ${t.durationEs}.`,
        `Dificultad: ${t.difficultyEs}.`,
        `Altitud máxima: ${t.maxAltitude}.`,
        `Grupo: ${t.groupSize}.`,
        `Lugar: ${t.locationEs}.`,
      );
    }
    return lines(
      t.titleEs,
      cut(t.descriptionEs, 420),
      `Duración: ${t.durationEs} · Dificultad: ${t.difficultyEs} · ${t.groupSize}.`,
      ...(t.highlightsEs ?? []).slice(0, 3).map((h) => `• ${h}`),
      price,
    );
  }

  if (e.zone) {
    const z = e.zone;
    const price = `Precio: ${money(z.pricePEN, z.priceUSD)}.`;
    if (wantPrice) return lines(z.nameEs, price);
    if (wantIncl) return lines(z.nameEs, ...z.highlightsEs.map((h) => `• ${h}`));
    if (wantFacts) {
      return lines(z.nameEs, `Duración: ${z.durationEs}.`, `Dificultad: ${z.difficultyEs}.`, `Altitud: ${z.altitude}.`);
    }
    return lines(
      z.nameEs,
      cut(z.descriptionEs, 420),
      `Duración: ${z.durationEs} · Dificultad: ${z.difficultyEs} · Altitud: ${z.altitude}.`,
      ...z.highlightsEs.slice(0, 3).map((h) => `• ${h}`),
      price,
    );
  }

  const s = e.service as EcotourismService;
  if (wantPrice) return lines(s.titleEs, `Precio: ${s.priceNotePEN}.`);
  if (wantIncl) return lines(s.titleEs, ...s.featuresEs.map((f) => `• ${f}`));
  return lines(
    s.titleEs,
    s.taglineEs,
    cut(s.descriptionEs, 380),
    ...s.featuresEs.slice(0, 4).map((f) => `• ${f}`),
    `Precio: ${s.priceNotePEN}.`,
  );
}

export function answer(raw: string, tours: Tour[], data?: SiteDataLists): BotReply {
  const q = norm(raw);
  const has = (re: RegExp) => re.test(q);
  const R = (text: string, actions: BotAction[] = []): BotReply => ({ text, actions });
  const D = data ?? { zones: ANCESTRAL_ZONES, services: ECOTOURISM_SERVICES, reach: HOW_TO_REACH, seasons: SEASONS_DATA }; const ents = buildEntries(tours, D);

  if (!q) return R('Escribe tu pregunta y con gusto te ayudo.');

  if (has(/triptico|folleto|brochure|descargar|\bpdf\b/)) {
    return R(
      'Puedes descargar el tríptico con el detalle de todas nuestras experiencias y servicios activos, sin precios.',
      ['triptico'],
    );
  }

  if (has(/seguimiento|rastre|estado de (mi )?reserva|mi reserva|mis reservas|codigo de reserva/)) {
    return R(
      'Para ver tu reserva, usa el botón de abajo con tu código. También puedes entrar a "Ingresar" con el correo de tu reserva: la primera vez tu clave es tu número de documento.',
      ['seguimiento'],
    );
  }

  if (has(/reserv|disponib|cupo|agendar|comprar|contratar|apartar/)) {
    const hit = pick(q, ents);
    return R(
      lines(
        hit ? `Perfecto, vamos a reservar: ${titleOf(hit)}.` : 'Con gusto te ayudo a reservar.',
        'Elige la experiencia, la fecha y el número de personas. Verás los cupos reales de cada día.',
        'Al terminar puedes pagar ahora o seguir tu reserva entrando con tu correo.',
      ),
      ['reservar'],
    );
  }

  if (has(/\bpag(o|os|ar|ando)\b|tarjeta|transferencia|yape|plin|factura|boleta|comprobante|metodo/)) {
    return R(
      lines(
        'Al terminar tu reserva eliges "Pagar ahora" o pagas por transferencia.',
        'Si es transferencia, queda "por verificar" hasta que el equipo la confirme. Recibes tu comprobante.',
        'Para dudas de facturación escríbenos por WhatsApp.',
      ),
      ['whatsapp'],
    );
  }

  if (has(/whatsapp|telefono|celular|llamar|contacto|correo|email|numero de/)) {
    return R('Nos puedes escribir por WhatsApp al +51 912 189 856. Respondemos tus consultas y reservas.', ['whatsapp']);
  }

  if (has(/llegar|ubicacion|ubicad|direccion|mapa|km 84|transporte|aeropuerto|\btren\b|recog|traslado|donde (queda|estan|esta)/)) {
    return R(
      lines(
        'Estamos en el Km 84, Ollantaytambo (Valle Sagrado, Cusco).',
        ...D.reach.map(
          (h) => `• ${h.from}: ${h.distance}, ${h.time}. Ruta: ${h.route}. ${h.recommendationsEs}`,
        ),
      ),
      ['whatsapp'],
    );
  }

  if (has(/clima|temporada|epoca|lluv|frio|calor|temperatura|mejor mes|cuando (ir|viajar|visitar)|ropa|abrigo/)) {
    return R(
      lines(
        ...D.seasons.flatMap((s) => [
          `${s.nameEs} (${s.monthsEs})`,
          `Clima: ${s.weatherEs}`,
          `Consejo: ${s.clothingTipsEs.slice(0, 2).join('; ')}.`,
        ]),
      ),
      ['reservar'],
    );
  }

  if (has(/idioma|language|hablan|ingles|frances|aleman|chino|japones/)) {
    return R('Puedes escribirme en el idioma que prefieras: entiendo tu mensaje y te respondo en el mismo idioma.');
  }

  if (has(/gracias|thank/)) return R('¡Con gusto! Si necesitas algo más, aquí estoy.');

  if (q.length < 25 && has(/^(hola|buenas|buenos dias|buen dia|hey|saludos|hello|hi)\b/)) {
    return R('¡Hola! Pregúntame por experiencias, hospedaje, precios, clima, cómo llegar o reservas.');
  }

  const hit = pick(q, ents);
  if (hit) return R(describe(hit, q), ['reservar']);

  if (has(/precio|costo|cuesta|cuanto|tarifa/)) {
    return R(
      lines(
        'Estos son nuestros precios:',
        ...tours.slice(0, 14).map((t) => `• ${t.titleEs}: ${money(t.pricePEN, t.priceUSD)}`),
        ...ANCESTRAL_ZONES.map((z) => `• ${z.nameEs}: ${money(z.pricePEN, z.priceUSD)}`),
      ),
      ['reservar'],
    );
  }

  if (has(/que (ofrecen|tienen|hacen)|experiencia|actividad|servicio|opcion|paquete|tour|catalogo|recomiend|recomendacion/)) {
    return R(
      lines(
        'Esto es lo que ofrecemos:',
        ...tours.slice(0, 14).map((t) => `• ${t.titleEs} (${t.durationEs})`),
        ...D.zones.map((z) => `• ${z.nameEs} (${z.durationEs})`),
        ...D.services.map((s) => `• ${s.titleEs}`),
        'Pregúntame por cualquiera para ver el detalle.',
      ),
      ['reservar', 'triptico'],
    );
  }

  return R(
    'No estoy seguro de haber entendido. Puedo contarte sobre experiencias y servicios, precios, itinerarios, clima y temporadas, cómo llegar, reservas y pagos. Si prefieres hablar con una persona, escríbenos por WhatsApp.',
    ['whatsapp'],
  );
}