import "server-only";
import { campaignSchema, type Campaign } from "@/lib/validation/schemas";
import { cachedCollection, cachedDoc } from "@/lib/content/cache";

function parseCampaign(data: Record<string, unknown>): Campaign | null {
  const result = campaignSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getCampaigns(): Promise<Campaign[]> {
  const campaigns = await cachedCollection("campaigns", parseCampaign)();
  return campaigns.filter((c) => c.published);
}

export async function getActiveCampaigns(): Promise<Campaign[]> {
  const campaigns = await getCampaigns();
  const now = Date.now();
  return campaigns.filter(
    (c) => c.startsAt.getTime() <= now && c.endsAt.getTime() >= now,
  );
}

export async function getFeaturedCampaign(): Promise<Campaign | null> {
  const active = await getActiveCampaigns();
  return active.find((c) => c.featured) ?? active[0] ?? null;
}

export async function getCampaign(slug: string): Promise<Campaign | null> {
  const campaign = await cachedDoc("campaigns", slug, parseCampaign)();
  return campaign?.published ? campaign : null;
}
