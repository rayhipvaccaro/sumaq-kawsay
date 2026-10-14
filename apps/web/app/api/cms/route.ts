import { NextRequest, NextResponse } from 'next/server';
import type { CMSData } from '@/data/defaultCmsData';
import { getSession } from '@/lib/serverAuth';
import { CMS_FIELD_PERMS, hasAny } from '@/lib/permissions';
import { mergeReservations, mutateCms, readCms } from '@/lib/orderStore';

// Campos "internos" (datos personales y de negocio): solo los ve quien tiene el permiso.
// Tours, textos y testimonios son publicos.
const PUBLIC_FIELDS = ['tours', 'generalContent', 'testimonials'];

export async function GET(req: NextRequest) {
  const data = readCms() as unknown as Record<string, unknown>;
  const user = await getSession(req);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (PUBLIC_FIELDS.includes(k)) out[k] = v;
    else if (hasAny(user, CMS_FIELD_PERMS[k] ?? [])) out[k] = v;
  }
  return NextResponse.json(out);
}

export async function POST(req: NextRequest) {
  const user = await getSession(req);
  if (!user) return NextResponse.json({ error: 'Sin sesion' }, { status: 401 });
  if (user.mustChangePassword) {
    return NextResponse.json({ error: 'Debes cambiar tu clave' }, { status: 403 });
  }
  let incoming: Record<string, unknown>;
  try {
    incoming = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  // Solo pasan los campos para los que el usuario tiene permiso.
  const updated: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(incoming)) {
    if (hasAny(user, CMS_FIELD_PERMS[k] ?? [])) updated[k] = v;
  }
  if (Object.keys(updated).length === 0) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 });
  }
  const upd = updated as Partial<CMSData>;
  try {
    await mutateCms((current) => {
      const next: CMSData = {
        ...current,
        ...upd,
        generalContent: {
          ...current.generalContent,
          ...(upd.generalContent || {}),
        },
      };
      if (Array.isArray(upd.reservations)) {
        next.reservations = mergeReservations(current.reservations ?? [], upd.reservations);
      }
      Object.assign(current, next);
      return next;
    });
    return NextResponse.json({ success: true, diskPersisted: true });
  } catch (error) {
    console.error('Error updating CMS data:', error);
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  }
}
