export const site = {
  name: "HomePower+",
  legalName: "HomePower+",
  tagline: "Das Plus für Ihr Zuhause",
  description:
    "Elektroinstallation mit Schwerpunkt Smart Home, Netzwerktechnik und Sicherheitstechnik aus Geiselwind, für Würzburg, Kitzingen und Umgebung.",
  url: "https://homepowerplus.de",
  email: "info@homepp.de",
  phone: "+49 9556 9217717",
  phoneHref: "+4995569217717",
  street: "Langäcker 15",
  postalCode: "96160",
  city: "Geiselwind",
  country: "DE",
  geo: { lat: 49.7717, lng: 10.4711 },
  // Nur Orte, die die alte Seite bereits öffentlich nannte - keine erweiterten
  // Einsatzgebiete erfinden, die wettbewerbsrechtlich angreifbar wären.
  areaServed: ["Geiselwind", "Würzburg", "Kitzingen"],
  openingHours: "Termine nach Vereinbarung",
} as const;

/**
 * Anbieterkennzeichnung (§ 5 DDG) und Angaben für die Datenschutzerklärung.
 * Firmensitz und ladungsfähige Anschrift sind Langäcker 15, Geiselwind.
 */
export const legal = {
  provider: {
    name: "Johannes Schäfer",
    street: "Langäcker 15",
    postalCode: "96160",
    city: "Geiselwind",
    country: "Deutschland",
  },

  /** Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV */
  contentResponsible: "Johannes Schäfer",

  /**
   * Berufsrechtliche Angaben (§ 5 Abs. 1 Nr. 5 DDG).
   * Das Elektrotechnikerhandwerk ist nach Anlage A HwO zulassungspflichtig -
   * deshalb gehören Kammer, Berufsbezeichnung und Verleihungsstaat ins Impressum.
   */
  chamber: "Handwerkskammer für Unterfranken, Rennweger Ring 3, 97070 Würzburg",
  jobTitle: "Elektrotechnikermeister",
  jobTitleState: "Deutschland",
  professionalRules: "Gesetz zur Ordnung des Handwerks (Handwerksordnung, HwO)",

  /**
   * § 5 Abs. 1 Nr. 6 DDG verlangt die USt-IdNr. nur, soweit vorhanden.
   * Als Kleinunternehmer nach § 19 UStG wird keine USt-Id ausgewiesen -
   * stattdessen steht der Hinweis im Impressum.
   */
  vatId: "",
  smallBusinessNote:
    "Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer berechnet; eine Umsatzsteuer-Identifikationsnummer wird nicht ausgewiesen.",

  /**
   * Hosting-Anbieter für die Datenschutzerklärung. Bleibt das Feld leer, nennt
   * die Erklärung die Kategorie statt des Namens - das genügt Art. 13 Abs. 1
   * lit. e DSGVO ("Empfänger oder Kategorien von Empfängern").
   */
  hostingProvider: "",

  /**
   * Datenschutz-Aufsichtsbehörde richtet sich nach dem Firmensitz
   * (Geiselwind, Bayern) → Bayerisches Landesamt für Datenschutzaufsicht.
   */
  dataProtectionAuthority: {
    name: "Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)",
    address: "Promenade 18, 91522 Ansbach",
  },

  lastUpdated: "2026-08-03",
} as const;

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
  | "home"
  | "wifi"
  | "shield"
  | "server"
  | "gauge"
  | "cube"
  | "spark"
  | "bolt";

