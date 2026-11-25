import { getTranslations } from "next-intl/server";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export async function FinalCta() {
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");

  return (
    <section className="py-16">
      <Container>
        <div className="bg-primary relative overflow-hidden rounded-[32px] px-8 py-14 sm:px-16 sm:py-20">
          <div
            aria-hidden="true"
            className="bg-accent/25 absolute -end-20 -top-20 h-72 w-72 rounded-full"
          />
          <div
            aria-hidden="true"
            className="absolute -start-16 -bottom-24 h-64 w-64 rounded-full bg-white/10"
          />
          <h2 className="relative max-w-2xl text-3xl text-white sm:text-5xl">
            {t("finalCtaTitle")}
          </h2>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <LinkButton href="/donate" variant="accent" size="lg">
              {nav("donate")}
            </LinkButton>
            <LinkButton href="/join" variant="secondary" size="lg">
              {nav("join")}
            </LinkButton>
            <LinkButton
              href="/contact"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/15"
            >
              {nav("contact")}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
