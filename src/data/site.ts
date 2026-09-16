export const site = {
  name: "HomePower+",
  legalName: "HomePower+",
  tagline: "Alarmanlagen und IT aus einer Hand",
  description:
    "Alarmanlagen, Videoüberwachung und IT aus Geiselwind, für Würzburg, Kitzingen und Umgebung.",
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
  "home" | "wifi" | "shield" | "server" | "gauge" | "cube" | "spark" | "bolt";

export const services: Service[] = [
  {
    slug: "alarmanlagen",
    title: "Alarmanlagen",
    teaser: "Scharf, wenn Du es brauchst.",
    description:
      "Einbruchmeldeanlagen mit Telenot und Daitem: geplant, eingerichtet und gewartet. Melder, Zentrale und Einweisung, ohne unnötige Spielerei.",
    bullets: [
      "EMA inkl. Wartung: Telenot und Daitem",
      "Planung, Einbau und Einweisung",
      "Melder, Zentrale und Bedienung",
      "Markenware aus dem Fachgroßhandel",
    ],
    icon: "shield",
    accent: "brand",
  },
  {
    slug: "video-zutritt",
    title: "Video & Zutritt",
    teaser: "Sehen, wer vor der Tür steht.",
    description:
      "Video mit UniFi Protect oder Hikvision, dazu Zutritt und Türsprechanlagen. Personenerkennung gehört dazu; Kennzeichen- und Gesichtserkennung je nach Kamera und nur, wo das bei Euch zulässig ist. Ansicht und Meldung per App, an die Alarmzentrale angebunden.",
    bullets: [
      "Video: UniFi Protect oder Hikvision",
      "Personenerkennung; Kennzeichen und Gesicht je nach Kamera",
      "Ansicht und Meldung per App",
      "Zutritt und Türsprechanlagen, DSGVO-konform geplant",
    ],
    icon: "home",
    accent: "volt",
  },
  {
    slug: "netzwerk-it",
    title: "Netzwerk & UniFi",
    teaser: "Ein Netz, das trägt.",
    description:
      "Ubiquiti UniFi durchgängig: WLAN, Switching, Routing und VLANs. Ausleuchtung, Monitoring und Fernwartung für Haus und Betrieb.",
    bullets: [
      "WLAN, Switching, Routing und VLANs",
      "Ausleuchtung, Monitoring und Fernwartung",
      "USV, UNAS/NAS und UniFi-Server",
      "Saubere Trennung von Büro, Gästen und Technik",
    ],
    icon: "wifi",
    accent: "volt",
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
    accent: "signal",
  },
];

/**
 * Vertrauenspunkte ohne erfundene Kennzahlen. Zahlen wie „10+ Jahre“ oder
 * „250+ Anlagen“ standen auf der alten Seite nicht und wären nach § 5 UWG
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
    text: "Einrichtung, Konfiguration und Test: sauber, termintreu und mit Rücksicht auf Deine Räume und Nerven.",
  },
  {
    step: "04",
    title: "Übergabe & Support",
    text: "Einweisung, Dokumentation und ein Ansprechpartner, der auch nach der Rechnung noch ans Telefon geht.",
  },
];

/**
 * Hersteller und Systeme aus dem realen Portfolio (Angabe des Betreibers).
 * Nur noch Alarmanlagen, Video und IT - keine Großhändler, kein Smart Home.
 */
export const techStack = [
  "Telenot",
  "Daitem",
  "Ubiquiti UniFi",
  "Hikvision",
  "Synology",
  "AGFEO",
];

export const faqs = [
  {
    q: "Was macht HomePower+?",
    a: "HomePower+ plant, richtet ein und betreut Alarmanlagen und IT. Einbruchmeldeanlagen mit Telenot oder Daitem, Video und Zutritt, UniFi-Netzwerke sowie im kleinen Maßstab Websites, NAS und Telefonanlagen.",
  },
  {
    q: "Werden die Dienstleistungen nur in Geiselwind angeboten?",
    a: "Unser mobiler Service umfasst die Region Geiselwind, Würzburg und Kitzingen. Wir kommen zu Dir, egal ob Neubau oder bestehendes Gebäude.",
  },
  {
    q: "Wie kann ich einen Termin für eine Beratung vereinbaren?",
    a: "Am einfachsten über das Kontaktformular auf dieser Seite. Alternativ erreichst Du uns per Telefon oder E-Mail. Wir melden uns innerhalb eines Werktages zurück.",
  },
  {
    q: "Welche Alarmanlagen setzt ihr ein?",
    a: "Schwerpunkt sind Einbruchmeldeanlagen von Telenot und Daitem, inklusive Wartung. Video kommt von UniFi Protect oder Hikvision, Zutritt über UniFi Access.",
  },
  {
    q: "Läuft die Anlage auch, wenn das Internet weg ist?",
    a: "Ja. Melder, Zentrale und das lokale Netz arbeiten weiter. Was eine Internetverbindung braucht – zum Beispiel eine Push-Nachricht aufs Handy – wartet, bis die Leitung wieder da ist.",
  },
  {
    q: "Bietet ihr Garantie auf eure Arbeiten an?",
    a: "Ja, wir stehen hinter unserer Arbeit. Auf alle durchgeführten Einrichtungen und Dienstleistungen gewähren wir die gesetzliche Gewährleistung. Die Zufriedenheit unserer Kunden hat höchste Priorität.",
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

/**
 * Texte der interaktiven Hero-Demo. Die Demo zeigt, wie eine Anlage
 * reagieren kann – sie ist keine echte Leitstelle und kein Live-Video.
 */
export const demo = {
  label: "Live-Demo",
  title: "So kann eine Anlage reagieren",
  hint: "Tür oder Fenster am Haus antippen. Die Demo läuft lokal im Browser.",
  tabs: {
    alarm: "Alarmanlage",
    video: "Video",
  },
  status: {
    disarmed: "Unscharf",
    armed: "Scharf",
    alarm: "Alarm",
  },
  arm: "Scharfschalten",
  disarm: "Unscharfschalten",
  ack: "Alarm quittieren",
  logEmpty: "Keine Meldungen. Öffne Tür oder Fenster.",
  events: {
    armed: "Anlage scharf",
    disarmed: "Anlage unscharf",
    notReady: "Anlage nicht bereit · Tür oder Fenster noch offen",
    doorOpen: "Haustür geöffnet · Anlage unscharf",
    doorClosed: "Haustür geschlossen",
    windowOpen: "Fenster geöffnet · Anlage unscharf",
    windowClosed: "Fenster geschlossen",
    doorAlarm: "Alarm · Öffnungsmelder Haustür",
    windowAlarm: "Alarm · Öffnungsmelder Fenster",
    notify: "Meldung an Dich / an die Leitstelle – so kann eine Anlage reagieren",
    ack: "Alarm quittiert · Sirene aus",
    person: "Person erkannt · Einfahrt",
    face: "Gesicht erkannt · je nach Kamera, nur wo zulässig",
    plate: "Kennzeichen erkannt · je nach Kamera",
  },
  house: {
    doorOpen: "Tür schließen",
    doorClosed: "Tür öffnen",
    windowOpen: "Fenster schließen",
    windowClosed: "Fenster öffnen",
    sirenIdle: "Sirene bereit",
    sirenAlarm: "Außensirene",
    txIdle: "Übertragung bereit",
    txSending: "Übertragung sendet",
    camera: "Kamera auslösen",
  },
  video: {
    live: "Livebild",
    idle: "Keine Erkennung. Kamera oder Taste antippen.",
    appTitle: "Meldung in der App",
    appIdle: "Keine neue Meldung",
    person: "Person",
    face: "Gesicht",
    plate: "Kennzeichen",
    personOverlay: "Person",
    faceOverlay: "Gesicht",
    plateOverlay: "H-PP 2026",
  },
} as const;
