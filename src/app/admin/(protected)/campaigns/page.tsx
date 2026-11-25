import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/security/admin-session";
import { campaignSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteCampaign, setCampaignPublished } from "./actions";

export default async function AdminCampaignsPage() {
  const session = await getAdminSession();
  if (session?.role !== "admin") {
    redirect("/admin");
  }

  const snapshot = await getAdminDb()
    .collection("campaigns")
    .orderBy("startsAt", "desc")
    .get();
  const campaigns = snapshot.docs
    .map((doc) => campaignSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campagnes</h1>
        <LinkButton href="/admin/campaigns/new" size="sm">
          Nouvelle campagne
        </LinkButton>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-start">
              <th className="p-2 text-start">Titre</th>
              <th className="p-2 text-start">Objectif</th>
              <th className="p-2 text-start">Reçu</th>
              <th className="p-2 text-start">Statut</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.slug} className="border-b border-black/5">
                <td className="p-2">{campaign.title.fr}</td>
                <td className="p-2">
                  <bdi dir="ltr">{campaign.goalMAD} MAD</bdi>
                </td>
                <td className="p-2">
                  <bdi dir="ltr">{campaign.receivedMAD} MAD</bdi>
                </td>
                <td className="p-2">
                  {campaign.published ? "Publiée" : "Brouillon"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <LinkButton
                      href={`/admin/campaigns/${campaign.slug}`}
                      size="sm"
                      variant="secondary"
                    >
                      Modifier
                    </LinkButton>
                    <form
                      action={setCampaignPublished.bind(
                        null,
                        campaign.slug,
                        !campaign.published,
                      )}
                    >
                      <Button type="submit" size="sm" variant="secondary">
                        {campaign.published ? "Dépublier" : "Publier"}
                      </Button>
                    </form>
                    <form action={deleteCampaign.bind(null, campaign.slug)}>
                      <ConfirmSubmitButton
                        confirmText={`Supprimer la campagne "${campaign.title.fr}" ?`}
                        size="sm"
                        variant="danger"
                      >
                        Supprimer
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {campaigns.length === 0 && (
          <p className="text-muted p-4">Aucune campagne pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
