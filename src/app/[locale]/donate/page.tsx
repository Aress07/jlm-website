import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getCampaigns, getActiveCampaigns } from "@/lib/content/campaigns";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/donate/ProgressBar";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = { title: "Donate" };

export default async function DonateListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  const t = await getTranslations("donate");

  const all = await getCampaigns();
  const active = await getActiveCampaigns();
  const activeSlugs = new Set(active.map((c) => c.slug));
  const past = all.filter((c) => !activeSlugs.has(c.slug));

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted mt-4 max-w-prose">{t("intro")}</p>

      <h2 className="mt-10 mb-4 text-xl font-semibold">
        {t("activeCampaigns")}
      </h2>
      {active.length === 0 ? (
        <p className="text-muted">{t("noActiveCampaigns")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {active.map((campaign) => {
            const title = resolveLocalized(campaign.title, locale);
            return (
              <Link key={campaign.slug} href={`/donate/${campaign.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <h3 className="font-semibold">{title.text}</h3>
                  <div className="mt-3">
                    <ProgressBar
                      receivedMAD={campaign.receivedMAD}
                      goalMAD={campaign.goalMAD}
                    />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="mt-10 mb-4 text-xl font-semibold">
            {t("pastCampaigns")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {past.map((campaign) => {
              const title = resolveLocalized(campaign.title, locale);
              return (
                <Card key={campaign.slug}>
                  <h3 className="font-semibold">{title.text}</h3>
                  <p className="text-muted mt-1 text-sm">
                    <bdi dir="ltr">{campaign.receivedMAD}</bdi> MAD
                  </p>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </Container>
  );
}
