# JLM ENSAM Casablanca Website — Phase 3 Build Execution Plan (Gate 3 Demo)

Version 1.0, written 2026-11-13. Audience: Claude Code, and the 4-person student team (PM for this phase: Member C).
Status today: **14 days to Gate 3 (27 Nov 2026)**. This file is the single source of truth for what gets built, in what order, and what "done" means, between now and the demo. It narrows `JLM_WEBSITE_EXECUTION_PLAN.md` Section 11 ("Phase 3: Build", tasks T3.1–T3.11) into a day-by-day plan, and it folds in the Phase 3 risk register (`JLM_Risk_Register_Phase3.xlsx`) so the highest-severity risks are addressed, not just logged.

---

## 0. How to use this file (instructions for Claude Code)

1. Read this file, then `JLM_WEBSITE_EXECUTION_PLAN.md` (full spec: data model, journeys, UI/UX, security) and `JLM_Risk_Register_Phase3.xlsx` (what could go wrong and the agreed response) before writing code for Phase 3.
2. Work the tasks in the order given in Section 4 (Day-by-day plan). Each task carries its own acceptance criterion (AC); do not mark a task done until its AC is demonstrated, not just coded.
3. Every task that touches a **Red** risk in the register must apply that risk's action plan, not just build the feature. Section 6 lists these explicitly — treat them as part of the task's AC, not an optional extra.
4. Freeze scope now. Nothing outside Section 2 ("Frozen Gate 3 scope") gets built before 27 Nov, even if someone asks — see risk #1 and #3 in the register (Avoid strategy). Log any new request in `docs/BACKLOG.md` instead.
5. Commit per task, Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), one pull request per task, tick the checkbox here when merged and its AC is demonstrated.
6. Never invent JLM facts. Missing content is `TODO(board)` + an entry in `docs/OPEN_QUESTIONS.md`, never a guess.
7. Never hardcode secrets, RIB, phone numbers or emails — env vars or the Firestore `settings` document only.
8. Test in `fr` **and** `ar` for every page you touch. RTL is not a final pass; it's part of building the page (risk #5).

---

## 1. Where we stand (13 Nov 2026)

- Gate 2 (6 Nov) is passed: foundation, i18n, Firebase, design system and the static Home/ID card exist on staging (per `JLM_WEBSITE_EXECUTION_PLAN.md` Phase 2 exit criteria).
- Phase 3 ("Build", 9–27 Nov) is already 4 days in. **14 calendar days remain to Gate 3.**
- Phase 3 PM: Member C. Keep the handover note (`docs/HANDOVER.md`) current — this is itself risk #13 in the register (rotating-PM context loss), Mitigate strategy.
- Reference documents already produced: `JLM_WEBSITE_EXECUTION_PLAN.md` (full spec, Phase 3 = T3.1–T3.11), `JLM_Risk_Register_Phase3.xlsx` (14 risks, highest severity first).

---

## 2. Frozen Gate 3 scope — what the demo must show, and nothing more

**In scope (build this):**

| Task | What | Journey it serves |
| --- | --- | --- |
| T3.1 | Core pages: About, Contact, Join, Partners, Legal | J2, J3 |
| T3.2 | Pôle + 9 project pages (one template, real content) | J4, J7 |
| T3.3 | Platforms hub (8 platforms + 3 prototypes) | J4, J7 |
| T3.4 | News and ads module | — |
| T3.5 | Donation module (pledges, no card payment) | J1 — highest priority |
| T3.6 | Admin panel (auth, roles, CRUD, LocalizedField) | J6 |
| T3.7 | Multilingual completion (FR/AR/EN, native-reviewed) | all |
| T3.8 | Impact page and counters | — |
| T3.9 | SEO and sharing metadata | — |
| T3.10 | Final content load | all |
| T3.11 | Gate 3 pack (beta demo + status) | — |

