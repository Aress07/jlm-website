import { getAdminDb } from "@/lib/firebase/admin";
import { platformSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deletePlatform, setPlatformPublished } from "./actions";

export default async function AdminPlatformsPage() {
  const snapshot = await getAdminDb()
    .collection("platforms")
    .orderBy("order", "asc")
    .get();
  const platforms = snapshot.docs
    .map((doc) => platformSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plateformes</h1>
        <LinkButton href="/admin/platforms/new" size="sm">
          Nouvelle plateforme
        </LinkButton>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-start">
              <th className="p-2 text-start">Nom</th>
              <th className="p-2 text-start">Projet</th>
              <th className="p-2 text-start">Statut (externe)</th>
              <th className="p-2 text-start">Publié</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((platform) => (
              <tr key={platform.id} className="border-b border-black/5">
                <td className="p-2">{platform.name.fr}</td>
                <td className="p-2">{platform.projectSlug}</td>
                <td className="p-2">{platform.status}</td>
                <td className="p-2">
                  {platform.published ? "Publié" : "Brouillon"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <LinkButton
                      href={`/admin/platforms/${platform.id}`}
                      size="sm"
                      variant="secondary"
                    >
                      Modifier
                    </LinkButton>
                    <form
                      action={setPlatformPublished.bind(
                        null,
                        platform.id,
                        !platform.published,
                      )}
                    >
                      <Button type="submit" size="sm" variant="secondary">
                        {platform.published ? "Dépublier" : "Publier"}
                      </Button>
                    </form>
                    <form action={deletePlatform.bind(null, platform.id)}>
                      <ConfirmSubmitButton
                        confirmText={`Supprimer la plateforme "${platform.name.fr}" ?`}
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
        {platforms.length === 0 && (
          <p className="text-muted p-4">Aucune plateforme pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
