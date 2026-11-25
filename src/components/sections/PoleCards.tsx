import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getPoles } from "@/lib/content/poles";
import { resolveLocalized, type AppLocale } from "@/lib/content/locale";
import { poleImageKey, poleTint, siteImages } from "@/lib/content/site-images";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";

export async function PoleCards() {
  const poles = await getPoles();
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home");
  const imagery = await getTranslations("imagery");

  if (poles.length === 0) return null;

  return (
    <section className="py-16">
      <Container>
        <h2 className="mb-10 max-w-2xl text-3xl sm:text-4xl">
          {t("polesTitle")}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {poles.map((pole) => {
            const name = resolveLocalized(pole.name, locale);
            const tagline = resolveLocalized(pole.tagline, locale);
            const imageKey = poleImageKey[pole.slug];
            return (
              <Link
                key={pole.slug}
                href={`/poles/${pole.slug}`}
                className="group block"
              >
                <article
                  className={`h-full overflow-hidden rounded-3xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${poleTint[pole.slug] ?? "bg-surface"}`}
                >
                  {imageKey && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={siteImages[imageKey].src}
                        alt={imagery(imageKey)}
                        fill
                        sizes="(min-width: 768px) 380px, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl">{name.text}</h3>
                    <p className="text-text/75 mt-2">{tagline.text}</p>
                    <span
                      aria-hidden="true"
                      className="bg-bg mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rtl:rotate-180"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
