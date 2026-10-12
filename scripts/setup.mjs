#!/usr/bin/env node
/**
 * Interactive client configuration.
 *
 * Run with `pnpm setup` after creating a client repo from the template.
 * Rewrites site.config.ts, picks a theme preset, sets the Worker/repo name,
 * and swaps the demo brand name inside the i18n catalogs.
 *
 * No dependencies: uses node:readline/promises only.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configPath = path.join(root, 'site.config.ts');
const themePath = path.join(root, 'src', 'styles', 'theme.css');
const wranglerPath = path.join(root, 'wrangler.jsonc');
const pkgPath = path.join(root, 'package.json');

const THEMES = ['fresh-blue', 'aqua-teal', 'citrus', 'rose', 'indigo-night', 'emerald-eco'];
const LOCALES = ['en', 'si', 'ta'];
const yes = process.argv.includes('--yes') || process.argv.includes('-y');
const interactive = input.isTTY && !yes;

const rl = interactive ? readline.createInterface({ input, output }) : null;

async function ask(label, fallback) {
  if (!interactive) return fallback;
  const answer = (await rl.question(`${label}${fallback ? ` [${fallback}]` : ''}: `)).trim();
  return answer || fallback;
}

async function askBoolean(label, fallback) {
  if (!interactive) return fallback;
  const answer = (await rl.question(`${label} [${fallback ? 'y' : 'n'}]: `)).trim().toLowerCase();
  if (!answer) return fallback;
  return answer.startsWith('y');
}

function parseCurrent(text) {
  const grab = (re, fallback = '') => (text.match(re)?.[1] ?? fallback).trim();
  const enabledMatch = text.match(/enabled:\s*\[([^\]]*)\]/);
  const enabled = enabledMatch
    ? enabledMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter(Boolean)
    : LOCALES;
  const sectionKeys = [
    'hero',
    'trust',
    'services',
    'howItWorks',
    'pricing',
    'estimator',
    'testimonials',
    'faq',
    'care',
    'area',
    'location',
    'contact',
  ];
  const sections = Object.fromEntries(
    sectionKeys.map((key) => [key, new RegExp(`${key}:\\s*(true|false)`).exec(text)?.[1] !== 'false']),
  );
  return {
    url: grab(/url:\s*'([^']*)'/),
    indexable: text.match(/indexable:\s*(true|false)/)?.[1] !== 'false',
    brandName: grab(/name:\s*'([^']*)'/),
    tagline: grab(/tagline:\s*'([^']*)'/),
    whatsapp: grab(/whatsapp:\s*'([^']*)'/),
    phone: grab(/phone:\s*'([^']*)'/),
    email: grab(/email:\s*'([^']*)'/),
    address: grab(/address:\s*'([^']*)'/),
    mapUrl: grab(/mapUrl:\s*'([^']*)'/),
    mapEmbedUrl: grab(/mapEmbedUrl:\s*'([^']*)'/),
    reviewsUrl: grab(/reviewsUrl:\s*'([^']*)'/),
    defaultLocale: grab(/default:\s*'([^']*)'/, 'en'),
    enabled,
    theme: grab(/theme:\s*'([^']*)'/, 'fresh-blue'),
    currency: grab(/currency:\s*'([^']*)'/, 'LKR'),
    currencySymbol: grab(/currencySymbol:\s*'([^']*)'/, 'Rs.'),
    ribbon: text.match(/ribbon:\s*(true|false)/)?.[1] !== 'false',
    studioName: grab(/studioName:\s*'([^']*)'/),
    studioWhatsapp: grab(/studioWhatsapp:\s*'([^']*)'/),
    demoTag: grab(/\btag:\s*'([^']*)'/, ''),
    sections,
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function pick(options, value, fallback) {
  return options.includes(value) ? value : fallback;
}

function buildConfig(next) {
  const enabled = next.enabled.length ? next.enabled : [next.defaultLocale];
  const sectionLines = Object.entries(next.sections)
    .map(([key, value]) => `    ${key}: ${value},`)
    .join('\n');
  return `/**
 * Per-client configuration — the single source of truth for branding,
 * contact details, locales, theme, and section visibility.
 *
 * This file is rewritten by \`pnpm setup\` (scripts/setup.mjs). Keep it
 * free of imports so it can be read by both Node and Astro.
 */

