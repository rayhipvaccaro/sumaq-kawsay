import type { NextRequest } from 'next/server';
import { API_URL, SESSION_COOKIE } from './session';

export interface SessionUser {
  id: number;
  username: string;
  fullName?: string;
  discountPct?: number;
  docType?: string | null;
  docNumber?: string | null;
  role: string;
  isAdmin: boolean;
  area: string | null;
  areaId?: number | null;
  permissions: string[];
  mustChangePassword: boolean;
}

export async function getSession(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as SessionUser;
  } catch {
    return null;
  }
}