import { DEFAULT_RATES } from '@/data/currencies';

// Tipos de cambio actuales (unidades de cada moneda por 1 sol).
// Los actualiza SitePrefsProvider cuando llegan los datos de /api/fx.
let RATES: Record<string, number> = DEFAULT_RATES;

export function setMoneyRates(r: Record<string, number>) {
  RATES = { ...DEFAULT_RATES, ...r, PEN: 1 };
}

export function hasRate(code: string): boolean {
  return code === 'PEN' || (RATES[code] ?? 0) > 0;
}

const ZERO_DECIMALS = new Set(['JPY', 'KRW', 'CLP', 'PYG', 'COP', 'VND', 'IDR', 'HUF', 'ISK', 'UGX', 'XAF', 'XOF']);

/**
 * Da formato a un precio. Se parte de soles; si la moneda es USD y se pasa el precio en dolares
 * del catalogo, se respeta ese precio exacto.
 */
export function fmt(pen: number, code: string, usd?: number): string {
  if (code === 'PEN') {
    return `S/ ${pen.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (code === 'USD' && usd !== undefined) {
    return `$ ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  }
  const rate = RATES[code];
  if (!rate || rate <= 0) return fmt(pen, 'PEN');
  const value = pen * rate;
  const digits = ZERO_DECIMALS.has(code) ? 0 : 2;
  let s: string;
  try {
    s = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    s = value.toFixed(digits);
  }
  return s.includes(code) ? s : `${s} ${code}`;
}

/** Textos con precio dentro ("Desde S/ 380 / noche"): se reemplaza el monto en soles. */
export function fmtNote(notePEN: string, noteUSD: string, code: string): string {
  if (code === 'PEN') return notePEN;
  if (code === 'USD') return noteUSD;
  return notePEN.replace(/S\/\s*(\d+(?:\.\d+)?)/g, (_m, n: string) => fmt(Number(n), code));
}
