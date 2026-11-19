"use client";

import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { StatusBadge } from "@/components/ui/Badge";
import { trackEvent } from "@/lib/analytics/track";
import type { Platform } from "@/lib/validation/schemas";
import { useTranslations } from "next-intl";

const statusLabelKey: Record<Platform["status"], string> = {
  live: "statusLive",
  beta: "statusBeta",
  "in-development": "statusInDevelopment",
  prototype: "statusPrototype",
};

export function PlatformLink({
  platform,
  locale,
}: {
  platform: Platform;
  locale: AppLocale;
}) {
  const t = useTranslations("platforms");
  const name = resolveLocalized(platform.name, locale);
  const description = resolveLocalized(platform.description, locale);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-medium">{name.text}</p>
        <p className="text-muted text-sm">{description.text}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge tone={platform.status}>
          {t(statusLabelKey[platform.status])}
        </StatusBadge>
        {platform.url && (
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("platform_click", { platform: platform.id })
            }
            className="min-h-11 rounded-md border border-black/10 px-3 py-2 text-sm font-medium hover:bg-black/5"
          >
            {t("openPlatform")}
          </a>
        )}
      </div>
    </div>
  );
}
