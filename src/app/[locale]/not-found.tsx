"use client";

import { useTranslations } from "next-intl";
import { InfoPanel } from "@/components/sections/InfoPanel";
import { LinkButton } from "@/components/ui/Button";

/**
 * Client component on purpose: Next.js renders a segment's not-found
 * boundary outside the layout's `setRequestLocale` call, so a server-side
 * `getTranslations` here fell back to reading request headers and made
 * every page under /[locale] dynamic. The client provider already has the
 * messages from the layout.
 */
export default function LocaleNotFound() {
  const t = useTranslations("notFound");

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
