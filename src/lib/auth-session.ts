/**
 * Secure session helpers.
 * Uses an HMAC-signed token stored in an HttpOnly cookie.
 * No plain session IDs — every cookie value is signed and verified.
 */

import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env.SESSION_SECRET;

if (!SECRET || SECRET.length < 32) {
  // Only hard-error at runtime, not import time (build-time safe)
  console.warn('[auth] WARNING: SESSION_SECRET is not set or too short. Set a 32+ char secret in .env!');
}

const COOKIE_NAME = 'admin-session';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function sign(value: string): string {
  const secret = SECRET || 'fallback-dev-secret-do-not-use-in-prod';
  const hmac = createHmac('sha256', secret);
  hmac.update(value);
  return `${value}.${hmac.digest('hex')}`;
}

function verify(signedValue: string): string | null {
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return null;

  const value = signedValue.slice(0, lastDot);
  const expectedSigned = sign(value);

  try {
    const a = Buffer.from(expectedSigned, 'utf8');
    const b = Buffer.from(signedValue, 'utf8');

    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    return value;
  } catch {
    return null;
  }
}

export async function setAdminSession(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  const signed = sign(`${adminId}:${Date.now()}`);

  cookieStore.set(COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getAdminSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME);
  if (!raw?.value) return null;

  const verified = verify(raw.value);
  if (!verified) return null;

  // Value is "adminId:timestamp"
  const colonIdx = verified.indexOf(':');
  if (colonIdx === -1) return null;

  const adminId = verified.slice(0, colonIdx);
  return { adminId };
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
