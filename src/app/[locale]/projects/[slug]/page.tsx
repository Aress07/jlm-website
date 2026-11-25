import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getProject } from "@/lib/content/projects";
import { getPlatformsByProject } from "@/lib/content/platforms";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { PlatformLink } from "@/components/sections/PlatformLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: resolveLocalized(project.name, locale as AppLocale).text };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale: localeParam } = await params;
  const locale = localeParam as AppLocale;
  const project = await getProject(slug);
  if (!project) notFound();

  const platforms = await getPlatformsByProject(project.slug);
  const t = await getTranslations("projects");
  const name = resolveLocalized(project.name, locale);
  const tagline = resolveLocalized(project.tagline, locale);
  const description = resolveLocalized(project.description, locale);

  return (
    <Container className="py-12">
      <h1 className="text-4xl sm:text-5xl">{name.text}</h1>
      <p className="text-muted mt-2 text-lg">{tagline.text}</p>
      <p className="mt-4 max-w-prose whitespace-pre-line">{description.text}</p>

      {project.stats.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">{t("statsTitle")}</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {project.stats.map((stat) => (
              <div key={stat.key}>
                <dd className="text-primary text-2xl font-bold">
                  <bdi dir="ltr">
                    {new Intl.NumberFormat(locale).format(stat.value)}
                  </bdi>
                  {stat.unit && (
                    <span className="ms-1 text-base">
                      {resolveLocalized(stat.unit, locale).text}
                    </span>
                  )}
                </dd>
                <dt className="text-muted text-sm">
                  {resolveLocalized(stat.label, locale).text}
                </dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">{t("galleryTitle")}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {project.gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- plain storage URLs, not yet wired to next/image loader config
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square rounded-md object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {platforms.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">{t("platformsTitle")}</h2>
          <div className="flex flex-col gap-2">
            {platforms.map((platform) => (
              <Card key={platform.id}>
                <PlatformLink platform={platform} locale={locale} />
              </Card>
            ))}
          </div>
        </section>
      )}

      <LinkButton href="/donate" className="mt-8">
        {t("supportProject")}
      </LinkButton>
    </Container>
  );
}
