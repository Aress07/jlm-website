"use client";

import Script from "next/script";
import { useId } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void },
      ) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget. The script is only loaded on pages that
 * render this (master plan Section 7.11: third-party scripts limited to
 * pages with forms). Without NEXT_PUBLIC_TURNSTILE_SITE_KEY set, this
 * renders nothing and the hidden input stays empty — the server treats a
 * missing secret key the same way (see src/lib/security/turnstile.ts).
 */
export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const id = useId().replace(/:/g, "");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) return null;

  return (
    <>
      <div id={`turnstile-${id}`} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onReady={() => {
          window.turnstile?.render(`#turnstile-${id}`, {
            sitekey: siteKey,
            callback: onVerify,
          });
        }}
      />
    </>
  );
}
