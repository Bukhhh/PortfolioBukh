import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

// GET - Admin only (media library is internal)
export async function GET() {
  try {
    await requireAdmin();
    const media = await db.media.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(media);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Fetch media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// DELETE - Admin only
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    await db.media.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete media error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