export const services: Service[] = [
  {
    slug: "smart-home",
    title: "Smart Home",
    teaser: "Ein System. Alles im Griff.",
    description:
      "Smart-Home-Systeme mit Home Assistant, KNX und Shelly: lokal, schnell und ohne Cloud-Zwang. Inklusive Energievisualisierung, Automationen und Lademanagement.",
    bullets: [
      "Home Assistant, KNX und Shelly",
      "Licht, Heizung, Beschattung und Szenen",
      "Energievisualisierung und Automationen",
      "Lademanagement angebunden an PV und Wallbox",
    ],
    icon: "home",
    accent: "brand",
  },
  {
    slug: "ki-loesungen",
    title: "KI-Lösungen",
    teaser: "Automationen, die mitdenken.",
    description:
      "Lokale KI-Heimserver, individuell gebaut: von NVIDIA DGX Spark bis Mac mini oder Mac Studio, je nach Leistung, Datenschutz und Budget. Angebunden an Dein Smart Home, nicht als Cloud-Spielerei.",
    bullets: [
      "Individueller KI-Heimserver nach Anforderung",
      "NVIDIA DGX Spark, Mac mini oder Mac Studio",
      "Sprache, Muster und Routinen lokal im Haus",
      "Anbindung an Home Assistant und vorhandene Geräte",
    ],
    icon: "spark",
    accent: "volt",
  },
  {
    slug: "netzwerk-wlan",
    title: "Netzwerk & UniFi",
    teaser: "Das komplette UniFi-Portfolio.",
    description:
      "Ubiquiti UniFi durchgängig: Netzwerk, WLAN, Switching, Routing, Protect-Kameras, Zutritt, Türsprechanlagen, USV, NAS/UNAS und bei Bedarf UniFi-Server. Alles aus einer Hand geplant und betrieben.",
    bullets: [
      "WLAN, Switching, Routing und VLANs",
      "UniFi Protect, Access und Türsprechanlagen",
      "USV, UNAS/NAS und UniFi-Server",
      "Ausleuchtung, Monitoring und Fernwartung",
    ],
    icon: "wifi",
    accent: "volt",
  },
  {
    slug: "sicherheitstechnik",
    title: "Sicherheitstechnik",
    teaser: "Sehen, was zuhause passiert.",
    description:
      "Einbruchmeldeanlagen mit Telenot und Daitem, Video mit UniFi Protect oder Hikvision. Datenschutzkonform geplant, mit EMA-Wartung und sauber angebunden.",
    bullets: [
      "EMA inkl. Wartung: Telenot und Daitem",
      "Video: UniFi Protect oder Hikvision",
      "Zutritt und Türsprechanlagen (UniFi Access)",
      "DSGVO-konforme Planung",
    ],
    icon: "shield",
    accent: "brand",
  },
  {
    slug: "ladeinfrastruktur",
    title: "Ladeinfrastruktur",
    teaser: "Laden, das zum Haus passt.",
    description:
      "Wallboxen und PV-Überschussladen mit openWB, KEBA und MENNEKES, ergänzt um UniFi für Netzwerk, Zugang, Kameras und WLAN an den Ladepunkten.",
    bullets: [
      "openWB für PV-Überschussladen und offene Integration",
      "KEBA für Privat und Gewerbe",
      "MENNEKES für Premium, MFH und Firmen",
      "UniFi an Ladepunkten: Netz, Zugang, Kamera, WLAN",
    ],
    icon: "bolt",
    accent: "signal",
  },
  {
    slug: "edv-datentechnik",
    title: "EDV, Web & IT",
    teaser: "Kleine Systeme, sauber betreut.",
    description:
      "Websites und IT-Verwaltung im überschaubaren Maßstab: Domains, Hosting, Pflege und laufende Betreuung, dazu Synology-NAS, Backups und Telefonanlagen mit AGFEO.",
    bullets: [
      "Websites einrichten, hosten und pflegen",
      "Domains, Webspace, Server und IT-Verwaltung",
      "Synology: NAS, Backup, Monitoring, Surveillance",
      "AGFEO Telefonanlagen, Mitel optional",
    ],
    icon: "server",
    accent: "volt",
  },
  {
    slug: "vde-messungen",
    title: "Messungen & Prüfung",
    teaser: "Sicherheit mit Protokoll.",
    description:
      "VDE-, DGUV-, EDV- und LWL-Messungen, inklusive vollständiger Prüfprotokolle für Versicherung, Arbeitgeber und Vermieter.",
    bullets: [
      "E-Check & Prüfungen nach DIN VDE",
      "DGUV-Prüfungen ortsveränderlicher Geräte",
      "EDV- und LWL-/Glasfasermessungen",
      "Digitale Protokolle als PDF",
    ],
    icon: "gauge",
    accent: "signal",
  },
  {
    slug: "3d-druck",
    title: "3D-Druck & Sonderteile",
    teaser: "Wenn es das Teil nicht gibt.",
    description:
      "Individuelle 3D-Druck-Lösungen für Halterungen und Gehäuse, konstruiert und gedruckt, passgenau für Deine Hardware.",
    bullets: [
      "Sensor- und Kamerahalterungen",
      "Gehäuse für Elektronik & Hutschiene",
      "Konstruktion nach Maß",
      "Prototyp bis Kleinserie",
    ],
    icon: "cube",
    accent: "signal",
  },
];

