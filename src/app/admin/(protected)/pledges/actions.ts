"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/security/admin-session";

/**
 * Only `admin` may update a pledge's status (master plan Section 5.1).
 * Checked again here even though the UI already hides this from editors —
 * defense in depth for a Server Action, which is reachable directly.
 */
async function requireAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }
  return session;
}

async function recomputeCampaignTotal(campaignSlug: string) {
  const db = getAdminDb();
  const receivedPledges = await db
    .collection("pledges")
    .where("campaignSlug", "==", campaignSlug)
    .where("status", "==", "received")
    .get();
  const total = receivedPledges.docs.reduce(
    (sum, doc) => sum + (doc.data().amountMAD ?? 0),
    0,
  );
  await db
    .collection("campaigns")
    .doc(campaignSlug)
    .update({ receivedMAD: total });
}

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
