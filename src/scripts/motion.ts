import { initEnergyField } from "./energy-field";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ *
 * Scroll-Reveal
 * ------------------------------------------------------------------ */
function initReveal() {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );

  items.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ *
 * Spotlight: Maus-Position als CSS-Variablen an die Karte geben
 * ------------------------------------------------------------------ */
function initSpotlight() {
  const cards = document.querySelectorAll<HTMLElement>(".spotlight");
  if (!cards.length || window.matchMedia("(hover: none)").matches) return;

  for (const card of cards) {
    card.addEventListener(
      "pointermove",
      (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      },
      { passive: true },
    );
  }
}

/* ------------------------------------------------------------------ *
 * Magnetische Buttons
 * ------------------------------------------------------------------ */
function initMagnetic() {
  if (prefersReducedMotion() || window.matchMedia("(hover: none)").matches) return;

  const targets = document.querySelectorAll<HTMLElement>("[data-magnetic]");
  for (const el of targets) {
    const strength = Number(el.dataset.magneticStrength ?? 0.28);

    el.addEventListener(
      "pointermove",
      (e) => {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      },
      { passive: true },
    );

    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform .5s cubic-bezier(.34,1.56,.64,1)";
      el.style.transform = "translate3d(0,0,0)";
      window.setTimeout(() => (el.style.transition = ""), 500);
    });
  }
}

/* ------------------------------------------------------------------ *
 * Zahlen hochzählen, sobald sichtbar
 * ------------------------------------------------------------------ */
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>("[data-counter]");
  if (!counters.length) return;

  const render = (el: HTMLElement, value: number) => {
    el.textContent = new Intl.NumberFormat("de-DE").format(Math.round(value));
  };

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    counters.forEach((el) => render(el, Number(el.dataset.counter ?? 0)));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);

        const target = Number(el.dataset.counter ?? 0);
        const duration = 1600;
        const start = performance.now();

        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          // easeOutExpo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          render(el, target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.4 },
  );

  counters.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------ *
 * Navigation: Hintergrund beim Scrollen, Mobile-Menü, aktiver Abschnitt
 * ------------------------------------------------------------------ */
function initNav() {
  const bar = document.querySelector<HTMLElement>("[data-nav-bar]");
  if (bar) {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(sentinel);

    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) bar.removeAttribute("data-stuck");
        else bar.setAttribute("data-stuck", "");
      },
      { threshold: 0 },
    ).observe(sentinel);
  }

  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const iconOpen = document.querySelector<SVGPathElement>("[data-menu-icon-open]");
  const iconClose = document.querySelector<SVGPathElement>("[data-menu-icon-close]");
  if (!toggle || !menu) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menu.style.gridTemplateRows = open ? "1fr" : "0fr";
    iconOpen?.classList.toggle("hidden", open);
    iconClose?.classList.toggle("hidden", !open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () =>
    setOpen(toggle.getAttribute("aria-expanded") !== "true"),
  );

  document
    .querySelectorAll("[data-mobile-link]")
    .forEach((link) => link.addEventListener("click", () => setOpen(false)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ------------------------------------------------------------------ *
 * Onepager: Navigation zeigt den Abschnitt, in dem man gerade steht
 * ------------------------------------------------------------------ */
function initActiveSection() {
  const links = [
    ...document.querySelectorAll<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]'),
  ].filter((link) => link.closest("header"));
  if (!links.length) return;

  const byId = new Map<string, HTMLAnchorElement[]>();
  for (const link of links) {
    const id = link.getAttribute("href")?.split("#")[1];
    if (!id) continue;
    byId.set(id, [...(byId.get(id) ?? []), link]);
  }

  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!sections.length) return;

  let active = "";
  const setActive = (id: string) => {
    if (id === active) return;
    active = id;
    for (const [sectionId, sectionLinks] of byId) {
      for (const link of sectionLinks) {
        const on = sectionId === id;
        link.classList.toggle("text-ink-50", on);
        link.classList.toggle("text-ink-400", !on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      }
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    // Der Streifen liegt knapp unter der Navigationsleiste, damit der
    // Abschnitt wechselt, sobald seine Überschrift oben ankommt.
    { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
  );

  sections.forEach((section) => io.observe(section));
}

/* ------------------------------------------------------------------ *
 * Scroll-Fortschritt unter der Navigationsleiste
 * ------------------------------------------------------------------ */
function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* ------------------------------------------------------------------ *
 * FAQ-Akkordeon: immer nur eine Antwort offen
 * ------------------------------------------------------------------ */
function initAccordion() {
  const group = document.querySelectorAll<HTMLDetailsElement>("[data-faq] details");
  for (const item of group) {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      group.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  }
}

/* ------------------------------------------------------------------ *
 * Hero-Canvas
 * ------------------------------------------------------------------ */
function initHero() {
  const canvas = document.querySelector<HTMLCanvasElement>("[data-energy-field]");
  if (canvas) initEnergyField(canvas);
}

/* ------------------------------------------------------------------ *
 * Sanfter Parallax für dekorative Ebenen
 * ------------------------------------------------------------------ */
function initParallax() {
  const layers = document.querySelectorAll<HTMLElement>("[data-parallax]");
  if (!layers.length || prefersReducedMotion()) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    for (const layer of layers) {
      const rect = layer.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      const speed = Number(layer.dataset.parallax || 0.08);
      const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
      layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

function boot() {
  initNav();
  initActiveSection();
  initScrollProgress();
  initReveal();
  initSpotlight();
  initMagnetic();
  initCounters();
  initAccordion();
  initHero();
  initParallax();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
