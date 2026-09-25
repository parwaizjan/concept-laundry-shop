# Decision Log

Append-only. Each entry: ID, date, decision, rationale, alternatives considered.

---

## D-001 — Reuse model: template repo per client

- **Date:** 2026-09-22
- **Decision:** Maintain one master template repo. Each client site is a clone into its own private GitHub repo.
- **Rationale:** Clean isolation, matches one-Worker-per-client, simple mental model, Git-integrated deploys.
- **Alternatives:** Config-driven single codebase (rejected: coupling); monorepo folder-per-client (rejected: overkill).

## D-002 — Differentiation: same layout, swap brand tokens

- **Date:** 2026-09-22
- **Decision:** Keep one layout; differentiate clients through brand tokens (color + font), logo, photos, copy, and section toggles.
- **Rationale:** Fast, reliable, maintainable; still visually distinct across clients.
- **Alternatives:** Multiple layout themes (deferred); bespoke per client (rejected: not reusable).

## D-003 — Market and languages: Sri Lanka, EN/SI/TA

- **Date:** 2026-09-22
- **Decision:** English primary at `/`; Sinhala at `/si/`; Tamil at `/ta/`. Header language toggle. Locales toggleable per client.
- **Rationale:** Serves the local market; opt-in keeps simple clients simple.
- **Alternatives:** English-only (rejected: limits reach).

## D-004 — Contact model: WhatsApp only (default)

- **Date:** 2026-09-22
- **Decision:** All CTAs and the floating action button open WhatsApp with a pre-filled, localized message. No web form by default.
- **Rationale:** Matches local behaviour, zero backend, zero cost, immediate for the owner.
- **Alternatives:** Contact/booking form (deferred to email module).

## D-005 — Email: Cloudflare Email Sending to verified destinations

- **Date:** 2026-09-22
- **Decision:** When email is enabled for a client, use Cloudflare Email Sending via the `send_email` Worker binding, sending to a **verified destination address**. Keep it behind a config flag (off by default).
- **Rationale:** Free on all plans (including free, with only Email Routing configured); no third-party API key; stays within Cloudflare. Sending to verified destinations does not count toward quota or daily limits.
- **Escalation:** Arbitrary recipients and customer auto-replies require **Workers Paid** ($5/mo; 3,000 outbound/month included, then $0.35/1,000).
- **Alternatives:** Resend (free 3k/mo) — viable fallback; Brevo/SES — cheap at volume, more setup; Web3Forms — zero backend but not Cloudflare-native.

## D-006 — Infrastructure: central agency Cloudflare account + Workers Builds

- **Date:** 2026-09-22
- **Decision:** All sites and domains live in a central agency Cloudflare account. Deploys use Cloudflare **Workers Builds** connected to each private repo; push = build + deploy.
- **Rationale:** Central ops, simplest email destination verification, native Git integration.
- **Alternatives:** GitHub Actions + wrangler (viable later for PR previews); manual deploys (rejected).

## D-007 — Theme presets: 5–6

- **Date:** 2026-09-22
- **Decision:** Ship 5–6 presets (color + font pair). Applied through design tokens.
- **Rationale:** Enough variety to make clients look distinct while sharing structure.

## D-008 — Analytics: none

- **Date:** 2026-09-22
- **Decision:** No analytics in the concept.
- **Rationale:** Keeps the concept lean; can be added per client later.

## D-009 — Page structure: single page + legal

- **Date:** 2026-09-22
- **Decision:** One landing page with anchored sections, plus Privacy and Terms pages.
- **Rationale:** Best fit for a laundry shop pitch; fast to read on mobile.

## D-010 — Design vibe: clean & fresh

- **Date:** 2026-09-22
- **Decision:** Bright, airy, soft blue/teal, rounded, friendly.

## D-011 — CLI: in-repo `pnpm setup`

- **Date:** 2026-09-22
- **Decision:** Client creation uses GitHub template + `gh repo create --template ... --private --clone`, then `pnpm setup` (interactive) writes config/theme/locales.
- **Rationale:** No npm publishing needed; easy iteration; plays to available `gh` tooling.
- **Alternatives:** Published `npm create` CLI (deferred until volume justifies).

## D-012 — Content editing: agency-managed, structured files

- **Date:** 2026-09-22
- **Decision:** The agency (us) performs edits on request. Copy lives in per-locale JSON; structured content in content collections. Provide an "edit-this-for-X" map.
- **Rationale:** Fast, safe, low-risk edits without a CMS.

