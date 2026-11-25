"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";

export type AdminFormState = { error?: string; success?: boolean } | null;

/**
 * Wraps a create/edit Server Action with `useActionState` so a validation
 * error (bad JSON in a nested-array field, a rejected slug, etc.) renders
 * inline instead of Next's generic error page.
 */
export function AdminForm({
  action,
  children,
  submitLabel,
}: {
  action: (
    prevState: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  children: React.ReactNode;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {children}
      {state?.error && (
        <p role="alert" className="text-danger text-sm">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p role="status" className="text-success text-sm">
          Enregistré.
        </p>
      )}
      <Button type="submit" loading={pending} disabled={pending}>
        {submitLabel}
      </Button>
    </form>
  );
}
