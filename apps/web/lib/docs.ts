export type DocType = 'DNI' | 'PASAPORTE';

export function normDoc(v: string): string {
  return String(v ?? '').trim().toUpperCase().replace(/\s+/g, '');
}

/** DNI = 8 numeros (nacionales). Pasaporte = 6 a 12 letras o numeros (extranjeros). null = valido. */
export function docError(type: string, num: string, es = true): string | null {
  const n = normDoc(num);
  if (type === 'DNI') {
    return /^\d{8}$/.test(n) ? null : es ? 'El DNI debe tener 8 números.' : 'The DNI must have 8 digits.';
  }
  if (type === 'PASAPORTE') {
    return /^[A-Z0-9]{6,12}$/.test(n)
      ? null
      : es
        ? 'El pasaporte debe tener de 6 a 12 letras o números.'
        : 'The passport must have 6 to 12 letters or digits.';
  }
  return es ? 'Elige DNI o pasaporte.' : 'Choose DNI or passport.';
}
