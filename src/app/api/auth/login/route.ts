import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getRateLimitStatus, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit';
import { setAdminSession } from '@/lib/auth-session';

// ── Input validation ──────────────────────────────────────────────────────────
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  // Strip any null bytes and limit length to prevent injection/overflows
  return value.replace(/\0/g, '').trim().slice(0, 128);
}

// ── Get real client IP (works behind proxies) ─────────────────────────────────
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 1. Rate limit check — before doing anything else
  const rateLimit = getRateLimitStatus(ip);
  if (!rateLimit.allowed) {
    const retryAfterSec = Math.ceil(rateLimit.retryAfterMs / 1000);
    return NextResponse.json(
      {
        error: 'Too many failed attempts. Please try again later.',
        retryAfterSeconds: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // 2. Parse and sanitize body
  let username: string;
  let password: string;
  try {
    const body = await request.json();
    username = sanitize(body.username);
    password = sanitize(body.password);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    );
  }

  // 3. Validate username characters (alphanumeric + underscore only)
  if (!/^[a-zA-Z0-9_]{1,64}$/.test(username)) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  try {
    // 4. Lookup admin — Prisma parameterises queries (no SQL injection possible)
    const admin = await db.admin.findUnique({ where: { username } });

    // 5. Always run bcrypt.compare even on miss, to prevent timing attacks
    const dummyHash = '$2b$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const passwordHash = admin?.passwordHash || dummyHash;
    const valid = await bcrypt.compare(password, passwordHash);

    if (!admin || !valid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          attemptsRemaining: Math.max(0, rateLimit.remaining - 1),
        },
        { status: 401 }
      );
    }

    // 6. Successful login — clear rate limit, set signed session cookie
    clearAttempts(ip);
    await setAdminSession(admin.id);

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (error) {
    console.error('[login] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
