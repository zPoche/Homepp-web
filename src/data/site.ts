export const site = {
  name: "HomePower+",
  legalName: "HomePower+",
  tagline: "Das Plus für Dein Zuhause",
  description:
    "Smart Home, Netzwerk, Sicherheitstechnik und Elektroinstallation aus Geiselwind – für Würzburg, Kitzingen, Schweinfurt und Umgebung.",
  url: "https://homepowerplus.de",
  email: "info@homepp.de",
  phone: "+49 9556 9217717",
  phoneHref: "+4995569217717",
  street: "Langäcker 15",
  postalCode: "96160",
  city: "Geiselwind",
  country: "DE",
  geo: { lat: 49.7717, lng: 10.4711 },
  areaServed: [
    "Geiselwind",
    "Würzburg",
    "Kitzingen",
    "Schweinfurt",
    "Bamberg",
    "Neustadt a. d. Aisch",
  ],
  openingHours: "Mo–Fr 08:00–17:00 Uhr, Termine nach Vereinbarung",
} as const;

/**
 * Pflichtangaben für Impressum (§ 5 DDG) und Datenschutzerklärung.
 * TODO_IMPRESSUM markiert Werte, die nirgends öffentlich hinterlegt sind und
 * vom Betreiber selbst ergänzt werden müssen, bevor die Seite live geht.
 */
export const legal = {
  representative: "TODO_IMPRESSUM: Vor- und Nachname des Inhabers",
  vatId: "TODO_IMPRESSUM: USt-IdNr. gem. § 27a UStG (oder Kleinunternehmer-Hinweis)",
  chamber: "TODO_IMPRESSUM: Zuständige Handwerkskammer",
  jobTitle: "TODO_IMPRESSUM: Gesetzliche Berufsbezeichnung und Verleihungsstaat",
  supervisoryAuthority: "TODO_IMPRESSUM: Zuständige Aufsichtsbehörde",
  contentResponsible: "TODO_IMPRESSUM: Verantwortlich i. S. d. § 18 Abs. 2 MStV",
  lastUpdated: "2026-08-02",
} as const;

/** Ist ein Wert noch ein unausgefüllter Platzhalter? */
export const isTodo = (value: string) => value.startsWith("TODO_IMPRESSUM");

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
  "home" | "wifi" | "shield" | "server" | "gauge" | "cube" | "spark";

