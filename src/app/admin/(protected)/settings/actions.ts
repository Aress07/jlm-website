"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/security/require-role";
import { settingsSchema } from "@/lib/validation/schemas";
import type { AdminFormState } from "@/components/admin/AdminForm";
import {
  formBoolean,
  formLocalized,
  formOptionalString,
} from "@/lib/admin/form-data";

export async function updateSettings(
  _prevState: AdminFormState,
  data: FormData,
): Promise<AdminFormState> {
  const session = await requireAdmin();

  const authNumber = formOptionalString(
    data,
    "fundraisingAuthorization.number",
  );
  const authDate = formOptionalString(data, "fundraisingAuthorization.date");
  const authAuthority = formOptionalString(
    data,
    "fundraisingAuthorization.authority",
  );
  const hasAuth = Boolean(authNumber || authDate || authAuthority);

  const fields = {
    contact: {
      email: (data.get("contact.email") ?? "").toString().trim(),
      phone: formOptionalString(data, "contact.phone"),
      whatsapp: formOptionalString(data, "contact.whatsapp"),
      address: formOptionalString(data, "contact.address.fr")
        ? formLocalized(data, "contact.address")
        : undefined,
    },
    social: {
      instagram: formOptionalString(data, "social.instagram"),
      facebook: formOptionalString(data, "social.facebook"),
      linkedin: formOptionalString(data, "social.linkedin"),
      youtube: formOptionalString(data, "social.youtube"),
      tiktok: formOptionalString(data, "social.tiktok"),
    },
    bank: {
      holder: (data.get("bank.holder") ?? "").toString().trim(),
      bankName: (data.get("bank.bankName") ?? "").toString().trim(),
      rib: (data.get("bank.rib") ?? "").toString().trim(),
      iban: formOptionalString(data, "bank.iban"),
      swift: formOptionalString(data, "bank.swift"),
    },
    fundraisingAuthorization: hasAuth
      ? {
          number: authNumber ?? "",
          date: authDate ?? "",
          authority: authAuthority ?? "",
        }
      : undefined,
    donationsEnabled: formBoolean(data, "donationsEnabled"),
    joinOpen: formBoolean(data, "joinOpen"),
  };

  const parsed = settingsSchema.safeParse({
    ...fields,
    updatedBy: session.uid,
    updatedAt: new Date(),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const db = getAdminDb();
  await db.collection("settings").doc("site").set(parsed.data, { merge: true });
  // Mirrors scripts/seed.ts's split: settingsPublic/site carries only the
  // subset safe for client-side reads (no fundraisingAuthorization).
  await db.collection("settingsPublic").doc("site").set(
    {
      contact: parsed.data.contact,
      social: parsed.data.social,
      bank: parsed.data.bank,
      donationsEnabled: parsed.data.donationsEnabled,
      joinOpen: parsed.data.joinOpen,
    },
    { merge: true },
  );

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");

  return { success: true };
}