## D-013 — Imagery: free stock placeholders

- **Date:** 2026-09-22
- **Decision:** Use licensed-free stock images (Unsplash/Pexels) as placeholders, with a documented swap checklist.

## D-014 — Documentation-first

- **Date:** 2026-09-22
- **Decision:** Document the project under `/docs` and maintain `AGENTS.md` before writing application code, and keep them updated throughout.
- **Rationale:** Durable context across conversations; prevents loss of decisions.

## D-015 — Demo content is invented

- **Date:** 2026-09-22
- **Decision:** For the demo, invent a placeholder Sri Lankan brand ("FreshFold Laundry", Nugegoda/Colombo, LKR pricing).

## D-016 — Toolchain versions and pins

- **Date:** 2026-09-22
- **Decision:**
  - **Astro 7.3.3**, **`@astrojs/cloudflare` 14.3.2**, **Tailwind CSS 4.3.3**, **`@astrojs/sitemap` 3.7.4**.
  - **TypeScript pinned to `^6.0.3`** (not 7.x). `astro check` relies on the TypeScript programmatic API, which the native TS 7 compiler does not yet expose.
  - **`wrangler` pinned to `4.135.0`** (exact) to satisfy pnpm 12's built-in 24h `minimumReleaseAge` supply-chain gate; bump deliberately.
  - **pnpm 12** with `pnpm-workspace.yaml` setting `allowBuilds` for `esbuild` and `workerd`.
- **Rationale:** Reproducible installs that pass pnpm's supply-chain policy and `astro check` on the current toolchain.
- **Alternatives:** TS 7 (blocked by `astro check`); disabling `minimumReleaseAge` (rejected: keeps security gate).

## D-017 — Static output layout and wrangler config

- **Date:** 2026-09-22
- **Decision:** Keep a minimal root `wrangler.jsonc` (`name`, `compatibility_date`, `nodejs_compat`, `main: @astrojs/cloudflare/entrypoints/server`, observability). Let the Cloudflare adapter manage the assets directory via its generated redirect config. Set `session: false` and `imageService: 'passthrough'`.
- **Rationale:** Astro 7 emits assets to `dist/client/` and the adapter redirects `wrangler deploy` to the generated config; hand-specifying `assets.directory` is misleading and unnecessary. Avoids provisioning KV/Images bindings for a static site.
- **Alternatives:** Explicit `assets.directory: ./dist` (wrong for adapter output); leaving sessions/images at defaults (unneeded bindings).

---

## D-018 — Content lives in per-locale JSON (supersedes content-collections detail of D-012)

- **Date:** 2026-09-22
- **Decision:** Keep **all** user-facing copy — UI strings and structured lists (services, pricing, FAQ, testimonials, legal) — in three parallel files: `src/i18n/{en,si,ta}.json`. Do **not** use Astro Content Collections for this template.
- **Rationale:** The three languages stay side-by-side and structurally identical; translations are easy to diff and review; `en.json` types the catalog so missing keys become type errors. For an agency doing all edits, one file per language is faster to change than per-locale collections.
- **Alternatives:** Content Collections with a `locale` field (rejected: more files, harder translation parity, no clear benefit for a fixed one-page site).

## D-019 — Theme presets finalised

- **Date:** 2026-09-22
- **Decision:** Ship presets `fresh-blue` (default), `aqua-teal`, `citrus`, `rose`, `indigo-night`, `emerald-eco`. A single `src/styles/theme.css` imports the active preset and is rewritten by `pnpm setup`.
- **Fonts:** Plus Jakarta Sans, Inter, DM Sans, Sora, Manrope (Latin) + Noto Sans Sinhala + Noto Sans Tamil, all via Fontsource.

## D-020 — 404 handling and generated robots.txt

- **Date:** 2026-09-22
- **Decision:** Add `src/pages/404.astro` and set `assets.not_found_handling: "404-page"` in `wrangler.jsonc`; generate `robots.txt` from `src/pages/robots.txt.ts` so the sitemap URL is absolute.
- **Rationale:** Correct 404s on Workers static assets; robots.txt must not hardcode a domain that changes per client.

## D-021 — Search-engine visibility is configurable; concept is `noindex`

