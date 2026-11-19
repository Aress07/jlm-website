import { getLocale, getTranslations } from "next-intl/server";
import { getPoles } from "@/lib/content/poles";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Link } from "@/lib/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

const poleAccentVar: Record<string, string> = {
  solidarity: "var(--color-pole-solidarity)",
  environment: "var(--color-pole-environment)",
  "social-entrepreneurship": "var(--color-pole-entrepreneurship)",
};

export async function PoleCards() {
  const poles = await getPoles();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");

  if (poles.length === 0) return null;

  return (
    <section className="py-12">
      <Container>
        <h2 className="mb-6 text-2xl font-bold">{t("polesTitle")}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {poles.map((pole) => {
            const name = resolveLocalized(pole.name, locale);
            const tagline = resolveLocalized(pole.tagline, locale);
            return (
              <Link key={pole.slug} href={`/poles/${pole.slug}`}>
                <Card
                  style={{
                    borderInlineStartColor: poleAccentVar[pole.slug],
                    borderInlineStartWidth: 4,
                  }}
                  className="h-full transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold">{name.text}</h3>
                  <p className="text-muted mt-1 text-sm">{tagline.text}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
