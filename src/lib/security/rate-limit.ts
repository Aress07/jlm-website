import "server-only";

/**
 * In-memory IP rate limiter (master plan Section 8.5/8.7: 5 pledges per 10
 * minutes). Good enough for a single long-lived server process; resets on
 * redeploy and does not share state across multiple instances. If Vercel
 * runs this as several concurrent function instances, swap for a shared
 * store (e.g. a Firestore counter doc) — tracked in docs/BACKLOG.md.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > max;
}

export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
