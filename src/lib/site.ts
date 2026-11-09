/**
 * Single source of truth for the Folivio brand, company and contact details.
 * The footer, legal pages and metadata read from here so the identity stays
 * consistent across the site.
 */
export const site = {
  name: "Folivio",
  domain: "folivio.online",
  url: "https://www.folivio.online",
  tagline: "Career intelligence for people who have done the work",
  description:
    "Folivio turns a career into a CV and portfolio that reads well: an AI-assisted studio, editorial templates and intelligence that works from your real experience.",
  company: "Folivio", // "Ivents",
  companyLine: "Folivio", // "Folivio is a product of Ivents.",
  email: "hello@folivio.online",
  location: "Lagos, Nigeria",
  lastUpdated: "4 November 2026",
} as const;
