import { notFound, redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/security/admin-session";
import { campaignSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { updateCampaign } from "../actions";

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getAdminSession();
  if (session?.role !== "admin") redirect("/admin");

  const { slug } = await params;
  const doc = await getAdminDb().collection("campaigns").doc(slug).get();
  if (!doc.exists) notFound();
  const parsed = campaignSchema.safeParse(doc.data());
  if (!parsed.success) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Modifier la campagne</h1>
      <Card className="max-w-2xl">
        <CampaignForm
          action={updateCampaign.bind(null, slug)}
          campaign={parsed.data}
          submitLabel="Enregistrer"
        />
      </Card>
    </div>
  );
}
