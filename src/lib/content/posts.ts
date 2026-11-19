import "server-only";
import { postSchema, type Post } from "@/lib/validation/schemas";
import { cachedCollection } from "@/lib/content/cache";

function parsePost(data: Record<string, unknown>): Post | null {
  const result = postSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getPosts(): Promise<Post[]> {
  const posts = await cachedCollection("posts", parsePost)();
  const now = Date.now();
  return posts
    .filter((p) => p.published)
    .filter((p) => p.publishAt.getTime() <= now)
    .filter((p) => !p.expiresAt || p.expiresAt.getTime() > now)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.publishAt.getTime() - a.publishAt.getTime();
    });
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
