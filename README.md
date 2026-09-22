# Laundry Shop — Astro Website Template

A reusable, multilingual (**English / Sinhala / Tamil**) one-page website for laundry shops. Built as a **concept/demo** to pitch shop owners in Sri Lanka, and designed to be cloned per client, re-branded, and deployed as a **Cloudflare Worker**.

- **Static** Astro site, all CTAs open **WhatsApp**.
- **Same layout, swapped brand tokens** — colour + font presets, logo, copy, section toggles.
- **Per-client private GitHub repo** → push-to-deploy via Cloudflare Workers Builds.

Full details live in [`docs/`](./docs/README.md).

## Requirements

- **Node 22+**
- **pnpm 12** — if `pnpm` isn't on your PATH, use `corepack pnpm` (e.g. `corepack pnpm install`).

## Quick start

```sh
pnpm install
pnpm dev        # local dev (runs on the Cloudflare workerd runtime)
pnpm build      # production build → dist/
pnpm preview    # preview the built Worker locally
pnpm check      # types + content check
```

## Create a client site

```sh
gh repo create <client-slug> \
  --template <org>/concept-laundry-shop \
  --private --clone
cd <client-slug>
pnpm install
pnpm setup      # interactive: brand, contact, locales, theme, worker name
git add -A && git commit -m "Configure client"
git push        # Cloudflare Workers Builds deploys on push
```

Then in the Cloudflare dashboard: **Workers & Pages → Create → connect the repo**, with:

- Build command: `npx astro build`
- Deploy command: `npx wrangler deploy`

See [`docs/deployment.md`](./docs/deployment.md) for email, domains, and secrets.

## Customisation map

| I want to change… | Edit this |
|---|---|
| Brand, contact, currency, locales, theme, section toggles | `site.config.ts` |
| Theme preset (colour + fonts) | `src/styles/theme.css` (imports a file in `src/styles/themes/`) |
| All user-facing copy (EN/SI/TA) | `src/i18n/{en,si,ta}.json` |
| Logo, favicon, OG image, imagery | `public/` |

## Project structure

```
.
├─ AGENTS.md                 # contributor / AI agent guide
├─ docs/                     # source of truth
├─ astro.config.mjs          # adapter, i18n, tailwind, sitemap
├─ wrangler.jsonc            # Worker name + compatibility + 404 handling
├─ site.config.ts            # per-client configuration
├─ scripts/setup.mjs         # interactive client setup
└─ src/
   ├─ components/            # Header, Hero, Services, Pricing, FAQ, … 
   ├─ i18n/{en,si,ta}.json   # UI strings + all marketing copy
   ├─ i18n/utils.ts          # t(), localePath(), whatsappLink(), …
   ├─ layouts/BaseLayout.astro
   ├─ pages/
   │  ├─ index.astro         # English at /
   │  ├─ [lang]/index.astro  # Sinhala at /si/, Tamil at /ta/
   │  ├─ privacy.astro, terms.astro (+ localised)
   │  ├─ 404.astro
   │  └─ robots.txt.ts
   └─ styles/
      ├─ global.css
      ├─ theme.css           # active preset switch
      └─ themes/*.css        # fresh-blue, aqua-teal, citrus, rose, indigo-night, emerald-eco
```

## Notes

- **WhatsApp-only by default.** An optional email adapter can be enabled per client later — see `docs/deployment.md`.
- **Static output.** The only on-demand endpoint in a deployed site would be an optional email route; the concept ships without one.
- Demo content is placeholder ("FreshFold Laundry", Nugegoda) and is replaced per client.
