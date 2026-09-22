import type { APIRoute } from 'astro';
import siteConfig from '../../site.config';

export const GET: APIRoute = ({ site }) => {
  const headers = { 'Content-Type': 'text/plain; charset=utf-8' };

  if (!siteConfig.indexable) {
    return new Response('User-agent: *\nDisallow: /\n', { headers });
  }

  const sitemap = new URL('sitemap-index.xml', site ?? siteConfig.url).href;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers });
};
