// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import siteConfig from './site.config.ts';

export default defineConfig({
  site: siteConfig.url,
  session: false,
  i18n: {
    defaultLocale: siteConfig.locale.default,
    locales: [...siteConfig.locale.enabled],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [sitemap()],
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
