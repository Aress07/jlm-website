import type { Platform, Project } from "@/lib/validation/schemas";
import { AdminForm, type AdminFormState } from "@/components/admin/AdminForm";
import { LocalizedField } from "@/components/admin/LocalizedField";

export function ProjectForm({
  action,
  project,
  platforms,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  project?: Project;
  platforms: Platform[];
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
          disabled={Boolean(project)}
          defaultValue={project?.slug}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3 disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="poleSlug">
          Pôle
        </label>
        <select
          id="poleSlug"
          name="poleSlug"
          defaultValue={project?.poleSlug ?? "solidarity"}
          className="w-full rounded-md border border-black/10 p-3"
        >
          <option value="solidarity">Solidarité</option>
          <option value="environment">Environnement</option>
          <option value="social-entrepreneurship">
            Entrepreneuriat social
          </option>
        </select>
      </div>

      <LocalizedField name="name" label="Nom" defaultValue={project?.name} />
      <LocalizedField
        name="tagline"
        label="Accroche"
        defaultValue={project?.tagline}
      />
      <LocalizedField
        name="description"
        label="Description"
        defaultValue={project?.description}
        multiline
      />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="logo">
          Logo (URL)
        </label>
        <input
          id="logo"
          name="logo"
          required
          defaultValue={project?.logo}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="cover">
          Image de couverture (URL, optionnel)
        </label>
        <input
          id="cover"
          name="cover"
          defaultValue={project?.cover}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="gallery">
          Galerie (URLs séparées par des virgules)
        </label>
        <input
          id="gallery"
          name="gallery"
          defaultValue={project?.gallery.join(", ")}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      {platforms.length > 0 && (
        <fieldset>
          <legend className="mb-1 text-sm font-medium">
            Plateformes liées
          </legend>
          <div className="flex flex-col gap-1">
            {platforms.map((platform) => (
              <label
                key={platform.id}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  name="platformIds"
                  value={platform.id}
                  defaultChecked={project?.platformIds.includes(platform.id)}
                />
                {platform.name.fr}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="stats">
          Statistiques (JSON, optionnel) — ex :{" "}
          <code>{`[{"key":"beneficiaries","value":120,"label":{"fr":"Bénéficiaires"}}]`}</code>
        </label>
        <textarea
          id="stats"
          name="stats"
          rows={3}
          dir="ltr"
          defaultValue={
            project?.stats.length ? JSON.stringify(project.stats, null, 2) : ""
          }
          className="w-full rounded-md border border-black/10 p-3 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="leads">
          Responsables (JSON, optionnel) — ex :{" "}
          <code>{`[{"name":"...","role":{"fr":"Chef de projet"},"consent":true}]`}</code>
        </label>
        <textarea
          id="leads"
          name="leads"
          rows={3}
          dir="ltr"
          defaultValue={
            project?.leads?.length ? JSON.stringify(project.leads, null, 2) : ""
          }
          className="w-full rounded-md border border-black/10 p-3 font-mono text-xs"
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
          defaultValue={project?.order ?? 0}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published}
        />
        Publié
      </label>
    </AdminForm>
  );
}
