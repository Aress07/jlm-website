# Backlog (post-Gate-3 / out of frozen scope)

Anything requested that is not in `JLM_PHASE3_DEMO_EXECUTION_PLAN.md` Section 2's frozen scope goes here instead of being built. Per risk #1 and #3 (Avoid strategy), nothing here gets built before Gate 3 (27 Nov 2026).

- **Real, live online card payment (release 2, master plan Section 8.5).** A test-mode-only Stripe Checkout demo was added 2026-11-20 at explicit user request as an exception to this freeze (see `docs/DECISIONS.md`) — it cannot take real money and is not a substitute for this item. Going live needs a real merchant account the board hasn't set up, and Stripe itself doesn't pay out to Moroccan bank accounts (see `docs/OPEN_QUESTIONS.md`), so launch likely needs CMI or PayPal Business instead.
- Dark mode (master plan Section 7.2 — optional for release 1, build only if time remains after Gate 3).
- Rebuilding any of the 8 external platforms/games.
- Weekly link-checker GitHub Action for the 8 external platforms (master plan Section 8.3, "nice to have" — not required for the Gate 3 AC, just re-test manually before the 20 and 24 Nov checkpoints).
- `stylelint-use-logical` for full raw-CSS logical-property coverage (current lint is a grep-based script; see `docs/DECISIONS.md`).
- Weekly Firestore export to Storage (master plan Section 9, "backups" — Phase 4/launch concern).
- Shared (non-in-memory) rate-limit store for `/api/pledges`, `/api/contact`, `/api/join` if Netlify ever runs them as multiple concurrent function instances — see `src/lib/security/rate-limit.ts`.
- Wire `src/lib/analytics/track.ts` to Cloudflare Web Analytics (or equivalent cookie-less tool, master plan Section 2) — currently a dev-only console.log stub so call sites exist now.
- **CI pipeline (T2.12, never built).** `.github/workflows/` does not exist. Add lint, typecheck, unit, build, Playwright (`tests/e2e/gate3-routes.spec.ts` covers FR+AR with axe), and Lighthouse CI budgets. First Phase 4 task; risk #5 assumed it existed.
- Generated `opengraph-image` per locale (master plan Section 7.12). Needs Arabic font loading inside `ImageResponse`; pages currently fall back to the post, project or campaign cover image when one is set.
- `BreadcrumbList` JSON-LD (master plan Section 7.12).
- Home page "Latest news" section and pinned announcement (master plan Section 7.7, Home items 7). The News module exists now; only the Home teaser is missing.
- Static caravan map on the Impact page (blocked on content, see `docs/OPEN_QUESTIONS.md`).
- All public `[locale]` pages build as dynamic (ƒ) rather than static/ISR, so `/id` is not the "static, under 60 KB" page Section 8.2 describes. Likely needs `setRequestLocale` from next-intl in each layout and page; measure with Lighthouse first.
