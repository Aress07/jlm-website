import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/content/settings";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const settings = await getPublicSettings();

  return (
    <Container className="py-12">
      <h1 className="text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="text-muted mt-2 max-w-prose">{t("intro")}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <ContactForm />

        <aside className="flex flex-col gap-2 text-sm">
          {settings?.contact.email && <p>{settings.contact.email}</p>}
          {settings?.contact.phone && (
            <p>
              <bdi dir="ltr">{settings.contact.phone}</bdi>
            </p>
          )}
          {settings?.contact.whatsapp && (
            <a
              href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium"
            >
              {t("whatsapp")}
            </a>
          )}
        </aside>
      </div>
    </Container>
  );
}
