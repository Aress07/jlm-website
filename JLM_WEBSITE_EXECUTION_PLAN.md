# JLM ENSAM Casablanca Website: Execution Plan

Version 1.0, written 2026-09-25. Audience: Claude Code (and the 4-person student team that supervises it).
Language of this file: English. Language of the product: Arabic (RTL), French, English.

---

## 0. How to use this file (instructions for Claude Code)

1. Read this whole file before writing code. Sections 1 to 10 are the specification. Section 11 is the ordered task list. Section 15 holds seed content, environment variables and a `CLAUDE.md` to copy into the repo.
2. Work phase by phase (Section 11). Do not start a phase's tasks before the previous phase's exit checklist is green, except where a task is marked `parallel`.
3. For every task: implement, run the checks in Section 12, commit with a Conventional Commit message (`feat:`, `fix:`, `chore:`, `docs:`, `test:`), then tick the checkbox in this file.
4. Never invent facts about JLM. All figures, names and quotes come from Section 15 (seed content) or from the board. If something is missing, insert a clearly marked placeholder (`TODO(board): ...`) and list it in `docs/OPEN_QUESTIONS.md`.
5. Never hardcode secrets, the bank RIB, phone numbers or emails. They live in environment variables or in the Firestore `settings` document (Section 5).
6. When a requirement is ambiguous, choose the simplest option that satisfies the acceptance criteria and write the decision in `docs/DECISIONS.md` (one paragraph: context, decision, alternatives).
7. Keep the site fast on a mid-range Android phone on 4G. Performance budgets in Section 8.9 are hard limits, not goals.

---

## 1. Project snapshot

**Client:** JLM ENSAM Casablanca (Jeunes Leaders Marocains), the humanitarian student association of ENSAM Casablanca. Active since 2014, reigning national champions ("Champions du Maroc en titre"). Motto: « Ce qu'on transmet reste ». Tagline: "Voices Aligned, Actions Amplified".

