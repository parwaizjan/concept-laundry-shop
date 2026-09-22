# AGENTS.md — concept-laundry-shop

Guidance for AI agents and humans working in this repository. Keep this file accurate; if reality diverges from it, update it.

## What this is

A reusable **Astro** website template for **laundry shops**, built initially as a **concept/demo** to pitch laundry shop owners in **Sri Lanka**. A single master template repo doubles as the live demo. Each client site is a clone of the template with branding/content swapped, deployed as a **Cloudflare Worker** from a **private GitHub repo**.

## Current status

**Built and passing checks; not yet deployed.** Phases 0–7 of `docs/roadmap.md` are done: the Astro site builds (`pnpm build`), type-checks (`pnpm check`), and passes `wrangler deploy --dry-run`. The private repo is at `github.com/parwaizjan/concept-laundry-shop` (branch `main`). Remaining: connect Cloudflare Workers Builds, deploy, set the real `site.config.ts → url`, and record the demo URL (Phase 8).

## Read these first (source of truth)

1. `docs/product.md` — what the concept is, audience, demo brand, page sections.
2. `docs/decisions.md` — every locked decision and its rationale.
3. `docs/architecture.md` — stack, repo structure, i18n, theming.
4. `docs/deployment.md` — Cloudflare accounts, Workers Builds, email.
5. `docs/content.md` — content model and "edit this file for X" map.
6. `docs/roadmap.md` — build phases and progress.

## Golden rules

- **Read `/docs` before changing anything.**
- **Keep `/docs` updated.** When a decision, structure, workflow, or fact changes, update the relevant doc and `docs/decisions.md`. Documentation is the durable memory across conversations.
- **The template *is* the demo.** Do not fork the demo into a separate codebase; keep them the same tree.
- **Static by default, WhatsApp by default.** The concept ships static with WhatsApp CTAs. Email is an optional adapter that is **off by default**.
- **Don't commit secrets.** Cloudflare credentials live in the dashboard; any deploy tokens live in GitHub/Cloudflare secrets, never in the repo.
- **Don't add dependencies without a decision-log entry.** Prefer the stack in `docs/architecture.md`.

## Locked decisions (summary — full detail in `docs/decisions.md`)

- Reuse model: **template repo per client** (GitHub template → clone → configure).
- Differentiation: **same layout, swap brand tokens** (color + font presets, logo, photos, copy, section toggles).
- Market: **Sri Lanka**. English at `/`, Sinhala at `/si/`, Tamil at `/ta/`. Language toggle. Locales toggleable per client.
- Contact: **WhatsApp only** (floating button + all CTAs). Email adapter scaffolded but off.
- Email (when enabled): **Cloudflare Email Sending → verified destination address** (free on all plans). Escalate to Workers Paid for arbitrary recipients / customer auto-replies.
- Infrastructure: **central agency Cloudflare account**; **Cloudflare Workers Builds** (Git integration) for push-to-deploy.
- Theme presets: **5–6** (color + font tokens).
- Analytics: **none** for the concept.
- Page structure: **single-page** (anchored sections) **+ legal pages**.
- Design vibe: **clean & fresh**.
- CLI: **in-repo `pnpm setup`** after creating the repo, driven by the GitHub template + `gh`.
- Imagery: **free stock placeholders** (Unsplash/Pexels) with a swap checklist.
- Content edits: performed by the agency (us) on request; all copy lives in per-locale JSON (`src/i18n/{en,si,ta}.json`).

## Directory map

```
concept-laundry-shop/
├─ AGENTS.md
├─ README.md                 # quick start + edit map + spin-up steps
├─ docs/                     # source of truth (this documentation)
├─ astro.config.mjs          # @astrojs/cloudflare, tailwind, i18n, sitemap
├─ wrangler.jsonc            # worker name, compatibility, 404 handling
├─ site.config.ts            # per-client brand, contact, locales, theme, sections
├─ scripts/setup.mjs         # interactive client setup CLI
├─ pnpm-workspace.yaml       # pnpm 12 `allowBuilds`
├─ public/                   # logo.svg, favicon.svg, og.svg
└─ src/
   ├─ i18n/{en,si,ta}.json   # UI strings + all marketing copy
   ├─ i18n/utils.ts          # useTranslations(), localizedPath(), whatsappLink(), navSections
   ├─ styles/global.css      # tailwind + token mapping
   ├─ styles/theme.css       # active theme preset import (rewritten by setup)
   ├─ styles/themes/*.css    # 6 presets (tokens)
   ├─ components/            # Home, LegalPage, Header, Footer, LangToggle, WhatsAppFab,
   │                         # Button, Icon, SectionHeading, Hero, TrustBar, Services,
   │                         # HowItWorks, Pricing, Testimonials, Faq, LocationMap, ContactCta
   ├─ layouts/BaseLayout.astro
   └─ pages/
      ├─ index.astro                 # default locale at /
      ├─ [lang]/index.astro          # other locales (/si/, /ta/)
      ├─ privacy.astro / terms.astro # + [lang]/ variants
      ├─ 404.astro
      ├─ robots.txt.ts               # generated (absolute sitemap URL)
      └─ api/notify.ts               # optional email adapter (not built yet; prerender = false)
```

## Commands

```sh
pnpm install       # install deps (corepack pnpm install if pnpm missing)
pnpm dev           # local dev on the workerd runtime
pnpm build         # astro build → dist/
pnpm preview       # preview the built Worker
pnpm check         # astro check (types)
pnpm setup         # interactive client configuration (scripts/setup.mjs)
pnpm deploy        # wrangler deploy (or rely on Workers Builds)
```

## Conventions

- **Astro 7**, **Tailwind v4** (`@tailwindcss/vite`), **`@astrojs/cloudflare`** adapter (v14).
- **TypeScript pinned to 6.x** (`astro check` needs the TS programmatic API; TS 7 not yet supported).
- **pnpm 12**; extra allowed build scripts are declared in `pnpm-workspace.yaml` (`allowBuilds`). If `pnpm` is not on PATH, use `corepack pnpm`.
- Self-hosted variable fonts via **Fontsource** (Latin + Noto Sans Sinhala + Noto Sans Tamil). No external font requests.
- **All copy lives in `src/i18n/{en,si,ta}.json`** and the three files must stay structurally identical (see D-018). No Astro Content Collections in this template.
- Keep brand/contact/locale/theme/section toggles in `site.config.ts`; never hardcode them in components.
- Keep components small, accessible (semantic HTML, labels, focus states), and mobile-first.
- Zero client-side JS by default; the optional email route is the sole on-demand endpoint.
