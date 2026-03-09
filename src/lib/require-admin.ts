/**
 * requireAdmin — call this at the top of any protected API route.
 * Returns the adminId string if authenticated, or throws a 401 NextResponse.
 *
 * Usage:
 *   const adminId = await requireAdmin();
 */
import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-session';

export async function requireAdmin(): Promise<string> {
  const session = await getAdminSession();

  if (!session?.adminId) {
    throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session.adminId;
}
