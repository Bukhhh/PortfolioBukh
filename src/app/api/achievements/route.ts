import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    const achievements = await db.achievement.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Fetch achievements error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    const achievement = await db.achievement.create({
      data: {
        title: String(data.title || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        date: String(data.date || '').slice(0, 20),
        issuer: data.issuer ? String(data.issuer).slice(0, 200) : null,
        imageUrl: data.imageUrl ? String(data.imageUrl).slice(0, 500) : null,
        link: data.link ? String(data.link).slice(0, 500) : null,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Create achievement error:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const achievement = await db.achievement.update({
      where: { id: String(data.id) },
      data: {
        title: String(data.title || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        date: String(data.date || '').slice(0, 20),
        issuer: data.issuer ? String(data.issuer).slice(0, 200) : null,
        imageUrl: data.imageUrl ? String(data.imageUrl).slice(0, 500) : null,
        link: data.link ? String(data.link).slice(0, 500) : null,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update achievement error:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    await db.achievement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete achievement error:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
