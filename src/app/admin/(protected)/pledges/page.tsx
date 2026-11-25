import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/security/admin-session";
import { pledgeSchema } from "@/lib/validation/schemas";
import { setPledgeStatus } from "@/app/admin/(protected)/pledges/actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";

const statusTone = {
  pledged: "beta",
  received: "live",
  cancelled: "in-development",
} as const;

export default async function AdminPledgesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; campaign?: string }>;
}) {
  const session = await getAdminSession();
  if (session?.role !== "admin") {
    redirect("/admin");
  }

  const { status, campaign } = await searchParams;
  const db = getAdminDb();
  let query: FirebaseFirestore.Query = db.collection("pledges");
  if (status) query = query.where("status", "==", status);
  if (campaign) query = query.where("campaignSlug", "==", campaign);

  const snapshot = await query.orderBy("createdAt", "desc").limit(200).get();
  const pledges = snapshot.docs
    .map((doc) => pledgeSchema.safeParse({ id: doc.id, ...doc.data() }))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promesses de don</h1>
        <Button variant="secondary" size="sm">
          {/* A file download, not an app route — next/link isn't appropriate here. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/admin/pledges/export">Exporter en CSV</a>
        </Button>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-start">
              <th className="p-2 text-start">Référence</th>
              <th className="p-2 text-start">Campagne</th>
              <th className="p-2 text-start">Montant</th>
              <th className="p-2 text-start">Paiement</th>
              <th className="p-2 text-start">Donateur</th>
              <th className="p-2 text-start">Statut</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pledges.map((pledge) => (
              <tr key={pledge.id} className="border-b border-black/5">
                <td className="p-2 font-mono">
                  <bdi dir="ltr">{pledge.reference}</bdi>
                </td>
                <td className="p-2">{pledge.campaignSlug}</td>
                <td className="p-2">
                  <bdi dir="ltr">
                    {pledge.amountMAD} {pledge.currencyDisplay}
                  </bdi>
                </td>
                <td className="p-2">
                  {pledge.paymentMethod === "card"
                    ? "Carte (test)"
                    : "Virement"}
                </td>
                <td className="p-2">
                  {pledge.anonymous ? "Anonyme" : pledge.donorName || "—"}
                </td>
                <td className="p-2">
                  <StatusBadge tone={statusTone[pledge.status]}>
                    {pledge.status}
                  </StatusBadge>
                </td>
                <td className="p-2">
                  {pledge.status === "pledged" && (
                    <div className="flex gap-2">
                      <form
                        action={setPledgeStatus.bind(
                          null,
                          pledge.id,
                          "received",
                        )}
                      >
                        <Button type="submit" size="sm">
                          Reçu
                        </Button>
                      </form>
                      <form
                        action={setPledgeStatus.bind(
                          null,
                          pledge.id,
                          "cancelled",
                        )}
                      >
                        <Button type="submit" size="sm" variant="danger">
                          Annuler
                        </Button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pledges.length === 0 && (
          <p className="text-muted p-4">Aucune promesse de don.</p>
        )}
      </Card>
    </div>
  );
}
