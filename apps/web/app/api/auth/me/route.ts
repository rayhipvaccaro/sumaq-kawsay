import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/serverAuth';

export async function GET(req: NextRequest) {
  const user = await getSession(req);
  if (!user) {
    return NextResponse.json({ error: 'Sin sesion' }, { status: 401 });
  }
  return NextResponse.json({ user });
}