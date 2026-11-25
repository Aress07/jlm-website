import { Container } from "@/components/ui/Container";

type Tone = "violet" | "mint" | "pink";

const toneClasses: Record<Tone, string> = {
  violet: "bg-tint-violet",
  mint: "bg-tint-mint",
  pink: "bg-tint-pink",
};

/**
 * Full-width tinted panel for "coming soon" and "not found" states, so a
 * page that isn't built yet reads as intentional rather than broken.
 */
export function InfoPanel({
  badge,
  title,
  body,
  tone = "violet",
  pulse = false,
  children,
}: {
  badge: string;
  title: string;
  body: string;
  tone?: Tone;
  pulse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div
          className={`relative overflow-hidden rounded-[32px] px-8 py-16 sm:px-16 sm:py-24 ${toneClasses[tone]}`}
        >
          <div
            aria-hidden="true"
            className="bg-accent/40 absolute -end-24 -top-24 h-80 w-80 rounded-full"
          />
          <div
            aria-hidden="true"
            className="bg-primary/10 absolute -start-20 -bottom-28 h-72 w-72 rounded-full"
          />
          <div
            aria-hidden="true"
            className="absolute end-[18%] bottom-10 hidden h-24 w-24 rounded-full bg-white/60 sm:block"
          />
          <div className="relative max-w-2xl">
            <span className="bg-bg text-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <span
                aria-hidden="true"
                className={`bg-accent h-2 w-2 rounded-full ${pulse ? "animate-pulse" : ""}`}
              />
              {badge}
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl">{title}</h1>
            <p className="text-text/75 mt-5 text-lg sm:text-xl">{body}</p>
            {children && (
              <div className="mt-8 flex flex-wrap gap-3">{children}</div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
