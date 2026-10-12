import type { Locale } from '../../site.config';
import siteConfig from '../../site.config';
import en from './en.json';
import si from './si.json';
import ta from './ta.json';

const catalog = { en, si, ta } as const;

export type Messages = typeof en;
export type LocaleCode = keyof typeof catalog;

export const defaultLocale = siteConfig.locale.default;

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'en' || value === 'si' || value === 'ta';
}

export function useTranslations(locale: Locale = defaultLocale): Messages {
  return catalog[locale as LocaleCode] ?? catalog[defaultLocale as LocaleCode];
}

export function enabledLocales(): Locale[] {
  return siteConfig.locale.enabled.filter(isLocale);
}

export function localeShortName(locale: Locale): string {
  return { en: 'EN', si: 'සිං', ta: 'தமிழ்' }[locale] ?? locale;
}

export function localizedPath(path: string, locale: Locale): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  if (!clean) return prefix ? `${prefix}/` : '/';
  return `${prefix}/${clean}`;
}

export function currentPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (isLocale(segments[0]) && segments[0] !== defaultLocale) segments.shift();
  return segments.join('/');
}

export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(currentPathWithoutLocale(pathname), target);
}

export function whatsappLink(message?: string): string {
  const number = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '');
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(): string {
  return `tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`;
}

/** Prefix applied to every visitor-facing demo message so the studio can tell them apart. */
export const demoTag = siteConfig.demo.tag;

export function withDemoTag(message: string): string {
  return demoTag ? `${demoTag} ${message}` : message;
}

/** WhatsApp link for the demo's own CTAs (tagged). */
export function demoWhatsappLink(message: string): string {
  return whatsappLink(withDemoTag(message));
}

/** WhatsApp link for the ribbon's website enquiry (studio notice, untagged). */
export function studioEnquiryLink(): string {
  const number = siteConfig.demo.studioWhatsapp.replace(/[^0-9]/g, '');
  const message = `Hi ${siteConfig.demo.studioName}, I'd like a website like the ${siteConfig.brand.name} demo for my shop.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const sectionLinks = [
  { id: 'services', key: 'services', configKey: 'services' },
  { id: 'pricing', key: 'pricing', configKey: 'pricing' },
  { id: 'estimator', key: 'estimator', configKey: 'estimator' },
  { id: 'reviews', key: 'reviews', configKey: 'testimonials' },
  { id: 'faq', key: 'faq', configKey: 'faq' },
  { id: 'care', key: 'care', configKey: 'care' },
  { id: 'area', key: 'area', configKey: 'area' },
  { id: 'contact', key: 'contact', configKey: 'contact' },
] as const satisfies ReadonlyArray<{
  id: string;
  key: keyof Messages['nav'];
  configKey: keyof typeof siteConfig.sections;
}>;

/** Full set used in the footer. */
export const navSections = sectionLinks;

/** Conversion-focused subset used in the header. */
export const primaryNavSections = sectionLinks.filter((section) =>
  ['services', 'pricing', 'estimator', 'contact'].includes(section.id),
);
