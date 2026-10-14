import { NextRequest, NextResponse } from 'next/server';
import type { CMSData } from '@/data/defaultCmsData';
import { getSession } from '@/lib/serverAuth';
import { requireAdmin } from '@/lib/requireAuth';
import { mergeReservations, mutateCms, readCms } from '@/lib/orderStore';

// El publico ve solo el contenido del sitio. Reservas, contactos, contabilidad,
// proveedores y stock (datos personales y de negocio) solo los ve un admin.
export async function GET(req: NextRequest) {
  const data = readCms();
  const user = await getSession(req);
  const isAdmin = Boolean(user?.isAdmin) && !user?.mustChangePassword;
  if (isAdmin) return NextResponse.json(data);
  const {
    contacts: _c,
    reservations: _r,
    accountingEntries: _a,
    providers: _p,
    stockItems: _s,
    ...publicData
  } = data;
  void _c; void _r; void _a; void _p; void _s;
  return NextResponse.json(publicData);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) return auth.error;
  let updated: Partial<CMSData>;
  try {
    updated = (await req.json()) as Partial<CMSData>;
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  try {
    const merged = await mutateCms((current) => {
      const next: CMSData = {
        ...current,
        ...updated,
        generalContent: {
          ...current.generalContent,
          ...(updated.generalContent || {}),
        },
      };
      if (Array.isArray(updated.reservations)) {
        next.reservations = mergeReservations(current.reservations ?? [], updated.reservations);
      }
      Object.assign(current, next);
      return next;
    });
    return NextResponse.json({ success: true, data: merged, diskPersisted: true });
  } catch (error) {
    console.error('Error updating CMS data:', error);
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 });
  }
}
