import "server-only";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/security/admin-session";

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET() {
  const session = await getAdminSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const snapshot = await getAdminDb()
    .collection("pledges")
    .orderBy("createdAt", "desc")
    .get();
  const header = [
    "reference",
    "campaignSlug",
    "amountMAD",
    "status",
    "donorName",
    "anonymous",
    "email",
    "phone",
    "kind",
    "createdAt",
  ];
  const rows = snapshot.docs.map((doc) => {
    const d = doc.data();
    return header.map((key) => csvEscape(d[key])).join(",");
  });
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pledges-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
