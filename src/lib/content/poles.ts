import "server-only";
import { poleSchema, type Pole } from "@/lib/validation/schemas";
import { cachedCollection, cachedDoc } from "@/lib/content/cache";

function parsePole(data: Record<string, unknown>): Pole | null {
  const result = poleSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getPoles(): Promise<Pole[]> {
  const poles = await cachedCollection("poles", parsePole)();
  return poles.sort((a, b) => a.order - b.order);
}

export async function getPole(slug: string): Promise<Pole | null> {
  return cachedDoc("poles", slug, parsePole)();
}
