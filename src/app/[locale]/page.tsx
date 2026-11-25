import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { PoleCards } from "@/components/sections/PoleCards";
import { FlagshipActions } from "@/components/sections/FlagshipActions";
import { FinalCta } from "@/components/sections/FinalCta";
import { getProjects } from "@/lib/content/projects";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Link } from "@/lib/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "JLM ENSAM Casablanca",
};

export default async function HomePage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");
  const projects = (await getProjects()).slice(0, 6);

  return (
    <>
      <Hero />
      <StatsBand />
      <PoleCards />
      <FlagshipActions />
      {projects.length > 0 && (
        <section className="py-16">
          <Container>
            <h2 className="mb-10 max-w-2xl text-3xl sm:text-4xl">
              {t("featuredProjectsTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const name = resolveLocalized(project.name, locale);
                const tagline = resolveLocalized(project.tagline, locale);
                return (
                  <Link key={project.slug} href={`/projects/${project.slug}`}>
                    <Card className="h-full hover:-translate-y-1 hover:shadow-md">
                      <h3 className="text-xl">{name.text}</h3>
                      <p className="text-muted mt-2 text-sm">{tagline.text}</p>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}
      <FinalCta />
    </>
  );
}
