import type { Platform, Project } from "@/lib/validation/schemas";
import { AdminForm, type AdminFormState } from "@/components/admin/AdminForm";
import { LocalizedField } from "@/components/admin/LocalizedField";

export function PlatformForm({
  action,
  platform,
  projects,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  platform?: Platform;
  projects: Project[];
  submitLabel: string;
}) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="id">
          Identifiant
        </label>
        <input
          id="id"
          name="id"
          required
          disabled={Boolean(platform)}
          defaultValue={platform?.id}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3 disabled:opacity-60"
        />
      </div>

      <LocalizedField name="name" label="Nom" defaultValue={platform?.name} />
      <LocalizedField
        name="description"
        label="Description"
        defaultValue={platform?.description}
        multiline
      />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="url">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          defaultValue={platform?.url}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="kind">
            Type
          </label>
          <select
            id="kind"
            name="kind"
            defaultValue={platform?.kind ?? "platform"}
            className="w-full rounded-md border border-black/10 p-3"
          >
            <option value="platform">Plateforme</option>
            <option value="game">Jeu</option>
            <option value="website">Site</option>
            <option value="shop">Boutique</option>
            <option value="prototype">Prototype</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="status">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={platform?.status ?? "in-development"}
            className="w-full rounded-md border border-black/10 p-3"
          >
            <option value="live">En ligne</option>
            <option value="beta">Bêta</option>
            <option value="in-development">En développement</option>
            <option value="prototype">Prototype</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="projectSlug">
          Projet
        </label>
        <select
          id="projectSlug"
          name="projectSlug"
          required
          defaultValue={platform?.projectSlug}
          className="w-full rounded-md border border-black/10 p-3"
        >
          <option value="" disabled>
            Choisir un projet
          </option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name.fr}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="screenshot">
          Capture d&apos;écran (URL, optionnel)
        </label>
        <input
          id="screenshot"
          name="screenshot"
          defaultValue={platform?.screenshot}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="order">
          Ordre d&apos;affichage
        </label>
        <input
          id="order"
          name="order"
          type="number"
          required
          defaultValue={platform?.order ?? 0}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={platform?.published}
        />
        Publié
      </label>
    </AdminForm>
  );
}
