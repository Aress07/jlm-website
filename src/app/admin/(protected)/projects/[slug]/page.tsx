import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { platformSchema, projectSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getAdminDb();
  const [doc, platformsSnapshot] = await Promise.all([
    db.collection("projects").doc(slug).get(),
    db.collection("platforms").get(),
  ]);
  if (!doc.exists) notFound();
  const parsed = projectSchema.safeParse(doc.data());
  if (!parsed.success) notFound();

  const platforms = platformsSnapshot.docs
    .map((d) => platformSchema.safeParse(d.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Modifier le projet</h1>
      <Card className="max-w-2xl">
        <ProjectForm
          action={updateProject.bind(null, slug)}
          project={parsed.data}
          platforms={platforms}
          submitLabel="Enregistrer"
        />
      </Card>
    </div>
  );
}
