import { getTranslations } from "next-intl/server";
import { InfoPanel } from "@/components/sections/InfoPanel";
import { LinkButton } from "@/components/ui/Button";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <InfoPanel badge="404" title={t("title")} body={t("body")} tone="pink">
      <LinkButton href="/" size="lg">
        {t("backHome")}
      </LinkButton>
      <LinkButton href="/projects" variant="secondary" size="lg">
        {t("seeProjects")}
      </LinkButton>
    </InfoPanel>
  );
}
