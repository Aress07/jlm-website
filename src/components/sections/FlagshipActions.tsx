import { getLocale, getTranslations } from "next-intl/server";
import { getFlagshipActions } from "@/lib/content/stats";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";

export async function FlagshipActions() {
  const actions = await getFlagshipActions();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");

  if (actions.length === 0) return null;
  const format = new Intl.NumberFormat(locale);

  return (
    <section className="bg-surface py-16">
      <Container>
        <h2 className="mb-10 max-w-2xl text-3xl sm:text-4xl">
          {t("flagshipTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const title = resolveLocalized(action.title, locale);
            const summary = resolveLocalized(action.summary, locale);
            return (
              <article
                key={action.slug}
                className="bg-bg flex flex-col gap-5 rounded-3xl p-6 shadow-sm sm:p-8"
              >
                <div>
                  <p className="text-muted text-sm">
                    <bdi dir="ltr">{action.year}</bdi>
                  </p>
                  <h3 className="mt-1 text-2xl">{title.text}</h3>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  {action.investedMAD !== undefined && (
                    <div className="flex flex-col-reverse">
                      <dt className="text-muted text-sm">
                        {t("flagshipInvested")}
                      </dt>
                      <dd className="text-primary text-3xl font-medium">
                        <bdi dir="ltr">
                          {format.format(action.investedMAD)} MAD
                        </bdi>
                      </dd>
                    </div>
                  )}
                  {action.people !== undefined && (
                    <div className="flex flex-col-reverse">
                      <dt className="text-muted text-sm">
                        {t("flagshipPeople")}
                      </dt>
                      <dd className="text-primary text-3xl font-medium">
                        <bdi dir="ltr">{format.format(action.people)}</bdi>
                      </dd>
                    </div>
                  )}
                </dl>
                <p className="text-muted text-sm">{summary.text}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
