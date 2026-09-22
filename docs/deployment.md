# Deployment

## Model

- **One central agency Cloudflare account** holds all client Workers and domains.
- Each client site lives in its **own private GitHub repo**, created from the template.
- **Cloudflare Workers Builds** (Git integration) is connected to each repo: push → build → deploy.

## Client spin-up

```sh
gh repo create <client-slug> \
  --template <org>/concept-laundry-shop \
  --private --clone
cd <client-slug>
pnpm install
pnpm setup        # interactive: writes site.config.ts, theme, locales
git push          # triggers Workers Builds
```

Then in Cloudflare:
1. Connect the new repo to a Worker via **Workers Builds** (GitHub App access to the private repo).
2. Set the Worker name (from `wrangler.jsonc`, written by `pnpm setup`).
3. Add any custom domain / route.
4. Add secrets only if the optional email module is enabled.

## `wrangler.jsonc`

The Cloudflare adapter resolves the assets directory automatically (it emits static files to `dist/client/` and redirects `wrangler deploy` to its generated config). The root file only needs:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "<client-slug>",
  "compatibility_date": "<deploy date>",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@astrojs/cloudflare/entrypoints/server",
  "assets": {
    "not_found_handling": "404-page"
  },
  "observability": { "enabled": true }
  // optional, only when email is enabled:
  // "send_email": [{ "name": "EMAIL" }]
}
```

## Push-to-deploy (Workers Builds)

- Build command: `npx astro build`
- Deploy command: `npx wrangler deploy`
- Root directory: repo root
- Secrets/env: configured in the Cloudflare dashboard, never committed.

`pnpm setup` rewrites `"name"` to the client slug. Local dev and preview run on Cloudflare's `workerd` runtime.

## Email (optional, off by default)

The concept is WhatsApp-only. When a client enables email, use **Cloudflare Email Sending**.

### Facts (as of 2026-09)

| Option | Cost | Notes |
|---|---|---|
| Email Routing (inbound) | Free, unlimited | Route inbound mail to Workers/addresses. |
| Email Sending → **verified destination** | **Free on all plans** (incl. free with only Email Routing configured) | Does **not** count toward quota or daily limits. Ideal for notifying the shop owner. |
| Email Sending → arbitrary recipients | **Workers Paid** ($5/mo): 3,000/mo included, then $0.35/1,000 | Required for customer auto-replies. |

Other constraints:
- Domain must use **Cloudflare DNS**; onboard a sending domain in the dashboard (adds SPF/DKIM/DMARC on `cf-bounce`).
- Max **30** domains per zone (Routing + Sending combined).
- Up to **200** verified destination addresses per account.
- Recipients per email: 50. Message size: 5 MiB (25 MiB to verified destinations).

### Enabling it

1. Onboard the client's domain for **Email Sending** in the Cloudflare dashboard.
2. Verify the owner's email as a **destination address**.
3. Set `site.config.ts` to enable the contact form.
4. Deploy; the `api/notify.ts` route sends via `env.EMAIL.send(...)`.
5. Only upgrade to **Workers Paid** if arbitrary-recipient sending (customer replies) is needed.

### Alternatives (if not Cloudflare-native)

- **Resend** — free 3,000/mo, 100/day; needs API key + DNS.
- **Brevo / Amazon SES** — free 300/day / ~$0.10 per 1,000; more setup.
- **Web3Forms** — free 250/mo; zero backend; not Cloudflare-native.

## Secrets

- No secrets belong in the repo.
- Optional email uses a **binding**, not an API key (preferred).
- If a third-party provider is used, store its key as a Cloudflare Worker secret (dashboard) or GitHub Actions secret.

## Search engine visibility

- `site.config.ts → indexable` controls everything: when `false` (the concept default) `BaseLayout` adds `<meta name="robots" content="noindex, nofollow">` and `robots.txt` returns `Disallow: /` with no sitemap; when `true` the site is crawlable and `robots.txt` advertises the absolute sitemap URL.
- The concept needs **no custom domain** — share the `*.workers.dev` URL by WhatsApp or show it on a phone. Set `indexable: true` only for real client deployments.

## DNS / domains

- Custom domains are attached in the Cloudflare dashboard per Worker.
- Workers `.workers.dev` subdomains are acceptable for demos/previews.
- Onboarding a sending domain requires the domain to be on Cloudflare DNS in the agency account.
