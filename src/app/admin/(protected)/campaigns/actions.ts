"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/security/require-role";
import { campaignSchema } from "@/lib/validation/schemas";
import type { AdminFormState } from "@/components/admin/AdminForm";
import {
  formBoolean,
  formDate,
  formJson,
  formLocalized,
  formNumber,
  formOptionalString,
  formString,
} from "@/lib/admin/form-data";

function readCampaignFields(data: FormData) {
  return {
    slug: formString(data, "slug"),
    kind: formString(data, "kind"),
    title: formLocalized(data, "title"),
    summary: formLocalized(data, "summary"),
    story: formLocalized(data, "story"),
    goalMAD: formNumber(data, "goalMAD"),
    startsAt: formDate(data, "startsAt"),
    endsAt: formDate(data, "endsAt"),
    featured: formBoolean(data, "featured"),
    cover: formOptionalString(data, "cover"),
    breakdown: formJson(data, "breakdown") ?? [],
    inKindAccepted: formBoolean(data, "inKindAccepted"),
    published: formBoolean(data, "published"),
  };
}

export async function createCampaign(
  _prevState: AdminFormState,
  data: FormData,
): Promise<AdminFormState> {
  const session = await requireAdmin();
  const db = getAdminDb();
  let fields;
  try {
    fields = readCampaignFields(data);
  } catch (error) {
    return { error: (error as Error).message };
  }

  const existing = await db.collection("campaigns").doc(fields.slug).get();
  if (existing.exists) {
    return { error: `A campaign with slug "${fields.slug}" already exists` };
  }

  const parsed = campaignSchema.safeParse({
    ...fields,
    receivedMAD: 0,
    updatedBy: session.uid,
    updatedAt: new Date(),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.collection("campaigns").doc(fields.slug).set(parsed.data);
  revalidatePath("/admin/campaigns");
  revalidatePath("/[locale]/donate", "layout");
  redirect("/admin/campaigns");
}

export async function updateCampaign(
  slug: string,
  _prevState: AdminFormState,
  data: FormData,
): Promise<AdminFormState> {
  const session = await requireAdmin();
  const db = getAdminDb();
  const existing = await db.collection("campaigns").doc(slug).get();
  if (!existing.exists) {
    return { error: "Campaign not found" };
  }

  let fields;
  try {
    fields = readCampaignFields(data);
  } catch (error) {
    return { error: (error as Error).message };
  }

  // receivedMAD is computed from received pledges (recomputeCampaignTotal),
  // never admin-entered — carry the existing value through.
  const parsed = campaignSchema.safeParse({
    ...fields,
    slug,
    receivedMAD: existing.data()!.receivedMAD ?? 0,
    updatedBy: session.uid,
    updatedAt: new Date(),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.collection("campaigns").doc(slug).set(parsed.data);
  revalidatePath("/admin/campaigns");
  revalidatePath("/[locale]/donate", "layout");
  redirect("/admin/campaigns");
}

export async function setCampaignPublished(slug: string, published: boolean) {
  const session = await requireAdmin();
  await getAdminDb()
    .collection("campaigns")
    .doc(slug)
    .update({ published, updatedBy: session.uid, updatedAt: new Date() });
  revalidatePath("/admin/campaigns");
  revalidatePath("/[locale]/donate", "layout");
}

export async function deleteCampaign(slug: string) {
  await requireAdmin();
  await getAdminDb().collection("campaigns").doc(slug).delete();
  revalidatePath("/admin/campaigns");
  revalidatePath("/[locale]/donate", "layout");
}
