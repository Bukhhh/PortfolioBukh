/**
 * In-memory rate limiter for brute-force protection.
 * Tracks failed login attempts per IP and locks out after too many failures.
 */

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

const attemptStore = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;            // max failed tries before lockout
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window
const LOCKOUT_MS = 30 * 60 * 1000; // 30-minute lockout

export function getRateLimitStatus(ip: string): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterMs: 0 };
  }

  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: record.lockedUntil - now,
    };
  }

  // Reset if outside the window
  if (now - record.firstAttempt > WINDOW_MS) {
    attemptStore.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS, retryAfterMs: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { allowed: remaining > 0, remaining, retryAfterMs: 0 };
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attemptStore.set(ip, { count: 1, firstAttempt: now, lockedUntil: null });
    return;
  }

  const newCount = record.count + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : null;
  attemptStore.set(ip, { ...record, count: newCount, lockedUntil });
}

export function clearAttempts(ip: string): void {
  attemptStore.delete(ip);
}
