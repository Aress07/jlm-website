import { describe, expect, it } from "vitest";
import { resolveLocalized } from "@/lib/content/locale";

describe("resolveLocalized", () => {
  it("returns French directly when locale is fr", () => {
    expect(resolveLocalized({ fr: "Bonjour" }, "fr")).toEqual({
      text: "Bonjour",
      isFallback: false,
    });
  });

  it("returns the Arabic text when present", () => {
    expect(resolveLocalized({ fr: "Bonjour", ar: "مرحبا" }, "ar")).toEqual({
      text: "مرحبا",
      isFallback: false,
    });
  });

  it("falls back to French when Arabic is missing", () => {
    expect(resolveLocalized({ fr: "Bonjour" }, "ar")).toEqual({
      text: "Bonjour",
      isFallback: true,
    });
  });

  it("falls back to French when English is an empty string", () => {
    expect(resolveLocalized({ fr: "Bonjour", en: "" }, "en")).toEqual({
      text: "Bonjour",
      isFallback: true,
    });
  });
});
