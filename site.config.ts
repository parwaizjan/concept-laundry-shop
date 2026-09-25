/**
 * Per-client configuration — the single source of truth for branding,
 * contact details, locales, theme, and section visibility.
 *
 * This file is rewritten by `pnpm setup` (scripts/setup.mjs). Keep it
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
  sections: SiteSection;
}

const siteConfig: SiteConfig = {
  url: 'https://demo-laundry.zuvo.lk',
  indexable: false,
  brand: {
    name: 'FreshFold Laundry',
    tagline: 'Fresh clothes, delivered to your door.',
    logo: '/logo.svg',
    ogImage: '/og.svg',
  },
  contact: {
    whatsapp: '+94771234567',
    phone: '+94771234567',
    email: 'hello@freshfold.lk',
    address: '123 Temple Road, Nugegoda, Colombo 10250, Sri Lanka',
    mapUrl: 'https://www.google.com/maps?q=Nugegoda,+Colombo',
    mapEmbedUrl: 'https://www.google.com/maps?q=Nugegoda,+Colombo&z=14&output=embed',
    reviewsUrl: 'https://www.google.com/maps?q=Nugegoda,+Colombo',
  },
  locale: {
    default: 'en',
    enabled: ['en', 'si', 'ta'],
  },
  theme: 'fresh-blue',
  currency: 'LKR',
  currencySymbol: 'Rs.',
  sections: {
    hero: true,
    trust: true,
    services: true,
    howItWorks: true,
    pricing: true,
    estimator: true,
    testimonials: true,
    faq: true,
    care: true,
    area: true,
    location: true,
    contact: true,
  },
};

export default siteConfig;
