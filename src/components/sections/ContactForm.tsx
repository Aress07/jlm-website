"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/ui/Turnstile";
import { trackEvent } from "@/lib/analytics/track";

type Topic = "general" | "sponsorship" | "press" | "volunteer" | "beneficiary";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale() as "fr" | "ar" | "en";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("general");
  const [message, setMessage] = useState("");
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
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
      trackEvent("contact_submitted", { topic });
      setSuccess(true);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div role="status">
        <h2 className="text-xl font-semibold">{t("successTitle")}</h2>
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
        <label className="mb-1 block text-sm font-medium" htmlFor="email">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-black/10 p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="topic">
          {t("topicLabel")}
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          className="w-full rounded-md border border-black/10 p-3"
        >
          <option value="general">{t("topicGeneral")}</option>
          <option value="sponsorship">{t("topicSponsorship")}</option>
          <option value="press">{t("topicPress")}</option>
          <option value="volunteer">{t("topicVolunteer")}</option>
          <option value="beneficiary">{t("topicBeneficiary")}</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="message">
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
