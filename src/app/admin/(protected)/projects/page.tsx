import { getAdminDb } from "@/lib/firebase/admin";
import { projectSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deleteProject, setProjectPublished } from "./actions";

export default async function AdminProjectsPage() {
  const snapshot = await getAdminDb()
    .collection("projects")
    .orderBy("order", "asc")
    .get();
  const projects = snapshot.docs
    .map((doc) => projectSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projets</h1>
        <LinkButton href="/admin/projects/new" size="sm">
          Nouveau projet
        </LinkButton>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-start">
              <th className="p-2 text-start">Nom</th>
              <th className="p-2 text-start">Pôle</th>
              <th className="p-2 text-start">Ordre</th>
              <th className="p-2 text-start">Statut</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.slug} className="border-b border-black/5">
                <td className="p-2">{project.name.fr}</td>
                <td className="p-2">{project.poleSlug}</td>
                <td className="p-2">{project.order}</td>
                <td className="p-2">
                  {project.published ? "Publié" : "Brouillon"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <LinkButton
                      href={`/admin/projects/${project.slug}`}
                      size="sm"
                      variant="secondary"
                    >
                      Modifier
                    </LinkButton>
                    <form
                      action={setProjectPublished.bind(
                        null,
                        project.slug,
                        !project.published,
                      )}
                    >
                      <Button type="submit" size="sm" variant="secondary">
                        {project.published ? "Dépublier" : "Publier"}
                      </Button>
                    </form>
                    <form action={deleteProject.bind(null, project.slug)}>
                      <ConfirmSubmitButton
                        confirmText={`Supprimer le projet "${project.name.fr}" ?`}
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
        {projects.length === 0 && (
          <p className="text-muted p-4">Aucun projet pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
