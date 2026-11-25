const locales = [
  { code: "fr", label: "FR", dir: "ltr" as const, required: true },
  { code: "ar", label: "AR", dir: "rtl" as const, required: false },
  { code: "en", label: "EN", dir: "ltr" as const, required: false },
];

/**
 * Three fr/ar/en inputs sharing one `name`, read back by
 * src/lib/admin/form-data.ts's `formLocalized`. fr is required (the content
 * fallback locale, master plan Section 3); ar/en are optional — a missing
 * one falls back to fr on the public site per docs/DECISIONS.md.
 */
export function LocalizedField({
  name,
  label,
  defaultValue,
  multiline = false,
}: {
  name: string;
  label: string;
  defaultValue?: { fr?: string; ar?: string; en?: string };
  multiline?: boolean;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      {locales.map((locale) => (
        <div key={locale.code} className="flex items-start gap-2">
          <span className="text-muted mt-3 w-8 shrink-0 text-xs font-semibold">
            {locale.label}
          </span>
          {multiline ? (
            <textarea
              name={`${name}.${locale.code}`}
              dir={locale.dir}
              required={locale.required}
              rows={4}
              defaultValue={defaultValue?.[locale.code as "fr" | "ar" | "en"]}
              className="w-full rounded-md border border-black/10 p-3"
            />
          ) : (
            <input
              name={`${name}.${locale.code}`}
              dir={locale.dir}
              required={locale.required}
              defaultValue={defaultValue?.[locale.code as "fr" | "ar" | "en"]}
              className="w-full rounded-md border border-black/10 p-3"
            />
          )}
        </div>
      ))}
    </fieldset>
  );
}
