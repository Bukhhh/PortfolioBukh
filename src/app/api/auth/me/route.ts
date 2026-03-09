import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth-session';

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify the admin still exists in DB
    const admin = await db.admin.findUnique({
      where: { id: session.adminId },
      select: { id: true, username: true },
    });

    if (!admin) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, admin });
  } catch (error) {
    console.error('[me] Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
