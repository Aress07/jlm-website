import { useTranslations } from "next-intl";

/**
 * Visible "Traduction en cours" note shown when AR/EN content falls back
 * to French (master plan Section 8.1, risk #8 Accept strategy). The
 * fallback text itself is French, so it carries `lang="fr"`/`dir="ltr"`
 * via the wrapping element at the call site; this note is in the page's
 * own language.
 */
export function FallbackNote({ show }: { show: boolean }) {
  const t = useTranslations("fallback");
  if (!show) return null;
  return (
    <p className="bg-tint-yellow text-text/80 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
      {t("translationInProgress")}
    </p>
  );
}

/** `lang`/`dir` attributes for a text block that may be a French fallback. */
export function fallbackAttrs(isFallback: boolean) {
  return isFallback ? ({ lang: "fr", dir: "ltr" } as const) : {};
}
