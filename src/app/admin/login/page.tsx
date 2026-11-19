"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isFirebaseConfigured()) {
      setError(
        "Firebase n'est pas encore configuré (NEXT_PUBLIC_FIREBASE_* manquants). Voir docs/OPEN_QUESTIONS.md.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(
        getClientAuth(),
        email,
        password,
      );
      const idToken = await credential.user.getIdToken();
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Connexion refusée");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
    } catch {
      setError("Email ou mot de passe incorrect");
      setSubmitting(false);
    }
  }

  return (
    <Container className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <h1 className="mb-4 text-xl font-bold">Administration JLM</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-black/10 p-3"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-black/10 p-3"
            />
          </div>
          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}
          <Button type="submit" loading={submitting} disabled={submitting}>
            Se connecter
          </Button>
        </form>
      </Card>
    </Container>
  );
}
