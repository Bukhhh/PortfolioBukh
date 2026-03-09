import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

// GET - Public (portfolio page reads this)
export async function GET() {
  try {
    let profile = await db.profile.findFirst();
    if (!profile) {
      profile = await db.profile.create({
        data: {
          name: 'Mohamad Bukhari',
          title: 'Computer Science Student & AI Developer',
          subtitle: 'Building AI-Powered Solutions',
          bio: 'Final-year CS student at UiTM specializing in Machine Learning, AI, and Full-Stack Development.',
          email: 'mohdbukhari03@gmail.com',
          location: 'Malaysia',
          githubUrl: 'https://github.com/Bukhhh',
          linkedinUrl: 'https://www.linkedin.com/in/bukhtech/',
        },
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT - Admin only
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    let profile = await db.profile.findFirst();

    const profileData = {
      name: String(data.name || '').slice(0, 200),
      title: String(data.title || '').slice(0, 200),
      subtitle: data.subtitle ? String(data.subtitle).slice(0, 200) : null,
      bio: String(data.bio || '').slice(0, 5000),
      avatarUrl: data.avatarUrl ? String(data.avatarUrl).slice(0, 500) : null,
      resumeUrl: data.resumeUrl ? String(data.resumeUrl).slice(0, 500) : null,
      email: data.email ? String(data.email).slice(0, 200) : null,
      phone: data.phone ? String(data.phone).slice(0, 50) : null,
      location: data.location ? String(data.location).slice(0, 200) : null,
      githubUrl: data.githubUrl ? String(data.githubUrl).slice(0, 500) : null,
      linkedinUrl: data.linkedinUrl ? String(data.linkedinUrl).slice(0, 500) : null,
      twitterUrl: data.twitterUrl ? String(data.twitterUrl).slice(0, 500) : null,
      websiteUrl: data.websiteUrl ? String(data.websiteUrl).slice(0, 500) : null,
    };

    profile = profile
      ? await db.profile.update({ where: { id: profile.id }, data: profileData })
      : await db.profile.create({ data: profileData });

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
