import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-bg rounded-3xl border border-black/[0.07] p-6 shadow-sm transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}
