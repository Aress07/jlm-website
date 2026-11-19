import { getLocale, getTranslations } from "next-intl/server";
import { getStats } from "@/lib/content/stats";
import { resolveLocalized } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";
import type { AppLocale } from "@/lib/content/locale";

export async function StatsBand() {
  const stats = await getStats();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");

  if (stats.length === 0) return null;
  const asOf = stats[0]?.asOf;

  return (
    <section
      aria-label={t("polesTitle")}
      className="bg-surface border-y border-black/5 py-10"
    >
      <Container>
        <dl className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
          {stats.map((stat) => {
            const label = resolveLocalized(stat.label, locale);
            return (
              <div key={stat.key}>
                <dd className="text-primary text-3xl font-bold sm:text-4xl">
                  <bdi dir="ltr">
                    {new Intl.NumberFormat(locale).format(stat.value)}
                  </bdi>
                </dd>
                <dt className="text-muted mt-1 text-sm">{label.text}</dt>
              </div>
            );
          })}
        </dl>
        {asOf && (
          <p className="text-muted mt-6 text-center text-sm">
            {t("statsAsOf", { year: asOf })}
          </p>
        )}
      </Container>
    </section>
  );
}
