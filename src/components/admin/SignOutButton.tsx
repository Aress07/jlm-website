"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    if (isFirebaseConfigured()) {
      await signOut(getClientAuth());
    }
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={handleSignOut}>
      Se déconnecter
    </Button>
  );
}
