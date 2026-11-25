import { getAdminDb } from "@/lib/firebase/admin";
import { projectSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { PlatformForm } from "@/components/admin/PlatformForm";
import { createPlatform } from "../actions";

export default async function NewPlatformPage() {
  const snapshot = await getAdminDb().collection("projects").get();
  const projects = snapshot.docs
    .map((doc) => projectSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nouvelle plateforme</h1>
      <Card className="max-w-2xl">
        <PlatformForm
          action={createPlatform}
          projects={projects}
          submitLabel="Créer"
        />
      </Card>
    </div>
  );
}
