/**
 * Interaktive Demo im Hero: Toggles schalten Zonen um und aktualisieren
 * die Scharf-Anzeige. Rein lokal, kein Backend.
 */

const root = document.querySelector<HTMLElement>("[data-home-demo]");
if (!root) {
  // Seite ohne Demo
} else {
  const toggles = [...root.querySelectorAll<HTMLButtonElement>("[data-demo-toggle]")];
  const armedEl = root.querySelector<HTMLElement>("[data-demo-armed]");
  const statusEl = root.querySelector<HTMLElement>("[data-demo-status]");

  const refresh = () => {
    let armed = 0;

    for (const toggle of toggles) {
      const on = toggle.getAttribute("aria-pressed") === "true";
      const row = toggle.closest<HTMLElement>("[data-demo-row]");
      const detail = row?.querySelector<HTMLElement>("[data-demo-detail]");
      const onText = toggle.dataset.detailOn ?? "";
      const offText = toggle.dataset.detailOff ?? "";

      if (detail) detail.textContent = on ? onText : offText;
      if (on) armed += 1;

      toggle.classList.toggle("bg-brand-400/80", on);
      toggle.classList.toggle("bg-white/12", !on);
      const knob = toggle.querySelector<HTMLElement>("[data-demo-knob]");
      knob?.classList.toggle("translate-x-[1.7rem]", on);
      knob?.classList.toggle("translate-x-[0.2rem]", !on);
    }

    if (armedEl) armedEl.textContent = String(armed);
    if (statusEl) statusEl.textContent = armed === 0 ? "Bereit" : "Scharf";
  };

  for (const toggle of toggles) {
    toggle.addEventListener("click", () => {
      const on = toggle.getAttribute("aria-pressed") === "true";
      toggle.setAttribute("aria-pressed", on ? "false" : "true");
      refresh();
    });
  }

  refresh();
}
