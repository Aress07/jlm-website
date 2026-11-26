import type { Firestore } from "firebase-admin/firestore";

/**
 * Loads the Firebase Admin SDK only when a database is actually used.
 *
 * A static import pulled firebase-admin (and its auth dependency chain,
 * jwks-rsa -> jose v6, ESM-only) into every server render, even in
 * no-database mode. On Vercel's older Node runtime that `require()` of an
 * ES module crashed every server-rendered page (ERR_REQUIRE_ESM, 26 Nov).
 * Callers must check hasDatabase() first.
 */
export async function adminDb(): Promise<Firestore> {
  const { getAdminDb } = await import("@/lib/firebase/admin");
  return getAdminDb();
}
