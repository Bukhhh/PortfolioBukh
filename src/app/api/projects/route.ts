import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

// GET - Public: portfolio page reads this
export async function GET() {
  try {
    const projects = await db.project.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST - Admin only
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    const project = await db.project.create({
      data: {
        title: String(data.title || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        longDescription: data.longDescription ? String(data.longDescription).slice(0, 10000) : null,
        imageUrl: data.imageUrl ? String(data.imageUrl).slice(0, 500) : null,
        images: data.images ? JSON.stringify(data.images) : null,
        demoUrl: data.demoUrl ? String(data.demoUrl).slice(0, 500) : null,
        githubUrl: data.githubUrl ? String(data.githubUrl).slice(0, 500) : null,
        techStack: JSON.stringify(Array.isArray(data.techStack) ? data.techStack : []),
        category: data.category ? String(data.category).slice(0, 50) : null,
        featured: !!data.featured,
        order: Number(data.order) || 0,
        status: String(data.status || 'completed').slice(0, 50),
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT - Admin only
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    if (!data.id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const project = await db.project.update({
      where: { id: String(data.id) },
      data: {
        title: String(data.title || '').slice(0, 200),
        description: String(data.description || '').slice(0, 2000),
        longDescription: data.longDescription ? String(data.longDescription).slice(0, 10000) : null,
        imageUrl: data.imageUrl ? String(data.imageUrl).slice(0, 500) : null,
        images: data.images ? JSON.stringify(data.images) : null,
        demoUrl: data.demoUrl ? String(data.demoUrl).slice(0, 500) : null,
        githubUrl: data.githubUrl ? String(data.githubUrl).slice(0, 500) : null,
        techStack: JSON.stringify(Array.isArray(data.techStack) ? data.techStack : []),
        category: data.category ? String(data.category).slice(0, 50) : null,
        featured: !!data.featured,
        order: Number(data.order) || 0,
        status: String(data.status || 'completed').slice(0, 50),
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE - Admin only
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