/**
 * Vertrauenspunkte ohne erfundene Kennzahlen. Zahlen wie „10+ Jahre“ oder
 * „250+ Automationen“ standen auf der alten Seite nicht und wären nach § 5 UWG
 * angreifbar, solange sie nicht belegt sind.
 */
export const stats = [
  { title: "Region", label: "Geiselwind, Würzburg und Kitzingen" },
  { title: "Rückmeldung", label: "innerhalb eines Werktages" },
  { title: "Systeme", label: "lokal betreibbar, ohne Cloud-Zwang" },
  { title: "Material", label: "Markenware aus dem Fachgroßhandel" },
];

export const process = [
  {
    step: "01",
    title: "Kennenlernen",
    text: "Wir sprechen über Dein Vorhaben, am Telefon oder direkt vor Ort. Unverbindlich und ohne Fachchinesisch.",
  },
  {
    step: "02",
    title: "Planung",
    text: "Du bekommst ein Konzept mit Komponenten, Aufwand und einem klaren Angebot. Mit Optionen, die Du verstehen kannst.",
  },
  {
    step: "03",
    title: "Umsetzung",
    text: "Installation, Konfiguration und Test: sauber, termintreu und mit Rücksicht auf Deine Wände und Nerven.",
  },
  {
    step: "04",
    title: "Übergabe & Support",
    text: "Einweisung, Dokumentation und ein Ansprechpartner, der auch nach der Rechnung noch ans Telefon geht.",
  },
];

/**
 * Hersteller und Systeme aus dem realen Portfolio (Angabe des Betreibers).
 * Keine Großhändler - die sind Einkauf, keine Leistung.
 */
export const techStack = [
  "Home Assistant",
  "KNX",
  "Shelly",
  "Ubiquiti UniFi",
  "Telenot",
  "Daitem",
  "Hikvision",
  "Synology",
  "AGFEO",
  "openWB",
  "KEBA",
  "MENNEKES",
];

export const faqs = [
  {
    q: "Was macht HomePower+ besonders?",
    a: "HomePower+ ist Elektroinstallation mit Schwerpunkt Smart Home, Netzwerktechnik und Sicherheitstechnik. Von UniFi und EMA über Wallboxen und PV-Überschussladen bis zu lokalem KI-Server, kleiner IT- und Website-Betreuung und Messungen.",
  },
  {
    q: "Werden die Dienstleistungen nur in Geiselwind angeboten?",
    a: "Unser mobiler Service umfasst die Region Geiselwind, Würzburg und Kitzingen. Wir kommen zu Dir, egal ob Neubau oder Sanierung.",
  },
  {
    q: "Wie kann ich einen Termin für eine Beratung vereinbaren?",
    a: "Am einfachsten über das Kontaktformular auf dieser Seite. Alternativ erreichst Du uns per Telefon oder E-Mail. Wir melden uns innerhalb eines Werktages zurück.",
  },
  {
    q: "Welche Smart-Home-Systeme werden unterstützt?",
    a: "Schwerpunkt sind Home Assistant, Shelly und KNX, inklusive Energievisualisierung, Automationen und Lademanagement. Dazu kommen UniFi, Sicherheitstechnik und Wallboxen, die wir sauber anbinden.",
  },
  {
    q: "Funktioniert das Smart Home auch ohne Internet?",
    a: "Ja. Wir setzen bewusst auf lokale Systeme wie Home Assistant und KNX. Licht, Heizung und Rollläden laufen weiter, auch wenn die Leitung mal ausfällt oder ein Hersteller seinen Cloud-Dienst abschaltet.",
  },
  {
    q: "Bietet ihr Garantie auf eure Arbeiten an?",
    a: "Ja, wir stehen hinter unserer Arbeit. Auf alle durchgeführten Installationen und Dienstleistungen gewähren wir die gesetzliche Gewährleistung. Die Zufriedenheit unserer Kunden hat höchste Priorität.",
  },
  {
    q: "Sind die Materialien von hoher Qualität?",
    a: "Ja. Wir setzen auf Markenware aus dem Fachgroßhandel und wählen Komponenten danach aus, was im Einsatz zuverlässig bleibt, nicht danach, was gerade im Angebot steht.",
  },
];

export const navLinks = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];
