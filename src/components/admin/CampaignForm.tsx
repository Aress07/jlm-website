import type { Campaign } from "@/lib/validation/schemas";
import { AdminForm, type AdminFormState } from "@/components/admin/AdminForm";
import { LocalizedField } from "@/components/admin/LocalizedField";

function toDateInput(date?: Date): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function CampaignForm({
  action,
  campaign,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  campaign?: Campaign;
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
          disabled={Boolean(campaign)}
          defaultValue={campaign?.slug}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3 disabled:opacity-60"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="kind">
          Type
        </label>
        <select
          id="kind"
          name="kind"
          defaultValue={campaign?.kind ?? "other"}
          className="w-full rounded-md border border-black/10 p-3"
        >
          <option value="ramadan">Ramadan</option>
          <option value="adha">Aïd al-Adha</option>
          <option value="caravan">Caravane</option>
          <option value="well">Puits</option>
          <option value="education">Éducation</option>
          <option value="other">Autre</option>
        </select>
      </div>

      <LocalizedField
        name="title"
        label="Titre"
        defaultValue={campaign?.title}
      />
      <LocalizedField
        name="summary"
        label="Résumé"
        defaultValue={campaign?.summary}
      />
      <LocalizedField
        name="story"
        label="Présentation détaillée"
        defaultValue={campaign?.story}
        multiline
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="goalMAD">
            Objectif (MAD)
          </label>
          <input
            id="goalMAD"
            name="goalMAD"
            type="number"
            min="1"
            required
            defaultValue={campaign?.goalMAD}
            dir="ltr"
            className="w-full rounded-md border border-black/10 p-3"
          />
        </div>
        {campaign && (
          <div>
            <span className="mb-1 block text-sm font-medium">
              Reçu (calculé automatiquement)
            </span>
            <p className="rounded-md border border-black/10 bg-black/5 p-3">
              <bdi dir="ltr">{campaign.receivedMAD} MAD</bdi>
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="startsAt">
            Date de début
          </label>
          <input
            id="startsAt"
            name="startsAt"
            type="date"
            required
            defaultValue={toDateInput(campaign?.startsAt)}
            dir="ltr"
            className="w-full rounded-md border border-black/10 p-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="endsAt">
            Date de fin
          </label>
          <input
            id="endsAt"
            name="endsAt"
            type="date"
            required
            defaultValue={toDateInput(campaign?.endsAt)}
            dir="ltr"
            className="w-full rounded-md border border-black/10 p-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="cover">
          Image de couverture (URL, optionnel)
        </label>
        <input
          id="cover"
          name="cover"
          defaultValue={campaign?.cover}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="breakdown">
          Répartition du budget (JSON, optionnel) — ex :{" "}
          <code>{`[{"label":{"fr":"Nourriture"},"amountMAD":5000}]`}</code>
        </label>
        <textarea
          id="breakdown"
          name="breakdown"
          rows={3}
          dir="ltr"
          defaultValue={
            campaign?.breakdown.length
              ? JSON.stringify(campaign.breakdown, null, 2)
              : ""
          }
          className="w-full rounded-md border border-black/10 p-3 font-mono text-xs"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="inKindAccepted"
          defaultChecked={campaign?.inKindAccepted}
        />
        Accepter les dons en nature
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={campaign?.featured}
        />
        Mettre en avant sur la page Don
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={campaign?.published}
        />
        Publiée
      </label>
    </AdminForm>
  );
}
