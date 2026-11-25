import { Card } from "@/components/ui/Card";
import { PostForm } from "@/components/admin/PostForm";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nouveau post</h1>
      <Card className="max-w-2xl">
        <PostForm action={createPost} submitLabel="Créer" />
      </Card>
    </div>
  );
}
