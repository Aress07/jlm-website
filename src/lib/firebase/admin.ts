import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

// No `import "server-only"` here, unlike the rest of src/lib — that package
// unconditionally throws outside Next's own build, which broke `pnpm seed`
// and `pnpm make-admin` (both import this module directly via tsx). This
// Admin SDK bootstrap can't run client-side anyway (firebase-admin needs
// Node built-ins a browser bundle can't resolve), so the extra guard wasn't
// adding real protection — see docs/DECISIONS.md.

/**
 * Without real credentials (no .env.local, no emulator) this still returns
 * an App — against a placeholder project id — so `pnpm dev`/`pnpm build`
 * don't hard-crash before a single page renders. Calls against it fail at
 * the network layer, and `src/lib/content/cache.ts` catches that and
 * returns empty data so pages fall back to their empty state (Section 7.8)
 * instead of a 500. Real credentials are still required for any real data.
 */
function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  if (
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||
    process.env.FIRESTORE_EMULATOR_HOST
  ) {
    return initializeApp({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? "jlm-dev",
    });
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[firebase/admin] Missing Firebase Admin credentials — running with no backing project. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY for real data.",
    );
    // A stub credential that fails fast (no network lookup for Application
    // Default Credentials), so calls error out immediately instead of
    // hanging on a metadata-server timeout.
    return initializeApp({
      projectId: "jlm-unconfigured",
      credential: {
        getAccessToken: () =>
          Promise.reject(
            new Error("Firebase Admin is not configured (no credentials set)"),
          ),
      },
    });
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminApp = getAdminApp();

// `getFirestore`/`getAuth`/`getStorage` validate credentials eagerly and
// throw synchronously, which would crash the module on import when Firebase
// isn't configured yet. Lazy getters let callers (src/lib/content/cache.ts)
// catch the failure per-call and fall back to empty data instead.
let _db: ReturnType<typeof getFirestore> | undefined;
export function getAdminDb() {
  if (!_db) {
    _db = getFirestore(adminApp);
    // Every optional schema field (donorName, cover, screenshot, ...) is
    // read as `undefined` when absent, and the Admin SDK rejects that in a
    // `.set()`/`.update()` payload by default — this was never exercised
    // against a real/emulated project before, so it went unnoticed.
    try {
      _db.settings({ ignoreUndefinedProperties: true });
    } catch {
      // Already configured: Turbopack's dev hot-reload resets this
      // module's `_db` binding to undefined on every edit, but the
      // underlying Firestore client — keyed by the Admin App singleton,
      // which does survive the reload — stays the same instance, and
      // `.settings()` throws on a second call to it. Harmless to ignore.
    }
  }
  return _db;
}

let _auth: ReturnType<typeof getAuth> | undefined;
export function getAdminAuth() {
  if (!_auth) _auth = getAuth(adminApp);
  return _auth;
}

let _storage: ReturnType<typeof getStorage> | undefined;
export function getAdminStorage() {
  if (!_storage) _storage = getStorage(adminApp);
  return _storage;
}
