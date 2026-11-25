import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

// Write permissions follow the master plan's Section 5.1 matrix: `editor`
// may write posts/projects/platforms; `admin` is also required for
// campaigns, settings, and pledge status.
const items = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/posts", label: "Actualités" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/platforms", label: "Plateformes" },
  { href: "/admin/campaigns", label: "Campagnes", adminOnly: true },
  { href: "/admin/pledges", label: "Promesses de don", adminOnly: true },
  { href: "/admin/settings", label: "Réglages", adminOnly: true },
];

export function AdminNav({
  role,
  email,
}: {
  role: "admin" | "editor";
  email: string;
}) {
  return (
    <nav
      className="flex w-56 flex-col gap-1 border-e border-black/10 p-4"
      aria-label="Administration"
    >
      <p className="text-muted mb-4 truncate text-xs">{email}</p>
      {items
        .filter((item) => !item.adminOnly || role === "admin")
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5"
          >
            {item.label}
          </Link>
        ))}
      <div className="mt-4">
        <SignOutButton />
      </div>
    </nav>
  );
}
