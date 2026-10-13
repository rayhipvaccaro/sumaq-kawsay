import { NextRequest, NextResponse } from 'next/server';
import { API_URL, SESSION_COOKIE } from '@/lib/session';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Sin sesion' }, { status: 401 });
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      }),
      cache: 'no-store',
    });
  } catch (e) {
    console.error('CHANGE-PASSWORD: fallo al llamar a Nest:', e);
    return NextResponse.json({ error: 'Servidor no disponible' }, { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    return NextResponse.json({ error: msg ?? 'Error al cambiar la clave' }, { status: res.status });
  }

  const out = NextResponse.json({
    user: data.user,
    mustChangePassword: data.mustChangePassword,
  });
  out.cookies.set(SESSION_COOKIE, data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return out;
}