import { getLocale, getTranslations } from "next-intl/server";
import { getStats } from "@/lib/content/stats";
import { resolveLocalized } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";
import type { AppLocale } from "@/lib/content/locale";

const tints = [
  "bg-tint-violet",
  "bg-tint-mint",
  "bg-tint-pink",
  "bg-tint-yellow",
];

export async function StatsBand() {
  const stats = await getStats();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");

  if (stats.length === 0) return null;
  const asOf = stats[0]?.asOf;

  return (
    <section aria-labelledby="stats-title" className="py-16">
      <Container>
        <h2 id="stats-title" className="mb-10 max-w-2xl text-3xl sm:text-4xl">
          {t("statsTitle")}
        </h2>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const label = resolveLocalized(stat.label, locale);
            return (
              <div
                key={stat.key}
                className={`flex flex-col-reverse justify-end gap-2 rounded-3xl p-6 sm:p-8 ${tints[i % tints.length]}`}
              >
                <dt className="text-text/75 text-sm sm:text-base">
                  {label.text}
                </dt>
                <dd className="text-primary text-4xl font-medium sm:text-5xl">
                  <bdi dir="ltr">
                    {new Intl.NumberFormat(locale).format(stat.value)}
                  </bdi>
                </dd>
              </div>
            );
          })}
        </dl>
        {asOf && (
          <p className="text-muted mt-6 text-sm">
            {t("statsAsOf", { year: asOf })}
          </p>
        )}
      </Container>
    </section>
  );
}
