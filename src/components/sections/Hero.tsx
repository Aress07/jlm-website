import { getTranslations } from "next-intl/server";
import { getFeaturedCampaign } from "@/lib/content/campaigns";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export async function Hero() {
  const t = await getTranslations("home");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const campaign = await getFeaturedCampaign();

  return (
    <section className="bg-surface py-16">
      <Container className="flex flex-col items-start gap-4">
        <p className="text-primary text-sm font-medium">{common("motto")}</p>
        <h1 className="text-4xl font-bold sm:text-5xl">{common("siteName")}</h1>
        <p className="text-muted max-w-prose text-lg">{t("heroSubline")}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <LinkButton
            href={campaign ? `/donate/${campaign.slug}` : "/donate"}
            size="lg"
          >
            {nav("donate")}
          </LinkButton>
          <LinkButton href="/projects" variant="secondary" size="lg">
            {t("discoverProjects")}
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
