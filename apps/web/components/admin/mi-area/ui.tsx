import type { ReactNode } from 'react';

export const INPUT = 'px-3 py-2 rounded-lg border border-stone-400 bg-white text-stone-900 text-sm placeholder-stone-500 focus:outline-none focus:border-[#B7791F] focus:ring-2 focus:ring-[#F6A935]/40';
export const BTN = 'px-4 py-2 rounded-lg bg-[#F6A935] hover:bg-[#D48B1E] text-[#181513] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed';
export const BTN2 = 'px-2.5 py-1.5 rounded-md bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed';
export const CARD = 'p-4 rounded-xl border border-stone-300 bg-white space-y-3';

export type Run = (fn: () => Promise<string | void>) => Promise<void>;

export interface Slot { id: number; startsAt: string; endsAt: string; capacity: number; booked: number; tripId: number | null }
export interface Activity { id: number; name: string; resourceLabel: string | null; area: { id: number; name: string }; slots: Slot[] }
export interface Res { id: number; name: string; seats: number; tripsPerDay: number; status: 'ACTIVE' | 'REST' | 'MAINTENANCE'; active: boolean }
export interface Trip { number: number; startTime: string; durationMin: number; capacity?: number }
export interface Booking {
  id: number; quantity: number; customerName: string; customerContact: string; status: string; createdAt: string;
  slot: { id: number; startsAt: string; activity: { id: number; name: string } };
}

export const STATUS_LABEL = { ACTIVE: 'Activo', REST: 'Descanso', MAINTENANCE: 'Mantenimiento' } as const;

export async function api(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`/api/nest/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const m = Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? data?.error;
    throw new Error(m || 'Error');
  }
  return data;
}

const TZ = 'America/Lima';
export const dayKey = (d: string | Date) => new Date(d).toLocaleDateString('en-CA', { timeZone: TZ });
export const dayLabel = (d: string | Date) =>
  new Date(d).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
export const timeLabel = (d: string | Date) =>
  new Date(d).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ });

export function Help({ children }: { children: ReactNode }) {
  return <p className="text-sm text-stone-600">{children}</p>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-xs font-semibold text-stone-700">
      <span className="block mb-1">{label}</span>
      {children}
    </label>
  );
}
export interface BRes {
  id: number; name: string; kind: string; seats: number; status: 'ACTIVE' | 'REST' | 'MAINTENANCE'; active: boolean;
  ownerId: number | null; tripsPerDay: number; trips: number; used: number; left: number;
  busy: boolean; unassigned: boolean; coverId: number | null; working: boolean; mine: boolean; takeable: boolean;
}
export interface BRoute { id: number; name: string; minMin: number; maxMin: number }
export interface BPending {
  bookingId: number; customerName: string; customerContact: string; customerDoc: string | null; arrivalTime: string | null; quantity: number; pending: number;
}
export interface BRun {
  id: number; bookingId: number; customerName: string; customerDoc: string | null;
  resourceId: number | null; resourceName: string | null; routeName: string | null;
  status: 'IN_PROGRESS' | 'DONE' | 'NOT_DONE'; startedAt: string | null; plannedEndAt: string | null; endedAt: string | null;
  startedById: number | null; ownerId: number | null; reason: string | null; mine: boolean;
}
export interface Board {
  date: string; me: number; isAdmin: boolean; capacity: number; slotCapacity: number; booked: number;
  resources: BRes[]; routes: BRoute[]; pending: BPending[]; runs: BRun[];
  upcoming: { bookingId: number; date: string; customerName: string; customerContact: string; customerDoc: string | null; quantity: number; arrivalTime: string | null }[];
  names: Record<number, string>; staff: { id: number; fullName: string }[];
}
export const KIND_LABEL: Record<string, string> = { main: 'Principal', guia: 'Guía', espacio: 'Espacio' };