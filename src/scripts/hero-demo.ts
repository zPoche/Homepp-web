/**
 * Interaktive Smart-Home-Demo im Hero: Toggles schalten Räume um und
 * aktualisieren Verbrauch/Geräte-Anzeige. Rein lokal, kein Backend.
 */

const root = document.querySelector<HTMLElement>("[data-home-demo]");
if (!root) {
  // Seite ohne Demo
} else {
  const toggles = [...root.querySelectorAll<HTMLButtonElement>("[data-demo-toggle]")];
  const wattEl = root.querySelector<HTMLElement>("[data-demo-watts]");
  const devicesEl = root.querySelector<HTMLElement>("[data-demo-devices]");
  const statusEl = root.querySelector<HTMLElement>("[data-demo-status]");
  const baseDevices = Number(root.dataset.baseDevices ?? "34");

  const refresh = () => {
    let watts = 0;
    let active = 0;

    for (const toggle of toggles) {
      const on = toggle.getAttribute("aria-pressed") === "true";
      const row = toggle.closest<HTMLElement>("[data-demo-row]");
      const detail = row?.querySelector<HTMLElement>("[data-demo-detail]");
      const onText = toggle.dataset.detailOn ?? "";
      const offText = toggle.dataset.detailOff ?? "";
      const load = Number(toggle.dataset.watts ?? "0");

      if (detail) detail.textContent = on ? onText : offText;
      if (on) {
        watts += load;
        active += 1;
      }

      toggle.classList.toggle("bg-brand-400/80", on);
      toggle.classList.toggle("bg-white/12", !on);
      const knob = toggle.querySelector<HTMLElement>("[data-demo-knob]");
      knob?.classList.toggle("translate-x-[1.4rem]", on);
      knob?.classList.toggle("translate-x-[0.15rem]", !on);
    }

    if (wattEl) wattEl.textContent = `${watts} W`;
    if (devicesEl) devicesEl.textContent = String(baseDevices + active);
    if (statusEl) statusEl.textContent = active === 0 ? "Bereit" : "Online";
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
