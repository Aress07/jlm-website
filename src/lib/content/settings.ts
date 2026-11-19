import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

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
