import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getPublicSettings } from "@/lib/content/settings";
import { isConfigured } from "@/lib/id-card/contact";
import { staticPageMetadata } from "@/lib/seo/static-metadata";

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return staticPageMetadata(params, "legalNotice", "/legal/notice");
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale);
  const t = await getTranslations("legal");
  const email = (await getPublicSettings())?.contact.email;

  return (
    <Container className="py-12">
      <h1 className="text-4xl sm:text-5xl">{t("noticeTitle")}</h1>
      <div className="mt-6 flex max-w-prose flex-col gap-3 text-sm">
        {/* Tracked in docs/OPEN_QUESTIONS.md #1; replace when the board answers. */}
        <p>{t("noticeOrgPending")}</p>
        {isConfigured(email) ? (
          <p>
            {t("noticeContact")}{" "}
            <a href={`mailto:${email}`} className="text-primary underline">
              <bdi dir="ltr">{email}</bdi>
            </a>
          </p>
        ) : (
          <p>{t("noticeContactPending")}</p>
        )}
        <p>
          {t("noticeHostLabel")}{" "}
          <bdi dir="ltr">
            Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA
          </bdi>{" "}
          —{" "}
          <a
            href="https://vercel.com"
            className="text-primary underline"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
        </p>
      </div>
    </Container>
  );
}
