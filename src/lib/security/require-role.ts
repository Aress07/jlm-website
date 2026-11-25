import "server-only";
import {
  getAdminSession,
  type AdminSession,
} from "@/lib/security/admin-session";

/**
 * Write-permission matrix from the master plan (Section 5.1): `editor` may
 * write posts/projects/platforms/stats/flagship actions/team; `admin` is
 * also required for campaigns, settings, partners, users, and pledge status.
 * Checked again here even though the UI already hides these actions from
 * the wrong role — defense in depth for a Server Action, which is reachable
 * directly.
 */
export async function requireEditorOrAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Forbidden: sign-in required");
  }
  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await requireEditorOrAdmin();
  if (session.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return session;
}
