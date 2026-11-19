import { cn } from "@/lib/utils/cn";

type PoleTone = "solidarity" | "environment" | "entrepreneurship";
type StatusTone = "live" | "beta" | "in-development" | "prototype";

const poleClasses: Record<PoleTone, string> = {
  solidarity: "bg-pole-solidarity/15 text-pole-solidarity",
  environment: "bg-pole-environment/15 text-pole-environment",
  entrepreneurship: "bg-pole-entrepreneurship/15 text-pole-entrepreneurship",
};

const statusClasses: Record<StatusTone, string> = {
  live: "bg-success/15 text-success",
  beta: "bg-warning/15 text-warning",
  "in-development": "bg-muted/15 text-muted",
  prototype: "bg-primary/15 text-primary",
};

export function PoleBadge({
  tone,
  children,
}: {
  tone: PoleTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
        poleClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: StatusTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
        statusClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
