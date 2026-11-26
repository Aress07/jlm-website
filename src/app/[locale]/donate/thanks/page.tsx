import { getTranslations } from "next-intl/server";
import { getPublicSettings } from "@/lib/content/settings";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { RibBlock } from "@/components/donate/RibBlock";
import { staticPageMetadata } from "@/lib/seo/static-metadata";

// Shows a donor's own reference: never index it.
export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return staticPageMetadata(params, "donateThanks", "/donate/thanks", {
    noindex: true,
  });
}

export default async function DonateThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; campaign?: string; method?: string }>;
}) {
  const { ref, method } = await searchParams;
  const t = await getTranslations("donate");
  const settings = await getPublicSettings();

  return (
    <Container className="py-12">
      <h1 className="text-4xl sm:text-5xl">{t("confirmationTitle")}</h1>

      {ref && (
        <Card className="mt-6 max-w-md">
          <p className="text-muted text-sm">{t("referenceLabel")}</p>
          <p className="text-2xl font-bold">
            <bdi dir="ltr">{ref}</bdi>
          </p>
          <p className="text-muted mt-2 text-sm">{t("referenceInstruction")}</p>
        </Card>
      )}

      {method === "card" ? (
        <Card className="mt-6 max-w-md">
          <p>{t("cardSuccessNotice")}</p>
        </Card>
      ) : (
        settings?.bank && (
          <div className="mt-6 max-w-md">
            <RibBlock
              holder={settings.bank.holder}
              bankName={settings.bank.bankName}
              rib={settings.bank.rib}
              iban={settings.bank.iban}
              copyLabel={t("copy")}
              copiedLabel={t("copied")}
            />
          </div>
        )
      )}
    </Container>
  );
}
