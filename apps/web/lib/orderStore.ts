// Almacen del servidor para el CMS y las ordenes (archivo JSON). Serializa las escrituras
// para que dos pedidos al mismo tiempo no se pisen.
// LIMITE: necesita disco con permiso de escritura (PC o VM). En hosting serverless (Vercel) no persiste.
import fs from 'fs';
import path from 'path';
import { DEFAULT_CMS_DATA, CMSData } from '@/data/defaultCmsData';
import type { Reservation } from '@/data/businessData';

const DATA_FILE = path.join(process.cwd(), 'data', 'cms_store.json');

let chain: Promise<unknown> = Promise.resolve();

export function readCms(): CMSData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return { ...DEFAULT_CMS_DATA, ...parsed };
    }
  } catch (error) {
    console.error('Error reading CMS data from disk:', error);
  }
  return structuredClone(DEFAULT_CMS_DATA);
}

function writeCms(data: CMSData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/** Lee, deja que `fn` cambie los datos, guarda. Una a la vez. */
export function mutateCms<R>(fn: (data: CMSData) => R | Promise<R>): Promise<R> {
  const run = chain.then(async () => {
    const data = readCms();
    const result = await fn(data);
    writeCms(data);
    return result;
  });
  chain = run.catch(() => undefined);
  return run;
}

export function nextOrderId(reservations: Reservation[]): string {
  let max = 100;
  for (const r of reservations) {
    const m = /^SQ-2026-0?(\d+)$/.exec(r.id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `SQ-2026-0${max + 1}`;
}

/** Une lo que manda el panel con lo que hay en el servidor, sin perder ordenes ni pagos nuevos. */
export function mergeReservations(server: Reservation[], client: Reservation[]): Reservation[] {
  const serverById = new Map(server.map((r) => [r.id, r]));
  const clientIds = new Set(client.map((r) => r.id));
  const serverOnly = server.filter((r) => !clientIds.has(r.id));
  const merged = client.map((c) => {
    const s = serverById.get(c.id);
    if (!s) return c;
    const sPay = s.payments?.length ?? 0;
    const cPay = c.payments?.length ?? 0;
    if (sPay > cPay) {
      return {
        ...c,
        payments: s.payments,
        amountPaidPEN: s.amountPaidPEN,
        paymentStatus: s.paymentStatus,
        paymentMethod: s.paymentMethod,
        emailLogs: s.emailLogs.length > c.emailLogs.length ? s.emailLogs : c.emailLogs,
      };
    }
    return { ...c, accessToken: s.accessToken ?? c.accessToken };
  });
  return [...serverOnly, ...merged];
}
