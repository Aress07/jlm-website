"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("locale");

  return (
    <nav
      aria-label={t("switchLabel")}
      className="flex items-center gap-1 text-sm"
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}${pathname === "/" ? "" : pathname}`}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "rounded-md px-2 py-1 font-medium",
            loc === locale
              ? "bg-primary/10 text-primary"
              : "text-muted hover:text-text",
          )}
        >
          {t(loc)}
        </Link>
      ))}
    </nav>
  );
}
