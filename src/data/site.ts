/**
 * Zentrale Inhaltsquelle für Bootlabs.
 *
 * Firmendaten, Leistungen, FAQ und Prozess gehören hierher – nicht in die
 * Komponenten. Fehlende Angaben bleiben leer und werden dann nicht gerendert;
 * nichts erfinden.
 */
export const site = {
  name: "Bootlabs",
  legalName: "Bootlabs",
  tagline: "",
  description: "Website von Bootlabs.",
  url: "https://bootlabs.de",
  email: "",
  phone: "",
  phoneHref: "",
  street: "",
  postalCode: "",
  city: "",
  country: "DE",
  geo: { lat: 0, lng: 0 },
  areaServed: [] as string[],
  openingHours: "",

  /** Hero-Texte (erste Viewport-Komposition) */
  hero: {
    headline: ["Bootlabs.", "Inhalt folgt."],
    lead: "Die Website wird gerade eingerichtet. Inhalte, Leistungen und Kontaktdaten folgen.",
    primaryCta: { href: "#kontakt", label: "Kontakt" },
    secondaryCta: { href: "#leistungen", label: "Leistungen" },
    trust: [] as { icon: "clock" | "check" | "shield"; text: string }[],
  },

  about: {
    eyebrow: "Über uns",
    title: "Über",
    highlight: "Bootlabs",
    text: "",
    highlights: [] as { title: string; text: string }[],
  },

  servicesIntro: {
    eyebrow: "Leistungen",
    titleBefore: "Leistungen",
    titleHighlight: "",
    titleAfter: "",
    lead: "",
  },

  cta: {
    eyebrow: "Loslegen",
    titleBefore: "Bereit für",
    titleHighlight: "Dein Projekt",
    titleAfter: "?",
    lead: "",
    button: "Kontakt aufnehmen",
  },
};

/**
 * Anbieterkennzeichnung (§ 5 DDG) und Angaben für die Datenschutzerklärung.
 * Werte werden nie erfunden – leere Felder bleiben leer und werden nicht gerendert.
 */
export const legal = {
  provider: {
    name: "",
    street: "",
    postalCode: "",
    city: "",
    country: "Deutschland",
  },

  /** Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV */
  contentResponsible: "",

  chamber: "",
  jobTitle: "",
  jobTitleState: "",
  professionalRules: "",

  vatId: "",
  smallBusinessNote: "",

  hostingProvider: "",

  dataProtectionAuthority: {
    name: "",
    address: "",
  },

  lastUpdated: "2026-08-04",
};

export type Service = {
  slug: string;
  title: string;
  teaser: string;
  description: string;
  bullets: string[];
  icon: IconName;
  accent: "brand" | "volt" | "signal";
};

export type IconName =
  "home" | "wifi" | "shield" | "server" | "gauge" | "cube" | "spark" | "bolt";

/** Leistungen – wird befüllt, sobald die Inhalte vorliegen. */
export const services: Service[] = [];

export const stats: { title: string; label: string }[] = [];

export const process: { step: string; title: string; text: string }[] = [];

/** Hersteller, Tools, Stack – für das Logo-Laufband. */
export const techStack: string[] = [];

export const faqs: { q: string; a: string }[] = [];

/** Navigation spiegelt nur Sektionen, die auch Inhalt haben. */
export const navLinks = [
  ...(services.length ? [{ href: "/#leistungen", label: "Leistungen" }] : []),
  ...(process.length ? [{ href: "/#ablauf", label: "Ablauf" }] : []),
  ...(site.about.text || site.about.highlights.length
    ? [{ href: "/#ueber-uns", label: "Über uns" }]
    : []),
  ...(faqs.length ? [{ href: "/#faq", label: "FAQ" }] : []),
  { href: "/#kontakt", label: "Kontakt" },
];