**Explicitly out of scope for Gate 3** (do not build before 27 Nov, per the master plan's Section 1.2 and the Avoid-strategy risks #1, #3, #7 in the register):

- Online card payment (release 2).
- Dark mode.
- Any feature not already listed in T3.1–T3.10 above, however reasonable it sounds when someone asks this week. Log it in `docs/BACKLOG.md` and move on.
- Rebuilding any of the 8 external platforms or games — link to them only.

If the board or a project lead requests something new between now and 27 Nov, that is risk #3 (scope creep) firing — apply its Avoid action: log it, do not build it, revisit after Gate 3.

---

## 3. Gate 3 success criteria (what "the demo works" means)

Lift directly from the master plan's Gate 3 exit checklist — these are the bar, not a wish list:

1. All 3 pôle pages and 9 project pages render on staging, in FR and AR, with real seed content (no visible `TODO(board)` outside the open-questions list).
2. The Platforms hub links to all 8 platforms and 3 prototypes correctly.
3. A member can publish a post through the admin panel and it appears on the live site within a minute.
4. A full donation pledge can be created end to end (J1: campaign page → amount → form → confirmation with reference code → RIB block) and then marked "received" in the admin panel, updating the progress bar.
5. No blocking bug on the main journeys (J1, J5, J6 — the three the master risk table already flags as the ones to protect if time runs short).
6. Lighthouse mobile budgets (Section 7.11 of the master plan) are met on at least Home, a Project page, the Campaign page and `/id`.

---

## 4. Day-by-day plan (13 Nov → 27 Nov)

Dates are Casablanca time. This is the working breakdown of T3.1–T3.11; adjust day-to-day but do not slip the two checkpoints marked **hard**.

| Dates | Focus | Tasks | Notes |
| --- | --- | --- | --- |
| Thu 13 – Fri 14 | Donation module core + banking details lock | T3.5 (build), confirm RIB/IBAN & reference-code format with treasurer | Risk #2 — **hard checkpoint: banking details confirmed by 14 Nov**, otherwise T3.5 risks rework |
| Thu 13 – Sun 16 | Pôle + project pages, Platforms hub | T3.2, T3.3 | One template for all 9 projects; use seed content from the master plan Section 15.1 while final text is pending |
| Fri 14 – Mon 17 | Admin panel | T3.6 | Rules-unit-testing suite (risk #6) must pass **before** T3.6 is connected to real data, not after |
| Sat 15 – Tue 18 | Core pages, legal, content deadline | T3.1, internal content deadline for the 9 project leads | **Hard checkpoint: 20 Nov is the absolute content deadline** (risk #4) — anything not in by then falls back to the 2026 annual-report text |
| Mon 17 – Wed 19 | RTL continuous QA, reference-code uniqueness | Ongoing check on T3.2/T3.3/T3.5, unit test for the pledge reference generator | Risk #5 (RTL bugs found late) and risk #7 (reference collision) — both are Avoid/Mitigate-by-design, not a Phase 4 fix |
| Tue 18 – Thu 20 | News/ads, Impact page, SEO | T3.4, T3.8, T3.9 | |
| Wed 19 – Fri 21 | Form abuse testing, Morocco data-protection question handed off | Anti-spam/rate-limit test (risk #9), send the data-protection question to JLM's legal contact (risk #10, Transfer) | Don't let this slip past 23 Nov — it has a Phase 4/launch consequence, not just a Phase 3 one |
| Thu 20 – Sat 22 | Arabic review | T3.7 — send AR strings for native review now | Risk #8 (Accept strategy): if review isn't back by 24 Nov, ship with the French-fallback note visible, do not block the demo on it |
| Sat 22 – Tue 24 | Final content load, platform link re-check | T3.10, re-test all 8 external links | Risk #11 (Accept) and risk #12 (Mitigate) |
| Wed 25 | Full Playwright run (J1–J7), Lighthouse CI, accessibility pass | — | Freeze the build; only bug fixes after this point |
| Thu 26 | Gate 3 pack assembled, dry run of the demo script (Section 7) | T3.11 | |
| **Fri 27** | **Gate 3** | — | Demo day |

---

## 5. Per-task instructions

Each task below is the Phase 3 master-plan task (same ID, same acceptance criterion), with the extra steps the risk register adds. Implement in the order of Section 4, not necessarily this list order.

### T3.5 — Donation module (do this first; highest-priority journey, highest-severity open risk)

1. Before writing the pledge API route, get the real RIB/IBAN, bank name and the reference-code convention confirmed with JLM's treasurer (risk #2). Do not build against assumed values.
2. Build `POST /api/pledges`: zod validation, Turnstile, IP rate limit (5 per 10 min), reference generator `JLM-{year}-{4 random chars, no ambiguous letters}`.
3. Write a unit test that the reference generator cannot collide: check-and-retry against Firestore, or enough entropy that collision is impractical (risk #7, Avoid — this is a design property, not a bug to catch later).
4. Build the campaign page, AmountPicker, PledgeForm, RibBlock (copy buttons, `dir="ltr"`), confirmation page, and the admin Pledges table (mark received/cancelled, CSV export).
5. Playwright test for journey J1 end to end, in both FR and AR.
6. AC (unchanged from master plan): J1 passes in Playwright; progress bar counts only `received` pledges; reference codes are unique; the RIB never appears in the repository.

### T3.6 — Admin panel

1. Write the Firestore rules-unit-testing suite (emulator) **before** connecting the admin panel to real data (risk #6). Cover: anonymous client cannot read `pledges`, `contactMessages`, `joinRequests`; editor cannot write `campaigns`/`settings`/`users`.
2. Build auth (Firebase Auth, custom claims), dashboard, CRUD for all entities, LocalizedField (FR/AR/EN tabs with "missing" dot), autosave, image uploader with mandatory alt text.
3. AC: J6 passes; an editor hitting an admin-only page gets the 403 screen; every write logs `updatedBy`/`updatedAt`.

### T3.2 / T3.3 — Pôle, project and platform pages

1. Build one template, render all 3 pôle pages and 9 project pages from Firestore/seed data.
2. Add the Arabic Playwright screenshot check to CI now, not at the end (risk #5) — every pull request touching these pages runs an RTL visual check.
3. Platforms hub: 8 platforms + 3 prototypes, status badges, outbound `rel="noopener noreferrer"` links, `platform_click` event. Re-test all 8 external URLs before the 20 Nov and 24 Nov checkpoints (risk #12).
4. AC: all 9 projects render in 3 locales with real seed content; every platform link opens the right destination; keyboard accessible.

### T3.1 — Core pages (About, Contact, Join, Partners, Legal)

1. Build with the shared form pattern (zod, Turnstile, honeypot, rate limit) from the master plan Section 8.7.
2. This is also where the Morocco data-protection question gets handed off (risk #10, Transfer): send JLM's legal contact or board the question now, keep `donationsEnabled` as a switch so Gate 4 launch is not blocked on their answer.
3. AC: forms store to Firestore and email the board; Turnstile and rate limit active; privacy links present.

### T3.4 — News and ads module

1. Build per master plan Section 8.4 (types, scheduling, pinned flag, sanitized rich text, RSS per locale).
2. AC: a scheduled post appears at its time; an expired ad disappears; RSS validates.

### T3.7 — Multilingual completion

1. Send AR drafts to the native reviewer today (14 Nov), not at the end of Build (risk #8).
2. If review isn't back by 24 Nov, accept the French-fallback display with a visible "Traduction en cours" note as the safe default for the demo — do not block the demo waiting on it.
3. AC: no fallback notices on interface strings (or, if AR review is late, the fallback note is visibly correct rather than silently missing); content fallback works.

### T3.8 — Impact page and counters

1. Build per master plan Section 7.7 ("Impact"): stats band, per-project accordion, flagship actions, static caravan map.
2. AC: figures come from Firestore with source and date; counters respect `prefers-reduced-motion`.

### T3.9 — SEO and sharing

1. Metadata, hreflang, sitemap, robots, JSON-LD, OG images per master plan Section 7.12.
2. AC: Rich Results test passes for Organization and Article; every page has a unique title/description in all locales.

### T3.10 — Final content load

1. Internal content deadline for all 9 project leads: **20 Nov** (risk #4). Anything not received by then falls back to the 2026 annual-report text (already seeded, master plan Section 15.1) rather than a placeholder.
2. Load through the admin panel (dogfood T3.6) where possible, not direct Firestore writes.
3. AC: no visible `TODO(board)` on public pages except items already tracked in `docs/OPEN_QUESTIONS.md`.

### T3.11 — Gate 3 pack

See Section 8 (Gate 3 pack checklist) below.

---

## 6. Risks that must be actively handled before Gate 3 (not just logged)

Pulled from `JLM_Risk_Register_Phase3.xlsx`, highest severity first. Each one has a concrete action already placed into the day-by-day plan above — this table is the cross-reference so nothing is dropped.

| # | Risk (short) | Severity | Strategy | Where handled |
| --- | --- | --- | --- | --- |
| 1 | Build-phase capacity vs. exams | Red | Avoid | Section 2 (frozen scope), Section 4 (checkpoints) |
| 2 | Donation/banking international risk | Red | Mitigate | T3.5 step 1, checkpoint 14 Nov |
| 3 | Scope creep | Red | Avoid | Section 2, `docs/BACKLOG.md` |
| 4 | Content delay from 9 leads | Red | Mitigate | T3.10 step 1, checkpoint 20 Nov |
| 5 | RTL bugs found late | Red | Mitigate | T3.2/T3.3 step 2, continuous CI check |
| 6 | Firestore security rules untested | Red | Mitigate | T3.6 step 1 |
| 7 | Reference-code collision | Red | Avoid | T3.5 step 3 |
| 8 | Arabic reviewer unavailable | Yellow | Accept | T3.7 steps 1–2, checkpoint 24 Nov |
| 9 | Anti-spam/rate-limit misconfig | Yellow | Mitigate | Section 4 (19–21 Nov window) |
| 10 | Morocco data-protection / legal review | Yellow | Transfer | T3.1 step 2, checkpoint 23 Nov |
| 11 | Free-tier traffic limits | Yellow | Accept | Section 4 (22–24 Nov window); keep staging `noindex` |
| 12 | External platform links breaking | Yellow | Mitigate | T3.2/T3.3 step 3, checkpoint 20 and 24 Nov |
| 13 | Rotating PM handover loses context | Yellow | Mitigate | Section 1, `docs/HANDOVER.md` reviewed weekly |
| 14 | Safari/browser CSS quirks | Green | Accept | Logged only; fix in Phase 4 if time allows |

---

## 7. Testing before the demo (25–26 Nov)

Run in this order on 25 Nov, fix on 26 Nov, freeze after:

1. **Full Playwright suite**, journeys J1–J7, in FR and AR, Chromium + WebKit + mobile viewport.
2. **axe accessibility pass** on every route, both directions.
3. **Lighthouse CI (mobile)** on Home, a Project page, the Campaign page, `/id` — must meet Section 7.11 of the master plan (LCP < 2.5s, CLS < 0.05, INP < 200ms, JS < 150KB, Lighthouse scores 90+/95+/95+/95+).
4. **Manual pass**: one real mid-range Android phone on throttled 4G, keyboard-only navigation on the donation flow, one screen-reader pass on Home/Donate/Campaign/Join.
5. **Rules emulator tests**: confirm anonymous client still cannot read `pledges`/`contactMessages`/`joinRequests`.
6. Freeze the build on 26 Nov evening once all of the above are green; only critical-bug fixes after that point, no new features.

---

## 8. Gate 3 pack checklist (T3.11, due 25–26 Nov)

- [ ] Beta demo live on staging URL (noindex), all 10 in-scope modules working end to end.
- [ ] Test status summary: Playwright pass/fail counts, Lighthouse scores, accessibility findings, any open bug with severity and owner.
- [ ] Content status: which of the 9 projects have final vs. fallback text, which locales are fully reviewed vs. fallback-noted.
- [ ] Open issues list (from `docs/OPEN_QUESTIONS.md` and `docs/BACKLOG.md`), each with an owner and a target phase.
- [ ] Updated handover note (`docs/HANDOVER.md`) for the Phase 4 PM (Member D).
- [ ] Risk register reviewed one more time: confirm every Red risk's action plan was actually carried out, not just planned (Section 6 table).
- [ ] Demo script rehearsed once, end to end (Section 9).

---

## 9. Demo script for Gate 3 (27 Nov)

Run through in this order — it exercises the three protected journeys (J1 donor, J5 ID card, J6 admin) plus a tour of breadth, in under 10 minutes:

1. **Open Home** (FR, then switch to AR live to show RTL mirroring working correctly) — stats band, pôle cards, active campaign banner.
2. **Platforms hub** — show the 8 platforms + 3 prototypes, click one outbound link to prove it opens correctly.
3. **A project page** (e.g. GODEM) — stats, gallery, "Support this project" button.
4. **J1 — full donation flow**: campaign page → pick an amount → fill the pledge form → confirmation screen with reference code and RIB block → (switch to admin) mark it "received" → back on the public page, show the progress bar updated.
5. **J5 — ID card**: scan the `/id` QR on a phone live, show the vCard save and the print view.
6. **J6 — admin**: publish a short news post from the admin panel, show it live on the public site within the minute.
7. **Close** with the Gate 3 pack: test status, content status, what's left for Phase 4, and the risk register's current state (what was avoided/mitigated, what's still open and owned).

**Backup plan if something breaks live:** have a 90-second screen recording of steps 1–6 made on 25–26 Nov during the freeze, so a live glitch doesn't derail the demo — narrate over the recording and resume live for Q&A.

---

## 10. Starter prompts for Claude Code

1. "Read JLM_WEBSITE_EXECUTION_PLAN.md, JLM_PHASE3_DEMO_EXECUTION_PLAN.md and JLM_Risk_Register_Phase3.xlsx. Confirm the Firestore rules-unit-testing suite (risk #6) exists and passes before touching T3.6."
2. "Do T3.5. Start with the Playwright test for journey J1, then implement until it passes, including the reference-code uniqueness unit test from risk #7."
3. "Do T3.2 and T3.3. Add the Arabic Playwright screenshot check to CI as part of this task, not afterward."
4. "Run the full Playwright + axe + Lighthouse CI suite now, list every failing budget, journey or rule, and fix them one by one before the 25 Nov freeze."
5. "Assemble the Gate 3 pack per Section 8 of JLM_PHASE3_DEMO_EXECUTION_PLAN.md: test status, content status, open issues, handover note."

---

End of plan.
