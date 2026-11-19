import "server-only";
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Called by the admin panel after a write so a publish shows up on the
 * public site within a minute (master plan Section 8.3).
 */
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (
    !process.env.REVALIDATE_SECRET ||
    secret !== process.env.REVALIDATE_SECRET
  ) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const { tag, path } = await request
    .json()
    .catch(() => ({ tag: null, path: null }));
  if (tag) revalidateTag(tag, { expire: 0 });
  if (path) revalidatePath(path);
  if (!tag && !path) {
    return NextResponse.json({ error: "Provide tag or path" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
