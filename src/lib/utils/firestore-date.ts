/**
 * A Firestore field written from a JS `Date` comes back as a `Timestamp`
 * (with `.toMillis()`/`.toDate()`); one written from a plain string (as
 * `scripts/seed.ts` does for the JSON seed files) comes back as that same
 * string. Both show up in this codebase, so reads need to handle either.
 */
export function toMillis(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "object" && value !== null && "toMillis" in value) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const ms = new Date(value).getTime();
    return Number.isNaN(ms) ? null : ms;
  }
  return null;
}

export function toJsDate(value: unknown): Date | undefined {
  const ms = toMillis(value);
  return ms === null ? undefined : new Date(ms);
}
