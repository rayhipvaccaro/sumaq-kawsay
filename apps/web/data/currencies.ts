// Monedas. Todos los precios del sitio estan en soles (PEN) y se convierten al mostrarlos.
// Los tipos de cambio en vivo vienen de /api/fx. Esta tabla es solo el respaldo si no hay internet.

export const DEFAULT_UPDATED = '2026-10-14';
const PEN_PER_USD = 3.75;

// Unidades de cada moneda por 1 dolar (valores aproximados de respaldo)
const PER_USD: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.37, AUD: 1.5, CHF: 0.88, NZD: 1.65, CNY: 7.2, JPY: 150, KRW: 1350,
  HKD: 7.8, TWD: 32, SGD: 1.34, INR: 84, THB: 34, MYR: 4.4, IDR: 15800, PHP: 58, VND: 25000, PKR: 278, BDT: 120,
  BRL: 5.5, ARS: 1000, CLP: 950, COP: 4100, MXN: 19.5, UYU: 41, BOB: 6.9, PYG: 7800, CRC: 520, DOP: 60,
  GTQ: 7.7, HNL: 25, NIO: 36.8, PAB: 1, JMD: 157, RUB: 95, TRY: 34, UAH: 41, AED: 3.67, SAR: 3.75, ILS: 3.7,
  EGP: 49, ZAR: 18, NGN: 1600, KES: 129, MAD: 9.8, SEK: 10.5, NOK: 10.8, DKK: 6.9, PLN: 4, CZK: 23, HUF: 370, RON: 4.6,
};

export const DEFAULT_RATES: Record<string, number> = (() => {
  const out: Record<string, number> = { PEN: 1 };
  for (const [code, perUsd] of Object.entries(PER_USD)) out[code] = Number((perUsd / PEN_PER_USD).toFixed(6));
  return out;
})();

/** Monedas que se muestran primero en el selector. */
export const POPULAR_CURRENCIES = [
  'PEN', 'USD', 'EUR', 'GBP', 'BRL', 'CLP', 'COP', 'MXN', 'ARS', 'CAD', 'AUD', 'JPY', 'CNY', 'KRW', 'CHF', 'INR',
];

export function currencyName(code: string, locale = 'es'): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'currency' }).of(code) ?? code;
  } catch {
    return code;
  }
}
