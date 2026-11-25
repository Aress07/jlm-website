import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";
import { settingsSchema, type Settings } from "@/lib/validation/schemas";

export type PublicSettings = {
  contact: { email: string; phone?: string; whatsapp?: string };
  social: Record<string, string | undefined>;
  bank: {
    holder: string;
    bankName: string;
    rib: string;
    iban?: string;
    swift?: string;
  };
  donationsEnabled: boolean;
  joinOpen: boolean;
};

export async function getPublicSettings(): Promise<PublicSettings | null> {
  try {
    const snapshot = await getAdminDb()
      .collection("settingsPublic")
      .doc("site")
      .get();
    if (!snapshot.exists) return null;
    return snapshot.data() as PublicSettings;
  } catch (error) {
    console.error("[content] Failed to read settingsPublic/site:", error);
    return null;
  }
}

/**
 * The full private settings document, including bank/RIB and fundraising
 * authorization — admin-only (master plan Section 5.1), never exposed to
 * public pages. Use `getPublicSettings` for anything rendered on the site.
 */
export async function getAdminSettings(): Promise<Settings | null> {
  const snapshot = await getAdminDb().collection("settings").doc("site").get();
  if (!snapshot.exists) return null;
  const parsed = settingsSchema.safeParse(snapshot.data());
  return parsed.success ? parsed.data : null;
}
