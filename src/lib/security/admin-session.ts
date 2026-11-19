import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME =
  process.env.ADMIN_SESSION_COOKIE_NAME ?? "jlm_admin_session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export type AdminSession = {
  uid: string;
  email: string;
  role: "admin" | "editor";
};

/**
 * Verifies the admin session cookie against Firebase Auth (master plan
 * Section 8.6: "session cookie verified on the server for every /admin
 * request"). Returns null for anyone not signed in, or signed in with no
 * role claim at all.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    const role = decoded.role;
    if (role !== "admin" && role !== "editor") return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role };
  } catch {
    return null;
  }
}
