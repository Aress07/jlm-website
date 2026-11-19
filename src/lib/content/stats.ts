import "server-only";
import {
  statItemSchema,
  flagshipActionSchema,
  type StatItem,
  type FlagshipAction,
} from "@/lib/validation/schemas";
import { cachedCollection } from "@/lib/content/cache";

function parseStat(data: Record<string, unknown>): StatItem | null {
  const result = statItemSchema.safeParse(data);
  return result.success ? result.data : null;
}

function parseFlagshipAction(
  data: Record<string, unknown>,
): FlagshipAction | null {
  const result = flagshipActionSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getStats(): Promise<StatItem[]> {
  return cachedCollection("stats", parseStat)();
}

export async function getFlagshipActions(): Promise<FlagshipAction[]> {
  const actions = await cachedCollection(
    "flagshipActions",
    parseFlagshipAction,
  )();
  return actions.sort((a, b) => b.year - a.year);
}
