# Content Model & Edit Map

Content is managed by the **agency (us)**. When a client calls/WhatsApps a change, we edit the relevant file and push; Cloudflare Workers Builds deploys.

All user-facing copy lives in **three parallel locale catalogs**: `src/i18n/en.json`, `src/i18n/si.json`, `src/i18n/ta.json`. They must keep an identical structure — `src/i18n/utils.ts` types the returned messages against `en.json`, so a missing key is a type error.

## Where content lives

| I want to change… | Edit this |
|---|---|
| Brand name, tagline, logo, OG image | `site.config.ts` → `brand` |
| WhatsApp number, phone, email, address, map link | `site.config.ts` → `contact` |
| Currency, default locale, enabled locales | `site.config.ts` → `locale`, `currency` |
| Search-engine indexing (off for the concept) | `site.config.ts` → `indexable` |
| Google reviews destination | `site.config.ts` → `contact.reviewsUrl` |
| Theme preset | `src/styles/theme.css` (or `pnpm setup`) |
| Section visibility | `site.config.ts` → `sections` |
| Page title + meta description | `en.json`/`si.json`/`ta.json` → `meta` |
| Nav labels, buttons, generic UI text | `…json` → `nav`, `actions`, `footer` |
| Hero headline, subtext, bullet points | `…json` → `hero` |
| Stat strip | `…json` → `trust.items` |
| Services list (name, description, price, unit) | `…json` → `services.items` |
| How-it-works steps | `…json` → `howItWorks.steps` |
| Pricing groups and rows | `…json` → `pricing.groups` |
| Price estimator items, units, labels | `…json` → `estimator` |
| Service-area places and messages | `…json` → `area` |
| Care guide tips | `…json` → `care` |
| Testimonials | `…json` → `testimonials.items` |
| FAQ | `…json` → `faq.items` |
| Location copy + opening hours | `…json` → `location` |
| Contact CTA + pre-filled WhatsApp message | `…json` → `contact` |
| Privacy / Terms copy | `…json` → `legal.privacy`, `legal.terms` |
| Logo, favicon, OG image, photos | `public/` (see swap checklist) |

> If file paths shift, update this table and `architecture.md` in the same change.

## Rules

- **Never hardcode** brand names, phone numbers, addresses, or currency in components — read from `site.config.ts` / `src/i18n`.
- Keep `en`, `si`, `ta` structurally identical. Arrays should have the same length so list order matches.
- Prices are strings (e.g. `"Rs. 250"`) so each locale can format them naturally.
- Demo placeholder values (see `product.md`) are replaced before a client goes live.
- `pnpm setup` swaps the demo brand name inside the catalogs, but **real copy still needs editing by hand**.

## Imagery swap checklist

1. Replace `public/logo.svg` with the client logo (square, transparent or on-brand background).
2. Replace `public/favicon.svg`.
3. Replace `public/og.svg` with a **raster** OG image (1200×630 PNG/JPG is best supported by social platforms) and point `site.config.ts → brand.ogImage` at it.
4. Add client photos (shop, staff, clean laundry) under `public/` and reference them from the relevant component.
5. Confirm licensing/attribution for any stock images retained (Unsplash/Pexels).

## Localisation checklist (per client)

- [ ] Decide enabled locales (`en`, `si`, `ta`) and the default.
- [ ] Translate every key in each enabled catalog.
- [ ] Localise the pre-filled WhatsApp message (`contact.whatsappMessage`).
- [ ] Verify currency formatting (`currency` / `currencySymbol`) and phone format (`+94…`).
- [ ] Have a native speaker review Sinhala/Tamil copy.

## Adding a new section

1. Add the copy keys to all three catalogs.
2. Create the component under `src/components/`.
3. Compose it in `src/components/Home.astro` behind a `site.config.ts → sections` flag (and add the flag + type).
4. Add a nav entry in `src/i18n/utils.ts` (`navSections`) if it should appear in the menu.
5. Update `architecture.md` and this table.
