import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

// GET - Public (chatbot and UI read settings)
export async function GET() {
  try {
    let settings = await db.settings.findFirst();
    if (!settings) {
      settings = await db.settings.create({
        data: {
          introEnabled: true,
          introDuration: 6000,
          introMessage: "Welcome to my portfolio! I'm Robo, your AI guide.",
          assistantName: 'Robo',
          assistantType: 'robot',
          theme: 'dark',
          primaryColor: '#3b82f6',
          siteTitle: 'Mohamad Bukhari | Portfolio',
          siteDescription: 'Computer Science Student & AI Developer',
          showIntro: true,
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT - Admin only
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const data = await request.json();
    let settings = await db.settings.findFirst();

    const settingsData = {
      introEnabled: typeof data.introEnabled === 'boolean' ? data.introEnabled : true,
      introDuration: Math.min(30000, Math.max(0, Number(data.introDuration) || 6000)),
      introMessage: data.introMessage ? String(data.introMessage).slice(0, 500) : null,
      assistantName: String(data.assistantName || 'Robo').slice(0, 50),
      assistantType: String(data.assistantType || 'robot').slice(0, 50),
      theme: String(data.theme || 'dark').slice(0, 20),
      primaryColor: String(data.primaryColor || '#3b82f6').slice(0, 20),
      siteTitle: String(data.siteTitle || 'Portfolio').slice(0, 200),
      siteDescription: data.siteDescription ? String(data.siteDescription).slice(0, 500) : null,
      showIntro: typeof data.showIntro === 'boolean' ? data.showIntro : true,
    };

    settings = settings
      ? await db.settings.update({ where: { id: settings.id }, data: settingsData })
      : await db.settings.create({ data: settingsData });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
