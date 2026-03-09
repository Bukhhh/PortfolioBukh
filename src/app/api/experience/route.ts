import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Fetch experiences error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    const experience = await db.experience.create({
      data: {
        title: String(data.title || '').slice(0, 200),
        company: String(data.company || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        startDate: String(data.startDate || '').slice(0, 20),
        endDate: data.endDate ? String(data.endDate).slice(0, 20) : null,
        location: data.location ? String(data.location).slice(0, 200) : null,
        type: String(data.type || 'work').slice(0, 50),
        current: !!data.current,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Create experience error:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const experience = await db.experience.update({
      where: { id: String(data.id) },
      data: {
        title: String(data.title || '').slice(0, 200),
        company: String(data.company || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        startDate: String(data.startDate || '').slice(0, 20),
        endDate: data.endDate ? String(data.endDate).slice(0, 20) : null,
        location: data.location ? String(data.location).slice(0, 200) : null,
        type: String(data.type || 'work').slice(0, 50),
        current: !!data.current,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update experience error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    await db.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete experience error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