- **Date:** 2026-09-22
- **Decision:** Add `indexable: boolean` to `site.config.ts`. The concept/demo ships **`false`**: `BaseLayout` emits `<meta name="robots" content="noindex, nofollow">` and `robots.txt` returns `Disallow: /` (no sitemap). Client clones set `indexable: true` via `pnpm setup`, restoring `Allow: /` + absolute `Sitemap:` URL.
- **Rationale:** The concept is a pitch tool shared by link/WhatsApp and must not be indexed; real client sites do want SEO. One flag covers both.
- **Alternatives:** Hardcoded noindex (rejected: client sites need indexing); removing the demo from a domain (rejected: no custom domain).

## D-022 — Mobile-first, CSS-first navigation

- **Date:** 2026-09-22
- **Decision:** Optimise for phones (most visitors arrive via a WhatsApp link). The header gets a **CSS-first mobile menu** (`<details>`/`<summary>`) shown below `lg`; it contains section links plus WhatsApp/Call CTAs. A ~10-line inline module script closes the menu after a link tap or an outside tap (progressive enhancement — the menu works without JS). Tap targets, spacing, the language toggle, and the floating WhatsApp button's clearance were tuned for small screens.
- **Rationale:** Full navigation without shipping a framework; the FAB and menu keep key actions thumb-reachable.
- **Alternatives:** A client-side framework menu (rejected: heavy); no mobile nav (rejected: navigation gap).

## D-023 — Pitch-enhancement features

- **Date:** 2026-09-22
- **Decision:** Add four value features to the concept, all mobile-first and fully localized:
  1. **Price estimator** (`Estimator.astro`, `#estimator`): per-item quantity steppers, a live total, and a WhatsApp link pre-filled with the itemised breakdown. Built as a small vanilla-TS island and degrades gracefully (generic WhatsApp message without JS).
  2. **Care guide section** (`Care.astro`, `#care`): stain/care tips on the homepage, linked from the desktop header, the mobile menu, and the footer. Originally a standalone page (`/care`, `/si/care`, `/ta/care`); **consolidated into the one-pager** on request so everything lives on one page (no duplicate content).
  3. **Service area** (`ServiceArea.astro`, `#area`): a covered-areas checklist plus an "is my area covered?" lookup with a live covered / not-covered message.
  4. **Trust**: a static "4.9 on Google" badge linking to `contact.reviewsUrl`, and a prominent same-day / 24-hour express badge in the hero.
- **Rationale:** Concrete, memorable features sharpen the pitch and show owners what customers gain.
- **Notes:** Live Google reviews would require a billed Google Places API key — deliberately avoided. New section toggles `estimator`, `care`, and `area` were added to `site.config.ts`.
- **Alternatives:** Static pricing only (rejected: estimator is the standout); live reviews (deferred to client projects where an API key is acceptable).

## D-024 — Header/hero polish and single-green CTA rule

- **Date:** 2026-09-22
- **Decision:**
  - **Header nav** shows only a conversion-focused set — **Services, Pricing, Estimate, Contact** (`primaryNavSections`). **Reviews, FAQ, Care, and Service area** are removed from the primary bar and remain in the **footer** (`navSections`, the full set).
  - The **language switch** sits flush right behind a thin vertical divider.
  - **Hero** drops the duplicate three-item checkmark list (those points already appear in the feature cards); the primary CTA uses the **brand colour**.
  - **Green is reserved for the floating WhatsApp button only** — all other WhatsApp CTAs use the brand colour. The `whatsapp` Button variant was removed.
  - The three hero feature cards share padding, radius, and icon-badge sizing; the lead card gets a decorative van graphic for balance.
- **Rationale:** Fewer competing CTAs, clearer hierarchy, less visual redundancy, and a single, unmistakable green action.
- **Alternatives:** Keep all sections in the header (rejected: clutter); green on every WhatsApp CTA (rejected: competing focus).

## D-025 — Embedded Google Map (configurable)

- **Date:** 2026-09-22
- **Decision:** Replace the decorative map placeholder with a real **Google Maps embed** driven by `contact.mapEmbedUrl` (keyless `…&output=embed`). The old decorative graphic stays underneath as a graceful fallback and shows if `mapEmbedUrl` is blank or the iframe fails to load.
- **Rationale:** A real map demonstrates the value and shows exactly where the map will sit, while remaining a per-client config value.
- **Notes:** The embed lazy-loads third-party content from Google (no API key needed). Client sites can set a place-specific embed URL or clear the field to hide the map.

---

## Open questions

- Domain naming convention for client Workers (e.g. `<slug>.workers.dev` vs custom domain).
- Whether to add PR preview deployments via GitHub Actions later.
- When (and for which clients) to enable the optional email adapter.
- Native-speaker review of the demo Sinhala/Tamil translations before pitching.
