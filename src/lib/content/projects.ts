import "server-only";
import {
  projectSchema,
  type Project,
  type PoleSlug,
} from "@/lib/validation/schemas";
import { cachedCollection, cachedDoc } from "@/lib/content/cache";

function parseProject(data: Record<string, unknown>): Project | null {
  const result = projectSchema.safeParse(data);
  return result.success ? result.data : null;
}

export async function getProjects(): Promise<Project[]> {
  const projects = await cachedCollection("projects", parseProject)();
  return projects.filter((p) => p.published).sort((a, b) => a.order - b.order);
}

export async function getProjectsByPole(
  poleSlug: PoleSlug,
): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.poleSlug === poleSlug);
}

export async function getProject(slug: string): Promise<Project | null> {
  const project = await cachedDoc("projects", slug, parseProject)();
  return project?.published ? project : null;
}
