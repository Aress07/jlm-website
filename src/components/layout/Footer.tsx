import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { siteImages } from "@/lib/content/site-images";

export function Footer() {
  const t = useTranslations("nav");
  const footer = useTranslations("footer");
  const common = useTranslations("common");

  const links: { href: string; label: string }[] = [
    { href: "/join", label: t("join") },
    { href: "/partners", label: t("partners") },
    { href: "/contact", label: t("contact") },
    { href: "/legal/privacy", label: t("legal") },
    { href: "/id", label: t("idCard") },
  ];

  return (
    <footer className="bg-surface border-t border-black/5">
      <Container className="flex flex-col gap-6 py-10 text-sm">
        <p className="text-muted max-w-prose">{footer("missionLine")}</p>
        <nav className="flex flex-wrap gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-muted text-xs">
          {footer("photoCredits")}:{" "}
          {Object.values(siteImages).map((image, i) => (
            <span key={image.src}>
              {i > 0 && " · "}
              <a
                href={image.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {image.author}
              </a>{" "}
              (
              <a
                href={image.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {image.license}
              </a>
              )
            </span>
          ))}
        </p>
        <p className="text-muted">
          &copy; {new Date().getFullYear()} {common("siteName")} —{" "}
          {footer("rightsReserved")}
        </p>
      </Container>
    </footer>
  );
}
