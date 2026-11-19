import "server-only";
import { platformSchema, type Platform } from "@/lib/validation/schemas";
import { cachedCollection } from "@/lib/content/cache";

function parsePlatform(data: Record<string, unknown>): Platform | null {
  const result = platformSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getPlatforms(): Promise<Platform[]> {
  const platforms = await cachedCollection("platforms", parsePlatform)();
  return platforms.filter((p) => p.published).sort((a, b) => a.order - b.order);
}

export async function getPlatformsByProject(
  projectSlug: string,
): Promise<Platform[]> {
  const platforms = await getPlatforms();
  return platforms.filter((p) => p.projectSlug === projectSlug);
}
