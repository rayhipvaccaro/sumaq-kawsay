import type { Reservation } from '@/data/businessData';

export const METHOD_LABEL: Record<string, string> = {
  yape_plin: 'Yape / Plin',
  transferencia_bcp: 'Transferencia BCP',
  interbank: 'Interbank',
  tarjeta: 'Tarjeta',
  efectivo: 'Efectivo',
};
export const PAY_LABEL: Record<string, string> = {
  pendiente: 'Pendiente',
  adelanto_50: 'Adelanto 50%',
  pagado_100: 'Pagado 100%',
  anulado: 'Anulado',
};
export const INVOICE_LABEL: Record<string, string> = {
  boleta: 'Boleta de venta',
  factura: 'Factura',
  nota_venta: 'Nota de venta',
};

export const soles = (n: number) =>
  'S/ ' + (Number.isFinite(n) ? n : 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Los precios incluyen IGV (18%): se separa base imponible e IGV. */
export function igvSplit(total: number) {
  const base = total / 1.18;
  return { base, igv: total - base };
}

export function isSale(r: Reservation) {
  return r.status === 'concretado' || Boolean(r.invoiceNumber);
}

export function paidAmount(r: Reservation) {
  const fromPayments = (r.payments ?? [])
    .filter((p) => p.status === 'aprobado')
    .reduce((a, p) => a + p.amountPEN, 0);
  return fromPayments || r.amountPaidPEN || (r.paymentStatus === 'pagado_100' ? r.totalPEN : 0);
}

export function reservationLines(r: Reservation) {
  const groups: [string, typeof r.activities][] = [
    ['Hospedaje', r.stayItem ? [r.stayItem] : []],
    ['Actividades', r.activities ?? []],
    ['Alimentación', r.meals ?? []],
    ['Extras y traslados', r.extras ?? []],
  ];
  return groups.filter(([, items]) => items.length > 0);
}
