"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/security/require-role";
import { recomputeCampaignTotal } from "@/lib/pledges/recompute-campaign-total";

export async function setPledgeStatus(
  pledgeId: string,
  status: "received" | "cancelled",
) {
  const session = await requireAdmin();
  const db = getAdminDb();
  const pledgeRef = db.collection("pledges").doc(pledgeId);
  const pledgeDoc = await pledgeRef.get();
  if (!pledgeDoc.exists) throw new Error("Pledge not found");

  await pledgeRef.update({
    status,
    ...(status === "received" ? { receivedAt: new Date() } : {}),
    updatedBy: session.uid,
    updatedAt: new Date(),
  });

  await recomputeCampaignTotal(pledgeDoc.data()!.campaignSlug);

  revalidatePath("/admin/pledges");
  revalidatePath("/[locale]/donate", "layout");
}
