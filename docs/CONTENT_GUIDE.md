# Content guide — how members write posts and update figures

## Consent rule (do not skip)

Any person shown by name or face in content — a beneficiary, patient, child, entrepreneur, team member — needs a `consent: true` field set before publishing. For minors: no full names, prefer non-identifying images. This is enforced in the data model (`Project.leads`, `TeamMember.consent`) but publishing discipline is still on the editor, not just the schema.

## Figures and sources

Never type a number into a page component. Every figure on the site comes from a `stats` or `flagshipActions` document in Firestore, each with a `source` and an `asOf` date. If you don't have a source and date, don't publish the figure yet — ask in the team sync instead.

## Writing for three languages

- French first (the source language for most content), then Arabic, then English.
- Arabic: clear Modern Standard Arabic, avoid overly formal phrasing. Never justify or letter-space Arabic text.
- If a translation isn't ready, publish anyway — the site shows a "Traduction en cours" fallback to French rather than blocking the post.

## Images

Alt text is mandatory on upload (the admin image uploader enforces this). Caption photos with place and year. Resize to max 1600px wide before uploading (the uploader does this automatically).
