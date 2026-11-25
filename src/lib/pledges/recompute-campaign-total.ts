import "server-only";
import { getAdminDb } from "@/lib/firebase/admin";

export async function recomputeCampaignTotal(campaignSlug: string) {
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
