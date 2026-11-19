import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

// Only lists what's actually built so far. Posts/Campaigns/Projects/
// Platforms/Settings CRUD is T3.6 scope beyond what T3.5 needed — see
// docs/HANDOVER.md for what's still missing before this is the full
// admin panel the master plan's Section 8.6 describes.
const items = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/pledges", label: "Promesses de don", adminOnly: true },
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
