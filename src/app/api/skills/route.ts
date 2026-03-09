import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Fetch skills error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    const skill = await db.skill.create({
      data: {
        name: String(data.name || '').slice(0, 100),
        category: String(data.category || '').slice(0, 100),
        proficiency: Math.min(100, Math.max(0, Number(data.proficiency) || 80)),
        iconUrl: data.iconUrl ? String(data.iconUrl).slice(0, 500) : null,
        color: data.color ? String(data.color).slice(0, 20) : null,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Create skill error:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const skill = await db.skill.update({
      where: { id: String(data.id) },
      data: {
        name: String(data.name || '').slice(0, 100),
        category: String(data.category || '').slice(0, 100),
        proficiency: Math.min(100, Math.max(0, Number(data.proficiency) || 80)),
        iconUrl: data.iconUrl ? String(data.iconUrl).slice(0, 500) : null,
        color: data.color ? String(data.color).slice(0, 20) : null,
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update skill error:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    await db.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete skill error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
