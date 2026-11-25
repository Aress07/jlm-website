import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InfoPanel } from "@/components/sections/InfoPanel";
import { LinkButton } from "@/components/ui/Button";

export type ComingSoonKind = "impact" | "news" | "id";

export async function comingSoonMetadata(
  kind: ComingSoonKind,
): Promise<Metadata> {
  const t = await getTranslations("comingSoon");
  // Placeholder pages shouldn't be indexed until the real content exists.
  return { title: t(`${kind}Title`), robots: { index: false } };
}

export async function ComingSoon({
  kind,
  tone = "violet",
}: {
  kind: ComingSoonKind;
  tone?: "violet" | "mint" | "pink";
}) {
  const t = await getTranslations("comingSoon");

  return (
    <InfoPanel
      badge={t("badge")}
      title={t(`${kind}Title`)}
      body={t(`${kind}Body`)}
      tone={tone}
      pulse
    >
      <LinkButton href="/" size="lg">
        {t("backHome")}
      </LinkButton>
      <LinkButton href="/contact" variant="secondary" size="lg">
        {t("contactUs")}
      </LinkButton>
    </InfoPanel>
  );
}
