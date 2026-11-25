import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-contrast hover:brightness-110 shadow-sm",
  // Mint accent: for buttons sitting on the indigo CTA band.
  accent: "bg-accent text-accent-contrast hover:brightness-95",
  secondary:
    "bg-bg text-text border border-black/10 hover:bg-surface hover:border-black/20",
  ghost: "bg-transparent text-text hover:bg-black/5",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none min-h-11 min-w-11 active:scale-[0.98]";

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
