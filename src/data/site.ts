export const site = {
  name: "HomePower+",
  legalName: "HomePower+",
  tagline: "Das Plus für Dein Zuhause",
  description:
    "Smart Home, Netzwerk, Sicherheitstechnik und Elektroinstallation aus Geiselwind – für Würzburg, Kitzingen und Umgebung.",
  url: "https://homepowerplus.de",
  email: "info@homepp.de",
  phone: "+49 9556 9217717",
  phoneHref: "+4995569217717",
  street: "Langäcker 15",
  postalCode: "96160",
  city: "Geiselwind",
  country: "DE",
  geo: { lat: 49.7717, lng: 10.4711 },
  // Nur Orte, die die alte Seite bereits öffentlich nannte – keine erweiterten
  // Einsatzgebiete erfinden, die wettbewerbsrechtlich angreifbar wären.
  areaServed: ["Geiselwind", "Würzburg", "Kitzingen"],
  openingHours: "Termine nach Vereinbarung",
} as const;

/**
 * Anbieterkennzeichnung (§ 5 DDG) und Angaben für die Datenschutzerklärung.
 *
 * Firmensitz ist Geiselwind. Die ladungsfähige Anschrift läuft über
 * Online-Impressum.de (c/o) – analog zu avertax.de.
 */
export const legal = {
  provider: {
    name: "Johannes Schäfer",
    /** Ladungsfähige Anschrift über Online-Impressum.de */
    careOf: "c/o Online-Impressum.de #6287",
    street: "Europaring 90",
    postalCode: "53757",
    city: "Sankt Augustin",
    country: "Deutschland",
  },

  /** Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV */
  contentResponsible: "Johannes Schäfer",

  /**
   * Berufsrechtliche Angaben (§ 5 Abs. 1 Nr. 5 DDG).
   * Das Elektrotechnikerhandwerk ist nach Anlage A HwO zulassungspflichtig –
   * deshalb gehören Kammer, Berufsbezeichnung und Verleihungsstaat ins Impressum.
   */
  chamber: "Handwerkskammer für Unterfranken, Rennweger Ring 3, 97070 Würzburg",
  jobTitle: "Elektrotechnikermeister",
  jobTitleState: "Deutschland",
  professionalRules: "Gesetz zur Ordnung des Handwerks (Handwerksordnung – HwO)",

  /**
   * § 5 Abs. 1 Nr. 6 DDG verlangt die USt-IdNr. nur, soweit vorhanden.
   * Als Kleinunternehmer nach § 19 UStG wird keine USt-Id ausgewiesen –
   * stattdessen steht der Hinweis im Impressum.
   */
  vatId: "",
  smallBusinessNote:
    "Kleinunternehmer gemäß § 19 UStG. Es wird keine Umsatzsteuer berechnet; eine Umsatzsteuer-Identifikationsnummer wird nicht ausgewiesen.",

  /**
   * Hosting-Anbieter für die Datenschutzerklärung. Bleibt das Feld leer, nennt
   * die Erklärung die Kategorie statt des Namens – das genügt Art. 13 Abs. 1
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

  lastUpdated: "2026-08-02",
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
  "home" | "wifi" | "shield" | "server" | "gauge" | "cube" | "spark";

export const services: Service[] = [
  {
    slug: "smart-home",
    title: "Smart Home",
    teaser: "Ein System. Alles im Griff.",
    description:
      "Wir planen und installieren Smart-Home-Systeme, die wirklich zusammenspielen – lokal, schnell und ohne Cloud-Zwang. Steuerung per Smartphone, Tablet, Taster oder Sprache.",
    bullets: [
      "Home Assistant, KNX und Shelly",
      "Licht-, Heizungs- und Beschattungssteuerung",
      "Szenen & Automationen nach Deinem Alltag",
      "Lokal statt Cloud – läuft auch ohne Internet",
    ],
    icon: "home",
    accent: "brand",
  },
  {
    slug: "ki-loesungen",
    title: "KI-Lösungen",
    teaser: "Automationen, die mitdenken.",
    description:
      "KI dort einsetzen, wo sie im Haus echten Nutzen bringt: Sprache steuern, Muster erkennen, Routinen vorschlagen – lokal und angebunden an Dein Smart Home, nicht als Spielerei in der Cloud.",
    bullets: [
      "Sprachsteuerung und lokale Assistenten",
      "Intelligente Szenen und Vorschläge aus Deinem Alltag",
      "Anbindung an Home Assistant und vorhandene Geräte",
      "Datenschutzfreundlich – Verarbeitung im Haus, soweit möglich",
    ],
    icon: "spark",
    accent: "volt",
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

/**
 * Vertrauenspunkte ohne erfundene Kennzahlen. Zahlen wie „10+ Jahre“ oder
 * „250+ Automationen“ standen auf der alten Seite nicht und wären nach § 5 UWG
 * angreifbar, solange sie nicht belegt sind.
 */
export const stats = [
  { title: "Region", label: "Geiselwind, Würzburg und Kitzingen" },
  { title: "Rückmeldung", label: "innerhalb eines Werktages" },
  { title: "Systeme", label: "lokal betreibbar, ohne Cloud-Zwang" },
  { title: "Material", label: "über Sonepar und Yesss Elektro" },
];

export const process = [
  {
    step: "01",
    title: "Kennenlernen",
    text: "Wir sprechen über Dein Vorhaben – am Telefon oder direkt vor Ort. Unverbindlich und ohne Fachchinesisch.",
  },
  {
    step: "02",
    title: "Planung",
    text: "Du bekommst ein Konzept mit Komponenten, Aufwand und einem klaren Angebot. Mit Optionen, die Du verstehen kannst.",
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

/** Nur Systeme und Lieferanten, die die alte Seite bereits nannte. */
export const techStack = [
  "Home Assistant",
  "KNX",
  "Shelly",
  "Ubiquiti UniFi",
  "Sonepar",
  "Yesss Elektro",
];

export const faqs = [
  {
    q: "Was macht HomePower+ besonders?",
    a: "HomePower+ bietet maßgeschneiderte Lösungen im Bereich Elektroinstallation, Smart Home und Netzwerktechnik – und bringt das System danach auch zum Laufen, vom Netzwerk über die Automation bis zur Kamera.",
  },
  {
    q: "Werden die Dienstleistungen nur in Geiselwind angeboten?",
    a: "Unser mobiler Service umfasst die Region Geiselwind, Würzburg und Kitzingen. Wir kommen zu Dir, egal ob Neubau oder Sanierung.",
  },
  {
    q: "Wie kann ich einen Termin für eine Beratung vereinbaren?",
    a: "Am einfachsten über das Kontaktformular auf dieser Seite. Alternativ erreichst Du uns per Telefon oder E-Mail – wir melden uns innerhalb eines Werktages zurück.",
  },
  {
    q: "Welche Smart-Home-Systeme werden unterstützt?",
    a: "Wir arbeiten mit verschiedenen Smart-Home-Systemen, darunter Home Assistant, Shelly und KNX. Wir planen und installieren die Systeme, die am besten zu Deinem Zuhause passen.",
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
    a: "Ja. Wir beziehen Materialien von etablierten Großhändlern wie Yesss Elektro und Sonepar. So können wir sicherstellen, dass unsere Kunden immer die besten Produkte erhalten.",
  },
];

export const navLinks = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#kontakt", label: "Kontakt" },
];
