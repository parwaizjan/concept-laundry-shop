# Roadmap

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

## Phase 0 — Documentation ✅

- [x] Lock decisions and capture them in `docs/decisions.md`.
- [x] Write product, architecture, content, deployment docs.
- [x] Write `AGENTS.md`.

## Phase 1 — Skeleton ✅

- [x] `pnpm` + Astro 7 project init.
- [x] Install `@astrojs/cloudflare`, `@tailwindcss/vite`, `@astrojs/sitemap`, Fontsource.
- [x] `astro.config.mjs`: adapter, tailwind, i18n, sitemap.
- [x] `wrangler.jsonc` with worker name, compatibility, 404 handling.
- [x] `site.config.ts` with the full shape.
- [x] Base stylesheet and `BaseLayout.astro`.
- [x] Verified: `pnpm build`, `pnpm check`, `wrangler deploy --dry-run`.

## Phase 2 — Design system & themes ✅

- [x] Design tokens as CSS variables / `@theme inline`.
- [x] Six theme presets + `theme.css` switch.
- [x] Fontsource: five Latin variable fonts + Noto Sans Sinhala + Noto Sans Tamil.
- [x] Core UI primitives (`Button`, `Icon`, `SectionHeading`).

## Phase 3 — Sections & pages ✅

- [x] Header + LangToggle, Footer, WhatsAppFab.
- [x] Hero, TrustBar, Services, HowItWorks, Pricing, Testimonials, Faq, LocationMap, ContactCta.
- [x] One-page assembly (`Home.astro`, `index.astro`, `[lang]/index.astro`).
- [x] Privacy + Terms pages (default + localised).
- [x] 404 page.

## Phase 4 — i18n & content ✅

- [x] `src/i18n/{en,si,ta}.json` complete (UI + all marketing copy).
- [x] `src/i18n/utils.ts` (typed catalog, paths, WhatsApp links, nav).
- [x] English demo content + Sinhala/Tamil translations.
- [x] Language toggle + `hreflang` alternates.

## Phase 5 — SEO, a11y, polish ✅

- [x] Per-page meta, canonical, hreflang, OG/Twitter tags.
- [x] Sitemap + generated `robots.txt`.
- [x] 404 handling on Workers assets.
- [x] Accessible labels, focus states, semantic landmarks; mobile-first layout.
- [x] Known follow-up: native-speaker review of SI/TA copy.

## Phase 6 — Setup CLI ✅

- [x] `scripts/setup.mjs` interactive prompts (dependency-free).
- [x] Rewrites `site.config.ts`, theme, Worker/repo name; swaps demo brand in catalogs.
- [x] Prints next steps for git + Cloudflare.

## Phase 7 — Docs & onboarding ✅

- [x] `README.md` quick start + edit map.
- [x] Deployment + content docs reflect the built reality.

## Phase 8 — Deploy demo ⏳ (needs Cloudflare access)

- [x] Create the private GitHub repo and push this tree: `github.com/parwaizjan/concept-laundry-shop` (branch `main`).
- [ ] Connect it to Workers Builds (build `npx astro build`, deploy `npx wrangler deploy`).
- [ ] Attach a domain / workers.dev URL and verify on mobile.
- [ ] Set `site.config.ts → url` to the live URL (canonical/sitemap currently use the placeholder).
- [ ] Record the demo URL here.
- [ ] Optionally mark the repo as a GitHub **template** for the per-client clone flow (D-001).

## Backlog / ideas

- Optional contact form + Cloudflare email adapter.
- PR preview deployments (GitHub Actions).
- Published `npm create` CLI.
- Order tracking / blog / promos.
- More layout variants or a hero-image slot per preset.
- Analytics (Cloudflare Web Analytics) per client.
