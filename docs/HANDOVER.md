# Handover note

Updated at every gate and whenever the PM role rotates (risk #13). Read this before picking up the project.

## 2026-11-19 — foundation + Phase 3 build started (this session)

**What exists:** repo scaffolded from scratch (Next.js 16 App Router, TypeScript, Tailwind v4, `next-intl`, Firebase client + Admin SDK, zod). See `docs/DECISIONS.md` for why — the repo was empty when this session started despite the plan assuming Gate 2 was passed.

**What to check next session:** run `git log --oneline` and read this file's latest entry before doing anything; it will say exactly which T-numbered task was last completed and demonstrated, and which is in progress.

**Known gaps that are not code problems:** see `docs/OPEN_QUESTIONS.md` — bank details, Arabic native review, legal/CNDP contact, and brand colors all need a real person on the JLM board or team, not more development time.

## 2026-11-19 — T3.5 (donation module) + minimal admin panel done

Pledge flow (campaign page → amount/in-kind → form → `/api/pledges` → thank-you with reference + RIB) works end to end against whatever Firestore project is configured; it's just gated `donationsEnabled: false` so nothing can actually be donated until the board confirms bank details. Admin login (Firebase Auth + session cookie) and a Pledges table (mark received/cancelled, CSV export) exist, but that's the only admin screen — Posts/Campaigns/Projects/Platforms/Settings CRUD (the rest of T3.6) is not built yet.

**Not done, and genuinely blocked without a real Firebase project:** nothing in this repo has been run against real data. `pnpm seed`, the admin login, and the Playwright J1 test all need `FIREBASE_ADMIN_*`/`NEXT_PUBLIC_FIREBASE_*` env vars pointing at an actual Firebase project before they can be exercised for real — see `.env.example`.

**Still open from the Phase 3 task list (T3.1–T3.11):** core pages (About/Contact/Join/Partners/Legal), pôle/project/platform pages, news/ads, the rest of the admin panel, multilingual completion review, Impact page, SEO/sharing metadata, final content load, and the Gate 3 pack.
