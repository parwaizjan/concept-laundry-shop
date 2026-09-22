# Documentation Index

Source of truth for the **concept-laundry-shop** project. If code and docs disagree, fix one of them immediately.

| Doc | Contents |
|---|---|
| [`product.md`](./product.md) | What the concept is, audience, pitch value, demo brand, page sections. |
| [`decisions.md`](./decisions.md) | Full decision log (every locked choice + rationale + alternatives). |
| [`architecture.md`](./architecture.md) | Stack, repo structure, i18n strategy, theming, component inventory. |
| [`content.md`](./content.md) | Content model and "edit this file for X" map. |
| [`deployment.md`](./deployment.md) | Cloudflare accounts, Workers Builds, email sending, DNS. |
| [`roadmap.md`](./roadmap.md) | Build phases and current status. |

## Documentation maintenance rule

- **Update docs in the same change that alters behaviour, structure, or decisions.**
- New decision → add an entry to `decisions.md`.
- New/changed file layout → update `architecture.md` and `AGENTS.md`.
- Completed phase → tick it in `roadmap.md`.
- Keep IDs and tables stable; append rather than rewrite history where possible.

## Status

**Pre-build.** Documentation only; no application code yet.
