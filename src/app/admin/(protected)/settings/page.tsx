import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/security/admin-session";
import { getAdminSettings } from "@/lib/content/settings";
import { Card } from "@/components/ui/Card";
import { AdminForm } from "@/components/admin/AdminForm";
import { LocalizedField } from "@/components/admin/LocalizedField";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (session?.role !== "admin") redirect("/admin");

  const settings = await getAdminSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Réglages</h1>
      <Card className="max-w-2xl">
        <AdminForm action={updateSettings} submitLabel="Enregistrer">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-semibold">Contact</legend>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="contact.email"
              >
                Email
              </label>
              <input
                id="contact.email"
                name="contact.email"
                type="email"
                required
                defaultValue={settings?.contact.email}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="contact.phone"
              >
                Téléphone
              </label>
              <input
                id="contact.phone"
                name="contact.phone"
                defaultValue={settings?.contact.phone}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="contact.whatsapp"
              >
                WhatsApp
              </label>
              <input
                id="contact.whatsapp"
                name="contact.whatsapp"
                defaultValue={settings?.contact.whatsapp}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <LocalizedField
              name="contact.address"
              label="Adresse (optionnel)"
              defaultValue={settings?.contact.address}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-semibold">Réseaux sociaux</legend>
            {(
              [
                "instagram",
                "facebook",
                "linkedin",
                "youtube",
                "tiktok",
              ] as const
            ).map((network) => (
              <div key={network}>
                <label
                  className="mb-1 block text-sm font-medium capitalize"
                  htmlFor={`social.${network}`}
                >
                  {network}
                </label>
                <input
                  id={`social.${network}`}
                  name={`social.${network}`}
                  defaultValue={settings?.social[network]}
                  dir="ltr"
                  className="w-full rounded-md border border-black/10 p-3"
                />
              </div>
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-semibold">
              Coordonnées bancaires — affichées aux donateurs tant que{" "}
              <code>donationsEnabled</code> est activé
            </legend>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="bank.holder"
              >
                Titulaire du compte
              </label>
              <input
                id="bank.holder"
                name="bank.holder"
                required
                defaultValue={settings?.bank.holder}
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="bank.bankName"
              >
                Banque
              </label>
              <input
                id="bank.bankName"
                name="bank.bankName"
                required
                defaultValue={settings?.bank.bankName}
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="bank.rib"
              >
                RIB
              </label>
              <input
                id="bank.rib"
                name="bank.rib"
                required
                defaultValue={settings?.bank.rib}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="bank.iban"
              >
                IBAN (optionnel)
              </label>
              <input
                id="bank.iban"
                name="bank.iban"
                defaultValue={settings?.bank.iban}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="bank.swift"
              >
                SWIFT (optionnel)
              </label>
              <input
                id="bank.swift"
                name="bank.swift"
                defaultValue={settings?.bank.swift}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 font-semibold">
              Autorisation de collecte (optionnel — docs/OPEN_QUESTIONS.md #2)
            </legend>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="fundraisingAuthorization.number"
              >
                Numéro
              </label>
              <input
                id="fundraisingAuthorization.number"
                name="fundraisingAuthorization.number"
                defaultValue={settings?.fundraisingAuthorization?.number}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="fundraisingAuthorization.date"
              >
                Date
              </label>
              <input
                id="fundraisingAuthorization.date"
                name="fundraisingAuthorization.date"
                defaultValue={settings?.fundraisingAuthorization?.date}
                dir="ltr"
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="fundraisingAuthorization.authority"
              >
                Autorité
              </label>
              <input
                id="fundraisingAuthorization.authority"
                name="fundraisingAuthorization.authority"
                defaultValue={settings?.fundraisingAuthorization?.authority}
                className="w-full rounded-md border border-black/10 p-3"
              />
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="donationsEnabled"
              defaultChecked={settings?.donationsEnabled}
            />
            Activer les dons en ligne (nécessite un RIB confirmé par le
            trésorier — docs/OPEN_QUESTIONS.md)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="joinOpen"
              defaultChecked={settings?.joinOpen ?? true}
            />
            Ouvrir le formulaire &quot;Nous rejoindre&quot;
          </label>
        </AdminForm>
      </Card>
    </div>
  );
}
