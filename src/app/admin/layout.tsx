import type { Metadata } from "next";
import "@/styles/globals.css";

// Its own root layout (master plan Section 3: `app/admin/` is not
// localized). `noindex` is also set in next.config.ts's headers() for
// every /admin/* response, belt-and-suspenders with this metadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Administration — JLM ENSAM Casablanca",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr">
      <body className="bg-surface min-h-screen">{children}</body>
    </html>
  );
}
