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

export const navSections = [
  { id: 'services', key: 'services', configKey: 'services' },
  { id: 'how-it-works', key: 'howItWorks', configKey: 'howItWorks' },
  { id: 'pricing', key: 'pricing', configKey: 'pricing' },
  { id: 'reviews', key: 'reviews', configKey: 'testimonials' },
  { id: 'faq', key: 'faq', configKey: 'faq' },
  { id: 'contact', key: 'contact', configKey: 'contact' },
] as const satisfies ReadonlyArray<{
  id: string;
  key: keyof Messages['nav'];
  configKey: keyof typeof siteConfig.sections;
}>;
