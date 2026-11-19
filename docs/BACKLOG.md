# Backlog (post-Gate-3 / out of frozen scope)

Anything requested that is not in `JLM_PHASE3_DEMO_EXECUTION_PLAN.md` Section 2's frozen scope goes here instead of being built. Per risk #1 and #3 (Avoid strategy), nothing here gets built before Gate 3 (27 Nov 2026).

- Online card payment (release 2, master plan Section 8.5).
- Dark mode (master plan Section 7.2 — optional for release 1, build only if time remains after Gate 3).
- Rebuilding any of the 8 external platforms/games.
- Weekly link-checker GitHub Action for the 8 external platforms (master plan Section 8.3, "nice to have" — not required for the Gate 3 AC, just re-test manually before the 20 and 24 Nov checkpoints).
- `stylelint-use-logical` for full raw-CSS logical-property coverage (current lint is a grep-based script; see `docs/DECISIONS.md`).
- Weekly Firestore export to Storage (master plan Section 9, "backups" — Phase 4/launch concern).
- Shared (non-in-memory) rate-limit store for `/api/pledges`, `/api/contact`, `/api/join` if Netlify ever runs them as multiple concurrent function instances — see `src/lib/security/rate-limit.ts`.
- Wire `src/lib/analytics/track.ts` to Cloudflare Web Analytics (or equivalent cookie-less tool, master plan Section 2) — currently a dev-only console.log stub so call sites exist now.
