import { getAdminDb } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/Card";

export default async function AdminDashboardPage() {
  const db = getAdminDb();
  const [drafts, pledgesToConfirm] = await Promise.all([
    db.collection("posts").where("published", "==", false).count().get(),
    db.collection("pledges").where("status", "==", "pledged").count().get(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tableau de bord</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-3xl font-bold">{drafts.data().count}</p>
          <p className="text-muted text-sm">Brouillons</p>
        </Card>
        <Card>
          <p className="text-3xl font-bold">{pledgesToConfirm.data().count}</p>
          <p className="text-muted text-sm">Promesses de don à confirmer</p>
        </Card>
      </div>
    </div>
  );
}
