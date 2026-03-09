import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    const education = await db.education.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(education);
  } catch (error) {
    console.error('Fetch education error:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    const education = await db.education.create({
      data: {
        institution: String(data.institution || '').slice(0, 200),
        degree: String(data.degree || '').slice(0, 200),
        field: data.field ? String(data.field).slice(0, 100) : null,
        gpa: data.gpa ? String(data.gpa).slice(0, 20) : null,
        startDate: String(data.startDate || '').slice(0, 20),
        endDate: data.endDate ? String(data.endDate).slice(0, 20) : null,
        description: data.description ? String(data.description).slice(0, 2000) : null,
        achievements: JSON.stringify(Array.isArray(data.achievements) ? data.achievements : []),
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Create education error:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const education = await db.education.update({
      where: { id: String(data.id) },
      data: {
        institution: String(data.institution || '').slice(0, 200),
        degree: String(data.degree || '').slice(0, 200),
        field: data.field ? String(data.field).slice(0, 100) : null,
        gpa: data.gpa ? String(data.gpa).slice(0, 20) : null,
        startDate: String(data.startDate || '').slice(0, 20),
        endDate: data.endDate ? String(data.endDate).slice(0, 20) : null,
        description: data.description ? String(data.description).slice(0, 2000) : null,
        achievements: JSON.stringify(Array.isArray(data.achievements) ? data.achievements : []),
        order: Number(data.order) || 0,
      },
    });
    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update education error:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Education ID is required' }, { status: 400 });
    await db.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete education error:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
