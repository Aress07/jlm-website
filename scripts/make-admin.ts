/**
 * Grants the `admin` custom claim to a Firebase Auth user by email.
 * Usage: pnpm make-admin -- someone@example.com [editor|admin]
 */
import { getAdminAuth } from "@/lib/firebase/admin";

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] ?? "admin") as "admin" | "editor";

  if (!email) {
    console.error("Usage: pnpm make-admin -- <email> [editor|admin]");
    process.exit(1);
  }
  if (role !== "admin" && role !== "editor") {
    console.error('Role must be "admin" or "editor"');
    process.exit(1);
  }

  const user = await getAdminAuth().getUserByEmail(email);
  await getAdminAuth().setCustomUserClaims(user.uid, { role });
  console.log(
    `Granted role "${role}" to ${email} (${user.uid}). They must sign out and back in.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
