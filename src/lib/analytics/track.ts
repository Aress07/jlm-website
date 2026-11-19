"use client";

/**
 * Cookie-less analytics events (master plan Section 8.9). No personal data
 * in events. The actual Cloudflare Web Analytics (or equivalent) wiring is
 * not set up yet — see docs/BACKLOG.md — so this currently only logs in
 * development, giving every call site a stable function to call now.
 */
export type AnalyticsEvent =
  | "page_view"
  | "donate_view"
  | "amount_selected"
  | "pledge_submitted"
  | "rib_copied"
  | "platform_click"
  | "join_submitted"
  | "contact_submitted"
  | "id_view"
  | "vcard_download"
  | "locale_changed"
  | "share_click";

export function trackEvent(
  event: AnalyticsEvent,
  data?: Record<string, string | number>,
) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[analytics]", event, data ?? {});
  }
  // TODO: wire to Cloudflare Web Analytics (or equivalent) once configured.
}
