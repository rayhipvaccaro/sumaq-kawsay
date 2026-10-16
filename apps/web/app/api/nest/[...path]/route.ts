import { NextRequest, NextResponse } from 'next/server';
import { API_URL, SESSION_COOKIE } from '@/lib/session';

// Proxy con lista blanca hacia Nest. El token vive en cookie httpOnly;
// Nest valida rol, permisos y area en cada llamada.
const ALLOWED = new Set(['users', 'roles', 'permissions', 'areas', 'me', 'activities', 'slots', 'resources', 'runs', 'customers']);

async function handle(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (!path?.length || !ALLOWED.has(path[0]) || path.some((p) => p === '..' || p === '')) {
    return NextResponse.json({ error: 'Ruta no permitida' }, { status: 404 });
  }
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Sin sesion' }, { status: 401 });

  const url = `${API_URL}/${path.map(encodeURIComponent).join('/')}${new URL(req.url).search}`;
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  let res: Response;
  try {
    res = await fetch(url, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ error: 'Servidor no disponible' }, { status: 502 });
  }
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
  });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