export const services: Service[] = [
  {
    slug: "smart-home",
    title: "Smart Home",
    teaser: "Ein System. Alles im Griff.",
    description:
      "Wir planen und installieren Smart-Home-Systeme, die wirklich zusammenspielen – lokal, schnell und ohne Cloud-Zwang. Steuerung per App, Taster oder Sprache.",
    bullets: [
      "Home Assistant, KNX, Shelly & Zigbee",
      "Licht-, Heizungs- und Beschattungssteuerung",
      "Szenen & Automationen nach Deinem Alltag",
      "Lokal statt Cloud – läuft auch ohne Internet",
    ],
    icon: "home",
    accent: "brand",
  },
  {
    slug: "netzwerk-wlan",
    title: "Netzwerk & WLAN",
    teaser: "WLAN, das überall funktioniert.",
    description:
      "Professionelle Netzwerke mit Ubiquiti UniFi – von der Ausleuchtungsplanung über die Verkabelung bis zum getrennten Gäste- und IoT-Netz.",
    bullets: [
      "UniFi Access Points, Switches & Gateways",
      "WLAN-Ausleuchtung für jeden Winkel",
      "VLANs für Gäste, IoT und Büro",
      "Monitoring & Fernwartung auf Wunsch",
    ],
    icon: "wifi",
    accent: "volt",
  },
  {
    slug: "sicherheitstechnik",
    title: "Sicherheitstechnik",
    teaser: "Sehen, was zuhause passiert.",
    description:
      "Videoüberwachung, Alarmanlagen und Zutrittskontrolle – datenschutzkonform geplant und sauber ins Smart Home integriert.",
    bullets: [
      "Videoüberwachung mit lokaler Aufzeichnung",
      "Alarmanlagen & Sensorik",
      "Zutrittskontrolle und Türsprechanlagen",
      "DSGVO-konforme Planung",
    ],
    icon: "shield",
    accent: "brand",
  },
  {
    slug: "edv-datentechnik",
    title: "EDV & Datentechnik",
    teaser: "Die Basis für alles Weitere.",
    description:
      "Strukturierte Verkabelung, Serverschränke und individuelle PC- bzw. Server-Lösungen – sauber dokumentiert und zukunftssicher dimensioniert.",
    bullets: [
      "Strukturierte Verkabelung Cat.6A / Glasfaser",
      "Patchfelder & Schrankaufbau",
      "NAS-, Server- und Backup-Konzepte",
      "Messprotokolle für jede Strecke",
    ],
    icon: "server",
    accent: "volt",
  },
  {
    slug: "vde-messungen",
    title: "VDE-Messungen",
    teaser: "Sicherheit mit Protokoll.",
    description:
      "Prüfung ortsfester und ortsveränderlicher Anlagen nach DIN VDE – inklusive vollständiger Prüfprotokolle für Versicherung und Vermieter.",
    bullets: [
      "E-Check & Erstprüfung nach DIN VDE 0100-600",
      "Wiederholungsprüfung nach DIN VDE 0105-100",
      "Geräteprüfung nach DIN VDE 0701-0702",
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
      "Halterungen, Gehäuse und Adapter, die es so nicht zu kaufen gibt – konstruiert und gedruckt, passgenau für Deine Hardware.",
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

export const stats = [
  { value: 10, suffix: "+", label: "Jahre Erfahrung in der Elektrotechnik" },
  { value: 250, suffix: "+", label: "Umgesetzte Automationen & Szenen" },
  { value: 60, suffix: " km", label: "Einsatzradius rund um Geiselwind" },
  { value: 24, suffix: " h", label: "Rückmeldung auf jede Anfrage" },
];

export const process = [
  {
    step: "01",
    title: "Kennenlernen",
    text: "Wir sprechen über Dein Vorhaben – am Telefon, per Video oder direkt vor Ort. Kostenlos und unverbindlich.",
  },
  {
    step: "02",
    title: "Planung",
    text: "Du bekommst ein Konzept mit Komponenten, Aufwand und Festpreis. Ohne Fachchinesisch, dafür mit klaren Optionen.",
  },
  {
    step: "03",
    title: "Umsetzung",
    text: "Installation, Konfiguration und Test – sauber, termintreu und mit Rücksicht auf Deine Wände und Nerven.",
  },
  {
    step: "04",
    title: "Übergabe & Support",
    text: "Einweisung, Dokumentation und ein Ansprechpartner, der auch nach der Rechnung noch ans Telefon geht.",
  },
];

export const techStack = [
  "Home Assistant",
  "KNX",
  "Shelly",
  "Ubiquiti UniFi",
  "Zigbee",
  "Matter",
  "Reolink",
  "Sonepar",
  "Yesss Elektro",
  "Proxmox",
  "ESPHome",
  "Grafana",
];

export const faqs = [
  {
    q: "Was macht HomePower+ anders als einen klassischen Elektriker?",
    a: "Wir kommen aus der Elektrotechnik und aus der IT. Das heißt: Wir ziehen nicht nur die Leitung, sondern bringen das System danach auch zum Laufen – vom Netzwerk über die Automation bis zur Kamera.",
  },
  {
    q: "In welchem Umkreis seid ihr unterwegs?",
    a: "Unser Einsatzgebiet umfasst Geiselwind, Würzburg, Kitzingen, Schweinfurt und Bamberg – rund 60 km rund um unseren Standort. Bei größeren Projekten kommen wir auch weiter raus, sprich uns einfach an.",
  },
  {
    q: "Funktioniert das Smart Home auch ohne Internet?",
    a: "Ja. Wir setzen bewusst auf lokale Systeme wie Home Assistant und KNX. Licht, Heizung und Rollläden laufen weiter, auch wenn die Leitung mal ausfällt oder ein Hersteller seinen Cloud-Dienst abschaltet.",
  },
  {
    q: "Kann ich mein bestehendes System übernehmen?",
    a: "In den meisten Fällen ja. Wir schauen uns an, was Du bereits hast, und binden vorhandene Komponenten ein, statt alles auszutauschen. Erst wenn etwas wirklich im Weg steht, empfehlen wir einen Wechsel.",
  },
  {
    q: "Was kostet ein Smart Home?",
    a: "Das hängt vom Umfang ab. Eine einzelne Lichtsteuerung startet im dreistelligen Bereich, ein durchgeplantes Neubauprojekt liegt deutlich darüber. Nach dem Erstgespräch bekommst Du ein Angebot mit Festpreis – ohne Überraschungen auf der Rechnung.",
  },
  {
    q: "Gibt es Garantie auf die Arbeiten?",
    a: "Ja. Auf alle durchgeführten Installationen und Dienstleistungen gewähren wir die gesetzliche Gewährleistung. Material beziehen wir über etablierte Großhändler wie Sonepar und Yesss Elektro.",
  },
  {
    q: "Übernehmt ihr auch nur Teilbereiche?",
    a: "Klar. Ob nur die WLAN-Ausleuchtung, eine VDE-Messung oder eine einzelne Automation – wir übernehmen auch kleine Aufträge und arbeiten mit Deinem bestehenden Handwerker zusammen.",
  },
];

export const navLinks = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];
