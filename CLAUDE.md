# JLM website: rules for Claude Code

Read `JLM_WEBSITE_EXECUTION_PLAN.md` first. It is the source of truth. `JLM_PHASE3_DEMO_EXECUTION_PLAN.md` narrows Phase 3 into a day-by-day plan and cross-references `JLM_Risk_Register_Phase3.xlsx`.

## Commands

- `pnpm dev` | `pnpm build` | `pnpm lint` | `pnpm typecheck` | `pnpm test` | `pnpm e2e` | `pnpm seed`
- Firebase emulators: `pnpm emulators`

## Rules

- TypeScript strict, zod validation on every input, no `any`.
- Locales: fr (default), ar (RTL), en. Interface strings in `src/messages`, content in Firestore.
- Use CSS logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`). Test every page in fr and ar.
- Server components by default; client components only when needed.
- Never hardcode secrets, RIB, phone numbers, emails. Use env vars or the Firestore `settings` document.
- Never invent JLM facts. Use seed content or write `TODO(board)` and log it in `docs/OPEN_QUESTIONS.md`.
- Pledges and messages are server-only (Admin SDK). No client access.
- Performance budgets and accessibility (WCAG 2.2 AA) are hard requirements.
- Commit with Conventional Commits, one pull request per task, tick the task in the plan.
- Record decisions in `docs/DECISIONS.md`.
- This repo runs Next.js 16 (App Router). It has real breaking changes versus older Next.js: `middleware.ts` is renamed `proxy.ts` (exports a `proxy` function), and there is no single `app/layout.tsx` — `app/[locale]/layout.tsx` and `app/admin/layout.tsx` are each their own root layout (see `docs/DECISIONS.md`). Check `node_modules/next/dist/docs/` before assuming an older API.

## Definition of done

Code merged, tests added, lint, typecheck, unit, e2e, axe and Lighthouse budgets green, works in fr and ar, docs updated.
