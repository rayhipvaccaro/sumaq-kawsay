// Proveedor de pago SIMULADO. Para pasar a pagos reales (Culqi, Niubiz, Izipay, Stripe...)
// se reemplaza este archivo por uno que llame al proveedor, con la misma forma de respuesta.
import { randomBytes } from 'crypto';

export interface CardInput {
  number: string;
  name: string;
  expiry: string; // MM/AA
  cvv: string;
}

export interface ChargeResult {
  approved: boolean;
  txId: string;
  message: string;
  brand?: string;
  last4?: string;
}

export function detectBrand(number: string): string {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'American Express';
  return 'Tarjeta';
}

export function luhn(number: string): boolean {
  const n = number.replace(/\D/g, '');
  if (n.length < 13 || n.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = Number(n[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function newTxId(prefix = 'SIM'): string {
  return `${prefix}-${randomBytes(5).toString('hex').toUpperCase()}`;
}

export function validateCard(card: CardInput): string | null {
  const n = (card.number ?? '').replace(/\D/g, '');
  if (!luhn(n)) return 'Numero de tarjeta invalido';
  if (!card.name || card.name.trim().length < 3) return 'Escribe el nombre del titular';
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec((card.expiry ?? '').trim());
  if (!m) return 'Vencimiento invalido (MM/AA)';
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return 'Mes de vencimiento invalido';
  const now = new Date();
  const lastDay = new Date(year, month, 0, 23, 59, 59);
  if (lastDay < now) return 'La tarjeta esta vencida';
  const cvvLen = detectBrand(n) === 'American Express' ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLen}}$`).test((card.cvv ?? '').trim())) return 'CVV invalido';
  return null;
}

// Tarjetas de prueba: 4242 4242 4242 4242 aprueba; 4000 0000 0000 0002 rechaza; 4000 0000 0000 9995 sin fondos.
export function chargeCardSimulated(card: CardInput, _amountPEN: number): ChargeResult {
  const n = card.number.replace(/\D/g, '');
  const base = { brand: detectBrand(n), last4: n.slice(-4), txId: newTxId('SIM') };
  if (n === '4000000000000002') {
    return { ...base, approved: false, message: 'Tarjeta rechazada por el banco emisor.' };
  }
  if (n === '4000000000009995') {
    return { ...base, approved: false, message: 'Fondos insuficientes.' };
  }
  return { ...base, approved: true, message: 'Pago aprobado (simulado).' };
}

export function chargeWalletSimulated(phone: string): ChargeResult {
  const p = (phone ?? '').replace(/\D/g, '');
  if (!/^9\d{8}$/.test(p)) {
    return { approved: false, txId: newTxId('YAPE'), message: 'Celular invalido (9 digitos, empieza con 9).' };
  }
  return { approved: true, txId: newTxId('YAPE'), message: 'Pago con Yape/Plin aprobado (simulado).' };
}
