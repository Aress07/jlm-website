import { getAdminDb } from "@/lib/firebase/admin";
import { platformSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default async function NewProjectPage() {
  const snapshot = await getAdminDb().collection("platforms").get();
  const platforms = snapshot.docs
    .map((doc) => platformSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nouveau projet</h1>
      <Card className="max-w-2xl">
        <ProjectForm
          action={createProject}
          platforms={platforms}
          submitLabel="Créer"
        />
      </Card>
    </div>
  );
}
