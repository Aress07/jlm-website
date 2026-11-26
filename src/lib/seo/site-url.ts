/**
 * Absolute base URL for canonical links, sitemap, RSS, share links, QR
 * codes, sharing images and JSON-LD.
 *
 * Order: NEXT_PUBLIC_SITE_URL if set (custom domain) → the production
 * domain Vercel provides automatically (VERCEL_PROJECT_PRODUCTION_URL) →
 * localhost for local development.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
