import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-surface rounded-lg border border-black/5 p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
