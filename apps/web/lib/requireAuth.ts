import { NextRequest, NextResponse } from 'next/server';
import { getSession, SessionUser } from './serverAuth';
import { hasAny } from './permissions';

type Ok = { user: SessionUser };
type Fail = { error: NextResponse };

export async function requireAdmin(req: NextRequest): Promise<Ok | Fail> {
  const user = await getSession(req);
  if (!user) {
    return { error: NextResponse.json({ error: 'Sin sesion' }, { status: 401 }) };
  }
  if (user.mustChangePassword) {
    return { error: NextResponse.json({ error: 'Debes cambiar tu clave' }, { status: 403 }) };
  }
  if (!user.isAdmin) {
    return { error: NextResponse.json({ error: 'Sin permiso' }, { status: 403 }) };
  }
  return { user };
}

export async function requirePerm(
  req: NextRequest,
  perms: string[],
): Promise<Ok | Fail> {
  const user = await getSession(req);
  if (!user) {
    return { error: NextResponse.json({ error: 'Sin sesion' }, { status: 401 }) };
  }
  if (user.mustChangePassword) {
    return { error: NextResponse.json({ error: 'Debes cambiar tu clave' }, { status: 403 }) };
  }
  if (!hasAny(user, perms)) {
    return { error: NextResponse.json({ error: 'Sin permiso' }, { status: 403 }) };
  }
  return { user };
}
