# Architecture

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Astro 7** (`7.3.3`) | Static-first, island-free content site. |
| Styling | **Tailwind CSS v4** (`4.3.3`) via `@tailwindcss/vite` | Design tokens as CSS variables / `@theme`. |
| Adapter | **`@astrojs/cloudflare`** (`14.3.2`) | Static output; on-demand only for an optional email route. |
| i18n | **Astro built-in i18n** + per-locale JSON | `defaultLocale` from config, `prefixDefaultLocale: false`. |
| Fonts | **Fontsource variable** (self-hosted) | Plus Jakarta Sans, Inter, DM Sans, Sora, Manrope + Noto Sans Sinhala + Noto Sans Tamil. No external requests. |
| SEO | **`@astrojs/sitemap`** (`3.7.4`) | Plus per-page meta, canonical, hreflang alternates, OG. |
| Content | **Per-locale JSON catalogs** | All copy in `src/i18n/{en,si,ta}.json`. See D-018. |
| Runtime | **Cloudflare Workers** | Deployed via Workers Builds. |
| Toolchain | **Node 22**, **pnpm 12**, **TypeScript 6** | See D-016 for version-pin rationale. |

### Build output (Astro 7 + adapter v14)

- `astro build` emits static assets to `dist/client/` and server code to `dist/server/`; for this all-static site `dist/server/` is empty.
- The adapter generates `dist/client/wrangler.json` and a `.wrangler/deploy/config.json` redirect. Running `wrangler deploy` from the repo root automatically uses the generated config (assets directory resolved to `dist/client`). The root `wrangler.jsonc` therefore only needs `name`, compatibility settings, `main`, `assets.not_found_handling`, and any bindings.
- `session: false` avoids provisioning a session KV namespace (site is static).
- `imageService: 'passthrough'` avoids provisioning the Cloudflare Images binding; imagery is pre-sized and served via plain `<img>`.
- Dev and preview run on the real `workerd` runtime (Astro 6+ behaviour).

## Static vs on-demand

- All pages are prerendered. `src/pages/robots.txt.ts` is also prerendered.
- A deployed client may later add an optional email route at `src/pages/api/notify.ts` with `export const prerender = false`; only that route would run on the Worker. The concept ships without it.

## Repo structure

```
concept-laundry-shop/
├─ AGENTS.md
├─ README.md
├─ docs/
├─ astro.config.mjs          # adapter, i18n, tailwind, sitemap
├─ wrangler.jsonc            # worker name, compatibility, 404 handling
├─ site.config.ts            # per-client brand/contact/locales/preset/sections
├─ scripts/setup.mjs         # interactive client setup CLI
├─ public/                   # logo.svg, favicon.svg, og.svg
└─ src/
   ├─ components/
   │  ├─ Home.astro          # composes the one-page sections
   │  ├─ LegalPage.astro     # privacy / terms layout
   │  ├─ Header.astro, Footer.astro, WhatsAppFab.astro, LangToggle.astro
   │  ├─ Button.astro, Icon.astro, SectionHeading.astro
   │  ├─ Hero.astro, TrustBar.astro, Services.astro, HowItWorks.astro
   │  └─ Pricing.astro, Estimator.astro, Testimonials.astro, Faq.astro,
   │     Care.astro, ServiceArea.astro, LocationMap.astro, ContactCta.astro
   ├─ i18n/
   │  ├─ en.json, si.json, ta.json   # UI strings + all marketing copy
   │  └─ utils.ts                    # t(), localePath(), whatsappLink(), navSections
   ├─ layouts/BaseLayout.astro
   ├─ pages/
   │  ├─ index.astro                 # default locale at /
   │  ├─ [lang]/index.astro          # other locales (/si/, /ta/)
   │  ├─ privacy.astro, terms.astro   # default locale
   │  ├─ [lang]/privacy.astro, [lang]/terms.astro
   │  ├─ 404.astro
   │  └─ robots.txt.ts
   └─ styles/
      ├─ global.css                  # tailwind + token mapping + base/components
      ├─ theme.css                   # active preset import (rewritten by setup)
      └─ themes/{fresh-blue,aqua-teal,citrus,rose,indigo-night,emerald-eco}.css
```

