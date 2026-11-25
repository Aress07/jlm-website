import { getAdminDb } from "@/lib/firebase/admin";
import { postSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deletePost, setPostPublished } from "./actions";

export default async function AdminPostsPage() {
  const snapshot = await getAdminDb()
    .collection("posts")
    .orderBy("publishAt", "desc")
    .get();
  const posts = snapshot.docs
    .map((doc) => postSchema.safeParse(doc.data()))
    .filter((r) => r.success)
    .map((r) => r.data);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Actualités et annonces</h1>
        <LinkButton href="/admin/posts/new" size="sm">
          Nouveau post
        </LinkButton>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-start">
              <th className="p-2 text-start">Titre</th>
              <th className="p-2 text-start">Type</th>
              <th className="p-2 text-start">Publication</th>
              <th className="p-2 text-start">Statut</th>
              <th className="p-2 text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-black/5">
                <td className="p-2">{post.title.fr}</td>
                <td className="p-2">{post.type}</td>
                <td className="p-2">
                  <bdi dir="ltr">{post.publishAt.toLocaleDateString()}</bdi>
                </td>
                <td className="p-2">
                  {post.published ? "Publié" : "Brouillon"}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2">
                    <LinkButton
                      href={`/admin/posts/${post.slug}`}
                      size="sm"
                      variant="secondary"
                    >
                      Modifier
                    </LinkButton>
                    <form
                      action={setPostPublished.bind(
                        null,
                        post.slug,
                        !post.published,
                      )}
                    >
                      <Button type="submit" size="sm" variant="secondary">
                        {post.published ? "Dépublier" : "Publier"}
                      </Button>
                    </form>
                    <form action={deletePost.bind(null, post.slug)}>
                      <ConfirmSubmitButton
                        confirmText={`Supprimer le post "${post.title.fr}" ?`}
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
        {posts.length === 0 && (
          <p className="text-muted p-4">Aucun post pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
