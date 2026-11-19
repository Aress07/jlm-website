import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Legal notice" };

export default async function LegalNoticePage() {
  const t = await getTranslations("legal");

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-bold">{t("noticeTitle")}</h1>
      <div className="mt-6 flex max-w-prose flex-col gap-2 text-sm">
        <p>
          TODO(board): nom légal exact de l&apos;association et adresse du
          siège.
        </p>
        <p>TODO(board): directeur de publication.</p>
        <p>Hébergement : Netlify, Inc.</p>
        <p>
          Voir <code>docs/OPEN_QUESTIONS.md</code> (question 1) — ces
          informations doivent venir du bureau avant publication.
        </p>
      </div>
    </Container>
  );
}
