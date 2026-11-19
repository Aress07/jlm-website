import { describe, expect, it } from "vitest";
import {
  formatReference,
  generatePledgeReference,
  randomCode,
} from "@/lib/validation/reference";

describe("randomCode", () => {
  it("never contains ambiguous characters (0/O, 1/I/L)", () => {
    for (let i = 0; i < 500; i++) {
      const code = randomCode();
      expect(code).not.toMatch(/[01OIL]/);
      expect(code).toHaveLength(4);
    }
  });
});

describe("formatReference", () => {
  it("formats as JLM-{year}-{code}", () => {
    expect(formatReference(2027, "A7K3")).toBe("JLM-2027-A7K3");
  });
});

describe("generatePledgeReference", () => {
  it("returns a reference that does not already exist", async () => {
    const existing = new Set<string>();
    const reference = await generatePledgeReference(
      async (ref) => existing.has(ref),
      2027,
    );
    expect(reference).toMatch(/^JLM-2027-[A-Z0-9]{4}$/);
  });

  it("retries on collision until it finds a free code", async () => {
    let calls = 0;
    const reference = await generatePledgeReference(async () => {
      calls += 1;
      return calls <= 3; // first 3 candidates "collide", 4th is free
    }, 2027);
    expect(calls).toBe(4);
    expect(reference).toMatch(/^JLM-2027-[A-Z0-9]{4}$/);
  });

  it("throws rather than loop forever if every candidate collides", async () => {
    await expect(
      generatePledgeReference(async () => true, 2027),
    ).rejects.toThrow(/unique pledge reference/);
  });

  it("never produces the same reference twice across many sequential calls", async () => {
    const used = new Set<string>();
    const exists = async (ref: string) => used.has(ref);
    for (let i = 0; i < 200; i++) {
      const reference = await generatePledgeReference(exists, 2027);
      expect(used.has(reference)).toBe(false);
      used.add(reference);
    }
    expect(used.size).toBe(200);
  });
});
