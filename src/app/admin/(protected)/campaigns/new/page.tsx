import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/security/admin-session";
import { Card } from "@/components/ui/Card";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { createCampaign } from "../actions";

export default async function NewCampaignPage() {
  const session = await getAdminSession();
  if (session?.role !== "admin") redirect("/admin");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nouvelle campagne</h1>
      <Card className="max-w-2xl">
        <CampaignForm action={createCampaign} submitLabel="Créer" />
      </Card>
    </div>
  );
}
