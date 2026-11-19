import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/security/admin-session";
import { Container } from "@/components/ui/Container";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav role={session.role} email={session.email} />
      <Container className="flex-1 py-8">{children}</Container>
    </div>
  );
}
