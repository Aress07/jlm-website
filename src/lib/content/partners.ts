import "server-only";
import { partnerSchema, type Partner } from "@/lib/validation/schemas";
import { cachedCollection } from "@/lib/content/cache";

function parsePartner(data: Record<string, unknown>): Partner | null {
  const result = partnerSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getPartners(): Promise<Partner[]> {
  const partners = await cachedCollection("partners", parsePartner)();
  return partners.filter((p) => p.published).sort((a, b) => a.order - b.order);
}
