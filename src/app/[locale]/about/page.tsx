import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getPoles } from "@/lib/content/poles";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  const t = await getTranslations("about");
  const common = await getTranslations("common");
  const poles = await getPoles();

  return (
    <Container className="py-12">
      <h1 className="text-4xl sm:text-5xl">{t("title")}</h1>
      <p className="text-muted mt-2 text-lg">{common("motto")}</p>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">{t("missionTitle")}</h2>
        <p className="max-w-prose">
          Jeunes Leaders Marocains (JLM) ENSAM Casablanca, active depuis 2014, «
          Champions du Maroc en titre ». « Ce qu&apos;on transmet reste ».
        </p>
      </section>

      {poles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">{t("polesTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {poles.map((pole) => {
              const name = resolveLocalized(pole.name, locale);
              const description = resolveLocalized(pole.description, locale);
              return (
                <Card key={pole.slug}>
                  <h3 className="font-semibold">{name.text}</h3>
                  <p className="text-muted mt-1 text-sm">{description.text}</p>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <LinkButton
        href="https://jlmensamcportfolio.netlify.app"
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        className="mt-8"
      >
        {t("annualReport")}
      </LinkButton>
    </Container>
  );
}
