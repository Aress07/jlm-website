import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main-content"
      className="focus:bg-primary focus:text-primary-contrast sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
    >
      {t("skipToContent")}
    </a>
  );
}