export type Locale = 'en' | 'si' | 'ta';
export type ThemePreset =
  | 'fresh-blue'
  | 'aqua-teal'
  | 'citrus'
  | 'rose'
  | 'indigo-night'
  | 'emerald-eco';

export interface SiteSection {
  hero: boolean;
  trust: boolean;
  services: boolean;
  howItWorks: boolean;
  pricing: boolean;
  estimator: boolean;
  testimonials: boolean;
  faq: boolean;
  care: boolean;
  area: boolean;
  location: boolean;
  contact: boolean;
}

export interface SiteConfig {
  url: string;
  indexable: boolean;
  brand: {
    name: string;
    tagline: string;
    logo: string;
    ogImage: string;
  };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
    mapUrl: string;
    mapEmbedUrl: string;
    reviewsUrl: string;
  };
  locale: {
    default: Locale;
    enabled: Locale[];
  };
  theme: ThemePreset;
  currency: string;
  currencySymbol: string;
  demo: {
    ribbon: boolean;
    studioName: string;
    studioWhatsapp: string;
    tag: string;
  };
  sections: SiteSection;
}

const siteConfig: SiteConfig = {
  url: '${next.url}',
  indexable: ${next.indexable},
  brand: {
    name: '${next.brandName}',
    tagline: '${next.tagline}',
    logo: '${next.logo}',
    ogImage: '${next.ogImage}',
  },
  contact: {
    whatsapp: '${next.whatsapp}',
    phone: '${next.phone}',
    email: '${next.email}',
    address: '${next.address}',
    mapUrl: '${next.mapUrl}',
    mapEmbedUrl: '${next.mapEmbedUrl}',
    reviewsUrl: '${next.reviewsUrl}',
  },
  locale: {
    default: '${next.defaultLocale}',
    enabled: [${enabled.map((l) => `'${l}'`).join(', ')}],
  },
  theme: '${next.theme}',
  currency: '${next.currency}',
  currencySymbol: '${next.currencySymbol}',
  demo: {
    ribbon: ${next.ribbon},
    studioName: '${next.studioName}',
    studioWhatsapp: '${next.studioWhatsapp}',
    tag: '${next.demoTag}',
  },
  sections: {
${sectionLines}
  },
};

