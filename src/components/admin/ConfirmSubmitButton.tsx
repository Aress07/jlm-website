"use client";

import { Button } from "@/components/ui/Button";
import type { ComponentProps } from "react";

/** A submit button inside a `<form action={...}>` that confirms before submitting a destructive action. */
export function ConfirmSubmitButton({
  confirmText,
  onClick,
  ...props
}: ComponentProps<typeof Button> & { confirmText: string }) {
  return (
    <Button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