**Today:** JLM has a one-page annual report site (https://jlmensamcportfolio.netlify.app) and 8 separate platforms and games. It has no official home that gathers everything, posts news or ads, or collects donations.

**What we build:** one official website that is (1) JLM's digital ID card, (2) the showcase of its 3 pôles and 9 projects, (3) the hub linking every existing platform, (4) a news and ads channel, (5) a donation channel for campaigns (Ramadan baskets, Aïd al-Adha aid, rural caravans, wells), (6) a joining channel for new members, all editable by non-developers.

**Team:** 4 volunteer students, project manager role rotates per phase. Karim is one of them.

**Course gates (UTC EI02):**

| Gate | Date | Phase before it |
| --- | --- | --- |
| G1 | 2 Oct 2026 | Framing |
| G2 | 6 Nov 2026 | Design and foundation |
| G3 | 27 Nov 2026 | Build |
| G4 | 18 Dec 2026 | Test, launch, handover |

**Budget:** about 512 € cash in year one (domain, hosting buffer, payment gateway placeholder, photo session, legal review, printing, logistics, 10% contingency). Volunteer labor: 74.5 person-days.

### 1.1 Goals with targets

| ID | Goal | Target |
| --- | --- | --- |
| G1 | Digital ID card | Page live with mission, figures since 2014, contacts, QR code, vCard download |
| G2 | Show all work | 3 pôle pages, 9 project pages, hub linking 8 platforms and 3 prototypes |
| G3 | Autonomous editing | A trained member edits a figure or publishes a post in under 15 minutes |
| G4 | News and ads | News module live, at least 1 post per week for 2 months after launch |
| G5 | Donations | Campaign pages with RIB, unique reference code and pledge form |
| G6 | Reach | Arabic, French, English; pages load under 3 s on 4G mid-range phone |
| G7 | Delivery | Within budget, 4 gates passed |

### 1.2 Non-goals (do not build)

- Rebuilding GODEM, Waraqa, the digital refuge, the wishes tree, the recycling platform, the games or the quiz. We link to them.
- A mobile app.
- Member management beyond admin and editor accounts.
- Online card payment in the first release (planned as phase 2 after the board's legal and bank paperwork).
- A shop or e-commerce.

---

## 2. Technical decisions

Record any change to these in `docs/DECISIONS.md`.

| Area | Decision | Reason |
| --- | --- | --- |
| Framework | Next.js (App Router, latest stable), TypeScript strict | Team knows React; SSG/ISR gives speed and SEO |
| Styling | Tailwind CSS with CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) | RTL support without duplicate CSS |
| i18n | `next-intl`, locales `fr` (default), `ar`, `en`, path prefix `/fr`, `/ar`, `/en` | Content is French first; Arabic needs `dir="rtl"` |
| Data | Firebase: Firestore, Auth, Storage, Admin SDK on the server | Team knows Firebase; free tier covers launch |
| Content editing | Custom admin panel under `/admin` (Section 9.6) | Board must edit without developers |
| Hosting | Netlify (JLM already uses it) with the Next.js runtime | Free tier, previews per pull request |
| Email | SMTP through Brevo free tier (donation confirmations, contact form) | Free, no card needed |
| Analytics | Cloudflare Web Analytics or equivalent cookie-less tool | No consent banner needed |
| Anti-spam | Cloudflare Turnstile on public forms, plus honeypot and rate limit | Free, privacy-friendly |
| Testing | Vitest (unit), Playwright (end-to-end, RTL and mobile), axe (accessibility), Lighthouse CI | Section 12 |
| CI | GitHub Actions: lint, typecheck, unit, build, e2e, Lighthouse on pull requests | Quality gate for every merge |
| Images | `next/image`, AVIF/WebP, max 1600 px wide originals, lazy loading below the fold | Rural users, slow networks |
| Fonts | `next/font`: Cairo or Tajawal (Arabic), Inter or Poppins (Latin), max 2 families, subsets only | Speed |

---

## 3. Repository structure and conventions

```
jlm_website/
  CLAUDE.md
  README.md
  docs/
    DECISIONS.md
    OPEN_QUESTIONS.md
    CONTENT_GUIDE.md          # how members write posts and update figures
    ADMIN_MANUAL.md           # deliverable D19
  src/
    app/
      [locale]/
        layout.tsx
        page.tsx                       # home
        id/page.tsx                    # digital ID card (QR target)
        id/print/page.tsx              # printable card
        about/page.tsx
        poles/[slug]/page.tsx
        projects/page.tsx
        projects/[slug]/page.tsx
        platforms/page.tsx             # hub
        impact/page.tsx
        news/page.tsx
        news/[slug]/page.tsx
        donate/page.tsx
        donate/[campaign]/page.tsx
        donate/thanks/page.tsx
        join/page.tsx
        partners/page.tsx
        contact/page.tsx
        legal/privacy/page.tsx
        legal/notice/page.tsx
        not-found.tsx
      admin/                           # not localized, noindex
        login/page.tsx
        (protected)/layout.tsx
        (protected)/page.tsx           # dashboard
        (protected)/posts/...
        (protected)/campaigns/...
        (protected)/pledges/...
        (protected)/projects/...
        (protected)/platforms/...
        (protected)/stats/...
        (protected)/team/...
        (protected)/settings/...
        (protected)/users/...
      api/
        pledges/route.ts
        contact/route.ts
        join/route.ts
        revalidate/route.ts
        vcard/route.ts
    components/
      ui/            # primitives: Button, Card, Badge, Input, Select, Dialog, Toast, Tabs
      layout/        # Header, Footer, LocaleSwitcher, MobileMenu, SkipLink
      sections/      # Hero, StatsBand, PoleCards, ProjectGrid, CampaignCard, NewsList, PartnersStrip, CTA
      donate/        # AmountPicker, PledgeForm, RibBlock, ProgressBar, ReferenceCode
      admin/         # RichTextEditor, ImageUploader, LocalizedField, DataTable
    lib/
      firebase/      # client.ts, admin.ts, rules tests
      content/       # typed data access functions (getProjects, getPosts, ...)
      i18n/          # request config, routing, formatters
      validation/    # zod schemas shared by client and server
      seo/           # metadata helpers, JSON-LD builders
      utils/
    messages/
      fr.json  ar.json  en.json       # interface strings only
    styles/
      globals.css   tokens.css
  content/seed/                        # JSON seed files (Section 15)
  scripts/
    seed.ts                            # load seed content into Firestore
    make-admin.ts                      # grant admin claim
  firestore.rules   storage.rules   firebase.json
  tests/
    unit/  e2e/  a11y/
  .github/workflows/ci.yml
```

**Conventions**

- TypeScript strict, no `any`. Validate every external input with `zod`.
- One source of truth for types: `src/lib/validation/schemas.ts`.
- Server-only code never imported from client components (`import "server-only"`).
- Interface strings go through `next-intl` messages. Content strings (project descriptions, posts) live in Firestore as localized objects.
- Use logical CSS properties only. Physical `left/right/margin-left` are forbidden by a lint rule (`stylelint` or ESLint plugin for Tailwind).
- Commit small, pull request per task, squash merge, branch names `feat/T3.4-donation-form`.
- Accessibility and performance checks are part of "done".

---

## 4. Information architecture and routes

### 4.1 Sitemap

```
Home
About (identity, mission, history since 2014, team, values)
Digital ID card (/id)
Pôles
  Solidarity (SmartED, GODEM, IQRAA, Golden Wishes, JLM Junior)
  Environment (Greenovators, Recycle It, Get a Plet)
  Social entrepreneurship (Handmade B'lkhir)
Projects (filterable list, 9 detail pages)
Platforms and prototypes (hub: 8 platforms and games, Eden AI 2.0, MIPAD, data-cleaning agent)
Impact (figures, flagship actions, map of caravans)
News and ads (posts, announcements, calls for volunteers, partner ads)
Donate (campaign list, campaign page, pledge form, thank-you)
Join us (member application, high-school program JLM Junior, volunteer)
Partners and sponsors
Contact
Legal (privacy policy, legal notice)
Admin (login, dashboard, content management)
```

### 4.2 Primary navigation

Header (max 6 items): About, Projects, Impact, News, Platforms, **Donate** (highlighted button). Secondary in footer: Join, Partners, Contact, Legal, ID card. Locale switcher (AR | FR | EN) always visible in header, also in the mobile menu.

### 4.3 URL rules

- `/{locale}/...` for all public pages, `/` redirects to the best locale (cookie, then `Accept-Language`, then `fr`).
- Slugs are the same in all locales (kebab-case, Latin): `/ar/projects/smarted`.
- Every page has `hreflang` alternates and a canonical URL.
- `/id` is short and stable because it is printed as a QR code. Never change it.

---

## 5. Data model (Firestore)

All localized fields use `{ fr: string, ar?: string, en?: string }`. Reading falls back to `fr` when a locale is missing and shows a small "Traduction en cours" note.

```ts
type Localized = { fr: string; ar?: string; en?: string };

type Pole = {
  slug: "solidarity" | "environment" | "social-entrepreneurship";
  name: Localized; tagline: Localized; description: Localized;
  color: string; icon: string; order: number;
};

type Project = {
  slug: string;                 // "smarted", "godem", "iqraa", ...
  poleSlug: Pole["slug"];
  name: Localized;
  tagline: Localized;           // e.g. "L'éducation par la technologie, le jeu, l'expérience"
  description: Localized;       // rich text (sanitized HTML or markdown)
  logo: string;                 // Storage path
  cover?: string;
  gallery: string[];
  stats: { key: string; value: number; unit?: Localized; label: Localized }[];
  platformIds: string[];        // links to Platform docs
  leads?: { name: string; role: Localized; photo?: string }[];  // only with consent
  published: boolean; order: number; updatedAt: Timestamp;
};

type Platform = {
  id: string; name: Localized; description: Localized;
  url: string; kind: "platform" | "game" | "website" | "shop" | "prototype";
  projectSlug: string; status: "live" | "beta" | "in-development" | "prototype";
  screenshot?: string; order: number; published: boolean;
};

type Post = {
  slug: string; type: "news" | "announcement" | "ad" | "volunteer-call" | "report";
  title: Localized; excerpt: Localized; body: Localized;
  cover?: string; tags: string[]; projectSlug?: string;
  publishAt: Timestamp; expiresAt?: Timestamp;   // ads expire
  sponsorId?: string; pinned: boolean; published: boolean; authorUid: string;
};

type Campaign = {
  slug: string; kind: "ramadan" | "adha" | "caravan" | "well" | "education" | "other";
  title: Localized; summary: Localized; story: Localized;
  goalMAD: number; receivedMAD: number;        // receivedMAD recomputed from pledges with status "received"
  startsAt: Timestamp; endsAt: Timestamp; featured: boolean;
  cover?: string; breakdown: { label: Localized; amountMAD: number }[]; // e.g. 1 basket = 290 MAD
  inKindAccepted: boolean; published: boolean;
};

type Pledge = {                 // NEVER readable by clients
  id: string; reference: string; // "JLM-2026-A7K3", shown to the donor, used on the bank transfer
  campaignSlug: string; amountMAD: number; currencyDisplay: "MAD" | "EUR";
  donorName?: string; anonymous: boolean; email?: string; phone?: string; message?: string;
  kind: "money" | "in-kind"; inKindDescription?: string;
  status: "pledged" | "received" | "cancelled";
  createdAt: Timestamp; receivedAt?: Timestamp; locale: "fr" | "ar" | "en";
};

type Partner = { id: string; name: string; logo: string; url?: string; tier: "institutional" | "sponsor" | "supplier"; since?: number; published: boolean; order: number };

type StatItem = { key: string; label: Localized; value: number; unit?: Localized; source: string; asOf: string };  // homepage counters

type FlagshipAction = { slug: string; title: Localized; year: number; investedMAD?: number; people?: number; summary: Localized; photos: string[] };

type TeamMember = { id: string; name: string; role: Localized; pole?: string; photo?: string; consent: boolean; order: number };

type Settings = {                // single doc settings/site
  contact: { email: string; phone?: string; whatsapp?: string; address?: Localized };
  social: { instagram?: string; facebook?: string; linkedin?: string; youtube?: string; tiktok?: string };
  bank: { holder: string; bankName: string; rib: string; iban?: string; swift?: string };
  fundraisingAuthorization?: { number: string; date: string; authority: string };  // shown on donate pages when set
  donationsEnabled: boolean; joinOpen: boolean;
};

type User = { uid: string; email: string; role: "admin" | "editor" };  // role stored as custom claim
```

### 5.1 Security rules (summary, write real tests)

- Public read: `poles`, `projects`, `platforms`, `partners`, `stats`, `flagshipActions`, `team` (only `consent: true`), `posts` and `campaigns` when `published == true` and dates are valid. `settings/site` public read of a **public subset** only (contact, social, bank); implement by a server route or a separate `settingsPublic` doc.
- `pledges`, `contactMessages`, `joinRequests`: no client access at all. Created and read only through the Admin SDK in API routes and the admin panel.
- Write: `editor` may write posts, projects, platforms, stats, flagship actions, team. `admin` may also write campaigns, settings, partners, users, and update pledge status.
- Storage: public read on `/public/**`; write only for editor/admin; allow images (jpeg, png, webp, avif) up to 5 MB and PDFs up to 10 MB.
- Add emulator-based tests for rules (`@firebase/rules-unit-testing`).

---

## 6. Visitor journeys

Each journey lists the persona, the entry point, the steps, what can go wrong, and the metric that proves success. Claude Code must implement the pages and events so that each journey works end to end and is testable in Playwright.

### J1. Donor (local family or diaspora), highest priority

- **Persona:** Salma, 34, lives abroad, sees JLM's Ramadan post on Instagram, wants to give to food baskets, is worried about trust.
- **Entry:** Link from social post to `/{locale}/donate/ramadan-2027` (or QR on a flyer).
- **Steps:**
  1. Lands on the campaign page: cover photo, one-sentence promise, progress bar (received vs goal), "1 basket = X MAD" breakdown, last year's proof (76 baskets, 22,000 DH), authorization notice if configured.
  2. Chooses an amount preset or types a custom one, or "give in kind".
  3. Fills the pledge form: amount, name (optional), email or phone, anonymous toggle, message. Turnstile check.
  4. Sees the confirmation page: unique reference code, RIB block with copy buttons, instruction "write this reference in the transfer label", what happens next.
  5. Receives the same details by email (in her language).
  6. Later, the board marks the pledge "received"; the campaign progress bar updates.
- **Edge cases:** campaign ended (show "closed, thank you" and a link to the next campaign), donations disabled (show contact instead), email typo, duplicate submission (idempotency), Arabic name input, EUR display note (conversion is indicative only).
- **Success metric:** form completion rate; pledges per campaign; share of pledges later marked received.
- **Events to track:** `donate_view`, `amount_selected`, `pledge_submitted`, `rib_copied`.

### J2. Prospective sponsor or company

- **Entry:** Google search for JLM, or a partner's link, lands on Home or Impact.
- **Steps:** Home (credibility band: since 2014, figures) then Impact (figures, flagship actions with amounts) then Partners (existing partners) then Contact form with type "Sponsorship" or a "Download the annual report" PDF link.
- **Edge cases:** wants a PDF sponsorship kit (admin can upload one in settings), wants a call (WhatsApp button).
- **Metric:** contact messages tagged "sponsorship".

### J3. Prospective member (ENSAM or other student)

- **Entry:** Scans a QR on a campus poster, lands on `/join`.
- **Steps:** Short intro (what JLM does, 3 pôles, "135 active members") then pick a pôle of interest then form (name, school, year, pôle, motivation, phone or email) then thank-you with next step (info session date if any).
- **Edge cases:** joining closed (`joinOpen = false` shows "next call opens in ..." and newsletter-free contact link).
- **Metric:** submissions per week.

### J4. Rural student or parent looking for orientation help (GODEM)

- **Persona:** Youssef, 17, low bandwidth, Arabic speaker, on a phone.
- **Entry:** Shared link `/ar/projects/godem` or the Platforms hub.
- **Steps:** Arabic page loads fast, large tap targets, plain language; primary button "Open the orientation platform" goes to https://godem.ensamien.com/; secondary "Contact us on WhatsApp".
- **Edge cases:** no JavaScript hiccups, images not needed to understand, works offline-ish (cached shell not required).
- **Metric:** outbound clicks to the platform (`platform_click`).

### J5. QR scan of the digital ID card (journalist, school admin, partner, event attendee)

- **Entry:** QR on a business card or poster opens `/id`.
- **Steps:** Mobile-first card: logo, name, tagline, three key figures, three pôle chips, contact buttons (call, WhatsApp, email, Instagram), "Save contact" (`.vcf`), "Share", "See our work" link to Home.
- **Edge cases:** language auto-detected, print version `/id/print` (A6, front and back).
- **Metric:** `id_view`, `vcard_download`.

### J6. Member or board editor (admin)

- **Entry:** `/admin/login`.
- **Steps:** Sign in, dashboard shows "Drafts, Scheduled, Pledges to confirm", create a post (title, cover, body, language tabs, type, dates), preview, publish, site refreshes within a minute. Update a figure in Stats. Mark a pledge as received.
- **Edge cases:** editor tries an admin-only page (403 screen), session expired, image too large, missing Arabic translation warning (allow publish with fallback).
- **Metric:** time to publish a post under 15 minutes for a trained member (tested at gate 4).

### J7. Existing platform user (returning)

- **Entry:** Platforms hub.
- **Steps:** Cards grouped by project with status badges (live, beta, in development, prototype), open in a new tab with `rel="noopener"`. Prototypes (Eden AI 2.0, MIPAD, data-cleaning agent) open a detail page with story and "contact the team".

---

## 7. UI/UX plan

### 7.1 Principles

1. **Trust first.** JLM asks for money and time. Show real numbers, real photos, dates and sources. No stock photos in the hero.
2. **Human and hopeful.** Warm imagery of children, caravans, gardens, prototypes at work. The closing line of the annual report sets the tone: "We did not show what we gave. We showed what we planted."
3. **Mobile first, low bandwidth.** Most visitors are on phones. Design at 360 px first.
4. **Arabic is not a translation afterthought.** Design and test every screen in RTL from the first mockup.
5. **One clear action per screen.** Each page has one primary call to action (Donate, Join, Contact, Open platform).
6. **Editable by design.** Every visible block maps to a content field the board can edit.

### 7.2 Visual identity

- Extract the palette from the JLM logo (https://jlmensamcportfolio.netlify.app/logo-jlm.png) and the 9 project logos. Define tokens in `src/styles/tokens.css`. Until the board confirms the brand, use a neutral placeholder palette and mark it `TODO(board): brand colors`.
- Pôle colors (one accent each, must pass contrast on white and on dark): Solidarity (warm), Environment (green), Social entrepreneurship (amber or blue). Choose from the logos.
- Tokens to define: `--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-primary`, `--color-primary-contrast`, `--color-pole-solidarity`, `--color-pole-environment`, `--color-pole-entrepreneurship`, `--color-success`, `--color-warning`, `--color-danger`, radius scale (4, 8, 16, 999), spacing scale (4-based), shadow scale (2 levels), max content width 1200 px.
- Dark mode is optional for release 1 (do not build unless time remains after G3).

### 7.3 Typography

- Arabic: Cairo or Tajawal (400, 600, 700). Latin: Inter or Poppins (400, 600, 700). Load with `next/font`, subsets only, `display: swap`.
- Scale (mobile / desktop): H1 32/48, H2 26/36, H3 20/26, body 16/18, small 14. Line height 1.6 for Arabic, 1.5 for Latin.
- Numerals: use Western digits in all locales for figures (consistent with the annual report); format with `Intl.NumberFormat` per locale, thousands separator via locale.
- Never justify Arabic text; never letter-space Arabic.

### 7.4 RTL rules

- `<html lang dir>` set per locale. All spacing with logical utilities.
- Mirror: navigation order, arrows and chevrons, progress bars fill direction, carousels, breadcrumbs. Do not mirror: logos, photos, numbers, phone numbers, code, brand icons, play buttons, charts axes with time.
- Phone numbers and reference codes are wrapped in `<bdi dir="ltr">`.
- Icons that imply direction get an `rtl:` flip class.
- Every Playwright visual test runs in `fr` and `ar`.

### 7.5 Layout system

- 4-column grid on mobile, 8 on tablet, 12 on desktop. Gutters 16 / 24 / 32.
- Breakpoints: 360 (base), 640, 768, 1024, 1280.
- Header: logo, 6 nav items, locale switcher, Donate button. Mobile: logo, Donate button, menu button; full-screen menu with big targets.
- Footer: mission line, nav, contact, social, partner logos strip, legal links, authorization notice if configured.

### 7.6 Component inventory

Primitives: Button (primary, secondary, ghost, danger; sizes; loading state), Link, Badge (pôle, status), Card, Input, Textarea, Select, Checkbox, Radio group, Switch, Dialog, Toast, Tabs, Accordion, Tooltip, Skeleton, ProgressBar, Breadcrumb, Pagination, EmptyState.
Sections: Hero, StatsBand (animated counters that respect `prefers-reduced-motion`), PoleCards, ProjectCard, ProjectGrid with filter chips, FlagshipTimeline, PlatformCard, PrototypeCard, CampaignCard, AmountPicker, PledgeForm, RibBlock (copy buttons, monospaced, `dir="ltr"`), ReferenceCode, NewsCard, PostBody (typography styles), PartnersStrip, JoinForm, ContactForm, IdCard, QRCode, LocaleSwitcher, SeasonBanner (appears when a campaign is active), Footer.
Admin: DataTable, LocalizedField (tabs FR AR EN with "missing" dots), RichTextEditor (bold, italic, lists, links, headings, images), ImageUploader (client-side resize to 1600 px, alt text required), StatusBadge, ConfirmDialog, PledgeStatusSelect.

### 7.7 Page blueprints (section order, content, primary action)

**Home**
1. Hero: one strong photo, headline (e.g. "Ce qu'on transmet reste"), sub-line (who JLM is in one sentence), primary button Donate (or the active campaign), secondary button "Discover our projects".
2. Season banner (only when a campaign is active): campaign title, progress, Donate now.
3. StatsBand: 11 986 beneficiaries, 7 256 km, 135 active members, 9 projects in 3 pôles, 2 caravans (from `stats`, with "as of 2026 annual report").
4. Three pôle cards with a line each and link.
5. Featured projects (3 to 6 cards).
6. Flagship actions carousel (caravans, wells, baskets) with amounts and people helped.
7. Latest news (3 cards) and one pinned announcement.
8. Platforms teaser (icons of the 8 platforms) linking to the hub.
9. Partners strip.
10. Final call to action: Join us / Donate / Contact.

**About:** Story since 2014, mission and values, the three pôles, how JLM works (what "transmit" means), timeline (2014 to 2026, from the board), team with consent-based photos, national champion recognition (with year to confirm), annual report PDF download.

**Digital ID card (`/id`):** see J5. Above the fold: logo, name, motto, Save contact button. Below: 3 figures, pôle chips, contacts, socials, QR of the URL, "See the full site". Print view at `/id/print`: A6 front (logo, name, QR) and back (contacts).

**Pôle page:** pôle color band, description, list of its projects (cards), stats aggregated from its projects, related news.

**Projects list:** filter chips by pôle, search by name, cards with logo, tagline, 2 stats.

**Project detail:** cover, tagline, "What we do", key stats row (from `stats`), gallery, platforms and tools list (cards linking out), related news, "Support this project" button (goes to the matching campaign or Donate), contact.

**Platforms hub:** grouped by project, status badges, filter by type (platform, game, website, shop, prototype), open in new tab. Prototypes section with stories (Eden AI 2.0: sound and sign translation box with sensor rings, tested in real conditions; MIPAD: tongue-controlled mouse, working prototype; data-cleaning AI agent: reduces stored duplicate or obsolete data, functional).

**Impact:** big figures, "since 2014: more than 600 members trained, about 12,000 lives touched", per-project stats accordion, flagship actions cards (FOCUS 6.0, AZUL, Winter caravan Al Haouz, Lina 4.0 caravan douar Tizi, Al Haouz well), a simple map of caravan locations (static image or lightweight map, no heavy library), "How we account for numbers" note with source and date.

**News and ads:** list with type filter, pinned posts first, expired ads hidden, RSS feed per locale. Post page: cover, date, type badge, body, share buttons (copy link, WhatsApp, Facebook, LinkedIn), related posts, sponsor block for ads.

**Donate (list):** intro (why give, how money is used, authorization notice), active campaigns first, then ended ones as "past campaigns" with results, FAQ (how transfer works, receipts, in-kind, contact), transparency paragraph.

**Campaign page:** see J1.

**Thank-you page:** shows reference (also copyable), RIB, next steps, "Share this campaign".

**Join:** see J3. Include a JLM Junior block for high school students and a volunteer option.

**Partners:** logos by tier, "Become a partner" form or button, testimonials only if written and approved.

**Contact:** form (name, email, topic select: General, Sponsorship, Press, Volunteer, Beneficiary), WhatsApp button, email, social, map or address text, response time promise ("we reply within X days" once the board confirms).

**Legal:** privacy policy (what is collected: pledges, contact, join; why; retention; who can see it; how to request deletion), legal notice (association name, address, publication director, host).

### 7.8 States and microcopy

- Every list has loading skeletons, empty state with a helpful sentence, and error state with a retry button.
- Forms: inline validation on blur, error text linked with `aria-describedby`, submit button shows progress, success screen (not just a toast).
- Tone: warm, direct, short sentences, no jargon. French uses "nous", Arabic uses clear Modern Standard Arabic (avoid overly formal phrasing), English is simple and international.
- All interface strings go in `messages/*.json`. Provide FR first; produce AR and EN drafts and mark them `needs-review` in a comment so a native speaker reviews them at G3.

### 7.9 Motion

- 150 to 250 ms transitions, no parallax, no autoplay video with sound, counters animate once when scrolled into view and are static under `prefers-reduced-motion`.

### 7.10 Accessibility (WCAG 2.2 AA)

- Skip link, landmarks, one H1 per page, logical heading order, visible focus ring, tap targets at least 44 px, color contrast 4.5:1 for text, no information by color alone, meaningful `alt` (empty `alt` for decorative), captions or transcripts for videos, form labels, keyboard operable menu, dialogs trap focus, `lang` attributes on mixed-language snippets.
- Automated: axe in Playwright on every page, both directions. Manual: keyboard pass and a screen reader pass on Home, Donate, Campaign, Join at gate 3.

### 7.11 Performance budgets (hard limits, Lighthouse on mobile profile)

| Metric | Limit |
| --- | --- |
| LCP | under 2.5 s (goal under 2.0 s) |
| CLS | under 0.05 |
| INP | under 200 ms |
| JavaScript per page (compressed) | under 150 KB on public pages |
| Hero image | under 120 KB, `priority`, explicit dimensions |
| Lighthouse (mobile) | Performance 90+, Accessibility 95+, SEO 95+, Best practices 95+ |

Rules: server components by default, client components only for interactivity (forms, menu, counters, admin), no heavy UI or animation libraries, no chart library (use CSS bars), no map SDK (static map image), images pre-sized, fonts subsetted, third-party scripts limited to analytics and Turnstile (loaded only on pages with forms).

### 7.12 SEO and sharing

- Unique title and description per page and locale, Open Graph and Twitter cards with cover image, `hreflang`, canonical, `sitemap.xml`, `robots.txt` (admin and API disallowed), JSON-LD: `Organization` (or `NGO`) on Home, `Article` on posts, `BreadcrumbList`, `DonateAction` on campaign pages.
- Social preview images generated at build (`opengraph-image`) with logo and title in the right language and direction.

---

## 8. Feature specifications

### 8.1 Internationalization

- Locale routing with `next-intl`; language switcher keeps the current page.
- Content fallback to French with a visible "Traduction en cours" note in AR and EN.
- Dates: `Intl.DateTimeFormat` with `ar-MA`, `fr-FR`, `en-GB`; use the Gregorian calendar; numerals Western in all locales.
- Currency: display MAD as "MAD" or "DH" (choose one and keep it consistent; default "MAD" in AR and EN, "DH" in FR because the annual report uses DH). Indicative EUR line shown only on the donate pages with a note that the rate is approximate.
- Test: every route renders in all 3 locales with no missing message keys (script fails the build if a key is missing in `fr`).

### 8.2 Digital ID card

- Route `/[locale]/id`, static, under 60 KB of HTML and CSS, no JavaScript needed for the core content.
- `vcard` route returns a `.vcf` with organization name, URL, email, phone, and logo URL, generated from `settings`.
- QR code generated at build (SVG, no runtime library on the client).
- Print page `/id/print` with `@page` size A6 (or business-card size) and front and back.

### 8.3 Projects, pôles, platforms hub

- All read from Firestore through `src/lib/content/*` with `revalidate` tags. Publish in admin calls `/api/revalidate` with a secret and the tag, so changes appear in under a minute.
- Links to external platforms open in a new tab with `rel="noopener noreferrer"` and fire a `platform_click` event.
- Platform status badge and last-checked date; a weekly GitHub Action pings each platform URL and opens an issue if one returns an error (nice to have).

### 8.4 News and ads

- Types: news, announcement, ad, volunteer call, report. Scheduling with `publishAt` and `expiresAt`. Pinned flag. Tags. Optional sponsor for ads.
- Rich text is stored as sanitized HTML (allow-list: `p, h2, h3, ul, ol, li, strong, em, a, blockquote, img, figure, figcaption`). Sanitize on save and on render.
- RSS per locale at `/[locale]/news/rss.xml`.
- Ads are labeled "Sponsored" or the localized equivalent, and never look like editorial posts.

### 8.5 Donation module (release 1: pledges and bank transfer)

- **Flow:** see J1. `POST /api/pledges` validates with zod, verifies Turnstile, rate limits by IP (5 per 10 minutes), enforces amount limits (min 10 MAD, max configurable), generates a unique reference (`JLM-{year}-{4 random chars, no ambiguous letters}`), writes the pledge with the Admin SDK, sends the confirmation email, returns the reference.
- **Idempotency:** client sends an idempotency key; a repeated key returns the same reference.
- **Progress bar:** `receivedMAD` only counts pledges with status `received`. Optionally show "pledged" in a lighter color. Recompute in a Cloud Function or in the admin action when a status changes.
- **Admin:** Pledges table with filters (campaign, status, date), search by reference, mark received or cancelled, CSV export (admin only), audit fields (`updatedBy`, `updatedAt`).
- **Transparency:** every campaign shows how funds are used (breakdown) and, after the campaign, a result summary with photos.
- **Authorization notice:** if `settings.fundraisingAuthorization` is set, show it in the donate footer block. If donations are not yet allowed, `donationsEnabled = false` hides pledge forms and shows a "Contact us to give" block. The board must confirm the legal position before launch (Section 14).
- **Release 2 (not now):** online card payment through the association's bank gateway. Design the pledge schema so a payment provider can be added (`paymentMethod`, `providerRef`).
- **In-kind gifts:** form variant with description and pickup or drop-off details (books, computers, clothes).

### 8.6 Admin panel

- Auth: Firebase Auth email and password, custom claims `role: admin | editor`. Session cookie verified on the server for every `/admin` request. Sign-out everywhere.
- Layout: left navigation (RTL aware), top bar with locale of the admin UI (FR default) and user menu.
- Dashboard: counts of drafts, scheduled posts, pledges awaiting confirmation, unpublished translations; quick actions.
- Entities with list, create, edit, delete or unpublish: Posts, Campaigns, Pledges, Projects, Platforms, Stats and flagship actions, Team, Partners, Settings (contact, social, bank, authorization, toggles), Users (admin only).
- Editing UX: LocalizedField tabs FR, AR, EN with a "missing" dot; autosave draft every 30 s; preview link; image upload with client-side resize and mandatory alt text; unsaved changes warning; confirm dialogs for destructive actions.
- Every write validates with the same zod schemas as the public site; every write logs `updatedBy` and `updatedAt`.
- `noindex, nofollow` on all admin pages; no admin links in the public site except an unobtrusive footer link.
- Deliverable: `docs/ADMIN_MANUAL.md` with screenshots and the 5 most common tasks.

### 8.7 Forms (contact, join, pledge)

- Shared pattern: zod schema, Turnstile, honeypot field, rate limit, server-side validation, store in Firestore (Admin SDK), send an email notification to the board address, show success state, never expose stored data publicly.
- Consent checkbox linking to the privacy policy on every form that collects personal data.
- Retention: contact and join messages deleted after 12 months (documented in the privacy policy; a scheduled function or a manual admin action).

### 8.8 Impact counters and figures

- Homepage and Impact figures come from `stats` documents with `value`, `source`, `asOf`. Numbers are never hardcoded in components.
- Display "as of {asOf}" under the band. When a figure is edited in admin, the site refreshes automatically.

### 8.9 Analytics events (cookie-less)

`page_view`, `donate_view`, `amount_selected`, `pledge_submitted`, `rib_copied`, `platform_click`, `join_submitted`, `contact_submitted`, `id_view`, `vcard_download`, `locale_changed`, `share_click`. No personal data in events.

---

## 9. Security and privacy

- HTTPS only, HSTS, security headers (CSP with nonces, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, frame-ancestors none for admin).
- Secrets only in Netlify environment variables and GitHub secrets; `.env.local` git-ignored; commit `.env.example`.
- Least privilege in Firestore and Storage rules, verified by tests. Pledges and messages are server-only.
- Input validation with zod on every API route; output sanitization for rich text; parameterized queries only (Firestore SDK).
- Rate limiting and Turnstile on public POST routes. Log errors without personal data.
- Admin accounts: strong passwords, 2-step verification enabled on the Firebase and Netlify owner accounts, no shared logins.
- Personal data: collect the minimum (donor name optional, contact by email or phone), keep it only as long as needed, provide deletion on request, show a clear privacy policy in the 3 languages. Morocco's personal-data law (Law 09-08, supervised by the CNDP) may require a declaration by the association: **the board must verify this** (Section 14).
- Beneficiaries: publish photos and stories of children, patients (oncology service) and entrepreneurs only with written consent. Enforce a `consent: true` field for any person shown by name or face in content. For minors, use no full names and prefer non-identifying images. Add this rule to `docs/CONTENT_GUIDE.md`.
- Backups: weekly Firestore export to Storage (or manual monthly export documented in the admin manual).

---

## 10. Content plan

| Content | Owner | Source | Needed by |
| --- | --- | --- | --- |
| Texts for 3 pôles and 9 projects (FR) | Project leads | 2026 annual report (seed in Section 15) | G2 for structure, G3 final |
| Arabic and English translations | Members who speak the language, reviewed by a native reader | FR text | G3 |
| Figures and dates per project | Project leads | Annual report, verified | G2 |
| Photos and short videos | Members | Own archives, with consent | G3 |
| Logos (JLM + 9 projects + partners) | Board | Existing files | G2 |
| Team list with roles and photos (consent) | Board | Board | G3 |
| Legal texts (privacy, notice) | Team with legal contact | Templates adapted | G3 |
| Bank details, contact channels | Board | Board | G3 (never commit them) |
| Sponsorship kit PDF (optional) | Board | Board | G4 |

Content rules: keep every statement traceable to a source and a date; use the same figures everywhere; avoid superlatives that cannot be proven; write alt text for every image; caption photos with place and year.

---

## 11. Execution plan by phase

Calendar (Casablanca time): today is Fri 25 Sep 2026. Only the gate dates are fixed; the course "T" weeks do not map cleanly to calendar weeks, so plan by dates.

| Phase | Dates | Ends with | PM for the phase |
| --- | --- | --- | --- |
| 1 Framing | 25 Sep to 2 Oct | Gate 1 | Member A |
| 2 Design and foundation | 5 Oct to 6 Nov | Gate 2 | Member B |
| 3 Build | 9 Nov to 27 Nov | Gate 3 | Member C |
| 4 Test, launch, handover | 30 Nov to 18 Dec | Gate 4 | Member D |

Capacity check: about 12 weeks and 4 people at roughly 1.9 days per week each is about 90 person-days available for 74.5 planned. Because Phase 3 is only 3 weeks, **development of the foundation and the first pages starts in Phase 2** (tasks marked `P2 dev`). Do not leave development for Phase 3.

Legend: `[ ]` to do. `WBS` refers to the framing document. `Parallel` tasks can run at the same time as others in the phase. Each task ends with an acceptance criterion (AC).

### Phase 1: Framing (25 Sep to 2 Oct), Gate 1

Deliverables: charter, stakeholder definition and matrix, WBS and schedule, budget, legal memo draft, audit, content inventory, project card.

- [ ] **T1.1 Repo and tooling** (WBS 4.1, parallel). Create GitHub repo, Next.js + TypeScript + Tailwind + ESLint + Prettier + Vitest + Playwright, `CLAUDE.md`, `.env.example`, `docs/`. AC: `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass on a fresh clone; CI runs them on a pull request.
- [ ] **T1.2 Audit of the current site and 8 platforms** (WBS 2.2). Table of every platform: URL, purpose, status (works or not), screenshot, owner. AC: all 8 URLs tested, results in `docs/AUDIT.md`.
- [ ] **T1.3 Content inventory** (WBS 2.3). Copy the annual report content into `content/seed/*.json` (Section 15) and list missing items. AC: every project has an entry with figures and a list of missing photos or texts.
- [ ] **T1.4 Legal and donation memo** (WBS 2.4). Questions to the board and a legal contact: fundraising authorization, association status and bank account, personal-data declaration, use of the ENSAM logo, photo consent. AC: `docs/OPEN_QUESTIONS.md` sent to the board.
- [ ] **T1.5 Gate 1 pack** (WBS 1.4). Goals, stakeholders, matrix, WBS, deliverables, budget, project card. AC: pack sent 2 days before Gate 1.

**Gate 1 exit:** board signs scope and budget; open questions list delivered; repo builds.

### Phase 2: Design and foundation (5 Oct to 6 Nov), Gate 2

Deliverables: site map, brand kit, wireframes, UI mockups (mobile, desktop, RTL), digital ID card, working foundation with i18n and Firebase, content plan.

Design track (Designer lead, Content lead supports):

- [ ] **T2.1 Site map and user journeys** (WBS 2.5). Turn Sections 4 and 6 into diagrams. AC: 7 journeys validated by 3 members and one board member.
- [ ] **T2.2 Brand kit** (WBS 3.1). Palette from logos, tokens, typography, logo usage, icon set. AC: tokens file committed; contrast ratios documented.
- [ ] **T2.3 Wireframes** (WBS 3.2). Home, Project detail, Campaign, Donate list, Join, ID card, Admin post editor. AC: low-fidelity screens for every page in Section 7.7, mobile first.
- [ ] **T2.4 UI mockups** (WBS 3.3). Mobile, desktop, and RTL version of Home, Project, Campaign, ID card, Admin post editor. AC: board approves; component list matches Section 7.6.
- [ ] **T2.5 Digital ID card design** (WBS 3.4). Screen, vCard, printable A6. AC: QR scans on 3 different phones.

Foundation track (`P2 dev`, Developers):

- [ ] **T2.6 Design system in code** (parallel). Tokens, Tailwind config with logical properties, primitives (Button, Card, Input, Badge, etc.), Storybook or a `/dev/ui` route. AC: every primitive renders correctly in LTR and RTL, keyboard accessible.
- [ ] **T2.7 i18n and layout.** `next-intl`, locale routing, Header, Footer, LocaleSwitcher, MobileMenu, SkipLink, fonts. AC: `/fr`, `/ar`, `/en` render the shell; `dir` and `lang` correct; missing keys fail the build.
- [ ] **T2.8 Firebase setup.** Projects (dev and prod), Firestore, Auth, Storage, emulators, Admin SDK, zod schemas from Section 5, security rules with tests, `seed.ts`, `make-admin.ts`. AC: `pnpm seed` fills the emulator; rules tests pass; anonymous client cannot read pledges.
- [ ] **T2.9 Content access layer.** `src/lib/content/*` typed functions with locale fallback and cache tags; revalidate API. AC: unit tests for fallback; a published change shows on the site within 60 s.
- [ ] **T2.10 Digital ID card page** (WBS 3.4 code part). `/id`, `/id/print`, `vcard` route, QR SVG. AC: Lighthouse mobile 95+ on `/id`; `.vcf` imports into a phone.
- [ ] **T2.11 Home static version.** Hero, StatsBand, PoleCards, ProjectGrid from seed data. AC: matches approved mockup at 360 and 1280 px in FR and AR.
- [ ] **T2.12 CI.** Lint, typecheck, unit, build, Playwright smoke in FR and AR, Lighthouse CI budgets, axe. AC: a pull request fails when a budget is missed.
- [ ] **T2.13 Content package start** (WBS 5.1 to 5.4, Content). Collect texts, photos and consent; start AR and EN translations. AC: content tracker shows status per project.
- [ ] **T2.14 Gate 2 pack** (WBS 1.4). Mockups, ID card, site map, content plan, staging URL. AC: staging deployed on Netlify; board sees the ID card live.

**Gate 2 exit:** board approves mockups and the ID card; staging URL live with Home and ID card; content plan agreed.

### Phase 3: Build (9 Nov to 27 Nov), Gate 3

Deliverables: beta website with all pages and modules, content package.

- [ ] **T3.1 Core pages** (WBS 4.2). About, Contact, Join, Partners, Legal pages. AC: forms store to Firestore and email the board; Turnstile and rate limit active; privacy links present.
- [ ] **T3.2 Pôle and project pages** (WBS 4.3). One template renders 3 pôle pages and 9 project pages from Firestore. AC: all 9 projects render in 3 locales with real seed content; gallery and stats work.
- [ ] **T3.3 Platforms hub** (WBS 4.4). 8 platforms and 3 prototypes, filters, status badges, outbound tracking. AC: every link opens the right destination; keyboard accessible.
- [ ] **T3.4 News and ads module** (WBS 4.5). List, detail, types, scheduling, expiry, RSS, share buttons, sanitized rich text. AC: a scheduled post appears at its time; an expired ad disappears; RSS validates.
- [ ] **T3.5 Donation module** (WBS 4.6). Campaign list and page, AmountPicker, PledgeForm, RibBlock, thank-you, email, admin pledges table, progress logic, in-kind variant, `donationsEnabled` switch. AC: J1 passes end to end in Playwright; progress counts only received pledges; reference codes are unique; RIB never appears in the repository.
- [ ] **T3.6 Admin panel** (WBS 4.7). Auth, roles, dashboard, CRUD for all entities, LocalizedField, image uploader, autosave, preview. AC: J6 passes; an editor cannot open admin-only pages; every write logs the author.
- [ ] **T3.7 Multilingual completion** (WBS 4.8). All interface strings in FR, AR, EN; AR and EN reviewed by native readers. AC: no fallback notices on interface strings; content fallback works.
- [ ] **T3.8 Impact page and counters** (WBS 4.9). Stats band, per-project stats, flagship actions, static caravan map. AC: figures come from Firestore with source and date; counters respect reduced motion.
- [ ] **T3.9 SEO and sharing.** Metadata, hreflang, sitemap, robots, JSON-LD, OG images. AC: Rich Results test passes for Organization and Article; every page has unique title and description in all locales.
- [ ] **T3.10 Content load** (WBS 5.x). Load final content and images through the admin panel or seed. AC: no `TODO(board)` visible on public pages except items on the open-questions list.
- [ ] **T3.11 Gate 3 pack** (WBS 1.4). Beta demo, test status, open issues, content status. AC: beta on staging with all modules working.

**Gate 3 exit:** all 9 project pages and the platform hub work on staging; a member publishes a post and a pledge is created and confirmed; no blocking bugs.

### Phase 4: Test, launch, handover (30 Nov to 18 Dec), Gate 4

- [ ] **T4.1 Functional and cross-browser testing** (WBS 6.1). Chrome, Safari (iOS), Firefox, Samsung Internet; FR, AR, EN. AC: test log, no blocking bug.
- [ ] **T4.2 Mobile and low-bandwidth testing** (WBS 6.2). Mid-range Android on throttled 4G and slow 3G. AC: budgets in Section 7.11 met; key pages usable on slow 3G.
- [ ] **T4.3 Accessibility pass** (part of WBS 6.1). axe clean; manual keyboard and screen reader pass on Home, Campaign, Join, Admin post editor. AC: no critical or serious issues.
- [ ] **T4.4 Security and privacy check** (WBS 6.3). Rules tests, header check, dependency audit, form abuse test, pledge access test, privacy policy review. AC: checklist signed by two members.
- [ ] **T4.5 Deployment** (WBS 6.4). Production Firebase, production Netlify, domain and DNS, HTTPS, analytics, uptime check, backups. AC: site live on JLM's domain; rollback tested.
- [ ] **T4.6 Admin training and manual** (WBS 6.5). One session with the board and members; manual with screenshots. AC: a member publishes a post alone in under 15 minutes.
- [ ] **T4.7 Launch kit** (WBS 6.6). Announcement post, QR flyer, ID card print files. AC: published on JLM's social accounts; QR points to `/id`.
- [ ] **T4.8 Closure** (WBS 1.5). Handover checklist, credentials transfer to the board (not in the repo), lessons learned, final budget. AC: signed handover.

**Gate 4 exit:** site live, board trained, handover signed, goals G1 to G7 checked against targets.

### Post-launch (not graded, recommended)

- Seasonal campaigns: Ramadan (expected early to mid February 2027, depends on moon sighting) and Aïd al-Adha (expected mid May 2027). Create campaigns 3 weeks before each.
- Release 2: online card payment after the board's bank and legal steps.
- Monthly: check analytics, refresh figures, review pledges, back up data.

---

## 12. Testing and QA plan

| Layer | Tool | What | When |
| --- | --- | --- | --- |
| Static | ESLint, TypeScript, Prettier, stylelint (no physical properties) | Code quality | Every commit |
| Unit | Vitest | zod schemas, reference generator, locale fallback, currency and date formatters, sanitizer | Every commit |
| Rules | Firebase emulator tests | Firestore and Storage rules | Every pull request |
| End to end | Playwright (Chromium, WebKit, mobile viewport) | Journeys J1 to J7 in FR and AR | Every pull request |
| Accessibility | axe in Playwright | All routes, LTR and RTL | Every pull request |
| Performance | Lighthouse CI (mobile) | Budgets in Section 7.11 | Every pull request |
| Visual | Playwright screenshots | Home, Project, Campaign, ID card in FR and AR at 360 and 1280 px | Before each gate |
| Manual | Team and board | Real phones, real network, screen reader, content review | Gates 2, 3, 4 |

Definition of done for a task: code merged, tests added or updated, all checks green, docs updated, works in FR and AR, no new accessibility or performance regression, acceptance criterion demonstrated.

---

## 13. Deployment and operations

- Environments: `dev` (local with emulators), `staging` (Netlify deploy preview or branch deploy, dev Firebase project, `noindex`), `production` (Netlify, prod Firebase project).
- Branches: `main` always deployable; pull request per task; deploy previews on every pull request.
- Release checklist: build green, Lighthouse budgets met, rules deployed (`firebase deploy --only firestore:rules,storage`), env vars set, sitemap reachable, robots correct, redirects from the old annual-report URL, analytics working, error monitoring on.
- Monitoring: uptime check (free tier), Netlify function logs, weekly link checker for the 8 platforms.
- Handover: repository transferred to the association's GitHub organization (or added as owner), Netlify and Firebase ownership moved to a board email, domain registered under the association's name, credentials stored in a password manager the board owns. Never commit credentials.

---

## 14. Risks and open questions

### Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Fundraising authorization or bank account not ready | Donation button cannot go live | Build with `donationsEnabled` switch and contact fallback; ask in T1.4 |
| Only 3 weeks for build | Late beta | Start foundation in Phase 2; keep one template for 9 projects; freeze scope at Gate 2 |
| Rotating PM loses context | Rework | Handover note (D7) at each gate, single task board, this file as source of truth |
| Content arrives late | Empty pages | Start T2.13 immediately; seed content already available |
| Arabic and English quality | Weak trust | Native reviewers, fallback to French with a note, review at Gate 3 |
| Exams reduce capacity | Slips | Keep a buffer in Phase 4; prioritize J1, J5, J6 |
| Personal data and children's photos | Legal and ethical harm | Consent rule, minimal data, privacy policy, server-only pledges |
| Free tier limits (Firebase, Netlify, Brevo) | Downtime or blocked emails | Usage alerts, image budgets, static rendering |
| Platform links break | Bad experience | Weekly link checker, status badges |

### Open questions for the JLM board (answer before Gate 2 where possible)

1. Legal name of the association, registered address, publication director, and who signs off content after launch?
2. Do you have authorization for public fundraising, and an association bank account in its name? What text and number must be shown?
3. Bank details to display (holder, bank, RIB, IBAN if needed) and the confirmation email address for pledges?
4. Brand: official logo files, colors, fonts, and the year(s) of the national champion title?
5. Which social accounts and contact channels (WhatsApp number, email, phone) are official?
6. Which domain do you want (for example `jlm-ensamc.ma` or `.org`), and who will own the registration?
7. Consent process for photos of children, patients and entrepreneurs: do you already have signed forms?
8. Has the association declared its data processing to the national data protection authority, or does it need to?
9. Are the figures in the 2026 annual report final and approved for public use?
10. Who reviews Arabic and English translations, and who answers contact and sponsorship messages?
11. Should the old annual-report site redirect to the new one?

---

## 15. Appendix

### 15.1 Seed content (from the JLM Annual Report 2026, https://jlmensamcportfolio.netlify.app)

All text is in French in the source. Copy figures exactly and keep the source and date (`asOf: 2026`). Translate descriptions into AR and EN in Phase 3.

**Organization**

- Name: JLM ENSAM Casablanca, Jeunes Leaders Marocains. Active since 2014. "Champions du Maroc en titre". Motto: « Ce qu'on transmet reste ». Tagline: "Voices Aligned, Actions Amplified".
- Global figures: 11 986 beneficiaries, 7 256 km traveled, 10 technical solutions, 135 active members, 9 projects in 3 pôles, 2 caravans. Since 2014: more than 600 members trained, about 12 000 lives touched.

**Pôle Solidarité (5 projects)**

- **SmartED**: education through technology, play and experience. Science caravan, digital workshops, teaching content and equipment donated to rural schools. Figures: 1 160 children this year (about 3 900 since creation), more than 17 000 caravan visitors, 900 children at stands, 180 children from an orphanage, 80 girls of Dar Taliba, 60 h of digital training, 25 computers donated, about 1 700 km, 115 000 DH mobilized, more than 480 h of teaching content. Tools: video game Marche Verte (https://mon-jeu-marche-verte.netlify.app/), quiz Discover Morocco (https://moroccan-quiz-game.vercel.app/), heritage site (https://maroc-patrimoine.vercel.app/).
- **GODEM**: the orientation tutor for young Moroccans. From mass information to individual advice: stands, private consulting, WhatsApp follow-up and an orientation platform open day and night. Figures: about 3 500 young people supported, more than 3 400 km, more than 1 500 young people at the International Student Forum, about 2 400 face to face in 9 institutions, 168 private consulting sessions, 539 pupils in WhatsApp groups, 560 participations in ENSAM forums, 27 schools ranked online. Platform: https://godem.ensamien.com/ (27 higher-education schools by city, field and entrance exam, corrected past papers, almost all existing scholarships, new fields this year: literature and law).
- **IQRAA**: giving words back: reading, writing, communicating. Reading, tutoring, a library in douar Tizi, two engineering prototypes. Figures: about 180 beneficiaries, 48 h with children, more than 120 stories told, more than 40 orphans (6 sessions), 1 library with 50 books, more than 40 pupils (3 Olympiads), more than 100 students in book exchange, 2 prototypes (Eden AI and MIPAD). Platform: Waraqa book exchange, https://waraqa-app.netlify.app/ (more than 100 students and 60 books).
- **Golden Wishes**: fulfilling the wishes of children in an oncology service, and a digital wishes tree. Figures: 4 wishes fulfilled, about 50 children in the oncology service, about 40 children on a zoo trip (Aïn Sebaâ), 1 digital wishes tree (https://goldenwishes.netlify.app/). Handle stories and images of patients with strict consent rules.
- **JLM Junior**: training the next generation from high school. Figures: 75 high-school students trained, 9 electronics and Arduino sessions, 100 meals distributed during Ramadan, 1 morning in a retirement home.

**Pôle Environnement (3 projects)**

- **Greenovators**: ecology meets innovation. Beach and school cleanups, gardening workshops, an AI agent that reduces server carbon footprint by removing unnecessary data. Figures: 250 kg of waste this year (more than 3 tonnes since the start), 4 outings (beaches and cemetery), 6 school cleanup actions, 130 plants, 55 orphans made aware, 1 data-cleaning AI agent.
- **Recycle It**: waste as a raw material. Workshops with children and a smart platform proposing reuse ideas. Figures: 180 children, 5 field actions, 20 kg of cardboard transformed, 100 bottles and 100 straws reused, 1 platform (https://reda-hi.github.io/).
- **Get a Plet**: caring for living beings. Feeding stray animals, animal welfare awareness, a "digital shelter" in development (adoption, shop, notice board). Figures: 170 children made aware, 1 shelter site in development (https://web-production-2bc58.up.railway.app/).

**Pôle Entrepreneuriat Social (1 project)**

- **Handmade B'lkhir**: helping people build their own business. Three entrepreneurs supported. Kawtar: from 500 to 2 200 DH per month in 3 years, Ramadan peak 7 300 DH, handed the activity to her daughter Salma, support closed. Abdelhak: digitized florist, +26 % revenue in 3 months, official JLM supplier, 500 flowers offered for Women's Day, online shop https://flowers-chez-abdelhaq.netlify.app/. Brahim: cardboard furniture craftsman, support started this year. Use first names only, with consent.

**Prototypes**

- **Eden AI 2.0**: discreet device clipped to clothing that turns speech into text for a deaf person and signs into voice for a person who does not understand them; version 2.0 adds sensor rings worn on fingers; in real-condition testing; has won several competitions.
- **MIPAD**: a mouse controlled with the tongue, a dental tray with a small command pad, for people who cannot use their hands; working prototype; team is working on a more discreet and comfortable version.
- **Data-cleaning AI agent**: background algorithm that finds duplicate or obsolete data on servers, proposes a controlled cleanup (never automatic or irreversible without validation), and generates a report; functional.

**Flagship actions**

- FOCUS 6.0: theme "Last Day on Earth", 10 000 DH budget, 3 laureates equipped.
- AZUL: 76 food baskets, more than 22 000 DH given to families.
- Winter caravan Al Haouz: 11 000 DH invested, 55 families, more than 155 people.
- Caravan Lina 4.0, douar Tizi: 70 000 DH invested, 3 days, school repainted, mosque renovated, 40 pupils (lessons, certificates, school bags).
- Al Haouz well: 60 000 DH, 30 m deep, 300 families, 1 200 people.

Closing line of the report: "Ce soir, on ne vous a pas montré ce qu'on a donné. On vous a montré ce qu'on a planté."

**Campaign seeds** (amounts to be set by the board): Ramadan 2027 food baskets, Aïd al-Adha 2027 aid, Winter caravan 2027, Well or water project. Use AZUL (76 baskets, 22 000 DH) as proof of previous delivery.

### 15.2 Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
BOARD_NOTIFICATION_EMAIL=
REVALIDATE_SECRET=
NEXT_PUBLIC_ANALYTICS_TOKEN=
```

### 15.3 `CLAUDE.md` to place at the repo root

```
# JLM website: rules for Claude Code

Read JLM_WEBSITE_EXECUTION_PLAN.md first. It is the source of truth.

## Commands
- pnpm dev | pnpm build | pnpm lint | pnpm typecheck | pnpm test | pnpm e2e | pnpm seed
- Firebase emulators: pnpm emulators

## Rules
- TypeScript strict, zod validation on every input, no `any`.
- Locales: fr (default), ar (RTL), en. Interface strings in src/messages, content in Firestore.
- Use CSS logical properties only (ms-, me-, ps-, pe-, start-, end-). Test every page in fr and ar.
- Server components by default; client components only when needed.
- Never hardcode secrets, RIB, phone numbers, emails. Use env vars or Firestore settings.
- Never invent JLM facts. Use seed content or write TODO(board) and log it in docs/OPEN_QUESTIONS.md.
- Pledges and messages are server-only (Admin SDK). No client access.
- Performance budgets and accessibility (WCAG 2.2 AA) are hard requirements.
- Commit with Conventional Commits, one pull request per task, tick the task in the plan.
- Record decisions in docs/DECISIONS.md.

## Definition of done
Code merged, tests added, lint, typecheck, unit, e2e, axe and Lighthouse budgets green, works in fr and ar, docs updated.
```

### 15.4 Starter prompts to give Claude Code

1. "Read JLM_WEBSITE_EXECUTION_PLAN.md and CLAUDE.md. Do task T1.1 only. Show me the commands to verify it."
2. "Do T2.6 and T2.7. Show the design system page in fr and ar with screenshots."
3. "Do T2.8. Write the Firestore rules and the rules tests first, then the seed script."
4. "Do T3.5 (donation module). Start with the Playwright test for journey J1, then implement until it passes."
5. "Run the full check suite, list every failing budget or rule, and fix them one by one."

---

End of plan.