## Configuration surface (`site.config.ts`)

Single source of truth per client, rewritten by `pnpm setup`:

```ts
{
  url,                                  // site origin (sitemap, canonical, OG)
  indexable,                            // false = noindex + robots Disallow (concept)
  brand:   { name, tagline, logo, ogImage },
  contact: { whatsapp, phone, email, address, mapUrl, reviewsUrl },
  locale:  { default: 'en', enabled: ['en','si','ta'] },
  theme:   'fresh-blue',                // one of the theme presets
  currency, currencySymbol,
  sections: { hero, trust, services, howItWorks, pricing, estimator, testimonials, faq, area, location, contact },
}
```

Components read from here and from `src/i18n` — never hardcode brand, phone, or currency.

## i18n strategy

- Default locale served at `/`; other locales at `/<locale>/` (e.g. `/si/`, `/ta/`). Controlled by `defaultLocale` + `enabled` in `site.config.ts` and Astro's `redirectToDefaultLocale: false` / `prefixDefaultLocale: false`.
- All user-facing strings and structured copy (services, pricing, FAQ, testimonials, legal) live in `src/i18n/{en,si,ta}.json`. Keeping the three languages in parallel files makes translation sync and diffs easy.
- `useTranslations(locale)` returns the typed catalog (typed against `en.json`, so the three files must stay structurally identical).
- `localizedPath(path, locale)` / `switchLocalePath(pathname, target)` build links; `LangToggle` links to the same page in every enabled locale.
- `BaseLayout` emits `hreflang` alternates (including `x-default`) and `og:locale`.
- Missing translations would fall back to the default catalog (files are kept in sync; no gaps expected).
- WhatsApp pre-filled messages are localized.

## Theming

- Design tokens (CSS variables): `--brand`, `--brand-strong`, `--brand-fg`, `--accent`, `--surface`, `--surface-muted`, `--ink`, `--ink-muted`, `--ring`, `--brand-radius`, `--display-font`, `--body-font`.
- Each preset lives in `src/styles/themes/<name>.css`; `src/styles/theme.css` imports the active one and is rewritten by `pnpm setup`.
- `global.css` maps tokens to Tailwind via `@theme inline` (e.g. `--color-brand`, `--font-display`, `--radius-brand`), so utilities like `bg-brand`, `text-ink-muted`, `rounded-brand` work.
- Presets: `fresh-blue` (default), `aqua-teal`, `citrus`, `rose`, `indigo-night`, `emerald-eco`.
- Font pairs drawn from Plus Jakarta Sans, Inter, DM Sans, Sora, Manrope — every stack also lists Noto Sans Sinhala and Noto Sans Tamil so Indic glyphs always render. Fontsource CSS uses `unicode-range`, so only the needed subsets download.

## Components

`Home` composes the sections in order, gated by `siteConfig.sections`: `Hero → TrustBar → Services → HowItWorks → Pricing → Estimator → Testimonials → Faq → Care → ServiceArea → LocationMap → ContactCta`. `Header` (with `LangToggle`) and `Footer` wrap the page; `WhatsAppFab` floats on all pages.

Guidelines: semantic HTML, accessible labels and focus states, mobile-first, no hardcoded brand values, no client-side framework islands. The only shipped JavaScript is a few tiny inline scripts: closing the mobile menu (`<details>`), computing the price estimator total/WhatsApp breakdown, and the service-area lookup. Each degrades gracefully without JS.

## Indexing

- `siteConfig.indexable` drives two things: `BaseLayout` adds `<meta name="robots" content="noindex, nofollow">` when `false`, and `src/pages/robots.txt.ts` returns `Disallow: /` (no sitemap) when `false`.
- The concept ships `false`; client clones flip it to `true` in `pnpm setup`.
- The sitemap is still generated for the build; it is simply not advertised or crawlable while `indexable` is `false`.

## Optional email adapter (off by default)

- Route: `src/pages/api/notify.ts` (`prerender = false`).
- Enabled only when a client opts in (`site.config.ts`), and only used if a contact form is added.
- Uses the Cloudflare `send_email` binding (`env.EMAIL.send(...)`) to a **verified destination address**.
- See `deployment.md` for setup and pricing. Keep provider logic isolated so it can be swapped.