export default siteConfig;
`;
}

async function main() {
  const currentText = await readFile(configPath, 'utf8');
  const existing = parseCurrent(currentText);
  const logoMatch = currentText.match(/logo:\s*'([^']*)'/);
  const ogMatch = currentText.match(/ogImage:\s*'([^']*)'/);
  const logo = logoMatch?.[1] ?? '/logo.svg';
  const ogImage = ogMatch?.[1] ?? '/og.svg';

  output.write('\nLaundry site — client setup\n');
  output.write('===========================\n\n');

  const brandName = await ask('Brand name', existing.brandName);
  const slug = slugify(await ask('Repo / Worker slug', slugify(brandName)));
  const url = await ask('Site URL', existing.url);
  const indexable = await askBoolean('Allow search engines to index this site?', existing.indexable);
  const tagline = await ask('Tagline', existing.tagline);
  const whatsapp = await ask('WhatsApp number (with country code)', existing.whatsapp);
  const phone = await ask('Phone number', existing.phone);
  const email = await ask('Email', existing.email);
  const address = await ask('Address', existing.address);
  const mapUrl = await ask('Google Maps URL', existing.mapUrl);
  const mapEmbedUrl = await ask(
    'Google Maps embed URL (…&output=embed)',
    existing.mapEmbedUrl,
  );
  const reviewsUrl = await ask('Google reviews URL', existing.reviewsUrl || mapUrl);

  const defaultLocale = pick(
    LOCALES,
    await ask(`Default locale (${LOCALES.join('/')})`, existing.defaultLocale),
    existing.defaultLocale,
  );
  const enabledInput = await ask(
    'Enabled locales (comma separated)',
    existing.enabled.join(','),
  );
  const enabled = enabledInput
    .split(',')
    .map((s) => s.trim())
    .filter((l) => LOCALES.includes(l));
  if (!enabled.includes(defaultLocale)) enabled.unshift(defaultLocale);

  const theme = pick(
    THEMES,
    await ask(`Theme (${THEMES.join('/')})`, existing.theme),
    existing.theme,
  );
  const currency = await ask('Currency code', existing.currency);
  const currencySymbol = await ask('Currency symbol', existing.currencySymbol);
  const ribbon = await askBoolean('Show "sample website" demo ribbon?', existing.ribbon);
  const studioName = await ask('Studio name (ribbon notice)', existing.studioName);
  const studioWhatsapp = await ask('Studio WhatsApp (ribbon enquiry)', existing.studioWhatsapp);
  const demoTag = await ask('Demo message tag (blank to disable)', existing.demoTag);

  const next = {
    url,
    indexable,
    brandName,
    tagline,
    whatsapp,
    phone,
    email,
    address,
    mapUrl,
    mapEmbedUrl,
    reviewsUrl,
    defaultLocale,
    enabled,
    theme,
    currency,
    currencySymbol,
    ribbon,
    studioName,
    studioWhatsapp,
    demoTag,
    sections: existing.sections,
    logo,
    ogImage,
  };

  const nextConfig = buildConfig(next);

  // Guard against quoting issues in single-quoted TS strings.
  if (nextConfig.includes("\\'")) {
    output.write('\nWarning: values containing single quotes may need manual fixing.\n');
  }

  await writeFile(configPath, nextConfig, 'utf8');
  await writeFile(
    themePath,
    `/* Active theme preset. Rewritten by \`pnpm setup\` (scripts/setup.mjs). */\n@import './themes/${theme}.css';\n`,
    'utf8',
  );

  if (existsSync(wranglerPath)) {
    const wrangler = await readFile(wranglerPath, 'utf8');
    await writeFile(wranglerPath, wrangler.replace(/"name":\s*"[^"]*"/, `"name": "${slug}"`), 'utf8');
  }

  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    pkg.name = slug;
    await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  }

  // Swap the previous brand name through the locale catalogs (titles etc.).
  if (existing.brandName && existing.brandName !== brandName) {
    for (const locale of LOCALES) {
      const file = path.join(root, 'src', 'i18n', `${locale}.json`);
      if (!existsSync(file)) continue;
      const text = await readFile(file, 'utf8');
      if (text.includes(existing.brandName)) {
        await writeFile(file, text.split(existing.brandName).join(brandName), 'utf8');
      }
    }
  }

  output.write('\nDone.\n');
  output.write(`  Brand:   ${brandName}\n`);
  output.write(`  Slug:    ${slug}\n`);
  output.write(`  Theme:   ${theme}\n`);
  output.write(`  Locales: ${enabled.join(', ')} (default ${defaultLocale})\n\n`);
  output.write('Next steps:\n');
  output.write('  1. pnpm dev        # review the site locally\n');
  output.write('  2. git add -A && git commit -m "Configure client"\n');
  output.write('  3. git push        # Workers Builds deploys on push\n');
  output.write('  4. Update copy in src/i18n/{en,si,ta}.json for real services and pricing.\n\n');

  rl?.close();
}

main().catch((error) => {
  console.error(error);
  rl?.close();
  process.exit(1);
});
