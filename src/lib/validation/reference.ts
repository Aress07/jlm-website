/**
 * Pledge reference generator. Risk #7 (register): must be collision-proof by
 * design, not caught after the fact. No ambiguous characters (0/O, 1/I/L).
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

export function randomCode(length = CODE_LENGTH): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function formatReference(year: number, code: string): string {
  return `JLM-${year}-${code}`;
}

/**
 * Generates a unique pledge reference by checking each candidate against
 * `exists` (a Firestore lookup in production) and retrying on collision.
 * Throws after MAX_ATTEMPTS so a caller never silently loops forever.
 */
export async function generatePledgeReference(
  exists: (reference: string) => Promise<boolean>,
  year: number = new Date().getFullYear(),
): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = formatReference(year, randomCode());
    if (!(await exists(candidate))) {
      return candidate;
    }
  }
  throw new Error(
    `Could not generate a unique pledge reference after ${MAX_ATTEMPTS} attempts for year ${year}`,
  );
}
