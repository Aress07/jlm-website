import { notFound } from "next/navigation";
import { getAdminDb } from "@/lib/firebase/admin";
import { postSchema } from "@/lib/validation/schemas";
import { Card } from "@/components/ui/Card";
import { PostForm } from "@/components/admin/PostForm";
import { updatePost } from "../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getAdminDb().collection("posts").doc(slug).get();
  if (!doc.exists) notFound();
  const parsed = postSchema.safeParse(doc.data());
  if (!parsed.success) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Modifier le post</h1>
      <Card className="max-w-2xl">
        <PostForm
          action={updatePost.bind(null, slug)}
          post={parsed.data}
          submitLabel="Enregistrer"
        />
      </Card>
    </div>
  );
}
