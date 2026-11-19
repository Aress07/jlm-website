import type { Localized } from "@/lib/validation/schemas";

export type AppLocale = "fr" | "ar" | "en";
export const LOCALES: AppLocale[] = ["fr", "ar", "en"];
export const DEFAULT_LOCALE: AppLocale = "fr";

export type ResolvedText = { text: string; isFallback: boolean };

/**
 * Falls back to French when a locale is missing, per master plan Section 5.
 * Callers show a "Traduction en cours" note when `isFallback` is true.
 */
export function resolveLocalized(
  value: Localized,
  locale: AppLocale,
): ResolvedText {
  if (locale === "fr") return { text: value.fr, isFallback: false };
  const text = value[locale];
  if (text && text.trim().length > 0) return { text, isFallback: false };
  return { text: value.fr, isFallback: true };
}
