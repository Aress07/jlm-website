import { test, expect } from "@playwright/test";

/**
 * Journey J1 (master plan Section 6): campaign page -> pick amount -> fill
 * pledge form -> confirmation with reference + RIB.
 *
 * This can only pass against a real Firebase project seeded with at least
 * one PUBLISHED campaign and `settings.donationsEnabled: true` — neither is
 * true yet (see docs/OPEN_QUESTIONS.md, risk #2: bank details unconfirmed).
 * Set E2E_CAMPAIGN_SLUG to a real published campaign slug once that exists;
 * until then this test is skipped rather than reported as a false pass.
 */
const campaignSlug = process.env.E2E_CAMPAIGN_SLUG;

test.describe("J1 — donor pledge flow", () => {
  test.skip(
    !campaignSlug,
    "No published campaign configured (set E2E_CAMPAIGN_SLUG)",
  );

  for (const locale of ["fr", "ar"] as const) {
    test(`completes a pledge in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/donate/${campaignSlug}`);

      await page
        .getByRole("button", { name: /100|290|500|1000/ })
        .first()
        .click();
      await page.getByLabel(/email/i).fill("donor@example.com");
      await page
        .getByRole("checkbox", { name: /consent|confidentialité|خصوصية/i })
        .check();
      await page.getByRole("button", { name: /submit|confirm|تأكيد/i }).click();

      await expect(page).toHaveURL(/\/donate\/thanks/);
      await expect(page.getByText(/JLM-\d{4}-[A-Z0-9]{4}/)).toBeVisible();
    });
  }
});
