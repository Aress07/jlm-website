import type { Metadata } from "next";
import Link from "next/link";
import { Figtree, Cairo } from "next/font/google";
import { InfoPanel } from "@/components/sections/InfoPanel";
import "@/styles/globals.css";

// This page bypasses every layout and has no locale context, so it carries
// its own fonts/styles and says the same thing in fr / en / ar.
const latin = Figtree({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});
const arabic = Cairo({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "404 — JLM ENSAM Casablanca",
};

const buttonClasses =
  "inline-flex min-h-11 items-center justify-center rounded-xl px-7 py-3.5 text-lg font-medium";

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${latin.variable} ${arabic.variable}`}>
      <body>
        <InfoPanel
          badge="404"
          title="Cette page est introuvable"
          body="This page can't be found. The link may be wrong or the page may have moved."
          tone="pink"
        >
          <Link
            href="/"
            className={`${buttonClasses} bg-primary text-primary-contrast shadow-sm`}
          >
            Accueil · Home
          </Link>
          <p
            lang="ar"
            dir="rtl"
            className="text-text/75 basis-full pt-2 text-lg"
          >
            تعذّر العثور على هذه الصفحة. قد يكون الرابط غير صحيح.
          </p>
        </InfoPanel>
      </body>
    </html>
  );
}
