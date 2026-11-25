import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { platformSchema, projectSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { PlatformForm } from "@/components/admin/PlatformForm";
import { updatePlatform } from "../actions";

export default async function EditPlatformPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getAdminDb();
  const [doc, projectsSnapshot] = await Promise.all([
    db.collection("platforms").doc(id).get(),
    db.collection("projects").get(),
  ]);
  if (!doc.exists) notFound();
  const parsed = platformSchema.safeParse(doc.data());
  if (!parsed.success) notFound();

  const projects = projectsSnapshot.docs
    .map((d) => projectSchema.safeParse(d.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Modifier la plateforme</h1>
      <Card className="max-w-2xl">
        <PlatformForm
          action={updatePlatform.bind(null, id)}
          platform={parsed.data}
          projects={projects}
          submitLabel="Enregistrer"
        />
      </Card>
    </div>
  );
}
