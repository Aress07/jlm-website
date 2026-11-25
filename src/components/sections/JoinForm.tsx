"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/ui/Turnstile";
import { trackEvent } from "@/lib/analytics/track";
import type { Pole, PoleSlug } from "@/lib/validation/schemas";

export function JoinForm({ poles }: { poles: Pole[] }) {
  const t = useTranslations("join");
  const locale = useLocale() as "fr" | "ar" | "en";

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [year, setYear] = useState("");
  const [poleInterest, setPoleInterest] = useState<PoleSlug>(
    poles[0]?.slug ?? "solidarity",
  );
  const [motivation, setMotivation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError(t("consentLabel"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          school,
          year,
          poleInterest,
          motivation,
          phone: phone || undefined,
          email: email || undefined,
          locale,
          consent: true,
          turnstileToken: turnstileToken || "dev-no-turnstile-configured",
          website,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error");
        setSubmitting(false);
        return;
      }
      trackEvent("join_submitted", { pole: poleInterest });
      setSuccess(true);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div role="status">
        <h2 className="text-2xl">{t("successTitle")}</h2>
        <p className="text-muted mt-2">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="name">
          {t("nameLabel")}
        </label>
        <input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="school">
          {t("schoolLabel")}
        </label>
        <input
          id="school"
          required
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="year">
          {t("yearLabel")}
        </label>
        <input
          id="year"
          required
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      {poles.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="pole">
            {t("poleLabel")}
          </label>
          <select
            id="pole"
            value={poleInterest}
            onChange={(e) => setPoleInterest(e.target.value as PoleSlug)}
            className="w-full rounded-md border border-black/10 p-3"
          >
            {poles.map((pole) => (
              <option key={pole.slug} value={pole.slug}>
                {pole.name.fr}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="motivation">
          {t("motivationLabel")}
        </label>
        <textarea
          id="motivation"
          required
          rows={4}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="phone">
          {t("phoneLabel")}
        </label>
        <input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          dir="ltr"
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        {t("consentLabel")}
      </label>

      <Turnstile onVerify={setTurnstileToken} />

      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}

      <Button type="submit" loading={submitting} disabled={submitting}>
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
