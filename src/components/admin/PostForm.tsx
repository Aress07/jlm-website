import type { Post } from "@/lib/validation/schemas";
import { AdminForm, type AdminFormState } from "@/components/admin/AdminForm";
import { LocalizedField } from "@/components/admin/LocalizedField";

function toDatetimeLocal(date?: Date): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  post?: Post;
  submitLabel: string;
}) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          disabled={Boolean(post)}
          defaultValue={post?.slug}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3 disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={post?.type ?? "news"}
          className="w-full rounded-md border border-black/10 p-3"
        >
          <option value="news">Actualité</option>
          <option value="announcement">Annonce</option>
          <option value="ad">Publicité (sponsorisé)</option>
          <option value="volunteer-call">Appel à bénévoles</option>
          <option value="report">Rapport</option>
        </select>
      </div>

      <LocalizedField name="title" label="Titre" defaultValue={post?.title} />
      <LocalizedField
        name="excerpt"
        label="Extrait"
        defaultValue={post?.excerpt}
        multiline
      />
      <LocalizedField
        name="body"
        label="Contenu (HTML autorisé : p, h2, h3, ul, ol, li, strong, em, a, blockquote, img, figure, figcaption)"
        defaultValue={post?.body}
        multiline
      />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="cover">
          Image de couverture (URL)
        </label>
        <input
          id="cover"
          name="cover"
          defaultValue={post?.cover}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="tags">
          Tags (séparés par des virgules)
        </label>
        <input
          id="tags"
          name="tags"
          defaultValue={post?.tags.join(", ")}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="projectSlug">
          Projet lié (slug, optionnel)
        </label>
        <input
          id="projectSlug"
          name="projectSlug"
          defaultValue={post?.projectSlug}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="sponsorId">
          Sponsor (id, optionnel — pour les publicités)
        </label>
        <input
          id="sponsorId"
          name="sponsorId"
          defaultValue={post?.sponsorId}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="publishAt">
            Date de publication
          </label>
          <input
            id="publishAt"
            name="publishAt"
            type="datetime-local"
            required
            defaultValue={
              toDatetimeLocal(post?.publishAt) || toDatetimeLocal(new Date())
            }
            dir="ltr"
            className="w-full rounded-md border border-black/10 p-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="expiresAt">
            Date d&apos;expiration (optionnel)
          </label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="datetime-local"
            defaultValue={toDatetimeLocal(post?.expiresAt)}
            dir="ltr"
            className="w-full rounded-md border border-black/10 p-3"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="pinned" defaultChecked={post?.pinned} />
        Épingler en haut de liste
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
        />
        Publié
      </label>
    </AdminForm>
  );
}
